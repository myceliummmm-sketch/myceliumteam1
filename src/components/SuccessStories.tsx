import { TrendingUp } from "lucide-react";

const comparisonData = [
  { metric: "Completion Rate", solo: "7-15%", hero: "80%+" },
  { metric: "Burnout Rate", solo: "83%", hero: "<5%" },
  { metric: "Time to Ship", solo: "∞ (never)", hero: "14-21 days" },
  { metric: "Support", solo: "Google at 3 AM", hero: "<10 min response" },
  { metric: "Structure", solo: "0 (chaos)", hero: "10-phase playbook" },
  { metric: "Network", solo: "Alone", hero: "20+ founders" },
  { metric: "Find Co-founder", solo: "0%", hero: "30%" },
  { metric: "Revenue", solo: "€0", hero: "€10K+ MRR avg" },
];

const SuccessStories = () => {
  return (
    <>
      {/* The Numbers Don't Lie */}
      <section className="py-32 px-6 bg-gradient-to-b from-background to-dark-purple relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/2 w-96 h-96 bg-neon-purple/30 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-20 animate-fade-in">
            <div className="inline-flex items-center gap-2 glass-card px-6 py-3 rounded-full mb-6 neon-border-purple">
              <TrendingUp className="w-5 h-5 neon-text-purple" />
              <span className="text-sm font-mono neon-text-purple uppercase tracking-wider font-bold">Data-Driven Results</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black mb-6">
              <span className="neon-text-purple">THE NUMBERS</span>
              <br />
              <span className="text-foreground">DON'T LIE</span>
            </h2>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto mb-16 animate-fade-in">
            <div className="min-w-[700px] rounded-3xl glass-card border-2 neon-border-purple overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-3 gap-6 p-8 bg-dark-purple/50 border-b border-neon-purple/20">
                <div className="font-mono font-black text-foreground uppercase tracking-wide text-lg">
                  Metric
                </div>
                <div className="font-mono font-black neon-text-pink uppercase tracking-wide text-center text-lg">
                  Solo Coding ❌
                </div>
                <div className="font-mono font-black neon-text-cyan uppercase tracking-wide text-center text-lg">
                  With Mycelium ✅
                </div>
              </div>

              {/* Table Rows */}
              {comparisonData.map((row, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-3 gap-6 p-8 transition-all duration-300 hover:bg-neon-purple/5 group ${
                    index % 2 === 0 ? "bg-dark-purple/30" : "bg-dark-purple/20"
                  }`}
                >
                  <div className="font-mono text-foreground font-bold text-base">
                    {row.metric}
                  </div>
                  <div className="font-mono neon-text-pink/80 text-center text-base group-hover:neon-text-pink transition-colors">
                    {row.solo}
                  </div>
                  <div className="font-mono neon-text-cyan text-center font-black text-base">
                    {row.hero}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
            <div className="rounded-3xl glass-card neon-border-cyan p-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <p className="text-4xl font-black neon-text-cyan mb-2">472</p>
                  <p className="text-sm text-muted-foreground font-mono">shipped products</p>
                </div>
                <div>
                  <p className="text-4xl font-black neon-text-pink mb-2">92</p>
                  <p className="text-sm text-muted-foreground font-mono">co-founder matches</p>
                </div>
                <div>
                  <p className="text-4xl font-black neon-text-purple mb-2">&lt;5%</p>
                  <p className="text-sm text-muted-foreground font-mono">burnout rate</p>
                </div>
                <div>
                  <p className="text-4xl font-black neon-text-cyan mb-2">100%</p>
                  <p className="text-sm text-muted-foreground font-mono">network access</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Not a Course, A Network */}
      <section className="py-32 px-6 bg-gradient-to-b from-dark-purple to-background relative overflow-hidden">
        {/* Animated background effects */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-pink/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s' }} />
        </div>

        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="text-center space-y-8 animate-fade-in">
            <h2 className="text-5xl md:text-8xl font-black leading-tight">
              <span className="neon-text-pink">YOU'RE NOT BUYING</span>
              <br />
              <span className="neon-text-pink">A COURSE.</span>
            </h2>
            <h2 className="text-5xl md:text-8xl font-black leading-tight">
              <span className="neon-text-cyan">YOU'RE JOINING</span>
              <br />
              <span className="neon-text-cyan">A NETWORK.</span>
            </h2>
            <p className="text-2xl md:text-3xl text-muted-foreground font-mono max-w-3xl mx-auto mt-8">
              Mycelium Network: Where founders find each other and build together
            </p>
          </div>
        </div>

        {/* Pulsing glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-neon-cyan/10 via-neon-purple/10 to-neon-pink/10 rounded-full blur-3xl animate-pulse -z-10" style={{ animationDuration: '3s' }} />
      </section>
    </>
  );
};

export default SuccessStories;
