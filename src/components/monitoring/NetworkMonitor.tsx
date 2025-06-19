
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Wifi, WifiOff, Globe, Activity } from 'lucide-react';

interface NetworkStats {
  isOnline: boolean;
  connectionType: string;
  downlink: number;
  effectiveType: string;
  rtt: number;
  saveData: boolean;
}

const NetworkMonitor = () => {
  const [networkStats, setNetworkStats] = useState<NetworkStats | null>(null);
  const [requestHistory, setRequestHistory] = useState<Array<{
    url: string;
    duration: number;
    status: number;
    timestamp: Date;
  }>>([]);

  useEffect(() => {
    const updateNetworkInfo = () => {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      
      if (connection) {
        setNetworkStats({
          isOnline: navigator.onLine,
          connectionType: connection.type || 'unknown',
          downlink: connection.downlink || 0,
          effectiveType: connection.effectiveType || 'unknown',
          rtt: connection.rtt || 0,
          saveData: connection.saveData || false
        });
      } else {
        setNetworkStats({
          isOnline: navigator.onLine,
          connectionType: 'unknown',
          downlink: 0,
          effectiveType: 'unknown',
          rtt: 0,
          saveData: false
        });
      }
    };

    updateNetworkInfo();

    const handleOnline = () => updateNetworkInfo();
    const handleOffline = () => updateNetworkInfo();
    const handleConnectionChange = () => updateNetworkInfo();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', handleConnectionChange);
    }

    // Monitor network requests
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      try {
        const response = await originalFetch(...args);
        const duration = performance.now() - startTime;
        
        setRequestHistory(prev => [{
          url: args[0] as string,
          duration: Math.round(duration),
          status: response.status,
          timestamp: new Date()
        }, ...prev].slice(0, 10));
        
        return response;
      } catch (error) {
        const duration = performance.now() - startTime;
        setRequestHistory(prev => [{
          url: args[0] as string,
          duration: Math.round(duration),
          status: 0,
          timestamp: new Date()
        }, ...prev].slice(0, 10));
        throw error;
      }
    };

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (connection) {
        connection.removeEventListener('change', handleConnectionChange);
      }
      window.fetch = originalFetch;
    };
  }, []);

  const getConnectionQuality = (downlink: number) => {
    if (downlink >= 10) return { label: 'Excellent', color: 'bg-green-500', percentage: 100 };
    if (downlink >= 5) return { label: 'Good', color: 'bg-blue-500', percentage: 80 };
    if (downlink >= 1) return { label: 'Fair', color: 'bg-yellow-500', percentage: 60 };
    return { label: 'Poor', color: 'bg-red-500', percentage: 30 };
  };

  const getStatusColor = (status: number) => {
    if (status === 0) return 'bg-red-100 text-red-800';
    if (status >= 200 && status < 300) return 'bg-green-100 text-green-800';
    if (status >= 300 && status < 400) return 'bg-blue-100 text-blue-800';
    if (status >= 400) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (!networkStats) return null;

  const quality = getConnectionQuality(networkStats.downlink);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          {networkStats.isOnline ? (
            <Wifi className="h-5 w-5 mr-2 text-green-500" />
          ) : (
            <WifiOff className="h-5 w-5 mr-2 text-red-500" />
          )}
          Network Monitor
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Connection Status */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Status</div>
            <Badge className={networkStats.isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
              {networkStats.isOnline ? 'Online' : 'Offline'}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Type</div>
            <Badge variant="outline">{networkStats.effectiveType}</Badge>
          </div>
        </div>

        {/* Connection Quality */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Connection Quality</span>
            <Badge className={`${quality.color} text-white`}>
              {quality.label}
            </Badge>
          </div>
          <Progress value={quality.percentage} className="h-2" />
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Speed:</span> {networkStats.downlink} Mbps
            </div>
            <div>
              <span className="text-muted-foreground">Latency:</span> {networkStats.rtt}ms
            </div>
          </div>
        </div>

        {/* Recent Requests */}
        <div className="space-y-3">
          <h3 className="font-medium text-sm">Recent Network Requests</h3>
          {requestHistory.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              <Globe className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recent requests</p>
            </div>
          ) : (
            <div className="space-y-2">
              {requestHistory.map((request, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                  <div className="flex-1 truncate mr-2">
                    {request.url.replace(window.location.origin, '')}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">{request.duration}ms</span>
                    <Badge className={`text-xs ${getStatusColor(request.status)}`}>
                      {request.status || 'ERR'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkMonitor;
