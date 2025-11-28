import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.77.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Retry helper with exponential backoff for rate limiting
async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3): Promise<Response> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const response = await fetch(url, options);
    
    if (response.ok) return response;
    
    if (response.status === 429 && attempt < maxRetries - 1) {
      const waitTime = Math.pow(2, attempt) * 1000;
      console.log(`Rate limited (attempt ${attempt + 1}/${maxRetries}), waiting ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      continue;
    }
    
    return response;
  }
  throw new Error('Max retries exceeded');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cardIds, groupMetadata, options = {} } = await req.json();
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error('Unauthorized');
    }

    const { data: cards, error: cardsError } = await supabaseClient
      .from('dynamic_cards')
      .select('*')
      .in('id', cardIds)
      .eq('player_id', user.id);

    if (cardsError) throw cardsError;
    if (!cards || cards.length === 0) {
      throw new Error('No cards found');
    }

    const sessionId = cards[0].session_id;
    let sessionData: any = null;
    if (sessionId) {
      const { data: session } = await supabaseClient
        .from('game_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();
      sessionData = session;
    }

    const cardsByPhase: Record<string, any[]> = {};
    cards.forEach(card => {
      const phase = `Level ${card.level}`;
      if (!cardsByPhase[phase]) cardsByPhase[phase] = [];
      cardsByPhase[phase].push({
        title: card.title,
        type: card.card_type,
        content: card.content
      });
    });

    const detailLevel = options.detailLevel || 'standard';
    const includeMetrics = options.includeMetrics !== false;
    const targetAudience = options.targetAudience || 'myself';
    
    const systemPrompt = `You are synthesizing a comprehensive Lovable project prompt from collected knowledge cards.

Cards represent insights from product development phases.
Create a clear, structured prompt that could be used to continue or document this project.

Detail level: ${detailLevel}
Target audience: ${targetAudience}
Include metrics: ${includeMetrics}

Format as Markdown with clear sections.`;

    const groupContext = groupMetadata?.groups ? `

Card Groups (selected by user):
${groupMetadata.groups.map((g: any) => `- ${g.title}: ${g.description} (${g.cardIds.length} cards)`).join('\n')}

Use these groups to organize sections.` : '';

    const userPrompt = `Generate a comprehensive Lovable project prompt from these ${cards.length} collected cards.

Project Context:
- Project: ${sessionData?.project_name || 'Untitled Project'}
- Description: ${sessionData?.project_description || 'No description'}
- Current Phase: ${sessionData?.current_phase || 'Unknown'}
${groupContext}

Cards by Phase:
${JSON.stringify(cardsByPhase, null, 2)}

Create sections for:
1. Project Overview & Vision
2. Problem Statement
3. User Research Insights
4. Design Decisions
5. Technical Architecture
6. Growth Strategy
7. Key Learnings
8. Next Steps

Be specific using actual card details.`;

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const aiResponse = await fetchWithRetry('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-pro-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const generatedPrompt = aiData.choices[0].message.content;
    const tokenCount = aiData.usage?.total_tokens || 0;

    await supabaseClient.from('prompt_generations').insert({
      player_id: user.id,
      session_id: sessionId,
      card_ids: cardIds,
      options,
      generated_prompt: generatedPrompt,
      token_count: tokenCount
    });

    return new Response(
      JSON.stringify({ generatedPrompt, tokenCount }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
