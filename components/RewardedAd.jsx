import React, { useEffect, useState } from 'react';
import { Button, Text, View, ActivityIndicator, Alert } from 'react-native';

let RewardedAd, RewardedAdEventType, TestIds;
let isAdMobAvailable = false;

try {
  const AdMob = require('react-native-google-mobile-ads');
  RewardedAd = AdMob.RewardedAd;
  RewardedAdEventType = AdMob.RewardedAdEventType;
  TestIds = AdMob.TestIds;
  isAdMobAvailable = true;
} catch (error) {
  console.log("AdMob não disponível (Expo Go detectado). Usando modo Mock.");
  isAdMobAvailable = false;
}

const adUnitId = isAdMobAvailable && __DEV__ ? TestIds.REWARDED : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyy';

let rewarded = null;
if (isAdMobAvailable) {
    rewarded = RewardedAd.createForAdRequest(adUnitId, {
        keywords: ['game', 'party', 'drink'],
    });
}

const RewardedAdComponent = ({ onReward, onDismiss }) => {
  const [loaded, setLoaded] = useState(false);

  if (!isAdMobAvailable) {
      const handleMockWatch = () => {
          Alert.alert(
              "Modo de Teste (Expo Go)",
              "Como você está no Expo Go, o AdMob não carrega. Simulando que você assistiu o vídeo.",
              [{ text: "OK (Receber Recompensa)", onPress: onReward }]
          );
      };

      return (
        <View style={{ width: '100%', marginTop: 20 }}>
            <View style={{ backgroundColor: '#a855f7', borderRadius: 12, overflow: 'hidden', padding: 4 }}>
                <Button
                    title="SIMULAR VÍDEO (+CARTAS)"
                    color="#a855f7"
                    onPress={handleMockWatch}
                />
            </View>
            <Text style={{color: 'gray', fontSize: 10, textAlign: 'center', marginTop: 4}}>
                *AdMob desativado no Expo Go
            </Text>
        </View>
      );
  }

  useEffect(() => {
    if (!rewarded) return;

    const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setLoaded(true);
    });

    const unsubscribeEarned = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, reward => {
      if (onReward) onReward();
    });

    const unsubscribeClosed = rewarded.addAdEventListener(RewardedAdEventType.CLOSED, () => {
        setLoaded(false);
        rewarded.load();
        if (onDismiss) onDismiss();
    });

    rewarded.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeClosed();
    };
  }, []);

  if (!loaded) {
    return (
        <View style={{ padding: 20, alignItems: 'center' }}>
            <ActivityIndicator size="small" color="#a855f7" />
            <Text style={{ color: '#666', marginTop: 10, fontSize: 12 }}>Carregando anúncio...</Text>
        </View>
    );
  }

  return (
    <View style={{ width: '100%', marginTop: 20 }}>
        <View style={{ backgroundColor: '#f59e0b', borderRadius: 12, overflow: 'hidden' }}>
            <Button
                title="ASSISTIR VÍDEO (+CARTAS)"
                color="#f59e0b"
                onPress={() => rewarded.show()}
            />
        </View>
    </View>
  );
};

export default RewardedAdComponent;