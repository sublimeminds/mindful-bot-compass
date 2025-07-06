
import React from 'react';
import TherapistAvatarCard from './TherapistAvatarCard';

interface TherapistCardProps {
  therapist: {
    id: string;
    name: string;
    title: string;
    description: string;
    approach: string;
    specialties: string[];
    communicationStyle: string;
    icon: string;
    colorScheme: string;
  };
  isSelected?: boolean;
  onSelect?: () => void;
}

const TherapistCard = ({ therapist, isSelected = false, onSelect }: TherapistCardProps) => {
  return (
    <TherapistAvatarCard
      therapist={therapist}
      isSelected={isSelected}
      showMiniAvatar={true}
      onSelect={onSelect}
    />
  );
};

export default TherapistCard;
