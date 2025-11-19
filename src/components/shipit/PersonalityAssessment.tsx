import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

interface Question {
  id: string;
  category: string;
  question: string;
  options: Array<{
    value: string;
    label: string;
    score: number;
  }>;
}

const ASSESSMENT_QUESTIONS: Question[] = [
  // Self-Awareness Questions
  {
    id: 'self_awareness_1',
    category: 'Self-Awareness',
    question: 'How do you typically respond to feedback about your work?',
    options: [
      { value: 'defensive', label: 'I tend to feel defensive initially', score: 2 },
      { value: 'neutral', label: 'I listen but don\'t always act on it', score: 5 },
      { value: 'receptive', label: 'I actively seek it out and reflect on it', score: 9 },
    ],
  },
  {
    id: 'self_awareness_2',
    category: 'Self-Awareness',
    question: 'When facing a challenge, how well do you understand your emotional response?',
    options: [
      { value: 'unclear', label: 'I react without understanding why', score: 3 },
      { value: 'somewhat', label: 'I notice my emotions but don\'t always understand them', score: 6 },
      { value: 'clear', label: 'I recognize my emotions and their triggers clearly', score: 9 },
    ],
  },
  
  // Alignment Questions
  {
    id: 'alignment_1',
    category: 'Alignment',
    question: 'How closely do your daily actions reflect your core values?',
    options: [
      { value: 'rarely', label: 'My actions often conflict with my values', score: 3 },
      { value: 'sometimes', label: 'I try but don\'t always succeed', score: 6 },
      { value: 'consistently', label: 'My actions consistently align with my values', score: 9 },
    ],
  },
  {
    id: 'alignment_2',
    category: 'Alignment',
    question: 'When making decisions, how do you prioritize?',
    options: [
      { value: 'convenience', label: 'What\'s easiest or most convenient', score: 3 },
      { value: 'practical', label: 'Balance between values and practicality', score: 6 },
      { value: 'values_first', label: 'My core values guide all decisions', score: 9 },
    ],
  },
  
  // Growth Mindset Questions
  {
    id: 'growth_1',
    category: 'Growth Mindset',
    question: 'How do you view failures or setbacks?',
    options: [
      { value: 'negative', label: 'As proof of my limitations', score: 2 },
      { value: 'neutral', label: 'As unfortunate but necessary', score: 5 },
      { value: 'positive', label: 'As valuable learning opportunities', score: 9 },
    ],
  },
  {
    id: 'growth_2',
    category: 'Growth Mindset',
    question: 'How often do you seek out new learning opportunities?',
    options: [
      { value: 'rarely', label: 'Only when required', score: 3 },
      { value: 'sometimes', label: 'Occasionally when interested', score: 6 },
      { value: 'actively', label: 'Constantly seeking to grow', score: 9 },
    ],
  },
  
  // Consistency Questions
  {
    id: 'consistency_1',
    category: 'Consistency',
    question: 'How consistent is your behavior across different contexts?',
    options: [
      { value: 'varies', label: 'I act very differently in different situations', score: 3 },
      { value: 'somewhat', label: 'Mostly consistent with some variation', score: 6 },
      { value: 'very', label: 'I\'m the same person in all contexts', score: 9 },
    ],
  },
  {
    id: 'consistency_2',
    category: 'Consistency',
    question: 'How reliable are you in following through on commitments?',
    options: [
      { value: 'unreliable', label: 'I often overcommit and underdeliver', score: 3 },
      { value: 'mostly', label: 'I usually follow through with some exceptions', score: 6 },
      { value: 'very', label: 'I consistently deliver on my promises', score: 9 },
    ],
  },
  
  // Empathy Questions
  {
    id: 'empathy_1',
    category: 'Empathy',
    question: 'How well do you understand others\' perspectives?',
    options: [
      { value: 'struggle', label: 'I find it hard to see from others\' viewpoints', score: 3 },
      { value: 'sometimes', label: 'I can understand when I make an effort', score: 6 },
      { value: 'naturally', label: 'I naturally understand and consider others\' perspectives', score: 9 },
    ],
  },
  {
    id: 'empathy_2',
    category: 'Empathy',
    question: 'How do you respond when someone shares their struggles?',
    options: [
      { value: 'advice', label: 'I immediately offer solutions', score: 4 },
      { value: 'listen', label: 'I listen and offer support', score: 7 },
      { value: 'deep', label: 'I deeply connect and validate their feelings first', score: 9 },
    ],
  },
];

interface PersonalityAssessmentProps {
  open: boolean;
  onClose: () => void;
}

