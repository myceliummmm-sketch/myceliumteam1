import AdvisorCard from "./AdvisorCard";
import everGreenImg from "@/assets/advisor-ever-green.png";
import phoenixImg from "@/assets/advisor-phoenix.png";
import prismaImg from "@/assets/advisor-prisma.png";
import techPriestImg from "@/assets/advisor-tech-priest.png";
import toxicImg from "@/assets/advisor-toxic.png";
import virgilImg from "@/assets/advisor-virgil.png";
import zenImg from "@/assets/advisor-zen.png";

const advisors = [
  {
    name: "Ever Green",
    role: "Venture Strategist",
    tagline: "Built 3 unicorns. Will call out your BS.",
    status: "Online (always is)",
    stat: "ROI: Turns weak pitches → €2M raises",
    image: everGreenImg,
    color: "cyan" as const,
    video: "/ever-green-hover.mp4",
  },
  {
    name: "Phoenix",
    role: "Growth Architect",
    tagline: "Turns 0.8% → 3% conversion",
    status: "Optimizing campaigns",
    stat: "ROI: 47 products scaled to 10K+ users",
    image: phoenixImg,
    color: "pink" as const,
    video: "/phoenix-hover.mp4",
  },
  {
    name: "Zen",
    role: "Performance Coach",
    tagline: "Burn bright, not out",
    status: "Monitoring velocity",
    stat: "ROI: 89 founders saved from burnout",
    image: zenImg,
    color: "green" as const,
    video: "/zen-hover.mp4",
  },
  {
    name: "Toxic",
    role: "Security Lead",
    tagline: "I'll hack you before they do",
    status: "Finding vulnerabilities",
    stat: "ROI: Saved users €2.4M from breaches",
    image: toxicImg,
    color: "pink" as const,
    video: "/toxic-hover.mp4",
  },
  {
    name: "Virgil",
    role: "Design Director",
    tagline: "Make it beautiful or don't ship",
    status: "Perfecting pixels",
    stat: "ROI: 374 brands elevated to premium tier",
    image: virgilImg,
    color: "purple" as const,
    video: "/virgil-hover.mp4",
  },
  {
    name: "Prisma",
    role: "Product Strategist",
    tagline: "Ship faster. Overthink less.",
    status: "Reviewing roadmaps",
    stat: "ROI: 12 features killed, 2 winners shipped",
    image: prismaImg,
    color: "cyan" as const,
    video: "/prisma-hover.mp4",
  },
  {
    name: "Tech Priest",
    role: "Infrastructure Lead",
    tagline: "Your architecture is showing",
    status: "Optimizing systems",
    stat: "ROI: 99.9% uptime, €40K saved on infra",
    image: techPriestImg,
    color: "cyan" as const,
    video: "/tech-priest-hover.mp4",
  },
];

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
          {advisors.map((advisor, index) => (
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
