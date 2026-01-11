import { Shuffle } from 'lucide-react-native';
import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';
import { DeckContext } from '../contexts/DeckContext';

const DesafiosRapidos = ({ level, onNext, onAction }) => {
    const { drawCard } = useContext(DeckContext);
    const [task, setTask] = useState(null);
    const [timeLeft, setTimeLeft] = useState(15);
    const [active, setActive] = useState(false);

    const startTask = () => {
        if (onAction) onAction();
        const card = drawCard('desafios_rapidos');
        if (card) {
            setTask(card);
        } else {
            setTask({ text: "Acabaram os desafios!" });
        }
        setTimeLeft(15);
        setActive(true);
    };

    useEffect(() => {
        let interval;
        if (active && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [active, timeLeft]);

    if (!active) {
        return (
            <View style={[styles.gameContainer, { backgroundColor: '#2563eb' }]}>
                <View style={styles.centerContent}>
                    <Shuffle size={64} color="white" style={{ marginBottom: 24 }} />
                    <Text style={styles.gameTitle}>DESAFIOS{"\n"}RÁPIDOS</Text>

                    <View style={{ width: '100%', marginTop: 32 }}>
                        <Button onClick={startTask}>PUXAR DESAFIO</Button>
                        <Button onClick={onNext} variant="ghost" style={{ marginTop: 12 }}>
                            <Text style={{ color: 'rgba(255,255,255,0.6)' }}>Encerrar Jogo</Text>
                        </Button>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.gameContainer, { backgroundColor: '#2563eb' }]}>
            <View style={styles.centerContent}>
                <Text style={styles.taskText}>{task.text}</Text>
                <Text style={styles.timerText}>{timeLeft}</Text>
            </View>
            <View style={{ width: '100%' }}>
                <Button onClick={() => { onAction('success'); setActive(false); }}>CONCLUÍDO</Button>
                <Button onClick={() => { onAction('fail'); setActive(false); }} variant="ghost">BEBER 🍺</Button>
            </View>
        </View>
    );
};

DesafiosRapidos.propTypes = {
    level: PropTypes.string.isRequired,
    onNext: PropTypes.func.isRequired,
    onAction: PropTypes.func
};

const styles = StyleSheet.create({
    gameContainer: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center'
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    gameTitle: {
        fontSize: 48,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        lineHeight: 48,
    },
    taskText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 32,
    },
    timerText: {
        fontSize: 72,
        fontWeight: 'bold',
        color: 'white',
    },
});

export default DesafiosRapidos;
