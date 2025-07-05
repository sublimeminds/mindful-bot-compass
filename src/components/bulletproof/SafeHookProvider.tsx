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
  const [error, setError] = useState<Error | null>(null);

  // If we can render this component, React hooks are working fine
  const contextValue = {
    isReactReady: true,
    canUseHooks: true,
    error
  };

  // Only show error UI if there's actually an error
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

  return (
    <SafeHookContext.Provider value={contextValue}>
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