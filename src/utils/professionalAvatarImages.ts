// Professional Avatar Images - Real therapist portraits
import drSarahChenImg from '@/assets/avatars/dr-sarah-chen.jpg';
import drMichaelTorresImg from '@/assets/avatars/dr-michael-torres.jpg';
import drAishaPatelImg from '@/assets/avatars/dr-aisha-patel.jpg';
import drJamesWilsonImg from '@/assets/avatars/dr-james-wilson.jpg';
import drEmilyRodriguezImg from '@/assets/avatars/dr-emily-rodriguez.jpg';
import drDavidKimImg from '@/assets/avatars/dr-david-kim.jpg';

// Professional avatar images mapped to therapist IDs
export const professionalAvatarImages = {
  'dr-sarah-chen': drSarahChenImg,
  'dr-michael-torres': drMichaelTorresImg,
  'dr-aisha-patel': drAishaPatelImg,
  'dr-james-wilson': drJamesWilsonImg,
  'dr-emily-rodriguez': drEmilyRodriguezImg,
  'dr-david-kim': drDavidKimImg,
  
  // Legacy mappings for other therapist IDs
  'dr-maya-patel': drAishaPatelImg,
  'dr-alex-rodriguez': drEmilyRodriguezImg,
  'dr-jordan-kim': drDavidKimImg,
  'dr-taylor-morgan': drEmilyRodriguezImg,
  'dr-river-stone': drMichaelTorresImg,
  'dr-michael-rivers': drMichaelTorresImg,
  'dr-emma-thompson': drEmilyRodriguezImg,
  'dr-james-rodriguez': drJamesWilsonImg,
  'dr-jordan-taylor': drDavidKimImg,
  'dr-riley-chen': drSarahChenImg,
  'dr-sam-morgan': drMichaelTorresImg,
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