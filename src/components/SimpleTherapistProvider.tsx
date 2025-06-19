
import React, { ReactNode } from 'react';
import { TherapistProvider } from '@/contexts/TherapistContext';

interface Props {
  children: ReactNode;
}

const SimpleTherapistProvider: React.FC<Props> = ({ children }) => {
  return <TherapistProvider>{children}</TherapistProvider>;
};

export default SimpleTherapistProvider;
