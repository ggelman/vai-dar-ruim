import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Flame } from 'lucide-react-native';
import Button from '../components/Button';

const Splash = ({ onStart }) => (
    <View style={styles.splashContainer}>
        <View style={{ marginBottom: 30, alignItems: 'center' }}>
            <View style={styles.glowContainer}>
                <View style={[styles.glowLayer, { width: 200, height: 200, borderRadius: 100, opacity: 0.1 }]} />
                <View style={[styles.glowLayer, { width: 140, height: 140, borderRadius: 70, opacity: 0.2 }]} />
                <View style={[styles.glowLayer, { width: 80, height: 80, borderRadius: 40, opacity: 0.3 }]} />
            </View>
            <Flame size={80} color="#a855f7" />
        </View>

        <Text style={styles.splashTitle}>
            VAI DAR{'\n'}
            <Text style={{ color: '#a855f7' }}>RUIM</Text>
        </Text>

        <Text style={styles.splashSubtitle}>O organizador oficial do caos.</Text>

        <View style={{ width: '100%', maxWidth: 300 }}>
            <Button onClick={onStart}>COMEÇAR A BAGUNÇA</Button>
        </View>
    </View>
);

Splash.propTypes = {
    onStart: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
    splashContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#09090b',
    },
    glowContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    glowLayer: {
        position: 'absolute',
        backgroundColor: '#a855f7',
    },
    splashTitle: {
        fontSize: 64,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        lineHeight: 64,
        marginBottom: 12,
        textShadowColor: 'rgba(168, 85, 247, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 15,
    },
    splashSubtitle: {
        fontSize: 16,
        color: '#a1a1aa',
        marginBottom: 40,
    },
});

export default Splash;
