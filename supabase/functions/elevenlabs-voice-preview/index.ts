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
  'ed979f27-2491-43f1-a779-5095febb68b2': { voiceId: 'EXAVITQu4vr4xnSDxMaL', model: 'eleven_multilingual_v2' }, // Dr. Sarah Chen
  '9492ab1a-eab2-4c5f-a8e3-40870b2ca857': { voiceId: 'cgSgspJ2msm6clMCkdW9', model: 'eleven_multilingual_v2' }, // Dr. Maya Patel
  '0772c602-306b-42ad-b610-2dc15ba06714': { voiceId: 'TX3LPaxmHKxFdv7VOQHJ', model: 'eleven_multilingual_v2' }, // Dr. Alex Rodriguez
  '2fee5506-ee6d-4504-bab7-2ba922bdc99a': { voiceId: 'onwK4e9ZLuTAKqWW03F9', model: 'eleven_multilingual_v2' }, // Dr. Jordan Kim
  '84148de7-b04d-4547-9d9b-80665efbd4af': { voiceId: 'XB0fDUnXU5powFXDhCwa', model: 'eleven_multilingual_v2' }, // Dr. Taylor Morgan
  '79298cfb-6997-4cc6-9b21-ffaacb525c54': { voiceId: 'SAz9YHcvj6GT2YYXdXww', model: 'eleven_multilingual_v2' }, // Dr. River Stone
  'e352e13d-99f9-4ffc-95a6-a05c3d935b74': { voiceId: 'JBFqnCBsd6RMkjVDRZzb', model: 'eleven_multilingual_v2' }, // Dr. Michael Rivers
  '88a93e17-4338-4834-b360-55c9db4cc667': { voiceId: 'pFZP5JQG7iQjIQuC4Bku', model: 'eleven_multilingual_v2' }, // Dr. Emma Thompson
  '1588e859-69a6-4b88-b2cc-c377441ac08c': { voiceId: 'bIHbv24MWmeRgasZH58o', model: 'eleven_multilingual_v2' }, // Dr. James Rodriguez
};

// Short professional introductions for voice preview
const therapistIntroductions: Record<string, string> = {
  'ed979f27-2491-43f1-a779-5095febb68b2': "Hello, I'm Dr. Sarah Chen. I specialize in cognitive behavioral therapy and I'm here to help you overcome anxiety and life's challenges with practical, evidence-based approaches.",
  '9492ab1a-eab2-4c5f-a8e3-40870b2ca857': "Namaste, I'm Dr. Maya Patel. I practice mindfulness-based therapy, combining traditional therapeutic approaches with meditation and breathing techniques to help you find inner peace.",
  '0772c602-306b-42ad-b610-2dc15ba06714': "Hello, I'm Dr. Marcus Bennett. I specialize in solution-focused therapy, helping you identify your strengths and create practical steps toward your goals.",
  '2fee5506-ee6d-4504-bab7-2ba922bdc99a': "Hello, I'm Dr. Jordan Kim. I specialize in trauma therapy and EMDR, providing a safe space for healing at your own pace with compassionate, evidence-based care.",
  '84148de7-b04d-4547-9d9b-80665efbd4af': "Hi, I'm Dr. Taylor Morgan. I specialize in relationship and couples therapy, helping you build stronger, more fulfilling connections with others and yourself.",
  '79298cfb-6997-4cc6-9b21-ffaacb525c54': "Greetings, I'm Dr. River Stone. I practice holistic therapy, integrating traditional methods with nature therapy and expressive arts to support your whole being.",
  'e352e13d-99f9-4ffc-95a6-a05c3d935b74': "Hello, I'm Dr. Michael Rivers. I specialize in mindfulness-based stress reduction, helping you develop presence and inner calm through contemplative practices.",
  '88a93e17-4338-4834-b360-55c9db4cc667': "Hello, I'm Dr. Emma Thompson. I practice humanistic therapy, providing a safe space where you can discover your authentic self and inner wisdom.",
  '1588e859-69a6-4b88-b2cc-c377441ac08c': "Hello, I'm Dr. James Martinez. I specialize in solution-focused therapy, helping you recognize your strengths and create positive changes in your life.",
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (!ELEVENLABS_API_KEY) {
      console.error('ElevenLabs API key not configured');
      return new Response(
        JSON.stringify({ error: 'ElevenLabs API key not configured. Please add ELEVENLABS_API_KEY to your Supabase secrets.' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const body = await req.json();
    const { therapistId, text }: VoicePreviewRequest = body;
    
    if (!therapistId) {
      return new Response(
        JSON.stringify({ error: 'Therapist ID is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Voice preview request for therapist:', therapistId);

    // Get voice config or use default
    const voiceConfig = therapistVoiceMap[therapistId] || { voiceId: 'EXAVITQu4vr4xnSDxMaL', model: 'eleven_multilingual_v2' };
    const introText = text || therapistIntroductions[therapistId] || "Hello, I'm your AI therapist. I'm here to support you on your mental health journey.";
    
    console.log('Generating voice with config:', voiceConfig);
    
    // Call ElevenLabs Text-to-Speech API
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceConfig.voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY!,
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
      console.error('ElevenLabs API error:', response.status, errorText);
      throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));

    console.log('Voice preview generated successfully');

    return new Response(
      JSON.stringify({ 
        audioContent: base64Audio,
        text: introText,
        voiceId: voiceConfig.voiceId
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in elevenlabs-voice-preview function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});