
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, BellRing, BellOff, Smartphone, Settings, Check, X, Clock } from 'lucide-react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { useToast } from '@/hooks/use-toast';
import { MobilePushService } from '@/services/mobilePushService';

interface NotificationSettings {
  enabled: boolean;
  sessionReminders: boolean;
  moodCheckIns: boolean;
  progressUpdates: boolean;
  emergencyAlerts: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  frequency: 'high' | 'medium' | 'low';
}

const EnhancedPushNotificationManager = () => {
  const { user } = useSimpleApp();
  const { toast } = useToast();
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: false,
    sessionReminders: true,
    moodCheckIns: true,
    progressUpdates: false,
    emergencyAlerts: true,
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '08:00'
    },
    frequency: 'medium'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [supportInfo, setSupportInfo] = useState({
    supported: false,
    serviceWorkerSupported: false,
    pushSupported: false
  });

  useEffect(() => {
    checkNotificationSupport();
    loadUserSettings();
  }, [user]);

  const checkNotificationSupport = async () => {
    const info = await MobilePushService.checkNotificationSupport();
    setSupportInfo(info);
    setPermissionStatus(info.permission);
  };

  const loadUserSettings = () => {
    // Load from localStorage or user preferences
    const saved = localStorage.getItem(`notification-settings-${user?.id}`);
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  };

  const saveSettings = async (newSettings: NotificationSettings) => {
    setIsLoading(true);
    try {
      localStorage.setItem(`notification-settings-${user?.id}`, JSON.stringify(newSettings));
      setSettings(newSettings);
      
      if (newSettings.enabled && permissionStatus !== 'granted') {
        const granted = await MobilePushService.requestPermission();
        if (granted) {
          setPermissionStatus('granted');
          await subscribeToNotifications();
        }
      }
      
      toast({
        title: "Settings Saved",
        description: "Your notification preferences have been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save notification settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const subscribeToNotifications = async () => {
    try {
      const subscription = await MobilePushService.subscribeToPush();
      if (subscription) {
        console.log('Subscribed to push notifications:', subscription);
        // You would typically send this subscription to your backend here
      }
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
    }
  };

  const testNotification = async () => {
    if (permissionStatus === 'granted') {
      await MobilePushService.sendLocalNotification({
        title: 'Test Notification',
        body: 'Your notifications are working perfectly!',
        icon: '/favicon.ico'
      });
    } else {
      toast({
        title: "Permission Required",
        description: "Please enable notifications first.",
        variant: "destructive",
      });
    }
  };

  const handleToggle = async (key: keyof NotificationSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    await saveSettings(newSettings);
  };

  const handleQuietHoursChange = async (key: 'start' | 'end', value: string) => {
    const newSettings = {
      ...settings,
      quietHours: { ...settings.quietHours, [key]: value }
    };
    await saveSettings(newSettings);
  };

  if (!supportInfo.supported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BellOff className="h-5 w-5" />
            <span>Notifications Not Supported</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Your browser doesn't support push notifications. Please use a modern browser for the best experience.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Smartphone className="h-5 w-5" />
              <span>Push Notifications</span>
            </div>
            <Badge variant={permissionStatus === 'granted' ? 'default' : 'secondary'}>
              {permissionStatus === 'granted' ? 'Enabled' : 'Disabled'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Master Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Enable Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive personalized reminders and updates
              </p>
            </div>
            <Switch
              checked={settings.enabled}
              onCheckedChange={(checked) => handleToggle('enabled', checked)}
              disabled={isLoading}
            />
          </div>

          {/* Notification Types */}
          {settings.enabled && (
            <>
              <div className="space-y-4">
                <h4 className="font-medium">Notification Types</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Session Reminders</Label>
                      <p className="text-xs text-muted-foreground">Daily therapy session prompts</p>
                    </div>
                    <Switch
                      checked={settings.sessionReminders}
                      onCheckedChange={(checked) => handleToggle('sessionReminders', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Mood Check-ins</Label>
                      <p className="text-xs text-muted-foreground">Regular mood tracking reminders</p>
                    </div>
                    <Switch
                      checked={settings.moodCheckIns}
                      onCheckedChange={(checked) => handleToggle('moodCheckIns', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Progress Updates</Label>
                      <p className="text-xs text-muted-foreground">Weekly progress summaries</p>
                    </div>
                    <Switch
                      checked={settings.progressUpdates}
                      onCheckedChange={(checked) => handleToggle('progressUpdates', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Emergency Alerts</Label>
                      <p className="text-xs text-muted-foreground">Crisis support notifications</p>
                    </div>
                    <Switch
                      checked={settings.emergencyAlerts}
                      onCheckedChange={(checked) => handleToggle('emergencyAlerts', checked)}
                    />
                  </div>
                </div>
              </div>

              {/* Frequency Setting */}
              <div className="space-y-2">
                <Label>Notification Frequency</Label>
                <Select
                  value={settings.frequency}
                  onValueChange={(value: 'high' | 'medium' | 'low') => 
                    saveSettings({ ...settings, frequency: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High (Multiple times daily)</SelectItem>
                    <SelectItem value="medium">Medium (Once daily)</SelectItem>
                    <SelectItem value="low">Low (Few times weekly)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Quiet Hours */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Quiet Hours</Label>
                    <p className="text-sm text-muted-foreground">Disable notifications during sleep</p>
                  </div>
                  <Switch
                    checked={settings.quietHours.enabled}
                    onCheckedChange={(checked) => 
                      saveSettings({ 
                        ...settings, 
                        quietHours: { ...settings.quietHours, enabled: checked }
                      })
                    }
                  />
                </div>

                {settings.quietHours.enabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm">Start Time</Label>
                      <input
                        type="time"
                        value={settings.quietHours.start}
                        onChange={(e) => handleQuietHoursChange('start', e.target.value)}
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">End Time</Label>
                      <input
                        type="time"
                        value={settings.quietHours.end}
                        onChange={(e) => handleQuietHoursChange('end', e.target.value)}
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Test Button */}
              <Button
                onClick={testNotification}
                variant="outline"
                className="w-full"
                disabled={permissionStatus !== 'granted'}
              >
                <Bell className="h-4 w-4 mr-2" />
                Test Notification
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedPushNotificationManager;
