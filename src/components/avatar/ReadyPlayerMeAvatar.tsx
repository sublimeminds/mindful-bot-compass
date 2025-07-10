import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ReadyPlayerMeAvatarProps {
  therapistId?: string;
  emotion?: 'neutral' | 'happy' | 'concerned' | 'encouraging' | 'thoughtful' | 'empathetic';
  isListening?: boolean;
  isSpeaking?: boolean;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const ReadyPlayerMeAvatar: React.FC<ReadyPlayerMeAvatarProps> = ({
  therapistId = 'dr-sarah-chen',
  emotion = 'neutral',
  isListening = false,
  isSpeaking = false,
  className = '',
  size = 'medium'
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Avatar URLs for different therapists - will be generated via Ready Player Me API
  const therapistAvatars: Record<string, string> = {};

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-32 h-32',
    large: 'w-48 h-48'
  };

  useEffect(() => {
    initializeAvatar();
  }, [therapistId]);

  useEffect(() => {
    if (avatarUrl && emotion) {
      updateAvatarExpression();
    }
  }, [emotion, isListening, isSpeaking]);

  const initializeAvatar = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Generate avatar based on therapist ID for consistency
      const { data, error } = await supabase.functions.invoke('ready-player-me', {
        body: {
          action: 'createAvatar',
          therapistId: therapistId,
          gender: getGenderForTherapist(therapistId),
          style: 'professional'
        }
      });

      if (error) {
        console.error('Ready Player Me API error:', error);
        throw new Error(error.message || 'Failed to create avatar');
      }

      if (data?.avatarUrl) {
        setAvatarUrl(data.avatarUrl);
      } else {
        throw new Error('No avatar URL returned from API');
      }
    } catch (err) {
      console.error('Failed to initialize avatar:', err);
      setError(err instanceof Error ? err.message : 'Failed to load avatar');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to determine gender based on therapist ID
  const getGenderForTherapist = (id: string): 'male' | 'female' => {
    const maleTherapists = ['dr-michael-torres', 'dr-james-kim', 'dr-alex-rodriguez', 'dr-jordan-kim', 'dr-michael-rivers', 'dr-james-rodriguez'];
    return maleTherapists.includes(id) ? 'male' : 'female';
  };

  const updateAvatarExpression = async () => {
    if (!avatarUrl) return;

    try {
      // Determine current emotion based on state
      let currentEmotion = emotion;
      
      if (isListening) {
        currentEmotion = 'encouraging';
      } else if (isSpeaking) {
        currentEmotion = 'empathetic';
      }

      // Update avatar expression via edge function
      await supabase.functions.invoke('ready-player-me', {
        body: {
          action: 'updateExpression',
          avatarId: avatarUrl.split('/').pop()?.split('.')[0],
          emotion: currentEmotion,
          intensity: 0.7
        }
      });
    } catch (err) {
      console.error('Failed to update avatar expression:', err);
    }
  };

  if (loading) {
    return (
      <div className={`${sizeClasses[size]} ${className} flex items-center justify-center bg-therapy-50 rounded-full animate-pulse`}>
        <div className="w-8 h-8 border-2 border-therapy-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !avatarUrl) {
    return (
      <div className={`${sizeClasses[size]} ${className} flex items-center justify-center bg-therapy-100 rounded-full`}>
        <div className="text-therapy-600 font-semibold text-lg">
          {therapistId.split('-').map(word => word[0]?.toUpperCase()).join('')}
        </div>
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} ${className} relative overflow-hidden rounded-full bg-therapy-50`}>
      <iframe
        ref={iframeRef}
        src={`https://demo.readyplayer.me/avatar?frameUrl=${encodeURIComponent(avatarUrl)}&background=transparent&camera=portrait&quality=high`}
        className="w-full h-full border-0"
        allow="camera; microphone"
        title={`Avatar for ${therapistId}`}
        loading="lazy"
        style={{
          transform: 'scale(1.2)', // Zoom in slightly for better framing
          transformOrigin: 'center center'
        }}
        onError={() => {
          console.error('Avatar iframe failed to load');
          setError('Avatar display failed');
        }}
      />
      
      {/* Status indicators */}
      {isListening && (
        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
      )}
      
      {isSpeaking && (
        <div className="absolute bottom-0 left-0 w-4 h-4 bg-blue-500 rounded-full border-2 border-white">
          <div className="w-full h-full bg-blue-400 rounded-full animate-ping" />
        </div>
      )}
    </div>
  );
};

export default ReadyPlayerMeAvatar;