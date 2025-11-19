import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Sparkles, ArrowRight, ArrowLeft, TrendingUp, Target, Lightbulb, Brain, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useGameStore } from '@/stores/gameStore';
import { toast } from 'sonner';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

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
  const sessionId = useGameStore((state) => state.sessionId);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

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
      } else {
        // Last question answered - show summary screen
        setShowSummary(true);
      }
    }, 400);
  };

  const handleNext = () => {
    if (!answers[currentQuestion.id]) {
      toast.error('Please select an answer before continuing');
      return;
    }
    
    if (currentStep < totalQuestions - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const generateAuthenticityCard = async () => {
    if (!user) {
      toast.error('Please log in to generate your card');
      return;
    }
    
    if (!sessionId) {
      toast.error('No active session found. Please start a new session.');
      return;
    }

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
        setShowSummary(false);
      }, 500);
    } catch (error) {
      console.error('Error generating authenticity card:', error);
      toast.error('Failed to generate your authenticity card');
    } finally {
      setIsGenerating(false);
    }
  };

  // Calculate category scores for summary display
  const calculateCategoryScores = () => {
    const categoryScores: Record<string, { total: number; count: number; average: number }> = {};
    
    ASSESSMENT_QUESTIONS.forEach(q => {
      const answer = answers[q.id];
      const option = q.options.find(opt => opt.value === answer);
      if (option) {
        if (!categoryScores[q.category]) {
          categoryScores[q.category] = { total: 0, count: 0, average: 0 };
        }
        categoryScores[q.category].total += option.score;
        categoryScores[q.category].count += 1;
      }
    });

    // Calculate averages
    Object.keys(categoryScores).forEach(category => {
      const { total, count } = categoryScores[category];
      categoryScores[category].average = total / count;
    });

    return categoryScores;
  };

  // Transform category scores for radar chart
  const getRadarChartData = () => {
    const categoryScores = calculateCategoryScores();
    
    return [
      {
        category: 'Self-Awareness',
        score: categoryScores['Self-Awareness']?.average || 0,
        fullMark: 10,
      },
      {
        category: 'Alignment',
        score: categoryScores['Alignment']?.average || 0,
        fullMark: 10,
      },
      {
        category: 'Growth Mindset',
        score: categoryScores['Growth Mindset']?.average || 0,
        fullMark: 10,
      },
      {
        category: 'Consistency',
        score: categoryScores['Consistency']?.average || 0,
        fullMark: 10,
      },
      {
        category: 'Empathy',
        score: categoryScores['Empathy']?.average || 0,
        fullMark: 10,
      },
    ];
  };

  const chartConfig = {
    score: {
      label: 'Score',
      color: 'hsl(var(--primary))',
    },
  };

  // Generate personality insights based on scores
  interface PersonalityInsight {
    icon: typeof Brain;
    title: string;
    description: string;
    tips: string[];
  }

  const getPersonalityInsights = (): PersonalityInsight[] => {
    const categoryScores = calculateCategoryScores();
    const insights: PersonalityInsight[] = [];

    Object.entries(categoryScores).forEach(([category, { average }]) => {
      let insight: PersonalityInsight | null = null;

      if (category === 'Self-Awareness') {
        if (average >= 8) {
          insight = {
            icon: Brain,
            title: 'Strong Self-Awareness',
            description: 'You have excellent understanding of your emotions and behaviors.',
            tips: [
              'Share your self-reflection practices with others',
              'Mentor someone who struggles with self-awareness',
              'Journal your insights to track growth over time'
            ]
          };
        } else if (average >= 5) {
          insight = {
            icon: Brain,
            title: 'Developing Self-Awareness',
            description: 'You\'re building awareness but have room to grow.',
            tips: [
              'Practice daily 5-minute reflection sessions',
              'Ask trusted friends for honest feedback',
              'Try mindfulness meditation to understand your emotions better'
            ]
          };
        } else {
          insight = {
            icon: Brain,
            title: 'Build Self-Awareness',
            description: 'Increasing self-awareness will unlock your potential.',
            tips: [
              'Start with emotion labeling: name what you feel throughout the day',
              'Keep a simple journal: "What did I feel today and why?"',
              'Use the "5 Whys" technique when you have strong reactions'
            ]
          };
        }
      }

      if (category === 'Alignment') {
        if (average >= 8) {
          insight = {
            icon: Target,
            title: 'Values-Driven Life',
            description: 'Your actions consistently reflect your core values.',
            tips: [
              'Document your decision-making framework to help others',
              'Take on leadership roles that require ethical decisions',
              'Review your values quarterly to ensure they still resonate'
            ]
          };
        } else if (average >= 5) {
          insight = {
            icon: Target,
            title: 'Strengthening Alignment',
            description: 'You try to live by your values but face challenges.',
            tips: [
              'Write down your top 5 core values and review them weekly',
              'Before major decisions, ask: "Does this align with my values?"',
              'Identify one area where your actions conflict with values and address it'
            ]
          };
        } else {
          insight = {
            icon: Target,
            title: 'Discover Your Values',
            description: 'Clarifying your values will guide better decisions.',
            tips: [
              'List 10 moments when you felt most proud - find the common theme',
              'Identify what makes you angry - it reveals your values',
              'Choose 3 non-negotiable values to focus on this month'
            ]
          };
        }
      }

      if (category === 'Growth Mindset') {
        if (average >= 8) {
          insight = {
            icon: TrendingUp,
            title: 'Exceptional Growth Mindset',
            description: 'You embrace challenges and see failures as opportunities.',
            tips: [
              'Take on a "stretch project" outside your comfort zone',
              'Share your failure stories to inspire others',
              'Experiment with learning in a completely new domain'
            ]
          };
        } else if (average >= 5) {
          insight = {
            icon: TrendingUp,
            title: 'Growing Your Mindset',
            description: 'You\'re learning to embrace challenges more.',
            tips: [
              'After setbacks, write down 3 lessons learned',
              'Replace "I can\'t" with "I can\'t yet" in your vocabulary',
              'Celebrate effort and progress, not just outcomes'
            ]
          };
        } else {
          insight = {
            icon: TrendingUp,
            title: 'Unlock Growth Potential',
            description: 'Shifting your mindset will accelerate your development.',
            tips: [
              'Read "Mindset" by Carol Dweck to understand growth vs fixed mindset',
              'Start small: try one new thing this week without fear of failure',
              'Track your learning: "What did I try? What did I learn?"'
            ]
          };
        }
      }

      if (category === 'Consistency') {
        if (average >= 8) {
          insight = {
            icon: Heart,
            title: 'Highly Consistent',
            description: 'You\'re reliable and authentic across all contexts.',
            tips: [
              'Your consistency builds trust - leverage this in leadership',
              'Help others build reliable systems and habits',
              'Document your routines to maintain consistency during stress'
            ]
          };
        } else if (average >= 5) {
          insight = {
            icon: Heart,
            title: 'Building Consistency',
            description: 'You\'re working on being more reliable and authentic.',
            tips: [
              'Create a simple daily routine and stick to it for 30 days',
              'Track your commitments in a visible place',
              'Practice saying no to avoid overcommitting'
            ]
          };
        } else {
          insight = {
            icon: Heart,
            title: 'Develop Consistency',
            description: 'Building reliable patterns will strengthen relationships.',
            tips: [
              'Start with one small daily habit (e.g., 5-minute morning routine)',
              'Under-promise and over-deliver to rebuild trust',
              'Use accountability: share your commitments with a friend'
            ]
          };
        }
      }

      if (category === 'Empathy') {
        if (average >= 8) {
          insight = {
            icon: Heart,
            title: 'Deep Empathy',
            description: 'You naturally understand and connect with others.',
            tips: [
              'Use your empathy in conflict resolution and mediation',
              'Be mindful not to absorb others\' emotions - practice boundaries',
              'Teach active listening techniques to your team'
            ]
          };
        } else if (average >= 5) {
          insight = {
            icon: Heart,
            title: 'Growing Empathy',
            description: 'You can understand others when you make the effort.',
            tips: [
              'Practice active listening: listen without planning your response',
              'Ask "How are you feeling?" instead of "What do you think?"',
              'Read fiction to experience different perspectives'
            ]
          };
        } else {
          insight = {
            icon: Heart,
            title: 'Strengthen Empathy',
            description: 'Developing empathy will deepen your relationships.',
            tips: [
              'Pause before responding - ask yourself how the other person feels',
              'Practice this daily: imagine being in someone else\'s situation',
              'Volunteer or engage with people from different backgrounds'
            ]
          };
        }
      }

      if (insight) insights.push(insight);
    });

    return insights;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[85vh] overflow-y-auto">
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
        ) : showSummary ? (
          <div className="space-y-6 py-4">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="text-4xl">🎭</div>
              <h3 className="text-xl font-bold">Assessment Complete!</h3>
              <p className="text-sm text-muted-foreground">
                Review your personality profile before generating your card
              </p>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* LEFT: Radar Chart */}
              <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
                <div className="space-y-4">
                  <h4 className="text-sm font-mono text-primary uppercase text-center">
                    Your Profile
                  </h4>
                  <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
                    <RadarChart data={getRadarChartData()}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis 
                        dataKey="category" 
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                      />
                      <PolarRadiusAxis 
                        angle={90} 
                        domain={[0, 10]}
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <Radar 
                        name="Score" 
                        dataKey="score" 
                        stroke="hsl(var(--primary))" 
                        fill="hsl(var(--primary))" 
                        fillOpacity={0.6}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </RadarChart>
                  </ChartContainer>
                </div>
              </Card>

              {/* RIGHT: Score Breakdown */}
              <Card className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
                <div className="space-y-3">
                  <h4 className="text-sm font-mono text-primary uppercase">Your Scores</h4>
                  {Object.entries(calculateCategoryScores()).map(([category, { average }]) => (
                    <div key={category} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium">{category}</span>
                        <span className="text-xs font-mono text-primary">
                          {average.toFixed(1)}/10
                        </span>
                      </div>
                      <Progress 
                        value={(average / 10) * 100} 
                        className="h-1.5"
                      />
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Personality Insights */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                <h4 className="text-sm font-mono text-primary uppercase">
                  Your Insights & Growth Tips
                </h4>
              </div>
              
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {getPersonalityInsights().map((insight, index) => {
                  const Icon = insight.icon;
                  return (
                    <Card key={index} className="p-4 bg-card/30 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-colors">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <h5 className="text-sm font-semibold">{insight.title}</h5>
                            <p className="text-xs text-muted-foreground">{insight.description}</p>
                          </div>
                        </div>
                        
                        <div className="pl-11 space-y-2">
                          <p className="text-xs font-medium text-primary/80">Action Steps:</p>
                          <ul className="space-y-1.5">
                            {insight.tips.map((tip, tipIndex) => (
                              <li key={tipIndex} className="text-xs text-muted-foreground flex items-start gap-2">
                                <span className="text-primary mt-0.5">→</span>
                                <span className="flex-1">{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Bottom Note */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="h-3 w-3" />
                <span>Your unique AUTHENTICITY card will be crafted based on these results</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowSummary(false);
                  setCurrentStep(totalQuestions - 1);
                }}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Review Answers
              </Button>
              <Button
                onClick={generateAuthenticityCard}
                className="gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Generate My Card
              </Button>
            </div>
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
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
