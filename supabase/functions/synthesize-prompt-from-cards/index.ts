import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.77.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cardIds, options = {} } = await req.json();
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get user ID from JWT
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error('Unauthorized');
    }

    // Fetch selected cards
    const { data: cards, error: cardsError } = await supabaseClient
      .from('dynamic_cards')
      .select('*')
      .in('id', cardIds)
      .eq('player_id', user.id);

    if (cardsError) throw cardsError;
    if (!cards || cards.length === 0) {
      throw new Error('No cards found');
    }

    // Get session info for context
    const sessionId = cards[0].session_id;
    let projectContext = '';
    if (sessionId) {
      const { data: session } = await supabaseClient
        .from('game_sessions')
        .select('project_name, project_description')
        .eq('id', sessionId)
        .single();
      
      if (session) {
        projectContext = `Project: ${session.project_name}\n${session.project_description || ''}`;
      }
    }

    // Group cards by type and phase
    const cardsByPhase: Record<string, any[]> = {};
    const cardsByType: Record<string, any[]> = {};
    
    cards.forEach(card => {
      // By phase
      const phase = card.phase || 'GENERAL';
      if (!cardsByPhase[phase]) cardsByPhase[phase] = [];
      cardsByPhase[phase].push(card);
      
      // By type
      const type = card.card_type;
      if (!cardsByType[type]) cardsByType[type] = [];
      cardsByType[type].push(card);
    });

    // Build AI prompt
    const detailLevel = options.detailLevel || 'standard';
    const includeMetrics = options.includeMetrics !== false;
    const targetAudience = options.targetAudience || 'myself';
    
    const systemPrompt = `You are synthesizing a comprehensive Lovable project prompt from collected knowledge cards.

Cards represent insights from product development phases: VISION, RESEARCH, PROTOTYPE, BUILD, GROW.
Each card contains key decisions, learnings, and context.

Create a clear, structured prompt that could be used to:
- Continue this project
- Start a similar project
- Onboard a new developer
- Document project knowledge

Detail level: ${detailLevel}
Target audience: ${targetAudience}
Include metrics: ${includeMetrics}

Format as Markdown with clear sections. Be specific and actionable, not generic.`;

    const userPrompt = `${projectContext ? projectContext + '\n\n' : ''}Synthesize these ${cards.length} cards into a comprehensive Lovable prompt:

${cards.map((card, i) => `
Card ${i + 1}: ${card.title}
Type: ${card.card_type}
Phase: ${card.phase || 'N/A'}
Content: ${card.content}
${card.description ? `Description: ${card.description}` : ''}
${includeMetrics && card.average_score ? `Score: ${card.average_score}/10` : ''}
${card.tags && card.tags.length > 0 ? `Tags: ${card.tags.join(', ')}` : ''}
`).join('\n---\n')}

Create sections for:
1. Project Overview & Vision
2. Problem Statement
3. Key Insights & Research
4. Design Decisions
5. Technical Implementation
6. Growth Strategy (if applicable)
7. Key Learnings & Best Practices
8. Next Steps

Be specific and reference actual card content, not generic text.`;

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('Lovable AI error:', aiResponse.status, errorText);
      throw new Error(`AI generation failed: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const generatedPrompt = aiData.choices[0].message.content;

    // Save to database
    const { error: insertError } = await supabaseClient
      .from('prompt_generations')
      .insert({
        player_id: user.id,
        session_id: sessionId,
        card_ids: cardIds,
        options,
        generated_prompt: generatedPrompt,
        token_count: aiData.usage?.total_tokens || null,
      });

    if (insertError) {
      console.error('Error saving prompt generation:', insertError);
      // Don't fail the request if save fails
    }

    return new Response(
      JSON.stringify({ 
        prompt: generatedPrompt,
        cardCount: cards.length,
        tokenCount: aiData.usage?.total_tokens || null,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in synthesize-prompt-from-cards:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
