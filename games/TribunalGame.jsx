import { Gavel } from 'lucide-react-native';
import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';
import { DeckContext } from '../contexts/DeckContext';

const TribunalGame = ({ onNext, onAction }) => {
    const { drawCard } = useContext(DeckContext);
    const [current, setCurrent] = useState(null);

    const nextCard = () => {
        if (onAction) onAction();
        const card = drawCard('tribunal');
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
        <View style={[styles.gameContainer, { backgroundColor: '#334155' }]}>
            <View style={styles.gameContent}>
                <Gavel size={64} color="white" style={{ marginBottom: 24, opacity: 0.8 }} />
                <Text style={styles.gameLabel}>Tribunal do Cancelamento</Text>
                <Text style={styles.gameBigText}>{current?.text}</Text>
            </View>

            <View style={styles.gameControls}>
                <Button onClick={nextCard} variant="tribunal">
                    <Text style={{ fontWeight: 'bold', fontSize: 18 }}>PRÓXIMO</Text>
                </Button>

                <Button onClick={onNext} variant="ghost" style={{ marginTop: 10 }}>
                    <Text style={{ color: 'rgba(255,255,255,0.6)' }}>Encerrar Jogo</Text>
                </Button>
            </View>
        </View>
    );
};

TribunalGame.propTypes = {
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
    gameControls: {
        paddingBottom: 40,
    },
});

export default TribunalGame;