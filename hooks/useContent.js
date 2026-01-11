import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DB_CONTENT as FALLBACK_CONTENT } from '../constants/data';

const CACHE_KEY = '@game_content_v1';
// TODO: Atualizar URL quando tiver o JSON final hospedado
const REMOTE_URL = 'https://raw.githubusercontent.com/SEU_USER/SEU_REPO/main/data.json'; 

export const useContent = () => {
    const [content, setContent] = useState(FALLBACK_CONTENT);

    useEffect(() => {
        const loadContent = async () => {
            try {
                // 1. Estratégia Cache-First: Tenta carregar do disco (Instantâneo)
                const cached = await AsyncStorage.getItem(CACHE_KEY);
                if (cached) {
                    const parsed = JSON.parse(cached);
                    // Validação simples para evitar crash com JSON corrompido
                    if (parsed && typeof parsed === 'object') {
                        setContent(parsed);
                    }
                }

                // 2. Atualização Silenciosa: Busca na rede e atualiza cache/estado
                const response = await fetch(REMOTE_URL);
                if (response.ok) {
                    const json = await response.json();
                    setContent(json); 
                    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(json));
                }
            } catch (e) {
                console.log('Modo offline ou erro de fetch. Mantendo conteúdo atual.');
            }
        };

        loadContent();
    }, []);

    return content;
};