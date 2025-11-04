import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, Zap, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PricingSection = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(17);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => Math.max(5, prev - Math.floor(Math.random() * 2)));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-32 px-6 bg-gradient-to-b from-dark-purple to-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-neon-cyan/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s' }} />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-neon-pink/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-2 glass-card px-6 py-3 rounded-full mb-6 neon-border-pink">
            <Zap className="w-5 h-5 neon-text-pink animate-pulse" />
            <span className="text-sm font-mono neon-text-pink font-bold uppercase tracking-wider">{count} spots left this week</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black mb-6">
            <span className="neon-text-cyan">THE INVESTMENT</span>
          </h2>
          <p className="text-xl text-muted-foreground font-mono">
            Cheaper than one hour with McKinsey. Better than your friend who "knows business".
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Test Drive */}
          <div className="relative p-10 rounded-3xl glass-card border-2 border-muted/30 hover:border-muted/50 transition-all duration-300">
            <div className="mb-8">
              <h3 className="text-3xl font-black mb-3">Test Drive</h3>
              <p className="text-sm text-muted-foreground font-mono">48 hours free. No card.</p>
            </div>

            <div className="mb-8">
              <div className="text-5xl font-black text-foreground mb-2">€0</div>
              <p className="text-sm text-muted-foreground font-mono">for 48 hours</p>
            </div>

            <ul className="space-y-4 mb-10">
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">Full AI advisory board access</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">Unlimited messages</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">No credit card required</span>
              </li>
            </ul>

            <Button onClick={() => navigate('/register')} variant="outline" className="w-full border-2 border-muted/30 hover:bg-muted/10 font-bold py-6 rounded-2xl transition-all">
              Test Drive Your AI Team
            </Button>
          </div>

          {/* Launch Mode - Most Popular */}
          <div className="relative p-10 rounded-3xl glass-card border-2 neon-border-cyan scale-105 z-10" style={{ boxShadow: 'var(--shadow-glow-cyan)' }}>
            <div className="absolute -top-5 left-1/2 -translate-x-1/2">
              <div className="px-6 py-2 rounded-full neon-border-cyan glass-card text-sm font-mono font-black flex items-center gap-2 neon-text-cyan">
                <Zap className="w-4 h-4" />
                MOST POPULAR
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-3xl font-black mb-3 neon-text-cyan">Launch Mode</h3>
              <p className="text-sm text-muted-foreground font-mono">Your coffee budget. Better ROI.</p>
            </div>

            <div className="mb-8">
              <div className="text-5xl font-black neon-text-cyan mb-2">€29</div>
              <p className="text-sm text-muted-foreground font-mono">per month</p>
              <p className="text-xs text-muted-foreground/60 font-mono mt-2">≈ 1 hour of consulting</p>
            </div>

            <ul className="space-y-4 mb-10">
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 neon-text-cyan shrink-0 mt-0.5" />
                <span className="text-sm font-semibold">Everything in Test Drive</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 neon-text-cyan shrink-0 mt-0.5" />
                <span className="text-sm font-semibold">Priority response (&lt;10 min)</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 neon-text-cyan shrink-0 mt-0.5" />
                <span className="text-sm font-semibold">Code review & architecture</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 neon-text-cyan shrink-0 mt-0.5" />
                <span className="text-sm font-semibold">Weekly founder sessions</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 neon-text-cyan shrink-0 mt-0.5" />
                <span className="text-sm font-semibold">Co-founder matching</span>
              </li>
            </ul>

            <Button 
              onClick={() => navigate('/register')} 
              className="w-full bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-purple hover:to-neon-cyan text-background font-black py-7 rounded-2xl transition-all duration-500"
              style={{ boxShadow: 'var(--shadow-glow-cyan)' }}
            >
              Claim Your Advisory Board →
            </Button>

            <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 to-transparent blur-3xl -z-10" />
          </div>

          {/* Hypergrowth */}
          <div className="relative p-10 rounded-3xl glass-card border-2 neon-border-pink hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-3xl font-black mb-3 neon-text-pink">Hypergrowth</h3>
                <p className="text-sm text-muted-foreground font-mono">AI + human experts on speed dial</p>
              </div>
              <Crown className="w-8 h-8 neon-text-pink" />
            </div>

            <div className="mb-8">
              <div className="text-5xl font-black neon-text-pink mb-2">€299</div>
              <p className="text-sm text-muted-foreground font-mono">per month</p>
              <p className="text-xs text-muted-foreground/60 font-mono mt-2">vs. €5K/month for agency</p>
            </div>

            <ul className="space-y-4 mb-10">
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 neon-text-pink shrink-0 mt-0.5" />
                <span className="text-sm font-semibold">Everything in Launch Mode</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 neon-text-pink shrink-0 mt-0.5" />
                <span className="text-sm font-semibold">Video calls with real founders</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 neon-text-pink shrink-0 mt-0.5" />
                <span className="text-sm font-semibold">Direct Slack/Discord access</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 neon-text-pink shrink-0 mt-0.5" />
                <span className="text-sm font-semibold">Custom integrations & tools</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 neon-text-pink shrink-0 mt-0.5" />
                <span className="text-sm font-semibold">Investor intro network</span>
              </li>
            </ul>

            <Button 
              onClick={() => navigate('/register')} 
              variant="outline" 
              className="w-full border-2 neon-border-pink hover:bg-neon-pink/10 font-bold py-6 rounded-2xl transition-all"
            >
              Apply for Hypergrowth
            </Button>
          </div>
        </div>

        {/* ROI Calculator Tease */}
        <div className="text-center space-y-6 glass-card rounded-3xl p-10 max-w-3xl mx-auto" style={{ border: '2px solid hsl(var(--neon-cyan) / 0.3)' }}>
          <p className="text-2xl font-bold text-foreground">
            Join 500+ builders who stopped planning and started launching
          </p>
          <p className="text-sm text-muted-foreground font-mono">
            Cost of not shipping: €0 revenue + 6 months wasted
          </p>
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full neon-border-pink glass-card animate-pulse">
            <div className="w-3 h-3 rounded-full bg-neon-pink" />
            <span className="text-sm font-mono neon-text-pink font-bold">{count} founders joined in last 48 hours</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
