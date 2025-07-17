
import React, { ReactNode } from 'react';

interface ReactSafeWrapperProps {
  children: ReactNode;
}

const ReactSafeWrapper: React.FC<ReactSafeWrapperProps> = ({ children }) => {
  // Simple immediate render - React is verified in main.tsx
  return <>{children}</>;
};

export default ReactSafeWrapper;
