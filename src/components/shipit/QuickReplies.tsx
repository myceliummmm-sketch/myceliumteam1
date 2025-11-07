import { Button } from '@/components/ui/button';
import { Sparkles, Zap, AlertCircle, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { QuickReplyButton } from '@/types/game';
import { Progress } from '@/components/ui/progress';

interface QuickRepliesProps {
  suggestions: QuickReplyButton[];
  onSelect: (text: string) => void;
  disabled?: boolean;
}

// Get button styling based on category and urgency
function getButtonStyles(category: QuickReplyButton['category'], urgency?: QuickReplyButton['urgency']) {
  const baseClasses = "text-xs h-auto min-h-[28px] px-3 py-1.5 relative overflow-hidden group";
  
  switch (category) {
    case 'ai-suggested':
      return `${baseClasses} border-primary/50 bg-primary/5 hover:bg-primary/10 hover:border-primary`;
    case 'blocker':
      if (urgency === 'high') {
        return `${baseClasses} border-destructive/50 bg-destructive/5 hover:bg-destructive/10 hover:border-destructive`;
      }
      return `${baseClasses} border-orange-500/50 bg-orange-500/5 hover:bg-orange-500/10`;
    case 'task':
      return `${baseClasses} border-green-500/50 bg-green-500/5 hover:bg-green-500/10`;
    case 'energy':
      if (urgency === 'high') {
        return `${baseClasses} border-destructive/50 bg-destructive/5 hover:bg-destructive/10`;
      }
      return `${baseClasses} border-yellow-500/50 bg-yellow-500/5 hover:bg-yellow-500/10`;
    case 'phase':
      return `${baseClasses} border-blue-500/50 bg-blue-500/5 hover:bg-blue-500/10`;
    default:
      return `${baseClasses} border-border/50 hover:bg-accent`;
  }
}

export function QuickReplies({ suggestions, onSelect, disabled }: QuickRepliesProps) {
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  
  if (suggestions.length === 0) return null;
  
  const handleClick = (suggestion: QuickReplyButton, idx: number) => {
    setClickedIndex(idx);
    onSelect(suggestion.text);
    // Reset after animation
    setTimeout(() => setClickedIndex(null), 600);
  };
  
  return (
    <div className="flex flex-wrap gap-2 px-2 pb-2 pt-2 border-t border-border/40">
      {suggestions.map((suggestion, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-shrink-0"
        >
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
                className="absolute inset-0 bg-primary/20"
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            )}
            
            <div className="flex flex-col items-start gap-1 relative z-10 w-full">
              {/* Main button content */}
              <div className="flex items-center gap-1.5 w-full">
                {/* Icon with animation */}
                {suggestion.category === 'ai-suggested' ? (
                  <motion.div
                    animate={clickedIndex === idx ? { rotate: 360, scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <Sparkles className="h-3 w-3 flex-shrink-0 text-primary" />
                  </motion.div>
                ) : suggestion.icon ? (
                  <span className="text-xs flex-shrink-0">{suggestion.icon}</span>
                ) : null}
                
                <span className="text-left flex-1 min-w-0 truncate">
                  {suggestion.text}
                </span>
                
                {/* Progress badge */}
                {suggestion.progress && (
                  <span className="text-[10px] font-medium opacity-70 flex-shrink-0">
                    {suggestion.progress.type === 'tasks' && `${suggestion.progress.current}/${suggestion.progress.total}`}
                    {suggestion.progress.type === 'xp' && `${suggestion.progress.percentage}%`}
                    {suggestion.progress.type === 'phase' && `${suggestion.progress.percentage}%`}
                    {suggestion.progress.type === 'energy' && `${suggestion.progress.current}/10`}
                  </span>
                )}
              </div>
              
              {/* Mini progress bar */}
              {suggestion.progress && (
                <div className="w-full h-1 bg-background/50 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-current opacity-50"
                    initial={{ width: 0 }}
                    animate={{ width: `${suggestion.progress.percentage}%` }}
                    transition={{ duration: 0.5, delay: idx * 0.05 + 0.2 }}
                  />
                </div>
              )}
            </div>
            
            {/* Subtle shimmer on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
          </Button>
        </motion.div>
      ))}
    </div>
  );
}
