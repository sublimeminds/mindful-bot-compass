
// Professional AI Therapist Avatar Images - Semi-realistic, trustworthy style
import drSarahChenImg from '@/assets/avatars/professional/dr-sarah-chen.jpg';
import drJordanKimImg from '@/assets/avatars/professional/dr-jordan-kim.jpg';
import drMayaPatelImg from '@/assets/avatars/professional/dr-maya-patel.jpg';
import drAlexRodriguezImg from '@/assets/avatars/professional/dr-alex-rodriguez.jpg';
import drTaylorMorganImg from '@/assets/avatars/professional/dr-taylor-morgan.jpg';
import drRiverStoneImg from '@/assets/avatars/professional/dr-river-stone.jpg';
import drLunaMartinezImg from '@/assets/avatars/professional/dr-luna-martinez.jpg';
import drFelixChenImg from '@/assets/avatars/professional/dr-felix-chen.jpg';
import drRiverThompsonImg from '@/assets/avatars/professional/dr-river-thompson.jpg';
import drNovaSleepImg from '@/assets/avatars/professional/dr-nova-sleep.jpg';
import drSageWilliamsImg from '@/assets/avatars/professional/dr-sage-williams.jpg';
import drPhoenixCarterImg from '@/assets/avatars/professional/dr-phoenix-carter.jpg';
import drSkyAndersonImg from '@/assets/avatars/professional/dr-sky-anderson.jpg';
import drWillowGraceImg from '@/assets/avatars/professional/dr-willow-grace.jpg';
// Additional unique therapist avatars
import drMichaelRiversImg from '@/assets/avatars/professional/dr-michael-rivers.jpg';
import drEmmaThompsonImg from '@/assets/avatars/professional/dr-emma-thompson.jpg';
import drJamesRodriguezImg from '@/assets/avatars/professional/dr-james-rodriguez.jpg';
import drRileyChenImg from '@/assets/avatars/professional/dr-riley-chen.jpg';
import drJordanTaylorImg from '@/assets/avatars/professional/dr-jordan-taylor.jpg';
import drCaseyWilliamsImg from '@/assets/avatars/professional/dr-casey-williams.jpg';
import drAlexKimImg from '@/assets/avatars/professional/dr-alex-kim.jpg';
import drSamMorganImg from '@/assets/avatars/professional/dr-sam-morgan.jpg';
import drPhoenixRiveraImg from '@/assets/avatars/professional/dr-phoenix-rivera.jpg';
import drSageThompsonImg from '@/assets/avatars/professional/dr-sage-thompson.jpg';

// Professional avatar mappings - using semi-realistic, trustworthy AI-generated portraits
export const professionalAvatarImages = {
  // Core therapists with professional portraits
  'dr-sarah-chen': drSarahChenImg,
  'ed979f27-2491-43f1-a779-5095febb68b2': drSarahChenImg, // Dr. Sarah Chen
  
  'dr-jordan-kim': drJordanKimImg,
  '2fee5506-ee6d-4504-bab7-2ba922bdc99a': drJordanKimImg, // Dr. Jordan Kim
  
  'dr-maya-patel': drMayaPatelImg,
  '9492ab1a-eab2-4c5f-a8e3-40870b2ca857': drMayaPatelImg, // Dr. Maya Patel
  
  'dr-alex-rodriguez': drAlexRodriguezImg,
  '0772c602-306b-42ad-b610-2dc15ba06714': drAlexRodriguezImg, // Dr. Alex Rodriguez
  
  'dr-taylor-morgan': drTaylorMorganImg,
  '84148de7-b04d-4547-9d9b-80665efbd4af': drTaylorMorganImg, // Dr. Taylor Morgan
  
  'dr-river-stone': drRiverStoneImg,
  '79298cfb-6997-4cc6-9b21-ffaacb525c54': drRiverStoneImg, // Dr. River Stone
  
  'dr-michael-rivers': drMichaelRiversImg,
  'e352e13d-99f9-4ffc-95a6-a05c3d935b74': drMichaelRiversImg,
  
  'dr-emma-thompson': drEmmaThompsonImg,
  '88a93e17-4338-4834-b360-55c9db4cc667': drEmmaThompsonImg,
  
  'dr-james-martinez': drJamesRodriguezImg,
  '1588e859-69a6-4b88-b2cc-c377441ac08c': drJamesRodriguezImg,
  
  // Additional therapists with unique avatars
  'dr-riley-chen': drRileyChenImg,
  'dr-jordan-taylor': drJordanTaylorImg,
  'dr-casey-williams': drCaseyWilliamsImg,
  'dr-alex-kim': drAlexKimImg,
  'dr-sam-morgan': drSamMorganImg,
  'dr-phoenix-rivera': drPhoenixRiveraImg,
  'dr-sage-thompson': drSageThompsonImg,
  
  // New specialized therapists
  'dr-luna-martinez': drLunaMartinezImg,
  'dr-felix-chen': drFelixChenImg,
  'dr-river-thompson': drRiverThompsonImg,
  'dr-nova-sleep': drNovaSleepImg,
  'dr-sage-williams': drSageWilliamsImg,
  'dr-phoenix-carter': drPhoenixCarterImg,
  'dr-sky-anderson': drSkyAndersonImg,
  'dr-willow-grace': drWillowGraceImg,
} as const;

// Get professional avatar image with fallback
export const getProfessionalAvatarImage = (therapistId: string): string | null => {
  const image = professionalAvatarImages[therapistId as keyof typeof professionalAvatarImages];
  return image || professionalAvatarImages['dr-sarah-chen']; // Default fallback
};

// Check if professional avatar exists
export const hasProfessionalAvatar = (therapistId: string): boolean => {
  return therapistId in professionalAvatarImages;
};

// Avatar style guidelines for consistency
export const avatarStyleGuidelines = {
  style: 'semi-realistic',
  characteristics: [
    'Professional appearance',
    'Trustworthy and approachable',
    'Clearly AI-generated but human-like',
    'Diverse representation',
    'Consistent lighting and composition',
    'Neutral, calming backgrounds'
  ],
  colorPalette: [
    'Soft, muted tones',
    'Professional attire colors',
    'Calming backgrounds (blues, greens, warm grays)',
    'Natural skin tones with diversity'
  ],
  emotionalTone: [
    'Calm and reassuring',
    'Approachable but professional',
    'Empathetic expression',
    'Confident but not intimidating'
  ]
};
