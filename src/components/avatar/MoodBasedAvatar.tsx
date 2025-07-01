
import React from 'react';
import { Heart, Brain, Sparkles, Shield } from 'lucide-react';

interface MoodBasedAvatarProps {
  avatarId: string;
  currentMood: 'happy' | 'sad' | 'anxious' | 'calm' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  showMoodIndicator?: boolean;
}

const avatarConfig = {
  'compassionate-companion': {
    icon: Heart,
    baseColor: 'from-pink-500 to-rose-500',
    moodColors: {
      happy: 'from-pink-400 to-rose-400',
      sad: 'from-pink-600 to-rose-600',
      anxious: 'from-pink-500 to-purple-500',
      calm: 'from-pink-300 to-rose-300',
      neutral: 'from-pink-500 to-rose-500'
    }
  },
  'mindful-mentor': {
    icon: Brain,
    baseColor: 'from-purple-500 to-indigo-500',
    moodColors: {
      happy: 'from-purple-400 to-indigo-400',
      sad: 'from-purple-600 to-indigo-600',
      anxious: 'from-purple-500 to-blue-500',
      calm: 'from-purple-300 to-indigo-300',
      neutral: 'from-purple-500 to-indigo-500'
    }
  },
  'energetic-encourager': {
    icon: Sparkles,
    baseColor: 'from-orange-500 to-yellow-500',
    moodColors: {
      happy: 'from-orange-400 to-yellow-400',
      sad: 'from-orange-600 to-yellow-600',
      anxious: 'from-orange-500 to-red-500',
      calm: 'from-orange-300 to-yellow-300',
      neutral: 'from-orange-500 to-yellow-500'
    }
  },
  'protective-guardian': {
    icon: Shield,
    baseColor: 'from-blue-500 to-cyan-500',
    moodColors: {
      happy: 'from-blue-400 to-cyan-400',
      sad: 'from-blue-600 to-cyan-600',
      anxious: 'from-blue-500 to-purple-500',
      calm: 'from-blue-300 to-cyan-300',
      neutral: 'from-blue-500 to-cyan-500'
    }
  }
};

const MoodBasedAvatar = ({ 
  avatarId, 
  currentMood, 
  size = 'md', 
  showMoodIndicator = false 
}: MoodBasedAvatarProps) => {
  const config = avatarConfig[avatarId as keyof typeof avatarConfig];
  
  if (!config) {
    return null;
  }

  const Icon = config.icon;
  const colorGradient = config.moodColors[currentMood];

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const moodIndicatorColors = {
    happy: 'bg-yellow-400',
    sad: 'bg-blue-600',
    anxious: 'bg-red-500',
    calm: 'bg-green-400',
    neutral: 'bg-gray-400'
  };

  return (
    <div className="relative">
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-r ${colorGradient} flex items-center justify-center text-white shadow-lg transition-all duration-300`}>
        <Icon className={iconSizes[size]} />
      </div>
      
      {showMoodIndicator && (
        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${moodIndicatorColors[currentMood]} border-2 border-white shadow-sm`} />
      )}
    </div>
  );
};

export default MoodBasedAvatar;
