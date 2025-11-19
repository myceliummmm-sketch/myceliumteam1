import { Button } from '@/components/ui/button';
import { TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { ProgressTimelineModal } from './ProgressTimelineModal';
import { Badge } from '@/components/ui/badge';
import { useGameStore } from '@/stores/gameStore';

export function ProgressTimelineButton() {
  const [showModal, setShowModal] = useState(false);
  const stageHistory = useGameStore((state) => state.stageHistory);
  
  // Count completed stages
  const completedCount = stageHistory.length;
  const totalStages = 24; // 6 phases × 4 stages
  
  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        variant="outline"
        size="lg"
        className="gap-2 relative group hover:border-primary/50 transition-all"
        title="View your progress timeline"
      >
        <TrendingUp className="h-5 w-5 text-primary" />
        <span className="text-sm font-medium">Journey</span>
        <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
          {completedCount}/{totalStages}
        </Badge>
        
        {/* Subtle pulse animation if recent completion */}
        {stageHistory[0]?.completed_at && 
         Date.now() - new Date(stageHistory[0].completed_at).getTime() < 60000 && (
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary animate-pulse" />
        )}
      </Button>
      
      <ProgressTimelineModal 
        open={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </>
  );
}
