import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.77.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Message {
  role: string;
  content: string;
}

interface CardFactors {
  factor_1_name: string;
  factor_2_name: string;
  factor_3_name: string;
  factor_4_name: string;
  factor_5_name: string;
}

const CARD_TYPE_FACTORS: Record<string, CardFactors> = {
  'AUTHENTICITY': {
    factor_1_name: 'Self-Awareness',
    factor_2_name: 'Alignment',
    factor_3_name: 'Growth Mindset',
    factor_4_name: 'Consistency',
    factor_5_name: 'Empathy'
  },
  'IDEA': {
    factor_1_name: 'Uniqueness',
    factor_2_name: 'Feasibility',
    factor_3_name: 'Impact',
    factor_4_name: 'Clarity',
    factor_5_name: 'Market Fit'
  },
  'INSIGHT': {
    factor_1_name: 'Depth',
    factor_2_name: 'Relevance',
    factor_3_name: 'Credibility',
    factor_4_name: 'Actionability',
    factor_5_name: 'Surprise Factor'
  },
  'DESIGN': {
    factor_1_name: 'Usability',
    factor_2_name: 'Aesthetics',
    factor_3_name: 'Accessibility',
    factor_4_name: 'Innovation',
    factor_5_name: 'Test Results'
  },
  'CODE': {
    factor_1_name: 'Code Quality',
    factor_2_name: 'Security',
    factor_3_name: 'Performance',
    factor_4_name: 'Test Coverage',
    factor_5_name: 'Innovation'
  },
  'GROWTH': {
    factor_1_name: 'Reach',
    factor_2_name: 'Conversion',
    factor_3_name: 'Retention',
    factor_4_name: 'Virality',
    factor_5_name: 'ROI'
  }
};

function determineCardType(level: number): string {
  if (level === 0) return 'AUTHENTICITY';
  const types = ['IDEA', 'INSIGHT', 'DESIGN', 'CODE', 'GROWTH'];
  return types[level - 1] || 'IDEA';
}

function calculateRarity(scores: number[]): string {
  const average = scores.reduce((a, b) => a + b, 0) / scores.length;
  if (average >= 9) return 'legendary';
  if (average >= 7.5) return 'epic';
  if (average >= 6) return 'rare';
  if (average >= 4) return 'uncommon';
  return 'common';
}

function getVisualTheme(rarity: string): string {
  const themes: Record<string, string> = {
    common: 'gray',
    uncommon: 'green',
    rare: 'cyan',
    epic: 'magenta',
    legendary: 'yellow'
  };
  return themes[rarity] || 'cyan';
}

