import { useEffect, useState } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { TEAM_MEMBERS, CharacterData } from '@/lib/characterData';
import { TeamMemberModal } from './TeamMemberModal';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const moodEmojis = {
  happy: '😊',
  neutral: '😐',
  stressed: '😰',
  excited: '🤩',
};

export function TeamPanel() {
  const teamMood = useGameStore((state) => state.teamMood);
  const activeSpeaker = useGameStore((state) => state.activeSpeaker);
  const preferredSpeaker = useGameStore((state) => state.preferredSpeaker);
  const setPreferredSpeaker = useGameStore((state) => state.setPreferredSpeaker);
  const messages = useGameStore((state) => state.messages);
  const setActiveSpeaker = useGameStore((state) => state.setActiveSpeaker);
  
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedMember, setSelectedMember] = useState<CharacterData | null>(null);

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

  const handleMemberClick = (member: typeof TEAM_MEMBERS[0], e: React.MouseEvent) => {
    // Shift key to set preferred speaker, normal click to open modal
    if (e.shiftKey) {
      setPreferredSpeaker(preferredSpeaker === member.id ? null : member.id);
    } else {
      setSelectedMember(member);
    }
  };

  return (
    <>
      <Card className="p-4">
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-mono text-muted-foreground">YOUR TEAM</h3>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? '' : 'rotate-180'}`} />
              </Button>
            </CollapsibleTrigger>
          </div>

          {/* Collapsed view - just circles */}
          {!isExpanded && (
            <div className="flex flex-wrap gap-2">
              {TEAM_MEMBERS.map((member) => {
                const isActive = activeSpeaker === member.id;
                const isPreferred = preferredSpeaker === member.id;
                const mood = teamMood[member.id as keyof typeof teamMood] || 'neutral';
                
                return (
                  <div
                    key={member.id}
                    onClick={(e) => handleMemberClick(member, e)}
                    className={`relative cursor-pointer transition-all ${
                      isActive ? 'ring-2 ring-primary animate-pulse scale-110' : 
                      isPreferred ? 'ring-2 ring-primary/50 scale-105' :
                      'hover:scale-110'
                    }`}
                    title={`${member.name} - ${isPreferred ? 'Shift+click to deselect' : 'Click for profile, Shift+click to direct messages'}`}
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="absolute -bottom-1 -right-1 text-xs bg-background rounded-full border">
                      {moodEmojis[mood]}
                    </span>
                    {isPreferred && (
                      <span className="absolute -top-1 -right-1 text-xs">🎯</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Expanded view - full details */}
          <CollapsibleContent>
            <div className="space-y-3">
              {TEAM_MEMBERS.map((member) => {
                const isActive = activeSpeaker === member.id;
                const isPreferred = preferredSpeaker === member.id;
                const mood = teamMood[member.id as keyof typeof teamMood] || 'neutral';
                
                return (
                  <div
                    key={member.id}
                    onClick={(e) => handleMemberClick(member, e)}
                    className={`flex items-center gap-3 p-2 rounded-lg transition-all cursor-pointer ${
                      isActive ? 'bg-primary/20 ring-2 ring-primary animate-pulse' : 
                      isPreferred ? 'bg-primary/10 ring-2 ring-primary/50' :
                      'hover:bg-muted/50'
                    }`}
                    title={`${isPreferred ? 'Shift+click to deselect' : 'Click for profile, Shift+click to direct messages'}`}
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
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium">{member.name}</div>
                        {isPreferred && <span className="text-xs text-primary">🎯</span>}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">{member.role}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <TeamMemberModal 
        member={selectedMember}
        open={!!selectedMember}
        onOpenChange={(open) => !open && setSelectedMember(null)}
      />
    </>
  );
}
