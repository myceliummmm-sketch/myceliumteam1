import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trophy, Zap } from 'lucide-react';
import { OFFICE_ITEMS } from '@/lib/officeItems';
import { useGameStore } from '@/stores/gameStore';
import { motion, AnimatePresence } from 'framer-motion';

interface DestroyOfficeGameProps {
  onBack: () => void;
  onDismiss: () => void;
}

interface GameItem {
  id: string;
  itemType: typeof OFFICE_ITEMS[0];
  x: number;
  y: number;
  currentHealth: number;
  clicks: number;
}

export function DestroyOfficeGame({ onBack, onDismiss }: DestroyOfficeGameProps) {
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [itemsDestroyed, setItemsDestroyed] = useState(0);
  const [gameItems, setGameItems] = useState<GameItem[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [lastClickTime, setLastClickTime] = useState(0);

  const updateStats = useGameStore((state) => state.updateStats);
  const xp = useGameStore((state) => state.xp);

  const spawnItem = useCallback(() => {
    const itemType = OFFICE_ITEMS[Math.floor(Math.random() * OFFICE_ITEMS.length)];
    const newItem: GameItem = {
      id: `${Date.now()}-${Math.random()}`,
      itemType,
      x: Math.random() * 80 + 10,
      y: Math.random() * 60 + 20,
      currentHealth: itemType.health,
      clicks: 0,
    };
    setGameItems(prev => [...prev, newItem]);
  }, []);

  const handleItemClick = (itemId: string) => {
    const now = Date.now();
    const timeSinceLastClick = now - lastClickTime;
    
    setGameItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const newHealth = item.currentHealth - 1;
        const newClicks = item.clicks + 1;
        
        if (newHealth <= 0) {
          // Item destroyed!
          const comboBonus = timeSinceLastClick < 1000 ? combo + 1 : 1;
          setCombo(comboBonus);
          setMaxCombo(prev => Math.max(prev, comboBonus));
          setScore(prev => prev + item.itemType.points * comboBonus);
          setItemsDestroyed(prev => prev + 1);
          
          // Visual feedback only (removed confetti dependency)
          
          return null as any;
        }
        
        return { ...item, currentHealth: newHealth, clicks: newClicks };
      }
      return item;
    }).filter(Boolean));
    
    setLastClickTime(now);
  };

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setItemsDestroyed(0);
    setTimeLeft(60);
    setGameItems([]);
    
    // Spawn initial items
    for (let i = 0; i < 3; i++) {
      setTimeout(() => spawnItem(), i * 500);
    }
  };

  const endGame = () => {
    setIsPlaying(false);
    
    // Convert score to XP bonus (1 point = 0.1 XP)
    const xpBonus = Math.floor(score / 10);
    if (xpBonus > 0) {
      updateStats({ xp: xp + xpBonus });
    }
  };

  useEffect(() => {
    if (!isPlaying) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;
    
    const spawner = setInterval(() => {
      if (gameItems.length < 5) {
        spawnItem();
      }
    }, 2000);
    
    return () => clearInterval(spawner);
  }, [isPlaying, gameItems.length, spawnItem]);

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border bg-card">
          <div className="flex items-center justify-between mb-3">
            <Button onClick={onBack} variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h2 className="text-lg font-bold">Destroy the Office</h2>
            <div className="w-16" />
          </div>
          
          <div className="flex gap-4 text-sm">
            <div className="flex-1 bg-background rounded-md p-2">
              <div className="text-muted-foreground text-xs">Score</div>
              <div className="font-bold text-primary">{score.toLocaleString()}</div>
            </div>
            <div className="flex-1 bg-background rounded-md p-2">
              <div className="text-muted-foreground text-xs">Combo</div>
              <div className="font-bold text-orange-500">{combo}x</div>
            </div>
            <div className="flex-1 bg-background rounded-md p-2">
              <div className="text-muted-foreground text-xs">Time</div>
              <div className="font-bold">{timeLeft}s</div>
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div className="flex-1 relative bg-gradient-to-b from-background to-muted/20">
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4 p-6">
                {score > 0 ? (
                  <>
                    <Trophy className="w-16 h-16 mx-auto text-primary" />
                    <h3 className="text-2xl font-bold">Game Over!</h3>
                    <div className="space-y-2 text-lg">
                      <p>Final Score: <span className="font-bold text-primary">{score.toLocaleString()}</span></p>
                      <p>Items Destroyed: <span className="font-bold">{itemsDestroyed}</span></p>
                      <p>Max Combo: <span className="font-bold text-orange-500">{maxCombo}x</span></p>
                      <p className="text-sm text-muted-foreground">
                        +{Math.floor(score / 10)} XP bonus added!
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold">Ready to Destroy?</h3>
                    <p className="text-muted-foreground">
                      Tap office items to destroy them!<br />
                      Destroy items quickly for combo bonuses.
                    </p>
                  </>
                )}
                <Button onClick={startGame} size="lg">
                  {score > 0 ? 'Play Again' : 'Start Game'}
                </Button>
                {score > 0 && (
                  <Button onClick={onDismiss} variant="outline" className="ml-2">
                    Return to Game
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Items */}
          <AnimatePresence>
            {gameItems.map(item => (
              <motion.button
                key={item.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0, rotate: 360 }}
                onClick={() => handleItemClick(item.id)}
                className="absolute cursor-pointer transition-transform active:scale-90"
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  fontSize: `${item.itemType.size}px`,
                  filter: `brightness(${item.currentHealth / item.itemType.health})`,
                }}
              >
                {item.itemType.emoji}
                {item.clicks > 0 && (
                  <div className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {item.currentHealth}
                  </div>
                )}
              </motion.button>
            ))}
          </AnimatePresence>

          {/* Combo Indicator */}
          {combo > 1 && isPlaying && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-4 py-2 rounded-full font-bold text-xl shadow-lg"
            >
              <Zap className="inline w-5 h-5 mr-1" />
              {combo}x COMBO!
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-card">
          <p className="text-xs text-center text-muted-foreground">
            Tap items multiple times to destroy them • Build combos for bonus points
          </p>
        </div>
      </div>
    </div>
  );
}
