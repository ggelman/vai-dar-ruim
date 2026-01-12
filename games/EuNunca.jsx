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
        if (onAction) onAction(); // Registra ação/consumo de carta
        getNewCard();
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
                        <Text style={styles.instruction}>Arraste para {">>"} próxima</Text>
                    </View>
                </SwipeableCard>
            </View>

            <View style={styles.footer}>
                <Button onClick={onNext} variant="ghost">
                    <Text style={{ color: 'rgba(255,255,255,0.5)' }}>Encerrar Jogo</Text>
                </Button>
            </View>
        </View>
    );
};

EuNunca.propTypes = {
    level: PropTypes.string,
    onNext: PropTypes.func,
    onAction: PropTypes.func
};

const styles = StyleSheet.create({
    gameContainer: { flex: 1, padding: 24, justifyContent: 'center' },
    cardArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    cardContent: {
        backgroundColor: '#18181b', 
        padding: 32, borderRadius: 24, width: '100%', minHeight: 400,
        justifyContent: 'center', alignItems: 'center',
        borderWidth: 1, shadowColor: "#000", shadowOpacity: 0.3, elevation: 8,
    },
    gameLabel: { fontSize: 18, fontWeight: '900', marginBottom: 24, letterSpacing: 2, textTransform: 'uppercase' },
    gameBigText: { fontSize: 32, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 32, lineHeight: 40 },
    instruction: { fontSize: 14, color: '#52525b', marginTop: 24 },
    footer: { marginTop: 20 }
});

export default EuNunca;