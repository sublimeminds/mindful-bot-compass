
import { useAuth as useEnhancedAuth } from '@/components/EnhancedAuthProvider';

export const useAuth = () => {
  try {
    return useEnhancedAuth();
  } catch (error) {
    console.warn('Auth context not available, returning null user');
    return {
      user: null,
      loading: false,
      signIn: async () => ({ error: new Error('Auth not available') }),
      signUp: async () => ({ error: new Error('Auth not available') }),
      signOut: async () => { throw new Error('Auth not available'); },
      register: async () => ({ error: new Error('Auth not available') }),
      login: async () => ({ error: new Error('Auth not available') }),
      logout: async () => { throw new Error('Auth not available'); }
    };
  }
};
