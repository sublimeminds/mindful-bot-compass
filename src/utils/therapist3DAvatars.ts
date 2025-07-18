// 3D Animated AI Therapist Character Avatars
import drSarahChenImg from '@/assets/avatars/3d/dr-sarah-chen.jpg';
import drMayaPatelImg from '@/assets/avatars/3d/dr-maya-patel.jpg';
import drAlexRodriguezImg from '@/assets/avatars/3d/dr-alex-rodriguez.jpg';
import drJordanKimImg from '@/assets/avatars/3d/dr-jordan-kim.jpg';
import drTaylorMorganImg from '@/assets/avatars/3d/dr-taylor-morgan.jpg';
import drRiverStoneImg from '@/assets/avatars/3d/dr-river-stone.jpg';
import drMichaelRiversImg from '@/assets/avatars/3d/dr-michael-rivers.jpg';
import drEmmaThompsonImg from '@/assets/avatars/3d/dr-emma-thompson.jpg';
import drJamesRodriguezImg from '@/assets/avatars/3d/dr-james-rodriguez.jpg';
import drJordanTaylorImg from '@/assets/avatars/3d/dr-jordan-taylor.jpg';
import drRileyChenImg from '@/assets/avatars/3d/dr-riley-chen.jpg';
import drSamMorganImg from '@/assets/avatars/3d/dr-sam-morgan.jpg';
import drCaseyWilliamsImg from '@/assets/avatars/3d/dr-casey-williams.jpg';
import drAlexKimImg from '@/assets/avatars/3d/dr-alex-kim.jpg';
import drPhoenixRiveraImg from '@/assets/avatars/3d/dr-phoenix-rivera.jpg';
import drSageThompsonImg from '@/assets/avatars/3d/dr-sage-thompson.jpg';

// New specialized therapist avatars
import drLunaMartinezImg from '@/assets/avatars/3d/dr-luna-martinez.jpg';
import drFelixChenImg from '@/assets/avatars/3d/dr-felix-chen.jpg';
import drRiverThompsonImg from '@/assets/avatars/3d/dr-river-thompson.jpg';
import drNovaSleepImg from '@/assets/avatars/3d/dr-nova-sleep.jpg';
import drSageWilliamsImg from '@/assets/avatars/3d/dr-sage-williams.jpg';
import drPhoenixCarterImg from '@/assets/avatars/3d/dr-phoenix-carter.jpg';
import drSkyAndersonImg from '@/assets/avatars/3d/dr-sky-anderson.jpg';
import drWillowGraceImg from '@/assets/avatars/3d/dr-willow-grace.jpg';

// 3D animated AI therapist avatars mapped to therapist IDs
export const therapist3DAvatars: Record<string, string> = {
  // Original therapists with new 3D avatars
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

  // New specialized therapist avatars
  'dr-luna-martinez': drLunaMartinezImg,
  'dr-felix-chen': drFelixChenImg,
  'dr-river-thompson': drRiverThompsonImg,
  'dr-nova-sleep': drNovaSleepImg,
  'dr-sage-williams': drSageWilliamsImg,
  'dr-phoenix-carter': drPhoenixCarterImg,
  'dr-sky-anderson': drSkyAndersonImg,
  'dr-willow-grace': drWillowGraceImg,
};

/**
 * Get 3D avatar image for a therapist by ID
 */
export const getTherapist3DAvatar = (therapistId: string): string | undefined => {
  return therapist3DAvatars[therapistId];
};

/**
 * Get therapist ID from name (for backwards compatibility)
 */
export const getTherapistIdFromName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
};

/**
 * Check if a therapist has a 3D avatar available
 */
export const hasTherapist3DAvatar = (therapistId: string): boolean => {
  return therapistId in therapist3DAvatars;
};