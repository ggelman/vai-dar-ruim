import { View, Text, StyleSheet, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import { Trophy, AlertTriangle } from 'lucide-react-native';
import Modal from './Modal';
import Button from './Button';

const ScoreboardModal = ({ stats, onClose }) => {
    const sortedStats = Object.entries(stats || {}).map(([name, data]) => ({ name, ...data }));
    const topDrinker = [...sortedStats].sort((a, b) => (b.drank || 0) - (a.drank || 0))[0];
    const topCoward = [...sortedStats].sort((a, b) => (b.skipped || 0) - (a.skipped || 0))[0];

    return (
        <Modal onClose={onClose}>
            <View style={{ alignItems: 'center', width: '100%' }}>
                <Text style={styles.modalTitle}>PLACAR DA VERGONHA</Text>
                
                <View style={styles.podiumContainer}>
                    <View style={styles.podiumItem}>
                        <Trophy size={32} color="#eab308" />
                        <Text style={styles.podiumLabel}>O CACHACEIRO</Text>
                        <Text style={styles.podiumName}>{topDrinker?.name || '-'}</Text>
                        <Text style={styles.podiumValue}>{topDrinker?.drank || 0} doses</Text>
                    </View>
                    <View style={styles.podiumItem}>
                        <AlertTriangle size={32} color="#ef4444" />
                        <Text style={styles.podiumLabel}>O ARREGÃO</Text>
                        <Text style={styles.podiumName}>{topCoward?.name || '-'}</Text>
                        <Text style={styles.podiumValue}>{topCoward?.skipped || 0} pulos</Text>
                    </View>
                </View>

                <ScrollView style={{ width: '100%', maxHeight: 200, marginTop: 16 }}>
                    {sortedStats.map((player) => (
                        <View key={player.name} style={styles.statRow}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>{player.name}</Text>
                            <View style={{ flexDirection: 'row', gap: 12 }}>
                                <Text style={{ color: '#ef4444' }}>🍺 {player.drank || 0}</Text>
                                <Text style={{ color: '#22c55e' }}>✅ {player.done || 0}</Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>

                <Button onClick={onClose} variant="primary" style={{ marginTop: 20 }}>
                    FECHAR
                </Button>
            </View>
        </Modal>
    );
};

ScoreboardModal.propTypes = {
    stats: PropTypes.objectOf(PropTypes.shape({
        drank: PropTypes.number,
        done: PropTypes.number,
        skipped: PropTypes.number
    })),
    onClose: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
    },
    podiumContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 16,
    },
    podiumItem: {
        alignItems: 'center',
        gap: 4,
    },
    podiumLabel: {
        fontSize: 12,
        color: '#a1a1aa',
        fontWeight: 'bold',
    },
    podiumName: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
    },
    podiumValue: {
        fontSize: 14,
        color: '#d4d4d8',
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#3f3f46',
        width: '100%',
    }
});

export default ScoreboardModal;