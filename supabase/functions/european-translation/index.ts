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
  contextType?: string;
  therapeuticCategory?: string;
  culturalAdaptations?: Record<string, any>;
  userId?: string;
  sessionId?: string;
}

interface TranslationResponse {
  translatedText: string;
  provider: string;
  qualityScore: number;
  responseTime: number;
  culturalAdaptations?: Record<string, any>;
  cached?: boolean;
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

async function getCachedTranslation(
  text: string,
  sourceLanguage: string,
  targetLanguage: string,
  contextType: string
): Promise<string | null> {
  try {
    const { data } = await supabase
      .from('european_translation_memory')
      .select('translated_text')
      .eq('source_text', text)
      .eq('source_language', sourceLanguage)
      .eq('target_language', targetLanguage)
      .eq('context_type', contextType)
      .maybeSingle();

    if (data) {
      // Update usage count
      await supabase
        .from('european_translation_memory')
        .update({ 
          usage_count: supabase.rpc('increment', { x: 1 }),
          last_used_at: new Date().toISOString()
        })
        .eq('source_text', text)
        .eq('source_language', sourceLanguage)
        .eq('target_language', targetLanguage)
        .eq('context_type', contextType);

      return data.translated_text;
    }
  } catch (error) {
    console.error('Cache lookup error:', error);
  }
  return null;
}

async function getCulturalContext(targetLanguage: string): Promise<any> {
  try {
    const { data } = await supabase
      .from('european_cultural_contexts')
      .select('*')
      .eq('language_code', targetLanguage)
      .maybeSingle();
    
    return data || {};
  } catch (error) {
    console.error('Cultural context error:', error);
    return {};
  }
}

async function translateWithClaude(
  text: string,
  sourceLanguage: string,
  targetLanguage: string,
  culturalContext: any,
  therapeuticCategory?: string
): Promise<{ text: string; qualityScore: number; responseTime: number }> {
  const startTime = Date.now();
  
  const systemPrompt = `You are a professional therapeutic translator specialized in mental health content. 

Cultural Context for ${targetLanguage}:
- Communication Style: ${culturalContext.communication_style || 'direct'}
- Mental Health Stigma Level: ${culturalContext.mental_health_stigma_level || 'medium'}
- Privacy Expectations: ${culturalContext.privacy_expectations || 'high'}
- Family Structure Importance: ${culturalContext.family_structure_importance || 'medium'}
- Therapy Preferences: ${JSON.stringify(culturalContext.therapy_preferences || {})}

Guidelines:
1. Translate accurately while preserving therapeutic meaning
2. Adapt language to cultural communication style
3. Use culturally appropriate terminology for mental health concepts
4. Maintain professional therapeutic tone
5. Consider cultural sensitivities around mental health
6. Preserve emotional nuance and therapeutic intent

${therapeuticCategory ? `Therapeutic Category: ${therapeuticCategory}` : ''}

Translate from ${sourceLanguage} to ${targetLanguage}. Return ONLY the translated text.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        temperature: 0.1,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: text
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    const translatedText = data.content[0].text.trim();
    const responseTime = Date.now() - startTime;

    return {
      text: translatedText,
      qualityScore: 0.95,
      responseTime
    };
  } catch (error) {
    console.error('Claude translation error:', error);
    throw error;
  }
}

async function translateWithOpenAI(
  text: string,
  sourceLanguage: string,
  targetLanguage: string,
  culturalContext: any,
  therapeuticCategory?: string
): Promise<{ text: string; qualityScore: number; responseTime: number }> {
  const startTime = Date.now();
  
  const systemPrompt = `You are a professional therapeutic translator specialized in mental health content.

Cultural Context for ${targetLanguage}:
- Communication Style: ${culturalContext.communication_style || 'direct'}
- Mental Health Stigma Level: ${culturalContext.mental_health_stigma_level || 'medium'}
- Privacy Expectations: ${culturalContext.privacy_expectations || 'high'}
- Family Structure Importance: ${culturalContext.family_structure_importance || 'medium'}
- Therapy Preferences: ${JSON.stringify(culturalContext.therapy_preferences || {})}

Guidelines:
1. Translate accurately while preserving therapeutic meaning
2. Adapt language to cultural communication style
3. Use culturally appropriate terminology for mental health concepts
4. Maintain professional therapeutic tone
5. Consider cultural sensitivities around mental health
6. Preserve emotional nuance and therapeutic intent

${therapeuticCategory ? `Therapeutic Category: ${therapeuticCategory}` : ''}

Translate the following text from ${sourceLanguage} to ${targetLanguage}. Return ONLY the translated text.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text }
        ],
        temperature: 0.1,
        max_tokens: 2000
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const translatedText = data.choices[0].message.content.trim();
    const responseTime = Date.now() - startTime;

    return {
      text: translatedText,
      qualityScore: 0.85,
      responseTime
    };
  } catch (error) {
    console.error('OpenAI translation error:', error);
    throw error;
  }
}

