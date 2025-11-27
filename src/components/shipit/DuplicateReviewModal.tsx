import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CollectibleCard } from './CollectibleCard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DYNAMIC_CARD_COLUMNS } from '@/lib/cardColumns';

interface DuplicateReviewModalProps {
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export function DuplicateReviewModal({ open, onClose, onUpdate }: DuplicateReviewModalProps) {
  const [duplicatePairs, setDuplicatePairs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      loadDuplicates();
    }
  }, [open]);

  const loadDuplicates = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('card_duplicates')
        .select(`
          *,
          card_1:dynamic_cards!card_duplicates_card_id_1_fkey(${DYNAMIC_CARD_COLUMNS}),
          card_2:dynamic_cards!card_duplicates_card_id_2_fkey(${DYNAMIC_CARD_COLUMNS})
        `)
        .eq('status', 'pending')
        .order('similarity_score', { ascending: false });

      if (error) throw error;
      setDuplicatePairs(data || []);
    } catch (error) {
      console.error('Error loading duplicates:', error);
      toast.error('Failed to load duplicates');
    } finally {
      setLoading(false);
    }
  };

  const archiveCard = async (pairId: string, cardId: string) => {
    try {
      // Archive the card
      await supabase
        .from('dynamic_cards')
        .update({ is_archived: true })
        .eq('id', cardId);

      // Update duplicate status
      await supabase
        .from('card_duplicates')
        .update({ status: 'merged', reviewed_at: new Date().toISOString() })
        .eq('id', pairId);

      toast.success('Card archived');
      await loadDuplicates();
      onUpdate();
    } catch (error) {
      console.error('Error archiving card:', error);
      toast.error('Failed to archive card');
    }
  };

  const keepBoth = async (pairId: string) => {
    try {
      await supabase
        .from('card_duplicates')
        .update({ status: 'ignored', reviewed_at: new Date().toISOString() })
        .eq('id', pairId);

      toast.success('Marked as keep both');
      await loadDuplicates();
      onUpdate();
    } catch (error) {
      console.error('Error keeping both:', error);
      toast.error('Failed to update status');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="font-mono">Review Duplicate Cards</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[600px] pr-4">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading duplicates...</div>
          ) : duplicatePairs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No pending duplicates to review
            </div>
          ) : (
            <div className="space-y-6">
              {duplicatePairs.map(pair => (
                <div key={pair.id} className="border rounded-lg p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <CollectibleCard card={pair.card_1} />
                    </div>
                    <div>
                      <CollectibleCard card={pair.card_2} />
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <Badge variant="outline" className="font-mono">
                      {(pair.similarity_score * 100).toFixed(0)}% similar
                    </Badge>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => archiveCard(pair.id, pair.card_id_1)}
                    >
                      Archive Left
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => archiveCard(pair.id, pair.card_id_2)}
                    >
                      Archive Right
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => keepBoth(pair.id)}
                    >
                      Keep Both
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
