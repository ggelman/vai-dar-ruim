import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../components/Button';
import { DeckContext } from '../contexts/DeckContext';

const Baralho = ({ level, onNext, onAction }) => {
    const { drawCard } = useContext(DeckContext);
    const [currentCard, setCurrentCard] = useState(null);

    const getNewCard = () => {
        if (onAction) onAction();
        const card = drawCard('kings');
        if(card) {
            setCurrentCard(card);
        } else {
            setCurrentCard({ rule: "Acabaram as cartas!", card: '🃏' });
        }
    };

    return (
        <View style={styles.baralhoContainer}>
            {!currentCard ? (
                <View style={styles.centerContent}>
                    <TouchableOpacity onPress={getNewCard} activeOpacity={0.8} style={styles.cardBack}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontSize: 60, color: 'white' }}>🂠</Text>
                            <Text style={{ color: 'white', fontWeight: 'bold', marginTop: 8 }}>TOCAR</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.centerContent}>
                    <View style={styles.cardFront}>
                        <Text style={{ fontSize: 80, fontWeight: '900', color: 'black' }}>{currentCard.card}</Text>
                    </View>
                    <Text style={styles.ruleTitle}>{currentCard.rule}</Text>
                    <Text style={styles.ruleDesc}>Regra ativa para a mesa.</Text>
                    <View style={{ width: '100%', paddingHorizontal: 40 }}>
                        <Button onClick={() => setCurrentCard(null)}>PRÓXIMA CARTA</Button>
                    </View>
                </View>
            )}
            <View style={{ width: '100%', paddingHorizontal: 20, paddingBottom: 20 }}>
                <Button onClick={onNext} variant="ghost"><Text style={{ color: '#9ca3af' }}>Encerrar Jogo</Text></Button>
            </View>
        </View>
    );
};

Baralho.propTypes = {
    level: PropTypes.string.isRequired,
    onNext: PropTypes.func.isRequired,
    onAction: PropTypes.func
};

const styles = StyleSheet.create({
    baralhoContainer: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1c1917',
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    cardBack: {
        width: 200,
        height: 300,
        backgroundColor: '#44403c',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#78716c',
    },
    cardFront: {
        width: 220,
        height: 320,
        backgroundColor: 'white',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    ruleTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        paddingHorizontal: 20,
        marginBottom: 8,
    },
    ruleDesc: {
        fontSize: 16,
        color: '#a1a1aa',
        textAlign: 'center',
        marginBottom: 24,
    },
});

export default Baralho;