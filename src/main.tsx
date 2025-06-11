
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Critical: Set up React globally IMMEDIATELY before any other imports
if (typeof window !== 'undefined') {
  // Ensure React is available on window object first
  (window as any).React = React;
  
  // Set up all React hooks on window with proper error handling
  const hooks = {
    useState: React.useState,
    useEffect: React.useEffect,
    useContext: React.useContext,
    useMemo: React.useMemo,
    useCallback: React.useCallback,
    useRef: React.useRef,
    useReducer: React.useReducer,
    useLayoutEffect: React.useLayoutEffect,
    useImperativeHandle: React.useImperativeHandle,
    useDebugValue: React.useDebugValue,
    createContext: React.createContext,
    forwardRef: React.forwardRef,
    memo: React.memo
  };

  // Set each hook individually with validation
  Object.entries(hooks).forEach(([name, hook]) => {
    if (hook) {
      (window as any)[name] = hook;
    }
  });
  
  // Also ensure ReactDOM is available
  (window as any).ReactDOM = { createRoot };
  
  // Development flag
  (window as any).__DEV__ = true;
  
  console.log('React globals initialized:', {
    React: !!(window as any).React,
    useState: !!(window as any).useState,
    useContext: !!(window as any).useContext,
    useEffect: !!(window as any).useEffect,
    ReactAvailable: !!React,
    allHooksAvailable: Object.keys(hooks).every(hook => !!(window as any)[hook])
  });
}

// Now import the app components
import App from "./App.tsx";
import "./index.css";

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
