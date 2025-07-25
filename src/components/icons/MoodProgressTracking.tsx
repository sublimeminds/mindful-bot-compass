import React from 'react';
import moodProgressTrackingIcon from '@/assets/icons/mood-progress-tracking.svg';

interface MoodProgressTrackingProps {
  className?: string;
  size?: number;
}

const MoodProgressTracking: React.FC<MoodProgressTrackingProps> = ({ className = '', size = 24 }) => {
  return (
    <img 
      src={moodProgressTrackingIcon} 
      alt="Mood & Progress Tracking" 
      className={className}
      width={size}
      height={size}
    />
  );
};

export default MoodProgressTracking;