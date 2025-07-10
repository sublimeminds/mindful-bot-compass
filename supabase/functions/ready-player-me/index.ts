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

async function createAvatar({ therapistId, gender = 'female', style = 'professional' }) {
  console.log('Creating avatar for:', therapistId, 'Gender:', gender, 'Style:', style);
  
  // Generate consistent avatar based on therapist ID
  const avatarConfig = getAvatarConfig(therapistId, gender, style);
  
  try {
    const response = await fetch('https://api.readyplayer.me/v1/avatars', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${readyPlayerMeApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(avatarConfig),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Ready Player Me API Error:', response.status, errorData);
      throw new Error(`API Error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    console.log('Avatar created successfully:', data);
    
    return new Response(JSON.stringify({ 
      avatarUrl: data.modelUrl || data.url,
      avatarId: data.id,
      therapistId: therapistId
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating avatar:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      therapistId: therapistId 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

function getAvatarConfig(therapistId: string, gender: string, style: string) {
  // Generate consistent appearance for each therapist
  const baseConfig = {
    bodyType: gender,
    outfitGender: gender,
    assets: {}
  };

  // Therapist-specific configurations for diversity and professionalism
  const therapistConfigs = {
    'dr-sarah-chen': {
      ...baseConfig,
      assets: {
        hair: 'hair_032',
        top: 'top_009', // Professional blouse
        bottom: 'bottom_005', // Professional skirt
        footwear: 'footwear_003', // Professional heels
        skinTone: 'light_medium'
      }
    },
    'dr-michael-rivers': {
      ...baseConfig,
      bodyType: 'male',
      outfitGender: 'male',
      assets: {
        hair: 'hair_021',
        top: 'top_015', // Business shirt
        bottom: 'bottom_008', // Dress pants
        footwear: 'footwear_008', // Dress shoes
        facialHair: 'facialHair_001',
        skinTone: 'medium'
      }
    },
    'dr-alex-rodriguez': {
      ...baseConfig,
      bodyType: 'male',
      outfitGender: 'male',
      assets: {
        hair: 'hair_018',
        top: 'top_014', // Professional shirt
        bottom: 'bottom_007', // Dress pants
        footwear: 'footwear_007', // Professional shoes
        skinTone: 'medium_dark'
      }
    },
    'dr-maya-patel': {
      ...baseConfig,
      assets: {
        hair: 'hair_025',
        top: 'top_012', // Professional top
        bottom: 'bottom_003', // Professional pants
        footwear: 'footwear_002', // Professional flats
        skinTone: 'medium'
      }
    },
    'dr-jordan-kim': {
      ...baseConfig,
      bodyType: 'male',
      outfitGender: 'male',
      assets: {
        hair: 'hair_019',
        top: 'top_016', // Professional shirt
        bottom: 'bottom_009', // Dress pants
        footwear: 'footwear_009', // Professional shoes
        skinTone: 'light_medium'
      }
    }
  };

  return therapistConfigs[therapistId] || baseConfig;
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