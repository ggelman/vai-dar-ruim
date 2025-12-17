import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Platform, StatusBar, Vibration, View, Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// --- SISTEMA DE MOCK (SIMULAÇÃO) ROBUSTO ---
// Garante que o app rode no Expo Go mesmo sem as bibliotecas nativas de pagamento
let Purchases, RevenueCatUI, LOG_LEVEL, PAYWALL_RESULT;

try {
    // Tenta carregar as bibliotecas reais
    const rc = require('react-native-purchases');
    const rcUI = require('react-native-purchases-ui');
    
    // Verifica integridade
    if (!rc.default) throw new Error("Purchases core não inicializado");
    
    Purchases = rc.default;
    LOG_LEVEL = rc.LOG_LEVEL;
    RevenueCatUI = rcUI.default || rcUI;
    PAYWALL_RESULT = rcUI.PAYWALL_RESULT;

} catch (e) {
    console.log("[DEV] Modo Expo Go detectado. Ativando Mocks de Pagamento.");
    
    // MOCK: Constantes
    LOG_LEVEL = { VERBOSE: 'VERBOSE', DEBUG: 'DEBUG', ERROR: 'ERROR' };
    PAYWALL_RESULT = {
        NOT_PRESENTED: 'NOT_PRESENTED',
        ERROR: 'ERROR',
        CANCELLED: 'CANCELLED',
        PURCHASED: 'PURCHASED',
        RESTORED: 'RESTORED'
    };

    // MOCK: Core SDK
    Purchases = {
        configure: async () => console.log("[MOCK] Purchases configurado"),
        setLogLevel: () => {},
        getCustomerInfo: async () => ({
            entitlements: { active: {} }, // Retorna usuário sem assinatura
            allExpirationDates: {},
            managementURL: null
        }),
    };

    // MOCK: UI SDK
    RevenueCatUI = {
        presentPaywall: async () => {
            Alert.alert(
                "Modo Desenvolvimento",
                "Compras reais só funcionam em Build Nativa.\nSimulando cancelamento."
            );
            return PAYWALL_RESULT.CANCELLED;
        },
        presentPaywallIfNeeded: async () => PAYWALL_RESULT.NOT_PRESENTED
    };
}
// --- FIM DO BLOCO DE MOCK ---

// Imports do App
import { DB_CONTENT } from '../constants/data';
import { DeckContext } from '../contexts/DeckContext';

import Baralho from '../games/Baralho';
import DesafiosRapidos from '../games/DesafiosRapidos';
import EuNunca from '../games/EuNunca';
import GameWrapper from '../games/GameWrapper';
import GenericGame from '../games/GenericGame';
import ProvavelGame from '../games/ProvavelGame';
import TribunalGame from '../games/TribunalGame';
import VerdadeOuDesafio from '../games/VerdadeOuDesafio';
import Lobby from '../screens/Lobby';
import PartyConfig from '../screens/PartyConfig';
import Playlist from '../screens/Playlist';
import Splash from '../screens/Splash';

