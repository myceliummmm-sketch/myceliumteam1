import { Artifact, ArtifactId } from '@/types/game';

export const LEGENDARY_ARTIFACTS: Record<ArtifactId, Omit<Artifact, 'unlocked' | 'unlockedAt'>> = {
  deepresearch: {
    id: 'deepresearch',
    name: 'The Deepresearch Codex',
    description: 'Ancient tome containing the secrets of user research and market discovery',
    lore: 'Forged in the fires of failed startups, this artifact reveals the truth hidden in user needs.',
    phase: 'RESEARCH',
    
    requirements: {
      minLevel: 10,
      bossBlockersDefeated: 1,
      milestonesRequired: ['complete_inception', 'first_user_interview'],
      phasesCompleted: ['VISION', 'RESEARCH']
    },
    
    passiveBonuses: {
      xpMultiplier: 1.25,
    },
    
    unlocks: {
      specialQuickReplies: [
        'Conduct deep user research',
        'Analyze competitor strategies',
        'Identify market gaps'
      ],
      featureUnlock: 'Research Insights Panel'
    },
    
    prompt: {
      title: 'The Deepresearch Framework',
      template: `You are a seasoned product researcher conducting deep user discovery.

CONTEXT:
- Product/Idea: [YOUR PRODUCT]
- Target Market: [YOUR MARKET]
- Current Stage: [STAGE]

OBJECTIVES:
1. Identify core user problems and pain points
2. Validate assumptions about user needs
3. Discover unexpected insights and opportunities

FRAMEWORK:
1. User Problem Mining
   - What job is the user trying to do?
   - What prevents them from doing it well?
   - What are the emotional and functional pain points?

2. Market Analysis
   - Who else solves this problem?
   - What gaps exist in current solutions?
   - What trends are emerging?

3. Validation Questions
   - What evidence supports this problem?
   - Who is affected most severely?
   - What would they pay to solve it?

Provide detailed, actionable research insights with specific validation steps.`,
      usageInstructions: 'Use this prompt with any AI assistant to conduct thorough user research for your product ideas.'
    }
  },
  
  product: {
    id: 'product',
    name: 'The Lovable Lens',
    description: 'Mystical artifact that reveals the path to building products users love',
    lore: 'Crafted from the essence of 1000 successful launches, it shows the way to product-market fit.',
    phase: 'BUILD',
    
    requirements: {
      minLevel: 20,
      bossBlockersDefeated: 2,
      milestonesRequired: ['complete_design', 'first_prototype', 'first_feature_ship'],
      phasesCompleted: ['VISION', 'RESEARCH', 'PROTOTYPE', 'BUILD']
    },
    
    passiveBonuses: {
      energyRegenBonus: 1,
    },
    
    unlocks: {
      newAdvisor: 'phoenix',
      specialQuickReplies: [
        'Prioritize features by impact',
        'Design for delight',
        'Build the MVP scope'
      ]
    },
    
    prompt: {
      title: 'The Lovable Product Framework',
      template: `You are a product strategist helping build products users genuinely love.

PRODUCT CONTEXT:
- Product: [YOUR PRODUCT]
- Target Users: [USER SEGMENT]
- Core Value Prop: [VALUE]

LOVABLE PRODUCT PRINCIPLES:
1. Solve Real Problems
   - Is this a vitamin or painkiller?
   - Does it solve a frequent, intense problem?
   - Can users describe their pain clearly?

2. Delightful Experience
   - What makes this 10x better than alternatives?
   - Where can we exceed expectations?
   - What small details create joy?

3. Simple to Understand
   - Can you explain it in one sentence?
   - Is the first-time experience magical?
   - Do users "get it" immediately?

4. Scope for Launch
   - What's the minimum to prove value?
   - What can we cut without losing magic?
   - What's the fastest path to user feedback?

Provide a concrete product strategy with features prioritized by lovability and impact.`,
      usageInstructions: 'Use this to design products that users don\'t just need, but actually love using.'
    }
  },
  
  marketing: {
    id: 'marketing',
    name: 'The Viral Scroll',
    description: 'Legendary artifact containing the secrets of organic growth and word-of-mouth',
    lore: 'Born from viral tweets and shared stories, this scroll teaches the art of spreading ideas.',
    phase: 'GROW',
    
    requirements: {
      minLevel: 30,
      bossBlockersDefeated: 3,
      milestonesRequired: ['complete_testing', 'first_user_feedback', 'ship_product'],
      phasesCompleted: ['VISION', 'RESEARCH', 'PROTOTYPE', 'BUILD', 'GROW']
    },
    
    passiveBonuses: {
      sporeMultiplier: 1.5,
    },
    
    unlocks: {
      specialQuickReplies: [
        'Craft viral launch strategy',
        'Build in public campaign',
        'Design referral mechanics'
      ],
      featureUnlock: 'Marketing Strategy Panel'
    },
    
    prompt: {
      title: 'The Viral Growth Framework',
      template: `You are a growth marketer specializing in organic, word-of-mouth marketing.

PRODUCT CONTEXT:
- Product: [YOUR PRODUCT]
- Target Audience: [AUDIENCE]
- Launch Stage: [STAGE]

VIRAL GROWTH FRAMEWORK:
1. Remarkable Positioning
   - What makes this worth talking about?
   - What's the one-liner that spreads?
   - Who are the initial believers?

2. Distribution Channels
   - Where does your audience hang out?
   - What communities care about this?
   - Who are the influencers/amplifiers?

3. Launch Narrative
   - What's the story behind this?
   - Why now? Why you?
   - What transformation does it enable?

4. Growth Loops
   - How do users naturally share this?
   - What makes it inherently viral?
   - How does each user bring more users?

5. Launch Tactics
   - Pre-launch: Build anticipation
   - Launch day: Create momentum
   - Post-launch: Sustain growth

Provide a detailed marketing strategy focused on organic growth and authentic storytelling.`,
      usageInstructions: 'Use this framework to create marketing campaigns that spread organically through genuine enthusiasm.'
    }
  }
};
