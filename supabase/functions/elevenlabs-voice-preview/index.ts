import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');

interface VoicePreviewRequest {
  therapistId: string;
  text?: string;
}

// Therapist voice mappings
const therapistVoiceMap: Record<string, { voiceId: string; model: string }> = {
  'dr-sarah-chen': { voiceId: '9BWtsMINqrJLrRacOk9x', model: 'eleven_multilingual_v2' }, // Aria
  'dr-michael-torres': { voiceId: 'CwhRBWXzGAHq8TQ4Fs17', model: 'eleven_multilingual_v2' }, // Roger
  'dr-aisha-patel': { voiceId: 'EXAVITQu4vr4xnSDxMaL', model: 'eleven_multilingual_v2' }, // Sarah
  'dr-james-wilson': { voiceId: 'JBFqnCBsd6RMkjVDRZzb', model: 'eleven_multilingual_v2' }, // George
  'dr-emily-rodriguez': { voiceId: 'FGY2WhTYpPnrIDTdsKH5', model: 'eleven_multilingual_v2' }, // Laura
  'dr-david-kim': { voiceId: 'IKne3meq5aSn9XLyUdCD', model: 'eleven_multilingual_v2' } // Charlie
};

// Default introduction texts for each therapist
const therapistIntroductions: Record<string, string> = {
  'dr-sarah-chen': "Hello, I'm Dr. Sarah Chen. I specialize in cognitive behavioral therapy and helping people overcome anxiety and depression. I'm here to support you on your journey to better mental health.",
  'dr-michael-torres': "Hi there, I'm Dr. Michael Torres. I use solution-focused brief therapy to help people find practical solutions to their challenges. Let's work together to achieve your goals.",
  'dr-aisha-patel': "Greetings, I'm Dr. Aisha Patel. I combine mindfulness-based approaches with traditional therapy to help you find inner peace and emotional balance.",
  'dr-james-wilson': "Hello, I'm Dr. James Wilson. I specialize in trauma therapy and EMDR. I'm here to provide a safe space where you can heal and grow.",
  'dr-emily-rodriguez': "Hi, I'm Dr. Emily Rodriguez. I use humanistic therapy to help you discover your inner strength and navigate life's challenges with confidence.",
  'dr-david-kim': "Hello, I'm Dr. David Kim. I specialize in dialectical behavior therapy and emotional regulation. I'm here to help you develop healthy coping strategies."
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (!ELEVENLABS_API_KEY) {
      throw new Error('ElevenLabs API key not configured');
    }

    const { therapistId, text }: VoicePreviewRequest = await req.json();
    
    if (!therapistId) {
      throw new Error('Therapist ID is required');
    }

    const voiceConfig = therapistVoiceMap[therapistId];
    if (!voiceConfig) {
      throw new Error(`Voice configuration not found for therapist: ${therapistId}`);
    }

    const introText = text || therapistIntroductions[therapistId] || "Hello, I'm here to support you on your mental health journey.";

    // Call ElevenLabs Text-to-Speech API
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceConfig.voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: introText,
        model_id: voiceConfig.model,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
          style: 0.2,
          use_speaker_boost: true
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', errorText);
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));

    return new Response(
      JSON.stringify({ 
        audioContent: base64Audio,
        text: introText,
        voiceId: voiceConfig.voiceId
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );

  } catch (error) {
    console.error('Error in elevenlabs-voice-preview function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});