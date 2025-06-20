
import { useAuth } from '@/components/SimpleAuthProvider';

// This is now just an alias for the simplified auth provider
export const useSimpleApp = () => {
  const auth = useAuth();
  
  return {
    user: auth.user,
    session: null, // Simplified - not tracking session separately
    loading: auth.loading,
    login: auth.login,
    logout: auth.logout,
    register: auth.register,
  };
};
