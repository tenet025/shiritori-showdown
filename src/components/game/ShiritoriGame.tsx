import { useState, useCallback, useEffect } from 'react';
import { PlayerCard } from './PlayerCard';
import { WordInput } from './WordInput';
import { WordHistory } from './WordHistory';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { validateWord } from '@/services/dictionaryService';
import { useToast } from '@/hooks/use-toast';

interface Player {
  name: string;
  score: number;
  lastWord?: string;
}

interface WordEntry {
  word: string;
  player: string;
  playerNumber: 1 | 2;
  isValid: boolean;
  timestamp: Date;
}

interface ShiritoriGameProps {
  player1Name: string;
  player2Name: string;
  onRestart: () => void;
}

export const ShiritoriGame = ({ player1Name, player2Name, onRestart }: ShiritoriGameProps) => {
  const [players, setPlayers] = useState<[Player, Player]>([
    { name: player1Name, score: 0 },
    { name: player2Name, score: 0 }
  ]);
  const [currentPlayer, setCurrentPlayer] = useState<0 | 1>(0);
  const [wordHistory, setWordHistory] = useState<WordEntry[]>([]);
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
  const [isValidating, setIsValidating] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [lastLetter, setLastLetter] = useState<string>('');
  
  const { toast } = useToast();

  const getExpectedFirstLetter = () => {
    if (wordHistory.length === 0) return undefined;
    return lastLetter;
  };

  const handleTimeUp = useCallback(() => {
    if (gameEnded) return;
    
    toast({
      title: "Time's up!",
      description: `${players[currentPlayer].name} loses a point for running out of time.`,
      variant: "destructive",
    });

    setPlayers(prev => {
      const newPlayers = [...prev] as [Player, Player];
      newPlayers[currentPlayer].score = Math.max(0, newPlayers[currentPlayer].score - 1);
      return newPlayers;
    });

    switchPlayer();
  }, [currentPlayer, players, gameEnded, toast]);

  const switchPlayer = () => {
    setCurrentPlayer(prev => prev === 0 ? 1 : 0);
  };

  const validateWordStructure = (word: string): { isValid: boolean; error?: string } => {
    if (word.length < 4) {
      return { isValid: false, error: "Word must be at least 4 letters long" };
    }

    if (usedWords.has(word)) {
      return { isValid: false, error: "Word has already been used" };
    }

    const expectedLetter = getExpectedFirstLetter();
    if (expectedLetter && !word.startsWith(expectedLetter.toLowerCase())) {
      return { isValid: false, error: `Word must start with "${expectedLetter.toUpperCase()}"` };
    }

    return { isValid: true };
  };

  const handleWordSubmit = async (word: string) => {
    if (isValidating || gameEnded) return;

    setIsValidating(true);

    try {
      // First validate structure
      const structureValidation = validateWordStructure(word);
      if (!structureValidation.isValid) {
        toast({
          title: "Invalid word!",
          description: structureValidation.error,
          variant: "destructive",
        });

        // Add invalid word to history and deduct point
        const wordEntry: WordEntry = {
          word,
          player: players[currentPlayer].name,
          playerNumber: (currentPlayer + 1) as 1 | 2,
          isValid: false,
          timestamp: new Date(),
        };

        setWordHistory(prev => [wordEntry, ...prev]);
        setPlayers(prev => {
          const newPlayers = [...prev] as [Player, Player];
          newPlayers[currentPlayer].score = Math.max(0, newPlayers[currentPlayer].score - 1);
          return newPlayers;
        });

        setIsValidating(false);
        switchPlayer();
        return;
      }

      // Then validate with dictionary API
      const dictionaryValidation = await validateWord(word);
      const isValid = dictionaryValidation.isValid;

      const wordEntry: WordEntry = {
        word,
        player: players[currentPlayer].name,
        playerNumber: (currentPlayer + 1) as 1 | 2,
        isValid,
        timestamp: new Date(),
      };

      setWordHistory(prev => [wordEntry, ...prev]);

      if (isValid) {
        // Valid word - add point and update game state
        setUsedWords(prev => new Set([...prev, word]));
        setLastLetter(word.charAt(word.length - 1));
        
        setPlayers(prev => {
          const newPlayers = [...prev] as [Player, Player];
          newPlayers[currentPlayer].score += 1;
          newPlayers[currentPlayer].lastWord = word;
          return newPlayers;
        });

        toast({
          title: "Great word!",
          description: `${word.toUpperCase()} is a valid word. +1 point!`,
        });
      } else {
        // Invalid word - deduct point
        setPlayers(prev => {
          const newPlayers = [...prev] as [Player, Player];
          newPlayers[currentPlayer].score = Math.max(0, newPlayers[currentPlayer].score - 1);
          return newPlayers;
        });

        toast({
          title: "Invalid word!",
          description: `"${word}" is not a valid English word. -1 point!`,
          variant: "destructive",
        });
      }

      switchPlayer();
    } catch (error) {
      console.error('Error validating word:', error);
      toast({
        title: "Error",
        description: "Failed to validate word. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header */}
      <Card className="p-4 shadow-card">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Shiritori Game</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onRestart}>
              New Game
            </Button>
          </div>
        </div>
      </Card>

      {/* Players */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PlayerCard
          name={players[0].name}
          score={players[0].score}
          isActive={currentPlayer === 0}
          playerNumber={1}
          timeLeft={30}
          onTimeUp={handleTimeUp}
          lastWord={players[0].lastWord}
        />
        <PlayerCard
          name={players[1].name}
          score={players[1].score}
          isActive={currentPlayer === 1}
          playerNumber={2}
          timeLeft={30}
          onTimeUp={handleTimeUp}
          lastWord={players[1].lastWord}
        />
      </div>

      {/* Word Input */}
      <div className="max-w-md mx-auto">
        <WordInput
          onSubmit={handleWordSubmit}
          isActive={!gameEnded}
          expectedFirstLetter={getExpectedFirstLetter()}
          playerNumber={(currentPlayer + 1) as 1 | 2}
          isLoading={isValidating}
        />
      </div>

      {/* Word History */}
      <div className="max-w-2xl mx-auto">
        <WordHistory words={wordHistory} />
      </div>

      {/* Game Info */}
      <Card className="p-4 shadow-card max-w-md mx-auto">
        <div className="text-center space-y-2">
          <div className="text-sm text-muted-foreground">
            Next word must start with:
          </div>
          <div className="text-2xl font-bold text-accent">
            {lastLetter ? lastLetter.toUpperCase() : 'Any letter'}
          </div>
          <div className="text-xs text-muted-foreground">
            Words used: {usedWords.size}
          </div>
        </div>
      </Card>
    </div>
  );
};