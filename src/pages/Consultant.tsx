import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { ArrowLeft, Copy, Sparkles } from 'lucide-react';

interface ConsultantResult {
  prompt: string;
  outline: string[];
  checklist: string[];
  suggestedActions: string[];
}

export default function Consultant() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [landingResult, setLandingResult] = useState<ConsultantResult | null>(null);
  const [pitchResult, setPitchResult] = useState<ConsultantResult | null>(null);

  // Landing form state
  const [landingForm, setLandingForm] = useState({
    productName: '',
    targetAudience: '',
    valueProp: '',
    brandAdjectives: '',
    references: '',
    visualVibe: '',
    mustHaveSections: '',
    cta: ''
  });

  // Pitch form state
  const [pitchForm, setPitchForm] = useState({
    problem: '',
    solution: '',
    market: '',
    competition: '',
    differentiation: '',
    traction: '',
    businessModel: '',
    gtm: '',
    team: '',
    ask: ''
  });

  const handleLandingSubmit = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('consultant-prompts', {
        body: { mode: 'landing', answers: landingForm }
      });

      if (error) throw error;

      setLandingResult(data);
      toast.success('Landing page prompt generated!');
    } catch (error: any) {
      console.error('Error generating landing prompt:', error);
      toast.error(error.message || 'Failed to generate prompt');
    } finally {
      setLoading(false);
    }
  };

  const handlePitchSubmit = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('consultant-prompts', {
        body: { mode: 'pitch', answers: pitchForm }
      });

      if (error) throw error;

      setPitchResult(data);
      toast.success('Pitch deck prompt generated!');
    } catch (error: any) {
      console.error('Error generating pitch prompt:', error);
      toast.error(error.message || 'Failed to generate prompt');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const handleRefinement = async (action: string, mode: 'landing' | 'pitch') => {
    setLoading(true);
    try {
      const currentForm = mode === 'landing' ? landingForm : pitchForm;
      const refinedAnswers = { ...currentForm, refinement: action };

      const { data, error } = await supabase.functions.invoke('consultant-prompts', {
        body: { mode, answers: refinedAnswers }
      });

      if (error) throw error;

      if (mode === 'landing') {
        setLandingResult(data);
      } else {
        setPitchResult(data);
      }
      toast.success('Prompt refined!');
    } catch (error: any) {
      console.error('Error refining prompt:', error);
      toast.error(error.message || 'Failed to refine prompt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-primary" />
              Consultant Mode
            </h1>
            <p className="text-muted-foreground">Generate beautiful prompts for Lovable</p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/shipit')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Game
          </Button>
        </div>

        <Tabs defaultValue="landing" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="landing">Landing Page</TabsTrigger>
            <TabsTrigger value="pitch">Pitch Deck</TabsTrigger>
          </TabsList>

          {/* Landing Page Tab */}
          <TabsContent value="landing">
            <div className="grid gap-8 lg:grid-cols-2">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Landing Page Details</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="productName">Product Name *</Label>
                    <Input
                      id="productName"
                      value={landingForm.productName}
                      onChange={(e) => setLandingForm({ ...landingForm, productName: e.target.value })}
                      placeholder="MycoNet"
                    />
                  </div>
                  <div>
                    <Label htmlFor="targetAudience">Target Audience *</Label>
                    <Input
                      id="targetAudience"
                      value={landingForm.targetAudience}
                      onChange={(e) => setLandingForm({ ...landingForm, targetAudience: e.target.value })}
                      placeholder="SaaS founders, startup teams"
                    />
                  </div>
                  <div>
                    <Label htmlFor="valueProp">Value Proposition *</Label>
                    <Textarea
                      id="valueProp"
                      value={landingForm.valueProp}
                      onChange={(e) => setLandingForm({ ...landingForm, valueProp: e.target.value })}
                      placeholder="Ship products 10x faster with AI"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="brandAdjectives">Brand Adjectives</Label>
                    <Input
                      id="brandAdjectives"
                      value={landingForm.brandAdjectives}
                      onChange={(e) => setLandingForm({ ...landingForm, brandAdjectives: e.target.value })}
                      placeholder="Bold, tech-forward, empowering"
                    />
                  </div>
                  <div>
                    <Label htmlFor="visualVibe">Visual Vibe</Label>
                    <Input
                      id="visualVibe"
                      value={landingForm.visualVibe}
                      onChange={(e) => setLandingForm({ ...landingForm, visualVibe: e.target.value })}
                      placeholder="Dark, neon accents, cyberpunk"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mustHaveSections">Must-Have Sections</Label>
                    <Textarea
                      id="mustHaveSections"
                      value={landingForm.mustHaveSections}
                      onChange={(e) => setLandingForm({ ...landingForm, mustHaveSections: e.target.value })}
                      placeholder="Hero, features, testimonials, pricing"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cta">Call to Action *</Label>
                    <Input
                      id="cta"
                      value={landingForm.cta}
                      onChange={(e) => setLandingForm({ ...landingForm, cta: e.target.value })}
                      placeholder="Start Building Free"
                    />
                  </div>
                  <Button
                    onClick={handleLandingSubmit}
                    disabled={loading || !landingForm.productName || !landingForm.targetAudience || !landingForm.valueProp || !landingForm.cta}
                    className="w-full"
                  >
                    {loading ? 'Generating...' : 'Generate Landing Page Prompt'}
                  </Button>
                </div>
              </Card>

              {landingResult && (
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Your Lovable Prompt</h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(landingResult.prompt)}
                      className="gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copy
                    </Button>
                  </div>
                  <Textarea
                    value={landingResult.prompt}
                    readOnly
                    className="mb-4 min-h-[300px] font-mono text-sm"
                  />
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Outline</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {landingResult.outline.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Checklist</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {landingResult.checklist.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  {landingResult.suggestedActions.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold">Refine Your Prompt:</h3>
                      <div className="flex flex-wrap gap-2">
                        {landingResult.suggestedActions.map((action, i) => (
                          <Button
                            key={i}
                            variant="outline"
                            size="sm"
                            onClick={() => handleRefinement(action, 'landing')}
                            disabled={loading}
                            className="text-xs"
                          >
                            {action}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Pitch Deck Tab */}
          <TabsContent value="pitch">
            <div className="grid gap-8 lg:grid-cols-2">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Pitch Deck Details</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="problem">Problem *</Label>
                    <Textarea
                      id="problem"
                      value={pitchForm.problem}
                      onChange={(e) => setPitchForm({ ...pitchForm, problem: e.target.value })}
                      placeholder="What problem are you solving?"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="solution">Solution *</Label>
                    <Textarea
                      id="solution"
                      value={pitchForm.solution}
                      onChange={(e) => setPitchForm({ ...pitchForm, solution: e.target.value })}
                      placeholder="How does your product solve it?"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="market">Market / ICP</Label>
                    <Textarea
                      id="market"
                      value={pitchForm.market}
                      onChange={(e) => setPitchForm({ ...pitchForm, market: e.target.value })}
                      placeholder="TAM, SAM, SOM and ideal customer profile"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="competition">Competition</Label>
                    <Input
                      id="competition"
                      value={pitchForm.competition}
                      onChange={(e) => setPitchForm({ ...pitchForm, competition: e.target.value })}
                      placeholder="Key competitors"
                    />
                  </div>
                  <div>
                    <Label htmlFor="differentiation">Differentiation</Label>
                    <Input
                      id="differentiation"
                      value={pitchForm.differentiation}
                      onChange={(e) => setPitchForm({ ...pitchForm, differentiation: e.target.value })}
                      placeholder="What makes you unique?"
                    />
                  </div>
                  <div>
                    <Label htmlFor="traction">Traction</Label>
                    <Input
                      id="traction"
                      value={pitchForm.traction}
                      onChange={(e) => setPitchForm({ ...pitchForm, traction: e.target.value })}
                      placeholder="Revenue, users, growth metrics"
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessModel">Business Model</Label>
                    <Input
                      id="businessModel"
                      value={pitchForm.businessModel}
                      onChange={(e) => setPitchForm({ ...pitchForm, businessModel: e.target.value })}
                      placeholder="How do you make money?"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gtm">Go-to-Market</Label>
                    <Input
                      id="gtm"
                      value={pitchForm.gtm}
                      onChange={(e) => setPitchForm({ ...pitchForm, gtm: e.target.value })}
                      placeholder="How will you acquire customers?"
                    />
                  </div>
                  <div>
                    <Label htmlFor="team">Team</Label>
                    <Input
                      id="team"
                      value={pitchForm.team}
                      onChange={(e) => setPitchForm({ ...pitchForm, team: e.target.value })}
                      placeholder="Founder backgrounds"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ask">The Ask *</Label>
                    <Input
                      id="ask"
                      value={pitchForm.ask}
                      onChange={(e) => setPitchForm({ ...pitchForm, ask: e.target.value })}
                      placeholder="Raising $2M seed"
                    />
                  </div>
                  <Button
                    onClick={handlePitchSubmit}
                    disabled={loading || !pitchForm.problem || !pitchForm.solution || !pitchForm.ask}
                    className="w-full"
                  >
                    {loading ? 'Generating...' : 'Generate Pitch Deck Prompt'}
                  </Button>
                </div>
              </Card>

              {pitchResult && (
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Your Lovable Prompt</h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(pitchResult.prompt)}
                      className="gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copy
                    </Button>
                  </div>
                  <Textarea
                    value={pitchResult.prompt}
                    readOnly
                    className="mb-4 min-h-[300px] font-mono text-sm"
                  />
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Slide Outline</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {pitchResult.outline.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Critical Elements</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {pitchResult.checklist.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  {pitchResult.suggestedActions.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold">Refine Your Prompt:</h3>
                      <div className="flex flex-wrap gap-2">
                        {pitchResult.suggestedActions.map((action, i) => (
                          <Button
                            key={i}
                            variant="outline"
                            size="sm"
                            onClick={() => handleRefinement(action, 'pitch')}
                            disabled={loading}
                            className="text-xs"
                          >
                            {action}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
