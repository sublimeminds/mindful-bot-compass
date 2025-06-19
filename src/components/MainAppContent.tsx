
import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { AdminProvider } from '@/contexts/AdminContext';
import { AccessibilityProvider } from '@/contexts/AccessibilityContext';
import { Toaster } from '@/components/ui/toaster';
import AppRouter from '@/components/AppRouter';
import BulletproofErrorBoundary from '@/components/BulletproofErrorBoundary';
import SimpleSessionProvider from '@/components/SimpleSessionProvider';
import SimpleTherapistProvider from '@/components/SimpleTherapistProvider';

// Direct imports to avoid lazy loading issues
import AccessibilityPanel from '@/components/accessibility/AccessibilityPanel';
import SimpleOfflineIndicator from '@/components/fallback/SimpleOfflineIndicator';

const MainAppContent: React.FC = () => {
  return (
    <BulletproofErrorBoundary>
      <AuthProvider>
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
      </AuthProvider>
    </BulletproofErrorBoundary>
  );
};

export default MainAppContent;
