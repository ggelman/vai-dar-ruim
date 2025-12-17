import { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { DeckContext } from '../contexts/DeckContext';
import { LEVELS } from '../constants/data';
import Button from '../components/Button';

const EuNunca = ({ level, onNext, onAction }) => {
    const { drawCard } = useContext(DeckContext);
    const [currentCard, setCurrentCard] = useState(null);

    const getNewCard = () => {
        const card = drawCard('eu_nunca');
        if (card) {
            setCurrentCard(card);
        } else {
            setCurrentCard({ text: "Acabaram as cartas deste nível!" });
        }
    };
    
    const nextCard = () => {
        if (onAction) onAction();
        getNewCard();
    };

    useEffect(() => {
        getNewCard();
    }, []);

    return (
        <View style={[styles.gameContainer, { backgroundColor: (LEVELS[level] || LEVELS.fun).color }]}>
            <View style={styles.gameContent}>
                <Text style={styles.gameLabel}>EU NUNCA</Text>
                <Text style={styles.gameBigText}>
                    {currentCard?.text}
                </Text>
            </View>

            <View style={styles.gameControls}>
                <Text style={styles.gameInstruction}>
                    Quem já fez, {level === 'fun' ? 'perde um ponto' : 'bebe'}.
                </Text>

                <Button onClick={nextCard} variant="primary">
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>PRÓXIMO</Text>
                </Button>

                <Button onClick={onNext} variant="ghost" style={{ marginTop: 10 }}>
                    <Text style={{ color: 'rgba(0,0,0,0.5)' }}>Trocar de Jogo</Text>
                </Button>
            </View>
        </View>
    );
};

EuNunca.propTypes = {
    level: PropTypes.string.isRequired,
    onNext: PropTypes.func.isRequired,
    onAction: PropTypes.func
};

const styles = StyleSheet.create({
    gameContainer: {
        flex: 1,
        padding: 24,
        justifyContent: 'space-between',
    },
    gameContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gameLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 16,
        letterSpacing: 1,
    },
    gameBigText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 4,
    },
    gameControls: {
        paddingBottom: 40,
    },
    gameInstruction: {
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 16,
    },
});

export default EuNunca;