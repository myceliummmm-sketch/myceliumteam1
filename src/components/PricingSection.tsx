import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PricingSection = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(437);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev + Math.floor(Math.random() * 2));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-secondary/20 to-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block animate-glitch mb-6">
            <h2 className="text-5xl md:text-7xl font-mono font-bold text-primary">
              THE DEAL:
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Free Tier */}
          <div className="relative p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-muted hover:border-primary/30 transition-all duration-300">
            <div className="mb-6">
              <h3 className="text-2xl font-mono font-bold mb-2">Free Trial</h3>
              <p className="text-sm text-muted-foreground">48 hours free. No card needed.</p>
            </div>

            <div className="mb-6">
              <div className="text-4xl font-mono font-bold text-foreground">€0</div>
              <p className="text-sm text-muted-foreground">for 48 hours</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">Full access to all advisors</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">Unlimited messages</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">No credit card required</span>
              </li>
            </ul>

            <Button onClick={() => navigate('/register')} variant="outline" className="w-full border-primary/30 hover:bg-primary/10 font-mono">
              Start Free Trial
            </Button>
          </div>

          {/* Builder Tier */}
          <div className="relative p-8 rounded-2xl bg-gradient-to-br from-primary/20 to-transparent border-2 border-primary/50 backdrop-blur-sm shadow-[0_0_40px_hsl(var(--primary)/0.3)] scale-105 z-10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div className="px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-mono font-bold flex items-center gap-1">
                <Zap className="w-3 h-3" />
                MOST POPULAR
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-mono font-bold mb-2">Builder</h3>
              <p className="text-sm text-muted-foreground">When you're ready to build for real</p>
            </div>

            <div className="mb-6">
              <div className="text-4xl font-mono font-bold text-foreground">€29</div>
              <p className="text-sm text-muted-foreground">per month</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Everything in Free</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Priority response times</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Code review & architecture help</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Weekly group sessions</span>
              </li>
            </ul>

            <Button onClick={() => navigate('/register')} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-mono shadow-[0_0_20px_hsl(var(--primary)/0.3)]">
              Get Started →
            </Button>

            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent blur-2xl -z-10" />
          </div>

          {/* Scale Tier */}
          <div className="relative p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-muted hover:border-neon-green/30 transition-all duration-300">
            <div className="mb-6">
              <h3 className="text-2xl font-mono font-bold mb-2">Scale</h3>
              <p className="text-sm text-muted-foreground">When you need humans on speed dial</p>
            </div>

            <div className="mb-6">
              <div className="text-4xl font-mono font-bold text-foreground">€299</div>
              <p className="text-sm text-muted-foreground">per month</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-neon-green shrink-0 mt-0.5" />
                <span className="text-sm">Everything in Builder</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-neon-green shrink-0 mt-0.5" />
                <span className="text-sm font-semibold">Video calls with real founders</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-neon-green shrink-0 mt-0.5" />
                <span className="text-sm">Direct Slack/Discord access</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-neon-green shrink-0 mt-0.5" />
                <span className="text-sm">Custom integrations & tools</span>
              </li>
            </ul>

            <Button onClick={() => navigate('/register')} variant="outline" className="w-full border-neon-green/30 hover:bg-neon-green/10 font-mono">
              Contact Sales
            </Button>
          </div>
        </div>

        {/* Comparison Text */}
        <div className="text-center space-y-4 mb-12">
          <p className="text-lg text-muted-foreground font-mono">
            Cheaper than one hour with McKinsey. Better than your friend who "knows business".
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-mono text-primary font-bold">{count} people ahead of you</span>
          </div>
        </div>

        <div className="text-center">
          <Button onClick={() => navigate('/register')} size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-mono shadow-[0_0_40px_hsl(var(--primary)/0.3)]">
            Apply for Early Access
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
