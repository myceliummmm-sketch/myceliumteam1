import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/30 to-background z-10" />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-40"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-futuristic-structures-46043-large.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Content */}
      <div className="container relative z-20 px-6 py-24 text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-primary/20 mb-8">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-mono text-muted-foreground">building the digital state for the ai generation</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-mono font-bold mb-6 leading-tight">
          Your world-class team <br />
          <span className="text-primary">costs less than your </span>
          <span className="relative inline-block">
            <span className="relative z-10">Netflix subscription</span>
            <span className="absolute inset-0 blur-xl bg-primary/30 animate-pulse" />
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
          Real founders backing AI advisors. Real advice when you're stuck at 3am. 
          <span className="text-foreground font-semibold"> Real money in your Stripe account.</span>
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-mono shadow-[0_0_40px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_60px_hsl(var(--primary)/0.5)] transition-all duration-300"
          >
            Apply for Early Access
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="text-lg px-8 py-6 border-primary/30 hover:bg-primary/10 hover:border-primary/50 font-mono transition-all duration-300"
          >
            See Them Roast a Startup →
          </Button>
        </div>

        {/* Advisor Preview Grid */}
        <div className="flex items-center justify-center gap-4 flex-wrap max-w-2xl mx-auto">
          <p className="text-sm text-muted-foreground font-mono w-full mb-4">meet your team:</p>
          {['Ever Green', 'Prisma', 'Phoenix', 'Toxic', 'Tech Priest', 'Virgil', 'Zen'].map((name, i) => (
            <div
              key={name}
              className="group relative w-16 h-16 rounded-full border-2 border-primary/50 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-110 hover:border-primary hover:shadow-[0_0_20px_hsl(var(--primary)/0.5)]"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent group-hover:from-primary/40 transition-all duration-300" />
              <div className="w-full h-full bg-secondary flex items-center justify-center text-xs font-mono">
                {name.split(' ').map(w => w[0]).join('')}
              </div>
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
