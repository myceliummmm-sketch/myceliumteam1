import AdvisorCard from "./AdvisorCard";
import { TEAM_MEMBERS } from "@/lib/characterData";

const AdvisorsGrid = () => {
  return (
    <section className="py-32 px-6 bg-gradient-to-b from-background via-dark-purple to-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-cyan/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-pink/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-block glass-card px-6 py-3 rounded-full mb-6 neon-border-cyan">
            <p className="text-sm font-mono neon-text-cyan uppercase tracking-wider">Trained on 10,000+ successful launches</p>
          </div>
          <h2 className="text-5xl md:text-7xl font-black mb-6">
            <span className="neon-text-cyan">YOUR PERSONAL</span>
            <br />
            <span className="text-foreground">AI BOARD OF DIRECTORS</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground font-mono max-w-3xl mx-auto">
            $500/hr consultant quality. Instant responses. Zero attitude.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          {TEAM_MEMBERS.map((advisor, index) => (
            <div
              key={advisor.name}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <AdvisorCard {...advisor} />
            </div>
          ))}
        </div>

        <div className="text-center glass-card rounded-2xl p-8 max-w-2xl mx-auto" style={{ border: '1px solid hsl(var(--neon-cyan) / 0.2)' }}>
          <p className="text-sm text-muted-foreground font-mono mb-2">
            Your competition shipped 3 products while you read this
          </p>
          <p className="text-xs text-muted-foreground/60 font-mono">
            (seriously, they don't know this exists yet)
          </p>
        </div>
      </div>
    </section>
  );
};

export default AdvisorsGrid;
