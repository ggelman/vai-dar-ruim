import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { ArrowLeft } from 'lucide-react-native';

const Header = ({ title, subtitle, onBack }) => (
    <View style={styles.container}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        
        <Text style={styles.title}>{title}</Text>
        
        {subtitle && (
            <Text style={[
                styles.subtitle, 
                { color: subtitle.includes('FALTAM') ? '#facc15' : '#4ade80'}
            ]}>
                {subtitle}
            </Text>
        )}
    </View>
);

Header.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string, 
    onBack: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 20, 
        marginBottom: 20
    },
    backButton: {
        marginBottom: 16, 
        alignSelf: 'flex-start'
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
    },
    subtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 4,
    },
});

export default Header;