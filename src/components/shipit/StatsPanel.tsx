import { useGameStore } from '@/stores/gameStore';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { floatingTextAnimation, floatingTextTransition } from '@/lib/animations';
import { AlertTriangle, Zap, Clock, Package } from 'lucide-react';
import { getTimeUntilNextEnergy, getMaxEnergy } from '@/lib/energySystem';
import { useNavigate } from 'react-router-dom';

export function StatsPanel() {
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
      <h3 className="text-sm font-mono text-muted-foreground mb-4">STATS</h3>
      
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
                  variants={floatingTextAnimation}
                  initial="initial"
                  animate="animate"
                  exit="initial"
                  transition={floatingTextTransition}
                  className="absolute -top-6 right-0 text-primary font-bold text-sm"
                >
                  +{xpGainAmount} XP
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Spores */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">SPORES 🍄</span>
          <span className="font-mono font-bold text-primary">{spores}</span>
        </div>

        {/* Energy */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground flex items-center gap-1">
              ENERGY 
              {energy < 3 && (
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Zap className="h-3 w-3 text-destructive" />
                </motion.span>
              )}
            </span>
            <span className="font-mono">{energy}/{maxEnergy}</span>
          </div>
          <motion.div
            animate={energy < 3 ? { 
              boxShadow: [
                "0 0 0px transparent",
                "0 0 10px hsl(var(--destructive)/0.5)",
                "0 0 0px transparent"
              ]
            } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Progress 
              value={energyProgress} 
              className="h-2"
              style={{ background: 'hsl(var(--chart-1) / 0.2)' }}
            />
          </motion.div>
          {/* Energy Timer */}
          {energy < maxEnergy && lastEnergyUpdate && (
            <div className="flex items-center gap-1 mt-1 text-[10px] sm:text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span className="text-[10px] sm:text-xs">
                {energy === maxEnergy - 1 
                  ? 'Full Energy!' 
                  : `Next: ${timeUntilNext.hours}h ${timeUntilNext.minutes}m`}
              </span>
            </div>
          )}
        </div>

        {/* Streak */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">STREAK 🔥</span>
          <span className="font-mono font-bold">{streak}</span>
        </div>

        {/* Code Health */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground flex items-center gap-1">
              CODE HEALTH
              {codeHealth < 30 && (
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  <AlertTriangle className="h-3 w-3 text-destructive" />
                </motion.span>
              )}
            </span>
            <motion.span 
              key={codeHealth}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.1, 1] }}
              className="font-mono"
            >
              {codeHealth}%
            </motion.span>
          </div>
          <motion.div
            animate={codeHealth < 30 ? { 
              boxShadow: [
                "0 0 0px transparent",
                "0 0 10px hsl(var(--destructive)/0.5)",
                "0 0 0px transparent"
              ]
            } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Progress 
              value={codeHealth} 
              style={{
                background: codeHealth > 70 
                  ? 'hsl(var(--chart-2) / 0.2)' 
                  : codeHealth > 30 
                  ? 'hsl(var(--chart-1) / 0.2)' 
                  : 'hsl(var(--destructive) / 0.2)'
              }}
              className="h-2"
            />
          </motion.div>
        </div>

        {/* Artifacts */}
        <div 
          className="flex items-center justify-between cursor-pointer hover:bg-muted/50 p-2 -m-2 rounded transition-colors"
          onClick={() => navigate('/inventory')}
        >
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Package className="h-3 w-3" />
            ARTIFACTS
          </span>
          <Badge variant={artifacts.filter(a => a.unlocked).length > 0 ? "default" : "secondary"}>
            {artifacts.filter(a => a.unlocked).length}/{artifacts.length}
          </Badge>
        </div>
      </div>
    </Card>
  );
}
