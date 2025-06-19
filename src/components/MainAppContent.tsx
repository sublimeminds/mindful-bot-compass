
import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import ClassBasedSessionProvider from '@/components/providers/ClassBasedSessionProvider';
import ClassBasedTherapistProvider from '@/components/providers/ClassBasedTherapistProvider';
import { Toaster } from '@/components/ui/toaster';
import SafeHookWrapper from '@/components/SafeHookWrapper';
import ReactSafeErrorBoundary from '@/components/ReactSafeErrorBoundary';
import AppRouter from '@/components/AppRouter';

// Lazy load components that use hooks
const AccessibilityPanel = React.lazy(() => import('@/components/accessibility/AccessibilityPanel'));
const NetworkStatusIndicator = React.lazy(() => import('@/components/performance/NetworkStatusIndicator'));
const OfflineIndicator = React.lazy(() => import('@/components/OfflineIndicator'));

const MainAppContent: React.FC = () => {
  return (
    <ReactSafeErrorBoundary>
      <AuthProvider>
        <ClassBasedSessionProvider>
          <ClassBasedTherapistProvider>
            {/* Main application router - now inside all contexts */}
            <AppRouter />
            
            {/* Status Indicators with fallbacks */}
            <SafeHookWrapper componentName="NetworkStatusIndicator">
              <React.Suspense fallback={null}>
                <NetworkStatusIndicator />
              </React.Suspense>
            </SafeHookWrapper>
            
            <SafeHookWrapper componentName="OfflineIndicator">
              <React.Suspense fallback={null}>
                <OfflineIndicator />
              </React.Suspense>
            </SafeHookWrapper>
            
            {/* Accessibility Tools */}
            <SafeHookWrapper componentName="AccessibilityPanel">
              <React.Suspense fallback={null}>
                <AccessibilityPanel />
              </React.Suspense>
            </SafeHookWrapper>
            
            {/* Toast notifications */}
            <SafeHookWrapper componentName="Toaster">
              <Toaster />
            </SafeHookWrapper>
          </ClassBasedTherapistProvider>
        </ClassBasedSessionProvider>
      </AuthProvider>
    </ReactSafeErrorBoundary>
  );
};

export default MainAppContent;
