import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings, Zap, Trophy, Sparkles } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { LEGENDARY_ARTIFACTS } from '@/lib/artifacts';
import { MODE_CONFIGS } from '@/lib/modeConfig';
import { Phase, ArtifactId } from '@/types/game';

export function DevModePanel() {
  const [open, setOpen] = useState(false);
  const devMode = useGameStore((state) => state.devMode);
  const toggleDevMode = useGameStore((state) => state.toggleDevMode);
  const updateStats = useGameStore((state) => state.updateStats);
  const unlockMode = useGameStore((state) => state.unlockMode);
  
  const level = useGameStore((state) => state.level);
  const xp = useGameStore((state) => state.xp);
  const energy = useGameStore((state) => state.energy);
  const spores = useGameStore((state) => state.spores);
  const currentPhase = useGameStore((state) => state.currentPhase);

  const handleLevelChange = (value: number[]) => {
    updateStats({ level: value[0] });
  };

  const handleXpChange = (value: number[]) => {
    updateStats({ xp: value[0] });
  };

  const handleEnergyChange = (value: number[]) => {
    updateStats({ energy: value[0] });
  };

  const handleSporesChange = (value: number[]) => {
    updateStats({ spores: value[0] });
  };

  const handlePhaseChange = (phase: Phase) => {
    updateStats({ currentPhase: phase });
  };

  const unlockAllArtifacts = () => {
    // In the actual GameState, artifacts are stored as ArtifactId[] not Artifact[]
    // So we just pass the IDs
    const allArtifactIds = Object.values(LEGENDARY_ARTIFACTS).map(def => def.id) as any;
    updateStats({ artifacts: allArtifactIds });
  };

  const unlockAllModes = () => {
    const allModes = Object.keys(MODE_CONFIGS);
    allModes.forEach((mode: any) => unlockMode(mode));
  };

  const resetToNormal = () => {
    updateStats({
      level: 1,
      xp: 0,
      energy: 10,
      spores: 0,
      currentPhase: 'VISION',
      artifacts: [],
    });
  };

  return (
    <>
      {/* Dev Mode Indicator */}
      {devMode && (
        <div className="fixed top-4 right-4 z-50 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-mono font-bold shadow-lg">
          DEV MODE
        </div>
      )}

      {/* Dev Mode Button */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-4 right-4 z-40 h-12 w-12 rounded-full shadow-lg"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Developer Mode</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Toggle Dev Mode */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="dev-mode" className="font-semibold">Enable Dev Mode</Label>
                <p className="text-xs text-muted-foreground">Unlock all features for testing</p>
              </div>
              <Switch
                id="dev-mode"
                checked={devMode}
                onCheckedChange={toggleDevMode}
              />
            </div>

            {devMode && (
              <>
                {/* Level Control */}
                <Card className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Trophy className="h-4 w-4" />
                      Level: {level}
                    </Label>
                  </div>
                  <Slider
                    value={[level]}
                    onValueChange={handleLevelChange}
                    min={1}
                    max={50}
                    step={1}
                  />
                </Card>

                {/* XP Control */}
                <Card className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      XP: {xp}
                    </Label>
                  </div>
                  <Slider
                    value={[xp]}
                    onValueChange={handleXpChange}
                    min={0}
                    max={5000}
                    step={10}
                  />
                </Card>

                {/* Energy Control */}
                <Card className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Energy: {energy}
                    </Label>
                  </div>
                  <Slider
                    value={[energy]}
                    onValueChange={handleEnergyChange}
                    min={0}
                    max={10}
                    step={1}
                  />
                </Card>

                {/* Spores Control */}
                <Card className="p-4 space-y-3">
                  <Label>Spores: {spores}</Label>
                  <Slider
                    value={[spores]}
                    onValueChange={handleSporesChange}
                    min={0}
                    max={1000}
                    step={10}
                  />
                </Card>

                {/* Phase Control */}
                <Card className="p-4 space-y-3">
                  <Label>Current Phase</Label>
                  <Select value={currentPhase} onValueChange={handlePhaseChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SPARK">SPARK</SelectItem>
                      <SelectItem value="EXPLORE">EXPLORE</SelectItem>
                      <SelectItem value="CRAFT">CRAFT</SelectItem>
                      <SelectItem value="FORGE">FORGE</SelectItem>
                      <SelectItem value="POLISH">POLISH</SelectItem>
                      <SelectItem value="LAUNCH">LAUNCH</SelectItem>
                    </SelectContent>
                  </Select>
                </Card>

                {/* Quick Actions */}
                <div className="space-y-2">
                  <Button onClick={unlockAllArtifacts} className="w-full" variant="outline">
                    Unlock All Artifacts
                  </Button>
                  <Button onClick={unlockAllModes} className="w-full" variant="outline">
                    Unlock All Modes
                  </Button>
                  <Button onClick={resetToNormal} className="w-full" variant="destructive">
                    Reset to Normal
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
