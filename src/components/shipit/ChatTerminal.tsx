import { useEffect, useRef } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ProgressiveMessage } from './ProgressiveMessage';
import mLogo from '@/assets/m-logo.png';


export function ChatTerminal() {
  const messages = useGameStore((state) => state.messages);
  const isLoading = useGameStore((state) => state.isLoading);
  const scrollRef = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        // Get all message elements and scroll to the beginning of the last one
        const messageElements = viewport.querySelectorAll('[data-message-item]');
        const lastMessage = messageElements[messageElements.length - 1];
        
        if (lastMessage) {
          lastMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  }, [messages, isLoading]);

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm py-8">
              <p className="font-mono">// TERMINAL READY</p>
              <p className="mt-2">Start your journey...</p>
            </div>
          ) : (
            messages.map((message) => {
              const isUser = message.role === 'user';
              const segments = message.segments || [];
              
              // Use progressive reveal for AI assistant messages with segments
              if (message.role === 'assistant' && segments.length > 0) {
                return <ProgressiveMessage key={message.id} message={message} />;
              }
              
              // Keep existing rendering for user and system messages
              return (
                <div
                  key={message.id}
                  data-message-item
                  className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      isUser
                        ? 'bg-primary text-primary-foreground'
                        : message.role === 'system'
                        ? 'bg-muted/50 italic text-muted-foreground text-center w-full'
                        : 'bg-muted'
                    }`}
                  >
                    {segments.map((segment, idx) => (
                      <p
                        key={idx}
                        className={segment.type === 'narration' ? 'italic text-muted-foreground' : ''}
                      >
                        {segment.content}
                      </p>
                    ))}
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  {isUser && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              );
            })
          )}
          {isLoading && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={mLogo} alt="M" className="object-contain p-1" />
                <AvatarFallback>M</AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-lg p-3">
                <div className="flex gap-1">
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce delay-100">.</span>
                  <span className="animate-bounce delay-200">.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
