
import { useAuth } from '@/components/EnhancedAuthProvider';

export const useSimpleApp = () => {
  try {
    const { user, loading, signIn, signUp, signOut } = useAuth();

    return {
      user,
      loading,
      login: signIn,
      register: signUp,
      logout: signOut,
      isAuthenticated: !!user
    };
  } catch (error) {
    console.warn('Auth context not available in useSimpleApp, returning defaults');
    return {
      user: null,
      loading: true,
      login: async () => { throw new Error('Auth not available'); },
      register: async () => { throw new Error('Auth not available'); },
      logout: async () => { throw new Error('Auth not available'); },
      isAuthenticated: false
    };
  }
};
