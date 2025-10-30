import { useState } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { useGameSession } from '@/hooks/useGameSession';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Send } from 'lucide-react';

export function InputBar() {
  const [input, setInput] = useState('');
  const { sendMessage } = useGameSession();
  const isLoading = useGameStore((state) => state.isLoading);
  const energy = useGameStore((state) => state.energy);

  const handleSend = async () => {
    if (!input.trim() || isLoading || energy < 1) return;

    const message = input.trim();
    setInput('');
    await sendMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="p-2 sm:p-4 border-t-2">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Shift+Enter for new line)"
            className="min-h-[60px] sm:min-h-[80px] pr-16"
            disabled={isLoading}
          />
          <span className="absolute top-2 right-2 text-[10px] sm:text-xs text-muted-foreground">
            -1⚡ {input.length}/500
          </span>
        </div>
        <Button
          onClick={handleSend}
          disabled={!input.trim() || isLoading || energy < 1}
          size="lg"
          className="h-auto"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
