import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { DB_CONTENT as FALLBACK_CONTENT } from '../constants/data';

const CACHE_KEY = '@game_content_v1';
const REMOTE_URL = 'https://raw.githubusercontent.com/ggelman/vai-dar-ruim/refs/heads/main/constants/data.jsx'; 

const validateContent = (data) => {
    if (!data || typeof data !== 'object') return false;

    const requiredKeys = [
        'eu_nunca', 
        'desafios_rapidos', 
        'verdade_desafio', 
        'kings', 
        'tribunal', 
        'provavel'
    ];

    for (const key of requiredKeys) {
        if (!Array.isArray(data[key]) || data[key].length === 0) {
            console.warn(`[useContent] Validação falhou: Chave '${key}' inválida ou vazia.`);
            return false;
        }
    }

    return true;
};

export const useContent = () => {
    const [content, setContent] = useState(FALLBACK_CONTENT);

    useEffect(() => {
        const loadContent = async () => {
            try {
                const cached = await AsyncStorage.getItem(CACHE_KEY);
                if (cached) {
                    const parsed = JSON.parse(cached);
                    if (validateContent(parsed)) {
                        setContent(parsed);
                        console.log('[useContent] Cache válido carregado.');
                    } else {
                        console.warn('[useContent] Cache corrompido ignorado.');
                    }
                }
            } catch (e) {
                console.warn('[useContent] Erro ao ler cache (primeira execução?):', e);
            }

            try {
                const response = await fetch(REMOTE_URL);
                if (response.ok) {
                    const json = await response.json();
                    
                    if (validateContent(json)) {
                        setContent(json); 
                        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(json));
                        console.log('[useContent] Conteúdo remoto atualizado com sucesso.');
                    } else {
                        console.error('[useContent] JSON remoto reprovado na validação. Mantendo versão segura.');
                    }
                } else {
                    console.log(`[useContent] Fetch remoto falhou: ${response.status}. Usando offline.`);
                }
            } catch (e) {
                console.log('[useContent] Sem conexão ou erro de rede. Mantendo conteúdo local.');
            }
        };

        loadContent();
    }, []);

    return content;
};