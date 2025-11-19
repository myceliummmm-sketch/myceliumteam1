import { Phase } from '@/types/game';

export interface StageTip {
  phase: Phase;
  stageNumber: number;
  tips: string[];
  encouragement: string;
}

export const STAGE_TIPS: Record<Phase, Record<number, StageTip>> = {
  SPARK: {
    1: {
      phase: 'SPARK',
      stageNumber: 1,
      tips: [
        "Try starting with: 'I notice that [target users] struggle with...'",
        "Ask yourself: What frustration keeps people up at night?",
        "Frame it as: '[Who] needs [what] because [why]'"
      ],
      encouragement: "Every great product starts with a clear problem. Take your time! 💡"
    },
    2: {
      phase: 'SPARK',
      stageNumber: 2,
      tips: [
        "Describe your solution in one sentence",
        "Try: 'What if we could [solve problem] by [method]?'",
        "Don't worry about perfection - just capture the core idea"
      ],
      encouragement: "Your solution doesn't need to be perfect yet. Just articulate the vision! ✨"
    },
    3: {
      phase: 'SPARK',
      stageNumber: 3,
      tips: [
        "Complete: 'Unlike [competitors], we...'",
        "What's your unfair advantage?",
        "Focus on the ONE thing that makes you different"
      ],
      encouragement: "Your unique value is what makes this worth building! 🎯"
    },
    4: {
      phase: 'SPARK',
      stageNumber: 4,
      tips: [
        "Craft a vision: '[Product] helps [users] achieve [outcome]'",
        "Read it out loud - does it excite you?",
        "If yes, say: 'Lock vision and move to EXPLORE'"
      ],
      encouragement: "You're so close! Lock in your vision and let's validate it! 🚀"
    }
  },
  EXPLORE: {
    1: {
      phase: 'EXPLORE',
      stageNumber: 1,
      tips: [
        "Create 2-3 user personas with names and backgrounds",
        "Describe their daily routine and pain points",
        "What motivates them? What frustrates them?"
      ],
      encouragement: "Understanding your users deeply is the key to building something they'll love! 👥"
    },
    2: {
      phase: 'EXPLORE',
      stageNumber: 2,
      tips: [
        "List the top 3 features your MVP absolutely needs",
        "Ask: What's the smallest thing that solves the core problem?",
        "Remember: You can always add more later"
      ],
      encouragement: "Start lean, iterate fast. Your MVP is meant to validate, not wow! 🎯"
    },
    3: {
      phase: 'EXPLORE',
      stageNumber: 3,
      tips: [
        "Sketch the main user journey from start to finish",
        "What's the happy path? What are the steps?",
        "Try: 'User lands → sees X → clicks Y → gets Z'"
      ],
      encouragement: "Map the journey before you build the road! 🗺️"
    },
    4: {
      phase: 'EXPLORE',
      stageNumber: 4,
      tips: [
        "What metrics will prove this is working?",
        "Define success: 'We'll know it works when [metric] reaches [target]'",
        "Focus on 1-2 key metrics that matter most"
      ],
      encouragement: "Measure what matters. Numbers tell the truth! 📊"
    }
  },
  CRAFT: {
    1: {
      phase: 'CRAFT',
      stageNumber: 1,
      tips: [
        "Start with the core feature - build the heart first",
        "What's the one thing users absolutely need?",
        "Implement basic functionality, skip the polish"
      ],
      encouragement: "Build the engine before you paint the car! 🔧"
    },
    2: {
      phase: 'CRAFT',
      stageNumber: 2,
      tips: [
        "Connect your frontend to backend/database",
        "Make data flow: User action → Backend → Response",
        "Test with real data, not just placeholders"
      ],
      encouragement: "Data is the lifeblood of your app. Get it flowing! 🔄"
    },
    3: {
      phase: 'CRAFT',
      stageNumber: 3,
      tips: [
        "Can users sign up, log in, and use their data?",
        "Implement basic auth: email/password or social login",
        "Secure user data with proper permissions"
      ],
      encouragement: "Authentication builds trust. Protect your users! 🔐"
    },
    4: {
      phase: 'CRAFT',
      stageNumber: 4,
      tips: [
        "Test the complete user flow end-to-end",
        "Try it yourself: Can you complete the main task?",
        "Fix critical bugs, ignore minor UI issues for now"
      ],
      encouragement: "If it works, ship it! Polish comes next. ✅"
    }
  },
  FORGE: {
    1: {
      phase: 'FORGE',
      stageNumber: 1,
      tips: [
        "Add the secondary features that enhance the core",
        "Think: What would make power users happy?",
        "Build features that complement, not complicate"
      ],
      encouragement: "Layer on value, but keep the core simple! 🎨"
    },
    2: {
      phase: 'FORGE',
      stageNumber: 2,
      tips: [
        "Make it fast: Optimize slow queries and heavy pages",
        "Test on a slow connection - does it still work?",
        "Users notice speed more than features"
      ],
      encouragement: "Speed is a feature. Make it snappy! ⚡"
    },
    3: {
      phase: 'FORGE',
      stageNumber: 3,
      tips: [
        "Design for mobile, tablet, and desktop",
        "Test on your phone - is it usable?",
        "Most users are on mobile. Prioritize it!"
      ],
      encouragement: "Responsive design isn't optional anymore! 📱"
    },
    4: {
      phase: 'FORGE',
      stageNumber: 4,
      tips: [
        "Add error handling: What if things go wrong?",
        "Show helpful messages, not cryptic errors",
        "Test edge cases: empty states, failures, timeouts"
      ],
      encouragement: "Handle errors gracefully. Users will thank you! 🛡️"
    }
  },
  POLISH: {
    1: {
      phase: 'POLISH',
      stageNumber: 1,
      tips: [
        "Refine the visual design: colors, spacing, typography",
        "Does it look professional and trustworthy?",
        "Small details make a big difference"
      ],
      encouragement: "First impressions matter. Make it beautiful! ✨"
    },
    2: {
      phase: 'POLISH',
      stageNumber: 2,
      tips: [
        "Add micro-interactions: hover states, animations, transitions",
        "Make the UI feel alive and responsive",
        "Subtle animations = polished experience"
      ],
      encouragement: "Delight users with smooth interactions! 🎭"
    },
    3: {
      phase: 'POLISH',
      stageNumber: 3,
      tips: [
        "Make it accessible: keyboard navigation, screen readers, contrast",
        "Test with accessibility tools",
        "Everyone deserves to use your product"
      ],
      encouragement: "Build for everyone. Accessibility is empathy! ♿"
    },
    4: {
      phase: 'POLISH',
      stageNumber: 4,
      tips: [
        "Final QA: Test every flow, every button, every edge case",
        "Get someone else to try it - fresh eyes find bugs",
        "Fix critical issues, document known minor bugs"
      ],
      encouragement: "You're launch-ready! One final check! 🎯"
    }
  },
  LAUNCH: {
    1: {
      phase: 'LAUNCH',
      stageNumber: 1,
      tips: [
        "Set up analytics to track user behavior",
        "What do you want to learn from real users?",
        "Install tracking before launch, not after"
      ],
      encouragement: "Data-driven decisions start with good tracking! 📈"
    },
    2: {
      phase: 'LAUNCH',
      stageNumber: 2,
      tips: [
        "Deploy to production: Choose a hosting platform",
        "Set up custom domain, SSL, environment variables",
        "Test the production build thoroughly"
      ],
      encouragement: "Make it live! The world is waiting! 🌍"
    },
    3: {
      phase: 'LAUNCH',
      stageNumber: 3,
      tips: [
        "Share with your first users: friends, community, social media",
        "Ask for honest feedback, not just praise",
        "Start small, grow organically"
      ],
      encouragement: "Your first users are your best teachers! 🎉"
    },
    4: {
      phase: 'LAUNCH',
      stageNumber: 4,
      tips: [
        "Monitor feedback, fix critical bugs immediately",
        "What are users asking for? What's breaking?",
        "Iterate based on real usage, not assumptions"
      ],
      encouragement: "Launch is just the beginning. Keep improving! 🚀"
    }
  }
};

export function getStageTips(phase: Phase, stageNumber: number): StageTip | null {
  return STAGE_TIPS[phase]?.[stageNumber] || null;
}

export function shouldShowTip(stageEnteredAt: Date | null, minMinutes: number = 5): boolean {
  if (!stageEnteredAt) return false;
  const minutesInStage = (Date.now() - stageEnteredAt.getTime()) / (1000 * 60);
  return minutesInStage >= minMinutes;
}
