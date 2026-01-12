import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform, Alert } from 'react-native';

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
    
    const [config, setConfigState] = useState({ people: 4, level: 'fun' });
    
    const [playlist, setPlaylist] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    const [customCards, setCustomCards] = useState([]); 

    const trackEvent = (eventName, params = {}) => {
        // Em produção, substituir por: analytics().logEvent(eventName, params);
        if (__DEV__) {
            console.log(`📊 [TRACK]: ${eventName}`, params);
        }
    };

    const setConfig = (newConfig) => {
        setConfigState(prev => {
            const updated = { ...prev, ...newConfig };
            if (players.length > updated.people) {
                const trimmedPlayers = players.slice(0, updated.people);
                setPlayers(trimmedPlayers);
            }
            return updated;
        });
    };

    const addPlayer = (name) => {
        const newPlayer = {
            id: Date.now(),
            name: name || `Jogador ${players.length + 1}`,
            sex: 'M' // Default
        };
        setPlayers(prev => [...prev, newPlayer]);
        trackEvent('PLAYER_ADDED_INGAME');
    };

    const removePlayer = (id) => {
        if (players.length <= 2) {
            Alert.alert("Epa!", "O jogo precisa de pelo menos 2 jogadores.");
            return;
        }
        setPlayers(prev => prev.filter(p => p.id !== id));
        trackEvent('PLAYER_REMOVED_INGAME');
    };

    useEffect(() => {
        const init = async () => {
            try {
                Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
                const apiKey = Platform.OS === 'ios' ? 'test_ios_key' : 'test_android_key';
                await Purchases.configure({ apiKey });
                
                const info = await Purchases.getCustomerInfo();
                if (info?.entitlements?.active?.['Vai dar ruim Pro']) {
                    setUnlockedItems(prev => [...new Set([...prev, 'chaos', 'tribunal', 'provavel'])]);
                    trackEvent('APP_OPEN', { user_type: 'premium' });
                } else {
                    trackEvent('APP_OPEN', { user_type: 'free' });
                }

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

    useEffect(() => { if (isLoaded) AsyncStorage.setItem('@players', JSON.stringify(players)); }, [players, isLoaded]);
    useEffect(() => { if (isLoaded) AsyncStorage.setItem('@unlockedItems', JSON.stringify(unlockedItems)); }, [unlockedItems, isLoaded]);
    useEffect(() => { if (isLoaded) AsyncStorage.setItem('@customCards', JSON.stringify(customCards)); }, [customCards, isLoaded]);

    const handlePurchase = async () => {
        trackEvent('PURCHASE_ATTEMPT');
        try {
            const result = await RevenueCatUI.presentPaywall();
            if (result === PAYWALL_RESULT.PURCHASED || result === PAYWALL_RESULT.RESTORED) {
                setUnlockedItems(prev => [...new Set([...prev, 'chaos', 'tribunal', 'provavel'])]);
                trackEvent('PURCHASE_SUCCESS', { method: 'revenue_cat' });
                return true;
            }
            trackEvent('PURCHASE_CANCELLED');
            return false;
        } catch (e) {
            trackEvent('PURCHASE_ERROR', { error: e.message });
            return false;
        }
    };

    return (
        <SessionContext.Provider value={{
            players, setPlayers, addPlayer, removePlayer,
            config, setConfig,
            playlist, setPlaylist,
            unlockedItems, setUnlockedItems,
            customCards, setCustomCards,
            handlePurchase,
            trackEvent, 
            isLoaded
        }}>
            {children}
        </SessionContext.Provider>
    );
}

export const useSession = () => useContext(SessionContext);