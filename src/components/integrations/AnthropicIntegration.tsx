
import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Brain, Settings, MessageSquare } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useRealIntegrations } from '@/hooks/useRealIntegrations';

const AnthropicIntegration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    isIntegrationEnabled, 
    enableIntegration, 
    disableIntegration,
    getIntegrationSettings,
    updateIntegrationSettings 
  } = useRealIntegrations();

  const [apiKey, setApiKey] = useState('');
  const [modelConfig, setModelConfig] = useState({
    model: 'claude-3-haiku-20240307',
    maxTokens: 1000,
    temperature: 0.7
  });
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const integrationId = 'anthropic-claude';
  const enabled = isIntegrationEnabled(integrationId);
  const settings = getIntegrationSettings(integrationId);

  useEffect(() => {
    if (settings.apiKey) {
      setApiKey(settings.apiKey);
    }
    if (settings.modelConfig) {
      setModelConfig(settings.modelConfig);
    }
    setIsEnabled(enabled);
  }, [enabled, settings]);

  const handleSaveConfiguration = useCallback(async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Anthropic API key",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const config = {
        apiKey,
        modelConfig,
        provider: 'anthropic'
      };

      if (enabled) {
        await updateIntegrationSettings(integrationId, config);
      } else {
        await enableIntegration(integrationId, config);
      }

      setIsEnabled(true);
      toast({
        title: "Configuration Saved",
        description: "Anthropic Claude integration has been configured successfully.",
      });
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast({
        title: "Configuration Error",
        description: "Failed to save Anthropic configuration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, modelConfig, enabled, enableIntegration, updateIntegrationSettings, integrationId, toast]);

  const handleDisableIntegration = useCallback(async () => {
    setIsLoading(true);
    try {
      await disableIntegration(integrationId);
      setIsEnabled(false);
      toast({
        title: "Integration Disabled",
        description: "Anthropic Claude integration has been disabled.",
      });
    } catch (error) {
      console.error('Error disabling integration:', error);
      toast({
        title: "Error",
        description: "Failed to disable integration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [disableIntegration, integrationId, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>Anthropic Claude Integration</span>
          </div>
          <Badge variant={isEnabled ? "default" : "secondary"}>
            {isEnabled ? 'Enabled' : 'Disabled'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="anthropic-api-key">API Key</Label>
          <Input
            id="anthropic-api-key"
            type="password"
            placeholder="Enter your Anthropic API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <select
              id="model"
              className="w-full p-2 border rounded-md"
              value={modelConfig.model}
              onChange={(e) => setModelConfig(prev => ({ ...prev, model: e.target.value }))}
            >
              <option value="claude-3-haiku-20240307">Claude 3 Haiku</option>
              <option value="claude-3-sonnet-20240229">Claude 3 Sonnet</option>
              <option value="claude-3-opus-20240229">Claude 3 Opus</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-tokens">Max Tokens</Label>
            <Input
              id="max-tokens"
              type="number"
              min="100"
              max="4000"
              value={modelConfig.maxTokens}
              onChange={(e) => setModelConfig(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="temperature">Temperature</Label>
            <Input
              id="temperature"
              type="number"
              min="0"
              max="1"
              step="0.1"
              value={modelConfig.temperature}
              onChange={(e) => setModelConfig(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button 
            onClick={handleSaveConfiguration}
            disabled={isLoading}
            className="flex-1"
          >
            <Settings className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Configuration'}
          </Button>
          
          {isEnabled && (
            <Button 
              variant="outline" 
              onClick={handleDisableIntegration}
              disabled={isLoading}
            >
              Disable
            </Button>
          )}
        </div>

        {isEnabled && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2 text-green-800">
              <MessageSquare className="h-4 w-4" />
              <span className="font-medium">Integration Active</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              Anthropic Claude is now available for enhanced therapy conversations.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnthropicIntegration;
