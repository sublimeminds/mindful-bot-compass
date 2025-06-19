
import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const SimpleSessionProvider: React.FC<Props> = ({ children }) => {
  // Load SessionProvider dynamically but with proper error handling
  const [SessionProvider, setSessionProvider] = React.useState<any>(null);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    let mounted = true;
    
    const loadProvider = async () => {
      try {
        const { SessionProvider: SP } = await import('@/contexts/SessionContext');
        if (mounted) {
          setSessionProvider(() => SP);
        }
      } catch (err) {
        console.error('Failed to load SessionProvider:', err);
        if (mounted) {
          setError(err as Error);
        }
      }
    };

    loadProvider();
    
    return () => {
      mounted = false;
    };
  }, []);

  if (error) {
    console.warn('SessionProvider failed to load, continuing without it');
    return <>{children}</>;
  }

  if (!SessionProvider) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Loading session management...
      </div>
    );
  }

  return React.createElement(SessionProvider, {}, children);
};

export default SimpleSessionProvider;
