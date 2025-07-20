
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();

    if (!text || text.trim().length === 0) {
      return new Response(JSON.stringify({ language: 'en' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a language detection system. Respond only with the ISO 639-1 language code (2 letters) of the detected language. For example: "en" for English, "es" for Spanish, "fr" for French, etc.'
          },
          {
            role: 'user',
            content: `Detect the language of this text: "${text}"`
          }
        ],
        temperature: 0,
        max_tokens: 10
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const detectedLanguage = data.choices[0].message.content.toLowerCase().trim();

    // Validate that we got a proper language code
    const validLanguageCodes = [
      'en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko', 'ar', 'hi', 'bn', 'ur', 'pa', 'te', 'mr', 'ta', 'gu', 'kn', 'ml', 'th', 'vi', 'id', 'ms', 'tl', 'my', 'km', 'lo', 'he', 'fa', 'tr', 'ku', 'az', 'sw', 'am', 'ha', 'yo', 'ig', 'zu', 'xh', 'af', 'pl', 'cs', 'sk', 'hu', 'hr', 'sr', 'bg', 'ro', 'nl', 'sv', 'no', 'da', 'fi', 'et', 'lv', 'lt', 'uk', 'el', 'mt'
    ];

    const finalLanguage = validLanguageCodes.includes(detectedLanguage) ? detectedLanguage : 'en';

    return new Response(JSON.stringify({ 
      language: finalLanguage,
      confidence: 0.95 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Language detection error:', error);
    return new Response(JSON.stringify({ 
      language: 'en',
      confidence: 0.5,
      error: error.message 
    }), {
      status: 200, // Don't fail the request, just return default
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
