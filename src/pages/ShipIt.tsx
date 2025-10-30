import { useAuth } from '@/hooks/useAuth';
import { useGameSession } from '@/hooks/useGameSession';
import { Button } from '@/components/ui/button';
import { TeamPanel } from '@/components/shipit/TeamPanel';
import { PhaseProgress } from '@/components/shipit/PhaseProgress';
import { ChatTerminal } from '@/components/shipit/ChatTerminal';
import { InputBar } from '@/components/shipit/InputBar';
import { StatsPanel } from '@/components/shipit/StatsPanel';
import { QuestLog } from '@/components/shipit/QuestLog';
import { LogOut, Loader2 } from 'lucide-react';

export default function ShipIt() {
  const { signOut } = useAuth();
  const { loading } = useGameSession();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your game session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="flex justify-end mb-4">
        <Button variant="outline" onClick={signOut} size="sm">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
      
      <div className="h-[calc(100vh-6rem)] grid grid-cols-12 gap-4">
        {/* Left: Team Panel (2 cols) */}
        <div className="col-span-2 overflow-y-auto">
          <TeamPanel />
        </div>
        
        {/* Center: Chat & Terminal (7 cols) */}
        <div className="col-span-7 flex flex-col gap-4">
          <PhaseProgress />
          <ChatTerminal />
          <InputBar />
        </div>
        
        {/* Right: Stats & Quest Log (3 cols) */}
        <div className="col-span-3 flex flex-col gap-4 overflow-y-auto">
          <StatsPanel />
          <QuestLog />
        </div>
      </div>
    </div>
  );
}
