// Service to map therapist IDs to avatar personas
export const therapistAvatarMapping = {
  // Database IDs
  'ed979f27-2491-43f1-a779-5095febb68b2': 'dr-sarah-chen',     // Dr. Sarah Chen - CBT
  '9492ab1a-eab2-4c5f-a8e3-40870b2ca857': 'dr-maya-patel',     // Dr. Maya Patel - Mindfulness
  '0772c602-306b-42ad-b610-2dc15ba06714': 'dr-alex-rodriguez',  // Dr. Alex Rodriguez - Solution-Focused
  '2fee5506-ee6d-4504-bab7-2ba922bdc99a': 'dr-jordan-kim',     // Dr. Jordan Kim - Trauma
  '84148de7-b04d-4547-9d9b-80665efbd4af': 'dr-taylor-morgan',  // Dr. Taylor Morgan - Relationship
  '79298cfb-6997-4cc6-9b21-ffaacb525c54': 'dr-river-stone',    // Dr. River Stone - Holistic
  'e352e13d-99f9-4ffc-95a6-a05c3d935b74': 'dr-michael-rivers', // Dr. Michael Rivers - Mindfulness
  '88a93e17-4338-4834-b360-55c9db4cc667': 'dr-emma-thompson',  // Dr. Emma Thompson - Humanistic
  '1588e859-69a6-4b88-b2cc-c377441ac08c': 'dr-james-rodriguez', // Dr. James Rodriguez - Solution-Focused
  
  // Additional database IDs from latest data
  '67e46397-8bc1-42c8-a075-ec4bf0a4dc6a': 'dr-sarah-chen',     // Dr. Sarah Chen
  'b62465f0-6872-4f2c-9931-28d35adf8613': 'dr-maya-patel',     // Dr. Maya Patel
  'adbc185d-9567-4d89-9d4e-9cf3460ec91f': 'dr-alex-rodriguez', // Dr. Alex Rodriguez
  'dd76b28e-d632-4e67-9519-a06fdcf01c8b': 'dr-jordan-kim',     // Dr. Jordan Kim
  '3fa85f64-5717-4562-b3fc-2c963f66afa6': 'dr-taylor-morgan',  // Dr. Taylor Morgan
  '6ba7b810-9dad-11d1-80b4-00c04fd430c8': 'dr-river-stone',    // Dr. River Stone
  '6ba7b811-9dad-11d1-80b4-00c04fd430c8': 'dr-michael-rivers', // Dr. Michael Rivers
  '6ba7b812-9dad-11d1-80b4-00c04fd430c8': 'dr-emma-thompson',  // Dr. Emma Thompson
  '6ba7b813-9dad-11d1-80b4-00c04fd430c8': 'dr-james-rodriguez', // Dr. James Rodriguez
  
  // New specialized therapists
  'a1b2c3d4-5e6f-7890-abcd-ef1234567890': 'dr-jordan-taylor',  // ADHD Specialist
  'b2c3d4e5-6f78-9012-bcde-f23456789012': 'dr-riley-chen',     // LGBTQ+ Affirming
  'c3d4e5f6-7890-1234-cdef-345678901234': 'dr-sam-morgan',     // Couples Specialist
  
  // Carousel therapist IDs
  'cbt-specialist': 'dr-sarah-chen',        // Dr. Sarah Chen - CBT Specialist
  'mindfulness-coach': 'dr-maya-patel',     // Dr. Maya Patel - Mindfulness Coach
  'solution-focused': 'dr-alex-rodriguez',  // Dr. Alex Rodriguez - Solution-Focused
  'trauma-informed': 'dr-jordan-kim',       // Dr. Jordan Kim - Trauma-Informed
  'relationship-counselor': 'dr-taylor-morgan', // Dr. Taylor Morgan - Relationship Counselor
  
  // Legacy numeric IDs for backward compatibility
  '1': 'dr-sarah-chen',
  '2': 'dr-alex-rodriguez', 
  '3': 'dr-maya-patel',
} as const;

export const getAvatarIdForTherapist = (therapistId: string): string => {
  // Safety checks
  if (!therapistId) {
    console.warn('getAvatarIdForTherapist: No therapistId provided, using default');
    return 'dr-sarah-chen';
  }
  
  const avatarId = therapistAvatarMapping[therapistId as keyof typeof therapistAvatarMapping];
  if (!avatarId) {
    console.warn(`getAvatarIdForTherapist: No mapping found for ${therapistId}, using default`);
    return 'dr-sarah-chen';
  }
  
  return avatarId;
};

