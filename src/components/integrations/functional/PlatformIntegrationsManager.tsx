import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  MessageSquare,
  Send,
  Calendar,
  Settings,
  Zap,
  AlertCircle,
  CheckCircle,
  Globe,
  Download,
  Upload,
  Bell,
  Smartphone
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PlatformIntegration {
  id: string;
  platform_type: string;
  platform_user_id: string | null;
  access_tokens: any;
  integration_settings: any;
  crisis_escalation_enabled: boolean;
  is_active: boolean;
  last_sync: string | null;
  created_at: string;
  updated_at: string;
}

interface IntegrationConfig {
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  features: string[];
  setupFields: {
    id: string;
    label: string;
    type: 'text' | 'url' | 'select';
    placeholder?: string;
    required: boolean;
    options?: { value: string; label: string }[];
  }[];
  notificationTypes: string[];
}

const PlatformIntegrationsManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [integrations, setIntegrations] = useState<PlatformIntegration[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  const [setupData, setSetupData] = useState<Record<string, any>>({});

  const integrationConfigs: Record<string, IntegrationConfig> = {
    whatsapp: {
      name: 'WhatsApp',
      description: 'Therapy chat, session reminders, and crisis management',
      icon: MessageSquare,
      category: 'Messaging',
      features: ['Therapy chat', 'Session reminders', 'Crisis alerts', 'Mood check-ins'],
      setupFields: [
        { id: 'phone_number', label: 'Phone Number', type: 'text', placeholder: '+1234567890', required: true },
        { id: 'business_account_id', label: 'Business Account ID', type: 'text', required: false },
      ],
      notificationTypes: ['session_reminder', 'mood_check', 'crisis_alert', 'milestone_achieved']
    },
    telegram: {
      name: 'Telegram',
      description: 'Instant notifications and quick therapy support',
      icon: Send,
      category: 'Messaging',
      features: ['Instant notifications', 'Quick support', 'Crisis management', 'Bot commands'],
      setupFields: [
        { id: 'bot_token', label: 'Bot Token', type: 'text', placeholder: 'Get from @BotFather', required: true },
        { id: 'chat_id', label: 'Chat ID', type: 'text', placeholder: 'Your Telegram Chat ID', required: true },
      ],
      notificationTypes: ['session_reminder', 'insight_generated', 'crisis_alert', 'progress_update']
    },
    messenger: {
      name: 'Facebook Messenger',
      description: 'Social messaging and community support',
      icon: MessageSquare,
      category: 'Messaging',
      features: ['Social messaging', 'Community support', 'Quick replies', 'Rich media'],
      setupFields: [
        { id: 'page_access_token', label: 'Page Access Token', type: 'text', required: true },
        { id: 'verify_token', label: 'Verify Token', type: 'text', required: true },
        { id: 'page_id', label: 'Facebook Page ID', type: 'text', required: true },
      ],
      notificationTypes: ['session_reminder', 'milestone_achieved', 'community_updates']
    },
    ical: {
      name: 'iCal/Calendar',
      description: 'Sync therapy sessions with your calendar',
      icon: Calendar,
      category: 'Scheduling',
      features: ['Session sync', 'Automatic reminders', 'Calendar export', 'Multi-platform support'],
      setupFields: [
        { id: 'calendar_name', label: 'Calendar Name', type: 'text', placeholder: 'Therapy Sessions', required: true },
        { id: 'sync_frequency', label: 'Sync Frequency', type: 'select', required: true, options: [
          { value: 'real-time', label: 'Real-time' },
          { value: 'hourly', label: 'Every hour' },
          { value: 'daily', label: 'Daily' },
        ]},
      ],
      notificationTypes: ['session_reminder', 'session_scheduled', 'session_cancelled']
    },
    slack: {
      name: 'Slack',
      description: 'Workplace wellness and team notifications',
      icon: MessageSquare,
      category: 'Productivity',
      features: ['Workplace wellness', 'Team notifications', 'Mood check-ins', 'Break reminders'],
      setupFields: [
        { id: 'webhook_url', label: 'Slack Webhook URL', type: 'url', required: true },
        { id: 'channel', label: 'Channel', type: 'text', placeholder: '#wellness', required: true },
      ],
      notificationTypes: ['mood_check', 'progress_update', 'milestone_achieved']
    },
    apple_health: {
      name: 'Apple Health',
      description: 'Import health data for holistic insights',
      icon: Smartphone,
      category: 'Health Data',
      features: ['Sleep tracking', 'Activity data', 'Heart rate', 'Mood correlation'],
      setupFields: [
        { id: 'data_types', label: 'Data Types to Import', type: 'select', required: true, options: [
          { value: 'sleep', label: 'Sleep Data' },
          { value: 'activity', label: 'Activity & Steps' },
          { value: 'heart_rate', label: 'Heart Rate' },
          { value: 'mindfulness', label: 'Mindfulness' },
        ]},
      ],
      notificationTypes: ['insight_generated', 'progress_update']
    }
  };

  useEffect(() => {
    if (user) {
      loadIntegrations();
    }
  }, [user]);

  const loadIntegrations = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('platform_integrations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setIntegrations(data || []);
    } catch (error: any) {
      console.error('Error loading integrations:', error);
      toast({
        title: "Error",
        description: "Failed to load integrations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleIntegrationSetup = async (platformType: string) => {
    if (!user || !setupData[platformType]) return;

    setLoading(true);
    try {
      const config = integrationConfigs[platformType];
      const settings = { ...setupData[platformType] };
      
      // For security, move sensitive data to access_tokens
      const accessTokens: any = {};
      const integrationSettings: any = {};

      config.setupFields.forEach(field => {
        if (field.id.includes('token') || field.id.includes('key')) {
          accessTokens[field.id] = settings[field.id];
        } else {
          integrationSettings[field.id] = settings[field.id];
        }
      });

      const { error } = await supabase
        .from('platform_integrations')
        .upsert({
          user_id: user.id,
          platform_type: platformType,
          platform_user_id: settings.platform_user_id || null,
          access_tokens: accessTokens,
          integration_settings: integrationSettings,
          crisis_escalation_enabled: true,
          is_active: true,
        }, {
          onConflict: 'user_id,platform_type'
        });

      if (error) throw error;

      // Test the integration
      await testIntegration(platformType);

      toast({
        title: "Integration configured",
        description: `${config.name} has been successfully set up.`,
      });

      setSelectedIntegration(null);
      setSetupData(prev => ({ ...prev, [platformType]: {} }));
      await loadIntegrations();
    } catch (error: any) {
      console.error('Error setting up integration:', error);
      toast({
        title: "Setup failed",
        description: error.message || "Failed to configure integration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testIntegration = async (platformType: string) => {
    if (!user) return;

    try {
      const { error } = await supabase.functions.invoke(`${platformType}-send-notification`, {
        body: {
          userId: user.id,
          payload: {
            title: 'Integration Test',
            body: `Your ${integrationConfigs[platformType].name} integration is working correctly!`,
            category: 'test',
            type: 'integration_test'
          }
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error(`Error testing ${platformType} integration:`, error);
    }
  };

  const toggleIntegration = async (integrationId: string, isActive: boolean) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('platform_integrations')
        .update({ is_active: isActive })
        .eq('id', integrationId);

      if (error) throw error;

      await loadIntegrations();
      
      toast({
        title: isActive ? "Integration enabled" : "Integration disabled",
        description: "Integration status updated successfully.",
      });
    } catch (error: any) {
      console.error('Error toggling integration:', error);
      toast({
        title: "Error",
        description: "Failed to update integration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateICalFeed = async () => {
    if (!user) return;

    try {
      // Generate iCal feed URL for user's therapy sessions
      const { data, error } = await supabase
        .from('therapy_sessions')
        .select('id, session_type, start_time, end_time, notes')
        .eq('user_id', user.id)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(50);

      if (error) throw error;

      // Create iCal content
      let icalContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:TherapySync',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'X-WR-CALNAME:Therapy Sessions',
        'X-WR-TIMEZONE:UTC'
      ];

      data?.forEach(session => {
        const startDate = new Date(session.start_time);
        const endDate = session.end_time ? new Date(session.end_time) : new Date(startDate.getTime() + 60 * 60 * 1000); // Default 1 hour

        icalContent.push(
          'BEGIN:VEVENT',
          `UID:therapy-${session.id}@therapysync.com`,
          `DTSTART:${formatICalDate(startDate)}`,
          `DTEND:${formatICalDate(endDate)}`,
          `SUMMARY:${session.session_type} Therapy Session`,
          `DESCRIPTION:${session.notes || 'Therapy session'}`,
          'CATEGORIES:Therapy,Health',
          'STATUS:CONFIRMED',
          'END:VEVENT'
        );
      });

      icalContent.push('END:VCALENDAR');

      // Download the iCal file
      const blob = new Blob([icalContent.join('\r\n')], { type: 'text/calendar' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'therapy-sessions.ics';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Calendar exported",
        description: "Your therapy sessions have been exported to your calendar.",
      });
    } catch (error: any) {
      console.error('Error generating iCal feed:', error);
      toast({
        title: "Export failed",
        description: "Failed to export calendar. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatICalDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const getIntegrationStatus = (platformType: string) => {
    const integration = integrations.find(i => i.platform_type === platformType);
    if (!integration) return { status: 'not_connected', integration: null };
    if (!integration.is_active) return { status: 'inactive', integration };
    return { status: 'active', integration };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Connected</Badge>;
      case 'inactive':
        return <Badge variant="outline">Inactive</Badge>;
      default:
        return <Badge variant="outline">Not Connected</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Integrations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Connect with your favorite platforms to receive notifications, sync data, and enhance your therapy experience.
          </p>
        </CardContent>
      </Card>

      {/* Integration Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(integrationConfigs).map(([platformType, config]) => {
          const { status, integration } = getIntegrationStatus(platformType);
          const IconComponent = config.icon;

          return (
            <Card key={platformType} className="border-border/40 hover:border-therapy-300 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <IconComponent className="h-8 w-8 mr-3 text-therapy-600" />
                    <div>
                      <h3 className="font-semibold">{config.name}</h3>
                      <p className="text-xs text-muted-foreground">{config.category}</p>
                    </div>
                  </div>
                  {getStatusBadge(status)}
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">
                  {config.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  {config.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center text-xs text-muted-foreground">
                      <span className="w-1 h-1 bg-therapy-500 rounded-full mr-2"></span>
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  {status === 'active' ? (
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Settings className="h-3 w-3 mr-1" />
                            Configure
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Configure {config.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <Label>Enable Integration</Label>
                              <Switch
                                checked={integration?.is_active || false}
                                onCheckedChange={(checked) => integration && toggleIntegration(integration.id, checked)}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label>Crisis Escalation</Label>
                              <Switch
                                checked={integration?.crisis_escalation_enabled || false}
                                onCheckedChange={async (checked) => {
                                  if (!integration) return;
                                  await supabase
                                    .from('platform_integrations')
                                    .update({ crisis_escalation_enabled: checked })
                                    .eq('id', integration.id);
                                  await loadIntegrations();
                                }}
                              />
                            </div>
                            {platformType === 'ical' && (
                              <Button onClick={generateICalFeed} className="w-full">
                                <Download className="h-4 w-4 mr-2" />
                                Export Calendar
                              </Button>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => integration && toggleIntegration(integration.id, false)}
                      >
                        Disconnect
                      </Button>
                    </div>
                  ) : (
                    <Dialog open={selectedIntegration === platformType} onOpenChange={(open) => setSelectedIntegration(open ? platformType : null)}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="w-full">
                          <Zap className="h-3 w-3 mr-1" />
                          Connect
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Connect {config.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            {config.description}
                          </p>
                          
                          {config.setupFields.map((field) => (
                            <div key={field.id}>
                              <Label htmlFor={field.id}>
                                {field.label}
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                              </Label>
                              {field.type === 'select' ? (
                                <select
                                  id={field.id}
                                  value={setupData[platformType]?.[field.id] || ''}
                                  onChange={(e) => setSetupData(prev => ({
                                    ...prev,
                                    [platformType]: {
                                      ...prev[platformType],
                                      [field.id]: e.target.value
                                    }
                                  }))}
                                  className="w-full mt-1 px-3 py-2 border border-input bg-background rounded-md"
                                >
                                  <option value="">Select...</option>
                                  {field.options?.map(option => (
                                    <option key={option.value} value={option.value}>
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <Input
                                  id={field.id}
                                  type={field.type}
                                  placeholder={field.placeholder}
                                  value={setupData[platformType]?.[field.id] || ''}
                                  onChange={(e) => setSetupData(prev => ({
                                    ...prev,
                                    [platformType]: {
                                      ...prev[platformType],
                                      [field.id]: e.target.value
                                    }
                                  }))}
                                  className="mt-1"
                                />
                              )}
                            </div>
                          ))}
                          
                          <Button 
                            onClick={() => handleIntegrationSetup(platformType)}
                            disabled={loading}
                            className="w-full"
                          >
                            {loading ? 'Connecting...' : 'Connect Integration'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PlatformIntegrationsManager;