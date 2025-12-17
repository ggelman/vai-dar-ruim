import { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { ArrowLeft, Share2, AlertTriangle } from 'lucide-react-native';
import { DeckContext } from '../contexts/DeckContext';
import { LEVELS } from '../constants/data';
import Button from '../components/Button';

const GenericGame = ({ gameId, level, onNext, onAction, onShare, title, type }) => {
    const { drawCard, vibrate } = useContext(DeckContext);
    const [currentText, setCurrentText] = useState("");
    const theme = LEVELS[level] || LEVELS.fun;

    const nextCard = () => {
        if (level === 'chaos') vibrate(500); 
        else vibrate(50); 

        const card = drawCard(gameId);
        if (card) {
            setCurrentText(card.text);
        } else {
            setCurrentText("Fim das cartas!");
        }
    };

    useEffect(() => { nextCard(); }, [gameId]);

    const handleSuccess = () => { onAction('success'); nextCard(); };
    const handleFail = () => { onAction('fail'); nextCard(); };

    return (
        <View style={[styles.gameContainer, { backgroundColor: theme.color }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                <TouchableOpacity onPress={onNext}><ArrowLeft color="white" /></TouchableOpacity>
                <TouchableOpacity onPress={() => onShare(currentText)}><Share2 color="white" /></TouchableOpacity>
            </View>

            <View style={styles.gameContent}>
                <Text style={styles.gameLabel}>{title}</Text>
                <Text style={styles.gameBigText}>{currentText}</Text>
                
                {level === 'chaos' && (
                    <View style={{marginTop: 20, flexDirection: 'row', alignItems:'center', gap: 8, backgroundColor: 'rgba(0,0,0,0.3)', padding: 8, borderRadius: 8}}>
                        <AlertTriangle color="yellow" size={20} />
                        <Text style={{color:'yellow', fontWeight:'bold'}}>RODADA DO CAOS</Text>
                    </View>
                )}
            </View>

            <View style={styles.gameControls}>
                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
                    <View style={{flex:1}}>
                        <Button onClick={handleFail} variant="fail" style={{backgroundColor: '#ef4444'}}>
                            BEBEU 🍺
                        </Button>
                    </View>
                    <View style={{flex:1}}>
                        <Button onClick={handleSuccess} variant="success" style={{backgroundColor: '#22c55e'}}>
                            CUMPRIU ✅
                        </Button>
                    </View>
                </View>
                <Button onClick={nextCard} variant="primary">
                    <Text style={{fontSize: 18, fontWeight: 'bold'}}>PRÓXIMA</Text>
                </Button>
            </View>
        </View>
    );
};

GenericGame.propTypes = {
    gameId: PropTypes.string.isRequired,
    level: PropTypes.string.isRequired,
    onNext: PropTypes.func.isRequired,
    onAction: PropTypes.func.isRequired,
    onShare: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string,
};

const styles = StyleSheet.create({
    gameContainer: {
        flex: 1,
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    gameContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gameLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 16,
        letterSpacing: 1,
    },
    gameBigText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.2)',
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 4,
    },
    gameControls: {
        paddingBottom: 40,
    },
});

export default GenericGame;