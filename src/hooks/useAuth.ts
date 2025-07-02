
import { useSimpleApp } from '@/hooks/useSimpleApp';

export const useAuth = () => {
  try {
    const simpleApp = useSimpleApp();
    return {
      user: simpleApp.user,
      loading: simpleApp.loading,
      signIn: simpleApp.login,
      signUp: simpleApp.register,
      signOut: simpleApp.signOut,
      register: simpleApp.register,
      login: simpleApp.login,
      logout: simpleApp.logout,
    };
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
