import { supabase } from '@/integrations/supabase/client';

// Database-driven avatar mapping with fallback to static mapping
const legacyTherapistAvatarMapping = {
  // Legacy mappings for backward compatibility
  'dr-sarah-chen': 'dr-sarah-chen',
  'dr-marcus-thompson': 'marcus-thompson',
  'dr-maria-rodriguez': 'dr-maria-rodriguez',
  'dr-james-mitchell': 'dr-james-mitchell',
  'dr-aisha-patel': 'dr-aisha-patel',
  'dr-david-kim': 'dr-david-kim',
  'dr-rebecca-foster': 'dr-rebecca-foster',
  'dr-ahmed-hassan': 'dr-ahmed-hassan',
  '1': 'dr-sarah-chen',
  '2': 'marcus-thompson',
  '3': 'dr-maria-rodriguez',
} as const;

// Main function for getting avatar ID - keep synchronous for compatibility
export const getAvatarIdForTherapist = (therapistId: string): string => {
  return legacyTherapistAvatarMapping[therapistId as keyof typeof legacyTherapistAvatarMapping] || therapistId || 'dr-sarah-chen';
};

// Database-aware version (async) for future use
export const getAvatarIdForTherapistAsync = async (therapistId: string): Promise<string> => {
  if (!therapistId) return 'dr-sarah-chen';
  
  try {
    // Try to find therapist in database (when columns exist)
    const { data: therapist, error } = await supabase
      .from('therapist_personalities')
      .select('name, id')
      .eq('id', therapistId)
      .eq('is_active', true)
      .maybeSingle();

    if (therapist) {
      // Convert therapist name to identifier format
      const identifier = therapist.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      return identifier;
    }
  } catch (error) {
    console.warn('Error fetching therapist from database:', error);
  }
  
  // Fallback to legacy mapping
  return getAvatarIdForTherapist(therapistId);
};

// Main function for getting voice ID - keep synchronous for compatibility
export const getVoiceIdForTherapist = (therapistId: string): string => {
  const legacyVoiceMapping: Record<string, string> = {
    'dr-sarah-chen': '9BWtsMINqrJLrRacOk9x', // Aria
    'marcus-thompson': 'CwhRBWXzGAHq8TQ4Fs17', // Roger  
    'dr-maria-rodriguez': 'EXAVITQu4vr4xnSDxMaL', // Sarah
    'dr-james-mitchell': 'FGY2WhTYpPnrIDTdsKH5', // Laura
    'dr-aisha-patel': 'IKne3meq5aSn9XLyUdCD', // Charlie
    'dr-david-kim': 'JBFqnCBsd6RMkjVDRZzb', // George
    'dr-rebecca-foster': 'N2lVS1w4EtoT3dr4eOWO', // Callum
    'dr-ahmed-hassan': 'SAz9YHcvj6GT2YYXdXww', // River
  };

  return legacyVoiceMapping[therapistId] || '9BWtsMINqrJLrRacOk9x';
};

// Database-aware version (async) for future use
export const getVoiceIdForTherapistAsync = async (therapistId: string): Promise<string> => {
  try {
    // Try to find therapist in database (when columns exist)
    const { data: therapist, error } = await supabase
      .from('therapist_personalities')
      .select('id, name')
      .eq('id', therapistId)
      .eq('is_active', true)
      .maybeSingle();

    if (therapist) {
      // For now, use the sync version until database is fully migrated
      return getVoiceIdForTherapist(therapistId);
    }
  } catch (error) {
    console.warn('Error fetching therapist voice from database:', error);
  }
  
  // Fallback to sync version
  return getVoiceIdForTherapist(therapistId);
};