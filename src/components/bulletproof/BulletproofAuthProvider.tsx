import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth as useSimpleAuth } from '@/components/SimpleAuthProvider';
import { SafeComponentWrapper } from './SafeComponentWrapper';

interface BulletproofAuthContextType {
  user: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  register: (email: string, password: string) => Promise<{ error: Error | null }>;
  login: (email: string, password: string) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
}

const BulletproofAuthContext = createContext<BulletproofAuthContextType | null>(null);

interface BulletproofAuthProviderProps {
  children: ReactNode;
}

export const BulletproofAuthProvider: React.FC<BulletproofAuthProviderProps> = ({ children }) => {
  const auth = useSimpleAuth();

  return (
    <SafeComponentWrapper name="BulletproofAuthProvider">
      <BulletproofAuthContext.Provider value={auth}>
        {children}
      </BulletproofAuthContext.Provider>
    </SafeComponentWrapper>
  );
};

export const useBulletproofAuth = () => {
  const context = useContext(BulletproofAuthContext);
  if (!context) {
    throw new Error('useBulletproofAuth must be used within BulletproofAuthProvider');
  }
  return context;
};