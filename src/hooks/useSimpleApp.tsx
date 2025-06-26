
import { useAuth } from '@/hooks/useAuth';

export const useSimpleApp = () => {
  const { user, loading, signIn, signUp, signOut } = useAuth();

  return {
    user,
    loading,
    login: signIn,
    register: signUp,
    logout: signOut,
    isAuthenticated: !!user
  };
};
