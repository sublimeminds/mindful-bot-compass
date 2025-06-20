
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Ensure React is globally available before any component rendering
if (typeof window !== 'undefined') {
  (window as any).React = React;
}

// Validate React is properly loaded
if (typeof React === 'undefined' || !React.createElement) {
  throw new Error('React is not properly loaded');
}

// Additional safety check for React hooks
if (!React.useState || !React.useEffect || !React.useContext || !React.useRef) {
  throw new Error('React hooks are not available');
}

console.log('React validation passed, starting app...');

// Add a small delay to ensure React is fully initialized
const startApp = () => {
  const root = ReactDOM.createRoot(document.getElementById('root')!);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

// Use requestAnimationFrame to ensure DOM is ready
requestAnimationFrame(startApp);
