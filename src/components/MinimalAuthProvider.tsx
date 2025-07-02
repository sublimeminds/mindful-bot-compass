import React, { createContext, useContext } from 'react';

// Minimal auth context without hooks initially
const AuthContext = createContext<any>(null);

export const MinimalAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Provide a minimal auth context without using hooks yet
  const value = {
    user: null,
    loading: false,
    signUp: async () => ({ error: null }),
    signIn: async () => ({ error: null }),
    signOut: async () => {},
    register: async () => ({ error: null }),
    login: async () => ({ error: null }),
    logout: async () => {},
  };

  return React.createElement(AuthContext.Provider, { value }, children);
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      loading: false,
      signUp: async () => ({ error: null }),
      signIn: async () => ({ error: null }),
      signOut: async () => {},
      register: async () => ({ error: null }),
      login: async () => ({ error: null }),
      logout: async () => {},
    };
  }
  return context;
};