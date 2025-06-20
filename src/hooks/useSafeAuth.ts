
import { useAuth } from '@/components/SimpleAuthProvider';

export const useSafeAuth = () => {
  try {
    return useAuth();
  } catch (error) {
    console.warn('Auth context not available, returning null user');
    return {
      user: null,
      loading: false,
      login: async () => { throw new Error('Auth not available'); },
      register: async () => { throw new Error('Auth not available'); },
      logout: async () => { throw new Error('Auth not available'); }
    };
  }
};
