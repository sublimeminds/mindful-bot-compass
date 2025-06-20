
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Ensure React is globally available
if (typeof window !== 'undefined') {
  (window as any).React = React;
}

// Validate React before starting the app
if (typeof React === 'undefined' || !React.createElement) {
  throw new Error('React is not properly loaded');
}

// Additional safety check for React hooks
if (!React.useState || !React.useEffect || !React.useContext) {
  throw new Error('React hooks are not available');
}

console.log('React validation passed, starting app...');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
