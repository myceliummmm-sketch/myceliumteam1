import { useEffect, useRef } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import everGreenImg from '@/assets/advisor-ever-green.jpg';
import phoenixImg from '@/assets/advisor-phoenix.jpg';
import prismaImg from '@/assets/advisor-prisma.jpg';
import techPriestImg from '@/assets/advisor-tech-priest.jpg';
import toxicImg from '@/assets/advisor-toxic.jpg';
import virgilImg from '@/assets/advisor-virgil.jpg';
import zenImg from '@/assets/advisor-zen.jpg';

const avatarMap: Record<string, string> = {
  ever: everGreenImg,
  prisma: prismaImg,
  toxic: toxicImg,
  phoenix: phoenixImg,
  techpriest: techPriestImg,
  virgil: virgilImg,
  zen: zenImg,
};

export function ChatTerminal() {
  const messages = useGameStore((state) => state.messages);
  const isLoading = useGameStore((state) => state.isLoading);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <ScrollArea className="flex-1 p-4">
        <div ref={scrollRef} className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm py-8">
              <p className="font-mono">// TERMINAL READY</p>
              <p className="mt-2">Start your journey...</p>
            </div>
          ) : (
            messages.map((message) => {
              const isUser = message.role === 'user';
              const speaker = message.segments[0]?.speaker;
              
              return (
                <div
                  key={message.id}
                  className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && speaker && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={avatarMap[speaker]} alt={speaker} />
                      <AvatarFallback>{speaker[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      isUser
                        ? 'bg-primary text-primary-foreground'
                        : message.role === 'system'
                        ? 'bg-muted/50 italic text-muted-foreground text-center w-full'
                        : 'bg-muted'
                    }`}
                  >
                    {!isUser && speaker && (
                      <p className="text-xs font-bold text-primary mb-1">
                        {speaker.toUpperCase()}
                      </p>
                    )}
                    {message.segments.map((segment, idx) => (
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
                <AvatarFallback>AI</AvatarFallback>
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
