import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SafeHookContextType {
  isReactReady: boolean;
  canUseHooks: boolean;
  error: Error | null;
}

const SafeHookContext = createContext<SafeHookContextType>({
  isReactReady: false,
  canUseHooks: false,
  error: null
});

interface SafeHookProviderProps {
  children: ReactNode;
}

export const SafeHookProvider: React.FC<SafeHookProviderProps> = ({ children }) => {
  const [isReactReady, setIsReactReady] = useState(false);
  const [canUseHooks, setCanUseHooks] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const validateReactEnvironment = () => {
      try {
        // Test if we can use useState
        const [testState] = useState(true);
        
        // Test if we can use useEffect
        useEffect(() => {
          setCanUseHooks(true);
        }, []);
        
        setIsReactReady(true);
      } catch (err) {
        console.error('SafeHookProvider: React environment validation failed:', err);
        setError(err instanceof Error ? err : new Error('React validation failed'));
      }
    };

    validateReactEnvironment();
  }, []);

  // Fallback rendering if hooks can't be used
  if (error) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        backgroundColor: '#fee2e2',
        border: '1px solid #fecaca',
        borderRadius: '8px',
        margin: '20px'
      }}>
        <h2>App Initialization Error</h2>
        <p>The application failed to initialize properly. Please refresh the page.</p>
        <button 
          onClick={() => window.location.reload()} 
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Refresh Page
        </button>
      </div>
    );
  }

  if (!isReactReady || !canUseHooks) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <SafeHookContext.Provider value={{ isReactReady, canUseHooks, error }}>
      {children}
    </SafeHookContext.Provider>
  );
};

export const useSafeHooks = () => {
  const context = useContext(SafeHookContext);
  if (!context.canUseHooks) {
    console.warn('Hooks are not available in this context');
    return {
      isReactReady: false,
      canUseHooks: false,
      error: new Error('Hooks not available')
    };
  }
  return context;
};