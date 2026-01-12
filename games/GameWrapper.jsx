import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Users, Plus, Trash2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming, withRepeat } from 'react-native-reanimated';

import AdWall from '../components/AdWall';
import ShareModal from '../components/ShareModal';
import RewardedAd from '../components/RewardedAd';
import Modal from '../components/Modal';
import Button from '../components/Button';
import { LEVELS } from '../constants/data';
import { useSession } from '../contexts/SessionContext';
import { DeckContext } from '../contexts/DeckContext'; 

const GameWrapper = ({ children, onNext, gameId, unlockedItems = [], onSubscribe, onUpdateStats, level = 'fun' }) => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { trackEvent, players, addPlayer, removePlayer } = useSession();
    
    const { chaosTrigger } = useContext(DeckContext);
    
    const [cardsViewed, setCardsViewed] = useState(0);
    const [showAd, setShowAd] = useState(false);
    const [showRewardedAd, setShowRewardedAd] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const [shareContent, setShareContent] = useState("");
    
    const [showPlayerModal, setShowPlayerModal] = useState(false);
    const [newPlayerName, setNewPlayerName] = useState("");

    const flashOpacity = useSharedValue(0);

    const FREE_LIMIT = 15;
    const isPremium = unlockedItems.includes('subscription') || unlockedItems.includes(gameId);
    const backgroundColor = LEVELS[level]?.color || '#09090b';

    useEffect(() => {
        trackEvent('GAME_START', { gameId, level });
    }, [gameId]);

    useEffect(() => {
        if (chaosTrigger > 0) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            
            flashOpacity.value = withSequence(
                withTiming(0.6, { duration: 100 }),
                withTiming(0, { duration: 100 }),
                withTiming(0.4, { duration: 100 }),
                withTiming(0, { duration: 300 })
            );
        }
    }, [chaosTrigger]);

    const flashStyle = useAnimatedStyle(() => ({
        opacity: flashOpacity.value,
        backgroundColor: '#ff0000',
        ...StyleSheet.absoluteFillObject,
        zIndex: 999,
        pointerEvents: 'none' 
    }));

    const handleExit = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.replace('/lobby');
    };

    const handleAddPlayer = () => {
        if (newPlayerName.trim()) {
            addPlayer(newPlayerName);
            setNewPlayerName("");
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    };

    const enhancedChildren = React.cloneElement(children, {
        onAction: (actionType) => { 
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            trackEvent('CARD_ACTION', { gameId, action: actionType });

            if (!isPremium) {
                const next = cardsViewed + 1;
                if (next >= FREE_LIMIT) {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                    setShowAd(true);
                } else {
                    setCardsViewed(next);
                }
            }
            if (onUpdateStats) onUpdateStats(actionType);
        },
        onNext,
        onShare: (content) => {
            Haptics.selectionAsync();
            setShareContent(content);
            setShowShare(true);
        },
        cardsLeft: isPremium ? Infinity : FREE_LIMIT - cardsViewed 
    });

    if (showRewardedAd) {
        return <RewardedAd onRewarded={() => { setCardsViewed(0); setShowAd(false); setShowRewardedAd(false); }} onDismiss={() => setShowRewardedAd(false)} />;
    }

    if (showAd) return <AdWall onWatchAd={() => setShowRewardedAd(true)} onSubscribe={onSubscribe} onSkipGame={onNext} />;

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Animated.View style={flashStyle} />

            <View style={[styles.header, { top: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => setShowPlayerModal(true)} style={styles.iconButton}>
                    <Users size={24} color="white" />
                </TouchableOpacity>

                {!isPremium && (
                    <View style={[styles.counterPill, (FREE_LIMIT - cardsViewed) <= 3 && styles.counterUrgent]}>
                        <Text style={styles.counterText}>{FREE_LIMIT - cardsViewed}</Text>
                    </View>
                )}

                <TouchableOpacity onPress={handleExit} style={styles.iconButton}>
                    <X size={28} color="white" />
                </TouchableOpacity>
            </View>

            {enhancedChildren}

            {showShare && <ShareModal content={shareContent} levelColor={backgroundColor} onClose={() => setShowShare(false)} />}

            <Modal visible={showPlayerModal} onClose={() => setShowPlayerModal(false)}>
                <Text style={styles.modalTitle}>Gerenciar Jogadores</Text>
                
                <View style={styles.inputRow}>
                    <TextInput 
                        style={styles.input} 
                        placeholder="Nome do novo jogador..." 
                        placeholderTextColor="#71717a"
                        value={newPlayerName}
                        onChangeText={setNewPlayerName}
                    />
                    <TouchableOpacity onPress={handleAddPlayer} style={styles.addBtn}>
                        <Plus color="white" size={24} />
                    </TouchableOpacity>
                </View>

                <View style={{ height: 300, width: '100%' }}>
                    <FlatList 
                        data={players}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.playerRow}>
                                <Text style={styles.playerName}>{item.name}</Text>
                                <TouchableOpacity onPress={() => removePlayer(item.id)}>
                                    <Trash2 size={20} color="#ef4444" />
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                </View>
                <Button onClick={() => setShowPlayerModal(false)}>CONCLUÍDO</Button>
            </Modal>
        </View>
    );
};

GameWrapper.propTypes = {
    children: PropTypes.element.isRequired,
    onNext: PropTypes.func.isRequired,
    gameId: PropTypes.string.isRequired,
    unlockedItems: PropTypes.arrayOf(PropTypes.string),
    onSubscribe: PropTypes.func,
    onUpdateStats: PropTypes.func,
    level: PropTypes.string
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        position: 'absolute',
        width: '100%',
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 100,
    },
    iconButton: {
        width: 44, height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center', alignItems: 'center',
    },
    counterPill: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 12, paddingVertical: 4,
        borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)'
    },
    counterUrgent: { backgroundColor: 'rgba(220, 38, 38, 0.8)', borderColor: '#fca5a5' },
    counterText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
    
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 20 },
    inputRow: { flexDirection: 'row', gap: 10, marginBottom: 20, width: '100%' },
    input: { 
        flex: 1, backgroundColor: '#27272a', borderRadius: 12, 
        padding: 12, color: 'white', borderWidth: 1, borderColor: '#3f3f46' 
    },
    addBtn: { 
        backgroundColor: '#22c55e', width: 50, borderRadius: 12, 
        justifyContent: 'center', alignItems: 'center' 
    },
    playerRow: { 
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        padding: 16, borderBottomWidth: 1, borderBottomColor: '#27272a' 
    },
    playerName: { color: 'white', fontSize: 16 }
});

export default GameWrapper;