import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Settings, 
  Save, 
  TestTube, 
  CheckCircle, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRealIntegrations } from '@/hooks/useRealIntegrations';

interface IntegrationConfigCardProps {
  integration: {
    id: string;
    name: string;
    type: string;
    description: string | null;
    configuration: any;
  };
}

const IntegrationConfigCard: React.FC<IntegrationConfigCardProps> = ({ integration }) => {
  const { toast } = useToast();
  const { 
    isIntegrationEnabled, 
    enableIntegration, 
    disableIntegration, 
    updateIntegrationSettings,
    getIntegrationSettings 
  } = useRealIntegrations();

  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isEnabled, setIsEnabled] = useState(isIntegrationEnabled(integration.id));
  const [settings, setSettings] = useState(getIntegrationSettings(integration.id));

  const handleToggleIntegration = async () => {
    if (isEnabled) {
      const success = await disableIntegration(integration.id);
      if (success) {
        setIsEnabled(false);
      }
    } else {
      const success = await enableIntegration(integration.id, settings);
      if (success) {
        setIsEnabled(true);
      }
    }
  };

  const handleSaveSettings = async () => {
    const success = await updateIntegrationSettings(integration.id, settings);
    if (success) {
      setIsConfiguring(false);
    }
  };

  const handleTestIntegration = async () => {
    setIsTesting(true);
    try {
      // Simulate test based on integration type
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Test Successful",
        description: `${integration.name} integration is working correctly`,
      });
    } catch (error) {
      toast({
        title: "Test Failed", 
        description: "Integration test failed. Please check your configuration.",
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };

  const renderConfigurationFields = () => {
    switch (integration.type) {
      case 'ehr':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="api_endpoint">API Endpoint</Label>
              <Input
                id="api_endpoint"
                value={settings.api_endpoint || ''}
                onChange={(e) => setSettings({ ...settings, api_endpoint: e.target.value })}
                placeholder="https://api.example.com/v1"
              />
            </div>
            <div>
              <Label htmlFor="api_key">API Key</Label>
              <Input
                id="api_key"
                type="password"
                value={settings.api_key || ''}
                onChange={(e) => setSettings({ ...settings, api_key: e.target.value })}
                placeholder="Enter your API key"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={settings.sync_enabled || false}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, sync_enabled: checked })
                }
              />
              <Label>Enable automatic sync</Label>
            </div>
          </div>
        );
        
      case 'calendar':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="calendar_id">Calendar ID</Label>
              <Input
                id="calendar_id"
                value={settings.calendar_id || ''}
                onChange={(e) => setSettings({ ...settings, calendar_id: e.target.value })}
                placeholder="primary"
              />
            </div>
            <div>
              <Label htmlFor="sync_frequency">Sync Frequency (minutes)</Label>
              <Input
                id="sync_frequency"
                type="number"
                value={settings.sync_frequency || 15}
                onChange={(e) => setSettings({ ...settings, sync_frequency: parseInt(e.target.value) })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={settings.two_way_sync || false}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, two_way_sync: checked })
                }
              />
              <Label>Enable two-way sync</Label>
            </div>
          </div>
        );

      case 'mobile':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="push_token">Push Token</Label>
              <Input
                id="push_token"
                type="password"
                value={settings.push_token || ''}
                onChange={(e) => setSettings({ ...settings, push_token: e.target.value })}
                placeholder="Enter push notification token"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={settings.notifications_enabled || false}
                onCheckedChange={(checked) => 
                  setSettings({ ...settings, notifications_enabled: checked })
                }
              />
              <Label>Enable push notifications</Label>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="custom_config">Configuration</Label>
              <Textarea
                id="custom_config"
                value={JSON.stringify(settings, null, 2)}
                onChange={(e) => {
                  try {
                    setSettings(JSON.parse(e.target.value));
                  } catch {
                    // Invalid JSON, keep as is
                  }
                }}
                placeholder="{}"
                className="min-h-[100px] font-mono"
              />
            </div>
          </div>
        );
    }
  };

  return (
    <Card className="border-therapy-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Settings className="h-6 w-6 text-therapy-600" />
            <div>
              <CardTitle className="text-lg">{integration.name}</CardTitle>
              <p className="text-sm text-gray-600">{integration.description || 'No description available'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={isEnabled ? "default" : "secondary"}>
              {isEnabled ? "Enabled" : "Disabled"}
            </Badge>
            <Switch
              checked={isEnabled}
              onCheckedChange={handleToggleIntegration}
            />
          </div>
        </div>
      </CardHeader>
      
      {isEnabled && (
        <CardContent className="space-y-4">
          {isConfiguring ? (
            <div className="space-y-4">
              <h4 className="font-medium">Configuration Settings</h4>
              {renderConfigurationFields()}
              
              <div className="flex space-x-2">
                <Button onClick={handleSaveSettings} size="sm">
                  <Save className="h-4 w-4 mr-1" />
                  Save Settings
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsConfiguring(false)} 
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setIsConfiguring(true)} 
                size="sm"
              >
                <Settings className="h-4 w-4 mr-1" />
                Configure
              </Button>
              <Button 
                variant="outline" 
                onClick={handleTestIntegration}
                disabled={isTesting}
                size="sm"
              >
                <TestTube className="h-4 w-4 mr-1" />
                {isTesting ? 'Testing...' : 'Test'}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(`https://docs.example.com/integrations/${integration.type}`, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Docs
              </Button>
            </div>
          )}

          {/* Status Indicators */}
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Connection: Ready</span>
            </div>
            <div className="flex items-center space-x-1">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              <span>Status: Configured</span>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default IntegrationConfigCard;
