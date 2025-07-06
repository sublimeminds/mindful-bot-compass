// Service to map therapist IDs to avatar personas
export const therapistAvatarMapping = {
  '1': 'dr-sarah-chen',      // Dr. Sarah Chen - CBT
  '2': 'dr-alex-rodriguez',  // Dr. Michael Rodriguez -> Alex (trauma specialist)
  '3': 'dr-maya-patel',     // Dr. Emily Johnson -> Maya (mindfulness)
} as const;

export const getAvatarIdForTherapist = (therapistId: string): string => {
  return therapistAvatarMapping[therapistId as keyof typeof therapistAvatarMapping] || 'dr-sarah-chen';
};

export const getVoiceIdForTherapist = (therapistId: string): string => {
  // Map therapists to ElevenLabs voice IDs
  const voiceMapping = {
    '1': 'EXAVITQu4vr4xnSDxMaL', // Sarah - warm female voice
    '2': 'onwK4e9ZLuTAKqWW03F9', // Michael/Alex - gentle male voice  
    '3': 'cgSgspJ2msm6clMCkdW9', // Emily/Maya - mindful female voice
  } as const;
  
  return voiceMapping[therapistId as keyof typeof voiceMapping] || 'EXAVITQu4vr4xnSDxMaL';
};