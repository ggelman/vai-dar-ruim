import { useRouter } from 'expo-router';
import LobbyScreen from '../screens/Lobby';
import { useSession } from '../contexts/SessionContext';

export default function LobbyRoute() {
    const router = useRouter();
    const { config, players, setPlayers } = useSession(); 

    const handleUpdatePlayers = (newList) => {
        setPlayers(newList);
    };

    const handleStartPlaylist = () => {
        router.push('/playlist');
    };

    return (
        <LobbyScreen 
            config={config}
            initialPlayers={players}
            onUpdatePlayers={handleUpdatePlayers}
            onStartPlaylist={handleStartPlaylist}
            onBack={() => router.back()}
        />
    );
}