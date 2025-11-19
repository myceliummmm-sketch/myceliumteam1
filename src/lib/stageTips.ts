import { Phase } from '@/types/game';

export interface StageTip {
  phase: Phase;
  stageNumber: number;
  tips: string[];
  encouragement: string;
}

export const STAGE_TIPS: Record<Phase, Record<number, StageTip>> = {
  VISION: {
    1: { phase: 'VISION', stageNumber: 1, tips: ["Try starting with: 'I notice that [target users] struggle with...'", "Ask yourself: What frustration keeps people up at night?"], encouragement: "Every great product starts with a clear problem! 💡" },
    2: { phase: 'VISION', stageNumber: 2, tips: ["Describe your solution in one sentence", "Try: 'What if we could [solve problem] by [method]?'"], encouragement: "Just articulate the vision! ✨" },
    3: { phase: 'VISION', stageNumber: 3, tips: ["Complete: 'Unlike [competitors], we...'", "What's your unfair advantage?"], encouragement: "Your unique value is what makes this worth building! 🎯" },
    4: { phase: 'VISION', stageNumber: 4, tips: ["Craft a vision: '[Product] helps [users] achieve [outcome]'", "Read it out loud - does it excite you?"], encouragement: "Lock in your vision and let's validate it! 🚀" }
  },
  RESEARCH: {
    1: { phase: 'RESEARCH', stageNumber: 1, tips: ["Create 2-3 detailed user personas", "Map out their current journey"], encouragement: "Understanding users is the foundation! 🔍" },
    2: { phase: 'RESEARCH', stageNumber: 2, tips: ["Write open-ended questions", "Focus on understanding problems"], encouragement: "Good questions unlock great insights! 💬" },
    3: { phase: 'RESEARCH', stageNumber: 3, tips: ["Talk to 5-10 potential users", "Listen more than you talk (80/20)"], encouragement: "Every interview brings you closer to product-market fit! 👂" },
    4: { phase: 'RESEARCH', stageNumber: 4, tips: ["Look for patterns across interviews", "Identify most common pain points"], encouragement: "Your insights will guide everything! 📊" }
  },
  PROTOTYPE: {
    1: { phase: 'PROTOTYPE', stageNumber: 1, tips: ["Map the happy path first", "Identify core features vs nice-to-haves"], encouragement: "Structure first, details later! 🗺️" },
    2: { phase: 'PROTOTYPE', stageNumber: 2, tips: ["Use paper/Figma for quick sketches", "Focus on layout, not colors"], encouragement: "Low-fi is perfect for iteration! ✏️" },
    3: { phase: 'PROTOTYPE', stageNumber: 3, tips: ["Make it clickable/interactive", "Apply brand colors"], encouragement: "Make it feel real! 🎨" },
    4: { phase: 'PROTOTYPE', stageNumber: 4, tips: ["Recruit 5 people matching your personas", "Write specific tasks"], encouragement: "5 users catch 85% of issues! 🎯" },
    5: { phase: 'PROTOTYPE', stageNumber: 5, tips: ["🎯 Test with 5 people - critical!", "Watch them without helping", "Document every piece of feedback"], encouragement: "User testing is THE most valuable thing! Test with 5 real people! 👥✨" }
  },
  BUILD: {
    1: { phase: 'BUILD', stageNumber: 1, tips: ["Choose familiar technologies", "Set up version control"], encouragement: "Solid foundation makes everything easier! 🏗️" },
    2: { phase: 'BUILD', stageNumber: 2, tips: ["Build core user flow first", "Make it work before perfect"], encouragement: "Ship early, ship often! 🚢" },
    3: { phase: 'BUILD', stageNumber: 3, tips: ["Write tests for critical paths", "Fix bugs by severity"], encouragement: "Quality matters! ✅" },
    4: { phase: 'BUILD', stageNumber: 4, tips: ["Deploy to staging/beta", "Invite 5-10 early users"], encouragement: "Beta testing saves embarrassment! 🧪" }
  },
  GROW: {
    1: { phase: 'GROW', stageNumber: 1, tips: ["Finalize landing page", "Set up analytics"], encouragement: "Preparation prevents poor performance! 📋" },
    2: { phase: 'GROW', stageNumber: 2, tips: ["Post on Product Hunt, HN, Reddit", "Share in communities"], encouragement: "Launch day is exciting! 🚀" },
    3: { phase: 'GROW', stageNumber: 3, tips: ["Try different growth channels", "Track what's working"], encouragement: "Growth is experimentation! 📈" },
    4: { phase: 'GROW', stageNumber: 4, tips: ["Optimize infrastructure", "Improve conversion"], encouragement: "Keep the momentum going! 🏆" }
  }
};

export function getStageTip(phase: Phase, stageNumber: number): StageTip | null {
  return STAGE_TIPS[phase]?.[stageNumber] || null;
}
