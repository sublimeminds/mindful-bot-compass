
import React, { createContext } from 'react';
import { TherapistContextType } from '@/types/contexts';

export const TherapistContext = createContext<TherapistContextType | undefined>(undefined);

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
