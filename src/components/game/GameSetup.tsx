import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface GameSetupProps {
  onStart: (player1Name: string, player2Name: string) => void;
}

export const GameSetup = ({ onStart }: GameSetupProps) => {
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');

  const handleStart = () => {
    if (player1Name.trim() && player2Name.trim()) {
      onStart(player1Name.trim(), player2Name.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-card gradient-card">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold gradient-primary bg-clip-text text-transparent">
              Shiritori
            </h1>
            <p className="text-muted-foreground">
              Word game where each word starts with the last letter of the previous word
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="player1" className="text-primary font-medium">
                Player 1 Name
              </Label>
              <Input
                id="player1"
                type="text"
                value={player1Name}
                onChange={(e) => setPlayer1Name(e.target.value)}
                placeholder="Enter Player 1 name"
                className="text-center"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="player2" className="text-secondary font-medium">
                Player 2 Name
              </Label>
              <Input
                id="player2"
                type="text"
                value={player2Name}
                onChange={(e) => setPlayer2Name(e.target.value)}
                placeholder="Enter Player 2 name"
                className="text-center"
              />
            </div>
          </div>

          <Button
            onClick={handleStart}
            disabled={!player1Name.trim() || !player2Name.trim()}
            variant="game"
            size="lg"
            className="w-full"
          >
            Start Game
          </Button>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Words must start with the last letter of the previous word</p>
            <p>• Minimum 4 letters required</p>
            <p>• No repeated words allowed</p>
            <p>• 30 seconds per turn</p>
          </div>
        </div>
      </Card>
    </div>
  );
};