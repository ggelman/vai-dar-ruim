import { View, Modal as RNModal, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { X } from 'lucide-react-native';

const Modal = ({ children, onClose, visible = true }) => (
    <RNModal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
        statusBarTranslucent={true} 
        hardwareAccelerated={true} 
    >
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <TouchableOpacity 
                    onPress={onClose} 
                    style={styles.closeButton}
                    hitSlop={{top: 15, bottom: 15, left: 15, right: 15}} 
                >
                    <X size={24} color="#9ca3af" />
                </TouchableOpacity>
                {children}
            </View>
        </View>
    </RNModal>
);

Modal.propTypes = {
    children: PropTypes.node.isRequired,
    onClose: PropTypes.func.isRequired,
    visible: PropTypes.bool 
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)', 
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContent: {
        backgroundColor: '#18181b',
        borderRadius: 16,
        padding: 24,
        paddingTop: 48,
        width: '100%',
        maxWidth: 380,
        position: 'relative',
        borderWidth: 1,
        borderColor: '#3f3f46',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.51,
        shadowRadius: 13.16,
        elevation: 20,
    },
    closeButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 10,
        padding: 4,
    }
});

export default Modal;