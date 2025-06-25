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
import { Smartphone, Bell, Download, Settings } from 'lucide-react';

interface MobileIntegrationSettings {
  notificationsEnabled: boolean;
  syncContacts: boolean;
  autoBackup: boolean;
}

const MobileIntegration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<MobileIntegrationSettings>({
    notificationsEnabled: true,
    syncContacts: false,
    autoBackup: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock loading settings from a database or API
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const handleSettingChange = (setting: keyof MobileIntegrationSettings, value: boolean) => {
    // Mock saving settings to a database or API
    setLoading(true);
    setTimeout(() => {
      setSettings(prev => ({ ...prev, [setting]: value }));
      setLoading(false);
      toast({
        title: "Settings Updated",
        description: `Mobile integration settings updated successfully.`,
      });
    }, 500);
  };

  const handleDownloadApp = () => {
    // Mock initiating app download
    toast({
      title: "Download Initiated",
      description: "Your download will begin shortly.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Smartphone className="h-5 w-5" />
            <span>Mobile Integration</span>
          </div>
          <Badge variant="secondary">Beta</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <p>Loading settings...</p>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Push Notifications</Label>
              <Switch
                id="notifications"
                checked={settings.notificationsEnabled}
                onCheckedChange={(checked) => handleSettingChange('notificationsEnabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="sync-contacts">Sync Contacts</Label>
              <Switch
                id="sync-contacts"
                checked={settings.syncContacts}
                onCheckedChange={(checked) => handleSettingChange('syncContacts', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="auto-backup">Automatic Data Backup</Label>
              <Switch
                id="auto-backup"
                checked={settings.autoBackup}
                onCheckedChange={(checked) => handleSettingChange('autoBackup', checked)}
              />
            </div>

            <Button variant="outline" onClick={handleDownloadApp}>
              <Download className="h-4 w-4 mr-2" />
              Download Mobile App
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MobileIntegration;
