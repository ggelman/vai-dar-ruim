import React, { useState } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import AdWall from '../components/AdWall';
import ShareModal from '../components/ShareModal';
import RewardedAd from '../components/RewardedAd';

const GameWrapper = ({ children, onNext, gameId, unlockedItems = [], onSubscribe, players, onUpdateStats }) => {
    const [cardsViewed, setCardsViewed] = useState(0);
    const [showAd, setShowAd] = useState(false);
    const [showRewardedAd, setShowRewardedAd] = useState(false);
    
    const [showShare, setShowShare] = useState(false);
    const [shareContent, setShareContent] = useState("");

    const FREE_LIMIT = 8;
    const isPremium = unlockedItems.includes('subscription') || unlockedItems.includes(gameId);

    const enhancedChildren = React.cloneElement(children, {
        onAction: (actionType) => { 
            if (!isPremium) {
                const next = cardsViewed + 1;
                if (next >= FREE_LIMIT) setShowAd(true);
                else setCardsViewed(next);
            }
            if (onUpdateStats && actionType) {
                onUpdateStats(actionType); 
            }
        },
        onNext,
        onShare: (content) => {
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
        <View style={{flex:1}}>
            {enhancedChildren}
            {showShare && <ShareModal content={shareContent} levelColor="#a855f7" onClose={() => setShowShare(false)} />}
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
    onUpdateStats: PropTypes.func
};

export default GameWrapper;