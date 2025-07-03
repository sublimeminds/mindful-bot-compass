import React, { useState, useEffect } from 'react';

export const OfflineDetector: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineMode, setShowOfflineMode] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMode(false);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMode(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check if we should show offline mode after 3 seconds of no network
    const offlineTimer = setTimeout(() => {
      if (!isOnline) {
        setShowOfflineMode(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearTimeout(offlineTimer);
    };
  }, [isOnline]);

  return (
    <>
      {children}
      
      {/* Offline mode indicator */}
      {showOfflineMode && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white text-center py-2 z-50">
          <span>🔌 Offline Mode - Limited functionality available</span>
          <button 
            onClick={() => setShowOfflineMode(false)}
            className="ml-4 bg-yellow-600 hover:bg-yellow-700 px-2 py-1 rounded text-xs"
          >
            Dismiss
          </button>
        </div>
      )}
    </>
  );
};