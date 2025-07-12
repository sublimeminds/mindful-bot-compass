import React, { useEffect, useState } from 'react';
import { therapySystemInitializer } from '@/utils/therapySystemInitializer';
import { systemHealthMonitor } from '@/utils/systemHealthMonitor';
import { useAuth } from '@/hooks/useAuth';

const SystemInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeSystem = async () => {
      try {
        if (!therapySystemInitializer.isInitialized()) {
          await therapySystemInitializer.initialize();
        }
        
        if (user && !therapySystemInitializer.isInitialized()) {
          await therapySystemInitializer.createUserTherapyPlan(user.id);
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('System initialization failed:', error);
        setIsInitialized(true); // Continue anyway
      }
    };

    initializeSystem();
  }, [user]);

  return <>{children}</>;
};

export default SystemInitializer;