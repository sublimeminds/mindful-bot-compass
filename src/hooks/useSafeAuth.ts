
import { useApp } from '@/components/MinimalAppProvider';

/**
 * Safe authentication hook with basic error handling
 */
export const useSafeAuth = () => {
  try {
    return useApp();
  } catch (error) {
    console.error('useSafeAuth: Failed to get auth context', error);
    // Return safe defaults instead of throwing
    return {
      user: null,
      loading: false,
      login: async () => { 
        console.warn('useSafeAuth: Auth not available');
        throw new Error('Authentication not available'); 
      },
      register: async () => { 
        console.warn('useSafeAuth: Auth not available');
        throw new Error('Authentication not available'); 
      },
      logout: async () => { 
        console.warn('useSafeAuth: Auth not available');
      }
    };
  }
};
