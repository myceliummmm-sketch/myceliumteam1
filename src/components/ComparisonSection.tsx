import { X, Check } from "lucide-react";

const ComparisonSection = () => {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-6xl font-mono font-bold mb-6">
            yeah, this isn't chatgpt with a fancy skin
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Generic AI */}
          <div className="relative p-8 rounded-2xl bg-muted/20 border border-muted backdrop-blur-sm opacity-60">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-muted">
                <X className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-mono text-muted-foreground">Generic ChatGPT</h3>
            </div>
            
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>"Your idea has potential. Consider researching your market..."</p>
              <p>"You should focus on user experience..."</p>
              <p>"Have you thought about monetization strategies?"</p>
              <p className="italic opacity-60">(Translation: I have no idea what I'm talking about)</p>
            </div>
          </div>

          {/* Mycelium */}
          <div className="relative p-8 rounded-2xl bg-gradient-to-br from-primary/20 to-transparent border-2 border-primary/50 backdrop-blur-sm shadow-[0_0_40px_hsl(var(--primary)/0.3)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/20 border border-primary/50">
                <Check className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-mono text-primary">Mycelium Advisors</h3>
            </div>
            
            <div className="space-y-4 text-sm">
              <p className="text-foreground font-medium">"Your TAM is bullshit. Here's why: [specific breakdown]. Fix it like this: [actual framework]"</p>
              <p className="text-foreground font-medium">"I see you're using Firebase. That'll cost you €2K/month at 10K users. Switch to Supabase now."</p>
              <p className="text-foreground font-medium">"Your landing page converts at 0.8%. Here's the exact copy change that'll get you to 3%..."</p>
              <p className="text-neon-green italic font-semibold">(Translation: I've done this 47 times)</p>
            </div>

            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent blur-2xl -z-10" />
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 animate-fade-in">
          <div className="p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-primary/20">
            <div className="text-4xl mb-4">🎯</div>
            <h4 className="font-mono font-bold mb-2 text-foreground">Actually Done It</h4>
            <p className="text-sm text-muted-foreground">
              Our AI is trained by founders who've actually done the thing
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-primary/20">
            <div className="text-4xl mb-4">📞</div>
            <h4 className="font-mono font-bold mb-2 text-foreground">Real Human Backup</h4>
            <p className="text-sm text-muted-foreground">
              When shit gets real, video call the human behind the AI
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-primary/20">
            <div className="text-4xl mb-4">💯</div>
            <h4 className="font-mono font-bold mb-2 text-foreground">Keep Everything</h4>
            <p className="text-sm text-muted-foreground">
              When you win, keep 100% equity and revenue
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground font-mono">
            small text: btw your competition doesn't know this exists yet
          </p>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
