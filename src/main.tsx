
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Critical: Set up React globally IMMEDIATELY before any imports or other code
if (typeof window !== 'undefined') {
  // Ensure React is available on window object first
  (window as any).React = React;
  
  // Set up all React hooks on window
  (window as any).useState = React.useState;
  (window as any).useEffect = React.useEffect;
  (window as any).useContext = React.useContext;
  (window as any).useMemo = React.useMemo;
  (window as any).useCallback = React.useCallback;
  (window as any).useRef = React.useRef;
  (window as any).useReducer = React.useReducer;
  (window as any).createContext = React.createContext;
  
  // Also ensure ReactDOM is available
  (window as any).ReactDOM = { createRoot };
  
  // Development flag
  (window as any).__DEV__ = true;
  
  console.log('React globals initialized:', {
    React: !!(window as any).React,
    useState: !!(window as any).useState,
    useContext: !!(window as any).useContext,
    ReactAvailable: !!React
  });
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

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
