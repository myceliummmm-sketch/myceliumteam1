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
    <section className="py-24 px-6 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-6xl font-mono font-bold mb-4">
            Real Results
          </h2>
          <p className="text-xl text-muted-foreground font-mono">
            from people who actually used this
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <div
              key={index}
              className="relative p-8 rounded-2xl bg-gradient-to-br from-card/50 to-transparent backdrop-blur-sm border border-primary/20 hover:border-primary/40 transition-all duration-300 group animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Top Badge */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl">{story.flag}</span>
                <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/30">
                  <span className="text-xs font-mono text-primary">{story.advisor}</span>
                </div>
              </div>

              {/* Quote */}
              <blockquote className="text-lg font-semibold mb-6 leading-tight">
                "{story.quote}"
              </blockquote>

              {/* Author */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {story.author}, {story.location}
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-green/10 border border-neon-green/30">
                  <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                  <span className="text-xs font-mono text-neon-green font-bold">{story.metric}</span>
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl -z-10" />
            </div>
          ))}
        </div>

        {/* Visual Elements */}
        <div className="mt-16 text-center space-y-6">
          <div className="flex items-center justify-center gap-8 flex-wrap text-sm text-muted-foreground font-mono">
            <div className="flex items-center gap-2">
              <div className="w-12 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
              <span>Stripe dashboards</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-1 bg-gradient-to-r from-transparent via-neon-green to-transparent" />
              <span>GitHub commits</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-1 bg-gradient-to-r from-transparent via-neon-red to-transparent" />
              <span>Real traction</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
