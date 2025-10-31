import { Button } from '@/components/ui/button';
import { useGameSession } from '@/hooks/useGameSession';
import { Sparkles } from 'lucide-react';

interface QuickReplyButtonsProps {
  actions: string[];
}

export function QuickReplyButtons({ actions }: QuickReplyButtonsProps) {
  const { sendMessage } = useGameSession();

  const handleClick = (action: string) => {
    sendMessage(action);
  };

  if (!actions || actions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-3 ml-11 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1 w-full">
        <Sparkles className="h-3 w-3" />
        <span>Suggested actions:</span>
      </div>
      {actions.map((action, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          onClick={() => handleClick(action)}
          className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          {action}
        </Button>
      ))}
    </div>
  );
}
