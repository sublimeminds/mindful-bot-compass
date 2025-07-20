
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GlobalTranslationRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
  userId?: string;
  sessionId?: string;
  contextType?: string;
  therapeuticCategory?: string;
  voiceEnabled?: boolean;
  preserveFormality?: boolean;
  culturalContext?: any;
}

interface GlobalTranslationResponse {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  contextType: string;
  therapeuticCategory?: string;
  culturalAdaptations?: Record<string, any>;
  formalityLevel?: string;
  voiceContent?: string;
  qualityScore: number;
  culturalAccuracyScore: number;
  provider: string;
  cached: boolean;
  responseTime: number;
  sessionId?: string;
  regionalVariations?: Record<string, string>;
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

async function translateWithClaude(request: GlobalTranslationRequest): Promise<GlobalTranslationResponse> {
  const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
  if (!anthropicApiKey) {
    throw new Error('ANTHROPIC_API_KEY not configured');
  }

  const culturalPrompt = request.culturalContext ? 
    `Cultural Context: ${JSON.stringify(request.culturalContext, null, 2)}. Please adapt the translation to respect cultural norms, communication styles, and therapeutic preferences.` : '';

  const systemPrompt = `You are a professional translator specializing in therapeutic and mental health content with deep cultural competency. 

  Task: Translate the following text from ${request.sourceLanguage} to ${request.targetLanguage}.

  Context: ${request.contextType || 'general'}
  ${request.therapeuticCategory ? `Therapeutic Category: ${request.therapeuticCategory}` : ''}
  ${culturalPrompt}

  Requirements:
  1. Maintain therapeutic accuracy and sensitivity
  2. Adapt for cultural context and communication style
  3. Preserve emotional tone and professional boundaries
  4. Use appropriate formality level for the target culture
  5. Consider mental health stigma levels in the target culture
  6. Respect family/community involvement expectations
  7. Adapt crisis intervention language appropriately

  Provide your response as a JSON object with:
  {
    "translatedText": "the translation",
    "culturalAdaptations": {"key": "explanation of adaptations made"},
    "formalityLevel": "formal|informal|neutral",
    "qualityScore": 0.95,
    "culturalAccuracyScore": 0.90
  }`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': anthropicApiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: `${systemPrompt}\n\nText to translate: "${request.text}"`
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.content[0].text;
  
  try {
    const result = JSON.parse(content);
    return {
      translatedText: result.translatedText,
      sourceLanguage: request.sourceLanguage,
      targetLanguage: request.targetLanguage,
      contextType: request.contextType || 'general',
      therapeuticCategory: request.therapeuticCategory,
      culturalAdaptations: result.culturalAdaptations || {},
      formalityLevel: result.formalityLevel || 'neutral',
      qualityScore: result.qualityScore || 0.95,
      culturalAccuracyScore: result.culturalAccuracyScore || 0.90,
      provider: 'claude',
      cached: false,
      responseTime: 0,
      sessionId: request.sessionId
    };
  } catch (e) {
    // Fallback if JSON parsing fails
    return {
      translatedText: content,
      sourceLanguage: request.sourceLanguage,
      targetLanguage: request.targetLanguage,
      contextType: request.contextType || 'general',
      therapeuticCategory: request.therapeuticCategory,
      culturalAdaptations: {},
      formalityLevel: 'neutral',
      qualityScore: 0.85,
      culturalAccuracyScore: 0.80,
      provider: 'claude',
      cached: false,
      responseTime: 0,
      sessionId: request.sessionId
    };
  }
}

async function translateWithOpenAI(request: GlobalTranslationRequest): Promise<GlobalTranslationResponse> {
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openaiApiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  const culturalPrompt = request.culturalContext ? 
    `Cultural Context: ${JSON.stringify(request.culturalContext, null, 2)}. Please adapt the translation to respect cultural norms, communication styles, and therapeutic preferences.` : '';

  const systemPrompt = `You are a professional translator specializing in therapeutic and mental health content with deep cultural competency. 

  Translate from ${request.sourceLanguage} to ${request.targetLanguage} while maintaining therapeutic accuracy and cultural sensitivity.

  Context: ${request.contextType || 'general'}
  ${request.therapeuticCategory ? `Therapeutic Category: ${request.therapeuticCategory}` : ''}
  ${culturalPrompt}

  Provide a JSON response with: translatedText, culturalAdaptations, formalityLevel, qualityScore, culturalAccuracyScore`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Translate: "${request.text}"` }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  
  try {
    const result = JSON.parse(content);
    return {
      translatedText: result.translatedText,
      sourceLanguage: request.sourceLanguage,
      targetLanguage: request.targetLanguage,
      contextType: request.contextType || 'general',
      therapeuticCategory: request.therapeuticCategory,
      culturalAdaptations: result.culturalAdaptations || {},
      formalityLevel: result.formalityLevel || 'neutral',
      qualityScore: result.qualityScore || 0.90,
      culturalAccuracyScore: result.culturalAccuracyScore || 0.85,
      provider: 'openai',
      cached: false,
      responseTime: 0,
      sessionId: request.sessionId
    };
  } catch (e) {
    // Fallback if JSON parsing fails
    return {
      translatedText: content,
      sourceLanguage: request.sourceLanguage,
      targetLanguage: request.targetLanguage,
      contextType: request.contextType || 'general',
      therapeuticCategory: request.therapeuticCategory,
      culturalAdaptations: {},
      formalityLevel: 'neutral',
      qualityScore: 0.80,
      culturalAccuracyScore: 0.75,
      provider: 'openai',
      cached: false,
      responseTime: 0,
      sessionId: request.sessionId
    };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const request: GlobalTranslationRequest = await req.json();
    const startTime = Date.now();

    console.log('Global translation request:', {
      sourceLanguage: request.sourceLanguage,
      targetLanguage: request.targetLanguage,
      contextType: request.contextType,
      textLength: request.text.length
    });

    let response: GlobalTranslationResponse;

    try {
      // Try Claude first (primary)
      response = await translateWithClaude(request);
      console.log('Translation completed with Claude');
    } catch (claudeError) {
      console.warn('Claude translation failed, falling back to OpenAI:', claudeError);
      
      try {
        // Fallback to OpenAI
        response = await translateWithOpenAI(request);
        console.log('Translation completed with OpenAI fallback');
      } catch (openaiError) {
        console.error('Both translation providers failed:', { claudeError, openaiError });
        throw new Error('All translation providers failed');
      }
    }

    // Update response time
    response.responseTime = Date.now() - startTime;

    // Store in global translation memory
    try {
      await supabase.from('global_translation_memory').insert({
        source_text: request.text,
        source_language: request.sourceLanguage,
        target_language: request.targetLanguage,
        translated_text: response.translatedText,
        context_type: request.contextType || 'general',
        therapeutic_category: request.therapeuticCategory,
        cultural_adaptations: response.culturalAdaptations,
        formality_level: response.formalityLevel,
        voice_content: response.voiceContent,
        translation_provider: response.provider,
        quality_score: response.qualityScore,
        cultural_accuracy_score: response.culturalAccuracyScore,
        regional_variations: response.regionalVariations
      });
    } catch (dbError) {
      console.warn('Failed to store translation in database:', dbError);
      // Don't fail the request if database storage fails
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Global translation error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      translatedText: '',
      provider: 'error',
      cached: false,
      responseTime: 0,
      qualityScore: 0,
      culturalAccuracyScore: 0
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
