const JourneyTimeline = () => {
  return (
    <section className="py-20 px-6 bg-deep-purple">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black mb-4">
            <span className="neon-text-cyan">Your 2-3 Week</span>{' '}
            <span className="neon-text-pink">Journey</span>
          </h2>
          <p className="text-xl text-purple-300">
            From idea to production. Step by step. Together.
          </p>
        </div>

        <div className="space-y-6">
          {/* Week 1 */}
          <div className="bg-gradient-to-r from-cyan-950/40 to-purple-950/40 backdrop-blur-sm rounded-2xl p-8 border-l-4 border-neon-cyan">
            <div className="flex items-start gap-6">
              <div className="text-5xl">🎯</div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-3xl font-black text-neon-cyan">Week 1</h3>
                  <span className="text-purple-300">Foundation</span>
                </div>
                <p className="text-purple-200 mb-4 text-sm">
                  Inception → Research → Design
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-purple-900/30 rounded-lg p-4 border border-neon-cyan/30">
                    <div className="font-bold text-neon-cyan mb-2">Day 1-2</div>
                    <div className="text-purple-200 text-sm">
                      Define idea, validate problem, research market
                    </div>
                  </div>
                  <div className="bg-purple-900/30 rounded-lg p-4 border border-neon-cyan/30">
                    <div className="font-bold text-neon-cyan mb-2">Day 3-4</div>
                    <div className="text-purple-200 text-sm">
                      Tech stack, architecture, database design
                    </div>
                  </div>
                  <div className="bg-purple-900/30 rounded-lg p-4 border border-neon-cyan/30">
                    <div className="font-bold text-neon-cyan mb-2">Day 5-7</div>
                    <div className="text-purple-200 text-sm">
                      UI/UX design, Master Prompt ready
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Week 2 */}
          <div className="bg-gradient-to-r from-pink-950/40 to-purple-950/40 backdrop-blur-sm rounded-2xl p-8 border-l-4 border-neon-pink">
            <div className="flex items-start gap-6">
              <div className="text-5xl">💻</div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-3xl font-black text-neon-pink">Week 2</h3>
                  <span className="text-purple-300">Build</span>
                </div>
                <p className="text-purple-200 mb-4 text-sm font-bold">
                  Vibecoding Mode Activated 🔥
                </p>
                <div className="space-y-2 text-purple-200 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-neon-cyan">→</span>
                    Daily energy check-ins with Zen
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-neon-cyan">→</span>
                    &lt;10min unblocking from Tech Priest
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-neon-cyan">→</span>
                    Feature shipping with Prisma protection
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-neon-cyan">→</span>
                    Code reviews and optimization
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Week 3 */}
          <div className="bg-gradient-to-r from-purple-950/40 to-pink-950/40 backdrop-blur-sm rounded-2xl p-8 border-l-4 border-neon-purple">
            <div className="flex items-start gap-6">
              <div className="text-5xl">🚀</div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-3xl font-black text-neon-purple">Week 3</h3>
                  <span className="text-purple-300">Ship</span>
                </div>
                <p className="text-purple-200 mb-4 text-sm">
                  Test → Polish → Launch
                </p>
                <div className="space-y-2 text-purple-200 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-neon-pink">→</span>
                    Team testing and bug hunting
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-neon-pink">→</span>
                    Security audit by Toxic
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-neon-pink">→</span>
                    Launch strategy with Phoenix
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-neon-pink">→</span>
                    First users and feedback
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JourneyTimeline;
