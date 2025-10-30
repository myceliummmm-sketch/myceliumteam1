import { useAuth } from '@/hooks/useAuth';
import { useGameSession } from '@/hooks/useGameSession';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { TeamPanel } from '@/components/shipit/TeamPanel';
import { PhaseProgress } from '@/components/shipit/PhaseProgress';
import { ChatTerminal } from '@/components/shipit/ChatTerminal';
import { InputBar } from '@/components/shipit/InputBar';
import { StatsPanel } from '@/components/shipit/StatsPanel';
import { QuestLog } from '@/components/shipit/QuestLog';
import { LevelUpModal } from '@/components/shipit/LevelUpModal';
import { StreakCalendar } from '@/components/shipit/StreakCalendar';
import { TutorialOverlay } from '@/components/shipit/TutorialOverlay';
import { LogOut, Loader2, Users } from 'lucide-react';

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
    <div className="min-h-screen bg-background p-2 sm:p-4">
      <LevelUpModal />
      
      {/* Header with Team button on mobile and Logout */}
      <div className="flex justify-between items-center mb-4">
        {/* Mobile Team Sheet - only visible on mobile */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="md:hidden">
              <Users className="h-4 w-4 mr-2" />
              Team
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px]">
            <div className="pt-6" data-tutorial-target="team-panel">
              <TeamPanel />
            </div>
          </SheetContent>
        </Sheet>

        {/* Logout Button */}
        <Button variant="outline" onClick={signOut} size="sm" className="ml-auto">
          <LogOut className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Logout</span>
        </Button>
      </div>
      
      {/* Responsive Grid Layout */}
      <div className="h-auto lg:h-[calc(100vh-6rem)] flex flex-col lg:grid lg:grid-cols-12 gap-4">
        {/* Left: Team Panel - Hidden on mobile, visible on tablet/desktop */}
        <div className="hidden md:block md:col-span-3 lg:col-span-2 overflow-y-auto" data-tutorial-target="team-panel">
          <TeamPanel />
        </div>
        
        {/* Center: Chat & Terminal - Full width on mobile, main area on desktop */}
        <div className="flex flex-col gap-4 md:col-span-9 lg:col-span-7 min-h-[60vh] lg:min-h-0">
          <PhaseProgress />
          <div className="flex-1 min-h-[400px] lg:min-h-0" data-tutorial-target="chat-terminal">
            <ChatTerminal />
          </div>
          <div className="sticky bottom-0 bg-background" data-tutorial-target="input-bar">
            <InputBar />
          </div>
        </div>
        
        {/* Right: Stats & Quest Log - Below chat on mobile, sidebar on desktop */}
        <div className="flex flex-col gap-4 lg:col-span-3 overflow-y-auto">
          <div data-tutorial-target="stats-panel">
            <StatsPanel />
          </div>
          <StreakCalendar />
          <div data-tutorial-target="quest-log">
            <QuestLog />
          </div>
        </div>
      </div>
      
      <TutorialOverlay />
    </div>
  );
}
