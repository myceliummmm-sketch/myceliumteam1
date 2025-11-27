import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SCORING_FACTORS = [
  { name: 'Relevance', description: 'How aligned to product problem?' },
  { name: 'Credibility', description: 'How trustworthy?' },
  { name: 'Actionability', description: 'Can we act on this?' },
  { name: 'Impact', description: 'How game-changing?' },
  { name: 'Uniqueness', description: 'Novel or common knowledge?' }
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
    const { cardIds, sessionId } = await req.json();
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

    // Get session context
    const { data: session } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    // Get raw research cards
    console.log('Fetching cards with IDs:', cardIds);
    
    const { data: rawCards, error: fetchError } = await supabase
      .from('dynamic_cards')
      .select('id, title, content, description, card_type, tags, level, rarity, event_data, session_id, player_id')
      .in('id', cardIds);

    console.log('Fetched cards:', rawCards?.length || 0, 'Error:', fetchError);
    
    if (rawCards && rawCards.length > 0) {
      console.log('Card types found:', rawCards.map(c => c.card_type));
    }

    if (!rawCards || rawCards.length === 0) {
      throw new Error(`No cards found with provided IDs. Received ${cardIds.length} IDs.`);
    }
    
    // Filter for research cards
    const researchCards = rawCards.filter(card => 
      card.card_type === 'RAW_RESEARCH' || 
      card.card_type === 'RESEARCH_RAW' ||
      card.card_type?.includes('RESEARCH')
    );
    
    if (researchCards.length === 0) {
      throw new Error(`Found ${rawCards.length} cards but none are research cards. Types: ${rawCards.map(c => c.card_type).join(', ')}`);
    }
    
    console.log(`Processing ${researchCards.length} research cards in parallel`);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    // Process all cards in parallel for speed
    const insightCardsPromises = researchCards.map(async (rawCard) => {
      try {
        // Score each research finding
        const scoringPrompt = `Evaluate this research finding for a product startup:

PRODUCT: ${session.project_name || 'Untitled'}
DESCRIPTION: ${session.project_description || 'No description'}

FINDING:
Title: ${rawCard.title}
Content: ${rawCard.content}
Category: ${rawCard.event_data?.research_category || 'Unknown'}

Score 1-10 on these factors:
${SCORING_FACTORS.map((f, i) => `${i + 1}. ${f.name} - ${f.description}`).join('\n')}

Provide scores + 1-sentence explanation for each factor.
Return ONLY a JSON object with this structure:
{
  "scores": [
    {"factor": "Relevance", "score": 8, "explanation": "..."},
    {"factor": "Credibility", "score": 7, "explanation": "..."},
    {"factor": "Actionability", "score": 9, "explanation": "..."},
    {"factor": "Impact", "score": 6, "explanation": "..."},
    {"factor": "Uniqueness", "score": 8, "explanation": "..."}
  ]
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
              { role: 'system', content: 'You are a research evaluator. Always respond with valid JSON only.' },
              { role: 'user', content: scoringPrompt }
            ],
          }),
        });

        if (!aiResponse.ok) {
          console.error('AI API Error:', aiResponse.status);
          return null;
        }

        const aiData = await aiResponse.json();
        const scoreText = cleanJsonResponse(aiData.choices[0].message.content);
        
        let scoreData;
        try {
          scoreData = JSON.parse(scoreText);
        } catch (e) {
          console.error('Failed to parse scores:', scoreText);
          return null;
        }

        // Calculate average score and rarity
        const scores = scoreData.scores.map((s: any) => s.score);
        const averageScore = scores.reduce((sum: number, s: number) => sum + s, 0) / scores.length;
        
        let rarity = 'common';
        if (averageScore >= 9) rarity = 'legendary';
        else if (averageScore >= 8) rarity = 'epic';
        else if (averageScore >= 7) rarity = 'rare';
        else if (averageScore >= 6) rarity = 'uncommon';

        // Create RESEARCH_INSIGHT card WITHOUT artwork (for speed)
        const { data: insightCard, error: cardError } = await supabase
          .from('dynamic_cards')
          .insert({
            player_id: user.id,
            session_id: sessionId,
            card_type: 'RESEARCH_INSIGHT',
            level: rawCard.level,
            rarity: rarity,
            title: rawCard.title,
            content: rawCard.content,
            description: `Validated Research | Score: ${averageScore.toFixed(1)}/10`,
            tags: [...(rawCard.tags || []).filter((t: string) => t !== 'unscored'), 'evaluated', rarity],
            visual_theme: rarity === 'legendary' ? 'gold' : rarity === 'epic' ? 'purple' : rarity === 'rare' ? 'blue' : 'green',
            average_score: averageScore,
            artwork_url: null, // Skip artwork for speed
            auto_generated: true,
            event_data: {
              ...rawCard.event_data,
              is_evaluated: true,
              original_card_id: rawCard.id,
              evaluation_scores: scoreData.scores
            }
          })
          .select()
          .single();

        if (cardError) {
          console.error('Error creating insight card:', cardError);
          return null;
        }

        // Save evaluation to card_evaluations table
        await supabase
          .from('card_evaluations')
          .insert({
            card_id: insightCard.id,
            factor_1_name: scoreData.scores[0].factor,
            factor_1_score: scoreData.scores[0].score,
            factor_1_explanation: scoreData.scores[0].explanation,
            factor_2_name: scoreData.scores[1].factor,
            factor_2_score: scoreData.scores[1].score,
            factor_2_explanation: scoreData.scores[1].explanation,
            factor_3_name: scoreData.scores[2].factor,
            factor_3_score: scoreData.scores[2].score,
            factor_3_explanation: scoreData.scores[2].explanation,
            factor_4_name: scoreData.scores[3].factor,
            factor_4_score: scoreData.scores[3].score,
            factor_4_explanation: scoreData.scores[3].explanation,
            factor_5_name: scoreData.scores[4].factor,
            factor_5_score: scoreData.scores[4].score,
            factor_5_explanation: scoreData.scores[4].explanation,
          });

        return insightCard;
      } catch (error) {
        console.error('Error processing card:', error);
        return null;
      }
    });

    // Wait for all cards to process
    const insightCardsResults = await Promise.all(insightCardsPromises);
    const insightCards = insightCardsResults.filter(card => card !== null);

    console.log(`Successfully created ${insightCards.length} insight cards`);

    // Calculate XP rewards based on rarity
    const xpRewards = insightCards.reduce((sum, card) => {
      const xp = card.rarity === 'legendary' ? 50 : 
                 card.rarity === 'epic' ? 40 :
                 card.rarity === 'rare' ? 30 : 20;
      return sum + xp;
    }, 0);

    return new Response(
      JSON.stringify({
        success: true,
        insightCards: insightCards,
        message: `Evaluated ${insightCards.length} research insights`,
        xp_reward: xpRewards
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Score research error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
