import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, ChevronRight, ChevronLeft, MapPin, Users, Tag, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PromptResultDisplay } from "./PromptResultDisplay";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CardGroup, 
  groupCardsByPhase, 
  groupCardsByCharacter, 
  groupCardsByTags, 
  groupCardsByEvent,
  mergeGroups
} from "@/lib/cardGrouping";
import { CardGroupPreview } from "./CardGroupPreview";
import { SmartGroupSuggestions } from "./SmartGroupSuggestions";

interface PromptGenerationModalProps {
  open: boolean;
  onClose: () => void;
  allCards: any[];
  preselectedCardIds?: string[];
}

export const PromptGenerationModal = ({ open, onClose, allCards, preselectedCardIds }: PromptGenerationModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>(preselectedCardIds || []);
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const [detailLevel, setDetailLevel] = useState<'brief' | 'standard' | 'comprehensive'>('standard');
  const [targetAudience, setTargetAudience] = useState<'myself' | 'team' | 'developer' | 'stakeholder'>('myself');
  const [includeMetrics, setIncludeMetrics] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [tokenCount, setTokenCount] = useState(0);
  const [groupingStrategy, setGroupingStrategy] = useState('phase');
  const [cardGroups, setCardGroups] = useState<CardGroup[]>([]);
  const [isLoadingAIGroups, setIsLoadingAIGroups] = useState(false);
  
  useEffect(() => {
    if (!open) return;
    
    switch (groupingStrategy) {
      case 'phase':
        setCardGroups(groupCardsByPhase(allCards));
        break;
      case 'character':
        setCardGroups(groupCardsByCharacter(allCards));
        break;
      case 'tag':
        setCardGroups(groupCardsByTags(allCards));
        break;
      case 'event':
        setCardGroups(groupCardsByEvent(allCards));
        break;
      case 'semantic':
        loadAIGroups();
        break;
    }
  }, [groupingStrategy, allCards, open]);

  const loadAIGroups = async () => {
    if (allCards.length < 3) {
      toast.error('Need at least 3 cards for AI clustering');
      return;
    }

    if (allCards.length > 50) {
      toast.error('AI clustering limited to 50 cards');
      return;
    }

    setIsLoadingAIGroups(true);
    try {
      const { data, error } = await supabase.functions.invoke('cluster-cards-by-content', {
        body: { cards: allCards }
      });

      if (error) throw error;
      setCardGroups(data.groups || []);
    } catch (error) {
      console.error('AI clustering error:', error);
      toast.error('Failed to generate AI groups');
      setGroupingStrategy('phase');
    } finally {
      setIsLoadingAIGroups(false);
    }
  };
  
  const toggleGroupSelection = (groupId: string) => {
    setSelectedGroupIds(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const applyGroupSelections = () => {
    const selectedGroups = cardGroups.filter(g => selectedGroupIds.includes(g.id));
    const merged = mergeGroups(selectedGroups);
    setSelectedCardIds(merged.cards.map(c => c.id));
    setCurrentStep(1);
  };

  const applyRecommendations = (groupIds: string[]) => {
    setSelectedGroupIds(prev => Array.from(new Set([...prev, ...groupIds])));
  };

  const handleGenerate = async () => {
    if (selectedCardIds.length === 0) {
      toast.error('Please select at least one card');
      return;
    }

    setIsGenerating(true);
    setCurrentStep(3);

    try {
      const selectedGroups = cardGroups.filter(g => selectedGroupIds.includes(g.id));
      const groupMetadata = selectedGroups.length > 0 ? {
        groups: selectedGroups.map(g => ({
          title: g.title,
          description: g.description,
          cardIds: g.cards.map(c => c.id)
        }))
      } : undefined;

      const { data, error } = await supabase.functions.invoke('synthesize-prompt-from-cards', {
        body: {
          cardIds: selectedCardIds,
          groupMetadata,
          options: {
            detailLevel,
            targetAudience,
            includeMetrics
          }
        }
      });

      if (error) throw error;

      setGeneratedPrompt(data.generatedPrompt);
      setTokenCount(data.tokenCount);
      toast.success('Prompt generated successfully!');
    } catch (error) {
      console.error('Error generating prompt:', error);
      toast.error('Failed to generate prompt');
      setCurrentStep(2);
    } finally {
      setIsGenerating(false);
    }
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Generate Lovable Prompt - Step {currentStep + 1}/4
          </DialogTitle>
        </DialogHeader>

        {/* Step 0: Smart Selection */}
        {currentStep === 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Choose related cards using smart grouping strategies
              </p>
              <Badge variant="secondary">
                {selectedGroupIds.length} groups • {selectedCardIds.length} cards
              </Badge>
            </div>

            <SmartGroupSuggestions
              allGroups={cardGroups}
              selectedGroups={selectedGroupIds}
              targetAudience={targetAudience}
              detailLevel={detailLevel}
              onApplyRecommendations={applyRecommendations}
            />

            <Tabs value={groupingStrategy} onValueChange={setGroupingStrategy}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="phase" className="gap-2">
                  <MapPin className="h-4 w-4" />
                  Phase
                </TabsTrigger>
                <TabsTrigger value="character" className="gap-2">
                  <Users className="h-4 w-4" />
                  Character
                </TabsTrigger>
                <TabsTrigger value="tag" className="gap-2">
                  <Tag className="h-4 w-4" />
                  Theme
                </TabsTrigger>
                <TabsTrigger value="event" className="gap-2">
                  <Zap className="h-4 w-4" />
                  Event
                </TabsTrigger>
                <TabsTrigger value="semantic" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  AI
                </TabsTrigger>
              </TabsList>

              {isLoadingAIGroups ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="mt-4 space-y-3 max-h-[400px] overflow-y-auto">
                  {cardGroups.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No groups found
                    </p>
                  ) : (
                    cardGroups.map((group) => (
                      <CardGroupPreview
                        key={group.id}
                        group={group}
                        selected={selectedGroupIds.includes(group.id)}
                        onToggle={() => toggleGroupSelection(group.id)}
                      />
                    ))
                  )}
                </div>
              )}
            </Tabs>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  Manual Selection
                </Button>
                <Button onClick={applyGroupSelections} disabled={selectedGroupIds.length === 0}>
                  Continue <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Manual Card Selection */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {selectedCardIds.length} of {allCards.length} cards selected
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={selectAll}>Select All</Button>
                <Button variant="outline" size="sm" onClick={selectNone}>Select None</Button>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto space-y-2">
              {allCards.map(card => (
                <div key={card.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50">
                  <Checkbox
                    checked={selectedCardIds.includes(card.id)}
                    onCheckedChange={() => toggleCard(card.id)}
                  />
                  <div className="flex-1">
                    <p className="font-medium">{card.title}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">{card.card_type}</Badge>
                      <Badge variant="outline" className="text-xs">{card.rarity}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setCurrentStep(0)}>
                <ChevronLeft className="h-4 w-4 mr-2" />Back
              </Button>
              <Button onClick={() => setCurrentStep(2)}>
                Next <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Customize */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <Label className="mb-3">Detail Level</Label>
              <RadioGroup value={detailLevel} onValueChange={(v: any) => setDetailLevel(v)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="brief" id="brief" />
                  <Label htmlFor="brief">Brief</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="standard" id="standard" />
                  <Label htmlFor="standard">Standard</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="comprehensive" id="comprehensive" />
                  <Label htmlFor="comprehensive">Comprehensive</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="mb-3">Target Audience</Label>
              <RadioGroup value={targetAudience} onValueChange={(v: any) => setTargetAudience(v)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="myself" id="myself" />
                  <Label htmlFor="myself">Myself</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="team" id="team" />
                  <Label htmlFor="team">Team</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="developer" id="developer" />
                  <Label htmlFor="developer">Developer</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="stakeholder" id="stakeholder" />
                  <Label htmlFor="stakeholder">Stakeholder</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox checked={includeMetrics} onCheckedChange={(c) => setIncludeMetrics(!!c)} id="metrics" />
              <Label htmlFor="metrics">Include card metrics and scores</Label>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                <ChevronLeft className="h-4 w-4 mr-2" />Back
              </Button>
              <Button onClick={handleGenerate} disabled={selectedCardIds.length === 0}>
                <Sparkles className="h-4 w-4 mr-2" />Generate
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Result */}
        {currentStep === 3 && (
          <div>
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Synthesizing prompt...</p>
              </div>
            ) : (
              <PromptResultDisplay
                prompt={generatedPrompt}
                tokenCount={tokenCount}
                cardCount={selectedCardIds.length}
                images={allCards
                  .filter(card => selectedCardIds.includes(card.id))
                  .map(card => card.artwork_url)
                  .filter((url): url is string => !!url)}
                onRegenerate={() => setCurrentStep(2)}
                onClose={onClose}
              />
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
