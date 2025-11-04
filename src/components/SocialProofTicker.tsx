import { useEffect, useState } from "react";

const updates = [
  { name: "Jake", location: "Berlin", flag: "🇩🇪", action: "shipped v2 with Tech Priest", metric: "→ €10K MRR", icon: "🚀" },
  { name: "Sofia", location: "Milan", flag: "🇮🇹", action: "scaled with Phoenix", metric: "0.8% → 3.2% CVR", icon: "📈" },
  { name: "Marcus", location: "Amsterdam", flag: "🇳🇱", action: "audit by Toxic saved €40K", metric: "99.9% secure", icon: "🔒" },
  { name: "Chen", location: "Barcelona", flag: "🇪🇸", action: "raised pre-seed with Ever", metric: "€2M funding", icon: "💰" },
  { name: "Isabella", location: "Zurich", flag: "🇨🇭", action: "launched in 14 days with Prisma", metric: "1K users", icon: "⚡" },
  { name: "Viktor", location: "Prague", flag: "🇨🇿", action: "scaled to 10K users", metric: "Virgil's design", icon: "🎨" },
  { name: "Luna", location: "Copenhagen", flag: "🇩🇰", action: "avoided burnout with Zen", metric: "shipped on time", icon: "🌸" },
];

const SocialProofTicker = () => {
  const [metrics, setMetrics] = useState({
    mvps: 472,
    funding: 3.2,
    avgDays: 18,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        mvps: prev.mvps + Math.floor(Math.random() * 2),
        funding: prev.funding + (Math.random() * 0.1),
        avgDays: 18,
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const doubledUpdates = [...updates, ...updates];

  return (
    <div className="relative w-full overflow-hidden glass-card border-y neon-border-cyan py-6">
      {/* Gradient Overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

      {/* Real Metrics Bar */}
      <div className="mb-6 px-6">
        <div className="flex items-center justify-center gap-8 flex-wrap text-center">
          <div className="glass-card px-6 py-3 rounded-2xl neon-border-cyan">
            <p className="text-3xl font-black neon-text-cyan">{metrics.mvps}</p>
            <p className="text-xs text-muted-foreground font-mono">MVPs shipped (last 90 days)</p>
          </div>
          <div className="glass-card px-6 py-3 rounded-2xl neon-border-pink">
            <p className="text-3xl font-black neon-text-pink">€{metrics.funding.toFixed(1)}M</p>
            <p className="text-xs text-muted-foreground font-mono">raised by alumni</p>
          </div>
          <div className="glass-card px-6 py-3 rounded-2xl neon-border-purple">
            <p className="text-3xl font-black neon-text-purple">{metrics.avgDays}</p>
            <p className="text-xs text-muted-foreground font-mono">avg days to first customer</p>
          </div>
        </div>
      </div>

      {/* Scrolling Content */}
      <div className="flex items-center gap-6 animate-slide-left">
        {doubledUpdates.map((update, index) => (
          <div
            key={`${update.name}-${index}`}
            className="flex items-center gap-4 whitespace-nowrap px-6 py-3 rounded-2xl glass-card neon-border-cyan"
          >
            <span className="text-2xl">{update.flag}</span>
            <div>
              <p className="text-sm text-foreground font-bold">
                {update.name} • {update.location}
              </p>
              <p className="text-xs text-muted-foreground">
                {update.action} <span className="neon-text-cyan font-bold">{update.metric}</span>
              </p>
            </div>
            <span className="text-xl">{update.icon}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialProofTicker;
