import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const didApiKey = Deno.env.get('D_ID_API_KEY');

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
      case 'animateAvatar':
        return await animateAvatar(params);
      case 'getPresenter':
        return await getPresenter(params);
      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Error in d-id-avatar function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function createAvatar({ therapistId, gender = 'female', style = 'professional' }) {
  console.log('Creating D-ID avatar for:', therapistId, 'Gender:', gender, 'Style:', style);
  
  if (!didApiKey) {
    console.error('D-ID API key is missing');
    return new Response(JSON.stringify({ 
      error: 'D-ID API key not configured',
      therapistId: therapistId 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const avatarConfig = getAvatarConfig(therapistId, gender, style);
    console.log('Using D-ID avatar config:', avatarConfig);
    
    const response = await fetch('https://api.d-id.com/images', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${didApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(avatarConfig),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('D-ID API Error:', response.status, errorData);
      
      // Fall back to professional stock images
      const fallbackAvatars = getProfessionalFallbacks(gender, therapistId);
      console.log('Using fallback avatar due to API error');
      
      return new Response(JSON.stringify({ 
        avatarUrl: fallbackAvatars.imageUrl,
        avatarId: `${therapistId}-${gender}-fallback`,
        therapistId: therapistId,
        fallback: true,
        error: `API Error: ${response.status}`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('D-ID avatar created successfully:', data);
    
    return new Response(JSON.stringify({ 
      avatarUrl: data.result_url,
      avatarId: data.id,
      therapistId: therapistId,
      fallback: false
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error creating D-ID avatar:', error);
    
    // Fall back to professional stock images
    const fallbackAvatars = getProfessionalFallbacks(gender, therapistId);
    console.log('Using fallback avatar due to error');
    
    return new Response(JSON.stringify({ 
      avatarUrl: fallbackAvatars.imageUrl,
      avatarId: `${therapistId}-${gender}-fallback`,
      therapistId: therapistId,
      fallback: true,
      error: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

function getAvatarConfig(therapistId: string, gender: string, style: string) {
  console.log('Creating D-ID config for:', { therapistId, gender, style });
  
  // Professional healthcare avatar configurations
  const baseConfig = {
    source_url: gender === 'male' ? 
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face' :
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
    config: {
      fluent: true,
      pad_audio: 0.0,
      align_driver: true,
      auto_match: true,
      normalization_factor: 1,
      sharpen: true,
      stitch: true,
      reduce_noise: true
    },
    presenter_config: {
      type: 'talk',
      expressions: {
        start_frame: 0,
        expression: 'neutral',
        intensity: 0.5
      }
    }
  };

  // UUID to therapist mapping from TherapistMatcher
  const therapistUUIDs = {
    'ed979f27-2491-43f1-a779-5095febb68b2': 'dr-sarah-chen',     // Dr. Sarah Chen
    '9492ab1a-eab2-4c5f-a8e3-40870b2ca857': 'dr-maya-patel',     // Dr. Maya Patel
    '0772c602-306b-42ad-b610-2dc15ba06714': 'dr-alex-rodriguez',  // Dr. Alex Rodriguez
    '2fee5506-ee6d-4504-bab7-2ba922bdc99a': 'dr-jordan-kim',     // Dr. Jordan Kim
    '84148de7-b04d-4547-9d9b-80665efbd4af': 'dr-taylor-morgan',  // Dr. Taylor Morgan
    '79298cfb-6997-4cc6-9b21-ffaacb525c54': 'dr-river-stone'     // Dr. River Stone
  };

  // Therapist-specific professional avatars
  const therapistConfigs = {
    'dr-sarah-chen': {
      ...baseConfig,
      source_url: 'https://images.unsplash.com/photo-1594824388841-a4b558dec6f2?w=400&h=400&fit=crop&crop=face',
      presenter_config: {
        ...baseConfig.presenter_config,
        expressions: {
          start_frame: 0,
          expression: 'friendly',
          intensity: 0.6
        }
      }
    },
    'dr-maya-patel': {
      ...baseConfig,
      source_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
      presenter_config: {
        ...baseConfig.presenter_config,
        expressions: {
          start_frame: 0,
          expression: 'calm',
          intensity: 0.6
        }
      }
    },
    'dr-alex-rodriguez': {
      ...baseConfig,
      source_url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face',
      presenter_config: {
        ...baseConfig.presenter_config,
        expressions: {
          start_frame: 0,
          expression: 'warm',
          intensity: 0.7
        }
      }
    },
    'dr-jordan-kim': {
      ...baseConfig,
      source_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      presenter_config: {
        ...baseConfig.presenter_config,
        expressions: {
          start_frame: 0,
          expression: 'understanding',
          intensity: 0.5
        }
      }
    },
    'dr-taylor-morgan': {
      ...baseConfig,
      source_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
      presenter_config: {
        ...baseConfig.presenter_config,
        expressions: {
          start_frame: 0,
          expression: 'supportive',
          intensity: 0.6
        }
      }
    },
    'dr-river-stone': {
      ...baseConfig,
      source_url: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=400&fit=crop&crop=face',
      presenter_config: {
        ...baseConfig.presenter_config,
        expressions: {
          start_frame: 0,
          expression: 'peaceful',
          intensity: 0.6
        }
      }
    }
  };

  // Handle UUID input by mapping to string IDs
  const mappedTherapistId = therapistUUIDs[therapistId] || therapistId;

  const config = therapistConfigs[mappedTherapistId] || baseConfig;
  console.log('Final D-ID config:', config);
  return config;
}

function getProfessionalFallbacks(gender: string, therapistId: string) {
  const fallbacks = {
    male: {
      imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
      name: 'Professional Male Therapist'
    },
    female: {
      imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
      name: 'Professional Female Therapist'
    }
  };
  
  return fallbacks[gender] || fallbacks.female;
}

async function animateAvatar({ avatarId, text, emotion = 'neutral' }) {
  if (!didApiKey) {
    throw new Error('D-ID API key not configured');
  }

  const response = await fetch('https://api.d-id.com/talks', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${didApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      source_url: avatarId,
      script: {
        type: 'text',
        input: text,
        provider: {
          type: 'elevenlabs',
          voice_id: 'EXAVITQu4vr4xnSDxMaL', // Sarah voice
        }
      },
      config: {
        fluent: true,
        pad_audio: 0.0
      }
    }),
  });

  const data = await response.json();
  
  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getPresenter({ presenterId }) {
  if (!didApiKey) {
    throw new Error('D-ID API key not configured');
  }

  const response = await fetch(`https://api.d-id.com/talks/${presenterId}`, {
    headers: {
      'Authorization': `Basic ${didApiKey}`,
    },
  });

  const data = await response.json();
  
  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}