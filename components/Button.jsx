import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import * as Haptics from 'expo-haptics'; 

const Button = ({ children, onClick, variant = 'primary', disabled = false, style }) => {
    const getBg = () => {
        if (disabled) return '#52525b';
        switch (variant) {
            case 'primary': return '#ffffff';
            case 'outline': return 'transparent';
            case 'fun': return '#22c55e';
            case 'prohibited': return '#eab308';
            case 'chaos': return '#dc2626';
            case 'ghost': return 'transparent';
            case 'premium': return '#f59e0b';
            case 'tribunal': return '#475569';
            case 'expose': return '#9333ea';
            case 'success': return '#22c55e';
            case 'fail': return '#ef4444';
            default: return '#ffffff';
        }
    };

    const getTextColor = () => {
        if (disabled) return '#a1a1aa';
        if (['primary', 'prohibited', 'premium'].includes(variant)) return '#000000';
        if (variant === 'outline') return '#ffffff';
        if (variant === 'ghost') return '#9ca3af';
        return '#ffffff';
    };

    const borderStyle = variant === 'outline' ? { borderWidth: 2, borderColor: '#ffffff' } : {};

    const handlePress = () => {
        if (!disabled) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onClick();
        }
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            disabled={disabled}
            activeOpacity={0.7} 
            style={[
                styles.btnBase,
                { backgroundColor: getBg() },
                borderStyle,
                style
            ]}
        >
            <Text style={[styles.btnText, { color: getTextColor() }]}>
                {children}
            </Text>
        </TouchableOpacity>
    );
};

Button.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired,
    variant: PropTypes.string,
    disabled: PropTypes.bool,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

const styles = StyleSheet.create({
    btnBase: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 16, 
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4, 
    },
    btnText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: 0.5, 
    },
});

export default Button;