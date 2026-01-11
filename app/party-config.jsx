import { useRouter } from 'expo-router';
import PartyConfigScreen from '../screens/PartyConfig';
import { useSession } from '../contexts/SessionContext';
import { useDeck } from '../contexts/DeckContext';

export default function PartyConfigRoute() {
    const router = useRouter();
    const { setConfig, unlockedItems, handlePurchase } = useSession();
    const { buildDecks } = useDeck();

    const handleConfigComplete = (newConfig) => {
        setConfig(newConfig);
        buildDecks(newConfig.level); 
        router.push('/lobby');
    };

    return (
        <PartyConfigScreen 
            onConfigComplete={handleConfigComplete}
            unlockedItems={unlockedItems}
            onPurchase={handlePurchase}
        />
    );
}