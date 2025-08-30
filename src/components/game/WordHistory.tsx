import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface WordEntry {
  word: string;
  player: string;
  playerNumber: 1 | 2;
  isValid: boolean;
  timestamp: Date;
}

interface WordHistoryProps {
  words: WordEntry[];
}

export const WordHistory = ({ words }: WordHistoryProps) => {
  return (
    <Card className="p-4 shadow-card">
      <h3 className="text-lg font-semibold mb-4 text-center">Word History</h3>
      <ScrollArea className="h-64">
        {words.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No words played yet
          </div>
        ) : (
          <div className="space-y-2">
            {words.map((entry, index) => (
              <div
                key={index}
                className={`
                  p-3 rounded-lg gradient-card border transition-smooth animate-word-enter
                  ${entry.isValid ? 'border-success/20' : 'border-destructive/20'}
                  ${entry.playerNumber === 1 ? 'border-l-4 border-l-primary' : 'border-l-4 border-l-secondary'}
                `}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className={`font-medium ${
                      entry.playerNumber === 1 ? 'text-primary' : 'text-secondary'
                    }`}>
                      {entry.word}
                    </span>
                    {!entry.isValid && (
                      <span className="ml-2 text-xs text-destructive">
                        ✗ Invalid
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {entry.player}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
};