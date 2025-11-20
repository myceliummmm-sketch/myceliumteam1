// Edge function for AI-powered card clustering

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Card {
  id: string;
  title: string;
  content: string;
  card_type: string;
  tags?: string[];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cards } = await req.json();

    if (!cards || !Array.isArray(cards)) {
      return new Response(
        JSON.stringify({ error: 'Cards array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (cards.length > 50) {
      return new Response(
        JSON.stringify({ error: 'Maximum 50 cards allowed for AI clustering' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (cards.length < 3) {
      return new Response(
        JSON.stringify({ error: 'Minimum 3 cards required for meaningful clustering' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Prepare card summaries for AI analysis
    const cardSummaries = cards.map((card: Card, idx: number) => 
      `[${idx}] ${card.title} (${card.card_type}): ${card.content.slice(0, 200)}${card.content.length > 200 ? '...' : ''}`
    ).join('\n\n');

    const systemPrompt = `You are an expert at analyzing and clustering related content.
Analyze the provided cards and identify 3-7 thematic groups that would be coherent and useful for generating a comprehensive project prompt.

For each group, provide:
1. A clear, descriptive title (2-4 words)
2. A brief description of why these cards belong together
3. The card indices that belong to this group (from the numbered list)
4. A coherence score (0.0-1.0) indicating how well the cards fit together

Focus on semantic similarity, shared themes, and logical progression.
Avoid creating groups with just 1 card unless absolutely necessary.
Prefer balanced groups (3-8 cards each) over having many small groups.`;

    const userPrompt = `Analyze these ${cards.length} cards and create thematic groups:\n\n${cardSummaries}\n\nProvide your analysis as a JSON array of groups.`;

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
        tools: [
          {
            type: 'function',
            function: {
              name: 'create_card_groups',
              description: 'Create thematic groups from analyzed cards',
              parameters: {
                type: 'object',
                properties: {
                  groups: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        title: { type: 'string' },
                        description: { type: 'string' },
                        cardIndices: { 
                          type: 'array',
                          items: { type: 'number' }
                        },
                        coherenceScore: { type: 'number' }
                      },
                      required: ['title', 'description', 'cardIndices', 'coherenceScore']
                    }
                  }
                },
                required: ['groups']
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'create_card_groups' } }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error('No tool call in AI response');
    }

    const groupsData = JSON.parse(toolCall.function.arguments);
    
    // Map indices back to actual cards
    const groups = groupsData.groups.map((group: any, idx: number) => ({
      id: `semantic-${idx}`,
      title: group.title,
      description: group.description,
      cards: group.cardIndices.map((i: number) => cards[i]).filter(Boolean),
      coherenceScore: group.coherenceScore,
      groupType: 'semantic',
      metadata: {
        tags: Array.from(new Set(
          group.cardIndices.flatMap((i: number) => cards[i]?.tags || [])
        ))
      }
    }));

    return new Response(
      JSON.stringify({ groups }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in cluster-cards-by-content:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
