
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

// Loading component that doesn't use hooks
const TherapistLoadingFallback = ({ children }: { children: ReactNode }) => {
  return React.createElement('div', {
    style: {
      padding: '20px',
      textAlign: 'center',
      color: '#666'
    }
  }, 'Loading therapist data...');
};

// Main provider component that uses hooks
const TherapistProviderWithHooks: React.FC<TherapistProviderProps> = ({ children }) => {
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

  return React.createElement(TherapistContext.Provider, { value: therapistData }, children);
};

export const TherapistProvider: React.FC<TherapistProviderProps> = ({ children }) => {
  // Use a state to track React readiness without hooks initially
  const [isReactReady, setIsReactReady] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    
    const checkReactReadiness = () => {
      try {
        // Comprehensive React validation
        if (
          typeof React !== 'undefined' &&
          React !== null &&
          React.useState &&
          React.useEffect &&
          React.useContext &&
          React.createElement &&
          typeof React.useState === 'function' &&
          typeof React.useEffect === 'function' &&
          typeof React.useContext === 'function' &&
          typeof React.createElement === 'function'
        ) {
          if (mounted) {
            console.log('TherapistProvider: React is fully ready');
            setIsReactReady(true);
          }
          return true;
        }
        return false;
      } catch (error) {
        console.error('TherapistProvider: Error checking React readiness:', error);
        return false;
      }
    };

    // Initial check
    if (checkReactReadiness()) {
      return;
    }

    // Retry mechanism
    const maxAttempts = 5;
    let attempts = 0;
    
    const retryCheck = () => {
      attempts++;
      
      if (checkReactReadiness()) {
        return;
      }
      
      if (attempts < maxAttempts && mounted) {
        const delay = Math.min(50 * Math.pow(2, attempts), 1000);
        console.log(`TherapistProvider: Retrying React check (attempt ${attempts}/${maxAttempts}) in ${delay}ms`);
        setTimeout(retryCheck, delay);
      } else if (mounted) {
        console.error('TherapistProvider: Failed to initialize React after maximum attempts');
        // Force set ready to prevent infinite loading
        setIsReactReady(true);
      }
    };

    // Start retry mechanism
    setTimeout(retryCheck, 25);

    return () => {
      mounted = false;
    };
  }, []);

  if (!isReactReady) {
    return React.createElement(TherapistLoadingFallback, { children });
  }

  return React.createElement(TherapistProviderWithHooks, { children });
};