export function PersonalityAssessment({ open, onClose }: PersonalityAssessmentProps) {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session');
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);

  const totalQuestions = ASSESSMENT_QUESTIONS.length;
  const progress = (currentStep / totalQuestions) * 100;
  const currentQuestion = ASSESSMENT_QUESTIONS[currentStep];

  // Safety guard: if currentStep is out of bounds, reset to 0
  if (!currentQuestion && open) {
    setCurrentStep(0);
    return null;
  }

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
    
    // Auto-advance to next question after a brief delay
    setTimeout(() => {
      if (currentStep < totalQuestions - 1) {
        setCurrentStep(prev => prev + 1);
      }
      // On last question, don't auto-advance - let them click "Generate Card"
    }, 400);
  };

  const handleNext = () => {
    if (!answers[currentQuestion.id]) {
      toast.error('Please select an answer before continuing');
      return;
    }
    
    if (currentStep < totalQuestions - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      generateAuthenticityCard();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const generateAuthenticityCard = async () => {
    if (!user || !sessionId) return;

    setIsGenerating(true);
    try {
      // Calculate scores by category
      const categoryScores: Record<string, { total: number; count: number }> = {};
      
      ASSESSMENT_QUESTIONS.forEach(q => {
        const answer = answers[q.id];
        const option = q.options.find(opt => opt.value === answer);
        if (option) {
          if (!categoryScores[q.category]) {
            categoryScores[q.category] = { total: 0, count: 0 };
          }
          categoryScores[q.category].total += option.score;
          categoryScores[q.category].count += 1;
        }
      });

      // Format responses for the edge function
      const assessmentSummary = Object.entries(categoryScores)
        .map(([category, { total, count }]) => {
          const average = total / count;
          return `${category}: ${average.toFixed(1)}/10`;
        })
        .join('\n');

      const detailedResponses = ASSESSMENT_QUESTIONS.map(q => {
        const answer = answers[q.id];
        const option = q.options.find(opt => opt.value === answer);
        return `Q: ${q.question}\nA: ${option?.label} (${q.category})`;
      }).join('\n\n');

      const conversationContext = `PERSONALITY ASSESSMENT RESULTS:

${assessmentSummary}

DETAILED RESPONSES:
${detailedResponses}

This is a comprehensive personality assessment covering Self-Awareness, Alignment, Growth Mindset, Consistency, and Empathy. Generate a personalized AUTHENTICITY card that reflects the individual's authentic self based on these responses.`;

      // Call the edge function to generate the card
      const { data, error } = await supabase.functions.invoke('generate-card-from-conversation', {
        body: {
          sessionId,
          messages: [
            { role: 'user', content: 'I completed a personality assessment' },
            { role: 'assistant', content: conversationContext }
          ],
          currentLevel: 0, // L0 for AUTHENTICITY
          currentPhase: 'SPARK',
          trigger: 'personality_assessment',
          selectedContent: conversationContext
        }
      });

      if (error) throw error;

      // Dispatch the animation event so CardCollection shows confetti
      window.dispatchEvent(new CustomEvent('cardGeneratedWithAnimation', { 
        detail: { 
          cardId: data.card_id,
          rarity: data.rarity,
          cardType: data.card_type
        } 
      }));

      toast.success('✨ Your Authenticity Card has been created!', {
        description: `Created a ${data.rarity} ${data.card_type} card!`
      });
      
      // Close modal after a brief delay to let user see the confetti
      setTimeout(() => {
        onClose();
        setCurrentStep(0);
        setAnswers({});
      }, 500);
    } catch (error) {
      console.error('Error generating authenticity card:', error);
      toast.error('Failed to generate your authenticity card');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Authenticity Assessment
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Answer questions about yourself to generate your personalized AUTHENTICITY card
          </p>
        </DialogHeader>

        {isGenerating ? (
          <div className="py-12 text-center space-y-4">
            <div className="inline-block animate-spin text-primary text-4xl">🎭</div>
            <p className="text-lg font-mono text-primary">Generating your Authenticity Card...</p>
            <p className="text-sm text-muted-foreground">Analyzing your responses and crafting your unique profile</p>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-mono text-muted-foreground">
                <span>Question {currentStep + 1} of {totalQuestions}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Current Question */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="text-xs font-mono text-primary uppercase">
                    {currentQuestion.category}
                  </div>
                  <h3 className="text-lg font-semibold">
                    {currentQuestion.question}
                  </h3>
                </div>

                <RadioGroup
                  value={answers[currentQuestion.id]}
                  onValueChange={handleAnswer}
                  className="space-y-3"
                >
                  {currentQuestion.options.map((option) => (
                    <div
                      key={option.value}
                      className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:border-primary/50 ${
                        answers[currentQuestion.id] === option.value
                          ? 'border-primary bg-primary/10'
                          : 'border-border'
                      }`}
                      onClick={() => handleAnswer(option.value)}
                    >
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label
                        htmlFor={option.value}
                        className="flex-1 cursor-pointer text-base"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between gap-4">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!answers[currentQuestion.id]}
                className="gap-2"
              >
                {currentStep === totalQuestions - 1 ? (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Card
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
