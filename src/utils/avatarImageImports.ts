// SAFE Avatar Image System - No dynamic imports, no failures
import { placeholderAvatars } from './safeAvatarSystem';

// Use safe base64 placeholders instead of risky file imports
const drSarahChenImage = placeholderAvatars['dr-sarah-chen'];
const drMichaelTorresImage = placeholderAvatars['dr-michael-torres'];
const drAishaPatelImage = placeholderAvatars['dr-aisha-patel'];
const drJamesWilsonImage = placeholderAvatars['dr-james-wilson'];
const drEmilyRodriguezImage = placeholderAvatars['dr-emily-rodriguez'];
const drDavidKimImage = placeholderAvatars['dr-david-kim'];

// Export safe avatar images
export const avatarImages = {
  'dr-sarah-chen': drSarahChenImage,
  'dr-michael-torres': drMichaelTorresImage,
  'dr-aisha-patel': drAishaPatelImage,
  'dr-james-wilson': drJamesWilsonImage,
  'dr-emily-rodriguez': drEmilyRodriguezImage,
  'dr-david-kim': drDavidKimImage,
  // Add legacy mappings for any missing IDs
  'dr-maya-patel': drAishaPatelImage,
  'dr-alex-rodriguez': drEmilyRodriguezImage,
  'dr-jordan-kim': drDavidKimImage,
  'dr-taylor-morgan': drEmilyRodriguezImage,
  'dr-river-stone': drMichaelTorresImage,
  'dr-michael-rivers': drMichaelTorresImage,
  'dr-emma-thompson': drEmilyRodriguezImage,
  'dr-james-rodriguez': drJamesWilsonImage,
  'dr-jordan-taylor': drDavidKimImage,
  'dr-riley-chen': drSarahChenImage,
  'dr-sam-morgan': drMichaelTorresImage,
} as const;

// Safe avatar getter with bulletproof fallback
export const getAvatarImage = (therapistId: string): string => {
  const image = avatarImages[therapistId as keyof typeof avatarImages];
  if (!image) {
    // Always return a working placeholder instead of empty string
    return placeholderAvatars['dr-sarah-chen'];
  }
  return image;
};

// Avatars are always available now
export const hasAnyAvatarImages = (): boolean => {
  return true; // Always true since we have base64 placeholders
};