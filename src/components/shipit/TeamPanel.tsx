import { useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import everGreenImg from '@/assets/advisor-ever-green.jpg';
import phoenixImg from '@/assets/advisor-phoenix.jpg';
import prismaImg from '@/assets/advisor-prisma.jpg';
import techPriestImg from '@/assets/advisor-tech-priest.jpg';
import toxicImg from '@/assets/advisor-toxic.jpg';
import virgilImg from '@/assets/advisor-virgil.jpg';
import zenImg from '@/assets/advisor-zen.jpg';

const teamMembers = [
  { id: 'ever', name: 'Ever Green', avatar: everGreenImg },
  { id: 'prisma', name: 'Prisma', avatar: prismaImg },
  { id: 'toxic', name: 'Toxic', avatar: toxicImg },
  { id: 'phoenix', name: 'Phoenix', avatar: phoenixImg },
  { id: 'techpriest', name: 'Tech Priest', avatar: techPriestImg },
  { id: 'virgil', name: 'Virgil', avatar: virgilImg },
  { id: 'zen', name: 'Zen', avatar: zenImg },
];

const moodEmojis = {
  happy: '😊',
  neutral: '😐',
  stressed: '😰',
  excited: '🤩',
};

export function TeamPanel() {
  const teamMood = useGameStore((state) => state.teamMood);
  const activeSpeaker = useGameStore((state) => state.activeSpeaker);
  const messages = useGameStore((state) => state.messages);
  const setActiveSpeaker = useGameStore((state) => state.setActiveSpeaker);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'assistant' && lastMessage.segments) {
      const lastSpeech = lastMessage.segments
        .filter(s => s.type === 'speech' && s.speaker)
        .pop();
      
      if (lastSpeech?.speaker) {
        setActiveSpeaker(lastSpeech.speaker);
        
        // Clear active speaker after 3 seconds
        const timeout = setTimeout(() => {
          setActiveSpeaker(null);
        }, 3000);
        
        return () => clearTimeout(timeout);
      }
    }
  }, [messages, setActiveSpeaker]);

  return (
    <Card className="p-4">
      <h3 className="text-sm font-mono text-muted-foreground mb-4">YOUR TEAM</h3>
      <div className="space-y-3">
        {teamMembers.map((member) => {
          const isActive = activeSpeaker === member.id;
          const mood = teamMood[member.id as keyof typeof teamMood] || 'neutral';
          
          return (
            <div
              key={member.id}
              className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                isActive ? 'bg-primary/20 ring-2 ring-primary animate-pulse' : 'hover:bg-muted/50'
              }`}
            >
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-1 -right-1 text-xs bg-background rounded-full border">
                  {moodEmojis[mood]}
                </span>
              </div>
              <span className="text-sm font-medium">{member.name}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
