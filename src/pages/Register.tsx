import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CheckCircle2, Zap, Clock } from 'lucide-react';
import { NovemberBanner } from '@/components/auth/NovemberBanner';
import { TrustBadge } from '@/components/auth/TrustBadge';
import { BenefitsList } from '@/components/auth/BenefitsList';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/shipit');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signUp(email, password, username);
    
    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      toast.success('🎉 Welcome aboard, November pioneer! Let\'s start building!');
      setTimeout(() => {
        if (user) {
          void supabase.from('user_events').insert({
            player_id: user.id,
            event_type: 'signup_completed',
            event_category: 'auth',
            event_data: { method: 'email', cohort: 'november_2024' },
            page_url: window.location.pathname
          });
        }
      }, 100);
    }
  };

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  const benefits = [
    { emoji: '🎮', text: 'Gamified coding experience' },
    { emoji: '⚡', text: 'Ship projects faster' },
    { emoji: '🏆', text: 'Level up as you code' },
    { emoji: '🤝', text: 'Founding member status' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <div className="w-full max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Join November's Founding Builders 🚀
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Free access for early adopters • No credit card required
          </p>
        </div>

        <NovemberBanner />

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Main Form */}
          <Card className="p-10 shadow-xl animate-fade-in" style={{ animationDelay: '100ms' }}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  type="text"
                  placeholder="Choose your builder name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="h-12"
                />
              </div>
              
              <div>
                <Input
                  type="email"
                  placeholder="your@email.com (we'll never spam!)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>
              
              <div>
                <Input
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="h-12"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold transition-transform hover:scale-105" 
                disabled={loading}
              >
                {loading ? 'Creating your account...' : '🚀 Start Building Free'}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button 
              type="button" 
              variant="outline" 
              className="w-full h-12"
              onClick={handleGoogleSignIn}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign up with Google
            </Button>
            
            <p className="mt-6 text-center text-sm text-muted-foreground">
              By signing up in November, you get free access to all features
            </p>
            
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account? <a href="/login" className="text-primary hover:underline font-medium">Login</a>
            </p>
          </Card>

          {/* Benefits & Trust Signals */}
          <div className="space-y-6">
            {/* Trust Signals */}
            <Card className="p-6 shadow-lg animate-fade-in" style={{ animationDelay: '200ms' }}>
              <h3 className="font-semibold mb-4 text-lg">Why Join Now?</h3>
              <div className="space-y-3">
                <TrustBadge icon={CheckCircle2} text="No credit card required" delay={0} />
                <TrustBadge icon={CheckCircle2} text="Free access for November joiners" delay={100} />
                <TrustBadge icon={CheckCircle2} text="Full feature access" delay={200} />
                <TrustBadge icon={CheckCircle2} text="Gamified learning experience" delay={300} />
                <TrustBadge icon={CheckCircle2} text="Join the founding community" delay={400} />
                <TrustBadge icon={Clock} text="Limited November spots" variant="urgent" delay={500} />
              </div>
            </Card>

            {/* Benefits List */}
            <Card className="p-6 shadow-lg animate-fade-in" style={{ animationDelay: '300ms' }}>
              <h3 className="font-semibold mb-4 text-lg">What You'll Get</h3>
              <BenefitsList benefits={benefits} />
            </Card>

            {/* Social Proof */}
            <Card className="p-6 shadow-lg bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 animate-fade-in" style={{ animationDelay: '400ms' }}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm italic mb-2">"Love the gamified experience! Makes coding so much more engaging."</p>
                  <p className="text-xs text-muted-foreground">- Alex, November Builder</p>
                </div>
              </div>
            </Card>

            {/* Urgency Banner */}
            <div className="text-center p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-lg animate-pulse">
              <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                ⏰ November early access filling fast!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
