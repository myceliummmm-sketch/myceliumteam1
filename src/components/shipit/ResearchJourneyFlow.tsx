import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, BarChart3, Users, Trophy, ArrowRight, ArrowLeft, RefreshCw } from "lucide-react";
import { ResearchTemplate, getTemplatesByStep, fillTemplate } from "@/lib/researchTemplates";
import { useGameStore } from "@/stores/gameStore";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CardSwipeGame } from "./CardSwipeGame";
import { ResearchProgressTimeline } from "./ResearchProgressTimeline";

interface ResearchJourneyFlowProps {
  open: boolean;
  onClose: () => void;
  sessionId: string;
}

const STEPS = [
  { number: 1, name: 'Research Focus', icon: Search, description: 'Define what to research' },
  { number: 2, name: 'Deep Research', icon: Sparkles, description: 'Generate raw findings' },
  { number: 3, name: 'Evaluation', icon: BarChart3, description: 'Score and analyze' },
  { number: 4, name: 'Team Perspectives', icon: Users, description: 'Get expert insights' },
  { number: 5, name: 'Summary', icon: Trophy, description: 'Review your research' }
];

export const ResearchJourneyFlow = ({ open, onClose, sessionId }: ResearchJourneyFlowProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<ResearchTemplate | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isStuckAtStep4, setIsStuckAtStep4] = useState(false);
  
  const { 
    researchRawCards, 
    researchInsightCards, 
    researchPerspectiveCards,
    triggerScoreResearch,
    triggerTeamPerspectives,
    setResearchPhase,
    setResearchCards
  } = useGameStore();

  const currentStepData = STEPS[currentStep - 1];
  const progress = (currentStep / STEPS.length) * 100;

  const handleTemplateSelect = (template: ResearchTemplate) => {
    setSelectedTemplate(template);
    setFormValues({});
  };

  const handleFormChange = (name: string, value: string) => {
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleStartResearch = async () => {
    if (!selectedTemplate) return;
    
    const filledPrompt = fillTemplate(selectedTemplate, formValues);
    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('deep-research', {
        body: {
          sessionId,
          researchFocus: filledPrompt,
          context: formValues
        }
      });

      if (error) throw error;

      // Save the generated cards to the store
      setResearchCards(data.cards || [], [], []);
      
      toast.success(`Generated ${data.cards?.length || 0} research findings!`);
      setResearchPhase('raw');
      
      // Advance to Step 2 immediately after success
      setCurrentStep(2);
      setIsProcessing(false);
    } catch (error) {
      console.error('Research error:', error);
      toast.error('Failed to generate research. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleEvaluate = async () => {
    if (researchRawCards.length === 0) return;
    
    setIsProcessing(true);
    setCurrentStep(3);
    
    try {
      const cardIds = researchRawCards.map(c => c.id);
      await triggerScoreResearch(cardIds, sessionId);
      
      // Wait a bit for cards to be created, then poll database
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Poll for RESEARCH_INSIGHT cards (fallback if function times out)
      let attempts = 0;
      const maxAttempts = 15; // 30 seconds max
      
      while (attempts < maxAttempts) {
        const { data: insightCards } = await supabase
          .from('dynamic_cards')
          .select('*')
          .eq('session_id', sessionId)
          .eq('card_type', 'RESEARCH_INSIGHT')
          .order('created_at', { ascending: false });
        
        if (insightCards && insightCards.length > 0) {
          // Update store with insight cards - preserve existing perspective cards
          setResearchCards(researchRawCards, insightCards, researchPerspectiveCards);
          toast.success(`${insightCards.length} insights evaluated!`);
          
          // Trigger team perspectives generation
          const insightIds = insightCards.map(c => c.id);
          triggerTeamPerspectives(insightIds, sessionId);
          break;
        }
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        attempts++;
      }
      
      setIsProcessing(false);
      setCurrentStep(4);
    } catch (error) {
      console.error('Evaluation error:', error);
      toast.error('Evaluation failed. Please try again.');
      setIsProcessing(false);
      // Stay at step 3 so user can retry
    }
  };

  // Removed broken auto-advance useEffect - now advancing directly in handleStartResearch

  // Auto-advance to step 5 when we have perspective cards
  useEffect(() => {
    if (currentStep === 4 && researchPerspectiveCards.length > 0) {
      setIsStuckAtStep4(false);
      setTimeout(() => {
        setCurrentStep(5);
      }, 1000);
    }
  }, [researchPerspectiveCards, currentStep]);

  // Fallback polling for team perspective cards at Step 4
  useEffect(() => {
    if (currentStep !== 4 || researchPerspectiveCards.length > 0) return;
    
    let pollCount = 0;
    const maxPolls = 20; // 60 seconds max
    
    const pollForPerspectives = async () => {
      const { data } = await supabase
        .from('dynamic_cards')
        .select('*')
        .eq('session_id', sessionId)
        .eq('card_type', 'TEAM_PERSPECTIVE')
        .order('created_at', { ascending: false });
      
      if (data && data.length > 0) {
        setResearchCards(researchRawCards, researchInsightCards, data);
        clearInterval(pollInterval);
        clearTimeout(stuckTimeout);
      }
      
      pollCount++;
      if (pollCount >= maxPolls) {
        clearInterval(pollInterval);
      }
    };
    
    const pollInterval = setInterval(pollForPerspectives, 3000);
    
    // Mark as stuck after 30 seconds
    const stuckTimeout = setTimeout(() => {
      setIsStuckAtStep4(true);
    }, 30000);
    
    return () => {
      clearInterval(pollInterval);
      clearTimeout(stuckTimeout);
    };
  }, [currentStep, researchPerspectiveCards.length, sessionId, researchRawCards, researchInsightCards]);

  const handleRetryPerspectives = async () => {
    if (researchInsightCards.length === 0) {
      toast.error("No insight cards to generate perspectives from");
      return;
    }
    
    setIsStuckAtStep4(false);
    setIsProcessing(true);
    
    try {
      const insightIds = researchInsightCards.map(c => c.id);
      await triggerTeamPerspectives(insightIds, sessionId);
      toast.success("Retrying team perspectives generation...");
    } catch (error) {
      console.error('Retry error:', error);
      toast.error('Failed to retry. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        const templates = getTemplatesByStep(1);
        
        // If research is processing, show the game immediately
        if (isProcessing) {
          return (
            <div className="space-y-6">
              {/* Progress Timeline */}
              <ResearchProgressTimeline 
                currentStage={1}
                isComplete={!isProcessing && researchRawCards.length > 0}
                onStageChange={(stage) => {
                  if (stage === 4 && researchRawCards.length > 0) {
                    // Research complete
                  }
                }}
              />

              {/* Card Swipe Game */}
              <div className="border-t pt-4">
                <div className="text-center mb-4">
                  <h3 className="font-bold text-lg mb-1">While You Wait...</h3>
                  <p className="text-sm text-muted-foreground">
                    Swipe through marketplace cards • Like ones you want to buy later
                  </p>
                </div>
                
                <CardSwipeGame 
                  onCardLiked={(card) => {
                    console.log("Liked card:", card.title);
                  }}
                  onCardSkipped={(card) => {
                    console.log("Skipped card:", card.title);
                  }}
                />
              </div>
            </div>
          );
        }
        
        return (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg mb-2">Choose Your Research Focus</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Select a research template to get started
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {templates.map(template => (
                <motion.div
                  key={template.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedTemplate?.id === template.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleTemplateSelect(template)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <h4 className="font-bold mb-1">{template.label}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                  {template.advisorTip && (
                    <p className="text-xs italic text-primary/80">{template.advisorTip}</p>
                  )}
                </motion.div>
              ))}
            </div>

            {selectedTemplate && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3 mt-4 pt-4 border-t"
              >
                {selectedTemplate.variables.map(variable => (
                  <div key={variable.name}>
                    <Label>{variable.label}</Label>
                    {variable.type === 'textarea' ? (
                      <Textarea
                        placeholder={variable.placeholder}
                        value={formValues[variable.name] || ''}
                        onChange={(e) => handleFormChange(variable.name, e.target.value)}
                        rows={3}
                      />
                    ) : (
                      <Input
                        placeholder={variable.placeholder}
                        value={formValues[variable.name] || ''}
                        onChange={(e) => handleFormChange(variable.name, e.target.value)}
                      />
                    )}
                  </div>
                ))}

                <Button 
                  onClick={handleStartResearch} 
                  disabled={isProcessing}
                  className="w-full"
                >
                  {isProcessing ? 'Starting Research...' : 'Start Deep Research'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* Progress Timeline */}
            <ResearchProgressTimeline 
              currentStage={1}
              onStageChange={(stage) => {
                if (stage === 4 && researchRawCards.length > 0) {
                  // Research complete
                }
              }}
            />

            {/* Card Swipe Game */}
            <div className="border-t pt-4">
              <div className="text-center mb-4">
                <h3 className="font-bold text-lg mb-1">While You Wait...</h3>
                <p className="text-sm text-muted-foreground">
                  Swipe through marketplace cards • Like ones you want to buy later
                </p>
              </div>
              
              <CardSwipeGame 
                onCardLiked={(card) => {
                  console.log("Liked card:", card.title);
                }}
                onCardSkipped={(card) => {
                  console.log("Skipped card:", card.title);
                }}
              />
            </div>

            {/* Continue Button (appears when research is done) */}
            {researchRawCards.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center pt-4 border-t"
              >
                <Badge className="text-lg px-4 py-2 mb-4">
                  {researchRawCards.length} findings generated!
                </Badge>
                <Button onClick={() => setCurrentStep(3)} size="lg" className="w-full">
                  Continue to Evaluation <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center py-4">
              <BarChart3 className="w-12 h-12 mx-auto text-primary mb-2" />
              <h3 className="font-bold text-lg">Evaluate Research</h3>
              <p className="text-sm text-muted-foreground">
                Score your findings on 5 key factors
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto p-2">
              {researchRawCards.map((card, i) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-3 border rounded-lg"
                >
                  <h4 className="font-bold text-sm mb-1">{card.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-3">{card.content}</p>
                </motion.div>
              ))}
            </div>

            <Button 
              onClick={handleEvaluate} 
              disabled={isProcessing}
              className="w-full"
            >
              {isProcessing ? 'Evaluating...' : 'Start Evaluation'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4 text-center py-8">
            <Users className="w-16 h-16 mx-auto text-primary animate-pulse" />
            <h3 className="font-bold text-xl">Generating Team Perspectives...</h3>
            <p className="text-muted-foreground">
              Your advisory team is analyzing the insights
            </p>
            <Progress value={researchPerspectiveCards.length > 0 ? 100 : 50} className="h-2 max-w-md mx-auto" />
            
            {isStuckAtStep4 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 space-y-3"
              >
                <p className="text-sm text-muted-foreground">
                  Taking longer than expected...
                </p>
                <Button 
                  onClick={handleRetryPerspectives}
                  disabled={isProcessing}
                  variant="outline"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {isProcessing ? 'Retrying...' : 'Retry Generation'}
                </Button>
              </motion.div>
            )}
          </div>
        );

      case 5:
        const totalCards = researchRawCards.length + researchInsightCards.length + researchPerspectiveCards.length;
        return (
          <div className="space-y-6 text-center py-8">
            <Trophy className="w-20 h-20 mx-auto text-amber-500" />
            <div>
              <h3 className="font-bold text-2xl mb-2">Research Complete!</h3>
              <p className="text-muted-foreground">
                You've generated valuable insights for your project
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="p-4 bg-card border rounded-lg">
                <div className="text-3xl font-bold text-primary">{researchRawCards.length}</div>
                <div className="text-sm text-muted-foreground">Raw Findings</div>
              </div>
              <div className="p-4 bg-card border rounded-lg">
                <div className="text-3xl font-bold text-primary">{researchInsightCards.length}</div>
                <div className="text-sm text-muted-foreground">Insights</div>
              </div>
              <div className="p-4 bg-card border rounded-lg">
                <div className="text-3xl font-bold text-primary">{researchPerspectiveCards.length}</div>
                <div className="text-sm text-muted-foreground">Perspectives</div>
              </div>
            </div>

            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg max-w-md mx-auto">
              <div className="text-4xl font-bold text-primary mb-1">+{totalCards * 50} XP</div>
              <div className="text-sm text-muted-foreground">Research Completion Bonus</div>
            </div>

            <Button onClick={onClose} size="lg" className="mt-4">
              View Collection <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <currentStepData.icon className="w-5 h-5 text-primary" />
              {currentStepData.name}
            </div>
            <Badge variant="outline">
              Step {currentStep} of {STEPS.length}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            {STEPS.map((step, i) => (
              <div
                key={step.number}
                className={`flex-1 text-center ${
                  i + 1 === currentStep ? 'font-bold text-primary' : ''
                } ${i + 1 < currentStep ? 'text-primary/60' : ''}`}
              >
                {step.name}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        {currentStep > 1 && currentStep < 5 && !isProcessing && (
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
