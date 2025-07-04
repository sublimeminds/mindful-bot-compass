
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Native HTML fallback for complete React failure
const NativeFallback = () => {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #f0f9ff, #ecfdf5); font-family: system-ui, sans-serif;">
        <div style="text-align: center; padding: 40px; background: white; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); max-width: 400px;">
          <h1 style="color: #dc2626; margin-bottom: 20px; font-size: 24px;">TherapySync</h1>
          <p style="color: #6b7280; margin-bottom: 20px;">Loading error occurred. Refreshing...</p>
          <div style="width: 40px; height: 40px; border: 3px solid #e5e7eb; border-top: 3px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
        </div>
      </div>
      <style>
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      </style>
    `;
    setTimeout(() => window.location.reload(), 2000);
  }
};

// Bulletproof error boundary
class RobustErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('RobustErrorBoundary: Critical app error', error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('RobustErrorBoundary: Error details', error, errorInfo);
    // Attempt native fallback if React completely fails
    setTimeout(() => {
      if (this.state.hasError) {
        NativeFallback();
      }
    }, 1000);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 flex items-center justify-center">
          <div className="text-center p-8 bg-white rounded-lg shadow-xl max-w-md">
            <h1 className="text-2xl font-bold text-therapy-600 mb-4">TherapySync</h1>
            <p className="text-slate-600 mb-4">Recovering from error...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-600 mx-auto"></div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Simple, robust app loader
const RobustApp = () => {
  console.log('RobustApp: Loading TherapySync...');
  
  return (
    <RobustErrorBoundary>
      <React.Suspense fallback={
        <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
            <p className="text-therapy-600 font-medium">Loading TherapySync...</p>
          </div>
        </div>
      }>
        <App />
      </React.Suspense>
    </RobustErrorBoundary>
  );
};

// Initialize app
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);

// Render immediately without staged loading - StrictMode disabled for debugging
root.render(
  <RobustApp />
);
