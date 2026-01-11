import { useState, useEffect } from 'react';
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
import { Trash2, Plus, Users, PenTool, Sparkles } from 'lucide-react-native';
import { GENERIC_NAMES } from '../constants/data';
import Button from '../components/Button';
import Header from '../components/Header';
import { useSession } from '../contexts/SessionContext'; 

const Lobby = ({ config, initialPlayers = [], onUpdatePlayers, onStartPlaylist, onBack }) => {
    const { customCards, setCustomCards } = useSession(); 
    
    const [players, setPlayers] = useState(initialPlayers); 
    const [tempName, setTempName] = useState('');
    const [tempCustom, setTempCustom] = useState('');
    const [activeTab, setActiveTab] = useState('players');

    useEffect(() => {
        setPlayers(initialPlayers);
    }, [initialPlayers]);

    const updatePlayers = (newList) => {
        setPlayers(newList);
        if (onUpdatePlayers) onUpdatePlayers(newList);
    };

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
        updatePlayers([...players, ...newPlayers]);
    };

    const addPlayer = () => {
        if (!tempName.trim()) return;
        if (players.length >= config.people) return;
        
        const newP = { id: Date.now(), name: tempName.trim(), sex: 'O' };
        updatePlayers([...players, newP]);
        setTempName('');
    };

    const removePlayer = (id) => {
        updatePlayers(players.filter(p => p.id !== id));
    };

    const addCustomCard = () => {
        if (!tempCustom.trim()) return;
        setCustomCards(prev => [...prev, tempCustom.trim()]);
        setTempCustom('');
    };

    const removeCustomCard = (index) => {
        setCustomCards(prev => prev.filter((_, i) => i !== index));
    };
    
    const remaining = config.people - players.length;
    const isOverLimit = remaining < 0; 
    const canStart = remaining === 0;

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ paddingHorizontal: 24 }}>
                <Header title="Quem vai jogar?" onBack={onBack} />
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity 
                    style={[styles.tabButton, activeTab === 'players' && styles.activeTab]}
                    onPress={() => setActiveTab('players')}
                >
                    <Users size={20} color={activeTab === 'players' ? 'white' : '#71717a'} />
                    <Text style={[styles.tabText, activeTab === 'players' && styles.activeTabText]}>Jogadores</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.tabButton, activeTab === 'custom' && styles.activeTab]}
                    onPress={() => setActiveTab('custom')}
                >
                    <Sparkles size={20} color={activeTab === 'custom' ? '#facc15' : '#71717a'} />
                    <Text style={[styles.tabText, activeTab === 'custom' && { color: '#facc15' }]}>Cartas Coringa</Text>
                </TouchableOpacity>
            </View>
            
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <View style={styles.contentWrapper}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.listSection}>
                            
                            {activeTab === 'players' && (
                                <>
                                    <View style={styles.listHeaderRow}>
                                        <View style={[styles.counterBadge, isOverLimit && { backgroundColor: '#ef4444' }]}>
                                            <Users size={16} color="white" />
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

                                    <View style={[styles.listContainer, isOverLimit && { borderColor: '#ef4444', borderWidth: 1 }]}>
                                        {players.length === 0 ? (
                                            <View style={styles.emptyState}>
                                                <Text style={styles.emptyStateText}>
                                                    Adicione os nomes dos{'\n'}meliantes abaixo 👇
                                                </Text>
                                            </View>
                                        ) : (
                                            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                                                {players.map((player) => (
                                                    <View key={player.id} style={styles.playerCard}>
                                                        <Text style={styles.playerName}>{player.name}</Text>
                                                        <TouchableOpacity onPress={() => removePlayer(player.id)} style={styles.deleteButton}>
                                                            <Trash2 color="#ef4444" size={20} />
                                                        </TouchableOpacity>
                                                    </View>
                                                ))}
                                            </ScrollView>
                                        )}
                                    </View>
                                </>
                            )}

                            {activeTab === 'custom' && (
                                <>
                                    <View style={styles.listHeaderRow}>
                                        <Text style={{color: '#a1a1aa', fontSize: 14}}>
                                            Essas cartas aparecerão aleatoriamente nos jogos. Use para fofocas ou ordens!
                                        </Text>
                                    </View>

                                    <View style={[styles.listContainer, { borderColor: '#facc15' }]}>
                                        {customCards.length === 0 ? (
                                            <View style={styles.emptyState}>
                                                <Sparkles size={32} color="#facc15" style={{opacity: 0.5, marginBottom: 8}} />
                                                <Text style={styles.emptyStateText}>
                                                    Sua chance de ser tóxico.{'\n'}Adicione cartas secretas!
                                                </Text>
                                            </View>
                                        ) : (
                                            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                                                {customCards.map((text, index) => (
                                                    <View key={index} style={[styles.playerCard, { borderLeftWidth: 3, borderLeftColor: '#facc15' }]}>
                                                        <Text style={styles.playerName}>{text}</Text>
                                                        <TouchableOpacity onPress={() => removeCustomCard(index)} style={styles.deleteButton}>
                                                            <Trash2 color="#ef4444" size={20} />
                                                        </TouchableOpacity>
                                                    </View>
                                                ))}
                                            </ScrollView>
                                        )}
                                    </View>
                                </>
                            )}

                        </View>
                    </TouchableWithoutFeedback>

                    <View style={styles.footerSection}>
                        {activeTab === 'players' ? (
                            <View style={styles.inputRow}>
                                <TextInput 
                                    style={styles.input}
                                    placeholder={isOverLimit ? "Remova jogadores!" : (remaining > 0 ? "Nome do jogador..." : "Limite atingido!")}
                                    placeholderTextColor="#71717a"
                                    value={tempName}
                                    onChangeText={setTempName}
                                    onSubmitEditing={addPlayer}
                                    editable={remaining > 0}
                                    returnKeyType="done"
                                />
                                <TouchableOpacity 
                                    style={[styles.addButton, remaining <= 0 && styles.disabledButton]} 
                                    onPress={addPlayer}
                                    disabled={remaining <= 0}
                                >
                                    <Plus color={remaining <= 0 ? "#71717a" : "white"} size={24} />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.inputRow}>
                                <TextInput 
                                    style={[styles.input, { borderColor: '#facc15' }]}
                                    placeholder="Digite sua carta coringa..."
                                    placeholderTextColor="#71717a"
                                    value={tempCustom}
                                    onChangeText={setTempCustom}
                                    onSubmitEditing={addCustomCard}
                                    returnKeyType="done"
                                />
                                <TouchableOpacity 
                                    style={[styles.addButton, { backgroundColor: '#facc15' }]} 
                                    onPress={addCustomCard}
                                >
                                    <Plus color="black" size={24} />
                                </TouchableOpacity>
                            </View>
                        )}

                        <Button 
                            onClick={() => onStartPlaylist(players)} 
                            variant={canStart ? 'primary' : 'disabled'}
                            disabled={!canStart}
                            style={{ width: '100%', marginTop: 12 }}
                        >
                            {isOverLimit ? `Remova ${Math.abs(remaining)} jogadores` : (remaining > 0 ? `Faltam ${remaining} jogadores` : 'COMEÇAR A BAGUNÇA')}
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
    initialPlayers: PropTypes.array,
    onUpdatePlayers: PropTypes.func,
    onStartPlaylist: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#09090b' },
    contentWrapper: { flex: 1, paddingHorizontal: 24, paddingBottom: 20, paddingTop: 10, justifyContent: 'space-between' },
    
    // Tabs
    tabContainer: { flexDirection: 'row', paddingHorizontal: 24, marginBottom: 16, gap: 16 },
    tabButton: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingBottom: 8, borderBottomWidth: 2, borderBottomColor: 'transparent' },
    activeTab: { borderBottomColor: '#a855f7' },
    tabText: { color: '#71717a', fontWeight: 'bold', fontSize: 16 },
    activeTabText: { color: 'white' },

    listSection: { flex: 1, marginBottom: 20 },
    listHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    counterBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#27272a', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 100 },
    counterText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
    autoFillText: { color: '#a855f7', fontSize: 14, fontWeight: '600' },
    listContainer: { flex: 1, backgroundColor: '#18181b', borderRadius: 16, borderWidth: 1, borderColor: '#27272a', overflow: 'hidden' },
    scrollContent: { padding: 12 },
    emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', opacity: 0.5 },
    emptyStateText: { color: 'white', textAlign: 'center', fontSize: 16 },
    playerCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#27272a', paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12, marginBottom: 8 },
    playerName: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    deleteButton: { padding: 4 },
    footerSection: { gap: 0 },
    inputRow: { flexDirection: 'row', gap: 12, marginBottom: 8 },
    input: { flex: 1, height: 56, backgroundColor: '#27272a', borderRadius: 12, paddingHorizontal: 16, color: 'white', fontSize: 16, borderWidth: 1, borderColor: '#3f3f46' },
    addButton: { width: 56, height: 56, backgroundColor: '#a855f7', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    disabledButton: { backgroundColor: '#27272a', borderWidth: 1, borderColor: '#3f3f46' }
});

export default Lobby;