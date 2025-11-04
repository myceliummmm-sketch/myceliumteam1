import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface AdvisorCardProps {
  name: string;
  role: string;
  tagline: string;
  status: string;
  stat: string;
  image: string;
  color: "cyan" | "pink" | "purple" | "green";
  video?: string;
}

const AdvisorCard = ({ name, role, tagline, status, stat, image, color, video }: AdvisorCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const colorClasses = {
    cyan: {
      border: "border-neon-cyan/30",
      glow: "shadow-glow-cyan",
      bg: "from-neon-cyan/10",
      text: "text-neon-cyan",
      button: "border-neon-cyan/50 hover:bg-neon-cyan/20",
    },
    pink: {
      border: "border-neon-pink/30",
      glow: "shadow-glow-pink",
      bg: "from-neon-pink/10",
      text: "text-neon-pink",
      button: "border-neon-pink/50 hover:bg-neon-pink/20",
    },
    purple: {
      border: "border-neon-purple/30",
      glow: "shadow-glow-purple",
      bg: "from-neon-purple/10",
      text: "text-neon-purple",
      button: "border-neon-purple/50 hover:bg-neon-purple/20",
    },
    green: {
      border: "border-success/30",
      glow: "shadow-[0_0_60px_hsl(var(--success)/0.4)]",
      bg: "from-success/10",
      text: "text-success",
      button: "border-success/50 hover:bg-success/20",
    },
  };

  return (
    <div
      className={`relative group cursor-pointer transition-all duration-700 ${isHovered ? "scale-105 -translate-y-2" : ""}`}
      onMouseEnter={() => {
        setIsHovered(true);
        if (videoRef.current) {
          videoRef.current.play();
        }
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      }}
    >
      {/* Executive Profile Card */}
      <div className={`relative aspect-[4/5] rounded-3xl glass-card border-2 ${colorClasses[color].border} overflow-hidden transition-all duration-700 ${isHovered ? colorClasses[color].glow : ""}`}>
        
        {/* Video Background */}
        {video && (
          <video
            ref={videoRef}
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out z-0"
            src={video}
          />
        )}
        
        {/* Image Fallback */}
        {!video && (
          <div className="absolute inset-0">
            <img 
              src={image} 
              alt={name} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t ${colorClasses[color].bg} via-background/50 to-transparent z-10`} />

        {/* Holographic Overlay on Hover */}
        <div className={`absolute inset-0 holographic opacity-0 group-hover:opacity-20 transition-opacity duration-700 z-10`} />

        {/* Content */}
        <div className="relative z-20 h-full flex flex-col justify-between p-6">
          {/* Header - Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 glass-card px-3 py-1.5 rounded-full">
              <div className={`w-2 h-2 rounded-full ${colorClasses[color].text.replace('text-', 'bg-')} animate-pulse`} />
              <span className="text-xs font-mono text-foreground/80">{status}</span>
            </div>
            <Sparkles className={`w-5 h-5 ${colorClasses[color].text} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
          </div>

          {/* Bottom Content */}
          <div>
            <h3 className="text-4xl font-black mb-2 text-foreground tracking-tight">{name}</h3>
            <p className={`text-base font-bold mb-3 ${colorClasses[color].text}`}>
              {role}
            </p>
            
            {/* Executive Tagline */}
            <p className="text-lg font-semibold mb-4 leading-tight text-foreground">{tagline}</p>

            {/* ROI Stats */}
            <div className={`p-4 rounded-xl glass-card border ${colorClasses[color].border} mb-4 transition-all duration-300 group-hover:scale-105`}>
              <p className="text-sm font-mono font-semibold">{stat}</p>
            </div>

            {/* Premium CTA */}
            <Button
              variant="outline"
              className={`w-full border-2 ${colorClasses[color].button} transition-all duration-300 font-bold backdrop-blur-sm rounded-xl py-6 group-hover:scale-105`}
            >
              Book Advisory Session
            </Button>
          </div>
        </div>
      </div>

      {/* External Glow Effect */}
      <div className={`absolute inset-0 ${colorClasses[color].bg} to-transparent blur-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
    </div>
  );
};

export default AdvisorCard;
