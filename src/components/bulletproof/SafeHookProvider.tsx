import React, { createContext, useContext, ReactNode, useState, useMemo } from 'react';

interface SafeHookContextType {
  isReady: boolean;
  error: Error | null;
}

const SafeHookContext = createContext<SafeHookContextType>({
  isReady: true,
  error: null
});

interface SafeHookProviderProps {
  children: ReactNode;
}

export const SafeHookProvider: React.FC<SafeHookProviderProps> = ({ children }) => {
  const [isReady, setIsReady] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const contextValue = useMemo(() => ({
    isReady,
    error
  }), [isReady, error]);

  return (
    <SafeHookContext.Provider value={contextValue}>
      {children}
    </SafeHookContext.Provider>
  );
};

export const useSafeHooks = () => {
  const context = useContext(SafeHookContext);
  return context;
};