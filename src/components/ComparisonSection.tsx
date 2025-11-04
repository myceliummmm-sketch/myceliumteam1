import { X, Check, Zap } from "lucide-react";

const ComparisonSection = () => {
  return (
    <section className="py-32 px-6 bg-gradient-to-b from-background to-dark-purple relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-neon-purple/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-20 animate-fade-in">
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            <span className="text-muted-foreground">This Isn't</span>
            <br />
            <span className="neon-text-pink">ChatGPT With a Fancy Skin</span>
          </h2>
          <p className="text-xl text-muted-foreground font-mono">
            Generic AI gives advice. Mycelium gives results.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-32">
          {/* Generic AI */}
          <div className="relative p-10 rounded-3xl bg-muted/10 border border-muted/30 backdrop-blur-sm opacity-60">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-xl bg-muted/20">
                <X className="w-7 h-7 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-mono text-muted-foreground">Generic ChatGPT</h3>
            </div>
            
            <div className="space-y-6 text-sm text-muted-foreground">
              <p className="italic">"Your idea has potential. Consider researching your market..."</p>
              <p className="italic">"You should focus on user experience..."</p>
              <p className="italic">"Have you thought about monetization strategies?"</p>
              <p className="text-xs opacity-60 font-mono">(Translation: I have no idea what I'm talking about)</p>
            </div>
          </div>

          {/* Mycelium */}
          <div className="relative p-10 rounded-3xl glass-card border-2 neon-border-cyan" style={{ boxShadow: 'var(--shadow-glow-cyan)' }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-xl glass-card neon-border-cyan">
                <Check className="w-7 h-7 neon-text-cyan" />
              </div>
              <h3 className="text-2xl font-mono neon-text-cyan font-bold">Mycelium Advisors</h3>
            </div>
            
            <div className="space-y-6 text-sm">
              <p className="text-foreground font-semibold">"Your TAM is bullshit. Here's why: [specific breakdown]. Fix it like this: [actual framework]"</p>
              <p className="text-foreground font-semibold">"I see you're using Firebase. That'll cost you €2K/month at 10K users. Switch to Supabase now."</p>
              <p className="text-foreground font-semibold">"Your landing page converts at 0.8%. Here's the exact copy change that'll get you to 3%..."</p>
              <p className="text-xs neon-text-cyan italic font-bold font-mono">(Translation: I've done this 10,000 times)</p>
            </div>

            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 to-transparent blur-3xl -z-10" />
          </div>
        </div>

        {/* What Separates Winners from Wishers */}
        <div className="mb-32">
          <h2 className="text-4xl md:text-6xl font-black text-center mb-6 neon-text-pink">
            WHAT SEPARATES WINNERS FROM WISHERS
          </h2>
          <p className="text-center text-xl text-muted-foreground font-mono mb-16">
            Your competition has teams. Do you?
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Working Harder */}
            <div className="group p-10 rounded-3xl glass-card border-2 border-neon-pink/30 hover:border-neon-pink transition-all duration-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-2xl -z-10" />
              <div className="text-6xl mb-6">💀</div>
              <h3 className="text-3xl font-black mb-6 neon-text-pink">WORKING HARDER ISN'T WORKING</h3>
              <ul className="space-y-4 text-foreground/80 text-sm font-mono">
                <li>• 83% experience burnout</li>
                <li>• No energy by day 10</li>
                <li>• Code 16 hours → crash</li>
                <li>• 47 projects in Downloads</li>
                <li>• Zero in portfolio</li>
              </ul>
            </div>

            {/* Following Tutorials */}
            <div className="group p-10 rounded-3xl glass-card border-2 border-neon-purple/30 hover:border-neon-purple transition-all duration-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-2xl -z-10" />
              <div className="text-6xl mb-6">🌀</div>
              <h3 className="text-3xl font-black mb-6 neon-text-purple">FOLLOWING 47 TUTORIALS WON'T SHIP PRODUCTS</h3>
              <ul className="space-y-4 text-foreground/80 text-sm font-mono">
                <li>• What to do? No clue.</li>
                <li>• No plan, no structure</li>
                <li>• Feature creep kills</li>
                <li>• 3 months, nothing ready</li>
                <li>• Endless refactoring</li>
              </ul>
            </div>

            {/* Your Competition */}
            <div className="group p-10 rounded-3xl glass-card border-2 border-neon-cyan/30 hover:border-neon-cyan transition-all duration-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-2xl -z-10" />
              <div className="text-6xl mb-6">😰</div>
              <h3 className="text-3xl font-black mb-6 neon-text-cyan">YOUR COMPETITION HAS TEAMS. DO YOU?</h3>
              <ul className="space-y-4 text-foreground/80 text-sm font-mono">
                <li>• Stuck. No one to ask.</li>
                <li>• 11 PM. Bug. Alone.</li>
                <li>• Googling until 3 AM</li>
                <li>• No one to show code</li>
                <li>• Solo = stuck forever</li>
              </ul>
            </div>
          </div>
        </div>

        {/* The Unfair Advantage */}
        <div className="mb-16">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 glass-card px-6 py-3 rounded-full mb-6 neon-border-cyan">
              <Zap className="w-5 h-5 neon-text-cyan" />
              <span className="text-sm font-mono neon-text-cyan uppercase tracking-wider font-bold">The Unfair Advantage</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black">
              <span className="bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-transparent">
                WE FIXED THE SYSTEM
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* AI Monitors Your Velocity */}
            <div className="group p-10 rounded-3xl glass-card border-2 neon-border-cyan hover:scale-105 transition-all duration-500" style={{ boxShadow: 'var(--shadow-glow-cyan)' }}>
              <div className="text-6xl mb-6">🛡</div>
              <h3 className="text-3xl font-black mb-6 neon-text-cyan">AI MONITORS YOUR VELOCITY & ENERGY</h3>
              <ul className="space-y-4 text-foreground/80 text-sm font-mono mb-8">
                <li>• Zen tracks your energy (1-10)</li>
                <li>• Buddy system support</li>
                <li>• Auto-adjust workload</li>
                <li>• &lt;5% burnout rate</li>
              </ul>
              <p className="text-xl font-black neon-text-cyan">
                → You'll finish
              </p>
            </div>

            {/* 10-Phase Playbook */}
            <div className="group p-10 rounded-3xl glass-card border-2 neon-border-purple hover:scale-105 transition-all duration-500" style={{ boxShadow: 'var(--shadow-glow-purple)' }}>
              <div className="text-6xl mb-6">📋</div>
              <h3 className="text-3xl font-black mb-6 neon-text-purple">10-PHASE PLAYBOOK FROM IDEA TO REVENUE</h3>
              <ul className="space-y-4 text-foreground/80 text-sm font-mono mb-8">
                <li>• Inception → Ship in 21 days</li>
                <li>• Daily action plan</li>
                <li>• Clear milestones</li>
                <li>• 100% structure</li>
              </ul>
              <p className="text-xl font-black neon-text-purple">
                → Zero chaos
              </p>
            </div>

            {/* Instant Access */}
            <div className="group p-10 rounded-3xl glass-card border-2 neon-border-pink hover:scale-105 transition-all duration-500" style={{ boxShadow: 'var(--shadow-glow-pink)' }}>
              <div className="text-6xl mb-6">👥</div>
              <h3 className="text-3xl font-black mb-6 neon-text-pink">INSTANT ACCESS TO PROVEN CO-FOUNDERS</h3>
              <ul className="space-y-4 text-foreground/80 text-sm font-mono mb-8">
                <li>• 7 AI experts 24/7</li>
                <li>• 20+ founders in cohort</li>
                <li>• Co-founder matching</li>
                <li>• Squad + Network</li>
              </ul>
              <p className="text-xl font-black neon-text-pink">
                → Never alone
              </p>
            </div>
          </div>
        </div>

        <div className="text-center glass-card rounded-2xl p-6 max-w-2xl mx-auto" style={{ border: '1px solid hsl(var(--neon-cyan) / 0.2)' }}>
          <p className="text-sm text-muted-foreground font-mono">
            We don't do motivational quotes. We ship products.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
