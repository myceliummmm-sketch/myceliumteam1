import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface QuickRepliesProps {
  suggestions: string[];
  onSelect: (text: string) => void;
  disabled?: boolean;
}

export function QuickReplies({ suggestions, onSelect, disabled }: QuickRepliesProps) {
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  
  if (suggestions.length === 0) return null;
  
  const handleClick = (suggestion: string, idx: number) => {
    setClickedIndex(idx);
    onSelect(suggestion);
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
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleClick(suggestion, idx)}
            disabled={disabled}
            className="text-xs h-7 px-3 relative overflow-hidden group"
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
            
            {/* Sparkle icon with rotation animation */}
            <motion.div
              animate={clickedIndex === idx ? { rotate: 360, scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="h-3 w-3 mr-1.5 flex-shrink-0 group-hover:text-primary transition-colors" />
            </motion.div>
            
            <span className="truncate relative z-10">{suggestion}</span>
            
            {/* Subtle shimmer on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
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
