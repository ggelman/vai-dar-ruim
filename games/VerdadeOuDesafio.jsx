import React, { useState } from 'react';
import { View, TouchableOpacity, StatusBar, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { X } from 'lucide-react-native'; 
import { useSafeAreaInsets, SafeAreaView } from 'react-native-safe-area-context'; // Importante para o Notch
import AdWall from '../components/AdWall';
import ShareModal from '../components/ShareModal';
import RewardedAd from '../components/RewardedAd';

const GameWrapper = ({ children, onNext, gameId, unlockedItems = [], onSubscribe, players, onUpdateStats, onExit }) => {
    const insets = useSafeAreaInsets(); // Pega as medidas seguras do dispositivo
    
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
            onRewarded={() => { setCardsViewed(0); setShowAd(false); setShowRewardedAd(false); }} 
            onDismiss={() => setShowRewardedAd(false)} 
        />
    }

    if (showAd) return <AdWall onWatchAd={() => setShowRewardedAd(true)} onSubscribe={onSubscribe} onSkipGame={onNext} />;

    return (
        <View style={{ flex: 1, backgroundColor: '#09090b' }}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            
            {/* Botão Sair Posicionado Dinamicamente */}
            <View style={{ 
                position: 'absolute', 
                // AQUI ESTÁ A CORREÇÃO: Soma a área segura do topo + 10px de margem
                top: insets.top + 10, 
                right: 20, 
                zIndex: 100 
            }}>
                <TouchableOpacity 
                    onPress={onExit} 
                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                    style={{
                        padding: 8,
                        // Fundo levemente escuro para garantir contraste se o jogo for claro
                        backgroundColor: 'rgba(0,0,0,0.2)', 
                        borderRadius: 20
                    }}
                >
                    <X size={28} color="white" strokeWidth={3} />
                </TouchableOpacity>
            </View>

            <SafeAreaView style={{ flex: 1 }}>
                {enhancedChildren}
                {showShare && <ShareModal content={shareContent} levelColor="#a855f7" onClose={() => setShowShare(false)} />}
            </SafeAreaView>
        </View>
    );
};

GameWrapper.propTypes = {
    children: PropTypes.element.isRequired,
    onNext: PropTypes.func.isRequired,
    gameId: PropTypes.string.isRequired,
    unlockedItems: PropTypes.arrayOf(PropTypes.string),
    onSubscribe: PropTypes.func,
    players: PropTypes.array,
    onUpdateStats: PropTypes.func,
    onExit: PropTypes.func
};

export default GameWrapper;