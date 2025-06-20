
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Ensure React is available globally
if (typeof window !== 'undefined') {
  (window as any).React = React;
}

// Simple error boundary for the root
const SimpleRootErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error('Root error:', error);
    return <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
      Application failed to load. Please refresh the page.
    </div>;
  }
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <SimpleRootErrorBoundary>
      <App />
    </SimpleRootErrorBoundary>
  </React.StrictMode>
);
