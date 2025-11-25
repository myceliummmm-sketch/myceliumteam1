import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.77.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CardData {
  id: string;
  title: string;
  content: string;
  description: string | null;
  card_type: string;
  tags: string[] | null;
}

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

    const { cardId, cardData } = await req.json() as { cardId?: string, cardData?: CardData };

    let card: CardData;
    
    if (cardData) {
      card = cardData;
    } else if (cardId) {
      const { data, error } = await supabaseClient
        .from('dynamic_cards')
        .select('id, title, content, description, card_type, tags')
        .eq('id', cardId)
        .single();
      
      if (error || !data) {
        throw new Error('Card not found');
      }
      card = data;
    } else {
      throw new Error('Either cardId or cardData must be provided');
    }

    // Construct rich text for embedding
    const textForEmbedding = `
      ${card.title}
      ${card.description || ''}
      ${card.content}
      Type: ${card.card_type}
      Tags: ${(card.tags || []).join(', ')}
    `.trim();

    // Generate a simple text-based embedding using word frequency hashing
    // This is a fallback since Lovable AI doesn't support dedicated embedding models
    const words = textForEmbedding.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2);
    
    const wordFreq = new Map<string, number>();
    words.forEach(word => {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
    });
    
    // Create a simple 384-dimensional embedding based on word hashes
    const embedding = new Array(384).fill(0);
    words.forEach((word) => {
      const hash = word.split('').reduce((acc, char) => {
        return ((acc << 5) - acc) + char.charCodeAt(0);
      }, 0);
      const position = Math.abs(hash) % 384;
      embedding[position] += (wordFreq.get(word) || 0);
    });
    
    // Normalize the vector
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    if (magnitude > 0) {
      for (let i = 0; i < embedding.length; i++) {
        embedding[i] /= magnitude;
      }
    }

    // Update card with embedding
    const { error: updateError } = await supabaseClient
      .from('dynamic_cards')
      .update({ 
        embedding,
        last_embedding_update: new Date().toISOString(),
        embedding_model: 'text-hash-384'
      })
      .eq('id', card.id);

    if (updateError) {
      console.error('Update error:', updateError);
      throw updateError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        cardId: card.id,
        embeddingDimensions: embedding.length,
        method: 'text-based-hashing'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-card-embedding:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
