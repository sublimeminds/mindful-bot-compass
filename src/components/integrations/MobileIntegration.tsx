
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/SimpleAuthProvider';
import { 
  mobile, 
  bell, 
  Download, 
  Share2,
  Zap,
  Shield,
  Volume2
} from 'lucide-react';

interface PushSubscription {
  id: string;
  device_type: string;
  device_name?: string;
  is_active: boolean;
}

const MobileIntegration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subscriptions, setSubscriptions] = useState<PushSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  const mobileFeatures = [
    {
      id: 'push-notifications',
      name: 'Push Notifications',
      icon: bell,
      description: 'Receive important alerts and reminders on your mobile device',
      features: ['Session Reminders', 'Crisis Alerts', 'Progress Updates', 'Milestone Celebrations'],
      color: 'bg-blue-500'
    },
    {
      id: 'offline-sync',
      name: 'Offline Sync',
      icon: Download,
      description: 'Access your therapy content even when offline',
      features: ['Cached Sessions', 'Offline Journaling', 'Local Storage', 'Auto Sync'],
      color: 'bg-green-500'
    },
    {
      id: 'quick-share',
      name: 'Quick Share',
      icon: Share2,
      description: 'Easily share progress and insights with your therapist',
      features: ['Progress Sharing', 'Mood Updates', 'Session Notes', 'Achievement Badges'],
      color: 'bg-purple-500'
    }
  ];

  useEffect(() => {
    if (user) {
      loadPushSubscriptions();
      checkNotificationPermission();
    }
  }, [user]);

  const loadPushSubscriptions = async () => {
    try {
      // Mock data until database types are updated
      setSubscriptions([]);
    } catch (error) {
      console.error('Error loading push subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkNotificationPermission = () => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        await registerPushSubscription();
        toast({
          title: "Notifications Enabled",
          description: "You'll now receive push notifications for important updates",
        });
      } else {
        toast({
          title: "Notifications Blocked",
          description: "Please enable notifications in your browser settings",
          variant: "destructive"
        });
      }
    }
  };

  const registerPushSubscription = async () => {
    try {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        // Generate a mock subscription for demo purposes
        const mockSubscription: PushSubscription = {
          id: Math.random().toString(36).substr(2, 9),
          device_type: 'web',
          device_name: navigator.userAgent.includes('Mobile') ? 'Mobile Browser' : 'Desktop Browser',
          is_active: true
        };

        setSubscriptions([...subscriptions, mockSubscription]);
      }
    } catch (error) {
      console.error('Error registering push subscription:', error);
    }
  };

  const toggleSubscription = async (subscriptionId: string, isActive: boolean) => {
    try {
      setSubscriptions(subscriptions.map(sub => 
        sub.id === subscriptionId ? { ...sub, is_active: isActive } : sub
      ));

      toast({
        title: isActive ? "Notifications Enabled" : "Notifications Disabled",
        description: `Push notifications have been ${isActive ? 'enabled' : 'disabled'} for this device`,
      });
    } catch (error) {
      console.error('Error toggling subscription:', error);
    }
  };

  const sendTestNotification = async () => {
    if (notificationPermission === 'granted') {
      new Notification('Therapy App', {
        body: 'This is a test notification from your therapy app!',
        icon: '/lovable-uploads/0aa199c0-064e-4e1a-b96c-2beda903c183.png',
        badge: '/lovable-uploads/0aa199c0-064e-4e1a-b96c-2beda903c183.png'
      });

      toast({
        title: "Test Notification Sent",
        description: "Check if you received the test notification",
      });
    }
  };

  const installPWA = () => {
    toast({
      title: "Install App",
      description: "Look for the 'Add to Home Screen' option in your browser menu",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mobile Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mobileFeatures.map((feature) => {
          const Icon = feature.icon;
          
          return (
            <Card key={feature.id} className="border-therapy-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 ${feature.color} rounded-lg`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{feature.name}</CardTitle>
                    <p className="text-sm text-therapy-600">{feature.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h5 className="font-medium text-therapy-900 mb-2 text-sm">Features</h5>
                  <div className="flex flex-wrap gap-1">
                    {feature.features.map((item) => (
                      <Badge key={item} variant="secondary" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* PWA Installation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Install Mobile App</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-therapy-600">
            Install our Progressive Web App (PWA) for the best mobile experience. 
            Get app-like features including offline access and push notifications.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <mobile className="h-8 w-8 text-blue-500 mb-2" />
              <h4 className="font-medium mb-1">Mobile Benefits</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Full-screen experience</li>
                <li>• Faster loading times</li>
                <li>• Offline functionality</li>
                <li>• Home screen access</li>
              </ul>
            </div>
            
            <div className="p-4 border rounded-lg">
              <Shield className="h-8 w-8 text-green-500 mb-2" />
              <h4 className="font-medium mb-1">Security Features</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Encrypted data storage</li>
                <li>• Secure authentication</li>
                <li>• HTTPS only</li>
                <li>• Privacy protection</li>
              </ul>
            </div>
          </div>
          
          <Button onClick={installPWA} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Install Mobile App
          </Button>
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <bell className="h-5 w-5" />
            <span>Push Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {notificationPermission === 'default' && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <bell className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-blue-900 mb-1">Enable Notifications</h4>
                  <p className="text-sm text-blue-600 mb-3">
                    Get notified about important updates, session reminders, and crisis alerts.
                  </p>
                  <Button onClick={requestNotificationPermission} size="sm">
                    Enable Notifications
                  </Button>
                </div>
              </div>
            </div>
          )}

          {notificationPermission === 'granted' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Notification Status</h4>
                  <p className="text-sm text-gray-600">Notifications are enabled for this device</p>
                </div>
                <Badge variant="default" className="bg-green-600">
                  <bell className="h-3 w-3 mr-1" />
                  Enabled
                </Badge>
              </div>

              <Button onClick={sendTestNotification} variant="outline" size="sm">
                <Zap className="h-4 w-4 mr-2" />
                Send Test Notification
              </Button>
            </div>
          )}

          {notificationPermission === 'denied' && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <bell className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900 mb-1">Notifications Blocked</h4>
                  <p className="text-sm text-red-600">
                    Notifications are blocked. Please enable them in your browser settings to receive important alerts.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Active Subscriptions */}
          {subscriptions.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Active Devices</h4>
              {subscriptions.map((subscription) => (
                <div key={subscription.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <mobile className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">{subscription.device_name || 'Unknown Device'}</p>
                      <p className="text-sm text-gray-600 capitalize">{subscription.device_type}</p>
                    </div>
                  </div>
                  <Switch
                    checked={subscription.is_active}
                    onCheckedChange={(checked) => toggleSubscription(subscription.id, checked)}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileIntegration;
