import { useState, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { DeckContext } from '../contexts/DeckContext';
import Button from '../components/Button';

const VerdadeOuDesafio = ({ level, players, onNext, onAction }) => {
    const { drawCard } = useContext(DeckContext);
    const [state, setState] = useState('picker');
    const [activePlayer, setActivePlayer] = useState(null);
    const [choice, setChoice] = useState(null);
    const [content, setContent] = useState(null);

    const pickPlayer = () => {
        if (onAction) onAction();
        const pList = players.length > 0 ? players : [{ name: 'Jogador 1' }];
        const p = pList[Math.floor(Math.random() * pList.length)];
        setActivePlayer(p);
        setState('choice');
    };

    const selectMode = (mode) => {
        setChoice(mode);
        const card = drawCard('verdade_desafio', c => c.type === mode.toLowerCase());

        if (card) {
            setContent(card);
        } else {
            setContent({ text: "Erro: Sem perguntas deste tipo." });
        }
        setState('result');
    };

    const getThemeColor = () => {
        switch (level) {
            case 'fun': return '#16a34a';
            case 'chaos': return '#991b1b';
            default: return '#6b21a8';
        }
    };

    return (
        <View style={[styles.gameContainer, { backgroundColor: getThemeColor() }]}>

            {state === 'picker' && (
                <View style={styles.centerContent}>
                    <Text style={styles.subTitle}>QUEM VAI AGORA?</Text>
                    <View style={{ width: '100%', marginTop: 32 }}>
                        <Button onClick={pickPlayer}>GIRAR A ROLETA</Button>
                        <Button onClick={onNext} variant="ghost" style={{ marginTop: 24 }}>
                            <Text style={{ color: 'rgba(255,255,255,0.6)' }}>Encerrar Jogo</Text>
                        </Button>
                    </View>
                </View>
            )}

            {state === 'choice' && activePlayer && (
                <View style={styles.centerContent}>
                    <Text style={styles.playerName}>{activePlayer.name.toUpperCase()}</Text>
                    <Text style={styles.subTitle}>Sua vez de escolher.</Text>

                    <View style={{ width: '100%', gap: 16, marginTop: 40 }}>
                        <Button
                            onClick={() => selectMode('Verdade')}
                            style={{ backgroundColor: '#3b82f6' }}
                        >
                            VERDADE
                        </Button>
                        <Button
                            onClick={() => selectMode('Desafio')}
                            style={{ backgroundColor: '#f97316' }}
                        >
                            DESAFIO
                        </Button>
                    </View>
                </View>
            )}

            {state === 'result' && (
                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={styles.resultLabel}>{choice} PARA {activePlayer?.name}</Text>
                        <Text style={styles.resultText}>"{content?.text}"</Text>
                    </View>

                    <View>
                        <Button onClick={() => { onAction('success'); setState('picker'); }}>CUMPRIU</Button>
                        <Button onClick={() => { onAction('fail'); setState('picker'); }} variant="ghost">RECUSOU (BEBE) 🍺</Button>
                        <Text style={styles.footerNote}>Próximo jogador em qualquer opção</Text>
                    </View>
                </View>
            )}
        </View>
    );
};

VerdadeOuDesafio.propTypes = {
    level: PropTypes.string.isRequired,
    players: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        sex: PropTypes.string
    })).isRequired,
    onNext: PropTypes.func.isRequired,
    onAction: PropTypes.func
};

const styles = StyleSheet.create({
    gameContainer: {
        flex: 1,
        padding: 24,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    subTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
    },
    playerName: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 8,
    },
    resultLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 16,
        textAlign: 'center',
    },
    resultText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    footerNote: {
        textAlign: 'center',
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
        marginTop: 8,
    },
});

export default VerdadeOuDesafio;