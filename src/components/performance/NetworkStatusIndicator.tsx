
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, Loader2, Signal, SignalLow, SignalMedium, SignalHigh } from 'lucide-react';
import { useNetworkResilience } from '@/hooks/useNetworkResilience';

const NetworkStatusIndicator = () => {
  const { networkState } = useNetworkResilience();
  const { isOnline, effectiveType, isSlowConnection, retryCount } = networkState;

  const getSignalIcon = () => {
    if (!isOnline) return WifiOff;
    if (isSlowConnection) return SignalLow;
    
    switch (effectiveType) {
      case '4g':
      case '5g':
        return SignalHigh;
      case '3g':
        return SignalMedium;
      case '2g':
      case 'slow-2g':
        return SignalLow;
      default:
        return Signal;
    }
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    if (retryCount > 0) return `Retrying... (${retryCount})`;
    if (isSlowConnection) return 'Slow Connection';
    return effectiveType ? effectiveType.toUpperCase() : 'Online';
  };

  const getVariant = (): "default" | "secondary" | "destructive" | "outline" => {
    if (!isOnline) return 'destructive';
    if (retryCount > 0) return 'secondary';
    if (isSlowConnection) return 'outline';
    return 'default';
  };

  const IconComponent = getSignalIcon();

  return (
    <div className="fixed top-4 right-4 z-50">
      <Badge variant={getVariant()} className="flex items-center space-x-1">
        {retryCount > 0 ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <IconComponent className="h-3 w-3" />
        )}
        <span className="text-xs">{getStatusText()}</span>
      </Badge>
    </div>
  );
};

export default NetworkStatusIndicator;
