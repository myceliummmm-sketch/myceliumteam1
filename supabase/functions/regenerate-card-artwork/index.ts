import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function buildArtworkPrompt(card: any, cardType: string, rarity: string, character: string): string {
  // Card type symbols and visual concepts
  const cardTypeConcepts: Record<string, { symbol: string; scene: string }> = {
    'AUTHENTICITY': { symbol: '🎭', scene: 'a glowing mirror with light reflecting truth and self-awareness' },
    'IDEA': { symbol: '💡', scene: 'a luminous lightbulb radiating creative energy and innovation' },
    'INSIGHT': { symbol: '🔍', scene: 'an opening eye with rays of understanding and clarity' },
    'DESIGN': { symbol: '🎨', scene: 'geometric shapes forming elegant patterns and visual harmony' },
    'CODE': { symbol: '💻', scene: 'flowing data streams forming digital architecture' },
    'GROWTH': { symbol: '🚀', scene: 'an ascending graph with explosive momentum and success' }
  };

  // Rarity-specific text styling and effects
  const rarityTextEffects: Record<string, string> = {
    'common': 'simple embossed text with subtle shadow',
    'uncommon': 'glowing green outline with soft shimmer',
    'rare': 'vibrant cyan glow with electric energy',
    'epic': 'intense magenta aura with swirling cosmic particles',
    'legendary': 'brilliant golden radiance with explosive light bursts'
  };

  // Rarity visual atmospheres
  const rarityAtmospheres: Record<string, string> = {
    'common': 'clean minimalist background, subtle gray tones',
    'uncommon': 'soft gradient background with gentle light particles, green accents',
    'rare': 'dynamic energy waves, dimensional depth, cyan particles',
    'epic': 'rich cosmic layers, swirling nebula effects, magenta intensity',
    'legendary': 'epic celestial panorama, explosive light rays, golden magnificence'
  };

  // Character color palettes
  const characterPalettes: Record<string, string> = {
    'tech-priest': 'neon blue with digital circuitry',
    'techpriest': 'neon blue with digital circuitry',
    'phoenix': 'burning orange with fiery transformation',
    'toxic': 'electric purple with rebellious edge',
    'prisma': 'rainbow spectrum with crystalline effects',
    'virgil': 'deep indigo with mystical wisdom',
    'zen': 'serene teal with minimalist calm',
    'advisor': 'professional silver with strategic precision',
    'ever': 'forest green and natural earth tones',
    'evergreen': 'forest green and natural earth tones'
  };

  const typeInfo = cardTypeConcepts[cardType] || { symbol: '✨', scene: 'abstract glowing energy' };
  const rarityTextStyle = rarityTextEffects[rarity.toLowerCase()] || rarityTextEffects['common'];
  const rarityAtmosphere = rarityAtmospheres[rarity.toLowerCase()] || rarityAtmospheres['common'];
  const characterPalette = characterPalettes[character] || 'balanced neutral tones';
  const powerScore = card.average_score?.toFixed(1) || '7.0';

  return `Create a premium collectible trading card artwork with EMBEDDED TEXT ELEMENTS:

⚠️ CRITICAL TEXT REQUIREMENTS:
1. CARD TITLE (MUST APPEAR): "${card.title}"
   - Position: Bottom third of card or stylized banner across middle
   - Style: Dramatic fantasy/sci-fi game font, ${rarityTextStyle}
   - Treatment: Integrated into artwork as if etched, carved, or glowing
   - Legibility: High contrast against background, readable at card size

2. POWER INDICATOR: ${powerScore}/10
   - Position: Top-right or bottom-right corner
   - Style: Circular emblem, energy orb, or ornate badge
   - Design: ${typeInfo.symbol} integrated into power display
   - Treatment: Glowing numeric readout with ${rarityTextStyle}

CENTRAL ARTWORK THEME:
- Core concept: ${typeInfo.scene}
- Visual symbol: ${typeInfo.symbol} prominently featured
- Atmosphere: ${rarityAtmosphere}
- Color palette: ${characterPalette} with ${rarity} rarity intensity

COMPOSITION RULES:
- Portrait orientation 3:4 aspect ratio
- Title text takes 15-20% of vertical space
- Central artwork 60-70% focal area
- Power badge visible but not distracting
- All text must be PART OF THE ARTWORK style (not UI overlay)

ARTISTIC STYLE:
- Genre: Modern fantasy/sci-fi collectible card game aesthetic
- Quality: Ultra high resolution, professional game asset
- Text integration: Make text feel like magical inscriptions, holographic displays, or carved runes
- Ensure readability while maintaining artistic cohesion

FORBIDDEN:
- Do NOT use plain text overlays
- Do NOT create UI-style buttons or frames
- Do NOT use realistic photos or clip art
- Text must blend naturally with the art style

The goal is a trading card where the title and power are beautifully integrated into the artwork itself, not separate UI elements.`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { card_id } = await req.json();

    if (!card_id) {
      return new Response(
        JSON.stringify({ error: "card_id is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the card data
    const { data: card, error: cardError } = await supabase
      .from("dynamic_cards")
      .select("*")
      .eq("id", card_id)
      .single();

    if (cardError || !card) {
      return new Response(
        JSON.stringify({ error: "Card not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build artwork prompt
    const artworkPrompt = buildArtworkPrompt(
      card,
      card.card_type,
      card.rarity,
      card.created_by_character || "advisor"
    );

    console.log("Generating artwork with prompt:", artworkPrompt);

    // Call Lovable AI Gateway to generate image
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.log("LOVABLE_API_KEY not found, cannot generate artwork");
      return new Response(
        JSON.stringify({ error: "Image generation not configured" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const imageResponse = await fetch(
      'https://ai.gateway.lovable.dev/v1/chat/completions',
      {
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
      }
    );

    if (!imageResponse.ok) {
      const errorText = await imageResponse.text();
      console.error("Lovable AI image generation error:", errorText);
      return new Response(
        JSON.stringify({ error: "Failed to generate artwork" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const imageData = await imageResponse.json();
    const artworkUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!artworkUrl) {
      console.error("No image URL in response");
      return new Response(
        JSON.stringify({ error: "No image generated" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update the card with the new artwork
    const { error: updateError } = await supabase
      .from("dynamic_cards")
      .update({ artwork_url: artworkUrl })
      .eq("id", card_id);

    if (updateError) {
      console.error("Error updating card:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update card" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, artwork_url: artworkUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in regenerate-card-artwork:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
