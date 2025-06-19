
import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import AppRouter from '@/components/AppRouter';
import BulletproofErrorBoundary from '@/components/BulletproofErrorBoundary';
import SimpleSessionProvider from '@/components/SimpleSessionProvider';
import SimpleTherapistProvider from '@/components/SimpleTherapistProvider';

// Lazy load non-critical components
const AccessibilityPanel = React.lazy(() => import('@/components/accessibility/AccessibilityPanel'));
const NetworkStatusIndicator = React.lazy(() => import('@/components/performance/NetworkStatusIndicator'));
const OfflineIndicator = React.lazy(() => import('@/components/OfflineIndicator'));

const MainAppContent: React.FC = () => {
  return (
    <BulletproofErrorBoundary>
      <AuthProvider>
        <SimpleSessionProvider>
          <SimpleTherapistProvider>
            {/* Main application router */}
            <AppRouter />
            
            {/* Non-critical status indicators */}
            <React.Suspense fallback={null}>
              <NetworkStatusIndicator />
            </React.Suspense>
            
            <React.Suspense fallback={null}>
              <OfflineIndicator />
            </React.Suspense>
            
            <React.Suspense fallback={null}>
              <AccessibilityPanel />
            </React.Suspense>
            
            {/* Toast notifications */}
            <Toaster />
          </SimpleTherapistProvider>
        </SimpleSessionProvider>
      </AuthProvider>
    </BulletproofErrorBoundary>
  );
};

export default MainAppContent;
