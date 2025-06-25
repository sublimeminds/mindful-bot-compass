
import { useAuth } from '@/hooks/useAuth';

export const useSimpleApp = () => {
  const { user, loading, login, register, logout } = useAuth();

  return {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };
};
