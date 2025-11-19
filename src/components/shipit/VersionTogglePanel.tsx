import { useGameStore } from '@/stores/gameStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Layers } from 'lucide-react';

export function VersionTogglePanel() {
  const proMode = useGameStore((state) => state.proMode);
  const toggleProMode = useGameStore((state) => state.toggleProMode);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-4 right-4 z-50 gap-2 border-border/50 bg-card/80 backdrop-blur-sm hover:bg-card"
        >
          {proMode ? (
            <>
              <Layers className="h-4 w-4" />
              <span className="hidden sm:inline">PRO Mode</span>
            </>
          ) : (
            <>
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Lite Mode</span>
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] border-border/50 bg-card/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold neon-text-cyan">Experience Mode</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Lite Mode Option */}
          <button
            onClick={() => !proMode || toggleProMode()}
            className={`w-full text-left p-6 rounded-lg border-2 transition-all ${
              !proMode
                ? 'border-primary bg-primary/10 shadow-[0_0_20px_hsl(var(--primary)/0.3)]'
                : 'border-border/30 bg-card/50 hover:border-border/50'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <Zap className={`h-6 w-6 ${!proMode ? 'text-primary' : 'text-muted-foreground'}`} />
                <div>
                  <h3 className={`text-lg font-bold ${!proMode ? 'text-primary' : 'text-foreground'}`}>
                    Lite Mode
                  </h3>
                  <Badge variant={!proMode ? 'default' : 'secondary'} className="mt-1">
                    {!proMode ? 'Active' : 'Default'}
                  </Badge>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Streamlined retrofuturistic interface. Focus on your team, conversations, and collecting dynamic cards generated from your project flow.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">Team Panel</Badge>
              <Badge variant="outline" className="text-xs">Chat Terminal</Badge>
              <Badge variant="outline" className="text-xs">Card Collection</Badge>
            </div>
          </button>

          {/* PRO Mode Option */}
          <button
            onClick={() => proMode || toggleProMode()}
            className={`w-full text-left p-6 rounded-lg border-2 transition-all ${
              proMode
                ? 'border-primary bg-primary/10 shadow-[0_0_20px_hsl(var(--primary)/0.3)]'
                : 'border-border/30 bg-card/50 hover:border-border/50'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <Layers className={`h-6 w-6 ${proMode ? 'text-primary' : 'text-muted-foreground'}`} />
                <div>
                  <h3 className={`text-lg font-bold ${proMode ? 'text-primary' : 'text-foreground'}`}>
                    PRO Mode
                  </h3>
                  <Badge variant={proMode ? 'default' : 'secondary'} className="mt-1">
                    {proMode ? 'Active' : 'Full Experience'}
                  </Badge>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Complete gamification experience with stats tracking, quest logs, phase progress, artifacts, and all advanced features.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">All Features</Badge>
              <Badge variant="outline" className="text-xs">Stats & XP</Badge>
              <Badge variant="outline" className="text-xs">Quest System</Badge>
              <Badge variant="outline" className="text-xs">Artifacts</Badge>
            </div>
          </button>

          <div className="pt-4 border-t border-border/30">
            <p className="text-xs text-muted-foreground text-center">
              You can switch between modes anytime without losing progress
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
