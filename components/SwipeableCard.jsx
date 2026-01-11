import React, { useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withSpring, 
    runOnJS, 
    withTiming,
    interpolate,
    Extrapolation 
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

const SwipeableCard = ({ children, onSwipe, enabled = true }) => {
    const translateX = useSharedValue(0);
    const rotate = useSharedValue(0);
    const scale = useSharedValue(1);

    const resetPosition = () => {
        translateX.value = withSpring(0);
        rotate.value = withSpring(0);
        scale.value = withSpring(1);
    };

    const handleSuccess = (direction) => {
        // Haptic Feedback Pesado para confirmar ação
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        // Animação de saída
        const endPos = direction === 'right' ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5;
        translateX.value = withTiming(endPos, { duration: 200 }, (finished) => {
            if (finished) {
                runOnJS(onSwipe)();
                // Reset imediato para o próximo card (simulando pilha infinita)
                translateX.value = 0;
                rotate.value = 0;
                // Pequena animação de "pop" ao aparecer o novo
                scale.value = 0.8;
                scale.value = withSpring(1);
            }
        });
    };

    const pan = Gesture.Pan()
        .enabled(enabled)
        .onUpdate((event) => {
            translateX.value = event.translationX;
            // Rotação sutil baseada no movimento
            rotate.value = interpolate(
                event.translationX,
                [-SCREEN_WIDTH, SCREEN_WIDTH],
                [-15, 15],
                Extrapolation.CLAMP
            );
        })
        .onEnd((event) => {
            if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
                const direction = event.translationX > 0 ? 'right' : 'left';
                runOnJS(handleSuccess)(direction);
            } else {
                runOnJS(resetPosition)();
            }
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { rotate: `${rotate.value}deg` },
            { scale: scale.value }
        ]
    }));

    return (
        <GestureDetector gesture={pan}>
            <Animated.View style={[styles.card, animatedStyle]}>
                {children}
            </Animated.View>
        </GestureDetector>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default SwipeableCard;