const stories = [
  {
    quote: "From idea to €8K MRR in 6 weeks",
    author: "Chen, 19",
    location: "Barcelona",
    flag: "🇪🇸",
    metric: "€8K MRR",
    advisor: "Prisma"
  },
  {
    quote: "Raised pre-seed after Phoenix fixed my deck",
    author: "Isabella, 21",
    location: "Zurich",
    flag: "🇨🇭",
    metric: "€150K raised",
    advisor: "Phoenix"
  },
  {
    quote: "Toxic found a breach that would've killed us",
    author: "Viktor, 22",
    location: "Prague",
    flag: "🇨🇿",
    metric: "Security saved",
    advisor: "Toxic"
  }
];

const SuccessStories = () => {
  return (
    <section className="py-24 px-6 bg-deep-purple">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-6xl font-black mb-4">
            <span className="neon-text-cyan">Real</span>{' '}
            <span className="neon-text-pink">Results</span>
          </h2>
          <p className="text-xl text-purple-300">
            from people who actually used this
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <div
              key={index}
              className="relative p-8 rounded-2xl bg-purple-950/40 backdrop-blur-sm border-2 border-neon-pink/30 hover:border-neon-cyan hover:neon-glow-pink transition-all duration-300 group animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Top Badge */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl">{story.flag}</span>
                <div className="px-3 py-1 rounded-full bg-neon-purple/20 border border-neon-purple/50">
                  <span className="text-xs font-mono text-neon-purple">{story.advisor}</span>
                </div>
              </div>

              {/* Quote */}
              <blockquote className="text-lg font-semibold mb-6 leading-tight text-white">
                "{story.quote}"
              </blockquote>

              {/* Author */}
              <div className="space-y-2">
                <p className="text-sm text-purple-300">
                  {story.author}, {story.location}
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-green/10 border border-neon-green/30">
                  <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                  <span className="text-xs font-mono text-neon-green font-bold">{story.metric}</span>
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 to-neon-pink/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
