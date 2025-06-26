
import { useContext } from 'react';
import { useAuth as useEnhancedAuth } from '@/components/EnhancedAuthProvider';

export const useAuth = () => {
  return useEnhancedAuth();
};
