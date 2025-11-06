import { useState } from 'react';
import { ChatMessage } from '@/types/game';
import { MessageBubble } from './MessageBubble';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface ProgressiveMessageProps {
  message: ChatMessage;
}

export function ProgressiveMessage({ message }: ProgressiveMessageProps) {
  const segments = message.segments || [];
  const [visibleCount, setVisibleCount] = useState(1);

  if (segments.length === 0) {
    return null;
  }

  const hasMore = visibleCount < segments.length;
  const visibleSegments = segments.slice(0, visibleCount);

  const handleContinue = () => {
    setVisibleCount(prev => Math.min(prev + 1, segments.length));
  };

  const handleShowAll = () => {
    setVisibleCount(segments.length);
  };

  return (
    <div data-message-item className="flex flex-col gap-2">
      {visibleSegments.map((segment, idx) => {
        const prevSpeaker = idx > 0 ? visibleSegments[idx - 1].speaker : null;
        const showAvatar = segment.speaker !== prevSpeaker;
        const isNewlyRevealed = idx === visibleCount - 1 && idx > 0;
        
        return (
          <MessageBubble
            key={idx}
            segment={segment}
            showAvatar={showAvatar}
            animate={isNewlyRevealed}
          />
        );
      })}

      {hasMore && (
        <div className="flex gap-2 items-center ml-11">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleContinue}
            className="text-xs hover:bg-primary/10"
          >
            <ChevronDown className="h-3 w-3 mr-1" />
            Continue reading...
          </Button>
          <span className="text-muted-foreground text-xs">·</span>
          <Button
            size="sm"
            variant="link"
            onClick={handleShowAll}
            className="text-xs text-muted-foreground hover:text-primary p-0"
          >
            Show all ({segments.length - visibleCount} more)
          </Button>
        </div>
      )}

      <p className="text-xs text-muted-foreground ml-11 mt-1">
        {new Date(message.createdAt).toLocaleTimeString()}
      </p>
    </div>
  );
}
