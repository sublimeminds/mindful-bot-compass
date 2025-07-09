// Safe avatar image imports with fallback handling
let drSarahChenImage: string;
let drMichaelTorresImage: string;
let drAishaPatelImage: string;
let drJamesWilsonImage: string;
let drEmilyRodriguezImage: string;
let drDavidKimImage: string;

// Dynamically import avatar images with error handling
try {
  drSarahChenImage = require('@/assets/avatars/dr-sarah-chen.jpg').default || '';
} catch {
  drSarahChenImage = '';
}

try {
  drMichaelTorresImage = require('@/assets/avatars/dr-michael-torres.jpg').default || '';
} catch {
  drMichaelTorresImage = '';
}

try {
  drAishaPatelImage = require('@/assets/avatars/dr-aisha-patel.jpg').default || '';
} catch {
  drAishaPatelImage = '';
}

try {
  drJamesWilsonImage = require('@/assets/avatars/dr-james-wilson.jpg').default || '';
} catch {
  drJamesWilsonImage = '';
}

try {
  drEmilyRodriguezImage = require('@/assets/avatars/dr-emily-rodriguez.jpg').default || '';
} catch {
  drEmilyRodriguezImage = '';
}

try {
  drDavidKimImage = require('@/assets/avatars/dr-david-kim.jpg').default || '';
} catch {
  drDavidKimImage = '';
}

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

// Safe avatar getter with fallback
export const getAvatarImage = (therapistId: string): string => {
  const image = avatarImages[therapistId as keyof typeof avatarImages];
  if (!image) {
    console.warn(`No avatar image found for therapist: ${therapistId}`);
    // Return the first available image as fallback
    return drSarahChenImage || drAishaPatelImage || drMichaelTorresImage || '';
  }
  return image;
};

// Check if any avatars are available
export const hasAnyAvatarImages = (): boolean => {
  return !!(drSarahChenImage || drAishaPatelImage || drMichaelTorresImage || drJamesWilsonImage || drEmilyRodriguezImage || drDavidKimImage);
};