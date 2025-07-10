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

// Therapist voice mappings using actual database IDs
const therapistVoiceMap: Record<string, { voiceId: string; model: string }> = {
  // Database IDs mapped to ElevenLabs voices
  'ed979f27-2491-43f1-a779-5095febb68b2': { voiceId: 'EXAVITQu4vr4xnSDxMaL', model: 'eleven_multilingual_v2' }, // Dr. Sarah Chen - warm analytical female
  '9492ab1a-eab2-4c5f-a8e3-40870b2ca857': { voiceId: 'cgSgspJ2msm6clMCkdW9', model: 'eleven_multilingual_v2' }, // Dr. Maya Patel - gentle mindful female
  '0772c602-306b-42ad-b610-2dc15ba06714': { voiceId: 'TX3LPaxmHKxFdv7VOQHJ', model: 'eleven_multilingual_v2' }, // Dr. Alex Rodriguez - energetic male
  '2fee5506-ee6d-4504-bab7-2ba922bdc99a': { voiceId: 'onwK4e9ZLuTAKqWW03F9', model: 'eleven_multilingual_v2' }, // Dr. Jordan Kim - gentle trauma-informed male
  '84148de7-b04d-4547-9d9b-80665efbd4af': { voiceId: 'XB0fDUnXU5powFXDhCwa', model: 'eleven_multilingual_v2' }, // Dr. Taylor Morgan - empathetic female
  '79298cfb-6997-4cc6-9b21-ffaacb525c54': { voiceId: 'SAz9YHcvj6GT2YYXdXww', model: 'eleven_multilingual_v2' }, // Dr. River Stone - wise holistic voice
  'e352e13d-99f9-4ffc-95a6-a05c3d935b74': { voiceId: 'JBFqnCBsd6RMkjVDRZzb', model: 'eleven_multilingual_v2' }, // Dr. Michael Rivers - calm mindful male (George)
  '88a93e17-4338-4834-b360-55c9db4cc667': { voiceId: 'pFZP5JQG7iQjIQuC4Bku', model: 'eleven_multilingual_v2' }, // Dr. Emma Thompson - warm humanistic female
  '1588e859-69a6-4b88-b2cc-c377441ac08c': { voiceId: 'bIHbv24MWmeRgasZH58o', model: 'eleven_multilingual_v2' }, // Dr. James Rodriguez - optimistic male
  
  // New specialized therapists
  'a1b2c3d4-5e6f-7890-abcd-ef1234567890': { voiceId: 'TX3LPaxmHKxFdv7VOQHJ', model: 'eleven_multilingual_v2' }, // Dr. Jordan Taylor - energetic ADHD specialist
  'b2c3d4e5-6f78-9012-bcde-f23456789012': { voiceId: 'cgSgspJ2msm6clMCkdW9', model: 'eleven_multilingual_v2' }, // Dr. Riley Chen - affirming LGBTQ+ voice
  'c3d4e5f6-7890-1234-cdef-345678901234': { voiceId: 'EXAVITQu4vr4xnSDxMaL', model: 'eleven_multilingual_v2' }, // Dr. Sam Morgan - balanced couples voice
};

// Default introduction texts for each therapist using database IDs
const therapistIntroductions: Record<string, string> = {
  'ed979f27-2491-43f1-a779-5095febb68b2': "Hello, I'm Dr. Sarah Chen. I specialize in cognitive behavioral therapy and helping people overcome anxiety and depression. I'm here to support you on your journey to better mental health.",
  '9492ab1a-eab2-4c5f-a8e3-40870b2ca857': "Greetings, I'm Dr. Maya Patel. I combine mindfulness-based approaches with traditional therapy to help you find inner peace and emotional balance.",
  '0772c602-306b-42ad-b610-2dc15ba06714': "Hi there, I'm Dr. Alex Rodriguez. I use solution-focused brief therapy to help people find practical solutions to their challenges. Let's work together to achieve your goals.",
  '2fee5506-ee6d-4504-bab7-2ba922bdc99a': "Hello, I'm Dr. Jordan Kim. I specialize in trauma therapy and EMDR. I'm here to provide a safe space where you can heal and grow.",
  '84148de7-b04d-4547-9d9b-80665efbd4af': "Hi, I'm Dr. Taylor Morgan. I focus on relationship therapy and helping you build stronger connections with others.",
  '79298cfb-6997-4cc6-9b21-ffaacb525c54': "Hello, I'm Dr. River Stone. I take a holistic approach to wellness, considering your mind, body, and spirit in our therapeutic journey.",
  'e352e13d-99f9-4ffc-95a6-a05c3d935b74': "Hello, I'm Dr. Michael Rivers. I specialize in mindfulness-based therapy to help you find clarity and emotional balance. I'm here to guide you with compassion and understanding.",
  '88a93e17-4338-4834-b360-55c9db4cc667': "Hi, I'm Dr. Emma Thompson. I use humanistic therapy to help you discover your inner strength and navigate life's challenges with confidence.",
  '1588e859-69a6-4b88-b2cc-c377441ac08c': "Hello, I'm Dr. James Rodriguez. I specialize in solution-focused therapy to help you achieve your goals and build on your existing strengths.",
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