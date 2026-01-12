import { Play, Video } from 'lucide-react-native';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from './Button';

const AdWall = ({ onWatchAd, onSubscribe, onSkipGame }) => (
    <View style={styles.adWallContainer}>
        <View style={styles.iconContainer}>
            <Video size={48} color="#a855f7" />
        </View>
        
        <Text style={styles.adTitle}>Fim da rodada grátis!</Text>
        
        <Text style={styles.adText}>
            A festa não pode parar. Assista um vídeo curto para liberar <Text style={{fontWeight: 'bold', color: '#a855f7'}}>+15 CARTAS</Text> agora.
        </Text>

        <View style={{ width: '100%', marginTop: 32, gap: 12 }}>
            <Button onClick={onWatchAd} variant="premium" style={styles.watchButton}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Play size={20} color="black" fill="black" />
                    <Text style={{ color: 'black', fontWeight: '900', fontSize: 16 }}>
                        LIBERAR +15 CARTAS
                    </Text>
                </View>
            </Button>

            <Button onClick={onSkipGame} variant="ghost">
                <Text style={{ color: '#71717a' }}>Não, quero encerrar o jogo</Text>
            </Button>
        </View>

        <TouchableOpacity onPress={onSubscribe} style={styles.subLink}>
            <Text style={styles.subText}>
                Odeia anúncios? <Text style={{ textDecorationLine: 'underline', color: '#f59e0b' }}>Vire Premium</Text>
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
        backgroundColor: '#09090b', 
        padding: 24,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(168, 85, 247, 0.3)'
    },
    adTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: 'white',
        textAlign: 'center',
        marginBottom: 12,
        letterSpacing: -0.5
    },
    adText: {
        fontSize: 16,
        color: '#a1a1aa',
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 10
    },
    watchButton: {
        borderWidth: 1,
        borderColor: '#fcd34d'
    },
    subLink: {
        marginTop: 40,
        padding: 10
    },
    subText: {
        fontSize: 14,
        color: '#a1a1aa',
        textAlign: 'center',
    }
});

export default AdWall;