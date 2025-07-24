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

// Detailed professional introductions for voice preview
const therapistIntroductions: Record<string, string> = {
  'ed979f27-2491-43f1-a779-5095febb68b2': "Hello, I'm Dr. Sarah Chen, a licensed clinical psychologist specializing in cognitive behavioral therapy. With over 8 years of experience, I help individuals overcome anxiety, depression, and life transitions using evidence-based approaches. My practice focuses on practical tools you can use daily, combined with mindfulness techniques. I believe in creating a collaborative therapeutic relationship where you feel heard, understood, and empowered to create positive change in your life.",
  
  '9492ab1a-eab2-4c5f-a8e3-40870b2ca857': "Namaste, I'm Dr. Maya Patel, a mindfulness-based therapist with a PhD in contemplative psychology. I integrate traditional therapeutic methods with meditation, breathwork, and ancient wisdom practices. My 10 years of experience includes training in MBSR, MBCT, and somatic therapies. I work with clients facing stress, anxiety, and spiritual growth challenges, helping you develop inner peace and resilience through mindful awareness and compassionate self-inquiry.",
  
  '0772c602-306b-42ad-b610-2dc15ba06714': "Hello, I'm Dr. Alex Rodriguez, a solution-focused therapist and life coach. I specialize in helping people identify their inner strengths and create actionable plans for positive change. With my background in positive psychology and strengths-based interventions, I work with clients on goal-setting, career transitions, and building confidence. My approach is collaborative, forward-thinking, and designed to help you achieve meaningful results in a shorter timeframe.",
  
  '2fee5506-ee6d-4504-bab7-2ba922bdc99a': "Hello, I'm Dr. Jordan Kim, a trauma-informed therapist trained in EMDR and somatic therapies. I provide specialized care for individuals healing from trauma, PTSD, and complex emotional wounds. My approach emphasizes safety, choice, and honoring your natural healing capacity. With over 12 years of experience, I create a gentle, non-judgmental space where you can process difficult experiences at your own pace and reclaim your sense of empowerment.",
  
  '84148de7-b04d-4547-9d9b-80665efbd4af': "Hi, I'm Dr. Taylor Morgan, a relationship and couples therapist trained in Gottman Method and Emotionally Focused Therapy. I help individuals and couples build stronger, more fulfilling connections through improved communication, conflict resolution, and emotional intimacy. Whether you're working on personal relationships, family dynamics, or preparing for marriage, I provide practical tools and insights to help you create the loving relationships you deserve.",
  
  '79298cfb-6997-4cc6-9b21-ffaacb525c54': "Greetings, I'm Dr. River Stone, a holistic therapist integrating traditional counseling with expressive arts, nature therapy, and spiritual practices. My approach honors the whole person - mind, body, and spirit. I work with clients seeking deeper meaning, creative expression, and connection to their authentic selves. Through art, movement, and contemplative practices, we'll explore your inner landscape and discover new pathways to healing and growth.",
  
  'e352e13d-99f9-4ffc-95a6-a05c3d935b74': "Hello, I'm Dr. Michael Rivers, a mindfulness-based stress reduction specialist with training in contemplative psychotherapy. I help busy professionals and individuals find calm in the midst of life's challenges through meditation, breathwork, and present-moment awareness. My gentle, patient approach combines ancient wisdom with modern neuroscience to help you develop resilience, reduce anxiety, and cultivate inner peace in your daily life.",
  
  '88a93e17-4338-4834-b360-55c9db4cc667': "Hello, I'm Dr. Emma Thompson, a humanistic therapist practicing person-centered and existential approaches. I believe in your innate capacity for growth and healing. In our work together, I provide a warm, non-judgmental space where you can explore your authentic self, clarify your values, and find meaning in your experiences. My approach emphasizes self-acceptance, personal responsibility, and the courage to live authentically.",
  
  '1588e859-69a6-4b88-b2cc-c377441ac08c': "Hello, I'm Dr. James Martinez, a solution-focused therapist specializing in positive psychology and personal development. I help clients recognize their existing strengths and build upon them to create positive life changes. My energetic, optimistic approach focuses on what's working in your life and how to expand upon it. Together, we'll develop practical strategies for achieving your goals and building the fulfilling life you envision.",
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  console.log('=== Starting elevenlabs-voice-preview function ===');
  console.log('API Key configured:', !!ELEVENLABS_API_KEY);

  if (!ELEVENLABS_API_KEY) {
    console.error('ELEVENLABS_API_KEY not found in environment');
    return new Response(
      JSON.stringify({ 
        error: 'ElevenLabs API key not configured',
        fallback: 'Please configure ELEVENLABS_API_KEY in Supabase secrets'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const body = await req.json();
    const { therapistId, text }: VoicePreviewRequest = body;
    
    console.log('Request body:', { therapistId, textLength: text?.length });
    
    if (!therapistId) {
      return new Response(
        JSON.stringify({ error: 'Therapist ID is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get voice config or use default
    const voiceConfig = therapistVoiceMap[therapistId] || { voiceId: 'EXAVITQu4vr4xnSDxMaL', model: 'eleven_multilingual_v2' };
    const introText = text || therapistIntroductions[therapistId] || "Hello, I'm your AI therapist. I'm here to support you on your mental health journey.";
    
    console.log('Using voice config:', voiceConfig);
    console.log('Text to synthesize:', introText.substring(0, 100) + '...');
    
    // Call ElevenLabs API with proper error handling
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
          stability: 0.6,
          similarity_boost: 0.9,
          style: 0.3,
          use_speaker_boost: true
        }
      }),
    });

    console.log('ElevenLabs response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', errorText);
      
      // Return specific error details
      return new Response(
        JSON.stringify({ 
          error: `ElevenLabs API error: ${response.status}`,
          details: errorText,
          fallback: 'Voice generation failed'
        }),
        {
          status: 503,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const audioBuffer = await response.arrayBuffer();
    
    // Convert to base64 safely to avoid stack overflow
    const uint8Array = new Uint8Array(audioBuffer);
    let binary = '';
    const chunkSize = 0x8000; // 32KB chunks
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.subarray(i, i + chunkSize);
      binary += String.fromCharCode(...chunk);
    }
    const base64Audio = btoa(binary);

    console.log('Voice generation successful, audio size:', audioBuffer.byteLength);

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
    console.error('Function error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Voice generation failed',
        details: error.message,
        fallback: 'Please try again later'
      }),
      {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});