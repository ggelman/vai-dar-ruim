import { View, Text, StyleSheet, Share } from 'react-native';
import PropTypes from 'prop-types';
import { Flame, Camera, Share2 } from 'lucide-react-native';
import Modal from './Modal';
import Button from './Button';

const ShareModal = ({ content, levelColor, onClose }) => {
    const handleShare = async () => {
        try {
            await Share.share({
                message: `Desafio do VAI DAR RUIM: "${content}" - Baixe agora e jogue com a galera!`,
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <Modal onClose={onClose}>
            <View style={{ alignItems: 'center' }}>
                <View style={[styles.shareCard, { backgroundColor: levelColor }]}>
                    <View style={styles.shareHeader}>
                        <Flame size={20} color="white" />
                        <Text style={styles.shareLogoText}>VAI DAR RUIM</Text>
                    </View>
                    
                    <Text style={styles.shareContentText}>
                        "{content}"
                    </Text>

                    <View style={styles.shareFooter}>
                        <Camera size={16} color="rgba(255,255,255,0.8)" />
                        <Text style={styles.shareFooterText}>@vaidarruimapp</Text>
                    </View>
                </View>

                <View style={{ width: '100%', gap: 10, marginTop: 20 }}>
                    <Button onClick={handleShare} variant="primary">
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Share2 size={20} color="black" />
                            <Text style={{color: 'black', fontWeight: 'bold'}}>COMPARTILHAR TEXTO</Text>
                        </View>
                    </Button>
                    <Text style={{ color: '#6b7280', textAlign: 'center', fontSize: 12 }}>
                        (Tire um print da tela para postar no Story!)
                    </Text>
                </View>
            </View>
        </Modal>
    );
};

ShareModal.propTypes = {
    content: PropTypes.string.isRequired,
    levelColor: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
    shareCard: {
        width: 280,
        height: 280,
        borderRadius: 16,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    shareHeader: {
        position: 'absolute',
        top: 16,
        left: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 100,
    },
    shareLogoText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
    },
    shareContentText: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 4,
        paddingHorizontal: 8,
    },
    shareFooter: {
        position: 'absolute',
        bottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    shareFooterText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
    },
});

export default ShareModal;