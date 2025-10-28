import { useEffect, useState } from "react";

const updates = [
  { name: "Jake", location: "Berlin", flag: "🇩🇪", action: "just shipped v2 with Tech Priest's help", icon: "🚀" },
  { name: "Sofia", location: "Milan", flag: "🇮🇹", action: "hit €10K MRR using Phoenix's growth hack", icon: "📈" },
  { name: "Marcus", location: "Amsterdam", flag: "🇳🇱", action: "security audit by Toxic saved his startup", icon: "🔒" },
  { name: "Chen", location: "Barcelona", flag: "🇪🇸", action: "raised pre-seed with Ever's pitch deck", icon: "💰" },
  { name: "Isabella", location: "Zurich", flag: "🇨🇭", action: "launched in 6 weeks with Prisma's roadmap", icon: "⚡" },
  { name: "Viktor", location: "Prague", flag: "🇨🇿", action: "scaled to 1K users with Virgil's design", icon: "🎨" },
  { name: "Luna", location: "Copenhagen", flag: "🇩🇰", action: "avoided burnout thanks to Zen", icon: "🌸" },
];

const SocialProofTicker = () => {
  const [count, setCount] = useState(312);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev + Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Duplicate the updates array for seamless infinite scroll
  const doubledUpdates = [...updates, ...updates];

  return (
    <div className="relative w-full overflow-hidden bg-secondary/50 backdrop-blur-sm border-y border-primary/10 py-4">
      {/* Gradient Overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

      {/* Scrolling Content */}
      <div className="flex items-center gap-8 animate-slide-left">
        {doubledUpdates.map((update, index) => (
          <div
            key={`${update.name}-${index}`}
            className="flex items-center gap-3 whitespace-nowrap px-6 py-2 rounded-full bg-card/50 border border-primary/20"
          >
            <span className="text-xl">{update.flag}</span>
            <span className="text-sm text-foreground font-medium">
              {update.name} from {update.location}
            </span>
            <span className="text-sm text-muted-foreground">{update.action}</span>
            <span className="text-lg">{update.icon}</span>
          </div>
        ))}
        <div className="flex items-center gap-3 whitespace-nowrap px-6 py-2 rounded-full bg-primary/10 border border-primary/30">
          <span className="text-sm font-mono text-primary font-bold">{count} projects launching right now...</span>
        </div>
      </div>
    </div>
  );
};

export default SocialProofTicker;
