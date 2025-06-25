import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Send, Settings, Phone } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SMSIntegrationSettings {
  apiKey: string;
  phoneNumber: string;
  autoResponse: boolean;
  customMessage: string;
}

const SMSIntegration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<SMSIntegrationSettings>({
    apiKey: '',
    phoneNumber: '',
    autoResponse: false,
    customMessage: 'Thank you for contacting us. We will get back to you soon!'
  });
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load settings from database or default values
    loadSettings();
  }, [user]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      // Mock data loading
      setTimeout(() => {
        setSettings({
          apiKey: 'YOUR_API_KEY',
          phoneNumber: '+15551234567',
          autoResponse: true,
          customMessage: 'Thank you for contacting us. We will get back to you soon!'
        });
        setIsEnabled(true);
      }, 500);
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "Error",
        description: "Failed to load SMS settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setLoading(true);
      // Mock data saving
      setTimeout(() => {
        toast({
          title: "Settings Saved",
          description: "SMS settings have been saved successfully.",
        });
      }, 500);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save SMS settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = (checked: boolean) => {
    setSettings(prev => ({ ...prev, autoResponse: checked }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>SMS Integration</span>
          </div>
          <Badge variant={isEnabled ? "default" : "secondary"}>
            {isEnabled ? 'Enabled' : 'Disabled'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="api-key">API Key</Label>
          <Input
            id="api-key"
            type="password"
            name="apiKey"
            placeholder="Enter your SMS API key"
            value={settings.apiKey}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone-number">Phone Number</Label>
          <Input
            id="phone-number"
            type="tel"
            name="phoneNumber"
            placeholder="+15551234567"
            value={settings.phoneNumber}
            onChange={handleInputChange}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="auto-response">Auto Response</Label>
          <Switch
            id="auto-response"
            checked={settings.autoResponse}
            onCheckedChange={handleToggle}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="custom-message">Custom Message</Label>
          <Textarea
            id="custom-message"
            name="customMessage"
            placeholder="Enter your custom auto-response message"
            value={settings.customMessage}
            onChange={handleInputChange}
          />
        </div>

        <Button onClick={saveSettings} disabled={loading} className="w-full">
          <Settings className="h-4 w-4 mr-2" />
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SMSIntegration;
