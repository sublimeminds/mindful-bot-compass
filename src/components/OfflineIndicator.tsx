
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { WifiOff } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

const OfflineIndicator = () => {
  try {
    const { isOnline } = usePWA();

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
  } catch (error) {
    console.error('OfflineIndicator error:', error);
    // Return null if there's an error to prevent app crash
    return null;
  }
};

export default OfflineIndicator;