function buildArtworkPrompt(card: any, cardType: string, rarity: string, character: string): string {
  // Card type symbols and concepts
  const cardTypeConcepts: Record<string, string> = {
    'AUTHENTICITY': 'a glowing mirror reflecting light',
    'IDEA': 'a luminous lightbulb with energy radiating',
    'INSIGHT': 'an eye opening with rays of understanding',
    'DESIGN': 'geometric shapes forming a perfect pattern',
    'CODE': 'flowing data streams forming architecture',
    'GROWTH': 'an ascending graph with dynamic energy'
  };

  // Rarity visual effects
  const rarityEffects: Record<string, string> = {
    'common': 'subtle gray glow, minimal particle effects, clean simple background',
    'uncommon': 'soft green shimmer, gentle light particles, gradient background',
    'rare': 'vibrant cyan energy waves, glowing particles, dimensional depth',
    'epic': 'intense magenta aura, swirling cosmic particles, rich layered background',
    'legendary': 'brilliant golden radiance, explosive light bursts, epic celestial background'
  };

  // Character accent colors (subtle influence)
  const characterAccents: Record<string, string> = {
    'ever': 'hints of forest green',
    'prisma': 'hints of rainbow spectrum',
    'toxic': 'hints of electric purple',
    'phoenix': 'hints of burning orange',
    'techpriest': 'hints of neon blue',
    'virgil': 'hints of deep indigo',
    'zen': 'hints of serene teal'
  };

  const concept = cardTypeConcepts[cardType] || 'abstract glowing symbol';
  const rarityEffect = rarityEffects[rarity] || rarityEffects['common'];
  const characterAccent = characterAccents[character] || 'neutral tones';

  return `Create an abstract, symbolic digital collectible card artwork featuring ${concept}.
Style: Modern, clean, appealing digital art with a unified "collectible card game" aesthetic.
Visual elements: ${rarityEffect}, ${characterAccent}
Mood: Metaphorical and symbolic, representing "${card.title}" concept without literal text.
Composition: Centered focal point, clean negative space, suitable for card artwork.
Aspect ratio: Portrait 3:4, suitable for collectible card display.
Quality: High detail, vibrant colors, professional game asset quality.`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
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
      throw new Error('Not authenticated');
    }

    const { sessionId, messages, currentLevel, currentPhase, trigger, selectedContent, eventType, eventContext, autoGenerated } = await req.json();

    const cardType = determineCardType(currentLevel);
    const factors = CARD_TYPE_FACTORS[cardType];

    // Build conversation context
    const recentMessages = messages.slice(-10);
    const conversationContext = recentMessages.map((m: Message) => `${m.role}: ${m.content}`).join('\n\n');

    // Call Lovable AI for card generation
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Build event-specific or general system prompt
    let systemPrompt = '';
    
    if (eventType && eventContext) {
      // Event-driven card generation with specific prompts
      const eventPrompts: Record<string, string> = {
        'STAGE_COMPLETE': `Create a card celebrating the completion of ${eventContext.stageLabel || 'this stage'} in ${currentPhase}. 
Capture the key achievement, learnings, and decisions made. Focus on what was accomplished and insights gained.`,
        
        'BOSS_BLOCKER_DEFEATED': `Create a card celebrating the defeat of "${eventContext.blockerName || 'the boss blocker'}". 
Capture the strategy used, the challenge overcome, and the significance of this victory.`,
        
        'ARTIFACT_UNLOCKED': `Create a card documenting the unlocking of the artifact "${eventContext.artifactName || 'new artifact'}". 
Explain what it represents, why it was earned, and its significance to the project journey.`,
        
        'PHASE_CHANGE': `Create a card marking the transition from ${eventContext.oldPhase || 'previous phase'} to ${eventContext.newPhase || currentPhase}. 
Summarize what was accomplished and what exciting possibilities lie ahead.`,
        
        'TASK_COMPLETED': `Create a card celebrating the completion of a significant task: "${eventContext.taskTitle || 'important task'}".
Capture what was achieved and why it matters to the project.`
      };
      
      systemPrompt = `You are an expert evaluator creating a collectible achievement card for a significant game event.

EVENT TYPE: ${eventType}
CARD TYPE: ${cardType}
CURRENT PHASE: ${currentPhase}

${eventPrompts[eventType] || `Create a card documenting this ${eventType} event.`}

RECENT CONVERSATION CONTEXT:
${conversationContext}

${selectedContent ? `SELECTED CONTENT:\n${selectedContent}\n` : ''}

Your task:
1. Extract the KEY INSIGHT/OUTPUT from this event that represents a ${cardType} card
2. Create a concise title (max 40 chars)
3. Write a description (max 150 chars)
4. Write the full content (max 500 chars) - this is the main card content
5. Score these 5 factors (1-10) with brief explanations:
   - ${factors.factor_1_name}: How well does this demonstrate ${factors.factor_1_name}?
   - ${factors.factor_2_name}: How well does this demonstrate ${factors.factor_2_name}?
   - ${factors.factor_3_name}: How well does this demonstrate ${factors.factor_3_name}?
   - ${factors.factor_4_name}: How well does this demonstrate ${factors.factor_4_name}?
   - ${factors.factor_5_name}: How well does this demonstrate ${factors.factor_5_name}?

SCORING GUIDELINES:
- 1-3: Poor/Weak - Minimal evidence or quality
- 4-6: Average/Decent - Acceptable but unremarkable
- 7-8: Good/Strong - Clear evidence of quality
- 9-10: Excellent/Exceptional - Outstanding demonstration

Identify which team character would have created this card based on the content:
- ever (Ever Green): Ideas, vision, brainstorming, big picture thinking
- prisma (Prisma): Planning, organization, structure, clarity
- toxic (Toxic): Bold choices, breaking conventions, high-risk ideas
- phoenix (Phoenix): Transformation, pivots, research, insights
- techpriest (Tech Priest): Technical implementation, code, architecture
- virgil (Virgil): Guidance, wisdom, deep analysis, strategy
- zen (Zen): User experience, design, simplicity, elegance

Return your analysis as a JSON object.`;
    } else {
      // Standard conversation-based card generation
      systemPrompt = `You are an expert evaluator analyzing a product development conversation to generate a collectible card.

CARD TYPE: ${cardType}
CURRENT PHASE: ${currentPhase}
CONVERSATION CONTEXT:
${conversationContext}

${selectedContent ? `SELECTED CONTENT:\n${selectedContent}\n` : ''}

Your task:
1. Extract the KEY INSIGHT/OUTPUT from this conversation that represents a ${cardType} card
2. Create a concise title (max 40 chars)
3. Write a description (max 150 chars)
4. Write the full content (max 500 chars) - this is the main card content
5. Score these 5 factors (1-10) with brief explanations:
   - ${factors.factor_1_name}: How well does this demonstrate ${factors.factor_1_name}?
   - ${factors.factor_2_name}: How well does this demonstrate ${factors.factor_2_name}?
   - ${factors.factor_3_name}: How well does this demonstrate ${factors.factor_3_name}?
   - ${factors.factor_4_name}: How well does this demonstrate ${factors.factor_4_name}?
   - ${factors.factor_5_name}: How well does this demonstrate ${factors.factor_5_name}?

SCORING GUIDELINES:
- 1-3: Poor/Weak - Minimal evidence or quality
- 4-6: Average/Decent - Acceptable but unremarkable
- 7-8: Good/Strong - Clear evidence of quality
- 9-10: Excellent/Exceptional - Outstanding demonstration

Identify which team character would have created this card based on the content:
- ever (Ever Green): Ideas, vision, brainstorming, big picture thinking
- prisma (Prisma): Planning, organization, structure, clarity
- toxic (Toxic): Bold choices, breaking conventions, high-risk ideas
- phoenix (Phoenix): Transformation, pivots, research, insights
- techpriest (Tech Priest): Technical implementation, code, architecture
- virgil (Virgil): Guidance, wisdom, deep analysis, strategy
- zen (Zen): User experience, design, simplicity, elegance

Return your analysis as a JSON object.`;
    }

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'Generate the card based on the conversation above.' }
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'generate_card',
            description: 'Generate a collectible card from conversation analysis',
            parameters: {
              type: 'object',
              properties: {
                title: { type: 'string', description: 'Card title (max 40 chars)' },
                description: { type: 'string', description: 'Brief description (max 150 chars)' },
                content: { type: 'string', description: 'Main card content (max 500 chars)' },
                created_by_character: { type: 'string', description: 'Character who created this card' },
                contributing_characters: { 
                  type: 'array', 
                  items: { type: 'string' },
                  description: 'Other characters who contributed'
                },
                tags: { 
                  type: 'array', 
                  items: { type: 'string' },
                  description: 'Relevant tags'
                },
                factor_1_score: { type: 'number', minimum: 1, maximum: 10 },
                factor_1_explanation: { type: 'string' },
                factor_2_score: { type: 'number', minimum: 1, maximum: 10 },
                factor_2_explanation: { type: 'string' },
                factor_3_score: { type: 'number', minimum: 1, maximum: 10 },
                factor_3_explanation: { type: 'string' },
                factor_4_score: { type: 'number', minimum: 1, maximum: 10 },
                factor_4_explanation: { type: 'string' },
                factor_5_score: { type: 'number', minimum: 1, maximum: 10 },
                factor_5_explanation: { type: 'string' }
              },
              required: ['title', 'content', 'created_by_character', 'factor_1_score', 'factor_2_score', 'factor_3_score', 'factor_4_score', 'factor_5_score']
            }
          }
        }],
        tool_choice: { type: 'function', function: { name: 'generate_card' } }
      }),
    });

    if (!aiResponse.ok) {
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    
    // Extract from tool call
    const toolCall = aiData.choices[0].message.tool_calls?.[0];
    if (!toolCall) {
      console.error('No tool call in response:', JSON.stringify(aiData));
      throw new Error('AI did not return card data');
    }

    const cardData = JSON.parse(toolCall.function.arguments);
    console.log('Parsed card data:', cardData);

    // Calculate rarity
    const scores = [
      cardData.factor_1_score,
      cardData.factor_2_score,
      cardData.factor_3_score,
      cardData.factor_4_score,
      cardData.factor_5_score
    ];
    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const rarity = calculateRarity(scores);

    // Insert card into database
    const { data: card, error: cardError } = await supabaseClient
      .from('dynamic_cards')
      .insert({
        player_id: user.id,
        session_id: sessionId,
        card_type: cardType,
        rarity: rarity,
        level: currentLevel,
        title: cardData.title,
        content: cardData.content,
        description: cardData.description || (cardData.content ? cardData.content.substring(0, 150) : 'Generated card'),
        created_by_character: cardData.created_by_character,
        contributing_characters: cardData.contributing_characters || [],
        tags: cardData.tags || [],
        visual_theme: getVisualTheme(rarity),
        average_score: averageScore,
        times_used: 0
      })
      .select()
      .single();

    if (cardError) {
      console.error('Card insert error:', cardError);
      throw cardError;
    }

    // Insert evaluation scores
    const { error: evalError } = await supabaseClient
      .from('card_evaluations')
      .insert({
        card_id: card.id,
        factor_1_name: factors.factor_1_name,
        factor_1_score: cardData.factor_1_score,
        factor_1_explanation: cardData.factor_1_explanation || '',
        factor_2_name: factors.factor_2_name,
        factor_2_score: cardData.factor_2_score,
        factor_2_explanation: cardData.factor_2_explanation || '',
        factor_3_name: factors.factor_3_name,
        factor_3_score: cardData.factor_3_score,
        factor_3_explanation: cardData.factor_3_explanation || '',
        factor_4_name: factors.factor_4_name,
        factor_4_score: cardData.factor_4_score,
        factor_4_explanation: cardData.factor_4_explanation || '',
        factor_5_name: factors.factor_5_name,
        factor_5_score: cardData.factor_5_score,
        factor_5_explanation: cardData.factor_5_explanation || ''
      });

    if (evalError) {
      console.error('Evaluation insert error:', evalError);
    }

    // Track generation event
    await supabaseClient
      .from('card_generation_events')
      .insert({
        player_id: user.id,
        session_id: sessionId,
        card_id: card.id,
        trigger_type: trigger || 'auto',
        conversation_context: JSON.stringify(recentMessages.slice(-3))
      });

    // Generate embedding asynchronously (fire and forget)
    supabaseClient.functions.invoke('generate-card-embedding', {
      body: { cardId: card.id, cardData: card }
    }).catch(err => console.error('Failed to generate embedding:', err));

    // Generate artwork using Google AI
    let artworkUrl = null;
    try {
      console.log('Generating artwork for card:', card.id);
      const artworkPrompt = buildArtworkPrompt(card, cardType, rarity, cardData.created_by_character);
      
      const googleApiKey = Deno.env.get('GOOGLE_API_KEY');
      if (!googleApiKey) {
        console.warn('GOOGLE_API_KEY not configured, skipping artwork generation');
      } else {
        const imageResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${googleApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: artworkPrompt }] }],
              generationConfig: { responseModalities: ['TEXT', 'IMAGE'] }
            })
          }
        );

        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          const imagePart = imageData.candidates?.[0]?.content?.parts?.find(
            (part: any) => part.inlineData?.mimeType?.startsWith('image/')
          );
          
          if (imagePart) {
            const base64Image = imagePart.inlineData.data;
            const mimeType = imagePart.inlineData.mimeType;
            artworkUrl = `data:${mimeType};base64,${base64Image}`;
            
            // Update card with artwork
            await supabaseClient
              .from('dynamic_cards')
              .update({ artwork_url: artworkUrl })
              .eq('id', card.id);
            
            console.log('Artwork generated and saved successfully');
          } else {
            console.warn('No image in Google AI response');
          }
        } else {
          console.error('Google AI image generation failed:', await imageResponse.text());
        }
      }
    } catch (artworkError) {
      console.error('Error generating artwork:', artworkError);
      // Don't fail the whole card generation if artwork fails
    }

    return new Response(
      JSON.stringify({
        success: true,
        card: { ...card, artwork_url: artworkUrl }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating card:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
