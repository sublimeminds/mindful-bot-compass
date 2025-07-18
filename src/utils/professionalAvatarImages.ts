
// Professional AI Therapist Avatar Images - Semi-realistic, trustworthy style
import drSarahChenImg from '@/assets/avatars/professional/dr-sarah-chen.jpg';
import drJordanKimImg from '@/assets/avatars/professional/dr-jordan-kim.jpg';

// Professional avatar mappings - using semi-realistic, trustworthy AI-generated portraits
export const professionalAvatarImages = {
  // Core therapists with professional portraits
  'dr-sarah-chen': drSarahChenImg,
  'ed979f27-2491-43f1-a779-5095febb68b2': drSarahChenImg, // Dr. Sarah Chen
  
  'dr-jordan-kim': drJordanKimImg,
  '2fee5506-ee6d-4504-bab7-2ba922bdc99a': drJordanKimImg, // Dr. Jordan Kim
  
  // Temporary placeholders for other therapists until we generate their professional portraits
  'dr-maya-patel': drSarahChenImg,
  '9492ab1a-eab2-4c5f-a8e3-40870b2ca857': drSarahChenImg,
  
  'dr-alex-rodriguez': drJordanKimImg,
  '0772c602-306b-42ad-b610-2dc15ba06714': drJordanKimImg,
  
  'dr-taylor-morgan': drSarahChenImg,
  '84148de7-b04d-4547-9d9b-80665efbd4af': drSarahChenImg,
  
  'dr-river-stone': drJordanKimImg,
  '79298cfb-6997-4cc6-9b21-ffaacb525c54': drJordanKimImg,
  
  'dr-michael-rivers': drJordanKimImg,
  'e352e13d-99f9-4ffc-95a6-a05c3d935b74': drJordanKimImg,
  
  'dr-emma-thompson': drSarahChenImg,
  '88a93e17-4338-4834-b360-55c9db4cc667': drSarahChenImg,
  
  'dr-james-rodriguez': drJordanKimImg,
  '1588e859-69a6-4b88-b2cc-c377441ac08c': drJordanKimImg,
  
  // New specialized therapists
  'dr-luna-martinez': drSarahChenImg,
  'dr-felix-chen': drJordanKimImg,
  'dr-river-thompson': drSarahChenImg,
  'dr-nova-sleep': drSarahChenImg,
  'dr-sage-williams': drSarahChenImg,
  'dr-phoenix-carter': drJordanKimImg,
  'dr-sky-anderson': drSarahChenImg,
  'dr-willow-grace': drSarahChenImg,
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
