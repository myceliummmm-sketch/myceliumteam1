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

        {/* Block 2: WHY PROJECTS DIE */}
        <div className="mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-12 text-neon-red">
            WHY PROJECTS DIE
          </h2>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {/* BURNOUT Card */}
            <div className="p-8 rounded-2xl bg-purple-950/40 backdrop-blur-sm border-2 border-transparent bg-gradient-to-br from-red-500/20 to-pink-500/20 hover:shadow-[0_0_30px_rgba(239,68,68,0.3)] transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 opacity-50 blur-xl group-hover:opacity-70 transition-opacity -z-10" />
              <div className="text-6xl mb-4">💀</div>
              <h3 className="text-2xl font-black mb-6 text-red-400">BURNOUT</h3>
              <ul className="space-y-3 text-purple-200 text-sm">
                <li>• 83% experience burnout</li>
                <li>• No energy by day 10</li>
                <li>• Code 16 hours → crash</li>
                <li>• 47 projects in Downloads</li>
                <li>• Zero in portfolio</li>
              </ul>
            </div>

            {/* CHAOS Card */}
            <div className="p-8 rounded-2xl bg-purple-950/40 backdrop-blur-sm border-2 border-transparent bg-gradient-to-br from-orange-500/20 to-red-500/20 hover:shadow-[0_0_30px_rgba(249,115,22,0.3)] transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 opacity-50 blur-xl group-hover:opacity-70 transition-opacity -z-10" />
              <div className="text-6xl mb-4">🌀</div>
              <h3 className="text-2xl font-black mb-6 text-orange-400">CHAOS</h3>
              <ul className="space-y-3 text-purple-200 text-sm">
                <li>• What to do? No clue.</li>
                <li>• No plan, no structure</li>
                <li>• Feature creep kills</li>
                <li>• 3 months, nothing ready</li>
                <li>• Endless refactoring</li>
              </ul>
            </div>

            {/* ALONE Card */}
            <div className="p-8 rounded-2xl bg-purple-950/40 backdrop-blur-sm border-2 border-transparent bg-gradient-to-br from-red-900/20 to-red-700/20 hover:shadow-[0_0_30px_rgba(127,29,29,0.3)] transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-red-900 to-red-700 opacity-50 blur-xl group-hover:opacity-70 transition-opacity -z-10" />
              <div className="text-6xl mb-4">😰</div>
              <h3 className="text-2xl font-black mb-6 text-red-300">ALONE</h3>
              <ul className="space-y-3 text-purple-200 text-sm">
                <li>• Stuck. No one to ask.</li>
                <li>• 11 PM. Bug. Alone.</li>
                <li>• Googling until 3 AM</li>
                <li>• No one to show code</li>
                <li>• Solo = stuck forever</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Block 3: WE FIXED THE SYSTEM */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-12 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-transparent">
            WE FIXED THE SYSTEM
          </h2>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {/* ANTI-BURNOUT Card */}
            <div className="p-8 rounded-2xl bg-purple-950/40 backdrop-blur-sm border-2 border-cyan-400 hover:border-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_40px_rgba(34,211,238,0.5)] transition-all duration-300">
              <div className="text-6xl mb-4">🛡</div>
              <h3 className="text-2xl font-black mb-6 text-cyan-400">ANTI-BURNOUT</h3>
              <ul className="space-y-3 text-purple-200 text-sm mb-6">
                <li>• Zen monitors your energy</li>
                <li>• Energy tracking (1-10 scale)</li>
                <li>• Buddy system support</li>
                <li>• &lt;5% burnout rate</li>
              </ul>
              <p className="text-lg font-bold text-cyan-400 mt-6">
                → You'll finish
              </p>
            </div>

            {/* ANTI-CHAOS Card */}
            <div className="p-8 rounded-2xl bg-purple-950/40 backdrop-blur-sm border-2 border-purple-400 hover:border-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] transition-all duration-300">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-2xl font-black mb-6 text-purple-400">ANTI-CHAOS</h3>
              <ul className="space-y-3 text-purple-200 text-sm mb-6">
                <li>• 10 clear phases</li>
                <li>• Daily action plan</li>
                <li>• Inception → Ship</li>
                <li>• 100% structure</li>
              </ul>
              <p className="text-lg font-bold text-purple-400 mt-6">
                → Zero chaos
              </p>
            </div>

            {/* ANTI-SOLO Card */}
            <div className="p-8 rounded-2xl bg-purple-950/40 backdrop-blur-sm border-2 border-pink-400 hover:border-pink-300 shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_40px_rgba(236,72,153,0.5)] transition-all duration-300">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-2xl font-black mb-6 text-pink-400">ANTI-SOLO</h3>
              <ul className="space-y-3 text-purple-200 text-sm mb-6">
                <li>• Squad + Network</li>
                <li>• 7 AI experts 24/7</li>
                <li>• 20+ founders in cohort</li>
                <li>• Co-founder matching</li>
              </ul>
              <p className="text-lg font-bold text-pink-400 mt-6">
                → Never alone
              </p>
            </div>
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
