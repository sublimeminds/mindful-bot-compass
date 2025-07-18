import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { therapist3DAvatars, getTherapist3DAvatar } from '@/utils/therapist3DAvatars';

export interface TherapistAvatar {
  therapistId: string;
  avatarUrl: string;
  avatarStyle: string;
  characteristics?: any;
  emotions?: any;
}

export const useTherapistAvatars = () => {
  const [avatars, setAvatars] = useState<Record<string, TherapistAvatar>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTherapistAvatars = async () => {
      try {
        setLoading(true);
        
        // Fetch therapist personalities with avatar data
        const { data: therapists, error: therapistError } = await supabase
          .from('therapist_personalities')
          .select(`
            id,
            name,
            avatar_image_url,
            avatar_style,
            avatar_characteristics,
            avatar_emotions
          `)
          .eq('is_active', true);

        if (therapistError) throw therapistError;

        // Create avatar mapping
        const avatarMap: Record<string, TherapistAvatar> = {};

        therapists?.forEach((therapist) => {
          // Generate therapist ID from name
          const therapistId = therapist.name
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');

          // Use database avatar_image_url if available, otherwise fallback to local 3D avatars
          const avatarUrl = therapist.avatar_image_url || getTherapist3DAvatar(therapistId);

          if (avatarUrl) {
            avatarMap[therapistId] = {
              therapistId,
              avatarUrl,
              avatarStyle: therapist.avatar_style || '3d_animated',
              characteristics: therapist.avatar_characteristics,
              emotions: therapist.avatar_emotions,
            };
          }
        });

        // Add any local 3D avatars that might not be in the database yet
        Object.keys(therapist3DAvatars).forEach((therapistId) => {
          if (!avatarMap[therapistId]) {
            avatarMap[therapistId] = {
              therapistId,
              avatarUrl: therapist3DAvatars[therapistId],
              avatarStyle: '3d_animated',
            };
          }
        });

        setAvatars(avatarMap);
        setError(null);
      } catch (err) {
        console.error('Error fetching therapist avatars:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch avatars');
        
        // Fallback to local 3D avatars
        const fallbackAvatars: Record<string, TherapistAvatar> = {};
        Object.entries(therapist3DAvatars).forEach(([therapistId, avatarUrl]) => {
          fallbackAvatars[therapistId] = {
            therapistId,
            avatarUrl,
            avatarStyle: '3d_animated',
          };
        });
        setAvatars(fallbackAvatars);
      } finally {
        setLoading(false);
      }
    };

    fetchTherapistAvatars();
  }, []);

  const getAvatarForTherapist = (therapistId: string): TherapistAvatar | null => {
    return avatars[therapistId] || null;
  };

  const getAvatarUrlForTherapist = (therapistId: string): string | null => {
    const avatar = avatars[therapistId];
    return avatar ? avatar.avatarUrl : null;
  };

  return {
    avatars,
    loading,
    error,
    getAvatarForTherapist,
    getAvatarUrlForTherapist,
  };
};