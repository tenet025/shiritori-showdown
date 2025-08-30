import { Card } from '@/components/ui/card';
import { GameTimer } from './GameTimer';

interface PlayerCardProps {
  name: string;
  score: number;
  isActive: boolean;
  playerNumber: 1 | 2;
  timeLeft: number;
  onTimeUp: () => void;
  lastWord?: string;
}

export const PlayerCard = ({ 
  name, 
  score, 
  isActive, 
  playerNumber, 
  timeLeft, 
  onTimeUp,
  lastWord 
}: PlayerCardProps) => {
  const playerColor = playerNumber === 1 ? 'player-1' : 'player-2';
  const gradientClass = playerNumber === 1 ? 'gradient-player-1' : 'gradient-player-2';

  return (
    <Card className={`
      p-6 relative overflow-hidden transition-smooth
      ${isActive ? 'shadow-active animate-pulse-glow' : 'shadow-card opacity-75'}
      ${isActive ? 'animate-turn-switch' : ''}
    `}>
      {isActive && (
        <div className={`absolute inset-0 ${gradientClass} opacity-10`} />
      )}
      
      <div className="relative z-10 flex flex-col items-center space-y-4">
        <div className="text-center">
          <h3 className={`text-xl font-bold text-${playerColor === 'player-1' ? 'primary' : 'secondary'}`}>
            {name}
          </h3>
          <p className="text-muted-foreground">Player {playerNumber}</p>
        </div>

        <GameTimer
          duration={30}
          isActive={isActive}
          onTimeUp={onTimeUp}
          playerColor={playerColor}
        />

        <div className="text-center space-y-2">
          <div className="text-3xl font-bold">{score}</div>
          <div className="text-sm text-muted-foreground">Score</div>
        </div>

        {lastWord && (
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Last word:</div>
            <div className="font-medium">{lastWord}</div>
          </div>
        )}

        {isActive && (
          <div className={`
            absolute -bottom-2 left-1/2 transform -translate-x-1/2 
            w-8 h-2 rounded-full ${gradientClass}
            animate-pulse-glow
          `} />
        )}
      </div>
    </Card>
  );
};