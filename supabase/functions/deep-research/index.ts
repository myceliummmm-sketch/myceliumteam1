import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId, researchFocus } = await req.json();
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('No authorization header');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (userError || !user) throw new Error('Not authenticated');

    // Get session context
    const { data: session } = await supabase
      .from('game_sessions')
      .select('*, game_states(*)')
      .eq('id', sessionId)
      .single();

    if (!session) throw new Error('Session not found');

    // Get VISION cards for context
    const { data: visionCards } = await supabase
      .from('dynamic_cards')
      .select('*')
      .eq('player_id', user.id)
      .eq('session_id', sessionId)
      .eq('card_type', 'IDEA')
      .order('created_at', { ascending: false })
      .limit(5);

    const visionContext = visionCards?.map(c => `${c.title}: ${c.content}`).join('\n') || 'No vision cards yet';
    
    // Research categories
    const categories = [
      'User Pain Points',
      'User Behavior',
      'Market Analysis',
      'Competitor Intel',
      'Opportunity Gaps'
    ];

    // Generate research findings using Lovable AI
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');

    const researchPrompt = `You are a product research analyst conducting deep discovery for a product.

PROJECT CONTEXT:
- Product Name: ${session.project_name || 'Untitled Project'}
- Product Description: ${session.project_description || 'No description'}
- Vision Context:
${visionContext}
${researchFocus ? `\n- Research Focus: ${researchFocus}` : ''}

Generate 6-8 research findings across these categories:
${categories.join(', ')}

For each finding, provide a JSON object with:
- title: Catchy research card title (max 8 words)
- content: The actual insight (2-3 sentences, concrete and actionable)
- research_category: Which category from the list above
- confidence_level: "low", "medium", or "high"
- source_context: Hypothetical source type (e.g., "User Interview", "Market Report", "Competitor Analysis")

Return ONLY a JSON array of 6-8 research findings. No other text.`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a research analyst. Always respond with valid JSON only.' },
          { role: 'user', content: researchPrompt }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API Error:', aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    let researchText = aiData.choices[0].message.content;
    
    // Strip markdown code blocks if present
    researchText = researchText.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim();
    
    // Parse JSON response
    let findings;
    try {
      findings = JSON.parse(researchText);
    } catch (e) {
      console.error('Failed to parse AI response:', researchText);
      throw new Error('Invalid JSON response from AI');
    }

    // Create RAW_RESEARCH cards
    const cards = [];
    for (const finding of findings) {
      // Generate artwork for each card
      const artworkPrompt = `Create a modern, abstract illustration representing this research finding: "${finding.title}". 
Style: Clean, professional, data-driven aesthetic with subtle geometric patterns. 
Color scheme: Cool blues and teals with white accents. 
Mood: Analytical, insightful, discovering hidden patterns.
No text, no people, just abstract visual metaphor.`;

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

      // Insert card into database
      const { data: card, error: cardError } = await supabase
        .from('dynamic_cards')
        .insert({
          player_id: user.id,
          session_id: sessionId,
          card_type: 'RAW_RESEARCH',
          level: session.game_states?.[0]?.level || 1,
          rarity: 'common',
          title: finding.title,
          content: finding.content,
          description: `Category: ${finding.research_category} | Confidence: ${finding.confidence_level}`,
          tags: [finding.research_category, finding.confidence_level, 'research', 'unscored'],
          visual_theme: 'cyan',
          artwork_url: artworkUrl,
          auto_generated: true,
          event_data: {
            research_category: finding.research_category,
            confidence_level: finding.confidence_level,
            source_context: finding.source_context,
            is_evaluated: false
          }
        })
        .select()
        .single();

      if (cardError) {
        console.error('Error creating card:', cardError);
        continue;
      }

      cards.push(card);
    }

    return new Response(
      JSON.stringify({
        success: true,
        cards: cards,
        message: `Generated ${cards.length} research findings`,
        xp_reward: 25 + (cards.length * 10)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Deep research error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
