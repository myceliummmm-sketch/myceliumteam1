import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Sparkles, Loader2, Download, Copy, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PromptResultDisplay } from './PromptResultDisplay';

interface PromptGenerationModalProps {
  open: boolean;
  onClose: () => void;
  allCards: any[];
  preselectedCardIds?: string[];
}

export function PromptGenerationModal({ 
  open, 
  onClose, 
  allCards,
  preselectedCardIds = []
}: PromptGenerationModalProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>(preselectedCardIds.length > 0 ? preselectedCardIds : allCards.map(c => c.id));
  const [detailLevel, setDetailLevel] = useState<'brief' | 'standard' | 'comprehensive'>('standard');
  const [includeMetrics, setIncludeMetrics] = useState(true);
  const [targetAudience, setTargetAudience] = useState<'myself' | 'team' | 'developer' | 'stakeholder'>('myself');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [tokenCount, setTokenCount] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (selectedCardIds.length === 0) {
      toast({
        title: 'No cards selected',
        description: 'Please select at least one card',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    setStep(3);

    try {
      const { data, error } = await supabase.functions.invoke('synthesize-prompt-from-cards', {
        body: {
          cardIds: selectedCardIds,
          options: {
            detailLevel,
            includeMetrics,
            targetAudience,
          },
        },
      });

      if (error) throw error;

      setGeneratedPrompt(data.prompt);
      setTokenCount(data.tokenCount);
      
      toast({
        title: '✨ Prompt generated!',
        description: `Synthesized ${data.cardCount} cards into a comprehensive prompt`,
      });
    } catch (error: any) {
      console.error('Error generating prompt:', error);
      toast({
        title: 'Generation failed',
        description: error.message || 'Failed to generate prompt',
        variant: 'destructive',
      });
      setStep(2);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setGeneratedPrompt('');
    onClose();
  };

  const toggleCard = (cardId: string) => {
    setSelectedCardIds(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

  const selectAll = () => setSelectedCardIds(allCards.map(c => c.id));
  const selectNone = () => setSelectedCardIds([]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Generate Lovable Prompt from Cards
          </DialogTitle>
        </DialogHeader>

        {/* Step 1: Select Cards */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Select which cards to include ({selectedCardIds.length} of {allCards.length} selected)
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={selectAll}>Select All</Button>
                <Button variant="outline" size="sm" onClick={selectNone}>Select None</Button>
              </div>
            </div>

            <div className="grid gap-2 max-h-[400px] overflow-y-auto border rounded-lg p-4">
              {allCards.map((card) => (
                <div
                  key={card.id}
                  className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                >
                  <Checkbox
                    checked={selectedCardIds.includes(card.id)}
                    onCheckedChange={() => toggleCard(card.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{card.title}</div>
                    <div className="text-xs text-muted-foreground flex gap-2">
                      <span className="px-1.5 py-0.5 bg-primary/10 rounded">{card.card_type}</span>
                      {card.rarity && (
                        <span className="px-1.5 py-0.5 bg-secondary/10 rounded">{card.rarity}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose}>Cancel</Button>
              <Button onClick={() => setStep(2)} disabled={selectedCardIds.length === 0}>
                Next: Customize
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Customize Options */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label>Detail Level</Label>
              <RadioGroup value={detailLevel} onValueChange={(v: any) => setDetailLevel(v)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="brief" id="brief" />
                  <Label htmlFor="brief">Brief - Quick summary</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="standard" id="standard" />
                  <Label htmlFor="standard">Standard - Balanced detail</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="comprehensive" id="comprehensive" />
                  <Label htmlFor="comprehensive">Comprehensive - Full details</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>Target Audience</Label>
              <RadioGroup value={targetAudience} onValueChange={(v: any) => setTargetAudience(v)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="myself" id="myself" />
                  <Label htmlFor="myself">Myself - Personal reference</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="team" id="team" />
                  <Label htmlFor="team">Team - Collaboration context</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="developer" id="developer" />
                  <Label htmlFor="developer">New Developer - Onboarding</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="stakeholder" id="stakeholder" />
                  <Label htmlFor="stakeholder">Stakeholder - Business overview</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="metrics"
                checked={includeMetrics}
                onCheckedChange={(checked) => setIncludeMetrics(checked as boolean)}
              />
              <Label htmlFor="metrics">Include card scores and metrics</Label>
            </div>

            <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={handleGenerate} className="gap-2">
                <Sparkles className="w-4 h-4" />
                Generate Prompt
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Generation & Result */}
        {step === 3 && (
          <div className="space-y-4">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <div className="text-center">
                  <p className="font-medium">Synthesizing your cards...</p>
                  <p className="text-sm text-muted-foreground">
                    Analyzing {selectedCardIds.length} cards and generating structured prompt
                  </p>
                </div>
              </div>
            ) : generatedPrompt ? (
              <PromptResultDisplay
                prompt={generatedPrompt}
                cardCount={selectedCardIds.length}
                tokenCount={tokenCount}
                onRegenerate={() => setStep(2)}
                onClose={handleClose}
              />
            ) : null}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
