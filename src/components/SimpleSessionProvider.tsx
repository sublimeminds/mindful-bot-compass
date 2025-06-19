
import React, { ReactNode } from 'react';
import { SessionProvider } from '@/contexts/SessionContext';

interface Props {
  children: ReactNode;
}

const SimpleSessionProvider: React.FC<Props> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default SimpleSessionProvider;