async function storeTranslation(
  sourceText: string,
  translatedText: string,
  sourceLanguage: string,
  targetLanguage: string,
  contextType: string,
  provider: string,
  qualityScore: number,
  therapeuticCategory?: string,
  culturalAdaptations?: Record<string, any>,
  userId?: string,
  sessionId?: string
) {
  try {
    const { data: translationData } = await supabase
      .from('european_translation_memory')
      .insert({
        source_text: sourceText,
        translated_text: translatedText,
        source_language: sourceLanguage,
        target_language: targetLanguage,
        context_type: contextType,
        therapeutic_category: therapeuticCategory,
        cultural_adaptations: culturalAdaptations,
        translation_provider: provider,
        quality_score: qualityScore
      })
      .select('id')
      .single();

    if (translationData) {
      // Store quality metrics
      await supabase
        .from('translation_quality_metrics')
        .insert({
          translation_id: translationData.id,
          provider,
          language_pair: `${sourceLanguage}-${targetLanguage}`,
          quality_score: qualityScore,
          response_time_ms: 0, // Will be updated with actual response time
          cultural_accuracy_score: 0.9,
          therapeutic_accuracy_score: provider === 'claude' ? 0.95 : 0.85
        });
    }
  } catch (error) {
    console.error('Store translation error:', error);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      text,
      sourceLanguage,
      targetLanguage,
      contextType = 'general',
      therapeuticCategory,
      culturalAdaptations,
      userId,
      sessionId
    }: TranslationRequest = await req.json();

    // Check cache first
    const cachedTranslation = await getCachedTranslation(
      text,
      sourceLanguage,
      targetLanguage,
      contextType
    );

    if (cachedTranslation) {
      const response: TranslationResponse = {
        translatedText: cachedTranslation,
        provider: 'cache',
        qualityScore: 1.0,
        responseTime: 0,
        cached: true
      };

      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get cultural context
    const culturalContext = await getCulturalContext(targetLanguage);

    let translationResult;
    let provider = 'claude';

    try {
      // Try Claude first
      translationResult = await translateWithClaude(
        text,
        sourceLanguage,
        targetLanguage,
        culturalContext,
        therapeuticCategory
      );
    } catch (claudeError) {
      console.error('Claude failed, trying OpenAI:', claudeError);
      
      try {
        // Fallback to OpenAI
        translationResult = await translateWithOpenAI(
          text,
          sourceLanguage,
          targetLanguage,
          culturalContext,
          therapeuticCategory
        );
        provider = 'openai';
      } catch (openaiError) {
        console.error('Both translation services failed:', openaiError);
        throw new Error('Translation services unavailable');
      }
    }

    // Store translation in memory
    await storeTranslation(
      text,
      translationResult.text,
      sourceLanguage,
      targetLanguage,
      contextType,
      provider,
      translationResult.qualityScore,
      therapeuticCategory,
      { ...culturalAdaptations, ...culturalContext },
      userId,
      sessionId
    );

    const response: TranslationResponse = {
      translatedText: translationResult.text,
      provider,
      qualityScore: translationResult.qualityScore,
      responseTime: translationResult.responseTime,
      culturalAdaptations: { ...culturalAdaptations, ...culturalContext },
      cached: false
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Translation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});