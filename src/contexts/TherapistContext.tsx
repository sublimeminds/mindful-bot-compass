
import React, { createContext, useContext, ReactNode } from 'react';

interface Therapist {
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
  therapist: any;
  isLoading: boolean;
  selectedTherapist: Therapist | null;
  therapists: Therapist[];
}

const TherapistContext = createContext<TherapistContextType | null>(null);

export const useTherapist = () => {
  const context = useContext(TherapistContext);
  if (!context) {
    throw new Error('useTherapist must be used within a TherapistProvider');
  }
  return context;
};

interface TherapistProviderProps {
  children: ReactNode;
}

export const TherapistProvider: React.FC<TherapistProviderProps> = ({ children }) => {
  // Mock therapist data
  const mockTherapists: Therapist[] = [
    {
      id: '1',
      name: 'Dr. Sarah Chen',
      title: 'Cognitive Behavioral Therapist',
      description: 'Specializes in anxiety and depression using evidence-based CBT techniques with a warm, supportive approach.',
      approach: 'Cognitive Behavioral Therapy',
      specialties: ['Anxiety', 'Depression', 'Stress Management', 'CBT'],
      communicationStyle: 'Warm, direct, and solution-focused',
      icon: 'Brain',
      colorScheme: 'from-therapy-500 to-therapy-600'
    },
    {
      id: '2',
      name: 'Dr. Michael Rodriguez',
      title: 'Trauma Specialist',
      description: 'Expert in trauma-informed care and EMDR therapy for PTSD treatment with a gentle, patient-centered approach.',
      approach: 'EMDR Therapy',
      specialties: ['Trauma', 'PTSD', 'EMDR', 'Crisis Intervention'],
      communicationStyle: 'Gentle, patient, and trauma-informed',
      icon: 'Heart',
      colorScheme: 'from-calm-500 to-calm-600'
    },
    {
      id: '3',
      name: 'Dr. Emily Johnson',
      title: 'Mindfulness-Based Therapist',
      description: 'Focuses on mindfulness-based approaches and emotional regulation skills with a compassionate, mindful presence.',
      approach: 'Dialectical Behavior Therapy',
      specialties: ['Mindfulness', 'Emotional Regulation', 'DBT', 'Stress'],
      communicationStyle: 'Compassionate, mindful, and accepting',
      icon: 'Shield',
      colorScheme: 'from-harmony-500 to-harmony-600'
    }
  ];

  const therapistData = {
    therapist: null,
    isLoading: false,
    selectedTherapist: mockTherapists[0], // Default to first therapist
    therapists: mockTherapists
  };

  return (
    <TherapistContext.Provider value={therapistData}>
      {children}
    </TherapistContext.Provider>
  );
};
