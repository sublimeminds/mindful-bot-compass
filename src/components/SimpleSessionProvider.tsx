
import React, { ReactNode } from 'react';
import { SessionProvider } from '@/contexts/SessionContext';

interface Props {
  children: ReactNode;
}

const SimpleSessionProvider: React.FC<Props> = ({ children }) => {
  // Use the SessionProvider directly with simple error handling
  try {
    return <SessionProvider>{children}</SessionProvider>;
  } catch (error) {
    console.warn('SessionProvider failed to load, continuing without it:', error);
    return <>{children}</>;
  }
};

export default SimpleSessionProvider;
