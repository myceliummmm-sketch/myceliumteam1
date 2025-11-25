import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function buildArtworkPrompt(card: any, cardType: string, rarity: string, character: string): string {
  const rarityStyles = {
    common: "simple, clean illustration",
    uncommon: "detailed illustration with subtle effects",
    rare: "vibrant, detailed artwork with special effects",
    epic: "dramatic, highly detailed artwork with dynamic lighting",
    legendary: "masterpiece quality, cinematic composition, stunning details"
  };

  const characterThemes = {
    "tech-priest": "cyberpunk, neon, digital circuits",
    "phoenix": "flames, rebirth, rising energy",
    "toxic": "edgy, punk rock, rebellious",
    "prisma": "geometric, crystalline, prisms",
    "virgil": "classic, wise, philosophical",
    "zen": "minimalist, calm, meditative",
    "advisor": "professional, strategic, modern",
    "evergreen": "nature, growth, sustainable"
  };

  const style = rarityStyles[rarity.toLowerCase() as keyof typeof rarityStyles] || rarityStyles.common;
  const theme = characterThemes[character as keyof typeof characterThemes] || "modern tech";

  return `Create a trading card artwork in ${style} style. Theme: ${theme}. 
Card represents: ${card.title}. 
Content context: ${card.content.substring(0, 200)}...
Art style: ${theme}, ${rarity} rarity level
Format: Vertical portrait orientation, suitable for a collectible card game
Quality: Ultra high resolution, professional game card artwork`;
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
          model: 'google/gemini-2.5-flash-image-preview',
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
