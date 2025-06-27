
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wifi, WifiOff, Brain, Loader2 } from 'lucide-react';

interface ElectronAppWrapperProps {
  children: React.ReactNode;
}

const ElectronAppWrapper = ({ children }: ElectronAppWrapperProps) => {
  const [isElectron, setIsElectron] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasSupabaseError, setHasSupabaseError] = useState(false);
  const [initializationComplete, setInitializationComplete] = useState(false);

  useEffect(() => {
    console.log('ElectronAppWrapper: Initializing...');
    
    // Detect if running in Electron
    const electronCheck = window.navigator.userAgent.toLowerCase().includes('electron') ||
                         typeof window.electronAPI !== 'undefined' ||
                         window.location.protocol === 'file:';
    
    setIsElectron(electronCheck);
    console.log('ElectronAppWrapper: Electron detected:', electronCheck);

    // For Electron, set a timeout to ensure the app loads even if auth is slow
    const initTimeout = setTimeout(() => {
      console.log('ElectronAppWrapper: Initialization timeout reached, showing app');
      setInitializationComplete(true);
    }, electronCheck ? 3000 : 1000); // 3 seconds for Electron, 1 second for web

    // Listen for online/offline events
    const handleOnline = () => {
      console.log('ElectronAppWrapper: Online');
      setIsOnline(true);
    };
    
    const handleOffline = () => {
      console.log('ElectronAppWrapper: Offline');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check for Supabase connection errors
    const handleError = (event: ErrorEvent) => {
      if (event.error?.message?.includes('supabase') || 
          event.error?.message?.includes('fetch') ||
          event.error?.message?.includes('network')) {
        console.log('ElectronAppWrapper: Supabase connection error detected:', event.error.message);
        setHasSupabaseError(true);
      }
    };

    window.addEventListener('error', handleError);

    // Clear timeout when component unmounts
    return () => {
      clearTimeout(initTimeout);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('error', handleError);
    };
  }, []);

  // Auto-complete initialization after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitializationComplete(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Show loading screen for Electron during initialization
  if (isElectron && !initializationComplete && !hasSupabaseError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center text-therapy-600">
              <Brain className="h-6 w-6 mr-2" />
              TherapySync
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <div className="flex items-center justify-center mb-4">
              <Loader2 className="h-12 w-12 text-therapy-500 animate-spin" />
            </div>
            
            <p className="text-muted-foreground">
              Initializing TherapySync...
            </p>

            <div className="text-xs text-muted-foreground">
              <p>Setting up your mental health companion</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show offline mode for Electron when there are connection issues
  if (isElectron && (!isOnline || hasSupabaseError)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center text-therapy-600">
              {isOnline ? <Wifi className="h-6 w-6 mr-2" /> : <WifiOff className="h-6 w-6 mr-2" />}
              TherapySync - Offline Mode
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center mb-4">
              <Brain className="h-16 w-16 text-therapy-500" />
            </div>
            
            <p className="text-muted-foreground text-center">
              {!isOnline 
                ? "You're currently offline. Some features may be limited."
                : "Connection to our servers is limited. Running in offline mode."
              }
            </p>

            <div className="space-y-2 text-sm text-center">
              <p>Available offline features:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Breathing exercises</li>
                <li>• Mood tracking (local)</li>
                <li>• Mindfulness techniques</li>
                <li>• Previous session notes</li>
              </ul>
            </div>

            <Button 
              onClick={() => window.location.reload()}
              className="w-full bg-therapy-500 hover:bg-therapy-600"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default ElectronAppWrapper;
