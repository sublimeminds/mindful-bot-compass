
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Minimal loading fallback
const InitialLoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
      <p className="text-therapy-600 font-medium">Initializing TherapySync...</p>
    </div>
  </div>
);

// Stage 1: Ultra-minimal React check and mounting
const StagedApp = () => {
  const [stage, setStage] = React.useState<'loading' | 'contexts' | 'app'>('loading');
  
  React.useEffect(() => {
    // Stage 1: Verify React is working
    setTimeout(() => {
      console.log('Stage 1: React verified, loading contexts...');
      setStage('contexts');
    }, 50);
  }, []);
  
  React.useEffect(() => {
    if (stage === 'contexts') {
      // Stage 2: Load contexts
      setTimeout(() => {
        console.log('Stage 2: Contexts ready, loading app...');
        setStage('app');
      }, 100);
    }
  }, [stage]);
  
  if (stage === 'loading') {
    return <InitialLoadingFallback />;
  }
  
  if (stage === 'contexts') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
          <p className="text-therapy-600 font-medium">Loading contexts...</p>
        </div>
      </div>
    );
  }
  
// Stage 3: Load the bulletproof app
  const BulletproofApp = React.lazy(() => import('./components/BulletproofApp'));
  
  return (
    <React.Suspense fallback={<InitialLoadingFallback />}>
      <BulletproofApp />
    </React.Suspense>
  );
};

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);

// Render with minimal wrapper
root.render(
  <React.StrictMode>
    <StagedApp />
  </React.StrictMode>
);
