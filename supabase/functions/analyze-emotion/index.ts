
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, context = {}, includeIntensity = true, includeValenceArousal = true } = await req.json();

    if (!text) {
      throw new Error('Text is required for emotion analysis');
    }

    // Simple emotion analysis based on keywords
    const emotions = analyzeText(text);
    
    const response = {
      primary_emotion: emotions.primary,
      secondary_emotion: emotions.secondary,
      intensity: includeIntensity ? emotions.intensity : undefined,
      valence: includeValenceArousal ? emotions.valence : undefined,
      arousal: includeValenceArousal ? emotions.arousal : undefined,
      confidence: emotions.confidence
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function analyzeText(text: string) {
  const lowerText = text.toLowerCase();
  
  // Emotion keywords and patterns
  const emotionPatterns = {
    joy: ['happy', 'joy', 'excited', 'thrilled', 'delighted', 'cheerful', 'elated'],
    sadness: ['sad', 'depressed', 'down', 'melancholy', 'miserable', 'gloomy', 'dejected'],
    anger: ['angry', 'mad', 'furious', 'irritated', 'annoyed', 'rage', 'frustrated'],
    anxiety: ['anxious', 'worried', 'nervous', 'concerned', 'stressed', 'tense', 'apprehensive'],
    fear: ['afraid', 'scared', 'terrified', 'frightened', 'panic', 'dread'],
    surprise: ['surprised', 'amazed', 'astonished', 'shocked', 'stunned'],
    disgust: ['disgusted', 'revolted', 'repulsed', 'sickened'],
    love: ['love', 'adore', 'cherish', 'treasure', 'care', 'affection'],
    gratitude: ['grateful', 'thankful', 'appreciative', 'blessed']
  };

  let primaryEmotion = 'neutral';
  let secondaryEmotion = null;
  let intensity = 0.5;
  let valence = 0;
  let arousal = 0.5;
  let confidence = 0.5;

  const emotionScores: Record<string, number> = {};

  // Calculate emotion scores
  for (const [emotion, keywords] of Object.entries(emotionPatterns)) {
    let score = 0;
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        score += 1;
      }
    }
    if (score > 0) {
      emotionScores[emotion] = score;
    }
  }

  // Find primary and secondary emotions
  const sortedEmotions = Object.entries(emotionScores)
    .sort(([, a], [, b]) => b - a);

  if (sortedEmotions.length > 0) {
    primaryEmotion = sortedEmotions[0][0];
    intensity = Math.min(sortedEmotions[0][1] * 0.3, 1);
    confidence = Math.min(sortedEmotions[0][1] * 0.2 + 0.5, 1);
    
    if (sortedEmotions.length > 1) {
      secondaryEmotion = sortedEmotions[1][0];
    }
  }

  // Calculate valence and arousal
  switch (primaryEmotion) {
    case 'joy':
    case 'love':
    case 'gratitude':
      valence = 0.8;
      arousal = 0.7;
      break;
    case 'sadness':
      valence = -0.7;
      arousal = 0.3;
      break;
    case 'anger':
      valence = -0.6;
      arousal = 0.8;
      break;
    case 'anxiety':
    case 'fear':
      valence = -0.5;
      arousal = 0.7;
      break;
    case 'surprise':
      valence = 0.1;
      arousal = 0.8;
      break;
    case 'disgust':
      valence = -0.4;
      arousal = 0.4;
      break;
    default:
      valence = 0;
      arousal = 0.5;
  }

  return {
    primary: primaryEmotion,
    secondary: secondaryEmotion,
    intensity,
    valence,
    arousal,
    confidence
  };
}