const App = () => {
    const [unlockedItems, setUnlockedItems] = useState(['subscription']);
    
    useEffect(() => {
        const setupPurchases = async () => {
            try {
                Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

                const iosApiKey = 'test_ALnaxqmLJkXPYmMgZlBmrNbCXnw';
                const androidApiKey = 'test_ALnaxqmLJkXPYmMgZlBmrNbCXnw';

                if (Platform.OS === 'ios') {
                    await Purchases.configure({apiKey: iosApiKey});
                } else if (Platform.OS === 'android') {
                    await Purchases.configure({apiKey: androidApiKey});
                }

                const customerInfo = await Purchases.getCustomerInfo();
                if (customerInfo?.entitlements?.active?.['Vai dar ruim Pro']) {
                    setUnlockedItems(prev => [...new Set([...prev, 'chaos', 'tribunal', 'provavel'])]);
                }
            } catch (e) {
                console.log('Info: Sistema de compras não inicializado (Normal em DEV)', e);
            }
        };
        setupPurchases();
    }, []);

    const [screen, setScreen] = useState('splash');
    const [config, setConfig] = useState(null);
    const [players, setPlayers] = useState([]);
    const [playlist, setPlaylist] = useState([]);
    const [stats, setStats] = useState({});
    const [decks, setDecks] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const savedPlayers = await AsyncStorage.getItem('@players');
                const savedItems = await AsyncStorage.getItem('@unlockedItems');

                if (savedPlayers) setPlayers(JSON.parse(savedPlayers));
                if (savedItems) {
                    const parsedItems = JSON.parse(savedItems);
                    setUnlockedItems(prev => [...new Set([...prev, ...parsedItems])]);
                }
            } catch (e) {
                console.error("Falha ao carregar dados", e);
            } finally {
                setIsLoaded(true);
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        if (isLoaded) {
            AsyncStorage.setItem('@players', JSON.stringify(players));
        }
    }, [players, isLoaded]);

    useEffect(() => {
        if (isLoaded) {
            AsyncStorage.setItem('@unlockedItems', JSON.stringify(unlockedItems));
        }
    }, [unlockedItems, isLoaded]);

    if (!isLoaded) return null;

    const buildDecks = (level) => {
        const newDecks = {};
        Object.keys(DB_CONTENT).forEach(gameId => {
            let gameDeck = DB_CONTENT[gameId].filter(card => {
                if (level === 'fun') return card.level === 'fun';
                if (level === 'prohibited') return ['fun', 'prohibited'].includes(card.level);
                return true;
            });
            gameDeck.sort(() => Math.random() - 0.5);
            newDecks[gameId] = gameDeck;
        });
        setDecks(newDecks);
    };

    const drawCard = (gameId, condition = () => true) => {
        if (!decks[gameId] || decks[gameId].length === 0) return null;

        const validCards = decks[gameId].filter(condition);
        if (validCards.length === 0) return null;

        const card = validCards[0];

        const cardIndex = decks[gameId].findIndex(c => c === card);
        const newDeck = [...decks[gameId]];
        newDeck.splice(cardIndex, 1);
        setDecks(prev => ({ ...prev, [gameId]: newDeck }));

        return card;
    };
    
    const vibrate = (pattern = 100) => {
        Vibration.vibrate(pattern);
    };

    const handleConfigComplete = (newConfig) => {
        setConfig(newConfig);
        buildDecks(newConfig.level);
        setScreen('lobby');
    };

    const handleStartPlaylist = (playerList) => {
        setPlayers(playerList);
        const initialStats = {};
        playerList.forEach(p => {
            initialStats[p.name] = { drank: 0, done: 0, skipped: 0 };
        });
        setStats(initialStats);
        setScreen('playlist');
    };

    const handleStartGame = (gamePlaylist) => {
        setPlaylist(gamePlaylist);
        setScreen('game');
    };
    
    const handleNextGame = () => {
        const newPlaylist = [...playlist];
        newPlaylist.shift();
        if (newPlaylist.length === 0) {
            setScreen('lobby'); 
        } else {
            setPlaylist(newPlaylist);
        }
    };

    const renderGame = () => {
        if (playlist.length === 0) return null;
        const currentGame = playlist[0];

        const gameProps = {
            level: config.level,
            players: players,
            onNext: handleNextGame,
        };

        let GameComponent;
        switch (currentGame.id) {
            case 'eu_nunca':
                GameComponent = <EuNunca {...gameProps} />;
                break;
            case 'desafios_rapidos':
                GameComponent = <DesafiosRapidos {...gameProps} />;
                break;
            case 'verdade_desafio':
                GameComponent = <VerdadeOuDesafio {...gameProps} />;
                break;
            case 'kings':
                GameComponent = <Baralho {...gameProps} />;
                break;
            case 'tribunal':
                GameComponent = <TribunalGame {...gameProps} />;
                break;
            case 'provavel':
                GameComponent = <ProvavelGame {...gameProps} />;
                break;
            default:
                GameComponent = <GenericGame {...gameProps} gameId={currentGame.id} title={currentGame.title} />;
        }

        return (
            <GameWrapper
                gameId={currentGame.id}
                unlockedItems={unlockedItems}
                onNext={handleNextGame}
            >
                {GameComponent}
            </GameWrapper>
        );
    };

    const handlePurchase = async () => {
        try {
            const paywallResult = await RevenueCatUI.presentPaywall();
            
            switch (paywallResult) {
                case PAYWALL_RESULT.NOT_PRESENTED:
                case PAYWALL_RESULT.ERROR:
                case PAYWALL_RESULT.CANCELLED:
                    return false;
                case PAYWALL_RESULT.PURCHASED:
                case PAYWALL_RESULT.RESTORED:
                    setUnlockedItems(prev => [...new Set([...prev, 'chaos', 'tribunal', 'provavel'])]);
                    return true;
                default:
                    return false;
            }
        } catch (e) {
            console.log('Error presenting paywall:', e);
            return false;
        }
    };

    const renderScreen = () => {
        switch (screen) {
            case 'splash':
                return <Splash onStart={() => setScreen('config')} />;
            case 'config':
                return <PartyConfig onConfigComplete={handleConfigComplete} unlockedItems={unlockedItems} onPurchase={handlePurchase} />;
            case 'lobby':
                return <Lobby config={config} onStartPlaylist={handleStartPlaylist} onBack={() => setScreen('config')} />;
            case 'playlist':
                return <Playlist config={config} unlockedItems={unlockedItems} onStartGame={handleStartGame} onPurchase={handlePurchase} />;
            case 'game':
                return renderGame();
            default:
                return <Splash onStart={() => setScreen('config')} />;
        }
    };

    return (
        <SafeAreaProvider>
            <DeckContext.Provider value={{ drawCard, vibrate, decks }}>
                <StatusBar barStyle="light-content" />
                <View style={{ flex: 1, backgroundColor: '#09090b' }}>
                    {renderScreen()}
                </View>
            </DeckContext.Provider>
        </SafeAreaProvider>
    );
};

export default App;