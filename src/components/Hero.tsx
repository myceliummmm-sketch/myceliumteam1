import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
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
      {/* Hero Video Background with enhanced overlay */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background z-10" />
        <div className="absolute inset-0 bg-gradient-mesh z-10" />
        <img 
          src="/hero-video.gif" 
          alt="AI-powered ecosystem"
          loading="eager"
          className="w-full h-full object-cover opacity-40 blur-[1px]"
        />
      </div>

      {/* Content */}
      <div className="container relative z-20 px-6 py-24 text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card neon-border-pink mb-8 hover:scale-105 transition-transform">
          <Sparkles className="w-4 h-4 neon-text-pink animate-pulse" />
          <span className="text-sm font-mono neon-text-pink font-bold">COHORT #3 - 17 SPOTS LEFT</span>
        </div>

        <h1 className="text-5xl md:text-8xl font-black mb-8 leading-tight tracking-tight">
          <span className="block text-foreground mb-2">Ship Your Dream Project</span>
          <span className="block neon-text-cyan text-6xl md:text-9xl">With an AI Dream Team</span>
        </h1>

        <p className="text-xl md:text-3xl font-bold mb-4 max-w-4xl mx-auto">
          <span className="bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-transparent">
            7 specialized AI advisors + 20 co-founders ready to turn your idea into reality in 21 days
          </span>
        </p>

        <p className="text-lg md:text-xl neon-text-cyan font-semibold mb-2 max-w-2xl mx-auto">
          Your Personal AI Board of Directors Is Ready
        </p>
        
        <p className="text-base md:text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
          Stop building alone. Start shipping with AI. From idea to launch in 3 weeks.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button 
            onClick={() => navigate('/shipit')}
            size="lg" 
            className="group text-lg px-10 py-8 sm:py-7 w-full sm:w-auto bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-purple hover:to-neon-pink text-background font-black rounded-2xl transition-all duration-500 hover:scale-105"
            style={{ 
              boxShadow: 'var(--shadow-glow-cyan)',
              border: '2px solid hsl(var(--neon-cyan))'
            }}
          >
            <Zap className="w-5 h-5 mr-2" />
            Claim Your AI Advisory Board
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            onClick={() => navigate('/shipit')}
            size="lg" 
            className="group text-lg px-10 py-8 sm:py-7 w-full sm:w-auto glass-card hover:glass-card font-bold rounded-2xl transition-all duration-300 hover:scale-105"
            style={{
              border: '2px solid hsl(var(--neon-cyan) / 0.3)',
            }}
          >
            See AI Advisors in Action
          </Button>
        </div>

        {/* AI Advisors Preview with holographic effect */}
        <div className="glass-card rounded-3xl p-8 max-w-3xl mx-auto" style={{ border: '1px solid hsl(var(--neon-cyan) / 0.2)' }}>
          <p className="text-sm text-muted-foreground font-mono mb-6 uppercase tracking-wider">
            meet your executive team:
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {advisorAvatars.map((advisor, i) => (
              <div
                key={advisor.name}
                className="group relative w-20 h-20 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-125 hover:z-10"
                style={{ 
                  animationDelay: `${i * 100}ms`,
                  border: '2px solid hsl(var(--neon-cyan) / 0.3)',
                  boxShadow: '0 0 20px hsl(var(--neon-cyan) / 0.2)'
                }}
              >
                <div className="absolute inset-0 holographic group-hover:opacity-50 transition-opacity duration-500 z-10" />
                <img 
                  src={advisor.image} 
                  alt={advisor.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground font-mono mt-6">
            Trained on 10,000+ successful launches • $500/hr consultant quality
          </p>
        </div>
      </div>

      {/* Animated scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-pulse">
        <div className="w-8 h-12 rounded-full flex items-start justify-center p-2" style={{ border: '2px solid hsl(var(--neon-cyan) / 0.5)' }}>
          <div className="w-2 h-4 rounded-full animate-[float_2s_ease-in-out_infinite]" style={{ background: 'hsl(var(--neon-cyan))' }} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
