import { Shuffle, AlertTriangle } from 'lucide-react-native';
import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';
import { DeckContext } from '../contexts/DeckContext';
import * as Haptics from 'expo-haptics';

const DesafiosRapidos = ({ level, onNext, onAction }) => {
    const { drawCard } = useContext(DeckContext);
    const [task, setTask] = useState(null);
    const [timeLeft, setTimeLeft] = useState(15);
    const [status, setStatus] = useState('idle'); // idle, running, timeout

    const startTask = () => {
        if (onAction) onAction();
        const card = drawCard('desafios_rapidos');
        setTask(card || { text: "Acabaram os desafios!" });
        setTimeLeft(15);
        setStatus('running');
    };

    useEffect(() => {
        let interval;
        if (status === 'running' && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
        } else if (status === 'running' && timeLeft === 0) {
            setStatus('timeout');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
        return () => clearInterval(interval);
    }, [status, timeLeft]);

    // Tela Inicial (Idle)
    if (status === 'idle') {
        return (
            <View style={[styles.gameContainer, { backgroundColor: '#2563eb' }]}>
                <View style={styles.centerContent}>
                    <Shuffle size={64} color="white" style={{ marginBottom: 24 }} />
                    <Text style={styles.gameTitle}>DESAFIOS RÁPIDOS</Text>
                    <Text style={styles.gameSubtitle}>Você tem 15 segundos.</Text>
                </View>
                <Button onClick={startTask} style={{ backgroundColor: 'white', width: '100%' }}>
                    <Text style={{ color: '#2563eb', fontWeight: 'bold' }}>COMEÇAR</Text>
                </Button>
                <Button onClick={onNext} variant="ghost" style={{ marginTop: 10 }}>
                    <Text style={{ color: 'rgba(255,255,255,0.6)' }}>Encerrar Jogo</Text>
                </Button>
            </View>
        );
    }

    // Tela de Jogo (Running ou Timeout)
    const isTimeout = status === 'timeout';
    const bg = isTimeout ? '#ef4444' : '#2563eb'; // Vermelho se acabou, Azul se rodando

    return (
        <View style={[styles.gameContainer, { backgroundColor: bg }]}>
            <View style={styles.centerContent}>
                {isTimeout && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                        <AlertTriangle color="white" size={32} />
                        <Text style={{ color: 'white', fontWeight: '900', fontSize: 24 }}>TEMPO ESGOTADO!</Text>
                    </View>
                )}

                <Text style={styles.taskText}>{task.text}</Text>

                <Text style={[styles.timerText, isTimeout && { opacity: 0.5, fontSize: 40 }]}>
                    {isTimeout ? "0s" : `${timeLeft}s`}
                </Text>
            </View>

            <View style={{ width: '100%', gap: 12 }}>
                <Button onClick={() => { onAction('success'); setStatus('idle'); }} variant="success">
                    CONCLUÍDO
                </Button>
                <Button onClick={() => { onAction('fail'); setStatus('idle'); }} variant="fail">
                    FALHOU 🍺
                </Button>
            </View>
        </View>
    );
};

DesafiosRapidos.propTypes = {
    level: PropTypes.string,
    onNext: PropTypes.func,
    onAction: PropTypes.func
};

const styles = StyleSheet.create({
    gameContainer: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
    centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' },
    gameTitle: { fontSize: 40, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 10 },
    gameSubtitle: { fontSize: 18, color: 'rgba(255,255,255,0.8)', marginBottom: 40 },
    taskText: { fontSize: 32, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 20 },
    timerText: { fontSize: 80, fontWeight: '900', color: 'white', textShadowColor: 'rgba(0,0,0,0.2)', textShadowRadius: 10 },
});

export default DesafiosRapidos;