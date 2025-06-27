
import { useAuth } from '@/components/EnhancedAuthProvider';

export const useSafeAuth = () => {
  try {
    return useAuth();
  } catch (error) {
    console.warn('Auth context not available, returning safe defaults');
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
