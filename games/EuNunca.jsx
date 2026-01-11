import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';
import SwipeableCard from '../components/SwipeableCard';
import { DeckContext } from '../contexts/DeckContext';

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
    
    const handleSwipe = () => {
        if (onAction) onAction();
        getNewCard();
    };

    const handleManualNext = () => {
        handleSwipe();
    };

    useEffect(() => {
        getNewCard();
    }, []);

    return (
        <View style={styles.gameContainer}>
            <View style={styles.cardArea}>
                <SwipeableCard onSwipe={handleSwipe}>
                    <View style={[styles.cardContent, { borderColor: 'rgba(255,255,255,0.2)' }]}>
                        <Text style={[styles.gameLabel, { color: 'rgba(255,255,255,0.7)' }]}>EU NUNCA</Text>
                        <Text style={styles.gameBigText}>
                            {currentCard?.text}
                        </Text>
                        <Text style={styles.instruction}>
                            {level === 'fun' ? '(Perde 1 ponto se já fez)' : '(Bebe se já fez)'}
                        </Text>
                        {/* [CORREÇÃO AQUI]: Substituído >> por &gt;&gt; */}
                        <Text style={styles.swipeHint}>
                            Arraste para &gt;&gt;
                        </Text>
                    </View>
                </SwipeableCard>
            </View>

            <View style={styles.footer}>
                <Button onClick={handleManualNext} variant="primary" style={{ marginBottom: 12, opacity: 0.8 }}>
                    <Text style={{ fontWeight: 'bold' }}>PRÓXIMO</Text>
                </Button>

                <Button onClick={onNext} variant="ghost">
                    <Text style={{ color: 'rgba(255,255,255,0.5)' }}>Encerrar Jogo</Text>
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
    cardArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardContent: {
        backgroundColor: '#18181b', 
        padding: 32,
        borderRadius: 24,
        width: '100%',
        minHeight: 350,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    gameLabel: {
        fontSize: 18,
        fontWeight: '900',
        marginBottom: 24,
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    gameBigText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 36,
    },
    instruction: {
        fontSize: 16,
        color: '#a8a29e', 
        fontStyle: 'italic',
        textAlign: 'center',
        marginBottom: 16
    },
    swipeHint: {
        fontSize: 12,
        color: '#57534e',
        marginTop: 12
    },
    footer: {
        marginTop: 20
    }
});

export default EuNunca;