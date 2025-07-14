import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TranslationRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
  contextType?: 'therapeutic' | 'ui' | 'crisis' | 'cultural' | 'general';
  culturalContext?: string;
  therapeuticContext?: any;
  userId?: string;
  sessionId?: string;
  preserveEmotionalContext?: boolean;
  communicationStyle?: 'formal' | 'informal' | 'balanced';
}

interface CulturalAdaptation {
  language_code: string;
  cultural_context: string;
  adaptation_rules: any;
  therapeutic_modifications: any;
  communication_style: any;
  emotional_expressions: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const {
      text,
      sourceLanguage,
      targetLanguage,
      contextType = 'general',
      culturalContext,
      therapeuticContext,
      userId,
      sessionId,
      preserveEmotionalContext = true,
      communicationStyle = 'balanced'
    }: TranslationRequest = await req.json();

    console.log(`Translation request: ${sourceLanguage} -> ${targetLanguage}, context: ${contextType}`);

    // Check for cached translation first
    const { data: cachedTranslation } = await supabase.rpc('get_cached_translation', {
      p_source_text: text,
      p_source_lang: sourceLanguage,
      p_target_lang: targetLanguage,
      p_context_type: contextType
    });

    if (cachedTranslation) {
      console.log('Returning cached translation');
      return new Response(JSON.stringify({
        translatedText: cachedTranslation,
        cached: true,
        quality: 0.95
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get cultural adaptations for target language
    const { data: culturalAdaptations } = await supabase
      .from('cultural_adaptations')
      .select('*')
      .eq('language_code', targetLanguage)
      .eq('is_active', true)
      .limit(1);

    const culturalData: CulturalAdaptation | null = culturalAdaptations?.[0] || null;

    // Build comprehensive system prompt for translation
    const systemPrompt = buildTranslationPrompt(
      contextType,
      sourceLanguage,
      targetLanguage,
      culturalData,
      therapeuticContext,
      preserveEmotionalContext,
      communicationStyle
    );

    console.log('Calling OpenAI for translation...');

    // Call OpenAI for translation
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Translate this text: "${text}"` }
        ],
        temperature: 0.3, // Lower temperature for consistent translations
        max_tokens: 1000,
        top_p: 0.9
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const translatedText = data.choices[0].message.content.trim();

    console.log('Translation completed, storing in cache...');

    // Store translation in cache
    const qualityScore = calculateQualityScore(text, translatedText, contextType);
    
    await supabase.rpc('store_translation', {
      p_source_text: text,
      p_translated_text: translatedText,
      p_source_lang: sourceLanguage,
      p_target_lang: targetLanguage,
      p_context_type: contextType,
      p_quality: qualityScore,
      p_cultural_context: culturalContext,
      p_therapeutic_context: therapeuticContext,
      p_user_id: userId,
      p_session_id: sessionId
    });

    // Update analytics
    await updateTranslationAnalytics(
      supabase,
      `${sourceLanguage}-${targetLanguage}`,
      contextType,
      qualityScore,
      data.usage?.total_tokens || 0
    );

    return new Response(JSON.stringify({
      translatedText,
      cached: false,
      quality: qualityScore,
      culturalAdaptations: culturalData ? Object.keys(culturalData.adaptation_rules || {}) : [],
      tokensUsed: data.usage?.total_tokens || 0
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Translation error:', error);
    return new Response(JSON.stringify({ 
      error: 'Translation failed', 
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function buildTranslationPrompt(
  contextType: string,
  sourceLanguage: string,
  targetLanguage: string,
  culturalData: CulturalAdaptation | null,
  therapeuticContext: any,
  preserveEmotionalContext: boolean,
  communicationStyle: string
): string {
  let prompt = `You are an expert multilingual translator specializing in ${contextType} content translation.

TRANSLATION REQUIREMENTS:
- Source Language: ${sourceLanguage}
- Target Language: ${targetLanguage}
- Context Type: ${contextType}
- Communication Style: ${communicationStyle}
- Preserve Emotional Context: ${preserveEmotionalContext ? 'YES' : 'NO'}

CORE PRINCIPLES:
1. Maintain the original meaning and intent
2. Adapt cultural references appropriately
3. Preserve emotional tone and therapeutic value
4. Use natural, fluent expressions in the target language
5. Consider regional dialects and cultural nuances

`;

  if (contextType === 'therapeutic') {
    prompt += `
THERAPEUTIC TRANSLATION GUIDELINES:
- Preserve all therapeutic concepts and techniques
- Maintain empathetic and supportive tone
- Adapt therapy approaches for cultural context
- Keep crisis language appropriately urgent
- Preserve metaphors with cultural equivalents
- Maintain professional therapeutic boundaries
`;
  }

  if (contextType === 'crisis') {
    prompt += `
CRISIS CONTENT GUIDELINES:
- Maintain urgency and supportive tone
- Adapt crisis resources for target culture
- Preserve all safety information accurately
- Use culturally appropriate comfort language
- Ensure clarity and immediate understanding
`;
  }

  if (culturalData) {
    prompt += `
CULTURAL ADAPTATION RULES for ${targetLanguage}:
`;
    
    if (culturalData.communication_style) {
      prompt += `- Communication Style: ${JSON.stringify(culturalData.communication_style)}\n`;
    }
    
    if (culturalData.emotional_expressions) {
      prompt += `- Emotional Expressions: ${JSON.stringify(culturalData.emotional_expressions)}\n`;
    }
    
    if (culturalData.therapeutic_modifications && contextType === 'therapeutic') {
      prompt += `- Therapeutic Modifications: ${JSON.stringify(culturalData.therapeutic_modifications)}\n`;
    }
  }

  if (therapeuticContext) {
    prompt += `
THERAPEUTIC CONTEXT:
- Session Type: ${therapeuticContext.sessionType || 'general'}
- User Emotional State: ${therapeuticContext.userMood || 'unknown'}
- Therapy Approach: ${therapeuticContext.therapyApproach || 'supportive'}
`;
  }

  prompt += `
COMMUNICATION STYLE ADAPTATION:
${communicationStyle === 'formal' ? '- Use formal language and respectful tone' : ''}
${communicationStyle === 'informal' ? '- Use casual, friendly language' : ''}
${communicationStyle === 'balanced' ? '- Use professional but warm tone' : ''}

OUTPUT FORMAT:
Provide ONLY the translated text. Do not include explanations, notes, or additional commentary.
`;

  return prompt;
}

function calculateQualityScore(
  originalText: string,
  translatedText: string,
  contextType: string
): number {
  // Basic quality scoring based on length ratio and context
  const lengthRatio = translatedText.length / originalText.length;
  let baseScore = 0.95;

  // Adjust based on length ratio (extreme ratios might indicate issues)
  if (lengthRatio < 0.5 || lengthRatio > 2.0) {
    baseScore -= 0.1;
  }

  // Context-specific adjustments
  if (contextType === 'therapeutic' || contextType === 'crisis') {
    // Higher standards for therapeutic content
    baseScore = Math.min(baseScore, 0.9);
  }

  return Math.max(0.7, Math.min(1.0, baseScore));
}

async function updateTranslationAnalytics(
  supabase: any,
  languagePair: string,
  contextType: string,
  qualityScore: number,
  tokensUsed: number
): Promise<void> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const estimatedCost = (tokensUsed / 1000) * 0.01; // Rough estimate

    await supabase
      .from('translation_analytics')
      .upsert({
        date: today,
        language_pair: languagePair,
        context_type: contextType,
        translation_count: 1,
        avg_quality_score: qualityScore,
        api_cost: estimatedCost,
        response_time_avg: 0 // Would need to measure this
      }, {
        onConflict: 'date,language_pair,context_type',
        ignoreDuplicates: false
      });
  } catch (error) {
    console.error('Failed to update analytics:', error);
  }
}