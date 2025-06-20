import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Mail, Smartphone, MessageSquare, Save } from 'lucide-react';
import { useAuth } from '@/components/SimpleAuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NotificationSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  sms_notifications: boolean;
  session_reminders: boolean;
  progress_updates: boolean;
  milestone_notifications: boolean;
  insight_notifications: boolean;
  weekly_reports: boolean;
  daily_summaries: boolean;
  streak_reminders: boolean;
  notification_frequency: string;
  quiet_hours_start?: string;
  quiet_hours_end?: string;
}

const ComprehensiveNotificationSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    email_notifications: true,
    push_notifications: true,
    sms_notifications: false,
    session_reminders: true,
    progress_updates: true,
    milestone_notifications: true,
    insight_notifications: true,
    weekly_reports: false,
    daily_summaries: false,
    streak_reminders: true,
    notification_frequency: 'normal',
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
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSettings({
          email_notifications: data.email_notifications ?? true,
          push_notifications: data.push_notifications ?? true,
          sms_notifications: data.sms_notifications ?? false,
          session_reminders: data.session_reminders ?? true,
          progress_updates: data.progress_updates ?? true,
          milestone_notifications: data.milestone_notifications ?? true,
          insight_notifications: data.insight_notifications ?? true,
          weekly_reports: data.weekly_reports ?? false,
          daily_summaries: data.daily_summaries ?? false,
          streak_reminders: data.streak_reminders ?? true,
          notification_frequency: data.notification_frequency ?? 'normal',
          quiet_hours_start: data.quiet_hours_start,
          quiet_hours_end: data.quiet_hours_end,
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

  const handleSelectChange = (key: keyof NotificationSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user?.id,
          ...settings,
          updated_at: new Date().toISOString(),
        });

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
            Notification Channels
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
            </div>
            <Switch
              id="email-notifications"
              checked={settings.email_notifications}
              onCheckedChange={(checked) => handleToggle('email_notifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
              </div>
            </div>
            <Switch
              id="push-notifications"
              checked={settings.push_notifications}
              onCheckedChange={(checked) => handleToggle('push_notifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="sms-notifications">SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via text message</p>
              </div>
            </div>
            <Switch
              id="sms-notifications"
              checked={settings.sms_notifications}
              onCheckedChange={(checked) => handleToggle('sms_notifications', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Types</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="session-reminders">Session Reminders</Label>
              <p className="text-sm text-muted-foreground">Get reminded about upcoming therapy sessions</p>
            </div>
            <Switch
              id="session-reminders"
              checked={settings.session_reminders}
              onCheckedChange={(checked) => handleToggle('session_reminders', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="progress-updates">Progress Updates</Label>
              <p className="text-sm text-muted-foreground">Receive updates about your therapy progress</p>
            </div>
            <Switch
              id="progress-updates"
              checked={settings.progress_updates}
              onCheckedChange={(checked) => handleToggle('progress_updates', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="milestone-notifications">Milestone Achievements</Label>
              <p className="text-sm text-muted-foreground">Get notified when you reach important milestones</p>
            </div>
            <Switch
              id="milestone-notifications"
              checked={settings.milestone_notifications}
              onCheckedChange={(checked) => handleToggle('milestone_notifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="insight-notifications">Therapy Insights</Label>
              <p className="text-sm text-muted-foreground">Receive personalized insights and recommendations</p>
            </div>
            <Switch
              id="insight-notifications"
              checked={settings.insight_notifications}
              onCheckedChange={(checked) => handleToggle('insight_notifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="weekly-reports">Weekly Reports</Label>
              <p className="text-sm text-muted-foreground">Get weekly summaries of your progress</p>
            </div>
            <Switch
              id="weekly-reports"
              checked={settings.weekly_reports}
              onCheckedChange={(checked) => handleToggle('weekly_reports', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="daily-summaries">Daily Summaries</Label>
              <p className="text-sm text-muted-foreground">Receive daily mood and activity summaries</p>
            </div>
            <Switch
              id="daily-summaries"
              checked={settings.daily_summaries}
              onCheckedChange={(checked) => handleToggle('daily_summaries', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="streak-reminders">Streak Reminders</Label>
              <p className="text-sm text-muted-foreground">Get reminded to maintain your therapy streaks</p>
            </div>
            <Switch
              id="streak-reminders"
              checked={settings.streak_reminders}
              onCheckedChange={(checked) => handleToggle('streak_reminders', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Frequency</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="frequency">How often would you like to receive notifications?</Label>
            <Select value={settings.notification_frequency} onValueChange={(value) => handleSelectChange('notification_frequency', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minimal">Minimal - Only urgent notifications</SelectItem>
                <SelectItem value="normal">Normal - Important updates and reminders</SelectItem>
                <SelectItem value="frequent">Frequent - All notifications and updates</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quiet-start">Quiet Hours Start</Label>
              <input
                id="quiet-start"
                type="time"
                value={settings.quiet_hours_start || ''}
                onChange={(e) => handleSelectChange('quiet_hours_start', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quiet-end">Quiet Hours End</Label>
              <input
                id="quiet-end"
                type="time"
                value={settings.quiet_hours_end || ''}
                onChange={(e) => handleSelectChange('quiet_hours_end', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            During quiet hours, you'll only receive urgent notifications.
          </p>
        </CardContent>
      </Card>

      <Button onClick={saveSettings} disabled={saving} className="w-full">
        <Save className="h-4 w-4 mr-2" />
        {saving ? 'Saving...' : 'Save Notification Settings'}
      </Button>
    </div>
  );
};

export default ComprehensiveNotificationSettings;
