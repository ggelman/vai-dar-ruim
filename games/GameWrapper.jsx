import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import AdWall from '../components/AdWall';
import ShareModal from '../components/ShareModal';
import RewardedAd from '../components/RewardedAd';
import { LEVELS } from '../constants/data';
import * as Haptics from 'expo-haptics'; // [NOVO IMPORT]

const GameWrapper = ({ children, onNext, gameId, unlockedItems = [], onSubscribe, players, onUpdateStats, level = 'fun' }) => {
    const [cardsViewed, setCardsViewed] = useState(0);
    const [showAd, setShowAd] = useState(false);
    const [showRewardedAd, setShowRewardedAd] = useState(false);
    
    const [showShare, setShowShare] = useState(false);
    const [shareContent, setShareContent] = useState("");

    const FREE_LIMIT = 15; // [AJUSTE]: Aumentado de 8 para 15 para melhor retenção inicial
    const isPremium = unlockedItems.includes('subscription') || unlockedItems.includes(gameId);
    
    // [NOVO]: Cor dinâmica baseada no nível. Fallback para escuro.
    const backgroundColor = LEVELS[level]?.color || '#09090b';

    const enhancedChildren = React.cloneElement(children, {
        onAction: (actionType) => { 
            // [NOVO]: Feedback Tátil Leve a cada carta passada
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

            if (!isPremium) {
                const next = cardsViewed + 1;
                if (next >= FREE_LIMIT) {
                    // [NOVO]: Feedback Tátil de Alerta/Bloqueio
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                    setShowAd(true);
                }
                else setCardsViewed(next);
            }
            if (onUpdateStats && actionType) {
                onUpdateStats(actionType); 
            }
        },
        onNext,
        onShare: (content) => {
            // [NOVO]: Feedback ao abrir compartilhar
            Haptics.selectionAsync();
            setShareContent(content);
            setShowShare(true);
        }
    });

    if (showRewardedAd) {
        return <RewardedAd 
            onRewarded={() => {
                setCardsViewed(0); 
                setShowAd(false); 
                setShowRewardedAd(false);
            }} 
            onDismiss={() => setShowRewardedAd(false)} 
        />
    }

    if (showAd) return <AdWall onWatchAd={() => setShowRewardedAd(true)} onSubscribe={onSubscribe} onSkipGame={onNext} />;

    return (
        // [ALTERAÇÃO]: Aplicando a cor de fundo dinâmica
        <View style={[styles.container, { backgroundColor }]}>
            {enhancedChildren}
            {showShare && <ShareModal content={shareContent} levelColor={backgroundColor} onClose={() => setShowShare(false)} />}
        </View>
    );
};

GameWrapper.propTypes = {
    children: PropTypes.element.isRequired,
    onNext: PropTypes.func.isRequired,
    gameId: PropTypes.string.isRequired,
    unlockedItems: PropTypes.arrayOf(PropTypes.string),
    onSubscribe: PropTypes.func,
    players: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        sex: PropTypes.string
    })),
    onUpdateStats: PropTypes.func,
    level: PropTypes.string // [NOVO]
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});

export default GameWrapper;