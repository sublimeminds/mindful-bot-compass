
import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import AppRouter from '@/components/AppRouter';
import MinimalErrorBoundary from '@/components/MinimalErrorBoundary';
import SimpleAppProvider from '@/components/SimpleAppProvider';

// Direct imports to avoid lazy loading issues
import SimpleOfflineIndicator from '@/components/fallback/SimpleOfflineIndicator';

const MainAppContent: React.FC = () => {
  return (
    <MinimalErrorBoundary>
      <SimpleAppProvider>
        <MinimalErrorBoundary>
          <AppRouter />
          
          <SimpleOfflineIndicator />
          <Toaster />
        </MinimalErrorBoundary>
      </SimpleAppProvider>
    </MinimalErrorBoundary>
  );
};

export default MainAppContent;
