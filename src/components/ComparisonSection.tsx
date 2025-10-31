import { X, Check } from "lucide-react";

const ComparisonSection = () => {
  return (
    <section className="py-20 px-6 bg-deep-purple" id="how-it-works">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            <span className="neon-text-pink">85%</span> of developers never ship
          </h2>
          <p className="text-xl text-purple-300 max-w-3xl mx-auto">
            Not because they can't code. But because{' '}
            <span className="text-neon-cyan font-bold">shipping alone is overwhelming</span>.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Old Way */}
          <div className="relative p-8 rounded-2xl bg-gradient-to-br from-red-950/40 to-purple-950/40 border-2 border-neon-pink/30 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-red-900/50">
                <X className="w-6 h-6 text-neon-pink" />
              </div>
              <h3 className="text-2xl font-bold text-neon-pink">⛔ Старый путь</h3>
            </div>
            
            <div className="space-y-4 text-sm text-purple-200">
              <div className="flex items-start gap-3">
                <span className="text-neon-pink text-xl">→</span>
                <span>Застрял в analysis paralysis</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-neon-pink text-xl">→</span>
                <span>Не знаешь что building first</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-neon-pink text-xl">→</span>
                <span>Переделываешь code 10 раз</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-neon-pink text-xl">→</span>
                <span>Никогда не shipping</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-neon-pink text-xl">→</span>
                <span className="font-bold">Одиночество и выгорание</span>
              </div>
            </div>
          </div>

          {/* Mycelium Way */}
          <div className="relative p-8 rounded-2xl bg-gradient-to-br from-cyan-950/40 to-purple-950/40 border-2 border-neon-cyan/50 backdrop-blur-sm neon-glow-cyan">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-cyan-900/50 border border-neon-cyan/50">
                <Check className="w-6 h-6 text-neon-cyan" />
              </div>
              <h3 className="text-2xl font-bold text-neon-cyan">✨ Mycelium путь</h3>
            </div>
            
            <div className="space-y-4 text-sm text-purple-200">
              <div className="flex items-start gap-3">
                <span className="text-neon-cyan text-xl">→</span>
                <span>Team делает research за тебя</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-neon-cyan text-xl">→</span>
                <span>Чёткий plan что building</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-neon-cyan text-xl">→</span>
                <span>Live support when stuck</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-neon-cyan text-xl">→</span>
                <span>Ship за 2-3 недели</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-neon-cyan text-xl">→</span>
                <span className="font-bold neon-text-cyan">Network на всю жизнь</span>
              </div>
            </div>

            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 to-transparent blur-2xl -z-10" />
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 animate-fade-in">
          <div className="p-6 rounded-xl bg-purple-900/30 backdrop-blur-sm border border-neon-pink/30">
            <div className="text-4xl mb-4">🎯</div>
            <h4 className="font-bold mb-2 text-neon-pink">Actually Done It</h4>
            <p className="text-sm text-purple-300">
              Our AI is trained by founders who've actually done the thing
            </p>
          </div>

          <div className="p-6 rounded-xl bg-purple-900/30 backdrop-blur-sm border border-neon-cyan/30">
            <div className="text-4xl mb-4">📞</div>
            <h4 className="font-bold mb-2 text-neon-cyan">Real Human Backup</h4>
            <p className="text-sm text-purple-300">
              When shit gets real, video call the human behind the AI
            </p>
          </div>

          <div className="p-6 rounded-xl bg-purple-900/30 backdrop-blur-sm border border-neon-purple/30">
            <div className="text-4xl mb-4">💯</div>
            <h4 className="font-bold mb-2 text-neon-purple">Keep Everything</h4>
            <p className="text-sm text-purple-300">
              When you win, keep 100% equity and revenue
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
