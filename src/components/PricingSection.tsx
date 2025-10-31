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
    <section className="py-20 px-6 vaporwave-bg scanlines" id="pricing">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-black mb-4">
            <span className="neon-text-pink">Simple</span>{' '}
            <span className="neon-text-cyan">Pricing</span>
          </h2>
          <p className="text-xl text-purple-300">
            One cohort. One price.{' '}
            <span className="text-neon-cyan font-bold">Lifetime network access.</span>
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-950/60 to-pink-950/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 border-2 border-neon-pink neon-glow-pink">
          <div className="text-center mb-8">
            <div className="inline-block px-6 py-2 bg-gradient-to-r from-neon-pink to-neon-purple text-white text-sm font-bold rounded-full mb-6 neon-glow-pink">
              COHORT #3 - STARTS FEB 10 - 8 SPOTS LEFT
            </div>
            <div className="text-6xl md:text-7xl font-black neon-text-cyan mb-2">
              $497
            </div>
            <div className="text-purple-300 text-lg">2-3 weeks intensive</div>
            <div className="text-neon-cyan text-sm mt-2">
              ~$35/день твоего будущего
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3 text-white">
              <Check className="w-5 h-5 text-neon-cyan shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Full Mycelium Squad</span> (7 AI advisors)
              </div>
            </div>
            <div className="flex items-start gap-3 text-white">
              <Check className="w-5 h-5 text-neon-cyan shrink-0 mt-0.5" />
              <div>Complete research & design phase</div>
            </div>
            <div className="flex items-start gap-3 text-white">
              <Check className="w-5 h-5 text-neon-cyan shrink-0 mt-0.5" />
              <div>Daily support during build (&lt;10min response)</div>
            </div>
            <div className="flex items-start gap-3 text-white">
              <Check className="w-5 h-5 text-neon-cyan shrink-0 mt-0.5" />
              <div>Master Prompt for your project</div>
            </div>
            <div className="flex items-start gap-3 text-white">
              <Check className="w-5 h-5 text-neon-cyan shrink-0 mt-0.5" />
              <div>Launch strategy & first users</div>
            </div>
            <div className="flex items-start gap-3 text-white">
              <Check className="w-5 h-5 text-neon-pink shrink-0 mt-0.5" />
              <div className="font-bold neon-text-pink">
                Lifetime Mycelium Network access
              </div>
            </div>
          </div>

          <Button 
            onClick={() => navigate('/register')}
            className="w-full bg-gradient-to-r from-neon-pink to-neon-purple hover:from-neon-pink/90 hover:to-neon-purple/90 text-white font-black text-xl py-5 rounded-xl neon-glow-pink transition-all transform hover:scale-105"
          >
            Join Cohort #3 →
          </Button>

          <div className="mt-8 space-y-3 text-center">
            <div className="flex items-center justify-center gap-6 text-sm">
              <span className="flex items-center gap-2 text-purple-300">
                <Zap className="w-4 h-4 text-neon-cyan" />
                <span className="font-bold text-neon-pink">8 spots left</span> / 15 total
              </span>
              <span className="flex items-center gap-2 text-purple-300">
                <span className="text-neon-cyan">💰</span>
                100% money-back
              </span>
            </div>
            <div className="text-xs text-purple-400">
              Alumni Network Forever 🍄 • Co-founder Matchmaking • Lifetime Support
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="text-purple-300 text-sm">
            <div className="text-neon-cyan font-bold">342</div>
            Products Shipped
          </div>
          <div className="text-purple-300 text-sm">
            <div className="text-neon-pink font-bold">30%</div>
            Found Co-Founders
          </div>
          <div className="text-purple-300 text-sm">
            <div className="text-neon-cyan font-bold">4.9/5</div>
            Average Rating
          </div>
          <div className="text-purple-300 text-sm">
            <div className="text-neon-pink font-bold">Forever</div>
            Alumni Network
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
