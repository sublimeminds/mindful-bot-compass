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
      
      console.log('Initializing avatar for therapist:', therapistId);
      
      // Generate avatar based on therapist ID for consistency
      const { data, error } = await supabase.functions.invoke('ready-player-me', {
        body: {
          action: 'createAvatar',
          therapistId: therapistId,
          gender: getGenderForTherapist(therapistId),
          style: 'professional'
        }
      });

      console.log('Avatar creation response:', { data, error });

      if (error) {
        console.error('Ready Player Me API error:', error);
        throw new Error(error.message || 'Failed to create avatar');
      }

      if (data?.avatarUrl) {
        console.log('Avatar URL received:', data.avatarUrl);
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
    // Database UUID mapping for male therapists
    const maleTherapistIds = [
      '0772c602-306b-42ad-b610-2dc15ba06714', // Dr. Alex Rodriguez
      '2fee5506-ee6d-4504-bab7-2ba922bdc99a', // Dr. Jordan Kim
      'e352e13d-99f9-4ffc-95a6-a05c3d935b74', // Dr. Michael Rivers
      '1588e859-69a6-4b88-b2cc-c377441ac08c', // Dr. James Rodriguez
      'a1b2c3d4-5e6f-7890-abcd-ef1234567890', // Dr. Jordan Taylor
      'c3d4e5f6-7890-1234-cdef-345678901234', // Dr. Sam Morgan
    ];
    
    // String ID mapping for male therapists (fallback)
    const maleTherapistStringIds = [
      'dr-alex-rodriguez', 'dr-jordan-kim', 'dr-michael-rivers', 
      'dr-james-rodriguez', 'dr-jordan-taylor', 'dr-sam-morgan'
    ];
    
    return maleTherapistIds.includes(id) || maleTherapistStringIds.includes(id) ? 'male' : 'female';
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
        src={`https://models.readyplayer.me/embed?url=${encodeURIComponent(avatarUrl)}&transparent=1&background=ffffff00&showControls=0&autoRotate=0&cameraZoom=0.8`}
        className="w-full h-full border-0"
        allow="camera; microphone"
        title={`Avatar for ${therapistId}`}
        loading="lazy"
        style={{
          transform: 'scale(1.1)', // Slight zoom for better framing
          transformOrigin: 'center center'
        }}
        onLoad={() => {
          console.log('Avatar iframe loaded successfully');
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