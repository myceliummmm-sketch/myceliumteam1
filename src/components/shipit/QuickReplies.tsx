import { Button } from '@/components/ui/button';
import { Sparkles, Zap, AlertCircle, Target, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { QuickReplyButton } from '@/types/game';
import { Progress } from '@/components/ui/progress';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface QuickRepliesProps {
  suggestions: QuickReplyButton[];
  onSelect: (text: string) => void;
  disabled?: boolean;
}

// Get button styling based on category and urgency
function getButtonStyles(category: QuickReplyButton['category'], urgency?: QuickReplyButton['urgency']) {
  const baseClasses = "text-sm h-auto min-h-[36px] px-4 py-2 relative overflow-hidden group transition-all duration-300 shadow-sm hover:shadow-md";
  
  switch (category) {
    case 'ai-suggested':
      return `${baseClasses} border-2 border-primary/70 bg-gradient-to-br from-primary/15 to-primary/5 hover:from-primary/25 hover:to-primary/10 hover:border-primary hover:scale-[1.02]`;
    case 'blocker':
      if (urgency === 'high') {
        return `${baseClasses} border-2 border-destructive/70 bg-gradient-to-br from-destructive/15 to-destructive/5 hover:from-destructive/25 hover:to-destructive/10 hover:border-destructive hover:scale-[1.02]`;
      }
      return `${baseClasses} border-2 border-orange-500/70 bg-gradient-to-br from-orange-500/15 to-orange-500/5 hover:from-orange-500/25 hover:to-orange-500/10 hover:border-orange-500 hover:scale-[1.02]`;
    case 'task':
      return `${baseClasses} border-2 border-green-500/70 bg-gradient-to-br from-green-500/15 to-green-500/5 hover:from-green-500/25 hover:to-green-500/10 hover:border-green-500 hover:scale-[1.02]`;
    case 'energy':
      if (urgency === 'high') {
        return `${baseClasses} border-2 border-destructive/70 bg-gradient-to-br from-destructive/15 to-destructive/5 hover:from-destructive/25 hover:to-destructive/10 hover:border-destructive hover:scale-[1.02]`;
      }
      return `${baseClasses} border-2 border-yellow-500/70 bg-gradient-to-br from-yellow-500/15 to-yellow-500/5 hover:from-yellow-500/25 hover:to-yellow-500/10 hover:border-yellow-500 hover:scale-[1.02]`;
    case 'phase':
      return `${baseClasses} border-2 border-blue-500/70 bg-gradient-to-br from-blue-500/15 to-blue-500/5 hover:from-blue-500/25 hover:to-blue-500/10 hover:border-blue-500 hover:scale-[1.02]`;
    default:
      return `${baseClasses} border-2 border-border/70 bg-gradient-to-br from-accent/50 to-background hover:from-accent hover:to-accent/50 hover:border-border hover:scale-[1.02]`;
  }
}

export function QuickReplies({ suggestions, onSelect, disabled }: QuickRepliesProps) {
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const [openHintIndex, setOpenHintIndex] = useState<number | null>(null);
  
  if (suggestions.length === 0) return null;
  
  const handleClick = (suggestion: QuickReplyButton, idx: number) => {
    // Hint buttons don't send messages, just open popover
    if (suggestion.isHint) {
      setOpenHintIndex(openHintIndex === idx ? null : idx);
      return;
    }
    
    setClickedIndex(idx);
    onSelect(suggestion.text);
    // Reset after animation
    setTimeout(() => setClickedIndex(null), 600);
  };
  
  return (
    <div className="flex flex-wrap gap-3 px-3 pb-3 pt-3 border-t border-border/40 bg-background/50">
      {suggestions.map((suggestion, idx) => {
        const buttonContent = (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleClick(suggestion, idx)}
            disabled={disabled}
            className={getButtonStyles(suggestion.category, suggestion.urgency)}
          >
            {/* Glow effect on click */}
            {clickedIndex === idx && (
              <motion.div
                className="absolute inset-0 bg-primary/40 rounded-md"
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />
            )}
            
            <div className="flex flex-col items-start gap-1 relative z-10 w-full">
              {/* Main button content */}
              <div className="flex items-center gap-1.5 w-full">
                {/* Icon with animation */}
                {suggestion.isHint ? (
                  <Lightbulb className="h-4 w-4 flex-shrink-0 text-yellow-500 drop-shadow-sm" />
                ) : suggestion.category === 'ai-suggested' ? (
                  <motion.div
                    animate={clickedIndex === idx ? { rotate: 360, scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <Sparkles className="h-4 w-4 flex-shrink-0 text-primary drop-shadow-sm" />
                  </motion.div>
                ) : suggestion.icon ? (
                  <span className="text-base flex-shrink-0">{suggestion.icon}</span>
                ) : null}
                
                <span className="text-left flex-1 min-w-0 break-words line-clamp-2">
                  {suggestion.text}
                </span>
                
                {/* Progress badge */}
                {suggestion.progress && (
                  <span className="text-xs font-semibold opacity-80 flex-shrink-0 px-1.5 py-0.5 rounded bg-background/60">
                    {suggestion.progress.type === 'tasks' && `${suggestion.progress.current}/${suggestion.progress.total}`}
                    {suggestion.progress.type === 'xp' && `${suggestion.progress.percentage}%`}
                    {suggestion.progress.type === 'phase' && `${suggestion.progress.percentage}%`}
                    {suggestion.progress.type === 'energy' && `${suggestion.progress.current}/10`}
                  </span>
                )}
              </div>
              
              {/* Mini progress bar */}
              {suggestion.progress && (
                <div className="w-full h-1.5 bg-background/60 rounded-full overflow-hidden shadow-inner">
                  <motion.div
                    className="h-full bg-current opacity-70 rounded-full shadow-sm"
                    initial={{ width: 0 }}
                    animate={{ width: `${suggestion.progress.percentage}%` }}
                    transition={{ duration: 0.5, delay: idx * 0.05 + 0.2 }}
                  />
                </div>
              )}
            </div>
            
            {/* Subtle shimmer on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/10 to-transparent rounded-md"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.8 }}
            />
          </Button>
        );

        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0"
          >
            {suggestion.isHint && suggestion.hintContent ? (
              <Popover open={openHintIndex === idx} onOpenChange={(open) => setOpenHintIndex(open ? idx : null)}>
                <PopoverTrigger asChild>
                  {buttonContent}
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4" align="start">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-yellow-500" />
                      <h4 className="font-semibold text-sm">Phase Tips</h4>
                    </div>
                    <ul className="space-y-2">
                      {suggestion.hintContent.map((hint, hintIdx) => (
                        <li key={hintIdx} className="text-sm flex items-start gap-2">
                          <span className="text-muted-foreground">•</span>
                          <span>{hint}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              buttonContent
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
