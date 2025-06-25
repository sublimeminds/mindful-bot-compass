
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Zap, Settings, Link, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const ZapierIntegration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [isIntegrationEnabled, setIsIntegrationEnabled] = useState(false);
  const [triggerEvent, setTriggerEvent] = useState('');
  const [actionType, setActionType] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Mock loading settings
    loadZapierSettings();
  }, [user]);

  const loadZapierSettings = async () => {
    try {
      setLoading(true);
      // Mock data - no database dependency
      setApiKey('');
      setIsIntegrationEnabled(false);
      setTriggerEvent('');
      setActionType('');
      setWebhookUrl('');
    } catch (error) {
      console.error('Error loading Zapier settings:', error);
      toast({
        title: "Error",
        description: "Failed to load Zapier settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveZapierSettings = async () => {
    try {
      setLoading(true);
      // Mock save - no database dependency
      toast({
        title: "Settings Saved",
        description: "Zapier integration settings saved successfully.",
      });
    } catch (error) {
      console.error('Error saving Zapier settings:', error);
      toast({
        title: "Error",
        description: "Failed to save Zapier settings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Zapier Integration</span>
          </div>
          <Badge variant={isIntegrationEnabled ? "default" : "secondary"}>
            {isIntegrationEnabled ? 'Enabled' : 'Disabled'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="zapier-api-key">API Key</Label>
          <Input
            id="zapier-api-key"
            type="password"
            placeholder="Enter your Zapier API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="trigger-event">Trigger Event</Label>
          <Select value={triggerEvent} onValueChange={setTriggerEvent}>
            <SelectTrigger>
              <SelectValue placeholder="Select trigger event" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new_session">New Session</SelectItem>
              <SelectItem value="mood_entry">New Mood Entry</SelectItem>
              <SelectItem value="goal_achieved">Goal Achieved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="action-type">Action Type</Label>
          <Select value={actionType} onValueChange={setActionType}>
            <SelectTrigger>
              <SelectValue placeholder="Select action type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="send_email">Send Email</SelectItem>
              <SelectItem value="create_task">Create Task</SelectItem>
              <SelectItem value="send_message">Send Message</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="webhook-url">Webhook URL</Label>
          <Input
            id="webhook-url"
            type="url"
            placeholder="Enter your Zapier Webhook URL"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Label htmlFor="integration-enabled">Enable Integration</Label>
          <Switch
            id="integration-enabled"
            checked={isIntegrationEnabled}
            onCheckedChange={setIsIntegrationEnabled}
          />
        </div>

        <Button onClick={saveZapierSettings} disabled={loading}>
          <Settings className="h-4 w-4 mr-2" />
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ZapierIntegration;
