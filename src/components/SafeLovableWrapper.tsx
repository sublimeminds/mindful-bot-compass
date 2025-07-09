import React, { ReactNode, useEffect, useState } from 'react';
import { LovableTaggerInitializer } from '@/utils/lovable-tagger-init';

interface SafeLovableWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const SafeLovableWrapper: React.FC<SafeLovableWrapperProps> = ({ 
  children, 
  fallback = <div>Loading...</div> 
}) => {
  const [isLovableReady, setIsLovableReady] = useState(false);

  useEffect(() => {
    const checkLovableInit = async () => {
      try {
        await LovableTaggerInitializer.initialize();
        setIsLovableReady(true);
      } catch (error) {
        console.error('Lovable initialization failed:', error);
        // Still render children as fallback
        setIsLovableReady(true);
      }
    };

    if (LovableTaggerInitializer.isInitialized()) {
      setIsLovableReady(true);
    } else {
      checkLovableInit();
    }
  }, []);

  if (!isLovableReady) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default SafeLovableWrapper;