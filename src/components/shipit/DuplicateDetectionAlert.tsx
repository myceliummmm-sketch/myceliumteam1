import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { DuplicateReviewModal } from './DuplicateReviewModal';

export function DuplicateDetectionAlert() {
  const { user } = useAuth();
  const [duplicates, setDuplicates] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (user) {
      loadExistingDuplicates();
    }
  }, [user]);

  const loadExistingDuplicates = async () => {
    try {
      const { data, error } = await supabase
        .from('card_duplicates')
        .select(`
          *,
          card_1:dynamic_cards!card_duplicates_card_id_1_fkey(*),
          card_2:dynamic_cards!card_duplicates_card_id_2_fkey(*)
        `)
        .eq('status', 'pending');

      if (!error && data) {
        setDuplicates(data);
      }
    } catch (error) {
      console.error('Error loading duplicates:', error);
    }
  };

  const scanForDuplicates = async () => {
    setIsScanning(true);
    try {
      const { data, error } = await supabase.functions.invoke('detect-duplicate-cards', {
        body: { similarityThreshold: 0.85 }
      });

      if (error) throw error;
      
      if (data.duplicatesFound > 0) {
        await loadExistingDuplicates();
      }
    } catch (error) {
      console.error('Error scanning for duplicates:', error);
    } finally {
      setIsScanning(false);
    }
  };

  if (duplicates.length === 0) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={scanForDuplicates}
        disabled={isScanning}
      >
        {isScanning ? 'Scanning...' : 'Scan for Duplicates'}
      </Button>
    );
  }

  return (
    <>
      <Alert className="border-amber-500/50 bg-amber-500/10">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle className="font-mono">Potential Duplicates Detected</AlertTitle>
        <AlertDescription className="text-sm">
          Found {duplicates.length} pair{duplicates.length !== 1 ? 's' : ''} of similar cards.
          <Button 
            variant="link" 
            className="h-auto p-0 ml-2"
            onClick={() => setIsModalOpen(true)}
          >
            Review duplicates →
          </Button>
        </AlertDescription>
      </Alert>

      <DuplicateReviewModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={loadExistingDuplicates}
      />
    </>
  );
}