export const getVoiceIdForTherapist = (therapistId: string): string => {
  // Map therapists to ElevenLabs voice IDs with correct gender matching
  const voiceMapping = {
    // Database IDs - Female therapists
    'ed979f27-2491-43f1-a779-5095febb68b2': 'EXAVITQu4vr4xnSDxMaL', // Dr. Sarah Chen - warm analytical female (Sarah)
    '9492ab1a-eab2-4c5f-a8e3-40870b2ca857': 'cgSgspJ2msm6clMCkdW9', // Dr. Maya Patel - gentle mindful female (Jessica)
    '84148de7-b04d-4547-9d9b-80665efbd4af': 'XB0fDUnXU5powFXDhCwa', // Dr. Taylor Morgan - empathetic female (Charlotte)
    '88a93e17-4338-4834-b360-55c9db4cc667': 'pFZP5JQG7iQjIQuC4Bku', // Dr. Emma Thompson - warm humanistic female (Lily)
    
    // Database IDs - Male therapists  
    '0772c602-306b-42ad-b610-2dc15ba06714': 'TX3LPaxmHKxFdv7VOQHJ', // Dr. Alex Rodriguez - energetic male (Liam)
    '2fee5506-ee6d-4504-bab7-2ba922bdc99a': 'onwK4e9ZLuTAKqWW03F9', // Dr. Jordan Kim - gentle trauma-informed male (Daniel)
    '79298cfb-6997-4cc6-9b21-ffaacb525c54': 'bIHbv24MWmeRgasZH58o', // Dr. River Stone - wise holistic male (Will)
    'e352e13d-99f9-4ffc-95a6-a05c3d935b74': 'JBFqnCBsd6RMkjVDRZzb', // Dr. Michael Rivers - calm mindful male (George)
    '1588e859-69a6-4b88-b2cc-c377441ac08c': 'cjVigY5qzO86Huf0OWal', // Dr. James Rodriguez - optimistic male (Eric)
    
    // Additional database IDs - maintaining same gender mapping
    '67e46397-8bc1-42c8-a075-ec4bf0a4dc6a': 'EXAVITQu4vr4xnSDxMaL', // Dr. Sarah Chen
    'b62465f0-6872-4f2c-9931-28d35adf8613': 'cgSgspJ2msm6clMCkdW9', // Dr. Maya Patel
    'adbc185d-9567-4d89-9d4e-9cf3460ec91f': 'TX3LPaxmHKxFdv7VOQHJ', // Dr. Alex Rodriguez
    'dd76b28e-d632-4e67-9519-a06fdcf01c8b': 'onwK4e9ZLuTAKqWW03F9', // Dr. Jordan Kim
    '3fa85f64-5717-4562-b3fc-2c963f66afa6': 'XB0fDUnXU5powFXDhCwa', // Dr. Taylor Morgan
    '6ba7b810-9dad-11d1-80b4-00c04fd430c8': 'bIHbv24MWmeRgasZH58o', // Dr. River Stone
    '6ba7b811-9dad-11d1-80b4-00c04fd430c8': 'JBFqnCBsd6RMkjVDRZzb', // Dr. Michael Rivers
    '6ba7b812-9dad-11d1-80b4-00c04fd430c8': 'pFZP5JQG7iQjIQuC4Bku', // Dr. Emma Thompson
    '6ba7b813-9dad-11d1-80b4-00c04fd430c8': 'cjVigY5qzO86Huf0OWal', // Dr. James Rodriguez
    
    // New specialized therapists
    'a1b2c3d4-5e6f-7890-abcd-ef1234567890': 'TX3LPaxmHKxFdv7VOQHJ', // Dr. Jordan Taylor - energetic ADHD specialist (male)
    'b2c3d4e5-6f78-9012-bcde-f23456789012': 'cgSgspJ2msm6clMCkdW9', // Dr. Riley Chen - affirming LGBTQ+ voice (female)
    'c3d4e5f6-7890-1234-cdef-345678901234': 'EXAVITQu4vr4xnSDxMaL', // Dr. Sam Morgan - balanced couples voice (female)
    
    // Carousel therapist IDs
    'cbt-specialist': 'EXAVITQu4vr4xnSDxMaL',        // Dr. Sarah Chen - CBT Specialist (female)
    'mindfulness-coach': 'cgSgspJ2msm6clMCkdW9',     // Dr. Maya Patel - Mindfulness Coach (female)
    'solution-focused': 'TX3LPaxmHKxFdv7VOQHJ',      // Dr. Alex Rodriguez - Solution-Focused (male)
    'trauma-informed': 'onwK4e9ZLuTAKqWW03F9',       // Dr. Jordan Kim - Trauma-Informed (male)
    'relationship-counselor': 'XB0fDUnXU5powFXDhCwa', // Dr. Taylor Morgan - Relationship Counselor (female)
    
    // Legacy numeric IDs
    '1': 'EXAVITQu4vr4xnSDxMaL', // Sarah
    '2': 'onwK4e9ZLuTAKqWW03F9', // Daniel
    '3': 'cgSgspJ2msm6clMCkdW9', // Jessica
  } as const;
  
  return voiceMapping[therapistId as keyof typeof voiceMapping] || 'EXAVITQu4vr4xnSDxMaL';
};