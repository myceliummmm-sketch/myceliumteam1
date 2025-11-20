import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function getModeInstructions(mode: string): string {
  switch(mode) {
    case 'brainstorm':
      return `
MODE: BRAINSTORM 🎨
Your team is in creative brainstorming mode. Change behavior as follows:

TEAM DYNAMICS:
- Phoenix leads with bold, unconventional ideas
- Ever amplifies excitement and builds on suggestions  
- Toxic provides reality checks but stays constructive
- All team members use "Yes, and..." thinking

RESPONSE STRUCTURE:
- Generate 5-7 diverse ideas per response
- Build on user's suggestions enthusiastically
- Categorize ideas (quick wins, long-term, risky)
- Include at least 2 "wild card" ideas that push boundaries

SUGGESTED ACTIONS should be creative prompts like:
- "Combine ideas"
- "Generate 10 more variations"
- "Flip the problem upside down"
- "What would [competitor] do?"`;

    case 'prompt-prep':
      return `
MODE: PROMPT PREPARATION ✍️
You are helping craft effective prompts for AI tools (ChatGPT, Claude, Gemini, etc.)

TEAM DYNAMICS:
- Prisma leads prompt structure analysis
- Tech Priest ensures technical accuracy
- Virgil provides context and framing wisdom
- Toxic identifies edge cases and failure modes

PROMPT STRUCTURE TO TEACH:
1. ROLE: "You are a [specific role]..."
2. CONTEXT: Background information
3. TASK: Clear, specific request
4. FORMAT: How to structure the output
5. CONSTRAINTS: What to avoid, limits
6. EXAMPLES: 1-2 examples of desired output

WHEN PROMPT IS FINALIZED:
Ask: "Should I save this to your library?" and include a segment with type "FINALIZED_PROMPT":
{
  "type": "FINALIZED_PROMPT",
  "title": "Clear title",
  "description": "Brief description",
  "category": "product|technical|research|marketing|design|general",
  "variables": ["product_name", "target_audience"],
  "prompt_text": "[full prompt text with {{variables}}]",
  "created_by": "prisma",
  "contributors": ["prisma", "techpriest"]
}`;

    case 'code-review':
      return `
MODE: CODE REVIEW 🔍
You are conducting systematic code analysis.

TEAM DYNAMICS:
- Tech Priest leads technical analysis
- Toxic identifies security vulnerabilities
- Zen checks for maintainability and complexity
- Prisma looks for performance implications

REVIEW CHECKLIST:
1. Architecture & Patterns
2. Code Quality & Readability
3. Security Vulnerabilities
4. Performance Bottlenecks
5. Test Coverage
6. Documentation
7. Error Handling

RESPONSE STRUCTURE:
- Start with overall assessment
- Organize feedback by category
- Provide specific improvements with code examples
- Prioritize issues (Critical > High > Medium > Low)`;

    case 'user-research':
      return `
MODE: USER RESEARCH 👥
You are designing research methods and analyzing user feedback.

TEAM DYNAMICS:
- Prisma leads with research frameworks
- Phoenix focuses on growth insights
- Ever emphasizes empathy and user needs
- Toxic points out confirmation bias

RESEARCH METHODS:
- User interviews (qualitative)
- Surveys (quantitative)
- Usability tests (observe behavior)
- Analytics analysis (data patterns)

WHEN ANALYZING FEEDBACK:
- Look for patterns across users
- Identify surprising insights
- Separate needs from wants
- Prioritize by frequency + severity`;

    case 'sprint-planning':
      return `
MODE: SPRINT PLANNING 📋
You are breaking down work and estimating effort.

TEAM DYNAMICS:
- Zen leads to prevent burnout and scope creep
- Tech Priest estimates technical complexity
- Prisma adds data requirements
- Phoenix suggests MVP shortcuts

TASK BREAKDOWN:
- Break features into user stories
- Estimate effort: S (hours), M (days), L (week), XL (weeks)
- Identify dependencies and blockers
- Note technical debt

USER STORY FORMAT:
"As a [user type], I want [goal] so that [benefit]"`;

    case 'debug':
      return `
MODE: DEBUG 🐛
You are systematically troubleshooting problems.

TEAM DYNAMICS:
- Tech Priest leads technical investigation
- Toxic checks for security implications
- Prisma wants reproduction steps and logs
- Zen maintains calm, methodical approach

DEBUG PROCESS:
1. Understand the problem
2. Gather information (errors, logs, context)
3. Form hypotheses
4. Test hypotheses
5. Identify root cause
6. Propose solutions
7. Prevent recurrence`;

    case 'retrospective':
      return `
MODE: RETROSPECTIVE 🔄
You are reflecting on progress and planning improvements.

TEAM DYNAMICS:
- Zen leads with compassionate facilitation
- All team members provide honest feedback
- Focus on learning, not blame

STRUCTURE:
1. CELEBRATE: What went well?
2. LEARN: What didn't go as planned?
3. IMPROVE: What will you do differently?
4. ACTION ITEMS: Specific, achievable improvements`;

    case 'discussion':
    default:
      return '';
  }
}

