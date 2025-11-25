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

    const { similarityThreshold = 0.85 } = await req.json();

    // Get all cards for player with embeddings
    const { data: cards, error } = await supabaseClient
      .from('dynamic_cards')
      .select('id, embedding, title, content')
      .eq('player_id', user.id)
      .eq('is_archived', false)
      .not('embedding', 'is', null);

    if (error) {
      throw error;
    }

    if (!cards || cards.length < 2) {
      return new Response(
        JSON.stringify({ duplicatesFound: 0, duplicates: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const duplicatePairs: Array<{
      card_id_1: string;
      card_id_2: string;
      similarity_score: number;
    }> = [];

    // Compare each pair
    for (let i = 0; i < cards.length; i++) {
      for (let j = i + 1; j < cards.length; j++) {
        if (!cards[i].embedding || !cards[j].embedding) continue;

        const similarity = cosineSimilarity(
          cards[i].embedding,
          cards[j].embedding
        );

        if (similarity >= similarityThreshold) {
          duplicatePairs.push({
            card_id_1: cards[i].id,
            card_id_2: cards[j].id,
            similarity_score: similarity
          });
        }
      }
    }

    // Store detected duplicates
    if (duplicatePairs.length > 0) {
      const { error: insertError } = await supabaseClient
        .from('card_duplicates')
        .upsert(duplicatePairs, {
          onConflict: 'card_id_1,card_id_2',
          ignoreDuplicates: false
        });

      if (insertError) {
        console.error('Error inserting duplicates:', insertError);
      }
    }

    return new Response(
      JSON.stringify({
        duplicatesFound: duplicatePairs.length,
        duplicates: duplicatePairs
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in detect-duplicate-cards:', error);
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
