
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DebugLogger } from '@/utils/debugLogger';

interface Therapist {
  id: string;
  name: string;
  title: string;
  specialty: string;
  approach: string;
  personality: string;
  description: string;
  specialties: string[];
  communicationStyle: string;
  colorScheme: string;
}

interface TherapistContextType {
  currentTherapist: Therapist | null;
  selectedTherapist: Therapist | null;
  setCurrentTherapist: (therapist: Therapist | null) => void;
  selectTherapist: (therapist: Therapist) => void;
  availableTherapists: Therapist[];
  therapists: Therapist[];
  isLoading: boolean;
  getPersonalityPrompt: () => string;
}

const TherapistContext = createContext<TherapistContextType | undefined>(undefined);

export const TherapistProvider = ({ children }: { children: ReactNode }) => {
  console.log('TherapistProvider: Initializing');
  
  const [currentTherapist, setCurrentTherapist] = useState<Therapist | null>(null);
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [availableTherapists, setAvailableTherapists] = useState<Therapist[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load available therapists on mount
  useEffect(() => {
    const loadTherapists = async () => {
      setIsLoading(true);
      try {
        const therapists: Therapist[] = [
          {
            id: '1',
            name: 'Dr. Sarah Johnson',
            title: 'Cognitive Behavioral Therapist',
            specialty: 'Cognitive Behavioral Therapy',
            approach: 'CBT',
            personality: 'Empathetic and Direct',
            description: 'Warm and evidence-based approach focusing on practical solutions',
            specialties: ['Anxiety', 'Depression', 'Stress Management'],
            communicationStyle: 'Supportive and Direct',
            colorScheme: 'from-harmony-500 to-flow-500'
          },
          {
            id: '2',
            name: 'Dr. Michael Chen',
            title: 'Mindfulness Specialist',
            specialty: 'Mindfulness-Based Therapy',
            approach: 'MBCT',
            personality: 'Calm and Supportive',
            description: 'Gentle approach emphasizing mindfulness and self-compassion',
            specialties: ['Mindfulness', 'Self-Compassion', 'Emotional Regulation'],
            communicationStyle: 'Calm and Reflective',
            colorScheme: 'from-balance-500 to-harmony-500'
          }
        ];
        
        setAvailableTherapists(therapists);
        console.log('TherapistProvider: Therapists loaded', therapists.length);
      } catch (error) {
        console.error('TherapistProvider: Failed to load therapists', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTherapists();
  }, []);

  const selectTherapist = (therapist: Therapist) => {
    setSelectedTherapist(therapist);
    setCurrentTherapist(therapist);
    console.log('TherapistProvider: Therapist selected', therapist.name);
  };

  const getPersonalityPrompt = () => {
    if (!currentTherapist) return '';
    return `You are ${currentTherapist.name}, a ${currentTherapist.title}. Your approach is ${currentTherapist.approach} and your communication style is ${currentTherapist.communicationStyle}. ${currentTherapist.description}`;
  };

  const value = {
    currentTherapist,
    selectedTherapist,
    setCurrentTherapist,
    selectTherapist,
    availableTherapists,
    therapists: availableTherapists,
    isLoading,
    getPersonalityPrompt
  };

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
