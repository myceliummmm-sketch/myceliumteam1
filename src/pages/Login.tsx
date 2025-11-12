import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Sparkles } from 'lucide-react';
import VersionSwitcher from '@/components/VersionSwitcher';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/shipit');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signIn(email, password);
    
    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      toast.success('Welcome back! Let\'s make magic happen ✨');
      if (user) {
        void supabase.from('user_events').insert({
          player_id: user.id,
          event_type: 'login_completed',
          event_category: 'auth',
          event_data: { method: 'email' },
          page_url: window.location.pathname
        });
      }
      navigate('/shipit');
    }
  };

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <div className="w-full max-w-md">
        {/* Welcoming Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-3 text-foreground">
            Welcome Back, Builder! 👋
          </h1>
          <p className="text-muted-foreground">
            Ready to continue your journey?
          </p>
        </div>

        <div className="mb-6">
          <VersionSwitcher currentVersion="1.0" variant="full" />
        </div>

        {/* Login Form */}
        <Card className="p-8 shadow-xl animate-fade-in" style={{ animationDelay: '100ms' }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>
            
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-11 font-semibold transition-transform hover:scale-105" 
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Continue Building'}
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
            className="w-full h-11"
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
            Sign in with Google
          </Button>
        </Card>

        {/* November CTA Section */}
        <Card className="mt-6 p-6 shadow-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h3 className="font-semibold text-lg">First time here?</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Join as a November early adopter - completely <span className="font-bold text-green-600 dark:text-green-400">FREE!</span>
            </p>
            <Button 
              onClick={() => navigate('/register')}
              className="w-full h-11 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 font-semibold transition-transform hover:scale-105"
            >
              Start Building Free →
            </Button>
            <p className="text-xs text-muted-foreground mt-3">
              No credit card • Full access • November special
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
