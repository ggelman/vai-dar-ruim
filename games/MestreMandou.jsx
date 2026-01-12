import { Crown } from 'lucide-react-native';
import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SwipeableCard from '../components/SwipeableCard';
import Button from '../components/Button';
import { DeckContext } from '../contexts/DeckContext';

const MestreMandou = ({ level, onNext, onAction }) => {
    const { drawCard } = useContext(DeckContext);
    const [currentCard, setCurrentCard] = useState(null);

    const getNewCard = () => {
        const card = drawCard('mestre_mandou');
        setCurrentCard(card || { text: "O Mestre cansou (fim das cartas)!" });
    };

    const handleSwipe = () => {
        if (onAction) onAction();
        getNewCard();
    };

    useEffect(() => { getNewCard(); }, []);

    return (
        <View style={styles.container}>
            <View style={styles.cardArea}>
                <SwipeableCard onSwipe={handleSwipe}>
                    <View style={styles.cardContent}>
                        <Crown size={48} color="#facc15" style={{ marginBottom: 16 }} />
                        <Text style={styles.label}>O MESTRE MANDOU...</Text>
                        <Text style={styles.text}>{currentCard?.text}</Text>
                        <Text style={styles.hint}>Arraste para pular {">>"}</Text>
                    </View>
                </SwipeableCard>
            </View>
            <View style={styles.gameControls}>
                <Button onClick={onNext} variant="ghost" style={{ marginTop: 10 }}>
                    <Text style={{ color: 'rgba(255,255,255,0.6)' }}>Encerrar Jogo</Text>
                </Button>
            </View>
        </View>
    );
};

MestreMandou.propTypes = {
    level: PropTypes.string,
    onNext: PropTypes.func,
    onAction: PropTypes.func
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    cardArea: { width: '100%', padding: 24 },
    cardContent: {
        backgroundColor: '#18181b', padding: 32, borderRadius: 24, minHeight: 400,
        justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#facc15'
    },
    label: { fontSize: 18, fontWeight: '900', color: '#facc15', marginBottom: 24, letterSpacing: 2 },
    text: { fontSize: 32, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 32 },
    hint: { fontSize: 12, color: '#52525b', position: 'absolute', bottom: 20 },
    gameControls: { marginTop: 50 }
});

export default MestreMandou;