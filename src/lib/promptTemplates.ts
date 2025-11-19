import { Phase, PromptCategory } from '@/types/game';

export interface PromptTemplate {
  title: string;
  description: string;
  category: PromptCategory;
  phase: Phase;
  prompt_text: string;
  prompt_variables: string[];
  created_by_character: string;
  contributing_characters: string[];
  tags: string[];
}

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  // VISION Phase Templates
  {
    title: 'Problem Statement Framework',
    description: 'Define the core problem you\'re solving',
    category: 'product',
    phase: 'VISION',
    prompt_text: `You are a product strategist helping define a clear problem statement.

CONTEXT:
Product: {{product_name}}
Target Users: {{target_users}}

TASK:
Create a concise problem statement that includes:
1. Who experiences this problem
2. What the problem is
3. Why it matters (impact/pain)
4. What causes the problem
5. Current inadequate solutions

FORMAT:
[User Group] struggles with [Problem] because [Root Cause].
This matters because [Impact].
Current solutions like [Alternative] fail because [Gap].

EXAMPLE:
Remote teams struggle with async standups because timezone differences make real-time meetings impossible.
This matters because 40% of teams miss critical blockers, delaying projects by an average of 2 days per sprint.
Current solutions like Slack threads fail because they lack structure and accountability.`,
    prompt_variables: ['product_name', 'target_users'],
    created_by_character: 'prisma',
    contributing_characters: ['prisma', 'virgil'],
    tags: ['problem-definition', 'product-strategy', 'inception']
  },
  
  {
    title: 'Vision Document Template',
    description: 'Articulate your product vision and mission',
    category: 'product',
    phase: 'VISION',
    prompt_text: `You are a product visionary crafting a compelling product vision.

CONTEXT:
Product: {{product_name}}
Problem Solved: {{problem_statement}}

TASK:
Create a vision document covering:

1. MISSION (Why we exist)
- The fundamental problem we're solving
- Who we serve
- Our north star

2. VISION (Where we're going)
- What the world looks like when we succeed
- 3-year aspirational goal
- Success metrics

3. PRINCIPLES (How we operate)
- Core values
- What we won't compromise on
- Decision-making framework

FORMAT:
Mission: One sentence
Vision: 2-3 paragraphs
Principles: 4-5 bullet points

Keep it inspiring but grounded.`,
    prompt_variables: ['product_name', 'problem_statement'],
    created_by_character: 'ever',
    contributing_characters: ['ever', 'virgil', 'phoenix'],
    tags: ['vision', 'mission', 'strategy']
  },

  // RESEARCH Phase Templates
  {
    title: 'User Interview Guide',
    description: 'Comprehensive framework for user interviews',
    category: 'research',
    phase: 'RESEARCH',
    prompt_text: `You are a user researcher conducting interviews to validate assumptions.

CONTEXT:
Product: {{product_name}}
Target Users: {{target_audience}}
Hypothesis: {{hypothesis_to_test}}

TASK:
Create a user interview script with:

1. INTRODUCTION (2 min)
- Thank them for their time
- Explain purpose (learning, not selling)
- Ask permission to record
- Set expectations (30-45 min)

2. WARM-UP (5 min)
- Background questions
- Current workflow
- Build rapport

3. CORE QUESTIONS (20-30 min)
Open-ended questions about:
- Their biggest challenges with [problem area]
- Current solutions they use
- Workarounds they've developed
- What a perfect solution would look like
- Deal-breakers

4. FOLLOW-UPS
For each answer, dig deeper with:
- "Tell me more about that..."
- "Can you give me a specific example?"
- "Why is that important to you?"

5. CLOSING (5 min)
- Anything we didn't cover?
- Can we follow up?
- Referrals to other users?

RULES:
- Ask open-ended questions (avoid yes/no)
- Don't lead the witness
- Listen 80%, talk 20%
- Probe for specific stories`,
    prompt_variables: ['product_name', 'target_audience', 'hypothesis_to_test'],
    created_by_character: 'prisma',
    contributing_characters: ['prisma', 'ever'],
    tags: ['user-research', 'interviews', 'validation']
  },

  {
    title: 'Competitor Analysis Framework',
    description: 'Systematic competitive research template',
    category: 'research',
    phase: 'RESEARCH',
    prompt_text: `You are a market analyst researching competitive landscape.

CONTEXT:
Your Product: {{product_name}}
Market: {{market_category}}
Direct Competitors: {{competitors}}

TASK:
Analyze each competitor across these dimensions:

1. PRODUCT OFFERING
- Core features
- Unique selling points
- Gaps in their offering

2. TARGET MARKET
- Who they serve
- Market positioning
- Pricing strategy

3. STRENGTHS
- What they do exceptionally well
- Why users choose them
- Moats/defensibility

4. WEAKNESSES
- Common user complaints
- Missing features
- Poor user experiences

5. OPPORTUNITIES FOR YOU
- Underserved segments
- Feature gaps
- Better positioning angles

FORMAT:
Create a comparison table and 2-paragraph summary per competitor.

SOURCES TO CHECK:
- Product website and demo
- User reviews (G2, Capterra, App Store)
- Social media discussions
- Pricing pages
- Job postings (reveals strategy)`,
    prompt_variables: ['product_name', 'market_category', 'competitors'],
    created_by_character: 'toxic',
    contributing_characters: ['toxic', 'prisma'],
    tags: ['competitive-analysis', 'market-research']
  },

  // PROTOTYPE Phase Templates
  {
    title: 'User Story Template',
    description: 'Convert features into user-focused stories',
    category: 'design',
    phase: 'PROTOTYPE',
    prompt_text: `You are a product manager writing user stories.

CONTEXT:
Feature: {{feature_name}}
User Persona: {{user_persona}}

TASK:
Write user stories in this format:

TITLE: Short, descriptive name

AS A [user type]
I WANT [goal/desire]
SO THAT [benefit/value]

ACCEPTANCE CRITERIA:
- Given [context/precondition]
- When [action]
- Then [expected outcome]

(3-5 criteria covering happy path and edge cases)

TECHNICAL NOTES:
- API/data requirements
- Dependencies
- Complexity estimate

EXAMPLE:
Title: Export Analytics Report

As a product manager
I want to export usage data as a CSV
So that I can analyze trends in Excel

Acceptance Criteria:
- Given I'm viewing the analytics dashboard
- When I click "Export CSV"
- Then I receive a file with all filtered data
- And the file includes column headers
- And dates are formatted as YYYY-MM-DD`,
    prompt_variables: ['feature_name', 'user_persona'],
    created_by_character: 'prisma',
    contributing_characters: ['prisma', 'techpriest'],
    tags: ['user-stories', 'requirements', 'agile']
  },

  // BUILD Phase Templates
  {
    title: 'Code Review Checklist',
    description: 'Systematic code review criteria',
    category: 'technical',
    phase: 'BUILD',
    prompt_text: `You are a senior engineer reviewing code for quality and security.

CONTEXT:
Technology: {{tech_stack}}
Feature: {{feature_description}}

TASK:
Review code against this checklist:

1. FUNCTIONALITY ✅
- Does it work as intended?
- Are edge cases handled?
- Are errors handled gracefully?

2. CODE QUALITY 📚
- Is it readable and maintainable?
- Are functions small and focused?
- Are variables well-named?
- Is there duplication (DRY)?

3. SECURITY 🔒
- Are inputs validated?
- Is sensitive data protected?
- Are SQL injection risks addressed?
- Is authentication/authorization correct?

4. PERFORMANCE ⚡
- Are there N+1 query issues?
- Is caching appropriate?
- Are large operations batched?

5. TESTING 🧪
- Are there unit tests?
- Do tests cover edge cases?
- Is mocking appropriate?

6. DOCUMENTATION 📖
- Are complex parts commented?
- Is the API documented?
- Are breaking changes noted?

FORMAT:
- ✅ Approved / ⚠️ Needs Changes / ❌ Critical Issues
- Specific line-by-line feedback
- Prioritized action items`,
    prompt_variables: ['tech_stack', 'feature_description'],
    created_by_character: 'techpriest',
    contributing_characters: ['techpriest', 'toxic', 'zen'],
    tags: ['code-review', 'quality-assurance', 'best-practices']
  },

  // GROW Phase Templates (Testing & Launch)
  {
    title: 'QA Testing Checklist',
    description: 'Comprehensive testing scenarios',
    category: 'technical',
    phase: 'GROW',
    prompt_text: `You are a QA engineer creating a testing plan.

CONTEXT:
Feature: {{feature_name}}
User Flow: {{user_flow}}

TASK:
Create test cases covering:

1. HAPPY PATH ✅
- Standard user flow works perfectly
- All features function as designed
- Data persists correctly

2. EDGE CASES 🎯
- Empty states
- Maximum limits
- Minimum values
- Special characters
- Very long inputs

3. ERROR SCENARIOS ❌
- Invalid inputs
- Network failures
- Timeout situations
- Permission denials

4. CROSS-BROWSER/DEVICE 📱💻
- Chrome, Firefox, Safari
- Mobile responsive
- Tablet layouts
- Touch vs mouse

5. PERFORMANCE 🚀
- Load time < 3 seconds
- Handles 100+ items
- No memory leaks
- Smooth animations

6. ACCESSIBILITY ♿
- Keyboard navigation
- Screen reader friendly
- Color contrast
- Alt text on images

FORMAT:
Test Case | Steps | Expected Result | Pass/Fail`,
    prompt_variables: ['feature_name', 'user_flow'],
    created_by_character: 'toxic',
    contributing_characters: ['toxic', 'zen'],
    tags: ['testing', 'qa', 'quality-assurance']
  },

  // GROW Phase Templates (Launch)
  {
    title: 'Launch Checklist',
    description: 'Pre-launch preparation and monitoring',
    category: 'general',
    phase: 'GROW',
    prompt_text: `You are a launch manager preparing for production deployment.

CONTEXT:
Product: {{product_name}}
Launch Date: {{launch_date}}

TASK:
Complete this launch checklist:

1. TECHNICAL READINESS 🔧
- [ ] All tests passing
- [ ] Performance benchmarks met
- [ ] Database migrations tested
- [ ] Rollback plan documented
- [ ] Monitoring/alerts configured
- [ ] Error tracking set up
- [ ] Backups automated

2. SECURITY 🔒
- [ ] Security audit completed
- [ ] SSL certificates valid
- [ ] API keys rotated
- [ ] Rate limiting configured
- [ ] DDoS protection enabled

3. CONTENT & MESSAGING 📝
- [ ] Landing page live
- [ ] Documentation complete
- [ ] Support materials ready
- [ ] Pricing page clear
- [ ] Legal pages (Terms, Privacy)

4. MARKETING 📣
- [ ] Email announcement drafted
- [ ] Social media scheduled
- [ ] Press kit prepared
- [ ] Launch blog post ready

5. SUPPORT 💬
- [ ] Support team trained
- [ ] FAQs documented
- [ ] Issue tracking set up
- [ ] Response templates ready

6. MONITORING 📊
- [ ] Analytics tracking
- [ ] User feedback collection
- [ ] Performance dashboards
- [ ] On-call schedule

POST-LAUNCH (24 hours):
- Monitor error rates
- Track key metrics
- Respond to feedback
- Fix critical issues`,
    prompt_variables: ['product_name', 'launch_date'],
    created_by_character: 'zen',
    contributing_characters: ['zen', 'techpriest', 'phoenix'],
    tags: ['launch', 'deployment', 'checklist']
  },
];
