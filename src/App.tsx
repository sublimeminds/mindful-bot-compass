import React from 'react';
import BulletproofErrorBoundary from '@/components/BulletproofErrorBoundary';
import SafeMinimalApp from '@/components/SafeMinimalApp';
import './App.css';

function App() {
  console.log('App: Starting TherapySync...');
  
  try {
    // Dynamic import with fallback
    const AppInitializer = React.lazy(() => 
      import('@/components/AppInitializer').catch(() => {
        console.error('Failed to load AppInitializer, using fallback');
        return { default: SafeMinimalApp };
      })
    );
    
    return (
      <BulletproofErrorBoundary>
        <React.Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        }>
          <AppInitializer />
        </React.Suspense>
      </BulletproofErrorBoundary>
    );
  } catch (error) {
    console.error('Critical App error:', error);
    return <SafeMinimalApp />;
  }
}

export default App;