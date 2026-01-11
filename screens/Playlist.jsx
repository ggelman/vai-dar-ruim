import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';
import { Plus, X, Lock, Play } from 'lucide-react-native';
import { GAME_LIBRARY } from '../constants/data';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Header from '../components/Header'; // Usa o Header padronizado
import { useDeck } from '../contexts/DeckContext'; // Importa contexto do baralho
import { useSession } from '../contexts/SessionContext';

const Playlist = ({ config, unlockedItems = [], onPurchase, onStartGame, onBack }) => {
    const [playlist, setPlaylist] = useState([]);
    const [showLibrary, setShowLibrary] = useState(false);
    const { customCards } = useSession();
    const { resetDecks } = useDeck();

    useEffect(() => {
        const findGame = (id) => GAME_LIBRARY.find(g => g.id === id);

        let initial = [
            findGame('eu_nunca'),
            findGame('desafios_rapidos'),
            findGame('kings'),
        ].filter(Boolean);

        if (config.level === 'chaos') {
            if (unlockedItems.includes('tribunal') || unlockedItems.includes('subscription')) initial.push(findGame('tribunal'));
            else initial.push(findGame('verdade_desafio'));
        } else {
            initial.push(findGame('verdade_desafio'));
        }
        setPlaylist([...new Set(initial)].filter(Boolean));
    }, [config.level]);

    const addToPlaylist = (game) => {
        setPlaylist([...playlist, game]);
        setShowLibrary(false);
    };

    const removeFromPlaylist = (index) => {
        const newPl = [...playlist];
        newPl.splice(index, 1);
        setPlaylist(newPl);
    };

    const handleStart = () => {
        resetDecks(config.level, customCards); 
        onStartGame(playlist);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header Padronizado */}
            <View style={{ paddingHorizontal: 24 }}>
                <Header title="Playlist da Noite" onBack={onBack} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: -10, marginBottom: 20 }}>
                    <Text style={styles.subText}>Editável • {playlist.length} jogos</Text>
                    <TouchableOpacity
                        onPress={() => setShowLibrary(true)}
                        style={styles.smallAddButton}
                        activeOpacity={0.7}
                    >
                        <Plus size={16} color="white" />
                        <Text style={styles.smallAddButtonText}>ADC JOGO</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.playlistContainer}>
                <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 20 }}>
                    {playlist.map((item, index) => (
                        <View key={`${item.id}-${index}`} style={styles.playlistItem}>
                            <Text style={styles.itemTitle}>{item.title}</Text>
                            <TouchableOpacity onPress={() => removeFromPlaylist(index)} style={{ padding: 4 }}>
                                <X size={20} color="#ef4444" />
                            </TouchableOpacity>
                        </View>
                    ))}
                    {playlist.length === 0 && (
                        <View style={{ padding: 40, alignItems: 'center' }}>
                            <Text style={{ color: '#6b7280' }}>Adicione jogos para começar</Text>
                        </View>
                    )}
                </ScrollView>
            </View>

            <View style={{ padding: 24, paddingBottom: 80 }}>
                <Button
                    onClick={handleStart} // Usa o handler com reset
                    disabled={playlist.length === 0}
                    variant="fun"
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>INICIAR RODADA</Text>
                        <Play size={20} color="white" fill="white" />
                    </View>
                </Button>
            </View>

            <Modal visible={showLibrary} onClose={() => setShowLibrary(false)}>
                <Text style={styles.modalTitle}>Biblioteca de Jogos</Text>
                <ScrollView style={{ maxHeight: 400, width: '100%' }}>
                    {GAME_LIBRARY.map(game => {
                        const isLocked = !game.isFree && !unlockedItems.includes(game.id) && !unlockedItems.includes('subscription');
                        return (
                            <TouchableOpacity
                                key={game.id}
                                onPress={() => isLocked ? onPurchase(game.id) : addToPlaylist(game)}
                                style={styles.libraryItem}
                            >
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.itemTitle, { fontSize: 16 }]}>{game.title}</Text>
                                    <Text style={styles.subText}>{game.desc || "Clássico"}</Text>
                                </View>
                                {isLocked ? <Lock size={16} color="#eab308" /> : <Plus size={24} color="#22c55e" />}
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </Modal>
        </SafeAreaView>
    );
};

Playlist.propTypes = {
    config: PropTypes.shape({ level: PropTypes.string }).isRequired,
    unlockedItems: PropTypes.array,
    onPurchase: PropTypes.func.isRequired,
    onStartGame: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
    // CORREÇÃO VISUAL: Fundo preto
    container: { flex: 1, backgroundColor: '#09090b' },
    subText: { fontSize: 14, color: '#a1a1aa' },
    smallAddButton: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#3f3f46', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 100 },
    smallAddButtonText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
    playlistContainer: { flex: 1, backgroundColor: '#27272a', marginHorizontal: 24, borderRadius: 16 },
    playlistItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#3f3f46' },
    itemTitle: { color: 'white', fontWeight: 'bold', fontSize: 18 },
    modalTitle: { fontSize: 22, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 20 },
    libraryItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#3f3f46' }
});

export default Playlist;