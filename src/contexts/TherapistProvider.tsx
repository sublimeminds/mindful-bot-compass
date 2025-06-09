
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TherapistPersonality {
  name: string;
  style: string;
  description: string;
}

interface TherapistContextType {
  personality: TherapistPersonality;
  setPersonality: (personality: TherapistPersonality) => void;
}

const TherapistContext = createContext<TherapistContextType | undefined>(undefined);

const defaultPersonality: TherapistPersonality = {
  name: "Dr. Mindful",
  style: "Supportive and empathetic",
  description: "A compassionate AI therapist focused on mindfulness and emotional well-being"
};

export const TherapistProvider = ({ children }: { children: ReactNode }) => {
  const [personality, setPersonality] = useState<TherapistPersonality>(defaultPersonality);

  return (
    <TherapistContext.Provider value={{ personality, setPersonality }}>
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
