
import React, { ReactNode } from 'react';
import { TherapistProvider } from '@/contexts/TherapistContext';

interface Props {
  children: ReactNode;
}

const SimpleTherapistProvider: React.FC<Props> = ({ children }) => {
  // Use the TherapistProvider directly with simple error handling
  try {
    return <TherapistProvider>{children}</TherapistProvider>;
  } catch (error) {
    console.warn('TherapistProvider failed to load, continuing without it:', error);
    return <>{children}</>;
  }
};

export default SimpleTherapistProvider;
