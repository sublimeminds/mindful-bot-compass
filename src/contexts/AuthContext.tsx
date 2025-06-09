
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'premium';
  onboardingComplete: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth on mount
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const stored = localStorage.getItem('user_authenticated');
      const email = localStorage.getItem('user_email');
      const onboardingData = localStorage.getItem('onboarding_data');
      
      if (stored && email) {
        setUser({
          id: 'mock-user-id',
          email,
          name: email.split('@')[0],
          plan: 'free',
          onboardingComplete: !!onboardingData
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock authentication - replace with Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.setItem('user_authenticated', 'true');
      localStorage.setItem('user_email', email);
      
      const onboardingData = localStorage.getItem('onboarding_data');
      setUser({
        id: 'mock-user-id',
        email,
        name: email.split('@')[0],
        plan: 'free',
        onboardingComplete: !!onboardingData
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // Mock registration - replace with Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.setItem('user_authenticated', 'true');
      localStorage.setItem('user_email', email);
      
      setUser({
        id: 'mock-user-id',
        email,
        name,
        plan: 'free',
        onboardingComplete: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    localStorage.removeItem('user_authenticated');
    localStorage.removeItem('user_email');
    localStorage.removeItem('onboarding_data');
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
