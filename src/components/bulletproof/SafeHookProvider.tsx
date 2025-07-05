import React, { createContext, useContext, ReactNode } from 'react';

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
  const [isReady, setIsReady] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const contextValue = React.useMemo(() => ({
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