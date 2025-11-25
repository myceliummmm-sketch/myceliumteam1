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

    // Generate embedding using Lovable AI
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    const embeddingResponse = await fetch('https://ai.gateway.lovable.dev/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: textForEmbedding
      })
    });

    if (!embeddingResponse.ok) {
      const errorText = await embeddingResponse.text();
      console.error('Embedding API error:', errorText);
      throw new Error('Failed to generate embedding');
    }

    const embeddingData = await embeddingResponse.json();
    const embedding = embeddingData.data[0].embedding;

    // Update card with embedding
    const { error: updateError } = await supabaseClient
      .from('dynamic_cards')
      .update({ 
        embedding,
        last_embedding_update: new Date().toISOString(),
        embedding_model: 'text-embedding-3-small'
      })
      .eq('id', card.id);

    if (updateError) {
      console.error('Update error:', updateError);
      throw updateError;
    }

    return new Response(
      JSON.stringify({ success: true, cardId: card.id }),
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
