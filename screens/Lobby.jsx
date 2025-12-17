import { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    TextInput, 
    TouchableOpacity, 
    KeyboardAvoidingView, 
    Platform, 
    TouchableWithoutFeedback, 
    Keyboard 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';
import { Trash2, Plus, Users } from 'lucide-react-native';
import { GENERIC_NAMES } from '../constants/data';
import Button from '../components/Button';
import Header from '../components/Header';

const Lobby = ({ config, onStartPlaylist, onBack }) => {
    const [players, setPlayers] = useState([]);
    const [tempName, setTempName] = useState('');

    const autoFillNames = () => {
        const missing = config.people - players.length;
        if (missing <= 0) return;

        let availableNames = GENERIC_NAMES.filter(n => !players.some(p => p.name === n));
        availableNames.sort(() => Math.random() - 0.5);

        const newPlayers = [];
        for (let i = 0; i < missing; i++) {
            const name = availableNames[i] || `Jogador ${players.length + i + 1}`;
            newPlayers.push({ id: Date.now() + i, name, sex: 'O' });
        }
        setPlayers(prev => [...prev, ...newPlayers]);
    };

    const addPlayer = () => {
        if (!tempName.trim()) return;
        if (players.length >= config.people) return;
        
        setPlayers([...players, { id: Date.now(), name: tempName.trim(), sex: 'O' }]);
        setTempName('');
    };

    const removePlayer = (id) => {
        setPlayers(players.filter(p => p.id !== id));
    };

    const remaining = config.people - players.length;

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Quem vai jogar?" onBack={onBack} />
            
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <View style={styles.contentWrapper}>
                    
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.listSection}>
                            <View style={styles.listHeaderRow}>
                                <View style={styles.counterBadge}>
                                    <Users size={16} color="#a855f7" />
                                    <Text style={styles.counterText}>
                                        {players.length} / {config.people}
                                    </Text>
                                </View>
                                {remaining > 0 && (
                                    <TouchableOpacity onPress={autoFillNames}>
                                        <Text style={styles.autoFillText}>Auto-completar</Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            <View style={styles.listContainer}>
                                {players.length === 0 ? (
                                    <View style={styles.emptyState}>
                                        <Text style={styles.emptyStateText}>
                                            Adicione os nomes dos{'\n'}meliantes abaixo 👇
                                        </Text>
                                    </View>
                                ) : (
                                    <ScrollView 
                                        contentContainerStyle={styles.scrollContent}
                                        showsVerticalScrollIndicator={false}
                                        keyboardShouldPersistTaps="handled"
                                    >
                                        {players.map((player) => (
                                            <View key={player.id} style={styles.playerCard}>
                                                <Text style={styles.playerName}>{player.name}</Text>
                                                <TouchableOpacity 
                                                    onPress={() => removePlayer(player.id)}
                                                    style={styles.deleteButton}
                                                >
                                                    <Trash2 color="#ef4444" size={20} />
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                    </ScrollView>
                                )}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>

                    <View style={styles.footerSection}>
                        <View style={styles.inputRow}>
                            <TextInput 
                                style={styles.input}
                                placeholder={remaining > 0 ? "Nome do jogador..." : "Limite atingido!"}
                                placeholderTextColor="#71717a"
                                value={tempName}
                                onChangeText={setTempName}
                                onSubmitEditing={addPlayer}
                                editable={remaining > 0}
                                returnKeyType="done"
                            />
                            <TouchableOpacity 
                                style={[styles.addButton, remaining === 0 && styles.disabledButton]} 
                                onPress={addPlayer}
                                disabled={remaining === 0}
                            >
                                <Plus color={remaining === 0 ? "#71717a" : "white"} size={24} />
                            </TouchableOpacity>
                        </View>

                        <Button 
                            onClick={() => onStartPlaylist(players)} 
                            variant={remaining === 0 ? 'primary' : 'disabled'}
                            disabled={remaining > 0}
                            style={{ width: '100%', marginTop: 12 }}
                        >
                            {remaining > 0 ? `Faltam ${remaining} jogadores` : 'COMEÇAR A BAGUNÇA'}
                        </Button>
                    </View>

                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

Lobby.propTypes = {
    config: PropTypes.shape({
        people: PropTypes.number,
        level: PropTypes.string
    }).isRequired,
    onStartPlaylist: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#09090b',
    },
    contentWrapper: {
        flex: 1,
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 10,
        justifyContent: 'space-between',
    },
    
    listSection: {
        flex: 1,
        marginBottom: 20,
    },
    listHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    counterBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#27272a',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 100,
    },
    counterText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    autoFillText: {
        color: '#a855f7',
        fontSize: 14,
        fontWeight: '600',
    },
    listContainer: {
        flex: 1,
        backgroundColor: '#18181b', 
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#27272a',
        overflow: 'hidden',
    },
    scrollContent: {
        padding: 12,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.5,
    },
    emptyStateText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
    },

    playerCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#27272a',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    playerName: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    deleteButton: {
        padding: 4,
    },

    footerSection: {
        gap: 0,
    },
    inputRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 8,
    },
    input: {
        flex: 1,
        height: 56,
        backgroundColor: '#27272a',
        borderRadius: 12,
        paddingHorizontal: 16,
        color: 'white',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#3f3f46',
    },
    addButton: {
        width: 56,
        height: 56,
        backgroundColor: '#a855f7',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#27272a',
        borderWidth: 1,
        borderColor: '#3f3f46',
    }
});

export default Lobby;