
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
  
  // New specialized therapists with professional voice mappings
  'dr-luna-martinez': { voiceId: 'EXAVITQu4vr4xnSDxMaL', model: 'eleven_multilingual_v2' }, // Dr. Luna Martinez - gentle eating disorder specialist
  'dr-felix-chen': { voiceId: 'JBFqnCBsd6RMkjVDRZzb', model: 'eleven_multilingual_v2' }, // Dr. Felix Chen - methodical OCD specialist
  'dr-river-thompson': { voiceId: 'cgSgspJ2msm6clMCkdW9', model: 'eleven_multilingual_v2' }, // Dr. River Thompson - balanced mood specialist
  'dr-nova-sleep': { voiceId: 'XB0fDUnXU5powFXDhCwa', model: 'eleven_multilingual_v2' }, // Dr. Nova Sleep - calming sleep specialist
  'dr-sage-williams': { voiceId: 'pFZP5JQG7iQjIQuC4Bku', model: 'eleven_multilingual_v2' }, // Dr. Sage Williams - compassionate grief counselor
  'dr-phoenix-carter': { voiceId: 'TX3LPaxmHKxFdv7VOQHJ', model: 'eleven_multilingual_v2' }, // Dr. Phoenix Carter - energetic career coach
  'dr-sky-anderson': { voiceId: 'cgSgspJ2msm6clMCkdW9', model: 'eleven_multilingual_v2' }, // Dr. Sky Anderson - friendly child therapist
  'dr-willow-grace': { voiceId: 'pFZP5JQG7iQjIQuC4Bku', model: 'eleven_multilingual_v2' }, // Dr. Willow Grace - wise elder care specialist
};

