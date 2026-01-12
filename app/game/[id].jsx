import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSession } from '../../contexts/SessionContext';
import GameWrapper from '../../games/GameWrapper';

// Imports dos Jogos
import Baralho from '../../games/Baralho';
import CincoSegundos from '../../games/CincoSegundos';
import DesafiosRapidos from '../../games/DesafiosRapidos';
import EuNunca from '../../games/EuNunca';
import GenericGame from '../../games/GenericGame';
import MestreMandou from '../../games/MestreMandou';
import ProvavelGame from '../../games/ProvavelGame';
import RoletaRussa from '../../games/RoletaRussa';
import TribunalGame from '../../games/TribunalGame';
import VerdadeOuDesafio from '../../games/VerdadeOuDesafio';

import { GAME_LIBRARY } from '../../constants/data';

export default function GameRoute() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { playlist, setPlaylist, config, players, unlockedItems, handlePurchase } = useSession();

    const gameInfo = GAME_LIBRARY.find(g => g.id === id) || {};

    const handleNextGame = () => {
        const newPlaylist = [...playlist];
        newPlaylist.shift(); 
        setPlaylist(newPlaylist);

        if (newPlaylist.length === 0) {
            router.replace('/lobby'); 
        } else {
            router.replace(`/game/${newPlaylist[0].id}`);
        }
    };

    const commonProps = {
        level: config.level,
        players: players,
        onNext: handleNextGame,
    };

    let GameComponent;
    switch (id) {
        case 'eu_nunca': GameComponent = <EuNunca {...commonProps} />; break;
        case 'desafios_rapidos': GameComponent = <DesafiosRapidos {...commonProps} />; break;
        case 'verdade_desafio': GameComponent = <VerdadeOuDesafio {...commonProps} />; break;
        case 'kings': GameComponent = <Baralho {...commonProps} />; break;
        case 'tribunal': GameComponent = <TribunalGame {...commonProps} />; break;
        case 'provavel': GameComponent = <ProvavelGame {...commonProps} />; break;
        case 'cinco_segundos': GameComponent = <CincoSegundos {...commonProps} />; break;
        case 'mestre_mandou': GameComponent = <MestreMandou {...commonProps} />; break;
        case 'roleta_russa': GameComponent = <RoletaRussa {...commonProps} />; break;
        default: 
            GameComponent = <GenericGame {...commonProps} gameId={id} title={gameInfo.title || "Jogo"} />;
    }

    if (!id) return null;

    return (
        <GameWrapper
            gameId={id}
            unlockedItems={unlockedItems}
            onSubscribe={handlePurchase}
            onNext={handleNextGame}
            players={players}
            level={config.level} 
        >
            {GameComponent}
        </GameWrapper>
    );
}