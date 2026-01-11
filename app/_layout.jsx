import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // [NOVO IMPORT]
import { SessionProvider } from '../contexts/SessionContext';
import { DeckProvider } from '../contexts/DeckContext';

export default function Layout() {
    return (
        // [ALTERAÇÃO]: Envolvendo o app com GestureHandlerRootView para habilitar gestos complexos
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <SessionProvider>
                    <DeckProvider>
                        <StatusBar style="light" />
                        <Stack 
                            screenOptions={{ 
                                headerShown: false,
                                contentStyle: { backgroundColor: '#09090b' },
                                animation: 'fade'
                            }}
                        >
                            <Stack.Screen name="index" />
                            <Stack.Screen name="party-config" />
                            <Stack.Screen name="lobby" />
                            <Stack.Screen name="playlist" />
                            <Stack.Screen name="game/[id]" options={{ gestureEnabled: false }} />
                        </Stack>
                    </DeckProvider>
                </SessionProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}