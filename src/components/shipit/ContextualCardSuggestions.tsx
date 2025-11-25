import { useEffect, useState } from 'react';
import { Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  role: string;
  content: string;
}

interface ContextualCardSuggestionsProps {
  currentPhase: string;
  currentLevel: number;
  recentMessages: Message[];
  onCardClick?: (card: any) => void;
}

export function ContextualCardSuggestions({ 
  currentPhase, 
  currentLevel, 
  recentMessages,
  onCardClick 
}: ContextualCardSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSuggestions();
  }, [currentPhase, currentLevel]);

  const loadSuggestions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('suggest-relevant-cards', {
        body: {
          currentPhase,
          currentLevel,
          recentMessages: recentMessages.slice(-10),
          limit: 3
        }
      });

      if (error) throw error;
      setSuggestions(data.suggestedCards || []);
    } catch (error) {
      console.error('Error loading suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || suggestions.length === 0) {
    return null;
  }

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-mono flex items-center gap-2">
          <Lightbulb className="h-4 w-4" />
          RELEVANT FROM YOUR COLLECTION
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {suggestions.map(card => (
          <div 
            key={card.id} 
            className="text-xs p-3 bg-card rounded border cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => onCardClick?.(card)}
          >
            <div className="font-semibold font-mono mb-1">{card.title}</div>
            <div className="text-muted-foreground line-clamp-2 mb-2">
              {card.content}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px]">
                {(card.relevance_score * 100).toFixed(0)}% match
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                {card.card_type}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
