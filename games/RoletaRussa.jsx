import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withSpring, 
    withSequence, 
    withTiming,
    runOnJS
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Target, RotateCcw } from 'lucide-react-native';
import Button from '../components/Button';
import { DeckContext } from '../contexts/DeckContext'; 

const RoletaRussa = ({ onNext, onAction }) => {
    // Estado do Jogo
    const [chamberSize, setChamberSize] = useState(6);
    const [currentRound, setCurrentRound] = useState(1);
    const [bulletPosition, setBulletPosition] = useState(1);
    const [status, setStatus] = useState('waiting'); 

    const scale = useSharedValue(1);
    const rotate = useSharedValue(0);
    const overlayOpacity = useSharedValue(0);

    const spinCylinder = () => {
        const newPos = Math.floor(Math.random() * 6) + 1; // 1 a 6
        setBulletPosition(newPos);
        setCurrentRound(1);
        setStatus('waiting');
        overlayOpacity.value = withTiming(0);
        
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    };

    useEffect(() => {
        spinCylinder();
    }, []);

    const pullTrigger = () => {
        if (status === 'dead') return;

        setStatus('spinning');
        
        scale.value = withSequence(
            withTiming(0.9, { duration: 200 }),
            withSpring(1)
        );

        setTimeout(() => {
            const isDead = currentRound === bulletPosition;

            if (isDead) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                setStatus('dead');
                overlayOpacity.value = withSpring(1); 
                if (onAction) onAction('fail');
            } else {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); 
                setStatus('safe');
                setCurrentRound(prev => prev + 1);
                if (onAction) onAction('success');
            }
        }, 800); 
    };

    const overlayStyle = useAnimatedStyle(() => ({
        opacity: overlayOpacity.value,
        backgroundColor: '#ef4444',
        ...StyleSheet.absoluteFillObject,
        zIndex: 0
    }));

    const triggerStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    return (
        <View style={styles.container}>
            <Animated.View style={overlayStyle} />

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.chamberText}>
                        CAMÂRA {currentRound} / 6
                    </Text>
                    <Text style={styles.probabilityText}>
                        Chance de morrer: {Math.round((1 / (7 - currentRound)) * 100)}%
                    </Text>
                </View>

                <View style={styles.mainAction}>
                    {status === 'dead' ? (
                        <View style={{ alignItems: 'center' }}>
                            <Text style={styles.deadTitle}>💥 POW! 💥</Text>
                            <Text style={styles.deadSubtitle}>VOCÊ MORREU (E BEBE)</Text>
                        </View>
                    ) : (
                        <TouchableOpacity 
                            onPress={pullTrigger} 
                            activeOpacity={0.8}
                            disabled={status === 'spinning'}
                        >
                            <Animated.View style={[styles.triggerBtn, triggerStyle]}>
                                <Target size={80} color={status === 'safe' ? '#22c55e' : 'white'} />
                                <Text style={styles.triggerText}>
                                    {status === 'spinning' ? '...' : 'DISPARAR'}
                                </Text>
                            </Animated.View>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.statusArea}>
                    {status === 'safe' && (
                        <Text style={styles.safeText}>UFA... PASSE O CELULAR.</Text>
                    )}
                </View>

                <View style={styles.controls}>
                    {status === 'dead' ? (
                         <Button onClick={spinCylinder} variant="primary" style={{marginBottom: 12}}>
                            <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                                <RotateCcw size={20} color="black"/>
                                <Text style={{fontWeight: 'bold'}}>GIRAR DE NOVO</Text>
                            </View>
                         </Button>
                    ) : null}
                    
                    <Button onClick={onNext} variant="ghost">
                        <Text style={{color: 'rgba(255,255,255,0.6)'}}>Sair do Jogo</Text>
                    </Button>
                </View>
            </View>
        </View>
    );
};

RoletaRussa.propTypes = {
    onNext: PropTypes.func.isRequired,
    onAction: PropTypes.func
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#18181b',
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'space-between',
        zIndex: 1
    },
    header: {
        alignItems: 'center',
        marginTop: 40
    },
    chamberText: {
        color: '#a1a1aa',
        fontSize: 14,
        letterSpacing: 2,
        fontWeight: 'bold'
    },
    probabilityText: {
        color: '#52525b',
        fontSize: 12,
        marginTop: 4
    },
    mainAction: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    triggerBtn: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#27272a',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#3f3f46',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10
    },
    triggerText: {
        color: 'white',
        fontWeight: '900',
        fontSize: 18,
        marginTop: 16,
        letterSpacing: 1
    },
    deadTitle: {
        fontSize: 60,
        fontWeight: '900',
        color: 'white',
        textAlign: 'center'
    },
    deadSubtitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginTop: 8
    },
    statusArea: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center'
    },
    safeText: {
        color: '#22c55e',
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 1
    },
    controls: {
        width: '100%'
    }
});

export default RoletaRussa;