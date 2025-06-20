
import { useApp } from '@/components/MinimalAppProvider';
import { reactChecker } from '@/utils/reactReadinessChecker';

/**
 * Safe authentication hook that checks React readiness before using auth context
 */
export const useSafeAuth = () => {
  // Check React readiness first
  const isReactReady = reactChecker.checkReactReadiness();
  
  if (!isReactReady) {
    console.warn('useSafeAuth: React not ready, returning safe defaults');
    return {
      user: null,
      loading: true,
      login: async () => { throw new Error('React not ready'); },
      register: async () => { throw new Error('React not ready'); },
      logout: async () => { throw new Error('React not ready'); }
    };
  }

  try {
    return useApp();
  } catch (error) {
    console.error('useSafeAuth: Failed to get auth context', error);
    return {
      user: null,
      loading: false,
      login: async () => { throw error; },
      register: async () => { throw error; },
      logout: async () => { throw error; }
    };
  }
};
