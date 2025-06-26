
import { useAuth } from '@/components/EnhancedAuthProvider';

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
