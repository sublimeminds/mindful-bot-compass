
import React from 'react';
import { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { DebugLogger } from '@/utils/debugLogger';

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
  setCurrentTherapist: (therapist: TherapistPersonality | null) => void;
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

export const TherapistProvider = ({ children }: { children: ReactNode }) => {
  DebugLogger.debug('TherapistProvider: Initializing', { component: 'TherapistProvider' });
  
  // Check if React hooks are available
  if (!useState) {
    DebugLogger.error('TherapistProvider: useState is not available', new Error('React hooks not found'), { component: 'TherapistProvider' });
    throw new Error('React hooks are not available. This might indicate a React version mismatch.');
  }
  
  const [selectedTherapist, setSelectedTherapist] = useState<TherapistPersonality | null>(defaultTherapists[0]);
  const [therapists] = useState<TherapistPersonality[]>(defaultTherapists);
  const [isLoading] = useState(false);

  DebugLogger.info('TherapistProvider: Default therapist selected', { 
    component: 'TherapistProvider',
    selectedTherapistId: defaultTherapists[0].id,
    selectedTherapistName: defaultTherapists[0].name,
    totalTherapists: defaultTherapists.length
  });

  const selectTherapist = useCallback((therapist: TherapistPersonality) => {
    DebugLogger.debug('TherapistProvider: Selecting therapist', { 
      component: 'TherapistProvider', 
      method: 'selectTherapist',
      therapistId: therapist.id,
      therapistName: therapist.name,
      previousTherapistId: selectedTherapist?.id
    });
    
    setSelectedTherapist(therapist);
    
    DebugLogger.info('TherapistProvider: Therapist selected successfully', { 
      component: 'TherapistProvider', 
      method: 'selectTherapist',
      therapistId: therapist.id,
      therapistName: therapist.name,
      approach: therapist.approach
    });
  }, [selectedTherapist?.id]);

  const setCurrentTherapist = useCallback((therapist: TherapistPersonality | null) => {
    setSelectedTherapist(therapist);
  }, []);

  const getPersonalityPrompt = useCallback(() => {
    DebugLogger.debug('TherapistProvider: Getting personality prompt', { 
      component: 'TherapistProvider', 
      method: 'getPersonalityPrompt',
      therapistId: selectedTherapist?.id,
      therapistName: selectedTherapist?.name
    });
    
    if (!selectedTherapist) {
      DebugLogger.warn('TherapistProvider: No therapist selected for prompt', { 
        component: 'TherapistProvider', 
        method: 'getPersonalityPrompt'
      });
      return '';
    }
    
    const prompt = `You are ${selectedTherapist.name}, a ${selectedTherapist.title}. 
    Your approach is ${selectedTherapist.approach}. 
    Your communication style is ${selectedTherapist.communicationStyle}.
    Your specialties include: ${selectedTherapist.specialties.join(', ')}.
    ${selectedTherapist.description}
    
    Always respond in character as this therapist, maintaining their specific approach and communication style.`;
    
    DebugLogger.trace('TherapistProvider: Personality prompt generated', { 
      component: 'TherapistProvider', 
      method: 'getPersonalityPrompt',
      therapistId: selectedTherapist.id,
      promptLength: prompt.length
    });
    
    return prompt;
  }, [selectedTherapist]);

  const value = useMemo(() => {
    const contextValue = {
      selectedTherapist,
      currentTherapist: selectedTherapist,
      setSelectedTherapist,
      setCurrentTherapist,
      selectTherapist,
      therapists,
      getPersonalityPrompt,
      isLoading
    };
    
    DebugLogger.trace('TherapistProvider: Context value updated', { 
      component: 'TherapistProvider',
      hasSelectedTherapist: !!selectedTherapist,
      therapistsCount: therapists.length,
      isLoading
    });
    
    return contextValue;
  }, [selectedTherapist, selectTherapist, setCurrentTherapist, therapists, getPersonalityPrompt, isLoading]);

  return (
    <TherapistContext.Provider value={value}>
      {children}
    </TherapistContext.Provider>
  );
};

export const useTherapist = () => {
  DebugLogger.trace('useTherapist: Hook called', { component: 'useTherapist' });
  
  const context = useContext(TherapistContext);
  if (context === undefined) {
    const error = new Error('useTherapist must be used within a TherapistProvider');
    DebugLogger.error('useTherapist: Context undefined', error, { component: 'useTherapist' });
    throw error;
  }
  
  return context;
};
