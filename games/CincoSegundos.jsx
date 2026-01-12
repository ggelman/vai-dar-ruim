import * as Haptics from 'expo-haptics';
import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';
import { DeckContext } from '../contexts/DeckContext';

const CincoSegundos = ({ level, onNext, onAction }) => {
    const { drawCard } = useContext(DeckContext);
    const [task, setTask] = useState(null);
    const [timeLeft, setTimeLeft] = useState(5);
    const [gameState, setGameState] = useState('idle'); // idle, running, finished

    const getNewTask = () => {
        if (onAction) onAction();
        const card = drawCard('cinco_segundos');
        setTask(card || { text: "Fim das cartas!" });
        setGameState('idle');
        setTimeLeft(5);
    };

    const startTimer = () => {
        setGameState('running');
    };

    useEffect(() => {
        let interval;
        if (gameState === 'running' && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                        setGameState('finished');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [gameState, timeLeft]);

    useEffect(() => { getNewTask(); }, []);

    const isFinished = gameState === 'finished';

    return (
        <View style={[styles.container, { backgroundColor: isFinished ? '#ef4444' : '#059669' }]}>
            <View style={styles.card}>
                <Text style={styles.title}>5 SEGUNDOS</Text>
                <Text style={styles.text}>{task?.text}</Text>

                {gameState === 'idle' && (
                    <Button onClick={startTimer} style={{ backgroundColor: 'white', width: 200 }}>
                        <Text style={{ color: '#059669', fontWeight: 'bold' }}>JÁ! ⏱️</Text>
                    </Button>
                )}

                {gameState === 'running' && (
                    <Text style={styles.timer}>{timeLeft}</Text>
                )}

                {gameState === 'finished' && (
                    <Text style={[styles.timer, { fontSize: 40 }]}>ACABOU!</Text>
                )}
            </View>

            {gameState !== 'idle' && (
                <View style={{ width: '100%', gap: 12 }}>
                    <Button onClick={getNewTask} variant="success">CONSEGUI 😎</Button>
                    <Button onClick={getNewTask} variant="fail">NÃO DEU 🍺</Button>
                </View>
            )}

            <View style={styles.gameControls}>
                <Button onClick={onNext} variant="ghost" style={{ marginTop: 10 }}>
                    <Text style={{ color: 'rgba(255,255,255,0.6)' }}>Encerrar Jogo</Text>
                </Button>
            </View>
        </View>
    );
};

CincoSegundos.propTypes = {
    level: PropTypes.string,
    onNext: PropTypes.func,
    onAction: PropTypes.func
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, justifyContent: 'space-between' },
    card: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 20, color: 'rgba(255,255,255,0.7)', fontWeight: '900', letterSpacing: 2, marginBottom: 20 },
    text: { fontSize: 36, color: 'white', fontWeight: 'bold', textAlign: 'center', marginBottom: 40 },
    timer: { fontSize: 100, fontWeight: '900', color: 'white' },
});

export default CincoSegundos;