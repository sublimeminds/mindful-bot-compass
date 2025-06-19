
import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const SimpleTherapistProvider: React.FC<Props> = ({ children }) => {
  // Load TherapistProvider dynamically but with proper error handling
  const [TherapistProvider, setTherapistProvider] = React.useState<any>(null);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    let mounted = true;
    
    const loadProvider = async () => {
      try {
        const { TherapistProvider: TP } = await import('@/contexts/TherapistContext');
        if (mounted) {
          setTherapistProvider(() => TP);
        }
      } catch (err) {
        console.error('Failed to load TherapistProvider:', err);
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
    console.warn('TherapistProvider failed to load, continuing without it');
    return <>{children}</>;
  }

  if (!TherapistProvider) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Loading therapist system...
      </div>
    );
  }

  return React.createElement(TherapistProvider, {}, children);
};

export default SimpleTherapistProvider;