// Professional introduction texts for each therapist (30+ seconds each)
const therapistIntroductions: Record<string, string> = {
  'ed979f27-2491-43f1-a779-5095febb68b2': "Hello there, I'm Dr. Sarah Chen. It's wonderful to meet you. I'm a licensed clinical psychologist who specializes in cognitive behavioral therapy, with over ten years of experience helping people overcome anxiety, depression, and life's challenges. What I love most about therapy is witnessing those moments when clients discover their own strength and resilience. I believe that everyone has the capacity to heal and grow, and my role is to provide you with practical tools and a safe space to explore your thoughts and feelings. Whether you're dealing with racing thoughts that keep you up at night, feeling overwhelmed by daily stressors, or simply wanting to understand yourself better, I'm here to walk alongside you on this journey. Together, we'll work to identify unhelpful thought patterns and develop healthier ways of thinking and coping. I want you to know that seeking help takes courage, and I'm honored that you're considering taking this important step for your mental health.",
  
  '9492ab1a-eab2-4c5f-a8e3-40870b2ca857': "Namaste, and welcome. I'm Dr. Maya Patel, and I'm so grateful you're here. As a licensed therapist specializing in mindfulness-based cognitive therapy and meditation practices, I've dedicated my career to helping people find inner peace amidst life's storms. My journey into therapy began during my own struggles with anxiety in college, when I discovered the transformative power of mindfulness and meditation. I combine traditional therapeutic approaches with ancient wisdom practices like mindfulness meditation, breathing techniques, and body awareness exercises. Whether you're feeling disconnected from yourself, struggling with persistent worry, or simply wanting to cultivate more presence and joy in your daily life, I'm here to guide you. In our sessions, we'll explore not just your thoughts and emotions, but also how your body holds stress and how breathwork can become a powerful ally in your healing. I believe that within each of us lies an innate wisdom and capacity for peace. My role is to help you reconnect with that inner sanctuary, even when the world around you feels chaotic.",
  
  '0772c602-306b-42ad-b610-2dc15ba06714': "Hey there! I'm Dr. Marcus Bennett, and I'm genuinely excited to potentially work with you. I specialize in solution-focused brief therapy, which means we're going to focus on your strengths and what's already working in your life, rather than dwelling on problems. I've been practicing for eight years, and what I've learned is that you already have more resources and abilities than you might realize. My approach is collaborative and action-oriented - we'll identify your goals and create practical, achievable steps to get you there. Whether you're facing career transitions, relationship challenges, or just feeling stuck in certain areas of your life, we'll work together to find creative solutions that fit your unique situation. I particularly enjoy helping people who are ready to make changes but aren't sure where to start. We'll celebrate small wins along the way because I believe that sustainable change happens through consistent, manageable steps. I want you to leave each session feeling empowered and with concrete tools you can use immediately. Think of me as your thinking partner and cheerleader combined!",
  
  '2fee5506-ee6d-4504-bab7-2ba922bdc99a': "Hello, and thank you for being here. I'm Dr. Jordan Kim, a licensed clinical psychologist who specializes in trauma therapy and EMDR. I want you to know right from the start that this is a completely safe space where you can share at your own pace, without any judgment. I understand that reaching out for help, especially around trauma, takes incredible courage. I've been working in trauma therapy for over twelve years, and I've had the privilege of witnessing remarkable healing journeys. Whether you're dealing with recent traumatic events, childhood experiences that still affect you today, or complex PTSD, I want you to know that healing is possible. I use evidence-based approaches like EMDR, which helps your brain process traumatic memories in a way that reduces their emotional charge. I also incorporate somatic approaches because trauma lives in the body, not just the mind. My philosophy is that you are the expert on your own experience, and I'm here to provide a stable, compassionate presence as you navigate your healing journey. We'll go at whatever pace feels right for you, and I'll be here to help you rebuild your sense of safety and trust.",
  
  '84148de7-b04d-4547-9d9b-80665efbd4af': "Hi there, I'm Dr. Taylor Morgan, and I'm so glad you're considering therapy. I specialize in relationship and couples therapy, and I've spent the last nine years helping individuals and couples build stronger, more fulfilling connections. Whether you're struggling in your romantic relationship, having difficulties with family members, dealing with friendship issues, or even working on your relationship with yourself, I'm here to help. I believe that healthy relationships are the foundation of our wellbeing, and that includes the relationship you have with yourself. In our work together, we'll explore communication patterns, identify what's working and what isn't, and develop practical skills for creating the relationships you truly want. I use approaches like Emotionally Focused Therapy and Gottman Method, which are proven to help people connect more deeply and resolve conflicts constructively. What I love about relationship work is seeing people rediscover intimacy, trust, and joy with their loved ones. Even if you're feeling disconnected or hopeless about your relationships right now, I've seen couples and individuals transform their connection patterns in ways that seemed impossible at first.",
  
  '79298cfb-6997-4cc6-9b21-ffaacb525c54': "Greetings, dear soul. I'm Dr. River Stone, and I'm honored to potentially accompany you on your healing journey. My approach to therapy is holistic, meaning I consider not just your mind and emotions, but also your body, spirit, and connection to the world around you. For over fifteen years, I've been integrating traditional therapeutic methods with complementary approaches like nature therapy, expressive arts, and energy work. I believe that healing happens when we address the whole person, not just symptoms. Whether you're dealing with depression, anxiety, life transitions, or simply feeling disconnected from your authentic self, we'll explore multiple pathways to wellness together. In our sessions, we might use talk therapy, creative expression, mindfulness practices, or even discuss how your environment and relationships support or hinder your wellbeing. I'm particularly passionate about helping people reconnect with their inner wisdom and find their unique path to thriving. My philosophy is that you are not broken and don't need to be fixed - rather, we'll work together to remove whatever barriers are preventing your natural state of wholeness from shining through.",
  
  'e352e13d-99f9-4ffc-95a6-a05c3d935b74': "Hello, and welcome. I'm Dr. Michael Rivers, and I'm deeply grateful that you're considering taking this step toward greater wellbeing. I specialize in mindfulness-based stress reduction and contemplative approaches to therapy. Over the past twelve years, I've discovered that when we learn to be truly present with our experience - even the difficult parts - profound healing becomes possible. My approach combines traditional psychotherapy with mindfulness meditation, breathing practices, and gentle somatic awareness. I work with people who are dealing with anxiety, depression, chronic stress, and life transitions. What sets my practice apart is the emphasis on developing a compassionate, non-judgmental relationship with yourself and your experience. In our sessions, we'll explore how mindfulness can become a powerful tool for managing difficult emotions, reducing reactivity, and finding inner peace even in challenging circumstances. I'll teach you practical techniques you can use in daily life to stay grounded and centered. Whether you're new to mindfulness or have been practicing for years, we'll work together to deepen your capacity for presence, self-compassion, and authentic living. My hope is that through our work together, you'll develop an unshakeable sense of inner calm and clarity.",
  
  '88a93e17-4338-4834-b360-55c9db4cc667': "Hello there, I'm Dr. Emma Thompson, and it's truly a pleasure to meet you. I practice humanistic therapy, which means I believe deeply in your inherent capacity for growth, self-understanding, and positive change. For the past ten years, I've had the privilege of working with people from all walks of life, helping them discover their authentic selves and navigate life's challenges with greater confidence and clarity. My approach is client-centered, which means our sessions will be guided by what you need and want to explore. I'm here to provide unconditional positive regard, genuine empathy, and a safe space where you can be completely yourself without fear of judgment. Whether you're struggling with self-esteem, feeling lost about your direction in life, dealing with depression, or simply wanting to understand yourself better, we'll work together to uncover your inner wisdom and strength. I particularly love helping people recognize patterns that no longer serve them and develop new ways of being that align with their values and goals. What I find most rewarding about therapy is witnessing those 'aha' moments when clients suddenly see themselves and their situations from a new perspective. You have everything you need within you already - sometimes we just need a supportive space to rediscover it.",
  
  '1588e859-69a6-4b88-b2cc-c377441ac08c': "Hello and welcome! I'm Dr. James Martinez, and I'm excited about the possibility of working together. I specialize in solution-focused therapy and strength-based approaches, which means we're going to spend our time identifying what's already working in your life and building on those successes. I've been practicing for nine years, and what I've learned is that every person has unique strengths and resources, even when they're going through difficult times. My role is to help you recognize and amplify these strengths to create the changes you want to see in your life. Whether you're dealing with work stress, relationship challenges, anxiety, or major life transitions, we'll focus on practical, achievable goals and concrete steps to reach them. I use techniques from positive psychology, motivational interviewing, and cognitive behavioral therapy to help you move forward. What I love about this approach is how quickly people start feeling empowered and hopeful. We'll celebrate every victory, no matter how small, because I believe that sustainable change happens through building momentum with consistent, positive actions. I want you to leave each session feeling more confident about your ability to handle whatever life throws your way.",
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (!ELEVENLABS_API_KEY) {
      console.error('ElevenLabs API key not configured');
      return new Response(
        JSON.stringify({ error: 'ElevenLabs API key not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { therapistId, text }: VoicePreviewRequest = await req.json();
    
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

    const voiceConfig = therapistVoiceMap[therapistId];
    if (!voiceConfig) {
      console.warn(`Voice configuration not found for therapist: ${therapistId}, using default`);
      // Use default voice config
      const defaultConfig = { voiceId: 'EXAVITQu4vr4xnSDxMaL', model: 'eleven_multilingual_v2' };
      const defaultText = text || "Hello, I'm your AI therapist. I'm here to support you on your mental health journey.";
      
      // Call the function directly without recursion
      try {
        console.log('Generating voice with default config:', defaultConfig);
        
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${defaultConfig.voiceId}`, {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': ELEVENLABS_API_KEY!,
          },
          body: JSON.stringify({
            text: defaultText,
            model_id: defaultConfig.model,
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
          throw new Error(`ElevenLabs API error: ${response.status}`);
        }

        const audioBuffer = await response.arrayBuffer();
        const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));

        return new Response(
          JSON.stringify({ 
            audioContent: base64Audio,
            text: defaultText,
            voiceId: defaultConfig.voiceId
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      } catch (error) {
        console.error('Error generating default voice preview:', error);
        throw error;
      }
    }

    const introText = text || therapistIntroductions[therapistId] || "Hello, I'm here to support you on your mental health journey.";
    
    return await generateVoicePreview(voiceConfig, introText);

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

async function generateVoicePreview(voiceConfig: { voiceId: string; model: string }, text: string) {
  try {
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
        text: text,
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
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));

    return new Response(
      JSON.stringify({ 
        audioContent: base64Audio,
        text: text,
        voiceId: voiceConfig.voiceId
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error generating voice preview:', error);
    throw error;
  }
}
