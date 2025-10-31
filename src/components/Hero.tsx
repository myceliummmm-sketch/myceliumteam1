import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import everGreenImg from "@/assets/advisor-ever-green.jpg";
import phoenixImg from "@/assets/advisor-phoenix.jpg";
import prismaImg from "@/assets/advisor-prisma.jpg";
import techPriestImg from "@/assets/advisor-tech-priest.jpg";
import toxicImg from "@/assets/advisor-toxic.jpg";
import virgilImg from "@/assets/advisor-virgil.jpg";
import zenImg from "@/assets/advisor-zen.jpg";

const Hero = () => {
  const navigate = useNavigate();
  
  const advisorAvatars = [
    { name: 'Ever Green', image: everGreenImg },
    { name: 'Prisma', image: prismaImg },
    { name: 'Phoenix', image: phoenixImg },
    { name: 'Toxic', image: toxicImg },
    { name: 'Tech Priest', image: techPriestImg },
    { name: 'Virgil', image: virgilImg },
    { name: 'Zen', image: zenImg },
  ];
  
  return (
    <section className="relative min-h-screen vaporwave-bg scanlines flex items-center justify-center overflow-hidden">
      {/* Hero Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-b from-deep-purple/80 via-deep-purple/60 to-dark-purple z-10" />
        <img 
          src="/hero-video.gif" 
          alt="Mycelium ecosystem visualization"
          className="w-full h-full object-cover opacity-40 blur-[1px]"
        />
      </div>

      {/* Content */}
      <div className="container relative z-20 px-6 py-24 text-center animate-fade-in">
        <div className="mb-6">
          <span className="inline-block px-4 py-2 bg-purple-900/50 border border-neon-pink/50 rounded-full text-neon-pink text-sm font-bold">
            COHORT #3 - STARTS FEB 10
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight tracking-tight">
          <span className="neon-text-pink">From Zero</span>
          <br />
          <span className="neon-text-cyan">to Hero</span>
        </h1>

        <p className="text-xl md:text-2xl text-purple-300 mb-8 max-w-3xl mx-auto">
          Ship your first product in 2-3 weeks with a full AI advisory squad.
          <br />
          <span className="text-neon-cyan font-bold">No more building alone.</span>
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Button 
            onClick={() => navigate('/register')}
            size="lg" 
            className="text-lg px-8 py-6 bg-gradient-to-r from-neon-pink to-neon-purple hover:from-neon-pink/90 hover:to-neon-purple/90 text-white font-bold neon-glow-pink transition-all"
          >
            Join Cohort #3 →
          </Button>
          <Button 
            onClick={() => navigate('/register')}
            size="lg" 
            className="text-lg px-8 py-6 bg-purple-900/50 hover:bg-purple-900/70 border-2 border-neon-cyan text-neon-cyan font-bold transition-all"
          >
            Watch Demo ▶
          </Button>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
          <div className="bg-purple-900/30 backdrop-blur-sm p-4 rounded-xl border border-neon-cyan/30">
            <div className="text-3xl font-black neon-text-cyan mb-1">342</div>
            <div className="text-purple-300 text-sm">Products Shipped</div>
          </div>
          <div className="bg-purple-900/30 backdrop-blur-sm p-4 rounded-xl border border-neon-pink/30">
            <div className="text-3xl font-black neon-text-pink mb-1">30%</div>
            <div className="text-purple-300 text-sm">Found Co-Founders</div>
          </div>
          <div className="bg-purple-900/30 backdrop-blur-sm p-4 rounded-xl border border-neon-cyan/30">
            <div className="text-3xl font-black neon-text-cyan mb-1">4.9/5</div>
            <div className="text-purple-300 text-sm">Rating</div>
          </div>
          <div className="bg-purple-900/30 backdrop-blur-sm p-4 rounded-xl border border-neon-pink/30">
            <div className="text-3xl font-black neon-text-pink mb-1">100%</div>
            <div className="text-purple-300 text-sm">Money Back</div>
          </div>
        </div>

        {/* Advisor Preview Grid */}
        <div className="flex items-center justify-center gap-4 flex-wrap max-w-2xl mx-auto">
          <p className="text-sm text-purple-300 font-mono w-full mb-4">meet your team:</p>
          {advisorAvatars.map((advisor, i) => (
            <div
              key={advisor.name}
              className="group relative w-16 h-16 rounded-full border-2 border-neon-pink/50 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-110 hover:border-neon-cyan hover:neon-glow-cyan"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 to-transparent group-hover:from-neon-cyan/40 transition-all duration-300 z-10" />
              <img 
                src={advisor.image} 
                alt={advisor.name}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-pulse">
        <div className="w-6 h-10 rounded-full border-2 border-neon-cyan/50 flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-neon-cyan rounded-full animate-[float_2s_ease-in-out_infinite]" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
