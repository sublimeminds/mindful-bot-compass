
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  WifiOff, 
  Wifi, 
  Download, 
  Upload, 
  RefreshCw, 
  Database,
  Sync,
  AlertCircle 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OfflineData {
  moodEntries: any[];
  journalEntries: any[];
  sessionNotes: any[];
  goals: any[];
}

interface SyncStatus {
  isOnline: boolean;
  pendingUploads: number;
  lastSync: Date | null;
  syncInProgress: boolean;
  cacheSize: number;
}

const OfflineManager = () => {
  const { toast } = useToast();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: navigator.onLine,
    pendingUploads: 0,
    lastSync: null,
    syncInProgress: false,
    cacheSize: 0
  });
  const [offlineData, setOfflineData] = useState<OfflineData>({
    moodEntries: [],
    journalEntries: [],
    sessionNotes: [],
    goals: []
  });

  useEffect(() => {
    // Listen for online/offline events
    const handleOnline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: true }));
      toast({
        title: "Back Online",
        description: "Your connection has been restored. Syncing data...",
      });
      syncData();
    };

    const handleOffline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: false }));
      toast({
        title: "Offline Mode",
        description: "You're now offline. Your data will be saved locally.",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load offline data and calculate cache size
    loadOfflineData();
    calculateCacheSize();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadOfflineData = () => {
    try {
      const stored = localStorage.getItem('offline-data');
      if (stored) {
        const data = JSON.parse(stored);
        setOfflineData(data);
        
        // Count pending uploads
        const pending = Object.values(data).reduce((total: number, items: any) => 
          total + (Array.isArray(items) ? items.length : 0), 0
        );
        setSyncStatus(prev => ({ ...prev, pendingUploads: pending }));
      }
    } catch (error) {
      console.error('Failed to load offline data:', error);
    }
  };

  const calculateCacheSize = async () => {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        const usedMB = (estimate.usage || 0) / (1024 * 1024);
        setSyncStatus(prev => ({ ...prev, cacheSize: Math.round(usedMB * 100) / 100 }));
      }
    } catch (error) {
      console.error('Failed to calculate cache size:', error);
    }
  };

  const syncData = async () => {
    if (!syncStatus.isOnline || syncStatus.syncInProgress) return;

    setSyncStatus(prev => ({ ...prev, syncInProgress: true }));

    try {
      // Simulate syncing process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Clear offline data after successful sync
      localStorage.removeItem('offline-data');
      setOfflineData({
        moodEntries: [],
        journalEntries: [],
        sessionNotes: [],
        goals: []
      });

      setSyncStatus(prev => ({
        ...prev,
        pendingUploads: 0,
        lastSync: new Date(),
        syncInProgress: false
      }));

      toast({
        title: "Sync Complete",
        description: "All your offline data has been synced successfully.",
      });
    } catch (error) {
      setSyncStatus(prev => ({ ...prev, syncInProgress: false }));
      toast({
        title: "Sync Failed",
        description: "Failed to sync offline data. Will retry automatically.",
        variant: "destructive",
      });
    }
  };

  const clearCache = async () => {
    try {
      await caches.delete('mindful-ai-v2');
      localStorage.clear();
      setSyncStatus(prev => ({ ...prev, cacheSize: 0, pendingUploads: 0 }));
      setOfflineData({
        moodEntries: [],
        journalEntries: [],
        sessionNotes: [],
        goals: []
      });
      
      toast({
        title: "Cache Cleared",
        description: "All offline data and cache has been cleared.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear cache.",
        variant: "destructive",
      });
    }
  };

  const downloadOfflineContent = async () => {
    try {
      // Simulate downloading essential content for offline use
      toast({
        title: "Downloading Content",
        description: "Preparing content for offline use...",
      });

      await new Promise(resolve => setTimeout(resolve, 3000));

      toast({
        title: "Download Complete",
        description: "Essential content is now available offline.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download offline content.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {syncStatus.isOnline ? (
                <Wifi className="h-5 w-5 text-green-500" />
              ) : (
                <WifiOff className="h-5 w-5 text-red-500" />
              )}
              <span>Connection Status</span>
            </div>
            <Badge variant={syncStatus.isOnline ? 'default' : 'destructive'}>
              {syncStatus.isOnline ? 'Online' : 'Offline'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!syncStatus.isOnline && (
            <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 p-3 rounded-md">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">
                You're offline. Your data will be saved locally and synced when connection is restored.
              </span>
            </div>
          )}

          {syncStatus.lastSync && (
            <div className="text-sm text-muted-foreground">
              Last synced: {syncStatus.lastSync.toLocaleString()}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sync Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sync className="h-5 w-5" />
            <span>Data Sync</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Pending Uploads</div>
              <div className="text-sm text-muted-foreground">
                {syncStatus.pendingUploads} items waiting to sync
              </div>
            </div>
            <Badge variant={syncStatus.pendingUploads > 0 ? 'secondary' : 'default'}>
              {syncStatus.pendingUploads}
            </Badge>
          </div>

          {syncStatus.syncInProgress && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span className="text-sm">Syncing data...</span>
              </div>
              <Progress value={65} className="h-2" />
            </div>
          )}

          <div className="flex space-x-2">
            <Button
              onClick={syncData}
              disabled={!syncStatus.isOnline || syncStatus.syncInProgress || syncStatus.pendingUploads === 0}
              variant="outline"
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              Sync Now
            </Button>
            
            <Button
              onClick={downloadOfflineContent}
              disabled={!syncStatus.isOnline}
              variant="outline"
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Download for Offline
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Storage Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Storage</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Cache Size</div>
              <div className="text-sm text-muted-foreground">
                Local storage usage
              </div>
            </div>
            <Badge variant="outline">
              {syncStatus.cacheSize} MB
            </Badge>
          </div>

          {/* Offline Data Breakdown */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Offline Data:</div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Mood Entries:</span>
                <span>{offlineData.moodEntries.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Journal Entries:</span>
                <span>{offlineData.journalEntries.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Session Notes:</span>
                <span>{offlineData.sessionNotes.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Goals:</span>
                <span>{offlineData.goals.length}</span>
              </div>
            </div>
          </div>

          <Button
            onClick={clearCache}
            variant="outline"
            className="w-full"
          >
            Clear Cache & Offline Data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default OfflineManager;
