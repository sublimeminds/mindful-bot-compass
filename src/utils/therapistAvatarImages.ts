// AI-generated therapist avatar images
import drSarahChen from '@/assets/therapist-avatars/dr-sarah-chen.png';
import drMichaelRivers from '@/assets/therapist-avatars/dr-michael-rivers.png';
import drEmmaThompson from '@/assets/therapist-avatars/dr-emma-thompson.png';
import drJamesMartinez from '@/assets/therapist-avatars/dr-james-martinez.png';
import drMayaPatel from '@/assets/therapist-avatars/dr-maya-patel.png';
import drAlexKim from '@/assets/therapist-avatars/dr-alex-kim.png';
import drJordanTaylor from '@/assets/therapist-avatars/dr-jordan-taylor.png';
import drRileyChen from '@/assets/therapist-avatars/dr-riley-chen.png';
import drSamMorgan from '@/assets/therapist-avatars/dr-sam-morgan.png';
import drPhoenixRivera from '@/assets/therapist-avatars/dr-phoenix-rivera.png';
import drSageThompson from '@/assets/therapist-avatars/dr-sage-thompson.png';
import drLunaMartinez from '@/assets/therapist-avatars/dr-luna-martinez.png';
import drCaseyWilliams from '@/assets/therapist-avatars/dr-casey-williams.png';
import drJordanKim from '@/assets/therapist-avatars/dr-jordan-kim.png';
import drFelixChen from '@/assets/therapist-avatars/dr-felix-chen.png';
import drSkyAnderson from '@/assets/therapist-avatars/dr-sky-anderson.png';
import drRiverStone from '@/assets/therapist-avatars/dr-river-stone.png';
import drNovaSleep from '@/assets/therapist-avatars/dr-nova-sleep.png';
import drPhoenixCarter from '@/assets/therapist-avatars/dr-phoenix-carter.png';
import drMarcusBennett from '@/assets/therapist-avatars/dr-marcus-bennett.png';
import drTaylorMorgan from '@/assets/therapist-avatars/dr-taylor-morgan.png';
import drRiverThompson from '@/assets/therapist-avatars/dr-river-thompson.png';
import drSageWilliams from '@/assets/therapist-avatars/dr-sage-williams.png';
import drWillowGrace from '@/assets/therapist-avatars/dr-willow-grace.png';

// Map therapist names to their avatar images
export const therapistAvatarImages: Record<string, string> = {
  'Dr. Sarah Chen': drSarahChen,
  'Dr. Michael Rivers': drMichaelRivers,
  'Dr. Emma Thompson': drEmmaThompson,
  'Dr. James Martinez': drJamesMartinez,
  'Dr. Maya Patel': drMayaPatel,
  'Dr. Alex Kim': drAlexKim,
  'Dr. Jordan Taylor': drJordanTaylor,
  'Dr. Riley Chen': drRileyChen,
  'Dr. Sam Morgan': drSamMorgan,
  'Dr. Phoenix Rivera': drPhoenixRivera,
  'Dr. Sage Thompson': drSageThompson,
  'Dr. Luna Martinez': drLunaMartinez,
  'Dr. Casey Williams': drCaseyWilliams,
  'Dr. Jordan Kim': drJordanKim,
  'Dr. Felix Chen': drFelixChen,
  'Dr. Sky Anderson': drSkyAnderson,
  'Dr. River Stone': drRiverStone,
  'Dr. Nova Sleep': drNovaSleep,
  'Dr. Phoenix Carter': drPhoenixCarter,
  'Dr. Marcus Bennett': drMarcusBennett,
  'Dr. Taylor Morgan': drTaylorMorgan,
  'Dr. River Thompson': drRiverThompson,
  'Dr. Sage Williams': drSageWilliams,
  'Dr. Willow Grace': drWillowGrace,
};

// Helper function to get avatar by therapist name
export const getTherapistAvatarByName = (name: string): string | null => {
  return therapistAvatarImages[name] || null;
};

// Helper function to get avatar by therapist ID (generated from name)
export const getTherapistAvatarById = (therapistId: string): string | null => {
  // Convert therapist ID back to likely name format
  const nameVariations = [
    // Try direct ID to name conversion (dr-sarah-chen -> Dr. Sarah Chen)
    therapistId.split('-').map(part => 
      part.charAt(0).toUpperCase() + part.slice(1)
    ).join(' ').replace(/^Dr\s/, 'Dr. '),
  ];

  for (const nameVariation of nameVariations) {
    if (therapistAvatarImages[nameVariation]) {
      return therapistAvatarImages[nameVariation];
    }
  }

  // Fallback: find by partial name match
  const searchTerm = therapistId.replace(/^dr-/, '').replace(/-/g, ' ').toLowerCase();
  const matchingEntry = Object.entries(therapistAvatarImages).find(([name]) => 
    name.toLowerCase().includes(searchTerm)
  );

  return matchingEntry ? matchingEntry[1] : null;
};