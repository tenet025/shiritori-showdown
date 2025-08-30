import { useState } from 'react';
import { GameSetup } from './GameSetup';
import { ShiritoriGame } from './ShiritoriGame';

export const Game = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState<{ player1: string; player2: string } | null>(null);

  const handleGameStart = (player1Name: string, player2Name: string) => {
    setPlayers({ player1: player1Name, player2: player2Name });
    setGameStarted(true);
  };

  const handleRestart = () => {
    setGameStarted(false);
    setPlayers(null);
  };

  if (!gameStarted || !players) {
    return <GameSetup onStart={handleGameStart} />;
  }

  return (
    <ShiritoriGame
      player1Name={players.player1}
      player2Name={players.player2}
      onRestart={handleRestart}
    />
  );
};