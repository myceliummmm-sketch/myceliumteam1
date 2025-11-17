import { useGameStore } from '@/stores/gameStore';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { floatingTextAnimation, floatingTextTransition } from '@/lib/animations';
import { AlertTriangle, Zap, Clock, Package, ChevronDown } from 'lucide-react';
import { getTimeUntilNextEnergy, getMaxEnergy } from '@/lib/energySystem';
import { useNavigate } from 'react-router-dom';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';

interface StatsPanelProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function StatsPanel({ collapsed = false, onToggle }: StatsPanelProps = {}) {
  const navigate = useNavigate();
  const xp = useGameStore((state) => state.xp);
  const level = useGameStore((state) => state.level);
  const spores = useGameStore((state) => state.spores);
  const energy = useGameStore((state) => state.energy);
  const streak = useGameStore((state) => state.streak);
  const codeHealth = useGameStore((state) => state.codeHealth);
  const lastEnergyUpdate = useGameStore((state) => state.lastEnergyUpdate);
  const artifacts = useGameStore((state) => state.artifacts);

  const [prevXp, setPrevXp] = useState(xp);
  const [showXpGain, setShowXpGain] = useState(false);
  const [xpGainAmount, setXpGainAmount] = useState(0);
  const [timeUntilNext, setTimeUntilNext] = useState({ hours: 0, minutes: 0 });
  const [isExpanded, setIsExpanded] = useState(!collapsed);

  // Sync internal state with collapsed prop
  useEffect(() => {
    setIsExpanded(!collapsed);
  }, [collapsed]);

  const xpToNextLevel = level * 100;
  const xpProgress = (xp / xpToNextLevel) * 100;
  const maxEnergy = getMaxEnergy();
  const energyProgress = (energy / maxEnergy) * 100;

  useEffect(() => {
    if (xp > prevXp) {
      const gain = xp - prevXp;
      setXpGainAmount(gain);
      setShowXpGain(true);
      setTimeout(() => setShowXpGain(false), 1500);
    }
    setPrevXp(xp);
  }, [xp, prevXp]);

  // Update energy timer every minute
  useEffect(() => {
    if (!lastEnergyUpdate || energy >= maxEnergy) return;

    const updateTimer = () => {
      const time = getTimeUntilNextEnergy(lastEnergyUpdate);
      setTimeUntilNext(time);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [lastEnergyUpdate, energy, maxEnergy]);

  return (
    <Card className="p-4">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-mono text-muted-foreground">STATS</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={onToggle}
          >
            <ChevronDown className={`h-4 w-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        {/* Collapsed view - compact essentials */}
        {!isExpanded && (
          <div className="space-y-3">
            {/* Level badge */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">LVL</span>
              <Badge variant="default" className="text-sm font-bold">{level}</Badge>
            </div>

            {/* Mini XP bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">XP</span>
                <span className="font-mono text-xs">{xp}/{xpToNextLevel}</span>
              </div>
              <Progress value={xpProgress} className="h-1.5" />
            </div>

            {/* Energy indicator */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Energy</span>
              <div className="flex items-center gap-1">
                <Zap className={`h-3 w-3 ${energy <= 2 ? 'text-destructive animate-pulse' : 'text-primary'}`} />
                <span className="text-sm font-mono">{energy}/{maxEnergy}</span>
              </div>
            </div>
          </div>
        )}

        {/* Expanded view - full stats */}
        <CollapsibleContent>
          <div className="space-y-4">
            {/* Level */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">LEVEL</span>
              <Badge variant="default" className="text-lg font-bold">
                {level}
              </Badge>
            </div>

            {/* XP */}
            <div className="relative">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">XP</span>
                <motion.span 
                  key={xp}
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.3 }}
                  className="font-mono"
                >
                  {xp}/{xpToNextLevel}
                </motion.span>
              </div>
              <div className="relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.5 }}
                >
                  <Progress 
                    value={xpProgress} 
                    className={`h-2 transition-all duration-300 ${
                      xpProgress > 90 
                        ? 'shadow-[0_0_15px_hsl(var(--primary)/0.8)]' 
                        : ''
                    }`}
                    style={{
                      background: xpProgress > 90 
                        ? 'hsl(var(--chart-1))' 
                        : xpProgress > 50 
                        ? 'hsl(var(--chart-5))' 
                        : 'hsl(var(--secondary))'
                    }}
                  />
                </motion.div>
                <AnimatePresence>
                  {showXpGain && (
                    <motion.div
                      className="absolute -top-6 right-0 text-xs font-bold text-primary"
                      initial={floatingTextAnimation.initial}
                      animate={floatingTextAnimation.animate}
                      exit={floatingTextAnimation.initial}
                      transition={floatingTextTransition}
                    >
                      +{xpGainAmount} XP
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Spores */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">SPORES</span>
              <motion.div 
                key={spores}
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 0.3 }}
                className="text-xl font-bold"
              >
                🍄 {spores}
              </motion.div>
            </div>

            {/* Energy */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <div className="flex items-center gap-1">
                  <Zap className={`h-3 w-3 ${energy <= 2 ? 'text-destructive' : 'text-primary'}`} />
                  <span className="text-muted-foreground">ENERGY</span>
                </div>
                <span className="font-mono">{energy}/{maxEnergy}</span>
              </div>
              <motion.div
                animate={energy <= 2 ? {
                  boxShadow: [
                    '0 0 0 0 hsl(var(--destructive) / 0)',
                    '0 0 10px 2px hsl(var(--destructive) / 0.3)',
                    '0 0 0 0 hsl(var(--destructive) / 0)',
                  ]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Progress 
                  value={energyProgress} 
                  className={`h-2 ${energy <= 2 ? 'bg-destructive/20' : ''}`}
                />
              </motion.div>
              {energy < maxEnergy && (
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Next in {timeUntilNext.hours}h {timeUntilNext.minutes}m</span>
                </div>
              )}
            </div>

            {/* Streak */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">STREAK</span>
              <div className="text-xl">
                🔥 <span className="font-bold">{streak}</span>
              </div>
            </div>

            {/* Code Health */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <div className="flex items-center gap-1">
                  {codeHealth < 50 && <AlertTriangle className="h-3 w-3 text-destructive" />}
                  <span className="text-muted-foreground">CODE HEALTH</span>
                </div>
                <span className="font-mono">{codeHealth}%</span>
              </div>
              <motion.div
                animate={codeHealth < 50 ? {
                  boxShadow: [
                    '0 0 0 0 hsl(var(--destructive) / 0)',
                    '0 0 10px 2px hsl(var(--destructive) / 0.3)',
                    '0 0 0 0 hsl(var(--destructive) / 0)',
                  ]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Progress 
                  value={codeHealth} 
                  className={`h-2 ${codeHealth < 50 ? 'bg-destructive/20' : ''}`}
                  style={{
                    background: codeHealth >= 80 
                      ? 'hsl(var(--chart-2))' 
                      : codeHealth >= 50 
                      ? 'hsl(var(--chart-3))' 
                      : 'hsl(var(--destructive))'
                  }}
                />
              </motion.div>
            </div>

            {/* Artifacts */}
            <div 
              className="flex items-center justify-between p-2 rounded-lg bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => navigate('/inventory')}
            >
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">ARTIFACTS</span>
              </div>
              <Badge variant="secondary">{artifacts.length}</Badge>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
