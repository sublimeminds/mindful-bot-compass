import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Database, Shield, AlertCircle, CheckCircle } from 'lucide-react';

const EHRIntegration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [ehrSettings, setEHRSettings] = useState({
    apiKey: '',
    apiUrl: '',
    isSandbox: true,
    isActive: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, [user]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      // Mock EHR settings loading
      setTimeout(() => {
        setEHRSettings({
          apiKey: 'mockAPIKey123',
          apiUrl: 'https://mockehr.example.com/api',
          isSandbox: true,
          isActive: false,
        });
      }, 500);
    } catch (error) {
      console.error('Error loading EHR settings:', error);
      toast({
        title: "Error",
        description: "Failed to load EHR settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEHRSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = (name: string, checked: boolean) => {
    setEHRSettings(prev => ({ ...prev, [name]: checked }));
  };

  const handleSaveSettings = () => {
    // Mock EHR settings saving
    toast({
      title: "Settings Saved",
      description: "EHR settings have been saved successfully.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="h-5 w-5 mr-2" />
          EHR Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="text-center py-8">Loading settings...</div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                name="apiKey"
                type="password"
                placeholder="Enter your API key"
                value={ehrSettings.apiKey}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="api-url">API URL</Label>
              <Input
                id="api-url"
                name="apiUrl"
                type="url"
                placeholder="Enter the API URL"
                value={ehrSettings.apiUrl}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sandbox-mode">Sandbox Mode</Label>
              <Switch
                id="sandbox-mode"
                name="isSandbox"
                checked={ehrSettings.isSandbox}
                onCheckedChange={(checked) => handleToggle('isSandbox', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="active">Integration Active</Label>
              <Switch
                id="active"
                name="isActive"
                checked={ehrSettings.isActive}
                onCheckedChange={(checked) => handleToggle('isActive', checked)}
              />
            </div>
            <Button onClick={handleSaveSettings}>Save Settings</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EHRIntegration;
