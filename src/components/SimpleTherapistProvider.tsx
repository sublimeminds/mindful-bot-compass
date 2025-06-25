
import React, { createContext, useContext } from 'react';
import { TherapistContextType } from '@/types/contexts';

const TherapistContext = createContext<TherapistContextType | undefined>(undefined);

export const useTherapist = () => {
  const context = useContext(TherapistContext);
  if (!context) {
    throw new Error('useTherapist must be used within a TherapistProvider');
  }
  return context;
};

interface TherapistProviderProps {
  children: React.ReactNode;
}

export const SimpleTherapistProvider: React.FC<TherapistProviderProps> = ({ children }) => {
  const [selectedTherapist, setSelectedTherapistState] = React.useState<string | null>(null);

  const setSelectedTherapist = (id: string) => {
    setSelectedTherapistState(id);
    localStorage.setItem('selectedTherapist', id);
  };

  const value = {
    selectedTherapist,
    setSelectedTherapist,
  };

  return (
    <TherapistContext.Provider value={value}>
      {children}
    </TherapistContext.Provider>
  );
};
