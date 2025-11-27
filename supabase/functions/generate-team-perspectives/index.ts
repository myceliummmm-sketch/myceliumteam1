import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TEAM_MEMBERS = [
  {
    id: 'prisma',
    name: 'Prisma',
    role: 'Product Strategy',
    focus: 'How do these insights shape our product direction and roadmap?',
    color: 'purple'
  },
  {
    id: 'ever',
    name: 'Ever Green',
    role: 'Market Validation',
    focus: 'What do these insights tell us about market fit and business viability?',
    color: 'green'
  },
  {
    id: 'phoenix',
    name: 'Phoenix',
    role: 'Growth Opportunities',
    focus: 'Where are the biggest growth and scaling opportunities in these insights?',
    color: 'orange'
  },
  {
    id: 'toxic',
    name: 'Toxic',
    role: 'Risk Assessment',
    focus: 'What are the risks, challenges, and potential pitfalls we need to address?',
    color: 'red'
  }
];

// Clean markdown code blocks from AI response
const cleanJsonResponse = (text: string): string => {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }
  return cleaned.trim();
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { insightCardIds, sessionId } = await req.json();
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('No authorization header');
    
    // Extract JWT token
    const token = authHeader.replace('Bearer ', '');
    
    // Use service role key for database operations
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user from JWT token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      console.error('Auth error:', userError);
      throw new Error('Not authenticated');
    }

    // Get session and insight cards
    const { data: session } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    const { data: insightCards } = await supabase
      .from('dynamic_cards')
      .select('id, title, content, description, card_type, level, rarity, average_score, event_data, session_id')
      .in('id', insightCardIds)
      .eq('card_type', 'RESEARCH_INSIGHT');

    if (!insightCards || insightCards.length === 0) {
      throw new Error('No research insights found');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    // Prepare insights summary
    const insightsSummary = insightCards.map(card => 
      `• ${card.title} (Score: ${card.average_score?.toFixed(1)}/10)\n  ${card.content}`
    ).join('\n\n');

    console.log(`Generating ${TEAM_MEMBERS.length} team perspectives in parallel`);

    // Process all team members in parallel for speed
    const perspectivePromises = TEAM_MEMBERS.map(async (member) => {
      try {
        // Generate perspective for this team member
        const perspectivePrompt = `You are ${member.name}, the team's ${member.role} expert.

PROJECT: ${session.project_name || 'Untitled'}
DESCRIPTION: ${session.project_description || 'No description'}

RESEARCH INSIGHTS:
${insightsSummary}

${member.focus}

Provide your perspective as ${member.name} with:
1. Your key takeaway (1 sentence)
2. Your main recommendation (2-3 sentences, actionable)
3. One specific concern or opportunity (1 sentence)

Return ONLY a JSON object:
{
  "title": "Your perspective title (max 8 words)",
  "takeaway": "Key takeaway sentence",
  "recommendation": "Your main recommendation",
  "concern_or_opportunity": "Specific point to watch"
}`;

        const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              { role: 'system', content: `You are ${member.name}, speaking from your expertise in ${member.role}. Always respond with valid JSON only.` },
              { role: 'user', content: perspectivePrompt }
            ],
          }),
        });

        if (!aiResponse.ok) {
          console.error('AI API Error for', member.name, ':', aiResponse.status);
          return null;
        }

        const aiData = await aiResponse.json();
        const perspectiveText = cleanJsonResponse(aiData.choices[0].message.content);
        
        let perspectiveData;
        try {
          perspectiveData = JSON.parse(perspectiveText);
        } catch (e) {
          console.error('Failed to parse perspective for', member.name, ':', perspectiveText);
          return null;
        }

        // Format full content
        const fullContent = `${perspectiveData.takeaway}\n\n${perspectiveData.recommendation}\n\n💡 ${perspectiveData.concern_or_opportunity}`;

        // Score the perspective (simplified scoring)
        const perspectiveScore = 7 + Math.random() * 2; // 7-9 range for team perspectives
        const rarity = perspectiveScore >= 8.5 ? 'epic' : perspectiveScore >= 8 ? 'rare' : 'uncommon';

        // Create TEAM_PERSPECTIVE card WITHOUT artwork (for speed)
        const { data: perspectiveCard, error: cardError } = await supabase
          .from('dynamic_cards')
          .insert({
            player_id: user.id,
            session_id: sessionId,
            card_type: 'TEAM_PERSPECTIVE',
            level: insightCards[0].level,
            rarity: rarity,
            title: perspectiveData.title,
            content: fullContent,
            description: `${member.role} Perspective by ${member.name}`,
            created_by_character: member.id,
            tags: ['team_perspective', member.role.toLowerCase().replace(' ', '_'), 'research'],
            visual_theme: member.color,
            average_score: perspectiveScore,
            artwork_url: null, // Skip artwork for speed
            auto_generated: true,
            event_data: {
              team_member: member.id,
              team_member_name: member.name,
              role: member.role,
              insight_card_ids: insightCardIds,
              takeaway: perspectiveData.takeaway,
              recommendation: perspectiveData.recommendation,
              concern_or_opportunity: perspectiveData.concern_or_opportunity
            }
          })
          .select()
          .single();

        if (cardError) {
          console.error('Error creating perspective card:', cardError);
          return null;
        }

        return perspectiveCard;
      } catch (error) {
        console.error('Error generating perspective for', member.name, ':', error);
        return null;
      }
    });

    // Wait for all perspectives to complete
    const perspectiveResults = await Promise.all(perspectivePromises);
    const perspectiveCards = perspectiveResults.filter(card => card !== null);

    console.log(`Successfully created ${perspectiveCards.length} perspective cards`);

    // Calculate XP rewards (30 XP per perspective)
    const xpReward = perspectiveCards.length * 30;

    return new Response(
      JSON.stringify({
        success: true,
        perspectiveCards: perspectiveCards,
        message: `Generated ${perspectiveCards.length} team perspective cards`,
        xp_reward: xpReward
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Generate team perspectives error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
