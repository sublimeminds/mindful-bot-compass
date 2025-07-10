import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const humeAiApiKey = Deno.env.get('HUME_AI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, ...params } = await req.json();

    switch (action) {
      case 'analyzeVoice':
        return await analyzeVoice(params);
      case 'analyzeText':
        return await analyzeText(params);
      case 'streamAnalysis':
        return await streamAnalysis(params);
      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Error in hume-emotion function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function analyzeVoice({ audioData, format = 'wav' }) {
  const formData = new FormData();
  formData.append('file', new Blob([audioData], { type: `audio/${format}` }));
  formData.append('models', JSON.stringify(['prosody', 'language']));

  const response = await fetch('https://api.hume.ai/v0/batch/jobs', {
    method: 'POST',
    headers: {
      'X-Hume-Api-Key': humeAiApiKey,
    },
    body: formData,
  });

  const data = await response.json();
  
  // Process the emotions for therapy context
  const processedEmotions = processEmotionsForTherapy(data.predictions);
  
  return new Response(JSON.stringify({
    emotions: processedEmotions,
    primaryEmotion: getPrimaryEmotion(processedEmotions),
    stressLevel: calculateStressLevel(processedEmotions),
    therapyInsights: generateTherapyInsights(processedEmotions)
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function analyzeText({ text }) {
  const response = await fetch('https://api.hume.ai/v0/batch/jobs', {
    method: 'POST',
    headers: {
      'X-Hume-Api-Key': humeAiApiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      models: ['language'],
      text: [{ text }]
    }),
  });

  const data = await response.json();
  const processedEmotions = processEmotionsForTherapy(data.predictions);
  
  return new Response(JSON.stringify({
    emotions: processedEmotions,
    sentiment: calculateSentiment(processedEmotions),
    therapeuticConcerns: identifyTherapeuticConcerns(processedEmotions)
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function streamAnalysis({ sessionId }) {
  // Set up WebSocket connection for real-time emotion analysis
  const wsUrl = `wss://api.hume.ai/v0/stream/models?apikey=${humeAiApiKey}`;
  
  return new Response(JSON.stringify({
    streamUrl: wsUrl,
    sessionId,
    instructions: 'Connect to this WebSocket for real-time emotion analysis'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function processEmotionsForTherapy(predictions) {
  if (!predictions || !predictions.length) return [];
  
  // Extract emotion scores and map to therapy-relevant emotions
  const emotions = predictions[0]?.emotions || [];
  const therapyEmotions = emotions
    .filter(emotion => emotion.score > 0.1) // Filter out very low scores
    .map(emotion => ({
      name: emotion.name,
      score: emotion.score,
      intensity: emotion.score > 0.7 ? 'high' : emotion.score > 0.4 ? 'medium' : 'low',
      therapeuticRelevance: getTherapeuticRelevance(emotion.name, emotion.score)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5); // Top 5 emotions
  
  return therapyEmotions;
}

function getPrimaryEmotion(emotions) {
  if (!emotions.length) return 'neutral';
  return emotions[0].name;
}

function calculateStressLevel(emotions) {
  const stressIndicators = ['anxiety', 'fear', 'anger', 'frustration', 'overwhelm'];
  const stressEmotions = emotions.filter(e => stressIndicators.includes(e.name.toLowerCase()));
  const avgStress = stressEmotions.reduce((sum, e) => sum + e.score, 0) / stressEmotions.length;
  return isNaN(avgStress) ? 0 : avgStress;
}

function calculateSentiment(emotions) {
  const positiveEmotions = ['joy', 'happiness', 'contentment', 'hope', 'gratitude'];
  const negativeEmotions = ['sadness', 'anger', 'fear', 'anxiety', 'frustration'];
  
  const positive = emotions.filter(e => positiveEmotions.includes(e.name.toLowerCase()));
  const negative = emotions.filter(e => negativeEmotions.includes(e.name.toLowerCase()));
  
  const positiveScore = positive.reduce((sum, e) => sum + e.score, 0);
  const negativeScore = negative.reduce((sum, e) => sum + e.score, 0);
  
  return positiveScore - negativeScore;
}

function getTherapeuticRelevance(emotionName, score) {
  const highConcernEmotions = ['suicidal', 'hopelessness', 'despair', 'panic'];
  const moderateConcernEmotions = ['anxiety', 'depression', 'anger', 'fear'];
  
  if (highConcernEmotions.includes(emotionName.toLowerCase()) && score > 0.6) {
    return 'high_concern';
  } else if (moderateConcernEmotions.includes(emotionName.toLowerCase()) && score > 0.5) {
    return 'moderate_concern';
  } else if (score > 0.3) {
    return 'notable';
  }
  return 'minimal';
}

function generateTherapyInsights(emotions) {
  const insights = [];
  
  // Check for crisis indicators
  const crisisEmotions = emotions.filter(e => e.therapeuticRelevance === 'high_concern');
  if (crisisEmotions.length > 0) {
    insights.push({
      type: 'crisis_alert',
      message: 'High-concern emotions detected. Consider crisis intervention protocols.',
      emotions: crisisEmotions.map(e => e.name)
    });
  }
  
  // Check for therapeutic opportunities
  const positiveEmotions = emotions.filter(e => ['joy', 'hope', 'gratitude'].includes(e.name.toLowerCase()));
  if (positiveEmotions.length > 0) {
    insights.push({
      type: 'positive_indicator',
      message: 'Positive emotions detected. Good opportunity for reinforcement.',
      emotions: positiveEmotions.map(e => e.name)
    });
  }
  
  return insights;
}

function identifyTherapeuticConcerns(emotions) {
  const concerns = [];
  
  emotions.forEach(emotion => {
    if (emotion.therapeuticRelevance === 'high_concern') {
      concerns.push({
        level: 'urgent',
        emotion: emotion.name,
        recommendation: 'Consider immediate intervention or professional referral'
      });
    } else if (emotion.therapeuticRelevance === 'moderate_concern') {
      concerns.push({
        level: 'moderate',
        emotion: emotion.name,
        recommendation: 'Address in upcoming sessions with appropriate techniques'
      });
    }
  });
  
  return concerns;
}