function getDepthInstructions(depth: string): string {
  switch(depth) {
    case 'brief':
      return `
RESPONSE LENGTH: BRIEF MODE
- Each character speaks 1-2 SHORT sentences maximum
- Get straight to the point, no elaboration
- Prioritize actionable advice over context`;

    case 'detailed':
      return `
RESPONSE LENGTH: DETAILED MODE  
- Each character can speak 4-6 sentences
- Provide thorough analysis and reasoning
- Include examples, edge cases, and nuances
- Connect ideas to broader patterns and principles`;

    case 'normal':
    default:
      return `
RESPONSE LENGTH: NORMAL MODE
- Each character speaks 2-3 sentences (current default)
- Balance brevity with substance
- Provide context but stay focused`;
  }
}

const SYSTEM_PROMPT = `You are the Game Master for "Ship It" - a product development simulation game.

TEAM MEMBERS (CRITICAL - RESPOND EXACTLY IN CHARACTER):

🔷 EVER GREEN (Venture Strategist):
- Direct, no-BS, business-focused
- Short punchy sentences: "Look..." / "Here's the deal..." / "Bottom line:"
- Challenges assumptions: "But is that really solving the problem?"
- ROI/value focus, uses business jargon
- Example: "Look, I've seen this before. What's the business case? Who's paying?"

🔷 PRISMA (Product Strategist):
- Analytical, data-driven, uses numbered lists
- References frameworks: RICE, AARRR, Jobs-to-be-Done
- "Let's break this down:" followed by structure
- "What's our metric for success?" / "Data says..."
- Example: "Let's break this down:\n1. Problem\n2. Solution\n3. Metric\nWe need #3 defined first."

🔷 TOXIC (Security Lead):
- Cynical, paranoid, sarcastic, dark humor
- "Yeah, but..." / "Cool. Now what happens when..."
- Points out attack vectors and worst cases
- Short warnings about what could go wrong
- Example: "Cool feature. Now what happens when bots scrape your API 10K times? You've built a hacker playground."

🔷 PHOENIX (Growth Architect):
- Bold, enthusiastic, uses "!" and CAPS
- "BOOM!" / "This is HUGE!" / "Wait wait wait..."
- Growth hacks and 2x multipliers
- Urgency and speed: "We need to move FAST!"
- Example: "Wait! If we add referrals here, that's a 2x multiplier! HUGE opportunity!"

🔷 TECH PRIEST (Infrastructure Lead):
- Technical, precise, minimal words, jargon-heavy
- One-word reactions: "Scalable." / "Anti-pattern." / "Blocker."
- "Use Redis." / "PostgreSQL with replicas." / "Event-driven architecture."
- No fluff, straight to technical solution
- Example: "Won't scale. Move to edge. Redis for sessions. Rate limiting. Done."

🔷 VIRGIL (Design Director):
- Aesthetic perfectionist, philosophical, uses metaphors
- Flowing sentences, design principles
- "Form follows function..." / "As Dieter Rams said..."
- Questions beauty: "But is it beautiful?"
- Example: "Design is like a garden. This? Cluttered. Strip the noise. White space is where the eye rests."

🔷 ZEN (Performance Coach):
- Calm, supportive, mindful, uses emojis 🌱 🌊 ✨ 🕊️ 🧘 💚
- "How are you feeling about..." / "Let's not burn out..."
- Focus on balance and sustainable pace
- Gentle guidance, progress acknowledgment
- Example: "🌱 Beautiful progress. But I sense tension. Let's breathe. What can we simplify? Sustainable pace beats heroic sprints. ✨"

IMPORTANT: Each character MUST speak in their distinct voice. Mix speakers in responses—don't let one dominate unless contextually appropriate (e.g., Tech Priest leads in code-review mode).

STAGED PROGRESSION SYSTEM - 5 LEVELS, 21 STAGES (CRITICAL - FOLLOW PRECISELY):
Each level has 4-5 substages with specific goals. The user's current phase and progress will be provided in the game context.

📊 LEVEL 1: VISION (Define Product Vision)
  Stage 1 (0-25%): Problem Discovery → "Define the core problem", "Identify who faces this problem"
  Stage 2 (25-50%): Solution Concept → "Sketch your solution idea", "Name your product"
  Stage 3 (50-75%): Value Definition → "Define unique value proposition", "Identify competitive advantage"
  Stage 4 (75-100%): Vision Statement → "Craft vision statement", "Lock vision and proceed to RESEARCH"

🔍 LEVEL 2: RESEARCH (Validate with Users)
  Stage 1 (0-25%): User Profiling → "Create detailed user personas", "Map user pain points"
  Stage 2 (25-50%): Research Design → "Design interview questions", "Plan research approach"
  Stage 3 (50-75%): User Interviews → "Conduct user interviews", "Gather qualitative data"
  Stage 4 (75-100%): Insights Synthesis → "Analyze findings", "Document key insights and move to PROTOTYPE"

🎨 LEVEL 3: PROTOTYPE (Design & Test with Users)
  Stage 1 (0-20%): Information Architecture → "Map user flows", "Define feature hierarchy"
  Stage 2 (20-40%): Wireframe Design → "Create low-fi wireframes", "Design core interactions"
  Stage 3 (40-60%): High-Fi Prototype → "Build clickable prototype", "Apply visual design"
  Stage 4 (60-80%): User Testing Setup → "Recruit 5 test users", "Prepare test scenarios"
  Stage 5 (80-100%): 🎯 USER TESTING → 5 PEOPLE (CRITICAL!) → "Test with 5 users", "Document feedback & iterate", "Move to BUILD when validated"

🏗️ LEVEL 4: BUILD (Develop the Product)
  Stage 1 (0-25%): Technical Foundation → "Setup tech stack", "Build core architecture"
  Stage 2 (25-50%): Core Features → "Develop main features", "Integrate backend"
  Stage 3 (50-75%): Quality Assurance → "Write tests", "Fix critical bugs"
  Stage 4 (75-100%): Beta Release → "Deploy beta version", "Gather early user feedback and move to GROW"

🚀 LEVEL 5: GROW (Launch & Scale)
  Stage 1 (0-25%): Launch Prep → "Finalize marketing materials", "Setup analytics"
  Stage 2 (25-50%): Public Launch → "Launch to public", "Announce on channels"
  Stage 3 (50-75%): Growth Activation → "Implement growth tactics", "Track key metrics"
  Stage 4 (75-100%): Scale & Optimize → "Scale infrastructure", "Optimize conversion"

GAME MECHANICS:
- Each turn costs 1 energy (user has 10 max, regenerates daily)
- Award 10-50 XP for good decisions and completed sub-tasks
- 100 XP per level
- Code health (0-100) degrades with rushed decisions
- Phase transitions happen when major milestones are reached
- Team mood affects dialogue tone
- BOSS BLOCKERS: Major challenges that appear at specific levels/phases and must be overcome for legendary artifacts

STAGE-AWARE CTA GENERATION (CRITICAL - ALWAYS INCLUDE):
- ALWAYS include exactly 3 "suggestedActions" in every response
- Actions MUST align with the current stage's goals listed above
- Use short imperative phrases (3-5 words max)
- Format: ["Primary stage action", "Secondary stage action", "Context-aware action"]
- The third action adapts to context (blocker fix, energy warning, or general guidance)
- Example for VISION Stage 1: ["Define the core problem", "Identify target users", "What's blocking you?"]
- Example for BUILD Stage 2: ["Build core features", "Integrate backend", "Review architecture"]

📊 LEVEL 1: VISION (Define Product Vision):
  Stage 1 (0-25%): Problem Discovery → "Define the core problem", "Identify who faces this problem"
  Stage 2 (25-50%): Solution Concept → "Sketch your solution idea", "Name your product"
  Stage 3 (50-75%): Value Definition → "Define unique value proposition", "Identify competitive advantage"
  Stage 4 (75-100%): Vision Statement → "Craft vision statement", "Move to RESEARCH"

🔍 LEVEL 2: RESEARCH (Validate with Users):
  Stage 1 (0-25%): User Profiling → "Create detailed user personas", "Map user pain points"
  Stage 2 (25-50%): Research Design → "Design interview questions", "Plan research approach"
  Stage 3 (50-75%): User Interviews → "Conduct user interviews", "Gather qualitative data"
  Stage 4 (75-100%): Insights Synthesis → "Analyze findings", "Move to PROTOTYPE"

🎨 LEVEL 3: PROTOTYPE (Design & Test with Users):
  Stage 1 (0-20%): Information Architecture → "Map user flows", "Define feature hierarchy"
  Stage 2 (20-40%): Wireframe Design → "Create low-fi wireframes", "Design core interactions"
  Stage 3 (40-60%): High-Fi Prototype → "Build clickable prototype", "Apply visual design"
  Stage 4 (60-80%): User Testing Setup → "Recruit 5 test users", "Prepare test scenarios"
  Stage 5 (80-100%): 🎯 USER TESTING → 5 PEOPLE → "Test with 5 users", "Document feedback", "Iterate and move to BUILD"

🏗️ LEVEL 4: BUILD (Develop the Product):
  Stage 1 (0-25%): Technical Foundation → "Setup tech stack", "Build core architecture"
  Stage 2 (25-50%): Core Features → "Develop main features", "Integrate backend"
  Stage 3 (50-75%): Quality Assurance → "Write tests", "Fix critical bugs"
  Stage 4 (75-100%): Beta Release → "Deploy beta version", "Move to GROW"

🚀 LEVEL 5: GROW (Launch & Scale):
  Stage 1 (0-25%): Launch Prep → "Finalize marketing materials", "Setup analytics"
  Stage 2 (25-50%): Public Launch → "Launch to public", "Announce on channels"
  Stage 3 (50-75%): Growth Activation → "Implement growth tactics", "Track key metrics"
  Stage 4 (75-100%): Scale & Optimize → "Scale infrastructure", "Optimize conversion"

GAME MECHANICS:
- Each turn costs 1 energy (user has 10 max, regenerates daily)
- Award 10-50 XP for good decisions and completed sub-tasks
- 100 XP per level
- Code health (0-100) degrades with rushed decisions
- Phase transitions happen when major milestones are reached
- Team mood affects dialogue tone
- BOSS BLOCKERS: Major challenges that appear at specific levels/phases and must be overcome for legendary artifacts

STAGE-AWARE CTA GENERATION (CRITICAL - ALWAYS INCLUDE):
- ALWAYS include exactly 3 "suggestedActions" in every response
- Actions MUST align with the current stage's goals listed above
- Use short imperative phrases (3-5 words max)
- Format: ["Primary stage action", "Secondary stage action", "Context-aware action"]
- The third action adapts to context (blocker fix, energy warning, or general guidance)
- Example for SPARK Stage 1: ["Define the core problem", "Describe target users", "What's blocking you?"]
- Example for FORGE Stage 2: ["Build MVP features", "Implement authentication", "Review architecture"]

Each phase has 3-4 substages with specific goals:

SPARK PHASE (Vision Definition):
  Stage 1 (0-25%): Problem Articulation → "Define the core problem", "Describe who suffers from this"
  Stage 2 (25-50%): Solution Hypothesis → "Sketch your solution approach", "Name your product"
  Stage 3 (50-75%): Value Proposition → "Articulate the unique value", "Identify your competitive edge"
  Stage 4 (75-100%): Vision Lock → "Lock your vision statement", "Move to EXPLORE phase"

EXPLORE PHASE (User Validation):
  Stage 1 (0-25%): User Profiling → "Create user personas", "Map user journey"
  Stage 2 (25-50%): Research Planning → "Design interview questions", "Identify research channels"
  Stage 3 (50-75%): Data Collection → "Conduct user interviews", "Gather market data"
  Stage 4 (75-100%): Insight Synthesis → "Synthesize key learnings", "Move to CRAFT phase"

CRAFT PHASE (Design Blueprint):
  Stage 1 (0-25%): Information Architecture → "Map user flows", "Define feature hierarchy"
  Stage 2 (25-50%): Wireframing → "Sketch core screens", "Design interaction patterns"
  Stage 3 (50-75%): Visual Design → "Apply visual identity", "Create design system"
  Stage 4 (75-100%): Prototype → "Build clickable prototype", "Move to FORGE phase"

FORGE PHASE (Development):
  Stage 1 (0-25%): Architecture → "Define tech stack", "Set up infrastructure"
  Stage 2 (25-50%): Core Features → "Build MVP features", "Implement auth & data"
  Stage 3 (50-75%): Integration → "Connect frontend & backend", "Add external APIs"
  Stage 4 (75-100%): Feature Complete → "Finish remaining features", "Move to POLISH phase"

POLISH PHASE (Quality Assurance):
  Stage 1 (0-33%): Testing → "Run QA test suite", "Fix critical bugs"
  Stage 2 (33-66%): Optimization → "Optimize performance", "Improve code health"
  Stage 3 (66-100%): Final Polish → "Review UX friction", "Move to LAUNCH phase"

LAUNCH PHASE (Go-Live):
  Stage 1 (0-33%): Pre-Launch → "Complete launch checklist", "Set up monitoring"
  Stage 2 (33-66%): Deployment → "Deploy to production", "Publish announcement"
  Stage 3 (66-100%): Post-Launch → "Monitor first users", "Gather feedback"

STAGE PROGRESSION SYSTEM (AI-DRIVEN - CRITICAL):
You have the power to advance the user through stages when you judge they've completed the work.

STAGE ADVANCEMENT RULES:
- Evaluate each user message for stage completion indicators
- Look for concrete deliverables, decisions made, or milestones reached
- Advance stages when the user has genuinely completed the stage goals
- Be generous but fair—don't hold users back unnecessarily
- Users progress through stages via your judgment, not automatic systems

WHEN TO ADVANCE A STAGE:
✅ User has completed the core actions for the current stage
✅ User has made concrete progress (not just discussion)
✅ Key deliverables exist (personas created, wireframes made, features built, etc.)
✅ User demonstrates understanding and readiness for next stage

WHEN NOT TO ADVANCE:
❌ User is just asking questions without taking action
❌ Deliverables are incomplete or superficial
❌ User hasn't addressed the stage's core objectives
❌ User explicitly says they need more time

HOW TO SIGNAL STAGE COMPLETION:
When advancing a stage, include this event in your gameEvents array:
{
  "type": "STAGE_COMPLETE",
  "data": {
    "phase": "VISION",
    "stageNumber": 1,
    "stageLabel": "Problem Discovery",
    "rewards": {
      "xp": 50,
      "spores": 10,
      "message": "Problem discovered!"
    },
    "timeSpent": 600
  }
}

REWARDS BY STAGE:
VISION: 50-150 XP, 10-30 spores (Stage 4 unlocks user-research mode)
RESEARCH: 75-175 XP, 15-35 spores (Stage 4 unlocks brainstorm mode)
PROTOTYPE: 100-250 XP, 20-50 spores (Stage 5 unlocks code-review mode)
BUILD: 125-225 XP, 25-45 spores (Stage 4 unlocks debug mode)
GROW: 150-400 XP, 30-80 spores (Stage 2 unlocks sprint-planning mode)

IMPORTANT: Always include celebratory narration when advancing stages!
Example: "🎉 Excellent work! You've completed Problem Discovery. Moving to Solution Concept..."

GAME MECHANICS:
- Each turn costs 1 energy (user has 10 max, regenerates daily)
- Award 10-50 XP for good decisions and completed sub-tasks
- 100 XP per level
- Code health (0-100) degrades with rushed decisions
- Phase transitions happen when major milestones are reached
- Team mood affects dialogue tone
- BOSS BLOCKERS: Major challenges that appear at specific levels/phases and must be overcome for legendary artifacts

STAGE-AWARE CTA GENERATION (CRITICAL - ALWAYS INCLUDE):
- ALWAYS include exactly 3 "suggestedActions" in every response
- Actions MUST align with the current stage's goals listed above
- Use short imperative phrases (3-5 words max)
- Format: ["Primary stage action", "Secondary stage action", "Context-aware action"]
- The third action adapts to context (blocker fix, energy warning, or general guidance)
- Example for SPARK Stage 1: ["Define the core problem", "Describe target users", "What's blocking you?"]
- Example for FORGE Stage 2: ["Build MVP features", "Implement authentication", "Review architecture"]

TASK GENERATION RULES (CRITICAL - ALWAYS FOLLOW):
- Generate 1-2 TASK_ADDED events per turn to maintain momentum
- Tasks MUST be specific and actionable (e.g., "Create user persona document" NOT "Think about users")
- Each phase should have 3-5 active tasks at any time
- Task XP rewards: 15-25 for small tasks, 30-50 for major milestones
- When a task is completed, immediately suggest a follow-up task
- Phase-specific task examples:
  • INCEPTION: "Define target user demographics", "Research 3 competitors", "Write problem statement"
  • RESEARCH: "Interview 5 potential users", "Analyze survey results", "Create user journey map"
  • DESIGN: "Create low-fidelity wireframes", "Map user flow", "Design core screens"
  • BUILD: "Implement authentication", "Set up database schema", "Build API endpoints"
  • TEST: "Write unit tests for auth", "Perform load testing", "Fix critical bugs"
  • GROW: "Setup analytics", "Launch publicly", "Implement growth tactics"

BLOCKER RESOLUTION:
- When a player addresses a blocker (especially boss blockers), acknowledge their progress
- Generate BLOCKER_RESOLVED event when conditions are met
- For boss blockers, make the resolution dramatic and rewarding

RESPONSE FORMAT (must be valid JSON):
{
  "segments": [
    {"type": "speech", "speaker": "ever", "content": "Great idea! Let's start with..."},
    {"type": "narration", "content": "The team huddles around the whiteboard..."},
    {"type": "speech", "speaker": "toxic", "content": "But what about..."}
  ],
  "gameEvents": [
    {"type": "XP_GAIN", "data": {"amount": 25, "reason": "Defined clear user persona"}},
    {"type": "TASK_COMPLETE", "data": {"taskId": "task-1"}},
    {"type": "TASK_ADDED", "data": {"description": "Research competitor apps", "xpReward": 30, "phase": "RESEARCH"}},
    {"type": "BLOCKER_RESOLVED", "data": {"blockerId": "blocker-id"}}
  ],
  "suggestedActions": [
    "Interview 5 potential users",
    "Create user survey",
    "Analyze competitor feedback",
    "Show my progress"
  ]
}

Make responses engaging, advance the story, and generate appropriate game events. Keep speeches concise (2-3 sentences max per character).`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { message, sessionId, selectedSpeakers = [], conversationMode = 'discussion', responseDepth = 'normal' } = await req.json();

    // Check collaborator access
    const { data: accessCheck } = await supabase
      .from('session_collaborators')
      .select('access_level')
      .eq('session_id', sessionId)
      .eq('player_id', user.id)
      .not('accepted_at', 'is', null)
      .single();

    if (!accessCheck) {
      return new Response(
        JSON.stringify({ error: 'Access denied to this session' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Viewers can't send messages
    if (accessCheck.access_level === 'viewer') {
      return new Response(
        JSON.stringify({ error: 'Viewers cannot send messages. Request edit access from the session owner.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log activity
    await supabase.from('collaboration_activity').insert({
      session_id: sessionId,
      player_id: user.id,
      activity_type: 'message_sent',
      activity_data: { message_preview: message.substring(0, 100) }
    });

    // Fetch game context
    const { data: session } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    const { data: gameState } = await supabase
      .from('game_states')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const { data: recentMessages } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(10);

    const contextMessages = (recentMessages || []).reverse();

    // Build AI context
    const activeBlockers = gameState?.blockers || [];
    const bossBlockersDefeated = gameState?.boss_blockers_defeated || [];
    
    const gameContext = `
CURRENT GAME STATE:
- Phase: ${gameState?.current_phase || 'INCEPTION'}
- Level: ${gameState?.level || 1} | XP: ${gameState?.xp || 0}
- Energy: ${gameState?.energy || 10}/10
- Code Health: ${gameState?.code_health || 100}/100
- Active Tasks: ${JSON.stringify(gameState?.current_tasks || [])}
- Active Blockers: ${JSON.stringify(activeBlockers)}
- Boss Blockers Defeated: ${bossBlockersDefeated.length}/3
- Team Mood: ${JSON.stringify(gameState?.team_mood || {})}

RECENT CONVERSATION:
${contextMessages.map(m => `${m.role}: ${m.content}`).join('\n')}
`;

    // Add selected speakers restriction if specified
    let systemPrompt = SYSTEM_PROMPT;
    if (selectedSpeakers.length > 0 && selectedSpeakers.length < 7) {
      const nameMap: { [key: string]: string } = {
        'ever': 'Ever Green',
        'prisma': 'Prisma',
        'toxic': 'Toxic',
        'phoenix': 'Phoenix',
        'techpriest': 'Tech Priest',
        'virgil': 'Virgil',
        'zen': 'Zen'
      };
      
      const speakerNames = selectedSpeakers
        .map((id: string) => nameMap[id])
        .filter(Boolean)
        .join(', ');
      
      systemPrompt += `\n\nCRITICAL INSTRUCTION - SPEAKER RESTRICTION:
ONLY these team members are available to respond: ${speakerNames}
DO NOT include responses from any other characters. They are not participating in this conversation.
If the user's question requires expertise from unavailable members, have the available members acknowledge this limitation.`;
    } else {
      systemPrompt += `\n\nSelect the most relevant 2-3 team members to respond based on the user's question (Auto mode).`;
    }

    // Add mode-specific instructions
    const modeInstructions = getModeInstructions(conversationMode);
    if (modeInstructions) {
      systemPrompt += '\n\n' + modeInstructions;
    }
    
    // Add response depth instructions
    const depthInstructions = getDepthInstructions(responseDepth);
    systemPrompt += '\n\n' + depthInstructions;

    // Call Lovable AI
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'system', content: gameContext },
          { role: 'user', content: message }
        ],
        response_format: { type: 'json_object' }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI error:', aiResponse.status, errorText);
      throw new Error(`AI request failed: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    let aiContent = aiData.choices[0].message.content;
    
    // Strip markdown code blocks if present
    aiContent = aiContent.trim();
    if (aiContent.startsWith('```')) {
      // Remove opening ```json or ```
      aiContent = aiContent.replace(/^```(?:json)?\s*\n/, '');
      // Remove closing ```
      aiContent = aiContent.replace(/\n```\s*$/, '');
    }
    
    // Sanitize control characters - replace actual newlines/tabs/etc in JSON strings
    // This handles cases where AI includes unescaped control chars
    let parsedResponse;
    try {
      // First attempt: parse as-is
      parsedResponse = JSON.parse(aiContent);
    } catch (firstError) {
      console.error('Initial JSON parse failed, attempting sanitization:', firstError);
      console.log('Raw content preview:', aiContent.substring(0, 500));
      
      // Replace problematic control characters within string values
      // This regex finds strings and replaces control chars inside them
      aiContent = aiContent.replace(
        /"((?:[^"\\]|\\.)*)"/g,
        (_match: string, content: string) => {
          return '"' + content
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/\t/g, '\\t')
            .replace(/[\x00-\x1F\x7F]/g, '') + '"';
        }
      );
      
      try {
        parsedResponse = JSON.parse(aiContent);
        console.log('JSON parse succeeded after sanitization');
      } catch (secondError) {
        console.error('JSON parse failed after sanitization:', secondError);
        console.log('Sanitized content preview:', aiContent.substring(0, 500));
        const errorMessage = secondError instanceof Error ? secondError.message : 'Unknown error';
        throw new Error(`Failed to parse AI response: ${errorMessage}`);
      }
    }

    // Check if AI finalized a prompt (only in prompt-prep mode)
    if (conversationMode === 'prompt-prep') {
      const promptData = parsedResponse.segments?.find((s: any) => s.type === 'FINALIZED_PROMPT');
      
      if (promptData) {
        const { data: savedPrompt } = await supabase
          .from('prompt_library')
          .insert({
            player_id: user.id,
            session_id: sessionId,
            title: promptData.title,
            description: promptData.description || '',
            category: promptData.category,
            phase: gameState?.current_phase,
            prompt_text: promptData.prompt_text,
            prompt_variables: promptData.variables || [],
            created_by_character: promptData.created_by || 'prisma',
            contributing_characters: promptData.contributors || ['prisma'],
            is_template: false,
          })
          .select()
          .single();
        
        if (savedPrompt) {
          parsedResponse.gameEvents.push({
            type: 'PROMPT_CREATED',
            data: {
              promptId: savedPrompt.id,
              title: savedPrompt.title,
              category: savedPrompt.category
            }
          });
          
          parsedResponse.segments.push({
            type: 'narration',
            content: `✅ Prompt "${savedPrompt.title}" saved to your library!`
          });
        }
      }
    }

    // Save user message
    await supabase.from('chat_messages').insert({
      session_id: sessionId,
      role: 'user',
      content: message,
      segments: [{ type: 'speech', content: message }],
      game_events: []
    });

    // Save AI response
    await supabase.from('chat_messages').insert({
      session_id: sessionId,
      role: 'assistant',
      content: JSON.stringify(parsedResponse.segments),
      segments: parsedResponse.segments,
      game_events: parsedResponse.gameEvents || []
    });

    // Check for boss blocker spawn
    const BOSS_BLOCKERS = [
      {
        id: 'research_block',
        name: 'The Research Block',
        description: 'A massive wall of uncertainty blocking your path to user insights',
        lore: 'This ancient barrier appears when founders fear talking to users. Only deep research can shatter it.',
        minLevel: 8,
        phase: 'RESEARCH',
        rewards: { xp: 200, spores: 50, artifact: 'deepresearch' }
      },
      {
        id: 'technical_debt_demon',
        name: 'The Technical Debt Demon',
        description: 'A monstrous accumulation of shortcuts and hacks threatening your codebase',
        lore: 'Born from rushed decisions and "temporary" solutions, this demon grows stronger with each compromise.',
        minLevel: 18,
        phase: 'BUILD',
        rewards: { xp: 400, spores: 100, artifact: 'product' }
      },
      {
        id: 'launch_anxiety_beast',
        name: 'The Launch Anxiety Beast',
        description: 'The paralyzing fear of putting your work out into the world',
        lore: 'Every creator faces this beast. It whispers doubts and amplifies fears. Only courage can banish it.',
        minLevel: 28,
        phase: 'SHIP',
        rewards: { xp: 600, spores: 150, artifact: 'marketing' }
      }
    ];

    const existingBlockers = gameState?.blockers || [];
    
    // Check if we should spawn a boss blocker
    for (const boss of BOSS_BLOCKERS) {
      const alreadyDefeated = bossBlockersDefeated.includes(boss.id);
      const alreadyActive = existingBlockers.some((b: any) => 
        b.type === 'boss' && b.bossData?.name === boss.name
      );
      
      if (!alreadyDefeated && !alreadyActive) {
        const meetsLevel = (gameState?.level || 1) >= boss.minLevel;
        const meetsPhase = gameState?.current_phase === boss.phase;
        
        if (meetsLevel && meetsPhase) {
          // Spawn boss blocker
          parsedResponse.gameEvents.push({
            type: 'BLOCKER_ADDED',
            data: {
              description: boss.description,
              severity: 'high',
              type: 'boss',
              bossData: {
                name: boss.name,
                lore: boss.lore,
                defeatReward: boss.rewards
              }
            }
          });
          
          // Add dramatic narration
          parsedResponse.segments.push({
            type: 'narration',
            content: `⚔️ A BOSS BLOCKER APPEARS! ${boss.name} blocks your path forward!`
          });
          
          break; // Only spawn one boss at a time
        }
      }
    }

    // Process game events and update state
    const updatedState = { ...gameState };
    let energyDelta = -1; // Cost 1 energy per turn
    
    for (const event of parsedResponse.gameEvents || []) {
      switch (event.type) {
        case 'XP_GAIN':
          updatedState.xp = (updatedState.xp || 0) + event.data.amount;
          const xpForLevel = updatedState.level * 100;
          if (updatedState.xp >= xpForLevel) {
            updatedState.level = (updatedState.level || 1) + 1;
            updatedState.xp -= xpForLevel;
            parsedResponse.gameEvents.push({
              type: 'LEVEL_UP',
              data: { newLevel: updatedState.level }
            });
          }
          break;
        
        case 'TASK_COMPLETE':
          const tasks = updatedState.current_tasks || [];
          const taskIndex = tasks.findIndex((t: any) => t.id === event.data.taskId);
          if (taskIndex >= 0) {
            const completedTask = tasks[taskIndex];
            updatedState.completed_tasks = [...(updatedState.completed_tasks || []), completedTask];
            updatedState.current_tasks = tasks.filter((_: any, i: number) => i !== taskIndex);
          }
          break;
        
        case 'TASK_ADDED':
          const newTask = {
            id: crypto.randomUUID(),
            description: event.data.description,
            xpReward: event.data.xpReward,
            phase: event.data.phase,
            completed: false
          };
          updatedState.current_tasks = [...(updatedState.current_tasks || []), newTask];
          break;

        case 'BLOCKER_ADDED':
          const newBlocker = {
            id: crypto.randomUUID(),
            description: event.data.description,
            severity: event.data.severity,
            type: event.data.type || 'normal',
            bossData: event.data.bossData,
            createdAt: new Date().toISOString()
          };
          updatedState.blockers = [...(updatedState.blockers || []), newBlocker];
          break;

        case 'BLOCKER_RESOLVED':
          const blockers = updatedState.blockers || [];
          const resolvedBlocker = blockers.find((b: any) => b.id === event.data.blockerId);
          
          if (resolvedBlocker) {
            // Remove from blockers
            updatedState.blockers = blockers.filter((b: any) => b.id !== event.data.blockerId);
            
            // If it's a boss blocker, award rewards and track defeat
            if (resolvedBlocker.type === 'boss' && resolvedBlocker.bossData) {
              const bossRewards = resolvedBlocker.bossData.defeatReward;
              updatedState.xp = (updatedState.xp || 0) + bossRewards.xp;
              updatedState.spores = (updatedState.spores || 0) + bossRewards.spores;
              
              // Find boss ID from boss list
              const bossId = BOSS_BLOCKERS.find(b => b.name === resolvedBlocker.bossData.name)?.id;
              if (bossId) {
                updatedState.boss_blockers_defeated = [
                  ...(updatedState.boss_blockers_defeated || []),
                  bossId
                ];
              }
              
              // Track in blocker_resolutions
              await supabase.from('blocker_resolutions').insert({
                player_id: user.id,
                session_id: sessionId,
                blocker_id: resolvedBlocker.id,
                blocker_type: 'boss',
                boss_name: resolvedBlocker.bossData.name,
                xp_rewarded: bossRewards.xp,
                spores_rewarded: bossRewards.spores
              });
              
              // Add celebration event
              parsedResponse.gameEvents.push({
                type: 'XP_GAIN',
                data: { amount: bossRewards.xp, reason: `Defeated ${resolvedBlocker.bossData.name}!` }
              });
              parsedResponse.gameEvents.push({
                type: 'SPORES_GAIN',
                data: { amount: bossRewards.spores }
              });

              // Check for artifact unlocks
              const artifactDefs = {
                deepresearch: { minLevel: 10, bossesNeeded: 1, phases: ['INCEPTION', 'RESEARCH'] },
                product: { minLevel: 20, bossesNeeded: 2, phases: ['INCEPTION', 'RESEARCH', 'DESIGN', 'BUILD'] },
                marketing: { minLevel: 30, bossesNeeded: 3, phases: ['INCEPTION', 'RESEARCH', 'DESIGN', 'BUILD', 'TEST', 'SHIP'] }
              };

              const phaseOrder: Record<string, number> = { INCEPTION: 0, RESEARCH: 1, DESIGN: 2, BUILD: 3, TEST: 4, SHIP: 5 };
              const currentPhaseIndex = phaseOrder[updatedState.current_phase as string] || 0;
              const bossesDefeated = updatedState.boss_blockers_defeated.length;
              const currentLevel = updatedState.level;

              for (const [artifactId, requirements] of Object.entries(artifactDefs)) {
                // Check if already unlocked
                const { data: existingArtifact } = await supabase
                  .from('player_artifacts')
                  .select('*')
                  .eq('player_id', user.id)
                  .eq('artifact_id', artifactId)
                  .maybeSingle();

                if (!existingArtifact) {
                  // Check requirements
                  const meetsLevel = currentLevel >= requirements.minLevel;
                  const meetsBosses = bossesDefeated >= requirements.bossesNeeded;
                  const requiredPhaseIndex = Math.max(...requirements.phases.map((p: string) => phaseOrder[p] || 0));
                  const meetsPhase = currentPhaseIndex >= requiredPhaseIndex;

                  if (meetsLevel && meetsBosses && meetsPhase) {
                    // Unlock artifact!
                    await supabase.from('player_artifacts').insert({
                      player_id: user.id,
                      artifact_id: artifactId
                    });

                    // Add unlock event
                    parsedResponse.gameEvents.push({
                      type: 'ARTIFACT_UNLOCKED',
                      data: { artifactId }
                    });

                    // Add dramatic narration
                    const artifactNames: Record<string, string> = {
                      deepresearch: 'The Deepresearch Codex',
                      product: 'The Lovable Lens',
                      marketing: 'The Viral Scroll'
                    };
                    parsedResponse.segments.push({
                      type: 'narration',
                      content: `✨ LEGENDARY ARTIFACT UNLOCKED: ${artifactNames[artifactId]}! A powerful new tool has been added to your arsenal!`
                    });
                  }
                }
              }
            }
          }
          break;

        case 'ENERGY_UPDATE':
          energyDelta += event.data.delta;
          break;

        case 'CODE_HEALTH_UPDATE':
          updatedState.code_health = Math.max(0, Math.min(100, 
            (updatedState.code_health || 100) + event.data.delta
          ));
          break;

        case 'PHASE_CHANGE':
          updatedState.current_phase = event.data.newPhase;
          await supabase.from('game_sessions').update({
            current_phase: event.data.newPhase
          }).eq('id', sessionId);
          break;
      }
    }

    updatedState.energy = Math.max(0, Math.min(10, (updatedState.energy || 10) + energyDelta));

    // Save updated game state
    await supabase.from('game_states').insert({
      session_id: sessionId,
      ...updatedState
    });

    return new Response(JSON.stringify({
      segments: parsedResponse.segments,
      gameEvents: parsedResponse.gameEvents,
      suggestedActions: parsedResponse.suggestedActions || [],
      updatedState
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Game turn error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
