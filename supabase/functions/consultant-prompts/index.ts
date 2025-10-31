import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LANDING_PROMPT = `You are an expert product designer and marketing consultant helping founders create beautiful landing pages.

Generate a comprehensive, copy-paste ready prompt for Lovable (a web app builder) that will create a stunning, conversion-optimized landing page.

Your output should include:
1. A complete Lovable prompt (500-800 words) with:
   - Clear hierarchy and section structure
   - Visual direction (colors, typography, imagery style)
   - Messaging pillars and copy guidance
   - CTAs and conversion elements
   - Responsive design considerations

2. An outline of key sections (array of strings)

3. A checklist of must-have elements (array of strings)

4. 2-3 suggested next actions for refinement

Return JSON format:
{
  "prompt": "Create a landing page for...",
  "outline": ["Hero section", "Problem statement", ...],
  "checklist": ["Above-fold CTA", "Social proof", ...],
  "suggestedActions": ["Add testimonials section", "Refine value prop", ...]
}`;

const PITCH_PROMPT = `You are an experienced startup advisor helping founders create compelling pitch decks.

Generate a comprehensive, copy-paste ready prompt for Lovable (a web app builder) that will create a professional, investor-ready pitch deck.

Your output should include:
1. A complete Lovable prompt (500-800 words) with:
   - Slide-by-slide structure (Problem, Solution, Market, etc.)
   - Visual guidelines and data visualization suggestions
   - Speaker notes for each slide
   - Design direction (clean, bold, data-driven)

2. An outline of slides (array of strings)

3. A checklist of critical elements (array of strings)

4. 2-3 suggested next actions for refinement

Return JSON format:
{
  "prompt": "Create a pitch deck for...",
  "outline": ["Problem slide", "Solution slide", ...],
  "checklist": ["Clear ask amount", "TAM/SAM/SOM", ...],
  "suggestedActions": ["Add traction metrics", "Refine team slide", ...]
}`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { mode, answers } = await req.json();
    
    if (!mode || !answers) {
      throw new Error('Missing mode or answers');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const systemPrompt = mode === 'landing' ? LANDING_PROMPT : PITCH_PROMPT;
    const userPrompt = `Generate a Lovable-ready prompt based on these inputs:\n\n${JSON.stringify(answers, null, 2)}`;

    console.log('Calling Lovable AI for consultant mode:', mode);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your Lovable workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('AI gateway request failed');
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content in AI response');
    }

    // Parse the JSON response from the AI
    const result = JSON.parse(content);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in consultant-prompts:', error);
    return new Response(
      JSON.stringify({ error: (error as Error).message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
