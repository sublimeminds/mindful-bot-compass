import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, BellRing, BellOff, Smartphone, Settings, Check, X } from 'lucide-react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { useToast } from '@/hooks/use-toast';

const PushNotificationManager = () => {
  const { user } = useSimpleApp();
  const { toast } = useToast();
  const [pushEnabled, setPushEnabled] = useState(false);
  const [notificationType, setNotificationType] = useState<'all' | 'important' | 'none'>('all');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load user preferences from local storage or database
    loadPreferences();
  }, [user]);

  const loadPreferences = () => {
    // Mock loading preferences
    setIsLoading(true);
    setTimeout(() => {
      setPushEnabled(true);
      setNotificationType('all');
      setIsLoading(false);
    }, 500);
  };

  const savePreferences = () => {
    // Mock saving preferences
    setIsLoading(true);
    setTimeout(() => {
      toast({
        title: "Preferences Saved",
        description: "Your push notification preferences have been updated.",
      });
      setIsLoading(false);
    }, 500);
  };

  const handlePushToggle = (checked: boolean) => {
    setPushEnabled(checked);
    savePreferences();
  };

  const handleNotificationTypeChange = (type: 'all' | 'important' | 'none') => {
    setNotificationType(type);
    savePreferences();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Smartphone className="h-5 w-5" />
          <span>Push Notifications</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="push-enabled">Enable Push Notifications</Label>
          <Switch
            id="push-enabled"
            checked={pushEnabled}
            onCheckedChange={handlePushToggle}
            disabled={isLoading}
          />
        </div>

        {pushEnabled && (
          <div className="space-y-2">
            <Label>Notification Type</Label>
            <div className="flex items-center space-x-4">
              <Button
                variant={notificationType === 'all' ? 'default' : 'outline'}
                onClick={() => handleNotificationTypeChange('all')}
                disabled={isLoading}
              >
                <BellRing className="h-4 w-4 mr-2" />
                All
              </Button>
              <Button
                variant={notificationType === 'important' ? 'default' : 'outline'}
                onClick={() => handleNotificationTypeChange('important')}
                disabled={isLoading}
              >
                <Bell className="h-4 w-4 mr-2" />
                Important
              </Button>
              <Button
                variant={notificationType === 'none' ? 'default' : 'outline'}
                onClick={() => handleNotificationTypeChange('none')}
                disabled={isLoading}
              >
                <BellOff className="h-4 w-4 mr-2" />
                None
              </Button>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="text-center">
            <Settings className="h-6 w-6 animate-spin mx-auto mb-2" />
            Saving preferences...
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PushNotificationManager;
