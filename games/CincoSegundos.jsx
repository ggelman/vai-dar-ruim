import { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { DeckContext } from '../contexts/DeckContext';
import Button from '../components/Button';
import * as Haptics from 'expo-haptics';

const FiveSecondsGame = ({ level, onNext, onAction }) => {
    const { drawCard } = useContext(DeckContext);
    const [task, setTask] = useState(null);
    const [timeLeft, setTimeLeft] = useState(5);
    const [gameState, setGameState] = useState('idle'); // idle, running, finished

    const getNewTask = () => {
        const card = drawCard('five_seconds');
        if (card) {
            setTask(card);
            setGameState('idle');
            setTimeLeft(5);
        } else {
            setTask({ text: "Fim das cartas!" });
            setGameState('finished');
        }
    };

    useEffect(() => {
        getNewTask();
    }, []);

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
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // Tick do relógio
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [gameState, timeLeft]);

    const handleStart = () => {
        setGameState('running');
    };

    const handleSuccess = () => {
        if (onAction) onAction('success');
        getNewTask();
    };

    const handleFail = () => {
        if (onAction) onAction('fail');
        getNewTask();
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>CITE 3...</Text>
                <Text style={styles.text}>{task?.text}</Text>
                
                {gameState === 'running' && (
                    <Text style={styles.timer}>{timeLeft}</Text>
                )}
                
                {gameState === 'finished' && timeLeft === 0 && (
                    <Text style={styles.timeOut}>TEMPO ESGOTADO!</Text>
                )}
            </View>

            <View style={styles.controls}>
                {gameState === 'idle' && (
                    <Button onClick={handleStart} variant="primary">
                        <Text style={styles.btnText}>JÁ! (Iniciar)</Text>
                    </Button>
                )}

                {(gameState === 'running' || (gameState === 'finished' && timeLeft === 0)) && (
                    <View style={{ gap: 10, width: '100%' }}>
                        <Button onClick={handleSuccess} style={{ backgroundColor: '#22c55e' }}>
                            <Text style={styles.btnText}>CONSEGUI 😎</Text>
                        </Button>
                        <Button onClick={handleFail} style={{ backgroundColor: '#ef4444' }}>
                            <Text style={styles.btnText}>BEBI 🍺</Text>
                        </Button>
                    </View>
                )}

                <Button onClick={onNext} variant="ghost" style={{marginTop: 20}}>
                    <Text style={{color: '#ffffff80'}}>Sair</Text>
                </Button>
            </View>
        </View>
    );
};

FiveSecondsGame.propTypes = {
    level: PropTypes.string,
    onNext: PropTypes.func,
    onAction: PropTypes.func
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, justifyContent: 'space-between' },
    card: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 20, color: '#ffffff80', fontWeight: '900', letterSpacing: 2, marginBottom: 20 },
    text: { fontSize: 32, color: 'white', fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
    timer: { fontSize: 80, fontWeight: '900', color: '#f59e0b' },
    timeOut: { fontSize: 24, color: '#ef4444', fontWeight: 'bold', marginTop: 20 },
    controls: { width: '100%' },
    btnText: { fontWeight: 'bold', fontSize: 18 }
});

export default FiveSecondsGame;