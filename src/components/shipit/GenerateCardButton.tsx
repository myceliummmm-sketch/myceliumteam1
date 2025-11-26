import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export function GenerateCardButton() {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const sessionId = useGameStore((state) => state.sessionId);
  const currentPhase = useGameStore((state) => state.currentPhase);
  const level = useGameStore((state) => state.level);
  const messages = useGameStore((state) => state.messages);

  const handleGenerateCard = async () => {
    if (!user || !sessionId || messages.length < 3) {
      toast.error('Need at least a few messages to generate a card');
      return;
    }

    setIsGenerating(true);
    try {
      // Get last 15 messages for context
      const recentMessages = messages.slice(-15).map(m => ({
        role: m.role,
        content: m.content
      }));

      console.log('Generating card from conversation...', {
        messageCount: recentMessages.length,
        phase: currentPhase,
        level
      });

      // Call edge function
      const { data, error } = await supabase.functions.invoke('generate-card-from-conversation', {
        body: {
          sessionId,
          messages: recentMessages,
          currentLevel: level,
          currentPhase: currentPhase,
          trigger: 'manual_generation'
        }
      });

      if (error) {
        console.error('Card generation error:', error);
        throw error;
      }

      console.log('Card generated successfully:', data);

      toast.success('Card generated successfully!', {
        description: `Created a ${data.rarity} ${data.card_type} card`
      });

      // Dispatch custom event with animation trigger
      window.dispatchEvent(new CustomEvent('cardGeneratedWithAnimation', { 
        detail: { 
          cardId: data.card_id,
          rarity: data.rarity,
          cardType: data.card_type
        } 
      }));
      
    } catch (error) {
      console.error('Error generating card:', error);
      toast.error('Failed to generate card', {
        description: error instanceof Error ? error.message : 'Please try again'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const canGenerate = messages.length >= 3 && !isGenerating;

  return (
    <motion.div
      className="relative"
      animate={canGenerate ? {
        scale: [1, 1.02, 1],
      } : {}}
      transition={{
        duration: 2,
        repeat: canGenerate ? Infinity : 0,
        ease: "easeInOut"
      }}
    >
      {/* Ping ring effect */}
      {canGenerate && (
        <span className="absolute inset-0 rounded-md bg-cyan-500 animate-ping-cyan opacity-75"></span>
      )}
      
      {/* Shimmer overlay */}
      {canGenerate && (
        <div 
          className="absolute inset-0 rounded-md overflow-hidden pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 3s linear infinite'
          }}
        />
      )}
      
      <Button
        onClick={handleGenerateCard}
        disabled={!canGenerate}
        className={`relative gap-2 bg-cyan-500/90 hover:bg-cyan-500 text-black font-semibold shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 ${
          canGenerate ? 'animate-glow-pulse' : ''
        }`}
        size="lg"
        title={!canGenerate ? 'Need at least 3 messages to generate a card' : 'Generate a card from recent conversation'}
      >
        <motion.div
          animate={canGenerate ? {
            rotate: [0, -10, 10, -10, 0],
          } : {}}
          transition={{
            duration: 1,
            repeat: canGenerate ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          <Sparkles className="h-5 w-5" />
        </motion.div>
        {isGenerating ? 'Generating...' : 'Generate Card'}
      </Button>
    </motion.div>
  );
}
