import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';
import { Users, Lock, Flame } from 'lucide-react-native';
import { LEVELS } from '../constants/data';
import Button from '../components/Button';
import Modal from '../components/Modal';

const PartyConfig = ({ onConfigComplete, unlockedItems = [], onPurchase }) => {
    const [people, setPeople] = useState(4);
    const [level, setLevel] = useState(null);
    const [showPaywall, setShowPaywall] = useState(false);

    const handleLevelSelect = (lvlId) => {
        const selectedLevelData = LEVELS[lvlId];
        if (selectedLevelData.price > 0 && !unlockedItems.includes(lvlId) && !unlockedItems.includes('subscription')) {
            setShowPaywall(lvlId);
        } else {
            setLevel(lvlId);
        }
    };

    const handleCreate = () => {
        if (level) onConfigComplete({ people, level });
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120 }}>
                <Text style={styles.headerTitle}>Configurar o Clima</Text>

                <View style={styles.card}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Users size={20} color="#d1d5db" />
                            <Text style={styles.label}>Jogadores</Text>
                        </View>
                        <Text style={styles.valueDisplay}>{people}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <View style={{ flex: 1 }}>
                            <Button variant="ghost" onClick={() => setPeople(Math.max(2, people - 1))} style={{ borderWidth: 1, borderColor: '#3f3f46' }}>-</Button>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Button variant="ghost" onClick={() => setPeople(people + 1)} style={{ borderWidth: 1, borderColor: '#3f3f46' }}>+</Button>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                        <Text style={styles.smallText}>Mín: 2</Text>
                        <Text style={styles.smallText}>Máx: 30+</Text>
                    </View>
                </View>

                <View style={{ marginBottom: 32 }}>
                    <Text style={[styles.label, { marginBottom: 12 }]}>Nível da Bagunça</Text>

                    {Object.values(LEVELS).map((lvl) => {
                        const isLocked = lvl.price > 0 && !unlockedItems.includes(lvl.id) && !unlockedItems.includes('subscription');
                        const isSelected = level === lvl.id;

                        return (
                            <TouchableOpacity
                                key={lvl.id}
                                onPress={() => handleLevelSelect(lvl.id)}
                                activeOpacity={0.9}
                                style={[
                                    styles.levelCard,
                                    isSelected ? { borderColor: lvl.color, backgroundColor: '#27272a' } : { borderColor: '#3f3f46', backgroundColor: '#27272a' }
                                ]}
                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                        <Text style={{fontSize: 24}}>{lvl.id === 'fun' ? '🥳' : lvl.id === 'prohibited' ? '🍻' : '🔥'}</Text>
                                        <Text style={[styles.levelTitle, isSelected ? { color: lvl.color } : { color: 'white' }]}>
                                            {lvl.label}
                                        </Text>
                                    </View>

                                    {isLocked && (
                                        <View style={styles.lockBadge}>
                                            <Lock size={12} color="#eab308" />
                                            <Text style={{ color: '#eab308', fontSize: 12, fontWeight: 'bold' }}>
                                                R$ {lvl.price.toFixed(2)}
                                            </Text>
                                        </View>
                                    )}
                                </View>

                                <Text style={{ color: '#9ca3af', fontSize: 14, marginLeft: 34 }}>{lvl.desc}</Text>

                                {isSelected && (
                                    <View style={[StyleSheet.absoluteFill, { backgroundColor: lvl.color, opacity: 0.05, borderRadius: 12 }]} />
                                )}
                            </TouchableOpacity>
                        )
                    })}
                </View>

                <Button
                    onClick={handleCreate}
                    disabled={!level}
                    variant={level ? 'fun' : 'primary'}
                >
                    CRIAR FESTA
                </Button>
            </ScrollView>

            {showPaywall && (
                <Modal onClose={() => setShowPaywall(false)}>
                    <View style={{ alignItems: 'center' }}>
                        <Flame size={48} color="#dc2626" style={{ marginBottom: 16 }} />
                        <Text style={styles.modalTitle}>Desbloquear VAI DAR RUIM?</Text>
                        <Text style={styles.modalText}>
                            Conteúdo +18, perguntas pesadas e desafios de flerte.
                        </Text>

                        <View style={{ width: '100%', gap: 12 }}>
                            <Button
                                onClick={() => {
                                    onPurchase(showPaywall);
                                    setShowPaywall(false);
                                    setLevel(showPaywall);
                                }}
                                variant="premium"
                            >
                                COMPRAR (R$ 9,90)
                            </Button>

                            <TouchableOpacity onPress={() => setShowPaywall(false)} style={{ padding: 10, alignItems: 'center' }}>
                                <Text style={{ color: '#6b7280', fontSize: 14 }}>Talvez depois</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </SafeAreaView>
    );
};

PartyConfig.propTypes = {
    onConfigComplete: PropTypes.func.isRequired,
    unlockedItems: PropTypes.arrayOf(PropTypes.string),
    onPurchase: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#18181b',
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
    },
    card: {
        backgroundColor: '#27272a',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#3f3f46',
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    valueDisplay: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    smallText: {
        fontSize: 12,
        color: '#71717a',
    },
    levelCard: {
        borderWidth: 2,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    levelTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    lockBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(234, 179, 8, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 100,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 8,
    },
    modalText: {
        fontSize: 16,
        color: '#a1a1aa',
        textAlign: 'center',
        marginBottom: 24,
    },
});

export default PartyConfig;