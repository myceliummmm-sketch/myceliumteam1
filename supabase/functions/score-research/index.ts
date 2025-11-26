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

    // Use service role key for database operations (JWT already validated by edge runtime)
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
    const { data: rawCards } = await supabase
      .from('dynamic_cards')
      .select('*')
      .in('id', cardIds)
      .eq('card_type', 'RAW_RESEARCH');

    if (!rawCards || rawCards.length === 0) {
      throw new Error('No raw research cards found');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    const insightCards = [];

    for (const rawCard of rawCards) {
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
        continue;
      }

      const aiData = await aiResponse.json();
      const scoreText = aiData.choices[0].message.content;
      
      let scoreData;
      try {
        scoreData = JSON.parse(scoreText);
      } catch (e) {
        console.error('Failed to parse scores:', scoreText);
        continue;
      }

      // Calculate average score and rarity
      const scores = scoreData.scores.map((s: any) => s.score);
      const averageScore = scores.reduce((sum: number, s: number) => sum + s, 0) / scores.length;
      
      let rarity = 'common';
      if (averageScore >= 9) rarity = 'legendary';
      else if (averageScore >= 8) rarity = 'epic';
      else if (averageScore >= 7) rarity = 'rare';
      else if (averageScore >= 6) rarity = 'uncommon';

      // Generate premium artwork for scored insight
      const artworkPrompt = `Create a premium, high-quality illustration for this scored research insight: "${rawCard.title}".
This insight scored ${averageScore.toFixed(1)}/10 - emphasize its ${rarity} quality.
Style: Bold, confident, data-driven with vibrant colors. Professional yet exciting.
Color scheme: Based on score - ${rarity === 'legendary' ? 'gold and amber' : rarity === 'epic' ? 'purple and violet' : rarity === 'rare' ? 'blue and cyan' : 'green and teal'}.
Mood: Discovery, breakthrough, validated insight. Show patterns emerging from data.
No text, abstract metaphor only.`;

      let artworkUrl = null;
      try {
        const imageResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash-image',
            messages: [{ role: 'user', content: artworkPrompt }],
            modalities: ['image', 'text']
          })
        });

        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          artworkUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url || null;
        }
      } catch (error) {
        console.error('Error generating artwork:', error);
      }

      // Create RESEARCH_INSIGHT card
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
          artwork_url: artworkUrl,
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
        continue;
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

      insightCards.push(insightCard);
    }

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
        insights: insightCards,
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
