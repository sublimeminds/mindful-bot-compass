
import { useContext } from 'react';
import { SimpleAppContext } from '@/components/SimpleAppProvider';

export const useSimpleApp = () => {
  const context = useContext(SimpleAppContext);
  if (!context) {
    throw new Error('useSimpleApp must be used within a SimpleAppProvider');
  }
  return context;
};
