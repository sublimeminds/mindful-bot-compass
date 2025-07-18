// Professional AI Therapist Avatar Images - High-quality professional portraits
import drSarahChenImg from '@/assets/avatars/dr-sarah-chen.jpg';
import drMayaPatelImg from '@/assets/avatars/dr-maya-patel.jpg';
import drAlexRodriguezImg from '@/assets/avatars/dr-alex-rodriguez.jpg';
import drJordanKimImg from '@/assets/avatars/dr-jordan-kim.jpg';
import drTaylorMorganImg from '@/assets/avatars/dr-taylor-morgan.jpg';
import drRiverStoneImg from '@/assets/avatars/dr-river-stone.jpg';
import drMichaelRiversImg from '@/assets/avatars/dr-michael-rivers.jpg';
import drEmmaThompsonImg from '@/assets/avatars/dr-emma-thompson.jpg';
import drJamesRodriguezImg from '@/assets/avatars/dr-james-rodriguez.jpg';
import drJordanTaylorImg from '@/assets/avatars/dr-jordan-taylor.jpg';
import drRileyChenImg from '@/assets/avatars/dr-riley-chen.jpg';
import drSamMorganImg from '@/assets/avatars/dr-sam-morgan.jpg';
import drCaseyWilliamsImg from '@/assets/avatars/dr-casey-williams.jpg';
import drAlexKimImg from '@/assets/avatars/dr-alex-kim.jpg';
import drPhoenixRiveraImg from '@/assets/avatars/dr-phoenix-rivera.jpg';
import drSageThompsonImg from '@/assets/avatars/dr-sage-thompson.jpg';

// Professional AI therapist avatars mapped to therapist IDs
export const professionalAvatarImages = {
  // Primary professional avatar images
  'dr-sarah-chen': drSarahChenImg,
  'dr-maya-patel': drMayaPatelImg,
  'dr-alex-rodriguez': drAlexRodriguezImg,
  'dr-jordan-kim': drJordanKimImg,
  'dr-taylor-morgan': drTaylorMorganImg,
  'dr-river-stone': drRiverStoneImg,
  'dr-michael-rivers': drMichaelRiversImg,
  'dr-emma-thompson': drEmmaThompsonImg,
  'dr-james-rodriguez': drJamesRodriguezImg,
  'dr-jordan-taylor': drJordanTaylorImg,
  'dr-riley-chen': drRileyChenImg,
  'dr-sam-morgan': drSamMorganImg,
  'dr-casey-williams': drCaseyWilliamsImg,
  'dr-alex-kim': drAlexKimImg,
  'dr-phoenix-rivera': drPhoenixRiveraImg,
  'dr-sage-thompson': drSageThompsonImg,
  
  // Legacy mappings for backward compatibility
  'dr-aisha-patel': drMayaPatelImg,
  'dr-james-wilson': drJamesRodriguezImg,
  'dr-emily-rodriguez': drEmmaThompsonImg,
  'dr-david-kim': drJordanKimImg,
  'dr-michael-torres': drMichaelRiversImg,
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