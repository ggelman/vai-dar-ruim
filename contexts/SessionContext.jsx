import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform, Alert } from 'react-native';

// --- MOCK DE PAGAMENTO (Mantido para não quebrar Expo Go) ---
let Purchases, RevenueCatUI, LOG_LEVEL, PAYWALL_RESULT;
try {
    const rc = require('react-native-purchases');
    const rcUI = require('react-native-purchases-ui');
    if (!rc.default) throw new Error("Purchases core não inicializado");
    Purchases = rc.default;
    LOG_LEVEL = rc.LOG_LEVEL;
    RevenueCatUI = rcUI.default || rcUI;
    PAYWALL_RESULT = rcUI.PAYWALL_RESULT;
} catch (e) {
    console.log("[DEV] Modo Expo Go. Ativando Mocks.");
    LOG_LEVEL = { VERBOSE: 'VERBOSE' };
    PAYWALL_RESULT = { CANCELLED: 'CANCELLED', PURCHASED: 'PURCHASED', RESTORED: 'RESTORED', NOT_PRESENTED: 'NOT_PRESENTED' };
    Purchases = {
        configure: async () => {},
        setLogLevel: () => {},
        getCustomerInfo: async () => ({ entitlements: { active: {} } }),
    };
    RevenueCatUI = {
        presentPaywall: async () => {
            Alert.alert("Modo Dev", "Simulando Paywall.");
            return PAYWALL_RESULT.CANCELLED;
        }
    };
}

const SessionContext = createContext({});

export function SessionProvider({ children }) {
    const [unlockedItems, setUnlockedItems] = useState(['subscription']);
    const [players, setPlayers] = useState([]);
    
    // Configuração interna
    const [config, setConfigState] = useState({ people: 4, level: 'fun' });
    
    const [playlist, setPlaylist] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // --- AQUI ESTAVA FALTANDO ---
    // Estado das Cartas Coringa
    const [customCards, setCustomCards] = useState([]); 
    // ---------------------------

    // Wrapper para setConfig que limpa jogadores excedentes
    const setConfig = (newConfig) => {
        setConfigState(prev => {
            const updated = { ...prev, ...newConfig };
            // Se reduziu o número de pessoas, corta o array de jogadores
            if (players.length > updated.people) {
                const trimmedPlayers = players.slice(0, updated.people);
                setPlayers(trimmedPlayers);
            }
            return updated;
        });
    };

    // Inicialização (IAP + Storage)
    useEffect(() => {
        const init = async () => {
            try {
                Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
                const apiKey = Platform.OS === 'ios' ? 'test_ios_key' : 'test_android_key';
                await Purchases.configure({ apiKey });
                
                const info = await Purchases.getCustomerInfo();
                if (info?.entitlements?.active?.['Vai dar ruim Pro']) {
                    setUnlockedItems(prev => [...new Set([...prev, 'chaos', 'tribunal', 'provavel'])]);
                }

                // Carregar dados salvos
                const savedPlayers = await AsyncStorage.getItem('@players');
                const savedItems = await AsyncStorage.getItem('@unlockedItems');
                const savedCustom = await AsyncStorage.getItem('@customCards');

                if (savedPlayers) setPlayers(JSON.parse(savedPlayers));
                if (savedItems) {
                    const parsed = JSON.parse(savedItems);
                    setUnlockedItems(prev => [...new Set([...prev, ...parsed])]);
                }
                if (savedCustom) {
                    setCustomCards(JSON.parse(savedCustom));
                }

            } catch (e) {
                console.log("Erro na inicialização:", e);
            } finally {
                setIsLoaded(true);
            }
        };
        init();
    }, []);

    // Persistência automática de Jogadores
    useEffect(() => {
        if (isLoaded) AsyncStorage.setItem('@players', JSON.stringify(players));
    }, [players, isLoaded]);

    // Persistência automática de Itens Desbloqueados
    useEffect(() => {
        if (isLoaded) AsyncStorage.setItem('@unlockedItems', JSON.stringify(unlockedItems));
    }, [unlockedItems, isLoaded]);

    // Persistência automática de Cartas Coringa
    useEffect(() => {
        if (isLoaded) AsyncStorage.setItem('@customCards', JSON.stringify(customCards));
    }, [customCards, isLoaded]);

    const handlePurchase = async () => {
        try {
            const result = await RevenueCatUI.presentPaywall();
            if (result === PAYWALL_RESULT.PURCHASED || result === PAYWALL_RESULT.RESTORED) {
                setUnlockedItems(prev => [...new Set([...prev, 'chaos', 'tribunal', 'provavel'])]);
                return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    };

    return (
        <SessionContext.Provider value={{
            players, setPlayers,
            config, setConfig,
            playlist, setPlaylist,
            unlockedItems, setUnlockedItems,
            customCards, setCustomCards, // Expondo para o app
            handlePurchase,
            isLoaded
        }}>
            {children}
        </SessionContext.Provider>
    );
}

export const useSession = () => useContext(SessionContext);