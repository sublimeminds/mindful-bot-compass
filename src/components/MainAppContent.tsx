
import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import AppRouter from '@/components/AppRouter';
import MinimalErrorBoundary from '@/components/MinimalErrorBoundary';
import { SimpleAppProvider } from '@/components/SimpleAppProvider';

// Direct imports to avoid lazy loading issues
import SimpleOfflineIndicator from '@/components/fallback/SimpleOfflineIndicator';

const MainAppContent: React.FC = () => {
  // Safety check for React availability
  if (typeof React === 'undefined' || !React.createElement) {
    return React.createElement('div', {
      style: { padding: '20px', textAlign: 'center', color: 'red' }
    }, 'React initialization error');
  }

  return (
    <MinimalErrorBoundary>
      <SimpleAppProvider>
        <MinimalErrorBoundary>
          <AppRouter />
          <SimpleOfflineIndicator />
          {/* Only render Toaster after React is fully initialized */}
          {typeof React !== 'undefined' && React.useState && <Toaster />}
        </MinimalErrorBoundary>
      </SimpleAppProvider>
    </MinimalErrorBoundary>
  );
};

export default MainAppContent;
