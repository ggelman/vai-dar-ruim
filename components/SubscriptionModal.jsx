import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { Crown, CheckCircle } from 'lucide-react-native';
import Modal from './Modal';
import Button from './Button';

const SubscriptionModal = ({ onClose, onPurchase }) => (
    <Modal onClose={onClose}>
        <View style={{ alignItems: 'center' }}>
            <View style={{ backgroundColor: '#f59e0b', padding: 12, borderRadius: 50, marginBottom: 16 }}>
                <Crown size={40} color="black" />
            </View>
            <Text style={styles.modalTitle}>VAI DAR RUIM <Text style={{ color: '#f59e0b' }}>PREMIUM</Text></Text>

            <View style={{ width: '100%', gap: 12, marginBottom: 24, marginTop: 12 }}>
                <View style={styles.benefitRow}>
                    <CheckCircle size={20} color="#22c55e" />
                    <Text style={styles.benefitText}>Desbloqueia modo <Text style={{ color: '#dc2626' }}>+18 VAI DAR RUIM</Text></Text>
                </View>
                <View style={styles.benefitRow}>
                    <CheckCircle size={20} color="#22c55e" />
                    <Text style={styles.benefitText}>Todos os jogos liberados</Text>
                </View>
                <View style={styles.benefitRow}>
                    <CheckCircle size={20} color="#22c55e" />
                    <Text style={styles.benefitText}>Sem anúncios na cara</Text>
                </View>
            </View>

            <Button onClick={() => onPurchase('subscription')} variant="premium">
                ASSINAR POR R$ 4,90/SEM
            </Button>

            <TouchableOpacity onPress={onClose} style={{ padding: 12 }}>
                <Text style={{ color: '#6b7280', fontSize: 12 }}>Restaurar compras</Text>
            </TouchableOpacity>
        </View>
    </Modal>
);

SubscriptionModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onPurchase: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
    },
    benefitRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingLeft: 16,
    },
    benefitText: {
        color: 'white',
        fontSize: 16,
    }
});

export default SubscriptionModal;