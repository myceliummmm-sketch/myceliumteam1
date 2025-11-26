export interface ResearchTemplate {
  id: string;
  label: string;
  description: string;
  variables: Array<{
    name: string;
    label: string;
    placeholder: string;
    type: 'text' | 'textarea' | 'select';
    options?: string[];
  }>;
  promptTemplate: string;
  expectedCards: number;
  advisorTip?: string;
}

export const RESEARCH_TEMPLATES: Record<number, ResearchTemplate[]> = {
  1: [
    {
      id: 'user_pain',
      label: 'User Pain Points',
      description: 'Deep dive into user problems and frustrations',
      variables: [
        { name: 'target_user', label: 'Target User', placeholder: 'e.g., Small business owners', type: 'text' },
        { name: 'problem_area', label: 'Problem Area', placeholder: 'e.g., Time management, costs', type: 'text' },
        { name: 'context', label: 'Context', placeholder: 'Describe the situation...', type: 'textarea' }
      ],
      promptTemplate: 'Research the pain points of {{target_user}} in {{problem_area}}. Context: {{context}}',
      expectedCards: 6,
      advisorTip: 'Prisma: Understanding user pain is the foundation of all great products.'
    },
    {
      id: 'use_cases',
      label: 'Use Cases',
      description: 'Explore how users might use your solution',
      variables: [
        { name: 'solution', label: 'Your Solution', placeholder: 'e.g., AI scheduling tool', type: 'text' },
        { name: 'user_type', label: 'User Type', placeholder: 'e.g., Freelancers', type: 'text' }
      ],
      promptTemplate: 'Research practical use cases for {{solution}} targeting {{user_type}}',
      expectedCards: 5,
      advisorTip: 'Virgil: Use cases turn abstract ideas into concrete value.'
    }
  ],
  2: [
    {
      id: 'market_analysis',
      label: 'Market Analysis',
      description: 'Analyze market size, trends, and opportunities',
      variables: [
        { name: 'market_segment', label: 'Market Segment', placeholder: 'e.g., SaaS for healthcare', type: 'text' },
        { name: 'geography', label: 'Geography', placeholder: 'e.g., North America', type: 'text' }
      ],
      promptTemplate: 'Analyze the {{market_segment}} market in {{geography}}',
      expectedCards: 7,
      advisorTip: 'Phoenix: Market size determines your growth potential.'
    },
    {
      id: 'trends',
      label: 'Industry Trends',
      description: 'Identify emerging trends and shifts',
      variables: [
        { name: 'industry', label: 'Industry', placeholder: 'e.g., Fintech', type: 'text' },
        { name: 'timeframe', label: 'Timeframe', placeholder: '2024-2025', type: 'text' }
      ],
      promptTemplate: 'Research emerging trends in {{industry}} for {{timeframe}}',
      expectedCards: 5,
      advisorTip: 'Ever Green: Ride the wave of trends, don\'t fight against them.'
    }
  ],
  3: [
    {
      id: 'competitor_intel',
      label: 'Competitor Analysis',
      description: 'Analyze competitors\' strengths and weaknesses',
      variables: [
        { name: 'competitor_name', label: 'Competitor', placeholder: 'e.g., CompanyX', type: 'text' },
        { name: 'aspect', label: 'Focus Area', placeholder: 'e.g., Pricing, features', type: 'text' }
      ],
      promptTemplate: 'Analyze {{competitor_name}} focusing on {{aspect}}',
      expectedCards: 6,
      advisorTip: 'Toxic: Know your enemy better than they know themselves.'
    },
    {
      id: 'differentiation',
      label: 'Differentiation Strategy',
      description: 'Find your unique positioning',
      variables: [
        { name: 'our_solution', label: 'Our Solution', placeholder: 'Describe your product', type: 'textarea' },
        { name: 'competitors', label: 'Top Competitors', placeholder: 'List 2-3 competitors', type: 'text' }
      ],
      promptTemplate: 'Research differentiation opportunities for {{our_solution}} vs {{competitors}}',
      expectedCards: 5,
      advisorTip: 'Zen: Your uniqueness is your strength.'
    }
  ],
  4: [
    {
      id: 'opportunity_gaps',
      label: 'Market Gaps',
      description: 'Identify unmet needs and opportunities',
      variables: [
        { name: 'industry', label: 'Industry', placeholder: 'e.g., E-commerce', type: 'text' },
        { name: 'customer_segment', label: 'Customer Segment', placeholder: 'e.g., SMBs', type: 'text' }
      ],
      promptTemplate: 'Research market gaps in {{industry}} for {{customer_segment}}',
      expectedCards: 6,
      advisorTip: 'Advisor: Gaps are where fortunes are made.'
    },
    {
      id: 'tech_landscape',
      label: 'Technology Landscape',
      description: 'Survey available technologies and tools',
      variables: [
        { name: 'technology_area', label: 'Technology Area', placeholder: 'e.g., AI, blockchain', type: 'text' },
        { name: 'use_case', label: 'Use Case', placeholder: 'Your application', type: 'text' }
      ],
      promptTemplate: 'Research {{technology_area}} technologies for {{use_case}}',
      expectedCards: 7,
      advisorTip: 'Tech Priest: The right tools multiply your effectiveness.'
    }
  ]
};

export const getTemplatesByStep = (step: number): ResearchTemplate[] => {
  return RESEARCH_TEMPLATES[step] || [];
};

export const fillTemplate = (template: ResearchTemplate, values: Record<string, string>): string => {
  let filled = template.promptTemplate;
  Object.entries(values).forEach(([key, value]) => {
    filled = filled.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });
  return filled;
};
