
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Ensure React is globally available for all components and hooks
if (typeof window !== 'undefined') {
  (window as any).React = React;
}

// Also make it available on globalThis for broader compatibility
if (typeof globalThis !== 'undefined') {
  (globalThis as any).React = React;
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

// Simple React setup without StrictMode to avoid conflicts
createRoot(rootElement).render(<App />);
