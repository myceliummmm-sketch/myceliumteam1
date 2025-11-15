import { useState } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { useGameSession } from '@/hooks/useGameSession';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Send, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TEAM_MEMBERS } from '@/lib/characterData';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export function InputBar() {
  const [input, setInput] = useState('');
  const { sendMessage } = useGameSession();
  const isLoading = useGameStore((state) => state.isLoading);
  const energy = useGameStore((state) => state.energy);
  const preferredSpeaker = useGameStore((state) => state.preferredSpeaker);
  const setPreferredSpeaker = useGameStore((state) => state.setPreferredSpeaker);

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
        {/* Character Selector */}
        <div className="flex items-center gap-2 px-1">
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
