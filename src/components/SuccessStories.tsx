const comparisonData = [
  { metric: "Completion Rate", solo: "7-15%", hero: "80%+" },
  { metric: "Burnout Rate", solo: "83%", hero: "<5%" },
  { metric: "Time to Ship", solo: "∞ (never)", hero: "14-21 days" },
  { metric: "Support", solo: "Google at 3 AM", hero: "AI + Community <10 min" },
  { metric: "Structure", solo: "0 (chaos)", hero: "10 phases" },
  { metric: "Network", solo: "Alone", hero: "20+ founders" },
  { metric: "Find Co-founder", solo: "0%", hero: "30%" },
  { metric: "Portfolio", solo: "0 products", hero: "1 shipped MVP" },
];

const SuccessStories = () => {
  return (
    <>
      {/* Block 4: THE NUMBERS DON'T LIE - Comparison Table */}
      <section className="py-24 px-6 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-6xl font-mono font-bold mb-4">
              THE NUMBERS DON'T LIE
            </h2>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto mb-12 animate-fade-in">
            <div className="min-w-[600px] rounded-2xl bg-purple-950/30 backdrop-blur-sm border border-primary/20 overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-3 gap-4 p-6 bg-purple-950/50 border-b border-primary/20">
                <div className="font-mono font-bold text-foreground uppercase tracking-wide">
                  Metric
                </div>
                <div className="font-mono font-bold text-red-400 uppercase tracking-wide text-center">
                  Solo Coding ❌
                </div>
                <div className="font-mono font-bold text-cyan-400 uppercase tracking-wide text-center">
                  From Zero to Hero ✅
                </div>
              </div>

              {/* Table Rows */}
              {comparisonData.map((row, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-3 gap-4 p-6 transition-all duration-300 hover:bg-primary/5 hover:border-l-4 hover:border-l-primary group ${
                    index % 2 === 0 ? "bg-purple-950/40" : "bg-purple-900/40"
                  }`}
                >
                  <div className="font-mono text-foreground font-semibold">
                    {row.metric}
                  </div>
                  <div className="font-mono text-red-400 text-center group-hover:text-red-300 transition-colors">
                    {row.solo}
                  </div>
                  <div className="font-mono text-cyan-400 text-center font-bold group-hover:text-cyan-300 transition-colors">
                    {row.hero}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
            <div className="rounded-2xl bg-gradient-to-r from-purple-950/40 to-pink-950/40 border border-cyan-500/30 p-6 backdrop-blur-sm">
              <p className="text-center text-purple-200 font-mono text-sm md:text-base">
                <span className="font-bold text-cyan-400">342</span> shipped products •{" "}
                <span className="font-bold text-cyan-400">92</span> co-founder matches •{" "}
                <span className="font-bold text-cyan-400">&lt;5%</span> burnout •{" "}
                <span className="font-bold text-cyan-400">100%</span> network access
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Block 5: NOT A COURSE, A NETWORK - Statement */}
      <section className="py-20 md:py-32 px-6 bg-gradient-to-b from-secondary/20 to-background relative overflow-hidden">
        {/* Optional animated background effect */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-neon-red/10 animate-pulse" style={{ animationDuration: "4s" }} />
        </div>

        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="text-center space-y-4 animate-fade-in">
            <h2 className="text-4xl md:text-7xl font-black leading-tight" style={{ color: "hsl(350 100% 60%)" }}>
              YOU'RE NOT BUYING A COURSE.
            </h2>
            <h2 className="text-4xl md:text-7xl font-black leading-tight" style={{ color: "hsl(190 100% 50%)" }}>
              YOU'RE JOINING A NETWORK.
            </h2>
            <p className="text-2xl text-purple-300 mt-6 font-mono">
              Mycelium Network: Where founders find each other
            </p>
          </div>
        </div>

        {/* Pulsing glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse -z-10" style={{ animationDuration: "3s" }} />
      </section>
    </>
  );
};

export default SuccessStories;
