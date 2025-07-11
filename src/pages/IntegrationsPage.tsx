import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Settings, 
  Link as LinkIcon, 
  MessageSquare,
  Smartphone,
  Globe,
  Calendar,
  Bell
} from 'lucide-react';

const IntegrationsPage = () => {
  const integrations = [
    {
      name: 'WhatsApp',
      category: 'Messaging',
      description: 'Connect WhatsApp for therapy sessions via messaging',
      status: 'connected',
      icon: MessageSquare,
      features: ['Real-time chat', 'Voice messages', 'Crisis alerts']
    },
    {
      name: 'Slack',
      category: 'Productivity',
      description: 'Workplace wellness integration with Slack',
      status: 'available',
      icon: MessageSquare,
      features: ['Mood check-ins', 'Break reminders', 'Team wellness']
    },
    {
      name: 'Google Calendar',
      category: 'Scheduling',
      description: 'Sync therapy sessions with your calendar',
      status: 'connected',
      icon: Calendar,
      features: ['Auto-scheduling', 'Reminders', 'Session tracking']
    },
    {
      name: 'Apple Health',
      category: 'Health Data',
      description: 'Import health and fitness data for holistic insights',
      status: 'available',
      icon: Smartphone,
      features: ['Sleep tracking', 'Activity data', 'Heart rate monitoring']
    },
    {
      name: 'Webhooks',
      category: 'Developer',
      description: 'Custom integrations via webhooks and API',
      status: 'available',
      icon: Globe,
      features: ['Custom endpoints', 'Real-time data', 'Enterprise features']
    }
  ];

  const notificationSettings = [
    { platform: 'Email', enabled: true, frequency: 'Daily' },
    { platform: 'SMS', enabled: false, frequency: 'Urgent only' },
    { platform: 'Push', enabled: true, frequency: 'Real-time' },
    { platform: 'WhatsApp', enabled: true, frequency: 'Session reminders' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'default';
      case 'available': return 'outline';
      case 'error': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-therapy-600 to-harmony-600 bg-clip-text text-transparent">
          Integrations
        </h1>
        <p className="text-muted-foreground mt-1">
          Connect TherapySync with your favorite apps and services
        </p>
      </div>

      {/* Integration Categories */}
      <div className="grid gap-6">
        {/* Platform Integrations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <LinkIcon className="h-5 w-5 mr-2 text-therapy-600" />
              Platform Integrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {integrations.map((integration) => (
                <Card key={integration.name} className="border-border/40 hover:border-therapy-300 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <integration.icon className="h-8 w-8 mr-3 text-therapy-600" />
                        <div>
                          <h3 className="font-semibold">{integration.name}</h3>
                          <p className="text-xs text-muted-foreground">{integration.category}</p>
                        </div>
                      </div>
                      <Badge variant={getStatusColor(integration.status)}>
                        {integration.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {integration.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      {integration.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-xs text-muted-foreground">
                          <span className="w-1 h-1 bg-therapy-500 rounded-full mr-2"></span>
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex space-x-2">
                      {integration.status === 'connected' ? (
                        <>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Settings className="h-3 w-3 mr-1" />
                            Configure
                          </Button>
                          <Button variant="destructive" size="sm">
                            Disconnect
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" className="flex-1">
                          <Zap className="h-3 w-3 mr-1" />
                          Connect
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2 text-therapy-600" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notificationSettings.map((setting, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-therapy-500 rounded-full mr-3"></div>
                    <div>
                      <h3 className="font-medium">{setting.platform}</h3>
                      <p className="text-sm text-muted-foreground">{setting.frequency}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={setting.enabled ? 'default' : 'outline'}>
                      {setting.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Usage Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Integration Usage Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold text-therapy-600">2.4k</p>
                <p className="text-sm text-muted-foreground">Messages exchanged</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold text-harmony-600">89%</p>
                <p className="text-sm text-muted-foreground">Integration uptime</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold text-flow-600">3</p>
                <p className="text-sm text-muted-foreground">Active connections</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-4">
        <Button>
          <Zap className="h-4 w-4 mr-2" />
          Add Integration
        </Button>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Manage All
        </Button>
      </div>
    </div>
  );
};

export default IntegrationsPage;