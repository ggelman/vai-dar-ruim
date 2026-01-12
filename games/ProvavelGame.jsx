import { Hand } from 'lucide-react-native';
import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';
import { DeckContext } from '../contexts/DeckContext';
import * as Haptics from 'expo-haptics';

const ProvavelGame = ({ level, onNext, onAction }) => {
    const { drawCard } = useContext(DeckContext);
    const [current, setCurrent] = useState(null);
    const [countdown, setCountdown] = useState(null); // null, 3, 2, 1, 0

    const nextCard = () => {
        if (onAction) onAction();
        const card = drawCard('provavel');
        setCurrent(card || { text: "Acabaram as cartas!" });
        setCountdown(null);
    };

    const startCountdown = () => {
        setCountdown(3);
    };

    useEffect(() => {
        if (countdown !== null && countdown > 0) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    }, [countdown]);

    useEffect(() => { nextCard(); }, []);

    return (
        <View style={[styles.gameContainer, { backgroundColor: '#7c3aed' }]}>
            <View style={styles.gameContent}>
                <Hand size={64} color="white" style={{ marginBottom: 24, opacity: 0.8 }} />
                <Text style={styles.gameLabel}>QUEM É MAIS PROVÁVEL?</Text>
                
                <Text style={styles.gameBigText}>{current?.text}</Text>

                <View style={styles.countdownArea}>
                    {countdown === null ? (
                        <Button onClick={startCountdown} style={{ backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 32 }}>
                            <Text style={{color: 'white', fontWeight: 'bold'}}>INICIAR CONTAGEM ⏱️</Text>
                        </Button>
                    ) : countdown > 0 ? (
                        <Text style={styles.timerNumber}>{countdown}</Text>
                    ) : (
                        <Text style={styles.pointText}>APONTEM AGORA! 👉</Text>
                    )}
                </View>
            </View>

            <View style={styles.gameControls}>
                <Button onClick={nextCard} variant="expose">
                    <Text style={{ fontWeight: 'bold', fontSize: 18 }}>PRÓXIMO</Text>
                </Button>
                <Button onClick={onNext} variant="ghost" style={{ marginTop: 10 }}>
                    <Text style={{ color: 'rgba(255,255,255,0.6)' }}>Encerrar Jogo</Text>
                </Button>
            </View>
        </View>
    );
};

ProvavelGame.propTypes = {
    level: PropTypes.string,
    onNext: PropTypes.func,
    onAction: PropTypes.func
};

const styles = StyleSheet.create({
    gameContainer: { flex: 1, padding: 24, justifyContent: 'space-between' },
    gameContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    gameLabel: { fontSize: 16, fontWeight: 'bold', color: 'rgba(255,255,255,0.7)', marginBottom: 24, letterSpacing: 1, textTransform: 'uppercase' },
    gameBigText: { fontSize: 30, fontWeight: 'bold', color: 'white', textAlign: 'center' },
    countdownArea: { marginTop: 40, height: 80, justifyContent: 'center', alignItems: 'center' },
    timerNumber: { fontSize: 80, fontWeight: '900', color: '#fbbf24' },
    pointText: { fontSize: 32, fontWeight: '900', color: '#facc15', textAlign: 'center' },
    gameControls: { paddingBottom: 20 }
});

export default ProvavelGame;