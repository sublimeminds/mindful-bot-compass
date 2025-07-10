import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const readyPlayerMeApiKey = Deno.env.get('READY_PLAYER_ME_API_KEY');

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
      case 'createAvatar':
        return await createAvatar(params);
      case 'getAvatar':
        return await getAvatar(params);
      case 'updateExpression':
        return await updateExpression(params);
      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Error in ready-player-me function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function createAvatar({ gender = 'female', style = 'professional' }) {
  const response = await fetch('https://api.readyplayer.me/v1/avatars', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${readyPlayerMeApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      bodyType: gender,
      assets: {
        // Professional therapist appearance
        top: style === 'professional' ? 'business_shirt' : 'casual_top',
        bottom: style === 'professional' ? 'business_pants' : 'casual_pants',
        footwear: 'professional_shoes',
        hair: 'professional_hair',
        facialHair: gender === 'male' ? 'neat_beard' : 'none'
      }
    }),
  });

  const data = await response.json();
  
  return new Response(JSON.stringify({ 
    avatarUrl: data.url,
    avatarId: data.id 
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getAvatar({ avatarId }) {
  const response = await fetch(`https://api.readyplayer.me/v1/avatars/${avatarId}`, {
    headers: {
      'Authorization': `Bearer ${readyPlayerMeApiKey}`,
    },
  });

  const data = await response.json();
  
  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function updateExpression({ avatarId, emotion, intensity = 0.7 }) {
  // Map therapy emotions to Ready Player Me expressions
  const emotionMap = {
    'neutral': 'neutral',
    'happy': 'joy',
    'concerned': 'concern',
    'encouraging': 'supportive',
    'thoughtful': 'contemplative',
    'empathetic': 'understanding'
  };

  const expression = emotionMap[emotion] || 'neutral';

  const response = await fetch(`https://api.readyplayer.me/v1/avatars/${avatarId}/expressions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${readyPlayerMeApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      expression,
      intensity,
      duration: 2000 // 2 seconds
    }),
  });

  const data = await response.json();
  
  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}