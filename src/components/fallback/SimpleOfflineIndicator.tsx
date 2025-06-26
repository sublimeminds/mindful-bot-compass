
import React from 'react';
import { WifiOff } from 'lucide-react';

interface OfflineIndicatorState {
  isOnline: boolean;
}

interface SimpleOfflineIndicatorProps {
  className?: string;
}

const SimpleOfflineIndicator: React.FC<SimpleOfflineIndicatorProps> = ({ className = '' }) => {
  const [state, setState] = React.useState<OfflineIndicatorState>({ isOnline: navigator.onLine });

  React.useEffect(() => {
    const handleOnline = () => setState({ isOnline: true });
    const handleOffline = () => setState({ isOnline: false });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (state.isOnline) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 bg-red-500 text-white px-4 py-2 text-center z-50 ${className}`}>
      <div className="flex items-center justify-center space-x-2">
        <WifiOff className="h-4 w-4" />
        <span className="text-sm">You are currently offline</span>
      </div>
    </div>
  );
};

export default SimpleOfflineIndicator;
