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

    const { query, limit = 10, minSimilarity = 0.6, filters = {} } = await req.json();

    if (!query || typeof query !== 'string') {
      throw new Error('Query is required');
    }

    // Generate embedding for search query
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    const embeddingResponse = await fetch('https://ai.gateway.lovable.dev/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: query
      })
    });

    if (!embeddingResponse.ok) {
      throw new Error('Failed to generate query embedding');
    }

    const embeddingData = await embeddingResponse.json();
    const queryEmbedding = embeddingData.data[0].embedding;

    // Build query with filters
    let queryBuilder = supabaseClient
      .from('dynamic_cards')
      .select('*')
      .eq('player_id', user.id)
      .eq('is_archived', false)
      .not('embedding', 'is', null);

    if (filters.cardType) {
      queryBuilder = queryBuilder.eq('card_type', filters.cardType);
    }

    if (filters.rarity) {
      queryBuilder = queryBuilder.eq('rarity', filters.rarity);
    }

    if (filters.level !== undefined) {
      queryBuilder = queryBuilder.eq('level', filters.level);
    }

    const { data: cards, error } = await queryBuilder;

    if (error) {
      throw error;
    }

    // Calculate similarity scores
    const results = cards
      .map(card => {
        if (!card.embedding) return null;
        
        const similarity = cosineSimilarity(queryEmbedding, card.embedding);
        return {
          ...card,
          similarity
        };
      })
      .filter(card => card !== null && card.similarity >= minSimilarity)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);

    // Log search for analytics
    await supabaseClient.from('card_search_history').insert({
      player_id: user.id,
      query,
      query_embedding: queryEmbedding,
      results_count: results.length,
      search_type: 'semantic',
      context: { filters }
    });

    return new Response(
      JSON.stringify({ results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in semantic-card-search:', error);
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
