
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bell, Smartphone, Globe, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { MobilePushService } from '@/services/mobilePushService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const PushNotificationManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serviceWorkerSupported, setServiceWorkerSupported] = useState(false);
  const [pushSupported, setPushSupported] = useState(false);

  useEffect(() => {
    checkSupport();
  }, []);

  const checkSupport = async () => {
    const support = await MobilePushService.checkNotificationSupport();
    setIsSupported(support.supported);
    setPermission(support.permission);
    setServiceWorkerSupported(support.serviceWorkerSupported);
    setPushSupported(support.pushSupported);
    
    // Check if already subscribed
    if (support.serviceWorkerSupported) {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
      } catch (error) {
        console.error('Error checking subscription:', error);
      }
    }
  };

  const handleEnablePush = async () => {
    setIsLoading(true);
    try {
      // Register service worker first
      const swRegistered = await MobilePushService.registerServiceWorker();
      if (!swRegistered) {
        throw new Error('Failed to register service worker');
      }

      // Request permission
      const hasPermission = await MobilePushService.requestPermission();
      if (!hasPermission) {
        throw new Error('Permission denied');
      }

      // Subscribe to push
      const subscription = await MobilePushService.subscribeToPush();
      if (!subscription) {
        throw new Error('Failed to subscribe to push notifications');
      }

      // TODO: Save subscription to backend
      console.log('Push subscription:', subscription);

      setIsSubscribed(true);
      setPermission('granted');
      
      toast({
        title: "Push Notifications Enabled",
        description: "You'll now receive push notifications for important updates.",
      });

      // Send a test notification
      await MobilePushService.sendLocalNotification({
        title: "🎉 Push Notifications Enabled!",
        body: "You'll now receive important therapy reminders and insights.",
        icon: '/favicon.ico',
        data: { test: true }
      });

    } catch (error) {
      console.error('Error enabling push:', error);
      toast({
        title: "Failed to Enable Push",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisablePush = async () => {
    setIsLoading(true);
    try {
      const success = await MobilePushService.unsubscribeFromPush();
      if (success) {
        setIsSubscribed(false);
        toast({
          title: "Push Notifications Disabled",
          description: "You will no longer receive push notifications.",
        });
      }
    } catch (error) {
      console.error('Error disabling push:', error);
      toast({
        title: "Error",
        description: "Failed to disable push notifications.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendTestNotification = async () => {
    try {
      await MobilePushService.sendLocalNotification({
        title: "🧘 Test Notification",
        body: "This is a test notification from your therapy app. Everything is working perfectly!",
        icon: '/favicon.ico',
        requireInteraction: true,
        actions: [
          { action: 'view_session', title: 'Start Session' },
          { action: 'dismiss', title: 'Dismiss' }
        ],
        data: { type: 'test', url: '/chat' }
      });
      
      toast({
        title: "Test Notification Sent",
        description: "Check your notifications to see how it looks.",
      });
    } catch (error) {
      console.error('Error sending test notification:', error);
      toast({
        title: "Error",
        description: "Failed to send test notification.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = () => {
    if (!isSupported) {
      return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Not Supported</Badge>;
    }
    
    if (permission === 'granted' && isSubscribed) {
      return <Badge variant="default" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
    }
    
    if (permission === 'denied') {
      return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Blocked</Badge>;
    }
    
    return <Badge variant="secondary"><AlertTriangle className="h-3 w-3 mr-1" />Inactive</Badge>;
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">Please sign in to manage push notifications</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Smartphone className="h-5 w-5 mr-2" />
              Push Notifications
            </CardTitle>
            {getStatusBadge()}
          </div>
          <p className="text-sm text-muted-foreground">
            Receive important therapy reminders and insights directly on your device
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Support Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span className="text-sm">Notifications:</span>
              <Badge variant={isSupported ? "default" : "destructive"}>
                {isSupported ? "Supported" : "Not Supported"}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span className="text-sm">Service Worker:</span>
              <Badge variant={serviceWorkerSupported ? "default" : "destructive"}>
                {serviceWorkerSupported ? "Supported" : "Not Supported"}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Smartphone className="h-4 w-4" />
              <span className="text-sm">Push API:</span>
              <Badge variant={pushSupported ? "default" : "destructive"}>
                {pushSupported ? "Supported" : "Not Supported"}
              </Badge>
            </div>
          </div>

          {/* Alerts */}
          {!isSupported && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Your browser doesn't support push notifications. Try using Chrome, Firefox, or Safari.
              </AlertDescription>
            </Alert>
          )}

          {permission === 'denied' && (
            <Alert>
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                Push notifications are blocked. Please enable them in your browser settings.
              </AlertDescription>
            </Alert>
          )}

          {/* Controls */}
          {isSupported && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Enable Push Notifications</h4>
                  <p className="text-sm text-muted-foreground">
                    Get notified about session reminders, milestones, and insights
                  </p>
                </div>
                <Switch
                  checked={isSubscribed}
                  onCheckedChange={isSubscribed ? handleDisablePush : handleEnablePush}
                  disabled={isLoading || permission === 'denied'}
                />
              </div>

              {isSubscribed && (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={sendTestNotification}
                  >
                    Send Test Notification
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Features */}
          <div>
            <h4 className="font-medium mb-2">What you'll receive:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Session reminders at optimal times</li>
              <li>• Milestone achievements and celebrations</li>
              <li>• Personalized insights and tips</li>
              <li>• Weekly progress summaries</li>
              <li>• Mood check-in reminders</li>
            </ul>
          </div>

          {/* Privacy Note */}
          <Alert>
            <Bell className="h-4 w-4" />
            <AlertDescription>
              <strong>Privacy:</strong> Push notifications are sent directly to your device. 
              We never share your notification data with third parties.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default PushNotificationManager;
