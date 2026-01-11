import { Play, Video } from 'lucide-react-native';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from './Button';

const AdWall = ({ onWatchAd, onSubscribe, onSkipGame }) => (
    <View style={styles.adWallContainer}>
        <Video size={64} color="#a855f7" style={{ marginBottom: 16 }} />
        <Text style={styles.adTitle}>Acabaram as cartas grátis!</Text>
        <Text style={styles.adText}>
            Pô agora que tá ficando bom! Assista um vídeo curto para liberar mais loucura.
        </Text>

        <View style={{ width: '100%', marginTop: 20, gap: 10 }}>
            <Button onClick={onWatchAd} variant="premium">
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Play size={20} color="black" fill="black" />
                    <Text style={{ color: 'black', fontWeight: 'bold' }}>ASSISTIR VÍDEO (LIBERAR)</Text>
                </View>
            </Button>

            <Button onClick={onSkipGame} variant="ghost" style={{ marginTop: 0 }}>
                <Text style={{ color: '#6b7280' }}>Pular para Encerrar Jogo</Text>
            </Button>
        </View>

        <TouchableOpacity onPress={onSubscribe} style={{ marginTop: 20, padding: 10 }}>
            <Text style={[styles.adSmallText, { textDecorationLine: 'underline', color: '#f59e0b' }]}>
                Ou assine o Premium por R$ 4,90/sem
            </Text>
        </TouchableOpacity>
    </View>
);

AdWall.propTypes = {
    onWatchAd: PropTypes.func.isRequired,
    onSubscribe: PropTypes.func.isRequired,
    onSkipGame: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
    adWallContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#18181b',
        padding: 24,
    },
    adTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 8,
    },
    adText: {
        fontSize: 16,
        color: '#a1a1aa',
        textAlign: 'center',
    },
    adSmallText: {
        fontSize: 14,
        color: '#a1a1aa',
        textAlign: 'center',
    }
});

export default AdWall;