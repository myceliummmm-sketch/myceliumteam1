import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface QuickRepliesProps {
  suggestions: string[];
  onSelect: (text: string) => void;
  disabled?: boolean;
}

export function QuickReplies({ suggestions, onSelect, disabled }: QuickRepliesProps) {
  if (suggestions.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2 px-2 pb-2">
      {suggestions.map((suggestion, idx) => (
        <Button
          key={idx}
          variant="outline"
          size="sm"
          onClick={() => onSelect(suggestion)}
          disabled={disabled}
          className="text-xs h-7 px-3 animate-fade-in"
          style={{ animationDelay: `${idx * 50}ms` }}
        >
          <Sparkles className="h-3 w-3 mr-1.5 flex-shrink-0" />
          <span className="truncate">{suggestion}</span>
        </Button>
      ))}
    </div>
  );
}
