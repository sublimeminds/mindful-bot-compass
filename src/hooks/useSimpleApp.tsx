import React, { createContext, useContext } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface SimpleAppContextType {
  user: any;
  loading: boolean;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<{ error: any }>;
  login: (email: string, password: string) => Promise<{ error: any }>;
}

const SimpleAppContext = createContext<SimpleAppContextType | undefined>(undefined);

export const SimpleAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();

  const value: SimpleAppContextType = {
    user: auth.user,
    loading: auth.loading,
    signOut: auth.signOut || auth.logout,
    logout: auth.signOut || auth.logout,
    register: auth.signUp || auth.register,
    login: auth.signIn || auth.login,
  };

  return (
    <SimpleAppContext.Provider value={value}>
      {children}
    </SimpleAppContext.Provider>
  );
};

export const useSimpleApp = () => {
  const context = useContext(SimpleAppContext);
  if (context === undefined) {
    // Fallback to direct auth hook usage
    const auth = useAuth();
    return {
      user: auth.user,
      loading: auth.loading,
      signOut: auth.signOut || auth.logout,
      logout: auth.signOut || auth.logout,
      register: auth.signUp || auth.register,
      login: auth.signIn || auth.login,
    };
  }
  return context;
};