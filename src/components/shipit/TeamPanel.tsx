import { useEffect, useState } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { TEAM_MEMBERS, CharacterData } from '@/lib/characterData';
import { TeamMemberModal } from './TeamMemberModal';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { PanelLeftClose, PanelLeftOpen, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { collapseIconAnimation } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const moodEmojis = {
  happy: '😊',
  neutral: '😐',
  stressed: '😰',
  excited: '🤩',
};

interface TeamPanelProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function TeamPanel({ collapsed = false, onToggle }: TeamPanelProps = {}) {
  const teamMood = useGameStore((state) => state.teamMood);
  const activeSpeaker = useGameStore((state) => state.activeSpeaker);
  const selectedSpeakers = useGameStore((state) => state.selectedSpeakers);
  const teamPanelMode = useGameStore((state) => state.teamPanelMode);
  const toggleSpeaker = useGameStore((state) => state.toggleSpeaker);
  const setTeamPanelMode = useGameStore((state) => state.setTeamPanelMode);
  const setSelectedSpeakers = useGameStore((state) => state.setSelectedSpeakers);
  const messages = useGameStore((state) => state.messages);
  const setActiveSpeaker = useGameStore((state) => state.setActiveSpeaker);
  
  const [isExpanded, setIsExpanded] = useState(!collapsed);
  const [selectedMember, setSelectedMember] = useState<CharacterData | null>(null);

  // Sync internal state with collapsed prop
  useEffect(() => {
    setIsExpanded(!collapsed);
  }, [collapsed]);

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
    if (teamPanelMode === 'info') {
      // Info mode: open modal
      setSelectedMember(member);
    } else if (teamPanelMode === 'select') {
      // Select mode: toggle selection
      toggleSpeaker(member.id);
    }
  };

  return (
    <TooltipProvider>
      <Card className="p-4">
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <div className="flex items-center justify-between mb-3">
            {!collapsed ? (
              // ===== EXPANDED STATE: Full header =====
              <>
                <h3 className="text-sm font-mono text-muted-foreground">YOUR TEAM</h3>
                
                <div className="flex items-center gap-2">
                  {/* Mode Toggle Buttons */}
                  <div className="flex border rounded-md">
                    <Button
                      variant={teamPanelMode === 'info' ? 'secondary' : 'ghost'}
                      size="sm"
                      className="h-7 px-2 text-xs rounded-r-none"
                      onClick={() => setTeamPanelMode('info')}
                    >
                      📖 Info
                    </Button>
                    <Button
                      variant={teamPanelMode === 'select' ? 'secondary' : 'ghost'}
                      size="sm"
                      className="h-7 px-2 text-xs rounded-l-none"
                      onClick={() => setTeamPanelMode('select')}
                    >
                      ✅ Select
                    </Button>
                  </div>
                  
                  {/* Collapse Button */}
                  <motion.div
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                    variants={collapseIconAnimation}
                  >
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={onToggle}
                      aria-label="Collapse panel"
                    >
                      <PanelLeftClose className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
              </>
            ) : (
              // ===== COLLAPSED STATE: Only collapse button =====
              <div className="w-full flex justify-center">
                <motion.div
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  variants={collapseIconAnimation}
                >
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={onToggle}
                    aria-label="Expand panel"
                  >
                    <PanelLeftOpen className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mode description / status - only show when expanded */}
          {!collapsed && (
            <div className="text-xs text-muted-foreground mb-3 px-1">
              {teamPanelMode === 'info' ? (
                <span>Click to view profiles</span>
              ) : (
                <div className="flex items-center justify-between">
                  <span>
                    Selected: {selectedSpeakers.length}/7
                    {selectedSpeakers.length === 0 && ' (Auto mode)'}
                    {selectedSpeakers.length === 7 && ' (All)'}
                  </span>
                  {selectedSpeakers.length > 0 && selectedSpeakers.length < 7 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 text-xs px-2"
                      onClick={() => setSelectedSpeakers([])}
                    >
                      Clear
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Quick presets in select mode */}
          {teamPanelMode === 'select' && isExpanded && (
            <div className="flex flex-wrap gap-1 mb-3">
              <Button
                variant="outline"
                size="sm"
                className="h-6 text-xs"
                onClick={() => setSelectedSpeakers([])}
              >
                🎯 Auto
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-6 text-xs"
                onClick={() => setSelectedSpeakers(['ever', 'phoenix', 'prisma'])}
              >
                💼 Business
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-6 text-xs"
                onClick={() => setSelectedSpeakers(['techpriest', 'toxic'])}
              >
                ⚙️ Tech
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-6 text-xs"
                onClick={() => setSelectedSpeakers(TEAM_MEMBERS.map(m => m.id))}
              >
                👥 All
              </Button>
            </div>
          )}

          {/* Collapsed view - vertical stack */}
          {!isExpanded && (
            <div className="flex flex-col items-center gap-2.5">
              {TEAM_MEMBERS.map((member) => {
                const isActive = activeSpeaker === member.id;
                const isSelected = selectedSpeakers.includes(member.id);
                const mood = teamMood[member.id as keyof typeof teamMood] || 'neutral';
                
                return (
                  <Tooltip key={member.id}>
                    <TooltipTrigger asChild>
                      <div
                        onClick={(e) => handleMemberClick(member, e)}
                        className={`relative cursor-pointer transition-all ${
                          teamPanelMode === 'select'
                            ? isSelected
                              ? 'ring-2 ring-primary scale-105'
                              : 'opacity-50 hover:opacity-100 hover:ring-2 hover:ring-muted'
                            : isActive 
                              ? 'ring-2 ring-primary animate-pulse scale-110'
                              : 'hover:scale-110 hover:ring-2 hover:ring-muted'
                        }`}
                        aria-label={`${member.name} - ${member.role}`}
                      >
                        <Avatar className="h-11 w-11">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="absolute -bottom-1 -right-1 text-xs bg-background rounded-full border px-0.5">
                          {moodEmojis[mood]}
                        </span>
                        {teamPanelMode === 'select' && isSelected && (
                          <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                            ✓
                          </span>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p className="font-semibold">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                      {teamPanelMode === 'info' ? (
                        <p className="text-xs text-muted-foreground mt-1">
                          Click to view profile
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground mt-1">
                          Click to {isSelected ? 'remove from' : 'add to'} selection
                        </p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          )}

          {/* Expanded view - full details */}
          <CollapsibleContent>
            <div className="space-y-3">
              {TEAM_MEMBERS.map((member) => {
                const isActive = activeSpeaker === member.id;
                const isSelected = selectedSpeakers.includes(member.id);
                const mood = teamMood[member.id as keyof typeof teamMood] || 'neutral';
                
                return (
                  <div
                    key={member.id}
                    onClick={(e) => handleMemberClick(member, e)}
                    className={`flex items-center gap-3 p-2 rounded-lg transition-all cursor-pointer ${
                      teamPanelMode === 'select'
                        ? isSelected
                          ? 'bg-primary/20 ring-2 ring-primary'
                          : 'opacity-60 hover:opacity-100 hover:bg-muted/50'
                        : isActive 
                          ? 'bg-primary/20 ring-2 ring-primary animate-pulse'
                          : 'hover:bg-muted/50'
                    }`}
                    title={teamPanelMode === 'info' ? 'Click for profile' : `Click to ${isSelected ? 'deselect' : 'select'}`}
                  >
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="absolute -bottom-1 -right-1 text-xs bg-background rounded-full border">
                        {moodEmojis[mood]}
                      </span>
                      {teamPanelMode === 'select' && isSelected && (
                        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                          ✓
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium">{member.name}</div>
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
    </TooltipProvider>
  );
}
