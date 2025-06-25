import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Mail, Smartphone, Clock, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ComprehensiveNotificationSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Use notification_preferences table instead of non-existent notification_settings
  const [preferences, setPreferences] = useState({
    email_notifications: true,
    push_notifications: true,
    sms_notifications: false,
    session_reminders: true,
    progress_updates: true,
    milestone_notifications: true,
    insight_notifications: true,
    streak_reminders: true,
    daily_summaries: false,
    weekly_reports: false,
    notification_frequency: 'normal' as 'minimal' | 'normal' | 'frequent',
    quiet_hours_start: '22:00',
    quiet_hours_end: '08:00'
  });

  useEffect(() => {
    if (user) {
      loadNotificationPreferences();
    }
  }, [user]);

  const loadNotificationPreferences = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setPreferences({
          email_notifications: data.email_notifications ?? true,
          push_notifications: data.push_notifications ?? true,
          sms_notifications: data.sms_notifications ?? false,
          session_reminders: data.session_reminders ?? true,
          progress_updates: data.progress_updates ?? true,
          milestone_notifications: data.milestone_notifications ?? true,
          insight_notifications: data.insight_notifications ?? true,
          streak_reminders: data.streak_reminders ?? true,
          daily_summaries: data.daily_summaries ?? false,
          weekly_reports: data.weekly_reports ?? false,
          notification_frequency: data.notification_frequency ?? 'normal',
          quiet_hours_start: data.quiet_hours_start ?? '22:00',
          quiet_hours_end: data.quiet_hours_end ?? '08:00'
        });
      }
    } catch (error) {
      console.error('Error loading notification preferences:', error);
      toast({
        title: "Error",
        description: "Failed to load notification preferences",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    if (!user) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user.id,
          ...preferences,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Notification preferences saved successfully",
      });
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save notification preferences",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePreferenceChange = (field: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-600"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bell className="h-5 w-5" />
          <span>Notification Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* General Notifications */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">General Notifications</h3>
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications">Email Notifications</Label>
            <Switch
              id="email-notifications"
              checked={preferences.email_notifications}
              onCheckedChange={(checked) => handlePreferenceChange('email_notifications', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="push-notifications">Push Notifications</Label>
            <Switch
              id="push-notifications"
              checked={preferences.push_notifications}
              onCheckedChange={(checked) => handlePreferenceChange('push_notifications', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="sms-notifications">SMS Notifications</Label>
            <Switch
              id="sms-notifications"
              checked={preferences.sms_notifications}
              onCheckedChange={(checked) => handlePreferenceChange('sms_notifications', checked)}
            />
          </div>
        </div>

        {/* Specific Notifications */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Specific Notifications</h3>
          <div className="flex items-center justify-between">
            <Label htmlFor="session-reminders">Session Reminders</Label>
            <Switch
              id="session-reminders"
              checked={preferences.session_reminders}
              onCheckedChange={(checked) => handlePreferenceChange('session_reminders', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="progress-updates">Progress Updates</Label>
            <Switch
              id="progress-updates"
              checked={preferences.progress_updates}
              onCheckedChange={(checked) => handlePreferenceChange('progress_updates', checked)}
            />
          </div>
           <div className="flex items-center justify-between">
            <Label htmlFor="milestone-notifications">Milestone Notifications</Label>
            <Switch
              id="milestone-notifications"
              checked={preferences.milestone_notifications}
              onCheckedChange={(checked) => handlePreferenceChange('milestone_notifications', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="insight-notifications">Insight Notifications</Label>
            <Switch
              id="insight-notifications"
              checked={preferences.insight_notifications}
              onCheckedChange={(checked) => handlePreferenceChange('insight_notifications', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="streak-reminders">Streak Reminders</Label>
            <Switch
              id="streak-reminders"
              checked={preferences.streak_reminders}
              onCheckedChange={(checked) => handlePreferenceChange('streak_reminders', checked)}
            />
          </div>
        </div>

        {/* Notification Frequency */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Frequency & Timing</h3>
          <div className="space-y-1">
            <Label htmlFor="notification-frequency">Notification Frequency</Label>
            <Select value={preferences.notification_frequency} onValueChange={(value) => handlePreferenceChange('notification_frequency', value as 'minimal' | 'normal' | 'frequent')}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minimal">Minimal</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="frequent">Frequent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="quiet-hours-start">Quiet Hours Start</Label>
              <input
                type="time"
                id="quiet-hours-start"
                className="flex h-10 w-full rounded-md border border-gray-200 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:text-muted-foreground file:h-10 file:w-14 file:flex-1 file:cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={preferences.quiet_hours_start}
                onChange={(e) => handlePreferenceChange('quiet_hours_start', e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="quiet-hours-end">Quiet Hours End</Label>
              <input
                type="time"
                id="quiet-hours-end"
                className="flex h-10 w-full rounded-md border border-gray-200 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:text-muted-foreground file:h-10 file:w-14 file:flex-1 file:cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={preferences.quiet_hours_end}
                onChange={(e) => handlePreferenceChange('quiet_hours_end', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <Button onClick={savePreferences} disabled={saving} className="w-full">
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ComprehensiveNotificationSettings;
