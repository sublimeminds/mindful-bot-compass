
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TherapistPersonality {
  id: string;
  name: string;
  title: string;
  description: string;
  approach: string;
  specialties: string[];
  communicationStyle: string;
  icon: string;
  colorScheme: string;
}

interface TherapistContextType {
  selectedTherapist: TherapistPersonality | null;
  currentTherapist: TherapistPersonality | null;
  setSelectedTherapist: (therapist: TherapistPersonality | null) => void;
  selectTherapist: (therapist: TherapistPersonality) => void;
  therapists: TherapistPersonality[];
  getPersonalityPrompt: () => string;
  isLoading: boolean;
}

const TherapistContext = createContext<TherapistContextType | undefined>(undefined);

const defaultTherapists: TherapistPersonality[] = [
  {
    id: '1',
    name: 'Dr. Emily Chen',
    title: 'Cognitive Behavioral Therapist',
    description: 'Warm and evidence-based approach focusing on practical solutions',
    approach: 'Cognitive Behavioral Therapy',
    specialties: ['Anxiety', 'Depression', 'Stress Management'],
    communicationStyle: 'Supportive and Direct',
    icon: 'Brain',
    colorScheme: 'from-blue-500 to-blue-600'
  },
  {
    id: '2',
    name: 'Dr. Marcus Johnson',
    title: 'Mindfulness Specialist',
    description: 'Gentle approach emphasizing mindfulness and self-compassion',
    approach: 'Mindfulness-Based Therapy',
    specialties: ['Mindfulness', 'Self-Compassion', 'Emotional Regulation'],
    communicationStyle: 'Calm and Reflective',
    icon: 'Heart',
    colorScheme: 'from-green-500 to-emerald-500'
  }
];

export const TherapistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedTherapist, setSelectedTherapist] = useState<TherapistPersonality | null>(defaultTherapists[0]);
  const [therapists] = useState<TherapistPersonality[]>(defaultTherapists);
  const [isLoading] = useState(false);

  const selectTherapist = React.useCallback((therapist: TherapistPersonality) => {
    setSelectedTherapist(therapist);
  }, []);

  const getPersonalityPrompt = React.useCallback(() => {
    if (!selectedTherapist) return '';
    
    return `You are ${selectedTherapist.name}, a ${selectedTherapist.title}. 
    Your approach is ${selectedTherapist.approach}. 
    Your communication style is ${selectedTherapist.communicationStyle}.
    Your specialties include: ${selectedTherapist.specialties.join(', ')}.
    ${selectedTherapist.description}
    
    Always respond in character as this therapist, maintaining their specific approach and communication style.`;
  }, [selectedTherapist]);

  const value = React.useMemo(() => ({
    selectedTherapist,
    currentTherapist: selectedTherapist,
    setSelectedTherapist,
    selectTherapist,
    therapists,
    getPersonalityPrompt,
    isLoading
  }), [selectedTherapist, selectTherapist, therapists, getPersonalityPrompt, isLoading]);

  return (
    <TherapistContext.Provider value={value}>
      {children}
    </TherapistContext.Provider>
  );
};

export const useTherapist = () => {
  const context = useContext(TherapistContext);
  if (context === undefined) {
    throw new Error('useTherapist must be used within a TherapistProvider');
  }
  return context;
};
