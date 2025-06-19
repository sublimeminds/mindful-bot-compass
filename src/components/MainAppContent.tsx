
import React from 'react';
import { AdminProvider } from '@/contexts/AdminContext';
import { AccessibilityProvider } from '@/contexts/AccessibilityContext';
import { Toaster } from '@/components/ui/toaster';
import AppRouter from '@/components/AppRouter';
import MinimalErrorBoundary from '@/components/MinimalErrorBoundary';
import MinimalAuthProvider from '@/components/MinimalAuthProvider';
import ReliableUIProvider from '@/components/ReliableUIProvider';
import SimpleSessionProvider from '@/components/SimpleSessionProvider';
import SimpleTherapistProvider from '@/components/SimpleTherapistProvider';

// Direct imports to avoid lazy loading issues
import AccessibilityPanel from '@/components/accessibility/AccessibilityPanel';
import SimpleOfflineIndicator from '@/components/fallback/SimpleOfflineIndicator';

const MainAppContent: React.FC = () => {
  return (
    <MinimalErrorBoundary>
      <MinimalAuthProvider>
        <ReliableUIProvider>
          <MinimalErrorBoundary>
            <AdminProvider>
              <AccessibilityProvider>
                <SimpleTherapistProvider>
                  <SimpleSessionProvider>
                    <AppRouter />
                    
                    <SimpleOfflineIndicator />
                    <AccessibilityPanel />
                    
                    <Toaster />
                  </SimpleSessionProvider>
                </SimpleTherapistProvider>
              </AccessibilityProvider>
            </AdminProvider>
          </MinimalErrorBoundary>
        </ReliableUIProvider>
      </MinimalAuthProvider>
    </MinimalErrorBoundary>
  );
};

export default MainAppContent;
