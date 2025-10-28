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
      <div className={`relative h-[500px] rounded-2xl bg-gradient-to-br ${colorClasses[color]} backdrop-blur-sm border-2 overflow-hidden transition-all duration-500 ${isHovered ? "border-opacity-70" : ""}`}>
        {/* Portrait Background */}
        <div className="absolute inset-0">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent`} />
          <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${color === "blue" ? "bg-primary" : color === "red" ? "bg-neon-red" : color === "green" ? "bg-neon-green" : "bg-purple-500"} animate-pulse`} />
              <span className="text-xs font-mono text-foreground/80">{status}</span>
            </div>
          </div>

          {/* Bottom Content */}
          <div>
            <h3 className="text-3xl font-mono font-bold mb-2 text-foreground">{name}</h3>
            <p className="text-sm font-medium mb-2 bg-gradient-to-r from-primary via-neon-green to-primary bg-clip-text text-transparent">
              {role}
            </p>
            
            {/* Tagline */}
            <p className="text-lg font-semibold mb-4 leading-tight text-foreground">{tagline}</p>

            {/* Stats */}
            <div className={`p-3 rounded-lg bg-background/70 backdrop-blur-sm border ${color === "blue" ? "border-primary/30" : color === "red" ? "border-neon-red/30" : color === "green" ? "border-neon-green/30" : "border-purple-500/30"} mb-4`}>
              <p className="text-sm font-mono">{stat}</p>
            </div>

            {/* CTA */}
            <Button
              variant="outline"
              className={`w-full border-2 ${color === "blue" ? "border-primary/50 hover:bg-primary/20" : color === "red" ? "border-neon-red/50 hover:bg-neon-red/20" : color === "green" ? "border-neon-green/50 hover:bg-neon-green/20" : "border-purple-500/50 hover:bg-purple-500/20"} transition-all duration-300 font-mono backdrop-blur-sm`}
            >
              Get Advice Now
            </Button>
          </div>
        </div>

        {/* Corner Decoration */}
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorClasses[color]} blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-500`} />
      </div>
    </div>
  );
};

export default AdvisorCard;
