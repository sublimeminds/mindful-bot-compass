
import React, { createContext, useContext, ReactNode } from 'react';

interface TherapistContextType {
  therapist: any;
  isLoading: boolean;
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
  // Mock therapist context for now
  const therapistData = {
    therapist: null,
    isLoading: false
  };

  return (
    <TherapistContext.Provider value={therapistData}>
      {children}
    </TherapistContext.Provider>
  );
};
