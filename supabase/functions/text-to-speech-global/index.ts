
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VoiceRequest {
  text: string;
  language: string;
  culturalContext?: any;
  voice?: string;
  speed?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, language, culturalContext, voice, speed }: VoiceRequest = await req.json();

    const elevenlabsApiKey = Deno.env.get('ELEVENLABS_API_KEY');
    if (!elevenlabsApiKey) {
      throw new Error('ELEVENLABS_API_KEY not configured');
    }

    // Map languages to appropriate voices
    const languageVoiceMap: Record<string, string> = {
      'en': voice || 'EXAVITQu4vr4xnSDxMaL', // Sarah
      'es': voice || 'pFZP5JQG7iQjIQuC4Bku', // Lily (multilingual)
      'fr': voice || 'cgSgspJ2msm6clMCkdW9', // Jessica (multilingual)
      'de': voice || 'XB0fDUnXU5powFXDhCwa', // Charlotte (multilingual)
      'it': voice || 'XrExE9yKIg1WjnnlVkGX', // Matilda (multilingual)
      'pt': voice || 'pqHfZKP75CvOlQylNhV4', // Bill (multilingual)
      'zh': voice || 'pFZP5JQG7iQjIQuC4Bku', // Lily
      'ja': voice || 'cgSgspJ2msm6clMCkdW9', // Jessica
      'ko': voice || 'XB0fDUnXU5powFXDhCwa', // Charlotte
      'ar': voice || 'nPczCjzI2devNBz1zQrb', // Brian
      'hi': voice || 'pFZP5JQG7iQjIQuC4Bku', // Lily
      'ru': voice || 'XrExE9yKIg1WjnnlVkGX', // Matilda
      'default': voice || 'EXAVITQu4vr4xnSDxMaL' // Sarah
    };

    const selectedVoiceId = languageVoiceMap[language] || languageVoiceMap['default'];

    // Adjust voice settings based on cultural context
    let voiceSettings = {
      stability: 0.8,
      similarity_boost: 0.8,
      style: 0.5,
      use_speaker_boost: true
    };

    if (culturalContext) {
      // Adjust voice characteristics based on cultural communication style
      const communicationStyle = culturalContext.communicationStyle || 'neutral';
      
      switch (communicationStyle) {
        case 'formal':
          voiceSettings.stability = 0.9;
          voiceSettings.style = 0.3;
          break;
        case 'direct':
          voiceSettings.similarity_boost = 0.9;
          voiceSettings.style = 0.6;
          break;
        case 'gentle':
        case 'soft':
          voiceSettings.stability = 0.7;
          voiceSettings.style = 0.4;
          break;
        case 'expressive':
        case 'emotional':
          voiceSettings.style = 0.8;
          voiceSettings.similarity_boost = 0.7;
          break;
      }
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': elevenlabsApiKey,
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: voiceSettings
      }),
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));

    return new Response(JSON.stringify({
      audioContent: base64Audio,
      voiceId: selectedVoiceId,
      language: language,
      culturalAdaptations: culturalContext ? {
        communicationStyle: culturalContext.communicationStyle,
        voiceSettings: voiceSettings
      } : null
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Text-to-speech error:', error);
    return new Response(JSON.stringify({
      error: error.message,
      audioContent: null
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
