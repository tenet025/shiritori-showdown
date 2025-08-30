import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface WordInputProps {
  onSubmit: (word: string) => void;
  isActive: boolean;
  expectedFirstLetter?: string;
  playerNumber: 1 | 2;
  isLoading?: boolean;
}

export const WordInput = ({ 
  onSubmit, 
  isActive, 
  expectedFirstLetter, 
  playerNumber,
  isLoading = false 
}: WordInputProps) => {
  const [word, setWord] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const gradientClass = playerNumber === 1 ? 'gradient-player-1' : 'gradient-player-2';

  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  useEffect(() => {
    setWord('');
  }, [isActive]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (word.trim() && isActive) {
      onSubmit(word.trim().toLowerCase());
      setWord('');
    }
  };

  const isValidStart = !expectedFirstLetter || 
    word.toLowerCase().startsWith(expectedFirstLetter.toLowerCase());

  return (
    <Card className={`
      p-6 relative overflow-hidden transition-smooth
      ${isActive ? 'shadow-active' : 'shadow-card opacity-50'}
    `}>
      {isActive && (
        <div className={`absolute inset-0 ${gradientClass} opacity-5`} />
      )}
      
      <div className="relative z-10">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center space-y-2">
            <h3 className={`text-lg font-semibold ${
              playerNumber === 1 ? 'text-primary' : 'text-secondary'
            }`}>
              {isActive ? 'Your Turn!' : 'Waiting...'}
            </h3>
            {expectedFirstLetter && isActive && (
              <p className="text-sm text-muted-foreground">
                Word must start with: <span className="font-bold text-accent">
                  {expectedFirstLetter.toUpperCase()}
                </span>
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Input
              ref={inputRef}
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder={isActive ? "Enter your word..." : "Wait for your turn"}
              disabled={!isActive || isLoading}
              className={`text-center text-lg transition-smooth ${
                word && !isValidStart ? 'border-destructive focus:border-destructive' : ''
              }`}
            />
            
            {word && !isValidStart && (
              <p className="text-xs text-destructive text-center">
                Word must start with "{expectedFirstLetter?.toUpperCase()}"
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={!isActive || !word.trim() || !isValidStart || isLoading}
            className={`w-full ${gradientClass} hover:opacity-90 transition-smooth`}
          >
            {isLoading ? 'Checking...' : 'Submit Word'}
          </Button>
        </form>
      </div>
    </Card>
  );
};