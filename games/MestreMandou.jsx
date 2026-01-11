import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';
import SwipeableCard from '../components/SwipeableCard';
import { DeckContext } from '../contexts/DeckContext';

const MasterSaysGame = ({ level, onNext, onAction }) => {
    const { drawCard } = useContext(DeckContext);
    const [currentCard, setCurrentCard] = useState(null);

    const getNewCard = () => {
        const card = drawCard('master_says');
        if (card) {
            setCurrentCard(card);
        } else {
            setCurrentCard({ text: "O Mestre cansou (fim das cartas)!" });
        }
    };
    
    const handleSwipe = () => {
        if (onAction) onAction();
        getNewCard();
    };

    useEffect(() => {
        getNewCard();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.cardArea}>
                <SwipeableCard onSwipe={handleSwipe}>
                    <View style={styles.cardContent}>
                        <Text style={styles.label}>O MESTRE MANDOU...</Text>
                        <Text style={styles.text}>{currentCard?.text}</Text>
                        <Text style={styles.hint}>Arraste para &gt;&gt;</Text>
                    </View>
                </SwipeableCard>
            </View>
            
            <View style={{ padding: 20 }}>
                <Button onClick={onNext} variant="ghost">
                    <Text style={{color: '#ffffff80'}}>Encerrar Jogo</Text>
                </Button>
            </View>
        </View>
    );
};

MasterSaysGame.propTypes = {
    level: PropTypes.string,
    onNext: PropTypes.func,
    onAction: PropTypes.func
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'space-between' },
    cardArea: { flex: 1, padding: 24, justifyContent: 'center' },
    cardContent: {
        backgroundColor: '#18181b',
        padding: 32,
        borderRadius: 24,
        minHeight: 350,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        borderWidth: 1,
        borderColor: '#ffffff20'
    },
    label: { fontSize: 16, fontWeight: '900', color: '#ffffff60', marginBottom: 20, letterSpacing: 1 },
    text: { fontSize: 28, fontWeight: 'bold', color: 'white', textAlign: 'center' },
    hint: { fontSize: 12, color: '#ffffff40', marginTop: 30 }
});

export default MasterSaysGame;