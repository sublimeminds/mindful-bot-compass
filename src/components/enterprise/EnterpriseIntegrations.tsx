import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  Database, 
  Webhook, 
  Shield, 
  FileText,
  Activity,
  Users,
  BarChart3,
  Settings,
  CheckCircle,
  AlertCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface IntegrationConfig {
  id: string;
  name: string;
  type: 'emr' | 'crm' | 'webhook' | 'sso' | 'compliance';
  status: 'active' | 'inactive' | 'error' | 'pending';
  endpoint?: string;
  apiKey?: string;
  config: Record<string, any>;
  lastSync?: Date;
  syncCount: number;
}

const EnterpriseIntegrations = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>([]);
  const [activeTab, setActiveTab] = useState('emr');
  const [isConfiguring, setIsConfiguring] = useState(false);

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    // Mock data for now (database integration pending)
    const mockIntegrations: IntegrationConfig[] = [];
    setIntegrations(mockIntegrations);
  };

  const saveIntegration = async (integration: Partial<IntegrationConfig>) => {
    setIsConfiguring(true);
    try {
      const { error } = await supabase
        .from('enterprise_integrations')
        .upsert([{
          id: integration.id || crypto.randomUUID(),
          name: integration.name,
          integration_type: integration.type,
          status: integration.status || 'pending',
          endpoint_url: integration.endpoint,
          api_key: integration.apiKey,
          configuration: integration.config,
          sync_count: integration.syncCount || 0
        }]);

      if (error) throw error;

      toast({
        title: "Integration Saved",
        description: "Configuration updated successfully"
      });

      await loadIntegrations();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save integration",
        variant: "destructive"
      });
    } finally {
      setIsConfiguring(false);
    }
  };

  const testIntegration = async (integrationId: string) => {
    const integration = integrations.find(i => i.id === integrationId);
    if (!integration) return;

    try {
      // Test the integration endpoint
      const response = await fetch('/api/test-integration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: integration.type,
          endpoint: integration.endpoint,
          apiKey: integration.apiKey,
          config: integration.config
        })
      });

      if (response.ok) {
        toast({
          title: "Connection Successful",
          description: "Integration is working properly"
        });
      } else {
        throw new Error('Connection failed');
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Please check your configuration",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'emr': return <FileText className="h-5 w-5" />;
      case 'crm': return <Users className="h-5 w-5" />;
      case 'webhook': return <Webhook className="h-5 w-5" />;
      case 'sso': return <Shield className="h-5 w-5" />;
      case 'compliance': return <BarChart3 className="h-5 w-5" />;
      default: return <Settings className="h-5 w-5" />;
    }
  };

  const renderEMRIntegration = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Electronic Medical Records (EMR)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="emr-system">EMR System</Label>
              <Input
                id="emr-system"
                placeholder="Epic, Cerner, Athena, etc."
              />
            </div>
            <div>
              <Label htmlFor="emr-endpoint">FHIR Endpoint</Label>
              <Input
                id="emr-endpoint"
                placeholder="https://api.your-emr.com/fhir/R4"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="emr-client-id">Client ID</Label>
            <Input
              id="emr-client-id"
              placeholder="OAuth2 Client ID"
            />
          </div>
          <div>
            <Label htmlFor="emr-client-secret">Client Secret</Label>
            <Input
              id="emr-client-secret"
              type="password"
              placeholder="OAuth2 Client Secret"
            />
          </div>
          <div className="space-y-2">
            <Label>Data Exchange Settings</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch id="sync-appointments" />
                <Label htmlFor="sync-appointments">Sync Appointments</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="sync-notes" />
                <Label htmlFor="sync-notes">Sync Session Notes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="sync-assessments" />
                <Label htmlFor="sync-assessments">Sync Assessments</Label>
              </div>
            </div>
          </div>
          <Button onClick={() => saveIntegration({
            name: 'EMR Integration',
            type: 'emr',
            status: 'pending'
          })}>
            Configure EMR Integration
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderWebhookIntegration = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Webhook className="h-5 w-5" />
            Webhook Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="webhook-name">Webhook Name</Label>
            <Input
              id="webhook-name"
              placeholder="Session Completion Webhook"
            />
          </div>
          <div>
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <Input
              id="webhook-url"
              placeholder="https://your-system.com/webhooks/therapy-session"
            />
          </div>
          <div>
            <Label htmlFor="webhook-secret">Webhook Secret</Label>
            <Input
              id="webhook-secret"
              type="password"
              placeholder="For request signature verification"
            />
          </div>
          <div className="space-y-2">
            <Label>Event Triggers</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch id="session-start" />
                <Label htmlFor="session-start">Session Started</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="session-end" />
                <Label htmlFor="session-end">Session Completed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="crisis-detected" />
                <Label htmlFor="crisis-detected">Crisis Detected</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="assessment-complete" />
                <Label htmlFor="assessment-complete">Assessment Completed</Label>
              </div>
            </div>
          </div>
          <div>
            <Label htmlFor="webhook-payload">Custom Payload Template</Label>
            <Textarea
              id="webhook-payload"
              placeholder='{"sessionId": "{{sessionId}}", "userId": "{{userId}}", "outcome": "{{outcome}}"}'
              rows={4}
            />
          </div>
          <Button onClick={() => saveIntegration({
            name: 'Custom Webhook',
            type: 'webhook',
            status: 'pending'
          })}>
            Configure Webhook
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderSSOIntegration = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Single Sign-On (SSO)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="sso-provider">SSO Provider</Label>
            <Input
              id="sso-provider"
              placeholder="Azure AD, Okta, Google Workspace, etc."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sso-client-id">Client ID</Label>
              <Input
                id="sso-client-id"
                placeholder="OAuth2/SAML Client ID"
              />
            </div>
            <div>
              <Label htmlFor="sso-tenant">Tenant ID</Label>
              <Input
                id="sso-tenant"
                placeholder="Azure Tenant ID or Domain"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="sso-metadata">SAML Metadata URL</Label>
            <Input
              id="sso-metadata"
              placeholder="https://login.microsoftonline.com/.../federationmetadata/..."
            />
          </div>
          <div className="space-y-2">
            <Label>Role Mapping</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch id="auto-provision" />
                <Label htmlFor="auto-provision">Auto-provision Users</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="role-sync" />
                <Label htmlFor="role-sync">Sync User Roles</Label>
              </div>
            </div>
          </div>
          <Button onClick={() => saveIntegration({
            name: 'SSO Integration',
            type: 'sso',
            status: 'pending'
          })}>
            Configure SSO
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Integration Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Enterprise Integrations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-therapy-600">
                {integrations.filter(i => i.status === 'active').length}
              </div>
              <div className="text-sm text-muted-foreground">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {integrations.filter(i => i.status === 'pending').length}
              </div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {integrations.filter(i => i.status === 'error').length}
              </div>
              <div className="text-sm text-muted-foreground">Errors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {integrations.reduce((sum, i) => sum + i.syncCount, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Syncs</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Integrations */}
      {integrations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active Integrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {integrations.map((integration) => (
                <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(integration.type)}
                    <div>
                      <h4 className="font-medium">{integration.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {integration.endpoint && `${integration.endpoint.substring(0, 50)}...`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getStatusColor(integration.status)}>
                      {getStatusIcon(integration.status)}
                      {integration.status}
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => testIntegration(integration.id)}
                    >
                      Test
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Integration Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Configure New Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="emr">EMR Systems</TabsTrigger>
              <TabsTrigger value="webhook">Webhooks</TabsTrigger>
              <TabsTrigger value="sso">SSO</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="emr" className="space-y-4">
              {renderEMRIntegration()}
            </TabsContent>
            
            <TabsContent value="webhook" className="space-y-4">
              {renderWebhookIntegration()}
            </TabsContent>
            
            <TabsContent value="sso" className="space-y-4">
              {renderSSOIntegration()}
            </TabsContent>
            
            <TabsContent value="compliance" className="space-y-4">
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Compliance Reporting</h3>
                <p className="text-muted-foreground mb-4">
                  HIPAA, SOC 2, and regulatory compliance integrations
                </p>
                <Button variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Contact Enterprise Sales
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnterpriseIntegrations;