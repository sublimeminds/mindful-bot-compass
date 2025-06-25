import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Bell, Mail, MessageSquare, Calendar, Shield, Volume2 } from 'lucide-react';

interface NotificationSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  sms_alerts: boolean;
  session_reminders: boolean;
  security_alerts: boolean;
  sound_enabled: boolean;
}

const ComprehensiveNotificationSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    email_notifications: true,
    push_notifications: true,
    sms_alerts: false,
    session_reminders: true,
    security_alerts: true,
    sound_enabled: true,
  });

  useEffect(() => {
    if (user) {
      loadNotificationSettings();
    }
  }, [user]);

  const loadNotificationSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('notification_settings')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data?.notification_settings && typeof data.notification_settings === 'object') {
        const notificationData = data.notification_settings as Record<string, any>;
        setSettings({
          email_notifications: notificationData.email_notifications ?? true,
          push_notifications: notificationData.push_notifications ?? true,
          sms_alerts: notificationData.sms_alerts ?? false,
          session_reminders: notificationData.session_reminders ?? true,
          security_alerts: notificationData.security_alerts ?? true,
          sound_enabled: notificationData.sound_enabled ?? true,
        });
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
      toast({
        title: "Error",
        description: "Failed to load notification settings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          notification_settings: settings as any,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Notification settings saved successfully!",
      });

    } catch (error) {
      console.error('Error saving notification settings:', error);
      toast({
        title: "Error",
        description: "Failed to save notification settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive important updates and reminders via email
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={settings.email_notifications}
              onCheckedChange={(checked) => handleToggle('email_notifications', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Get real-time alerts on your mobile device
              </p>
            </div>
            <Switch
              id="push-notifications"
              checked={settings.push_notifications}
              onCheckedChange={(checked) => handleToggle('push_notifications', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sms-alerts">SMS Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Receive critical alerts via SMS (e.g., security breaches)
              </p>
            </div>
            <Switch
              id="sms-alerts"
              checked={settings.sms_alerts}
              onCheckedChange={(checked) => handleToggle('sms_alerts', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="session-reminders">Session Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Get reminders for upcoming therapy sessions
              </p>
            </div>
            <Switch
              id="session-reminders"
              checked={settings.session_reminders}
              onCheckedChange={(checked) => handleToggle('session_reminders', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="security-alerts">Security Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications about suspicious activity on your account
              </p>
            </div>
            <Switch
              id="security-alerts"
              checked={settings.security_alerts}
              onCheckedChange={(checked) => handleToggle('security_alerts', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sound-enabled">Sound Enabled</Label>
              <p className="text-sm text-muted-foreground">
                Enable sound for notifications
              </p>
            </div>
            <Switch
              id="sound-enabled"
              checked={settings.sound_enabled}
              onCheckedChange={(checked) => handleToggle('sound_enabled', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={saveSettings} disabled={saving} className="w-full">
        {saving ? 'Saving...' : 'Save Notification Settings'}
      </Button>
    </div>
  );
};

export default ComprehensiveNotificationSettings;
