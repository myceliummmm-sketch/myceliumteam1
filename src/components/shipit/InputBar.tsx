import { useState, useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { useGameSession } from '@/hooks/useGameSession';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Send, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TEAM_MEMBERS } from '@/lib/characterData';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MODE_CONFIGS, isModeUnlocked, getUnlockMessage } from '@/lib/modeConfig';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Lock } from 'lucide-react';

export function InputBar() {
  const [input, setInput] = useState('');
  const { sendMessage } = useGameSession();
  const isLoading = useGameStore((state) => state.isLoading);
  const energy = useGameStore((state) => state.energy);
  const level = useGameStore((state) => state.level);
  const currentPhase = useGameStore((state) => state.currentPhase);
  const preferredSpeaker = useGameStore((state) => state.preferredSpeaker);
  const setPreferredSpeaker = useGameStore((state) => state.setPreferredSpeaker);
  const conversationMode = useGameStore((state) => state.conversationMode);
  const unlockedModes = useGameStore((state) => state.unlockedModes);
  const setConversationMode = useGameStore((state) => state.setConversationMode);
  const responseDepth = useGameStore((state) => state.responseDepth);
  const setResponseDepth = useGameStore((state) => state.setResponseDepth);
  
  useEffect(() => {
    const handleInsertPrompt = (e: CustomEvent) => {
      setInput(e.detail.text);
    };
    window.addEventListener('insertPromptToChat' as any, handleInsertPrompt as any);
    return () => window.removeEventListener('insertPromptToChat' as any, handleInsertPrompt as any);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading || energy < 1) return;

    const message = input.trim();
    setInput('');
    await sendMessage(message, preferredSpeaker);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const selectedMember = TEAM_MEMBERS.find(m => m.id === preferredSpeaker);

  return (
    <Card className="p-2 sm:p-4 border-t-2">
      <div className="space-y-2">
        {/* Mode and Character Selectors */}
        <div className="flex items-center gap-2 px-1 flex-wrap">
          <span className="text-xs text-muted-foreground font-mono">Mode:</span>
          <TooltipProvider>
            <Select value={conversationMode} onValueChange={(val: any) => setConversationMode(val)}>
              <SelectTrigger className="h-8 w-[160px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(MODE_CONFIGS).map((config) => {
                  const unlocked = unlockedModes.includes(config.id);
                  return (
                    <SelectItem key={config.id} value={config.id} disabled={!unlocked}>
                      <div className="flex items-center gap-2">
                        <span>{config.icon}</span>
                        <span>{config.name}</span>
                        {!unlocked && <Lock className="h-3 w-3 ml-1" />}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </TooltipProvider>
          
          <span className="text-xs text-muted-foreground font-mono">Direct to:</span>
          <Select value={preferredSpeaker || 'auto'} onValueChange={(val) => setPreferredSpeaker(val === 'auto' ? null : val)}>
            <SelectTrigger className="h-8 w-[200px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">
                <span className="font-mono">🎯 Auto (AI picks)</span>
              </SelectItem>
              {TEAM_MEMBERS.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs">{member.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {preferredSpeaker && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setPreferredSpeaker(null)}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          
          <span className="text-xs text-muted-foreground font-mono">Depth:</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Select value={responseDepth} onValueChange={(val: any) => setResponseDepth(val)}>
                    <SelectTrigger className="h-8 w-[140px] text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="brief">
                        <div className="flex items-center gap-2">
                          <span>💬</span>
                          <span>Brief</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="normal">
                        <div className="flex items-center gap-2">
                          <span>📝</span>
                          <span>Normal</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="detailed">
                        <div className="flex items-center gap-2">
                          <span>📚</span>
                          <span>Detailed</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-xs space-y-1">
                  <p><strong>Brief:</strong> Quick, concise answers (1-2 sentences)</p>
                  <p><strong>Normal:</strong> Balanced responses (2-3 sentences)</p>
                  <p><strong>Detailed:</strong> In-depth analysis (4-6 sentences)</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Input Area */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                preferredSpeaker 
                  ? `Ask ${selectedMember?.name}... (Shift+Enter for new line)`
                  : "Type your message... (Shift+Enter for new line)"
              }
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
      </div>
    </Card>
  );
}
