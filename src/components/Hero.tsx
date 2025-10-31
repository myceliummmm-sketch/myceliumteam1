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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hero Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background z-10" />
        <img 
          src="/hero-video.gif" 
          alt="Mycelium ecosystem visualization"
          className="w-full h-full object-cover opacity-90 blur-[2px]"
        />
      </div>

      {/* Content */}
      <div className="container relative z-20 px-6 py-24 text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-900/50 backdrop-blur-sm border border-pink-500/50 mb-8">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <span className="text-sm font-mono text-pink-400">COHORT #3 - STARTS FEB 10</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight tracking-tight">
          <span className="neon-text-pink text-7xl md:text-9xl">85%</span>
          <span className="text-white"> of developers</span>
          <br />
          <span className="neon-text-cyan">abandon side projects</span>
        </h1>

        <p className="text-2xl mb-4 max-w-2xl mx-auto text-purple-300">
          You're not weak. The system is broken.
        </p>
        
        <p className="text-xl md:text-2xl font-bold mb-6 max-w-3xl mx-auto">
          <span className="bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan bg-clip-text text-transparent">
            AI Squad of 7 + Mycelium Network of 20+ founders
          </span>
        </p>

        <p className="text-base md:text-lg text-cyan-400 font-semibold mb-2">
          Find a co-founder. Ship together. Network forever.
        </p>
        
        <p className="text-sm md:text-base text-purple-300 mb-12">
          2-3 weeks for MVP. Lifetime for connections.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button 
            onClick={() => navigate('/register')}
            size="lg" 
            className="text-lg px-8 py-6 bg-gradient-to-r from-neon-pink to-neon-purple hover:from-pink-600 hover:to-purple-700 text-white font-bold neon-glow-pink transition-all duration-300"
          >
            Join Cohort #3
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button 
            onClick={() => navigate('/register')}
            size="lg" 
            variant="ghost"
            className="text-lg px-8 py-6 border border-primary/30 hover:bg-primary/10 hover:border-primary/50 font-mono transition-all duration-300"
          >
            Watch Them Cook
          </Button>
        </div>

        {/* Advisor Preview Grid */}
        <div className="flex items-center justify-center gap-4 flex-wrap max-w-2xl mx-auto">
          <p className="text-sm text-muted-foreground font-mono w-full mb-4">meet your team:</p>
          {advisorAvatars.map((advisor, i) => (
            <div
              key={advisor.name}
              className="group relative w-16 h-16 rounded-full border-2 border-primary/50 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-110 hover:border-primary hover:shadow-[0_0_20px_hsl(var(--primary)/0.5)]"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent group-hover:from-primary/40 transition-all duration-300 z-10" />
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
        <div className="w-6 h-10 rounded-full border-2 border-primary/50 flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-primary rounded-full animate-[float_2s_ease-in-out_infinite]" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
