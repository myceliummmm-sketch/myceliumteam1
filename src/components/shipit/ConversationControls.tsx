import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGameStore } from '@/stores/gameStore';
import { MODE_CONFIGS } from '@/lib/modeConfig';
import { MessageSquare, Layers } from 'lucide-react';

interface ConversationControlsProps {
  compact?: boolean;
  showLabels?: boolean;
}

export function ConversationControls({ compact = false, showLabels = true }: ConversationControlsProps) {
  const conversationMode = useGameStore((state) => state.conversationMode);
  const setConversationMode = useGameStore((state) => state.setConversationMode);
  const responseDepth = useGameStore((state) => state.responseDepth);
  const setResponseDepth = useGameStore((state) => state.setResponseDepth);
  const unlockedModes = useGameStore((state) => state.unlockedModes);

  return (
    <div className="flex items-center gap-2">
      {showLabels && <MessageSquare className="h-4 w-4 text-muted-foreground" />}
      
      {/* Mode Selector */}
      <Select value={conversationMode} onValueChange={setConversationMode}>
        <SelectTrigger className={compact ? "h-8 w-[140px]" : "h-9 w-[160px]"}>
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
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      {showLabels && <Layers className="h-4 w-4 text-muted-foreground" />}
      
      {/* Depth Selector */}
      <Select value={responseDepth} onValueChange={setResponseDepth}>
        <SelectTrigger className={compact ? "h-8 w-[120px]" : "h-9 w-[140px]"}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="brief">💬 Brief</SelectItem>
          <SelectItem value="normal">📝 Normal</SelectItem>
          <SelectItem value="detailed">📚 Detailed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
