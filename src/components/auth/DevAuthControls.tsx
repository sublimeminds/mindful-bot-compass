import React from 'react';

interface DevAuthControlsProps {
  user: any;
  skipAuth: () => void;
  enableAuth: () => void;
}

export const DevAuthControls: React.FC<DevAuthControlsProps> = ({ user, skipAuth, enableAuth }) => {
  if (!import.meta.env.DEV) return null;

  const isDebugMode = localStorage.getItem('auth_debug') === 'true';

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm">
      <h3 className="font-bold text-sm mb-2">🔧 Dev Auth Controls</h3>
      
      <div className="space-y-2 text-xs">
        <div>
          <strong>Status:</strong> {user ? '✅ Authenticated' : '❌ Not authenticated'}
        </div>
        <div>
          <strong>Debug Mode:</strong> {isDebugMode ? '✅ Active' : '❌ Disabled'}
        </div>
        
        <div className="flex gap-2 mt-3">
          {!isDebugMode ? (
            <button 
              onClick={skipAuth}
              className="bg-yellow-600 hover:bg-yellow-700 px-2 py-1 rounded text-xs"
            >
              Skip Auth
            </button>
          ) : (
            <button 
              onClick={enableAuth}
              className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs"
            >
              Enable Auth
            </button>
          )}
          
          <button 
            onClick={() => {
              console.log('=== AUTH DEBUG INFO ===');
              console.log('User:', user);
              console.log('Debug Mode:', isDebugMode);
              console.log('Local Storage:', Object.fromEntries(Object.entries(localStorage)));
              console.log('User Agent:', navigator.userAgent);
            }}
            className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
          >
            Debug Info
          </button>
        </div>
        
        <div className="text-xs text-gray-300 mt-2">
          Check console (F12) for detailed logs
        </div>
      </div>
    </div>
  );
};