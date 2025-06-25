import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Video, Calendar, Users, Settings } from 'lucide-react';

interface VideoIntegrationSettings {
  apiKey: string;
  apiSecret: string;
  meetingType: 'group' | 'one-on-one';
  autoRecord: boolean;
}

const VideoIntegration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<VideoIntegrationSettings>({
    apiKey: '',
    apiSecret: '',
    meetingType: 'group',
    autoRecord: false,
  });
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Mock loading settings from database
    setLoading(true);
    setTimeout(() => {
      setSettings({
        apiKey: 'YOUR_API_KEY',
        apiSecret: 'YOUR_API_SECRET',
        meetingType: 'group',
        autoRecord: true,
      });
      setEnabled(true);
      setLoading(false);
    }, 500);
  }, []);

  const handleEnableIntegration = () => {
    // Mock enabling integration
    setLoading(true);
    setTimeout(() => {
      setEnabled(true);
      setLoading(false);
      toast({
        title: "Video Integration Enabled",
        description: "Video conferencing is now integrated with your account.",
      });
    }, 1000);
  };

  const handleDisableIntegration = () => {
    // Mock disabling integration
    setLoading(true);
    setTimeout(() => {
      setEnabled(false);
      setLoading(false);
      toast({
        title: "Video Integration Disabled",
        description: "Video conferencing integration has been disabled.",
      });
    }, 1000);
  };

  const handleSaveSettings = () => {
    // Mock saving settings
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Settings Saved",
        description: "Video integration settings have been saved.",
      });
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Video className="h-5 w-5" />
            <span>Video Conferencing Integration</span>
          </div>
          <Badge variant={enabled ? "default" : "secondary"}>
            {enabled ? 'Enabled' : 'Disabled'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="api-key">API Key</Label>
          <Input
            id="api-key"
            type="text"
            placeholder="Enter your API key"
            value={settings.apiKey}
            onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="api-secret">API Secret</Label>
          <Input
            id="api-secret"
            type="password"
            placeholder="Enter your API secret"
            value={settings.apiSecret}
            onChange={(e) => setSettings({ ...settings, apiSecret: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="meeting-type">Meeting Type</Label>
          <select
            id="meeting-type"
            className="w-full p-2 border rounded-md"
            value={settings.meetingType}
            onChange={(e) => setSettings({ ...settings, meetingType: e.target.value as 'group' | 'one-on-one' })}
          >
            <option value="group">Group Meeting</option>
            <option value="one-on-one">One-on-One</option>
          </select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-record">Auto Record Meetings</Label>
            <Switch
              id="auto-record"
              checked={settings.autoRecord}
              onCheckedChange={(checked) => setSettings({ ...settings, autoRecord: checked })}
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button onClick={handleSaveSettings} disabled={loading}>
            <Settings className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
          {!enabled ? (
            <Button variant="outline" onClick={handleEnableIntegration} disabled={loading}>
              Enable Integration
            </Button>
          ) : (
            <Button variant="outline" onClick={handleDisableIntegration} disabled={loading}>
              Disable Integration
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoIntegration;
