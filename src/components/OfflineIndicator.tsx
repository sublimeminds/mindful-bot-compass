
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { WifiOff } from 'lucide-react';

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = React.useState(true);

  React.useEffect(() => {
    // Simple online/offline detection without external dependencies
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    // Set initial status
    setIsOnline(navigator.onLine);

    // Listen for online/offline events
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
        <WifiOff className="h-3 w-3 mr-1" />
        Offline Mode
      </Badge>
    </div>
  );
};

export default OfflineIndicator;
