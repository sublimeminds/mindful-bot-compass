
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Ensure React is available globally for third-party libraries
if (typeof window !== 'undefined') {
  (window as any).React = React;
  (window as any).__DEV__ = true;
  
  // Also ensure React hooks are available globally
  (window as any).ReactHooks = {
    useState: React.useState,
    useEffect: React.useEffect,
    useContext: React.useContext,
    useMemo: React.useMemo,
    useCallback: React.useCallback,
  };
}

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
