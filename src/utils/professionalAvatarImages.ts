// 3D Animated AI Therapist Character Avatars - Modern 3D characters for AI therapy
import { therapist3DAvatars } from './therapist3DAvatars';

// Use 3D avatars as the primary avatar system
export const professionalAvatarImages = {
  ...therapist3DAvatars,
  
  // Legacy mappings for backward compatibility
  'dr-aisha-patel': therapist3DAvatars['dr-maya-patel'],
  'dr-james-wilson': therapist3DAvatars['dr-james-rodriguez'],
  'dr-emily-rodriguez': therapist3DAvatars['dr-emma-thompson'],
  'dr-david-kim': therapist3DAvatars['dr-jordan-kim'],
  'dr-michael-torres': therapist3DAvatars['dr-michael-rivers'],
} as const;

// Get professional avatar image with fallback
export const getProfessionalAvatarImage = (therapistId: string): string | null => {
  const image = professionalAvatarImages[therapistId as keyof typeof professionalAvatarImages];
  return image || null;
};

// Check if professional avatar exists
export const hasProfessionalAvatar = (therapistId: string): boolean => {
  return therapistId in professionalAvatarImages;
};