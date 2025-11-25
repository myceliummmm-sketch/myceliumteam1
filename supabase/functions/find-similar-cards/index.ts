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

    const { cardId, limit = 5, excludeSelf = true } = await req.json();

    if (!cardId) {
      throw new Error('cardId is required');
    }

    // Get the source card's embedding
    const { data: sourceCard, error: sourceError } = await supabaseClient
      .from('dynamic_cards')
      .select('embedding, player_id')
      .eq('id', cardId)
      .single();

    if (sourceError || !sourceCard) {
      throw new Error('Card not found');
    }

    if (!sourceCard.embedding) {
      throw new Error('Card has no embedding');
    }

    // Get all other cards with embeddings
    let queryBuilder = supabaseClient
      .from('dynamic_cards')
      .select('*')
      .eq('player_id', sourceCard.player_id)
      .eq('is_archived', false)
      .not('embedding', 'is', null);

    if (excludeSelf) {
      queryBuilder = queryBuilder.neq('id', cardId);
    }

    const { data: cards, error } = await queryBuilder;

    if (error) {
      throw error;
    }

    // Calculate similarity scores
    const similarCards = cards
      .map(card => {
        if (!card.embedding) return null;
        
        const similarity = cosineSimilarity(sourceCard.embedding, card.embedding);
        return {
          ...card,
          similarity
        };
      })
      .filter(card => card !== null)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);

    return new Response(
      JSON.stringify({ similarCards }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in find-similar-cards:', error);
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
