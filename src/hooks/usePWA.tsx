
import React, { useState, useEffect } from 'react';

interface PWAStatus {
  isInstalled: boolean;
  isStandalone: boolean;
  canInstall: boolean;
  isOnline: boolean;
  deferredPrompt: any;
}

export const usePWA = () => {
  const [pwaStatus, setPwaStatus] = useState<PWAStatus>({
    isInstalled: false,
    isStandalone: false,
    canInstall: false,
    isOnline: navigator.onLine,
    deferredPrompt: null
  });

  useEffect(() => {
    // Check if app is running in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone === true;

    // Check if app is installed
    const isInstalled = isStandalone || 
                       localStorage.getItem('pwa-installed') === 'true';

    setPwaStatus(prev => ({
      ...prev,
      isStandalone,
      isInstalled
    }));

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setPwaStatus(prev => ({
        ...prev,
        canInstall: true,
        deferredPrompt: e
      }));
    };

    // Listen for app installed
    const handleAppInstalled = () => {
      localStorage.setItem('pwa-installed', 'true');
      setPwaStatus(prev => ({
        ...prev,
        isInstalled: true,
        canInstall: false,
        deferredPrompt: null
      }));
    };

    // Listen for online/offline events
    const handleOnline = () => {
      setPwaStatus(prev => ({ ...prev, isOnline: true }));
    };

    const handleOffline = () => {
      setPwaStatus(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const promptInstall = async () => {
    if (!pwaStatus.deferredPrompt) return false;

    try {
      await pwaStatus.deferredPrompt.prompt();
      const { outcome } = await pwaStatus.deferredPrompt.userChoice;
      
      setPwaStatus(prev => ({
        ...prev,
        canInstall: false,
        deferredPrompt: null
      }));

      return outcome === 'accepted';
    } catch (error) {
      console.error('Error prompting install:', error);
      return false;
    }
  };

  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
        return registration;
      } catch (error) {
        console.error('Service Worker registration failed:', error);
        return null;
      }
    }
    return null;
  };

  return {
    ...pwaStatus,
    promptInstall,
    registerServiceWorker
  };
};
