
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Settings, Activity, Webhook, Key, Database } from 'lucide-react';
import IntegrationStatusDashboard from './IntegrationStatusDashboard';
import WebhookManager from './WebhookManager';
import EnhancedAPIManagement from './EnhancedAPIManagement';
import IntegrationConfigCard from './IntegrationConfigCard';
import { useRealIntegrations } from '@/hooks/useRealIntegrations';

const EnhancedIntegrationsHub = () => {
  const { integrations, loading } = useRealIntegrations();
  const [activeTab, setActiveTab] = useState('overview');

  const mockIntegrations = [
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      type: 'communication',
      description: 'Send therapy reminders and check-ins via WhatsApp',
      configuration: {
        phone_number: '+1234567890',
        api_token: 'wa_token_123',
        webhook_url: 'https://api.example.com/whatsapp/webhook'
      }
    },
    {
      id: 'stripe',
      name: 'Stripe Payments',
      type: 'billing',
      description: 'Process subscription payments and manage billing',
      configuration: {
        publishable_key: 'pk_test_123',
        webhook_secret: 'whsec_123'
      }
    },
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      type: 'calendar',
      description: 'Sync therapy sessions with user calendars',
      configuration: {
        client_id: 'google_client_123',
        calendar_id: 'primary'
      }
    },
    {
      id: 'ehr-system',
      name: 'EHR Integration',
      type: 'ehr',
      description: 'Connect with Electronic Health Record systems',
      configuration: {
        api_endpoint: 'https://ehr.example.com/api/v1',
        client_id: 'ehr_client_123'
      }
    }
  ];

  const displayIntegrations = integrations.length > 0 ? integrations : mockIntegrations;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading integrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-6 w-6 text-therapy-600" />
            <span>Enhanced Integrations Hub</span>
            <Badge variant="outline" className="ml-2">Pro</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Manage all your third-party integrations, monitor their health, and configure webhooks from one central location.
          </p>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="status" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Status</span>
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="flex items-center space-x-2">
            <Webhook className="h-4 w-4" />
            <span>Webhooks</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center space-x-2">
            <Key className="h-4 w-4" />
            <span>API Keys</span>
          </TabsTrigger>
          <TabsTrigger value="config" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Configure</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayIntegrations.map((integration) => (
              <Card key={integration.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{integration.name}</span>
                    <Badge variant="outline">{integration.type}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {integration.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="default">Active</Badge>
                    <span className="text-xs text-muted-foreground">
                      Last sync: 2 hours ago
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="status">
          <IntegrationStatusDashboard />
        </TabsContent>

        <TabsContent value="webhooks">
          <WebhookManager />
        </TabsContent>

        <TabsContent value="api">
          <EnhancedAPIManagement />
        </TabsContent>

        <TabsContent value="config" className="space-y-6">
          {displayIntegrations.map((integration) => (
            <IntegrationConfigCard key={integration.id} integration={integration} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedIntegrationsHub;
