import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const phaseCards = [
  {
    badge: "Week 1",
    icon: "🔗",
    title: "CONNECT",
    bullets: [
      "20+ founders in Discord",
      "AI matching by skills",
      "Speed networking (5-min calls)",
      "Find your tribe"
    ],
    borderColor: "border-cyan-400",
    badgeClass: "bg-cyan-500/20 text-cyan-400 border-cyan-500/50",
    titleColor: "text-cyan-400",
    shadowClass: "shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_40px_rgba(34,211,238,0.5)]"
  },
  {
    badge: "Week 2",
    icon: "🛠",
    title: "BUILD",
    bullets: [
      "Form teams (solo/duo/trio)",
      "AI Squad guides",
      "Community feedback daily",
      "Ship together"
    ],
    borderColor: "border-pink-400",
    badgeClass: "bg-pink-500/20 text-pink-400 border-pink-500/50",
    titleColor: "text-pink-400",
    shadowClass: "shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_40px_rgba(236,72,153,0.5)]"
  },
  {
    badge: "Week 3",
    icon: "🚀",
    title: "LAUNCH",
    bullets: [
      "Product Hunt coordination",
      "Community upvotes",
      "Cross-promotion",
      "Celebrate wins together"
    ],
    borderColor: "border-purple-400",
    badgeClass: "bg-purple-500/20 text-purple-400 border-purple-500/50",
    titleColor: "text-purple-400",
    shadowClass: "shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_40px_rgba(168,85,247,0.5)]"
  },
  {
    badge: "Forever",
    icon: "🌱",
    title: "GROW",
    bullets: [
      "Alumni network access",
      "Monthly meetups (virtual/IRL)",
      "Future partnerships",
      "Lifelong connections"
    ],
    borderColor: "border-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400",
    badgeClass: "bg-gradient-to-r from-cyan-500/20 to-pink-500/20 text-white border border-purple-400/50",
    titleColor: "bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent",
    shadowClass: "shadow-[0_0_20px_rgba(168,85,247,0.3),0_0_20px_rgba(34,211,238,0.2),0_0_20px_rgba(236,72,153,0.2)] hover:shadow-[0_0_40px_rgba(168,85,247,0.5),0_0_40px_rgba(34,211,238,0.3),0_0_40px_rgba(236,72,153,0.3)]"
  }
];

const faqData = [
  {
    question: "Is 2-3 weeks realistic?",
    answer: "Yes. 95% of cohort #1 and #2 shipped in time. Secret: we cut scope aggressively. You build MVP only - the core feature that solves the problem. Prisma kills feature creep daily. We've refined this process through 342 shipped products."
  },
  {
    question: "I'm a junior developer. Can I do this?",
    answer: "If you know variables, loops, and functions - you're ready. Tech Priest provides architecture and unblocks you in <10 min. You're not building alone. The Squad designs, you implement. That's how you level up fastest."
  },
  {
    question: "What happens after the cohort?",
    answer: "You get lifetime access to Mycelium Network. Monthly meetups, co-founder matching, future partnerships. 30% of cohort #1 found co-founders. This isn't a course that ends - it's a network you're joining forever."
  },
  {
    question: "Can I do this with a friend?",
    answer: "Absolutely. Teams of 2-3 ship faster. You can join together, or form a team during Week 1 with someone from the cohort. Many participants pair up based on complementary skills."
  }
];

const NetworkJourney = () => {
  return (
    <>
      {/* Block 6: Network Journey - 4 Phase Cards */}
      <section className="py-20 md:py-24 px-6 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-6xl font-mono font-bold mb-12 text-center text-foreground animate-fade-in">
            your network journey: from solo to squad
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {phaseCards.map((phase, index) => (
              <div
                key={index}
                style={{ animationDelay: `${index * 100}ms` }}
                className={`
                  relative p-6 rounded-2xl bg-purple-950/40 backdrop-blur-sm
                  border-2 ${phase.borderColor}
                  ${phase.shadowClass}
                  transition-all duration-300 hover:scale-105
                  animate-fade-in
                  flex flex-col h-full
                `}
              >
                <div className={`
                  inline-block self-start text-xs font-mono px-3 py-1 rounded-full mb-4 border
                  ${phase.badgeClass}
                `}>
                  {phase.badge}
                </div>
                
                <div className="text-6xl mb-4 text-center">
                  {phase.icon}
                </div>
                
                <h3 className={`text-2xl font-black mb-6 text-center ${phase.titleColor}`}>
                  {phase.title}
                </h3>
                
                <ul className="space-y-3 text-sm text-purple-200 flex-grow">
                  {phase.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-2 text-primary">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Block 7: FAQ Section */}
      <section className="py-20 md:py-24 px-6 bg-gradient-to-b from-secondary/20 to-background">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl md:text-6xl font-mono font-bold mb-12 text-center text-foreground animate-fade-in">
            questions you're probably asking
          </h2>
          
          <div className="bg-purple-950/30 backdrop-blur-sm border border-primary/20 rounded-2xl p-6 md:p-8">
            <Accordion type="single" collapsible className="w-full">
              {faqData.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="border-b border-primary/10 last:border-0"
                >
                  <AccordionTrigger className="font-mono font-bold text-lg md:text-xl text-white hover:text-cyan-400 transition-colors py-6 text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm md:text-base text-purple-200 pb-6 pt-2 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </>
  );
};

export default NetworkJourney;
