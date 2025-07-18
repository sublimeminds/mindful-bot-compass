
import React from 'react';
import { getProfessionalAvatarImage } from '@/utils/professionalAvatarImages';

interface Professional2DAvatarProps {
  therapistId: string;
  therapistName: string;
  emotion?: 'neutral' | 'happy' | 'concerned' | 'encouraging' | 'thoughtful';
  isListening?: boolean;
  isSpeaking?: boolean;
  className?: string;
  showName?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Professional2DAvatar: React.FC<Professional2DAvatarProps> = ({
  therapistId,
  therapistName,
  emotion = 'neutral',
  isListening = false,
  isSpeaking = false,
  className = "w-full h-full",
  showName = true,
  size = 'lg'
}) => {
  const avatarImage = getProfessionalAvatarImage(therapistId);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40'
  };

  const getEmotionFilter = () => {
    switch (emotion) {
      case 'happy':
        return 'brightness(1.1) saturate(1.1)';
      case 'concerned':
        return 'brightness(0.9) contrast(1.1)';
      case 'encouraging':
        return 'brightness(1.05) saturate(1.05)';
      case 'thoughtful':
        return 'brightness(0.95) contrast(1.05)';
      default:
        return 'brightness(1) saturate(1)';
    }
  };

  const getStatusIndicator = () => {
    if (isListening) {
      return (
        <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-1">
          <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
        </div>
      );
    }
    if (isSpeaking) {
      return (
        <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1">
          <div className="w-2 h-2 bg-green-300 rounded-full animate-bounce"></div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <div className="relative">
        {avatarImage ? (
          <img
            src={avatarImage}
            alt={`${therapistName} - AI Therapist`}
            className={`${sizeClasses[size]} rounded-full object-cover border-3 border-white shadow-lg transition-all duration-300 ${
              isListening ? 'ring-4 ring-blue-400' : isSpeaking ? 'ring-4 ring-green-400' : ''
            }`}
            style={{
              filter: getEmotionFilter(),
              transform: isListening || isSpeaking ? 'scale(1.05)' : 'scale(1)'
            }}
          />
        ) : (
          <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-therapy-400 to-calm-500 flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
            {therapistName.split(' ').map(n => n[0]).join('')}
          </div>
        )}
        
        {getStatusIndicator()}
      </div>
      
      {showName && (
        <div className="text-center">
          <h3 className="text-sm font-medium text-gray-900">{therapistName}</h3>
          <p className="text-xs text-gray-500">AI Therapist</p>
        </div>
      )}
      
      {/* Emotion indicator */}
      {emotion !== 'neutral' && (
        <div className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600 capitalize">
          {emotion}
        </div>
      )}
    </div>
  );
};

export default Professional2DAvatar;
