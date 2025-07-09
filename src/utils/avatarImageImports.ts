// Enhanced Avatar Image System - Professional portraits with safe fallbacks
import { getProfessionalAvatarImage, hasProfessionalAvatar } from './professionalAvatarImages';
import { placeholderAvatars } from './safeAvatarSystem';

// Export enhanced avatar images with professional photos
export const avatarImages = {
  'dr-sarah-chen': getProfessionalAvatarImage('dr-sarah-chen') || placeholderAvatars['dr-sarah-chen'],
  'dr-michael-torres': getProfessionalAvatarImage('dr-michael-torres') || placeholderAvatars['dr-michael-torres'],
  'dr-aisha-patel': getProfessionalAvatarImage('dr-aisha-patel') || placeholderAvatars['dr-aisha-patel'],
  'dr-james-wilson': getProfessionalAvatarImage('dr-james-wilson') || placeholderAvatars['dr-james-wilson'],
  'dr-emily-rodriguez': getProfessionalAvatarImage('dr-emily-rodriguez') || placeholderAvatars['dr-emily-rodriguez'],
  'dr-david-kim': getProfessionalAvatarImage('dr-david-kim') || placeholderAvatars['dr-david-kim'],
  // Legacy mappings with professional images
  'dr-maya-patel': getProfessionalAvatarImage('dr-maya-patel') || placeholderAvatars['dr-aisha-patel'],
  'dr-alex-rodriguez': getProfessionalAvatarImage('dr-alex-rodriguez') || placeholderAvatars['dr-emily-rodriguez'],
  'dr-jordan-kim': getProfessionalAvatarImage('dr-jordan-kim') || placeholderAvatars['dr-david-kim'],
  'dr-taylor-morgan': getProfessionalAvatarImage('dr-taylor-morgan') || placeholderAvatars['dr-emily-rodriguez'],
  'dr-river-stone': getProfessionalAvatarImage('dr-river-stone') || placeholderAvatars['dr-michael-torres'],
  'dr-michael-rivers': getProfessionalAvatarImage('dr-michael-rivers') || placeholderAvatars['dr-michael-torres'],
  'dr-emma-thompson': getProfessionalAvatarImage('dr-emma-thompson') || placeholderAvatars['dr-emily-rodriguez'],
  'dr-james-rodriguez': getProfessionalAvatarImage('dr-james-rodriguez') || placeholderAvatars['dr-james-wilson'],
  'dr-jordan-taylor': getProfessionalAvatarImage('dr-jordan-taylor') || placeholderAvatars['dr-david-kim'],
  'dr-riley-chen': getProfessionalAvatarImage('dr-riley-chen') || placeholderAvatars['dr-sarah-chen'],
  'dr-sam-morgan': getProfessionalAvatarImage('dr-sam-morgan') || placeholderAvatars['dr-michael-torres'],
} as const;

// Enhanced avatar getter with professional images and fallback
export const getAvatarImage = (therapistId: string): string => {
  // First try professional image
  const professionalImage = getProfessionalAvatarImage(therapistId);
  if (professionalImage) {
    return professionalImage;
  }
  
  // Then try from avatarImages mapping
  const image = avatarImages[therapistId as keyof typeof avatarImages];
  if (image) {
    return image;
  }
  
  // Finally fallback to placeholder
  return placeholderAvatars['dr-sarah-chen'];
};

// Check if we have professional avatars available
export const hasAnyAvatarImages = (): boolean => {
  return true; // Always true since we have professional + placeholder images
};

// Check if specific therapist has professional avatar
export const hasProfilePicture = (therapistId: string): boolean => {
  return hasProfessionalAvatar(therapistId);
};