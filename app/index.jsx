import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import Splash from '../screens/Splash'; 
import { useSession } from '../contexts/SessionContext';

export default function Index() {
    const router = useRouter();
    const { isLoaded } = useSession();

    const handleStart = () => {
        if (isLoaded) {
            router.replace('/party-config');
        }
    };

    return <Splash onStart={handleStart} />;
}