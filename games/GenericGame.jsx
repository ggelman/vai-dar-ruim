import { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { ArrowLeft, Share2, AlertTriangle } from 'lucide-react-native';
import Animated, { FadeInDown, FadeOutUp, useSharedValue, withRepeat, withTiming, useAnimatedStyle } from 'react-native-reanimated'; // [NOVO]
import { DeckContext } from '../contexts/DeckContext';
import { LEVELS } from '../constants/data';
import Button from '../components/Button';

const GenericGame = ({ gameId, level, onNext, onAction, onShare, title, type }) => {
    const { drawCard, vibrate } = useContext(DeckContext);
    const [currentText, setCurrentText] = useState("");
    const theme = LEVELS[level] || LEVELS.fun;
    
    const chaosOpacity = useSharedValue(0.3);

    useEffect(() => {
        if (level === 'chaos') {
            chaosOpacity.value = withRepeat(
                withTiming(0.8, { duration: 1000 }),
                -1,
                true
            );
        }
    }, [level]);

    const chaosStyle = useAnimatedStyle(() => ({
        borderColor: `rgba(220, 38, 38, ${chaosOpacity.value})`
    }));

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

            <Animated.View style={[
                styles.gameContent, 
                level === 'chaos' && [styles.chaosBorder, chaosStyle]
            ]}>
                <Text style={styles.gameLabel}>{title}</Text>
                
                <Animated.View 
                    key={currentText}
                    entering={FadeInDown.springify().damping(12)}
                    exiting={FadeOutUp.duration(100)}
                    style={{ width: '100%', alignItems: 'center' }}
                >
                    <Text style={styles.gameBigText}>{currentText}</Text>
                </Animated.View>
                
                {level === 'chaos' && (
                    <View style={styles.chaosBadge}>
                        <AlertTriangle color="#fca5a5" size={20} />
                        <Text style={styles.chaosText}>RODADA DO CAOS</Text>
                    </View>
                )}
            </Animated.View>

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
    chaosBorder: {
        borderWidth: 2,
        borderRadius: 20,
        marginVertical: 20,
        backgroundColor: 'rgba(0,0,0,0.2)',
        width: '100%',
        padding: 20
    },
    chaosBadge: {
        marginTop: 20, 
        flexDirection: 'row', 
        alignItems:'center', 
        gap: 8, 
        backgroundColor: 'rgba(220, 38, 38, 0.2)', 
        padding: 8, 
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(220, 38, 38, 0.5)'
    },
    chaosText: {
        color: '#fca5a5', 
        fontWeight:'bold',
        fontSize: 12,
        letterSpacing: 1
    },
    gameLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 16,
        letterSpacing: 1,
        textTransform: 'uppercase' 
    },
    gameBigText: {
        fontSize: 32, 
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
    },
    gameControls: {
        paddingBottom: 40,
    },
});

export default GenericGame;