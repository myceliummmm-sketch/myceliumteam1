import AdvisorCard from "./AdvisorCard";
import everGreenImg from "@/assets/advisor-ever-green.jpg";
import phoenixImg from "@/assets/advisor-phoenix.jpg";
import prismaImg from "@/assets/advisor-prisma.jpg";
import techPriestImg from "@/assets/advisor-tech-priest.jpg";
import toxicImg from "@/assets/advisor-toxic.jpg";
import virgilImg from "@/assets/advisor-virgil.jpg";
import zenImg from "@/assets/advisor-zen.jpg";

const advisors = [
  {
    name: "Ever Green",
    role: "🚀 CEO",
    tagline: "Built 3 unicorns. Will call out your BS.",
    status: "Online (always is)",
    stat: "Live roast: Your TAM slide is fiction",
    image: everGreenImg,
    color: "blue" as const,
    video: "/ever-green-hover.mp4",
  },
  {
    name: "Phoenix",
    role: "📈 CMO/Growth",
    tagline: "Your marketing sucks. Let me fix it.",
    status: "Plotting growth hacks",
    stat: "47 campaigns optimized today",
    image: phoenixImg,
    color: "red" as const,
    video: "/phoenix-hover.mp4",
  },
  {
    name: "Zen",
    role: "🌸 HR/Wellbeing",
    tagline: "Burn bright, not out",
    status: "Morning yoga session",
    stat: "89 founders from burnout saved",
    image: zenImg,
    color: "green" as const,
    video: "/zen-hover.mp4", // Add your video here
  },
  {
    name: "Toxic",
    role: "🔒 Security/Red Team Lead",
    tagline: "I'll hack you before they do",
    status: "Finding vulnerabilities",
    stat: "Saved users €2.4M from breaches",
    image: toxicImg,
    color: "red" as const,
    video: "/toxic-hover.mp4", // Add your video here
  },
  {
    name: "Virgil",
    role: "🎬 Visual Storyteller",
    tagline: "Make it beautiful or don't ship",
    status: "Perfecting pixels",
    stat: "374 brands elevated",
    image: virgilImg,
    color: "purple" as const,
    video: "/virgil-hover.mp4", // Add your video here
  },
  {
    name: "Prisma",
    role: "📦 Product Manager",
    tagline: "Ship faster. Overthink less.",
    status: "Reviewing PRDs",
    stat: "12 features killed today",
    image: prismaImg,
    color: "blue" as const,
    video: "/prisma-hover.mp4", // Add your video here
  },
  {
    name: "Tech Priest",
    role: "⚙️ CTO",
    tagline: "Your architecture is showing",
    status: "Refactoring reality",
    stat: "99.9% uptime maintained",
    image: techPriestImg,
    color: "blue" as const,
    video: "/tech-priest-hover.mp4",
  },
];

const AdvisorsGrid = () => {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-background via-background/95 to-background">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-6xl font-mono font-bold mb-4">
            <span className="text-primary">MEET YOUR TEAM</span>
          </h2>
          <p className="text-xl text-muted-foreground font-mono">
            gaming-style character selection, but for your startup
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
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

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground font-mono">
            btw your competition doesn't know this exists yet
          </p>
        </div>
      </div>
    </section>
  );
};

export default AdvisorsGrid;
