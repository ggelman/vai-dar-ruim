import React, { createContext, useContext, useState } from 'react';
import { Vibration } from 'react-native';
import { DB_CONTENT } from '../constants/data';

export const DeckContext = createContext({});

export function DeckProvider({ children }) {
    const [decks, setDecks] = useState({});
    
    const [chaosTrigger, setChaosTrigger] = useState(0);

    const generateDeck = (gameId, level) => {
        if (!DB_CONTENT[gameId]) return [];
        
        let gameDeck = DB_CONTENT[gameId].filter(card => {
            if (level === 'fun') return card.level === 'fun';
            if (level === 'prohibited') return ['fun', 'prohibited'].includes(card.level);
            if (level === 'chaos') return ['prohibited', 'chaos'].includes(card.level);
            return true;
        });
        
        for (let i = gameDeck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [gameDeck[i], gameDeck[j]] = [gameDeck[j], gameDeck[i]];
        }
        return gameDeck;
    };

    const resetDecks = (level, customCards = []) => {
        const newDecks = {};
        
        Object.keys(DB_CONTENT).forEach(gameId => {
            let deck = generateDeck(gameId, level);
            
            if (customCards.length > 0 && ['eu_nunca', 'kings', 'tribunal'].includes(gameId)) {
                const formattedCustoms = customCards.map(c => ({
                    text: `🃏 CORINGA 🃏\n\n${typeof c === 'string' ? c : c.text}`,
                    level: 'chaos', // Coringas são considerados caos para piscar a tela
                    type: 'custom'
                }));
                
                deck = [...deck, ...formattedCustoms];
                deck.sort(() => Math.random() - 0.5);
            }
            
            newDecks[gameId] = deck;
        });
        
        setDecks(newDecks);
    };

    const buildDecks = (level) => resetDecks(level, []);

    const drawCard = (gameId, condition = () => true) => {
        if (!decks[gameId] || decks[gameId].length === 0) return null;

        const validCards = decks[gameId].filter(condition);
        if (validCards.length === 0) return null;

        const card = validCards[0];
        
        if (card.level === 'chaos') {
            setChaosTrigger(Date.now());
        }

        const newDeckList = decks[gameId].filter(c => c !== card);
        setDecks(prev => ({ ...prev, [gameId]: newDeckList }));

        return card;
    };

    const vibrate = (pattern = 100) => Vibration.vibrate(pattern);

    return (
        <DeckContext.Provider value={{ 
            decks, 
            buildDecks, 
            resetDecks, 
            drawCard, 
            vibrate,
            chaosTrigger 
        }}>
            {children}
        </DeckContext.Provider>
    );
}

export const useDeck = () => useContext(DeckContext);