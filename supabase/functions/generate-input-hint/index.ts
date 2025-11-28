import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Build concise AI prompt
    const blockersText = context.blockers?.length > 0 
      ? `BLOCKER: ${context.blockers[0].description}` 
      : '';
    
    const systemPrompt = `You generate ultra-short input hints (30-60 chars) for a product dev game.
User is in ${context.currentPhase}, ${context.currentStage?.label || 'unknown stage'}.
Energy: ${context.energy}/10. Progress: ${context.stageProgress}%.
${blockersText}
Recent actions: ${context.recentActions?.join(', ') || 'None yet'}
Tasks: ${context.questLog?.join(', ') || 'None'}

Generate ONE action hint. Examples:
- "Define your target user..."
- "Sketch the core feature..."
- "Fix: Choose tech stack..."
- "Take a break - energy low..."

Return ONLY the hint. Max 60 chars. No quotes.`;

    const userPrompt = `Last message: "${context.lastMessage}"

What should they do next?`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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
        max_tokens: 30,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      
      // Fallback hints based on context
      let fallbackHint = "What's your next move?";
      if (context.blockers?.length > 0) {
        fallbackHint = `Fix: ${context.blockers[0].description.slice(0, 40)}...`;
      } else if (context.energy < 3) {
        fallbackHint = "Take a break - energy low...";
      } else if (context.currentStage?.actions?.[0]) {
        fallbackHint = context.currentStage.actions[0].slice(0, 60) + '...';
      }
      
      return new Response(JSON.stringify({ hint: fallbackHint }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiData = await response.json();
    let hint = aiData.choices[0].message.content.trim();
    
    // Clean up hint
    hint = hint.replace(/^["']|["']$/g, ''); // Remove quotes
    if (hint.length > 60) {
      hint = hint.slice(0, 57) + '...';
    }
    
    // Ensure it ends with ... for continuity feel
    if (!hint.endsWith('...') && !hint.endsWith('?')) {
      hint += '...';
    }

    console.log('Generated hint:', hint);

    return new Response(JSON.stringify({ hint }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating hint:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage, hint: "What's your next move?" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
