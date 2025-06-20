import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Clock, Volume2, Smartphone, Mail, MessageSquare } from 'lucide-react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { useNotificationPreferences } from '@/hooks/useNotificationPreferences';

const AdvancedNotificationSettings = () => {
  const { user } = useSimpleApp();
  const { preferences, isLoading, updatePreferences } = useNotificationPreferences();

  const [emailNotifications, setEmailNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [notificationVolume, setNotificationVolume] = useState(50);
  const [notificationTime, setNotificationTime] = useState('08:00');
  const [notificationFrequency, setNotificationFrequency] = useState('daily');
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  useEffect(() => {
    if (preferences) {
      setEmailNotifications(preferences.emailNotifications ?? false);
      setPushNotifications(preferences.pushNotifications ?? false);
      setNotificationVolume(preferences.notificationVolume ?? 50);
      setNotificationTime(preferences.notificationTime ?? '08:00');
      setNotificationFrequency(preferences.notificationFrequency ?? 'daily');
    }
  }, [preferences]);

  const handleSave = async () => {
    setLoadingUpdate(true);
    const success = await updatePreferences({
      emailNotifications,
      pushNotifications,
      notificationVolume,
      notificationTime,
      notificationFrequency
    });
    setLoadingUpdate(false);
    if (!success) {
      // Optionally handle failure feedback here
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="email-notifications">Email Notifications</Label>
          <Switch
            id="email-notifications"
            checked={emailNotifications}
            onCheckedChange={setEmailNotifications}
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="push-notifications">Push Notifications</Label>
          <Switch
            id="push-notifications"
            checked={pushNotifications}
            onCheckedChange={setPushNotifications}
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="notification-volume">Notification Volume</Label>
          <Slider
            id="notification-volume"
            value={notificationVolume}
            onValueChange={setNotificationVolume}
            min={0}
            max={100}
            step={1}
            disabled={isLoading}
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Mute</span>
            <span>Max</span>
          </div>
        </div>

        <div>
          <Label htmlFor="notification-time">Preferred Notification Time</Label>
          <Select
            value={notificationTime}
            onValueChange={setNotificationTime}
            disabled={isLoading}
          >
            <SelectTrigger id="notification-time" className="w-full">
              <SelectValue />
            </SelectTrigger>
            {Array.from({ length: 24 }).map((_, hour) => {
              const timeLabel = `${hour.toString().padStart(2, '0')}:00`;
              return (
                <SelectItem key={timeLabel} value={timeLabel}>
                  {timeLabel}
                </SelectItem>
              );
            })}
          </Select>
        </div>

        <div>
          <Label htmlFor="notification-frequency">Notification Frequency</Label>
          <Select
            value={notificationFrequency}
            onValueChange={setNotificationFrequency}
            disabled={isLoading}
          >
            <SelectTrigger id="notification-frequency" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </Select>
        </div>

        <Button
          onClick={handleSave}
          disabled={isLoading || loadingUpdate}
          className="w-full"
        >
          {loadingUpdate ? 'Saving...' : 'Save Preferences'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdvancedNotificationSettings;
