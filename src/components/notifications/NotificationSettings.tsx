import React, { useState, useEffect } from 'react';
import { Settings, Bell, BellOff, Smartphone, Mail, MessageCircle, Slack, Send, Bot, Users, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { EnhancedNotificationService } from '@/services/enhancedNotificationService';

interface NotificationPreferences {
  push_notifications: boolean;
  email_notifications: boolean;
  crisis_alerts: boolean;
  therapy_reminders: boolean;
  progress_updates: boolean;
  community_notifications: boolean;
  quiet_hours_enabled: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
  preferred_platforms: string[];
}

interface LocalPlatformIntegration {
  id: string;
  platform_type: string;
  is_active: boolean;
  integration_settings: Record<string, any>;
  crisis_escalation_enabled: boolean;
}

const PLATFORM_ICONS = {
  push: Smartphone,
  email: Mail,
  whatsapp: MessageCircle,
  slack: Slack,
  teams: Users,
  telegram: Send,
  discord: Bot,
  messenger: MessageCircle,
  signal: Zap
};

const PLATFORM_COLORS = {
  push: 'bg-blue-500',
  email: 'bg-red-500',
  whatsapp: 'bg-green-500',
  slack: 'bg-purple-500',
  teams: 'bg-blue-600',
  telegram: 'bg-sky-500',
  discord: 'bg-indigo-500',
  messenger: 'bg-blue-600',
  signal: 'bg-blue-700'
};

const NotificationSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    push_notifications: true,
    email_notifications: true,
    crisis_alerts: true,
    therapy_reminders: true,
    progress_updates: true,
    community_notifications: false,
    quiet_hours_enabled: false,
    quiet_hours_start: '22:00',
    quiet_hours_end: '08:00',
    preferred_platforms: ['push', 'email']
  });
  const [integrations, setIntegrations] = useState<LocalPlatformIntegration[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchPreferences();
    fetchIntegrations();
  }, [user]);

  const fetchPreferences = async () => {
    if (!user) return;

    try {
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
          push_notifications: data.push_notifications ?? true,
          email_notifications: data.email_notifications ?? true,
          crisis_alerts: data.milestone_notifications ?? true, // Map existing field
          therapy_reminders: data.session_reminders ?? true,
          progress_updates: data.progress_updates ?? true,
          community_notifications: false, // Use default since field doesn't exist
          quiet_hours_enabled: data.quiet_hours_start !== null,
          quiet_hours_start: data.quiet_hours_start ?? '22:00',
          quiet_hours_end: data.quiet_hours_end ?? '08:00',
          preferred_platforms: ['push', 'email'] // Default since this field doesn't exist yet
        });
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  };

  const fetchIntegrations = async () => {
    if (!user) return;

    try {
      const integrationData = await EnhancedNotificationService.getUserIntegrations(user.id);
      setIntegrations(integrationData.map(integration => ({
        id: integration.id || '',
        platform_type: integration.platform_type,
        is_active: integration.is_active,
        integration_settings: integration.integration_settings,
        crisis_escalation_enabled: integration.crisis_escalation_enabled
      })));
    } catch (error) {
      console.error('Error fetching integrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user.id,
          ...preferences,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Settings saved",
        description: "Your notification preferences have been updated.",
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const testNotification = async () => {
    if (!user) return;

    try {
      await EnhancedNotificationService.sendMultiPlatformNotification(
        user.id,
        {
          title: '🔔 Test Notification',
          body: 'This is a test notification to verify your settings are working correctly.',
          category: 'administrative',
          type: 'test_notification',
          data: { test: true }
        },
        preferences.preferred_platforms
      );

      toast({
        title: "Test notification sent",
        description: "Check your connected platforms for the test message.",
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

  const togglePlatform = (platform: string) => {
    setPreferences(prev => ({
      ...prev,
      preferred_platforms: prev.preferred_platforms.includes(platform)
        ? prev.preferred_platforms.filter(p => p !== platform)
        : [...prev.preferred_platforms, platform]
    }));
  };

  const enablePushNotifications = async () => {
    try {
      const hasPermission = await EnhancedNotificationService.requestPermission();
      if (hasPermission && user) {
        const subscribed = await EnhancedNotificationService.subscribeToPush(user.id);
        if (subscribed) {
          setPreferences(prev => ({ ...prev, push_notifications: true }));
          toast({
            title: "Push notifications enabled",
            description: "You'll now receive push notifications on this device.",
          });
        }
      }
    } catch (error) {
      console.error('Error enabling push notifications:', error);
      toast({
        title: "Error",
        description: "Failed to enable push notifications.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Notification Settings
          </CardTitle>
          <div className="flex gap-2">
            <Button onClick={testNotification} variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Test Notifications
            </Button>
            <Button onClick={savePreferences} disabled={saving}>
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="platforms">Platforms</TabsTrigger>
            <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6 mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Notification Types</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Crisis Alerts</Label>
                    <p className="text-sm text-gray-500">
                      Immediate notifications for crisis situations (cannot be disabled)
                    </p>
                  </div>
                  <Switch checked={true} disabled />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Therapy Reminders</Label>
                    <p className="text-sm text-gray-500">
                      Session reminders and therapy-related notifications
                    </p>
                  </div>
                  <Switch
                    checked={preferences.therapy_reminders}
                    onCheckedChange={(checked) =>
                      setPreferences(prev => ({ ...prev, therapy_reminders: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Progress Updates</Label>
                    <p className="text-sm text-gray-500">
                      Goal achievements and progress milestones
                    </p>
                  </div>
                  <Switch
                    checked={preferences.progress_updates}
                    onCheckedChange={(checked) =>
                      setPreferences(prev => ({ ...prev, progress_updates: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Community Notifications</Label>
                    <p className="text-sm text-gray-500">
                      Group discussions and peer support messages
                    </p>
                  </div>
                  <Switch
                    checked={preferences.community_notifications}
                    onCheckedChange={(checked) =>
                      setPreferences(prev => ({ ...prev, community_notifications: checked }))
                    }
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="platforms" className="space-y-6 mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Connected Platforms</h3>
              <p className="text-sm text-gray-500">
                Choose which platforms to receive notifications on. Crisis alerts will always be sent to all available platforms.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(PLATFORM_ICONS).map(([platform, Icon]) => {
                  const isConnected = integrations.some(i => i.platform_type === platform) || ['push', 'email'].includes(platform);
                  const isEnabled = preferences.preferred_platforms.includes(platform);
                  
                  return (
                    <Card key={platform} className={`relative ${isEnabled ? 'ring-2 ring-blue-500' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${PLATFORM_COLORS[platform]} text-white`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="font-medium capitalize">{platform}</h4>
                              <p className="text-sm text-gray-500">
                                {isConnected ? 'Connected' : 'Not connected'}
                              </p>
                            </div>
                          </div>
                          
                          {isConnected ? (
                            <Switch
                              checked={isEnabled}
                              onCheckedChange={() => togglePlatform(platform)}
                            />
                          ) : (
                            <Badge variant="outline">Not Connected</Badge>
                          )}
                        </div>
                        
                        {platform === 'push' && !preferences.push_notifications && (
                          <Button
                            onClick={enablePushNotifications}
                            variant="outline"
                            size="sm"
                            className="w-full mt-3"
                          >
                            Enable Push Notifications
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scheduling" className="space-y-6 mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Quiet Hours</h3>
              <p className="text-sm text-gray-500">
                Set specific hours when you don't want to receive non-critical notifications.
                Crisis alerts will always come through regardless of quiet hours.
              </p>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={preferences.quiet_hours_enabled}
                  onCheckedChange={(checked) =>
                    setPreferences(prev => ({ ...prev, quiet_hours_enabled: checked }))
                  }
                />
                <Label>Enable quiet hours</Label>
              </div>

              {preferences.quiet_hours_enabled && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label>Start time</Label>
                    <Input
                      type="time"
                      value={preferences.quiet_hours_start}
                      onChange={(e) =>
                        setPreferences(prev => ({ ...prev, quiet_hours_start: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End time</Label>
                    <Input
                      type="time"
                      value={preferences.quiet_hours_end}
                      onChange={(e) =>
                        setPreferences(prev => ({ ...prev, quiet_hours_end: e.target.value }))
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Notification Summary</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2 text-sm">
                  <p><strong>Active platforms:</strong> {preferences.preferred_platforms.join(', ')}</p>
                  <p><strong>Crisis alerts:</strong> Always enabled</p>
                  <p><strong>Therapy reminders:</strong> {preferences.therapy_reminders ? 'Enabled' : 'Disabled'}</p>
                  <p><strong>Progress updates:</strong> {preferences.progress_updates ? 'Enabled' : 'Disabled'}</p>
                  <p><strong>Community notifications:</strong> {preferences.community_notifications ? 'Enabled' : 'Disabled'}</p>
                  {preferences.quiet_hours_enabled && (
                    <p><strong>Quiet hours:</strong> {preferences.quiet_hours_start} - {preferences.quiet_hours_end}</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;