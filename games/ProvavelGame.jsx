import { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Hand } from 'lucide-react-native';
import { DeckContext } from '../contexts/DeckContext';
import Button from '../components/Button';

const ProvavelGame = ({ level, onNext, onAction }) => {
    const { drawCard } = useContext(DeckContext);
    const [current, setCurrent] = useState(null);

    const nextCard = () => {
        if (onAction) onAction();
        const card = drawCard('provavel');
        if (card) {
            setCurrent(card);
        } else {
            setCurrent({ text: "Acabaram as cartas!" });
        }
    };

    useEffect(() => {
        nextCard();
    }, []);

    return (
        <View style={[styles.gameContainer, { backgroundColor: '#7c3aed' }]}>
            <View style={styles.gameContent}>
                <Hand size={64} color="white" style={{ marginBottom: 24, opacity: 0.8 }} />
                <Text style={styles.gameLabel}>Quem é Mais Provável?</Text>
                <Text style={styles.gameBigText}>{current?.text}</Text>
                <Text style={styles.exposeText}>3... 2... 1... APONTE!</Text>
                {(level === 'prohibited' || level === 'chaos') && 
                    <Text style={{color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginTop: 16}}>O mais votado bebe!</Text>
                }
            </View>

            <View style={styles.gameControls}>
                <Button onClick={nextCard} variant="expose">
                    <Text style={{ fontWeight: 'bold', fontSize: 18 }}>PRÓXIMO</Text>
                </Button>

                <Button onClick={onNext} variant="ghost" style={{ marginTop: 10 }}>
                    <Text style={{ color: 'rgba(255,255,255,0.6)' }}>Trocar de Jogo</Text>
                </Button>
            </View>
        </View>
    );
};

ProvavelGame.propTypes = {
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
    },
    exposeText: {
        marginTop: 24,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fefce8',
        backgroundColor: 'rgba(0,0,0,0.2)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    gameControls: {
        paddingBottom: 40,
    },
});

export default ProvavelGame;