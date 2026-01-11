import { useRouter } from 'expo-router';
import PlaylistScreen from '../screens/Playlist';
import { useSession } from '../contexts/SessionContext';

export default function PlaylistRoute() {
    const router = useRouter();
    const { config, unlockedItems, setPlaylist, handlePurchase } = useSession();

    const handleStartGame = (gameList) => {
        setPlaylist(gameList); 
        if (gameList.length > 0) {
            router.push(`/game/${gameList[0].id}`);
        }
    };

    return (
        <PlaylistScreen 
            config={config}
            unlockedItems={unlockedItems}
            onPurchase={handlePurchase}
            onStartGame={handleStartGame}
            onBack={() => router.back()}
        />
    );
}