
import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import AppRouter from '@/components/AppRouter';
import BulletproofErrorBoundary from '@/components/BulletproofErrorBoundary';
import SimpleSessionProvider from '@/components/SimpleSessionProvider';
import SimpleTherapistProvider from '@/components/SimpleTherapistProvider';

// Direct imports instead of lazy loading to avoid React context issues
import AccessibilityPanel from '@/components/accessibility/AccessibilityPanel';
import NetworkStatusIndicator from '@/components/performance/NetworkStatusIndicator';
import OfflineIndicator from '@/components/OfflineIndicator';

const MainAppContent: React.FC = () => {
  return (
    <BulletproofErrorBoundary>
      <AuthProvider>
        <SimpleTherapistProvider>
          <SimpleSessionProvider>
            <AppRouter />
            
            <NetworkStatusIndicator />
            <OfflineIndicator />
            <AccessibilityPanel />
            
            <Toaster />
          </SimpleSessionProvider>
        </SimpleTherapistProvider>
      </AuthProvider>
    </BulletproofErrorBoundary>
  );
};

export default MainAppContent;
