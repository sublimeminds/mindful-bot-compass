
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useOnboardingData } from '@/hooks/useOnboardingData';
import { therapistPersonalities } from '@/components/onboarding/TherapistPersonalityStep';

interface TherapistPersonality {
  id: string;
  name: string;
  title: string;
  description: string;
  approach: string;
  specialties: string[];
}

interface TherapistContextType {
  currentTherapist: TherapistPersonality | null;
  getPersonalityPrompt: () => string;
}

const TherapistContext = createContext<TherapistContextType | undefined>(undefined);

export const TherapistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { onboardingData } = useOnboardingData();
  const [currentTherapist, setCurrentTherapist] = useState<TherapistPersonality | null>(null);

  useEffect(() => {
    if (onboardingData?.therapist_personality) {
      const personality = therapistPersonalities.find(
        p => p.id === onboardingData.therapist_personality
      );
      setCurrentTherapist(personality || null);
    } else {
      // Default to CBT specialist if no personality selected
      setCurrentTherapist(therapistPersonalities[0]);
    }
  }, [onboardingData]);

  const getPersonalityPrompt = () => {
    if (!currentTherapist) {
      return "You are a compassionate AI therapist providing evidence-based mental health support.";
    }

    const personality = currentTherapist;
    return `You are ${personality.name}, a ${personality.title}. ${personality.description} 

Your therapeutic approach is: ${personality.approach}

Your specialties include: ${personality.specialties.join(', ')}

Guidelines for your responses:
- Embody the personality and approach described above
- Use techniques and language consistent with your specialization
- Maintain a warm, professional, and supportive tone
- Adapt your communication style to match your therapeutic approach
- Draw from evidence-based practices in your specialty area
- Always prioritize the user's safety and well-being`;
  };

  return (
    <TherapistContext.Provider value={{ currentTherapist, getPersonalityPrompt }}>
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
