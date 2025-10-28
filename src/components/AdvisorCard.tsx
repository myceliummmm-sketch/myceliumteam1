import { useState } from "react";
import { Button } from "@/components/ui/button";

interface AdvisorCardProps {
  name: string;
  role: string;
  tagline: string;
  status: string;
  stat: string;
  image: string;
  color: "blue" | "red" | "green" | "purple";
}

const AdvisorCard = ({ name, role, tagline, status, stat, image, color }: AdvisorCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const colorClasses = {
    blue: "from-primary/20 to-transparent border-primary/30 shadow-[0_0_30px_hsl(var(--primary)/0.2)]",
    red: "from-neon-red/20 to-transparent border-neon-red/30 shadow-[0_0_30px_hsl(var(--neon-red)/0.2)]",
    green: "from-neon-green/20 to-transparent border-neon-green/30 shadow-[0_0_30px_hsl(var(--neon-green)/0.2)]",
    purple: "from-purple-500/20 to-transparent border-purple-500/30 shadow-[0_0_30px_hsl(280_100%_50%/0.2)]",
  };

  return (
    <div
      className={`relative group cursor-pointer transition-all duration-500 ${isHovered ? "scale-105" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Container */}
      <div className={`relative p-6 rounded-2xl bg-gradient-to-br ${colorClasses[color]} backdrop-blur-sm border-2 overflow-hidden transition-all duration-500 ${isHovered ? "border-opacity-70" : ""}`}>
        {/* Background Glow Effect */}
        <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-0 group-hover:opacity-50 transition-opacity duration-500`} />

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-2 h-2 rounded-full ${color === "blue" ? "bg-primary" : color === "red" ? "bg-neon-red" : color === "green" ? "bg-neon-green" : "bg-purple-500"} animate-pulse`} />
                <span className="text-xs font-mono text-muted-foreground">{status}</span>
              </div>
              <h3 className="text-2xl font-mono font-bold mb-1">{name}</h3>
              <p className="text-sm text-muted-foreground font-medium">{role}</p>
            </div>
            
            {/* Avatar */}
            <div className="relative w-20 h-20">
              <div className={`absolute inset-0 rounded-xl ${isHovered ? "animate-glitch" : ""}`}>
                <img src={image} alt={name} className="w-full h-full object-cover rounded-xl" />
              </div>
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${colorClasses[color]} opacity-0 group-hover:opacity-30 transition-opacity duration-300`} />
            </div>
          </div>

          {/* Tagline */}
          <p className="text-lg font-semibold mb-4 leading-tight">{tagline}</p>

          {/* Stats */}
          <div className={`p-3 rounded-lg bg-background/50 border ${color === "blue" ? "border-primary/20" : color === "red" ? "border-neon-red/20" : color === "green" ? "border-neon-green/20" : "border-purple-500/20"} mb-4`}>
            <p className="text-sm font-mono text-muted-foreground">{stat}</p>
          </div>

          {/* CTA */}
          <Button
            variant="outline"
            className={`w-full border-2 ${color === "blue" ? "border-primary/30 hover:bg-primary/10" : color === "red" ? "border-neon-red/30 hover:bg-neon-red/10" : color === "green" ? "border-neon-green/30 hover:bg-neon-green/10" : "border-purple-500/30 hover:bg-purple-500/10"} transition-all duration-300 font-mono`}
          >
            Get Advice Now
          </Button>
        </div>

        {/* Corner Decoration */}
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorClasses[color]} blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
      </div>
    </div>
  );
};

export default AdvisorCard;
