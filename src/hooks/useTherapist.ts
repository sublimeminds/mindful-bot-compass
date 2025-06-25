
import { useContext } from 'react';
import { TherapistContext } from '@/components/SimpleTherapistProvider';

export const useTherapist = () => {
  const context = useContext(TherapistContext);
  if (!context) {
    throw new Error('useTherapist must be used within a TherapistProvider');
  }
  return context;
};
