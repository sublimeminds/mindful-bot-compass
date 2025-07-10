import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DIDAvatarProps {
  therapistId?: string;
  emotion?: 'neutral' | 'happy' | 'concerned' | 'encouraging' | 'thoughtful' | 'empathetic';
  isListening?: boolean;
  isSpeaking?: boolean;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  isAnimated?: boolean;
}

const DIDAvatar: React.FC<DIDAvatarProps> = ({
  therapistId = 'dr-sarah-chen',
  emotion = 'neutral',
  isListening = false,
  isSpeaking = false,
  className = '',
  size = 'medium',
  isAnimated = false
}) => {
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [animationUrl, setAnimationUrl] = useState<string>('');

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-32 h-32',
    large: 'w-48 h-48'
  };

  const emotionClasses = {
    neutral: 'filter-none',
    happy: 'brightness-110 contrast-105',
    concerned: 'brightness-95 contrast-110',
    encouraging: 'brightness-105 saturate-110',
    thoughtful: 'brightness-90 contrast-105',
    empathetic: 'brightness-100 saturate-105'
  };

  useEffect(() => {
    initializeAvatar();
  }, [therapistId]);

  useEffect(() => {
    if (avatarUrl && isSpeaking && isAnimated) {
      animateAvatar();
    }
  }, [isSpeaking, isAnimated, avatarUrl]);

  const initializeAvatar = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Initializing D-ID avatar for therapist:', therapistId);
      
      // Generate avatar based on therapist ID for consistency
      const { data, error } = await supabase.functions.invoke('d-id-avatar', {
        body: {
          action: 'createAvatar',
          therapistId: therapistId,
          gender: getGenderForTherapist(therapistId),
          style: 'professional'
        }
      });

      console.log('D-ID avatar creation response:', { data, error });

      if (error) {
        console.error('D-ID API error:', error);
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
      
      // Set fallback image
      setAvatarUrl(getFallbackAvatar(therapistId));
    } finally {
      setLoading(false);
    }
  };

  const animateAvatar = async () => {
    if (!avatarUrl || !isAnimated) return;

    try {
      const { data, error } = await supabase.functions.invoke('d-id-avatar', {
        body: {
          action: 'animateAvatar',
          avatarId: avatarUrl,
          text: 'I understand how you\'re feeling. Let\'s work through this together.',
          emotion: emotion
        }
      });

      if (error) {
        console.error('Failed to animate avatar:', error);
        return;
      }

      if (data?.result_url) {
        setAnimationUrl(data.result_url);
      }
    } catch (err) {
      console.error('Failed to animate avatar:', err);
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
    ];
    
    // String ID mapping for male therapists (fallback)
    const maleTherapistStringIds = [
      'dr-alex-rodriguez', 'dr-jordan-kim', 'dr-michael-rivers', 
      'dr-james-rodriguez'
    ];
    
    return maleTherapistIds.includes(id) || maleTherapistStringIds.includes(id) ? 'male' : 'female';
  };

  const getFallbackAvatar = (therapistId: string): string => {
    const gender = getGenderForTherapist(therapistId);
    
    // Professional healthcare stock photos as fallbacks
    const fallbacks = {
      male: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
      female: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face'
    };
    
    return fallbacks[gender];
  };

  if (loading) {
    return (
      <div className={`${sizeClasses[size]} ${className} flex items-center justify-center bg-therapy-50 rounded-full animate-pulse`}>
        <div className="w-8 h-8 border-2 border-therapy-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} ${className} relative overflow-hidden rounded-full bg-therapy-50`}>
      {/* Main avatar image */}
      <img
        src={animationUrl && isSpeaking ? animationUrl : avatarUrl}
        alt={`Avatar for ${therapistId}`}
        className={`w-full h-full object-cover transition-all duration-300 ${emotionClasses[emotion]}`}
        onError={() => {
          console.error('Avatar image failed to load');
          setAvatarUrl(getFallbackAvatar(therapistId));
        }}
      />
      
      {/* Emotion overlay */}
      <div className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
        emotion === 'happy' ? 'bg-yellow-400 opacity-10' :
        emotion === 'concerned' ? 'bg-blue-500 opacity-10' :
        emotion === 'encouraging' ? 'bg-green-400 opacity-10' :
        'opacity-0'
      }`} />
      
      {/* Status indicators */}
      {isListening && (
        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse">
          <div className="absolute inset-0 bg-green-400 rounded-full animate-ping" />
        </div>
      )}
      
      {isSpeaking && (
        <div className="absolute bottom-0 left-0 w-4 h-4 bg-blue-500 rounded-full border-2 border-white">
          <div className="w-full h-full bg-blue-400 rounded-full animate-ping" />
        </div>
      )}

      {/* Breathing animation for calm states */}
      {emotion === 'thoughtful' && !isSpeaking && (
        <div className="absolute inset-0 rounded-full border-2 border-therapy-300 animate-pulse opacity-50" />
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-therapy-100 rounded-full">
          <div className="text-therapy-600 font-semibold text-lg">
            {therapistId.split('-').map(word => word[0]?.toUpperCase()).join('')}
          </div>
        </div>
      )}
    </div>
  );
};

export default DIDAvatar;