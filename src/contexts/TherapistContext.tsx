
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DebugLogger } from '@/utils/debugLogger';

interface Therapist {
  id: string;
  name: string;
  specialty: string;
  approach: string;
  personality: string;
}

interface TherapistContextType {
  currentTherapist: Therapist | null;
  setCurrentTherapist: (therapist: Therapist | null) => void;
  availableTherapists: Therapist[];
  isLoading: boolean;
}

const TherapistContext = createContext<TherapistContextType | undefined>(undefined);

export const TherapistProvider = ({ children }: { children: ReactNode }) => {
  DebugLogger.debug('TherapistProvider: Initializing', { component: 'TherapistProvider' });
  
  const [currentTherapist, setCurrentTherapist] = useState<Therapist | null>(null);
  const [availableTherapists, setAvailableTherapists] = useState<Therapist[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load available therapists on mount
  useEffect(() => {
    const loadTherapists = async () => {
      setIsLoading(true);
      try {
        // Simulate loading therapists - replace with actual API call
        const therapists: Therapist[] = [
          {
            id: '1',
            name: 'Dr. Sarah Johnson',
            specialty: 'Cognitive Behavioral Therapy',
            approach: 'CBT',
            personality: 'Empathetic and Direct'
          },
          {
            id: '2',
            name: 'Dr. Michael Chen',
            specialty: 'Mindfulness-Based Therapy',
            approach: 'MBCT',
            personality: 'Calm and Supportive'
          }
        ];
        
        setAvailableTherapists(therapists);
        DebugLogger.info('TherapistProvider: Therapists loaded', { 
          component: 'TherapistProvider',
          count: therapists.length
        });
      } catch (error) {
        DebugLogger.error('TherapistProvider: Failed to load therapists', error as Error, { 
          component: 'TherapistProvider' 
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadTherapists();
  }, []);

  const value = {
    currentTherapist,
    setCurrentTherapist,
    availableTherapists,
    isLoading
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
