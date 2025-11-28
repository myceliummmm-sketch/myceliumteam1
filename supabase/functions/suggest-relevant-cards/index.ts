import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.77.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    const { 
      currentPhase, 
      currentLevel,
      recentMessages = [],
      limit = 5 
    } = await req.json();

    // Build context from current work
    const contextText = `
      Phase: ${currentPhase || 'unknown'}
      Level: ${currentLevel || 0}
      Recent Activity: ${recentMessages.slice(-5).map((m: any) => m.content).join(' ')}
    `.trim();

    // Generate embedding for context
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    const embeddingResponse = await fetch('https://ai.gateway.lovable.dev/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: contextText
      })
    });

    if (!embeddingResponse.ok) {
      throw new Error('Failed to generate context embedding');
    }

    const embeddingData = await embeddingResponse.json();
    const contextEmbedding = embeddingData.data[0].embedding;

    // Get all cards with embeddings
    const { data: cards, error } = await supabaseClient
      .from('dynamic_cards')
      .select('id, title, content, description, card_type, rarity, level, artwork_url, session_id, player_id, times_used, is_tradable, is_archived, created_by_character, tags, visual_theme, embedding')
      .eq('player_id', user.id)
      .eq('is_archived', false)
      .not('embedding', 'is', null);

    if (error) {
      throw error;
    }

    if (!cards || cards.length === 0) {
      return new Response(
        JSON.stringify({ suggestedCards: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate relevance scores
    const suggestedCards = cards
      .map(card => {
        if (!card.embedding) return null;
        
        const relevanceScore = cosineSimilarity(contextEmbedding, card.embedding);
        return {
          ...card,
          relevance_score: relevanceScore
        };
      })
      .filter((card): card is NonNullable<typeof card> => card !== null && card.relevance_score >= 0.6)
      .sort((a, b) => {
        // Sort by relevance first, then prefer underutilized cards
        if (Math.abs(b.relevance_score - a.relevance_score) > 0.05) {
          return b.relevance_score - a.relevance_score;
        }
        return (a.times_used || 0) - (b.times_used || 0);
      })
      .slice(0, limit);

    return new Response(
      JSON.stringify({ suggestedCards }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in suggest-relevant-cards:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}
