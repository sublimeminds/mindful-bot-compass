
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, Smartphone, Mail, MessageSquare, 
  Clock, Volume2, Settings, Save,
  Calendar, Target, TrendingUp, Heart
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

type NotificationFrequency = "normal" | "minimal" | "frequent";

interface NotificationPreferences {
  email_notifications: boolean;
  push_notifications: boolean;
  sms_notifications: boolean;
  session_reminders: boolean;
  progress_updates: boolean;
  milestone_notifications: boolean;
  insight_notifications: boolean;
  streak_reminders: boolean;
  daily_summaries: boolean;
  weekly_reports: boolean;
  notification_frequency: NotificationFrequency;
  quiet_hours_start: string | null;
  quiet_hours_end: string | null;
}

const ComprehensiveNotificationSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
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
    notification_frequency: "normal",
    quiet_hours_start: null,
    quiet_hours_end: null,
  });

  useEffect(() => {
    if (user) {
      loadNotificationPreferences();
    }
  }, [user]);

  const loadNotificationPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setPreferences({
          email_notifications: data.email_notifications || true,
          push_notifications: data.push_notifications || true,
          sms_notifications: data.sms_notifications || false,
          session_reminders: data.session_reminders || true,
          progress_updates: data.progress_updates || true,
          milestone_notifications: data.milestone_notifications || true,
          insight_notifications: data.insight_notifications || true,
          streak_reminders: data.streak_reminders || true,
          daily_summaries: data.daily_summaries || false,
          weekly_reports: data.weekly_reports || false,
          notification_frequency: (data.notification_frequency as NotificationFrequency) || "normal",
          quiet_hours_start: data.quiet_hours_start || null,
          quiet_hours_end: data.quiet_hours_end || null,
        });
      }
    } catch (error) {
      console.error('Error loading notification preferences:', error);
      toast({
        title: "Error",
        description: "Failed to load notification preferences",
        variant: "destructive",
      });
    }
  };

  const updatePreference = (key: keyof NotificationPreferences, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const savePreferences = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user.id,
          ...preferences
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Notification preferences updated successfully",
      });
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save notification preferences",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="channels" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="channels">Channels</TabsTrigger>
              <TabsTrigger value="types">Types</TabsTrigger>
              <TabsTrigger value="timing">Timing</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="channels" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <Label className="text-base font-medium">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive updates via email</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.email_notifications}
                    onCheckedChange={(checked) => updatePreference('email_notifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-5 w-5 text-green-600" />
                    <div>
                      <Label className="text-base font-medium">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Browser and mobile push notifications</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.push_notifications}
                    onCheckedChange={(checked) => updatePreference('push_notifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                    <div>
                      <Label className="text-base font-medium">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Text message alerts for critical updates</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.sms_notifications}
                    onCheckedChange={(checked) => updatePreference('sms_notifications', checked)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="types" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <Label>Session Reminders</Label>
                  </div>
                  <Switch
                    checked={preferences.session_reminders}
                    onCheckedChange={(checked) => updatePreference('session_reminders', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <Label>Progress Updates</Label>
                  </div>
                  <Switch
                    checked={preferences.progress_updates}
                    onCheckedChange={(checked) => updatePreference('progress_updates', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-orange-500" />
                    <Label>Milestone Notifications</Label>
                  </div>
                  <Switch
                    checked={preferences.milestone_notifications}
                    onCheckedChange={(checked) => updatePreference('milestone_notifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <Label>Insight Notifications</Label>
                  </div>
                  <Switch
                    checked={preferences.insight_notifications}
                    onCheckedChange={(checked) => updatePreference('insight_notifications', checked)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="timing" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium mb-2 block">Notification Frequency</Label>
                  <Select
                    value={preferences.notification_frequency}
                    onValueChange={(value: NotificationFrequency) => updatePreference('notification_frequency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minimal">Minimal - Only essential notifications</SelectItem>
                      <SelectItem value="normal">Normal - Balanced notification schedule</SelectItem>
                      <SelectItem value="frequent">Frequent - All available notifications</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Daily Summaries</Label>
                  <Switch
                    checked={preferences.daily_summaries}
                    onCheckedChange={(checked) => updatePreference('daily_summaries', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Weekly Reports</Label>
                  <Switch
                    checked={preferences.weekly_reports}
                    onCheckedChange={(checked) => updatePreference('weekly_reports', checked)}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end pt-6 border-t">
            <Button onClick={savePreferences} disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : 'Save Preferences'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComprehensiveNotificationSettings;
