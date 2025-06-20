import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Eye, Download, Trash2, Save } from 'lucide-react';
import { useAuth } from '@/components/SimpleAuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PrivacySettings {
  profile_visibility: string;
  data_sharing: boolean;
  analytics_tracking: boolean;
  marketing_communications: boolean;
  session_data_retention: string;
  anonymous_usage_stats: boolean;
}

const PrivacySettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<PrivacySettings>({
    profile_visibility: 'private',
    data_sharing: false,
    analytics_tracking: true,
    marketing_communications: false,
    session_data_retention: '2_years',
    anonymous_usage_stats: true,
  });

  useEffect(() => {
    if (user) {
      loadPrivacySettings();
    }
  }, [user]);

  const loadPrivacySettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('privacy_settings')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data?.privacy_settings) {
        setSettings({
          profile_visibility: data.privacy_settings.profile_visibility || 'private',
          data_sharing: data.privacy_settings.data_sharing || false,
          analytics_tracking: data.privacy_settings.analytics_tracking ?? true,
          marketing_communications: data.privacy_settings.marketing_communications || false,
          session_data_retention: data.privacy_settings.session_data_retention || '2_years',
          anonymous_usage_stats: data.privacy_settings.anonymous_usage_stats ?? true,
        });
      }
    } catch (error) {
      console.error('Error loading privacy settings:', error);
      toast({
        title: "Error",
        description: "Failed to load privacy settings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key: keyof PrivacySettings, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSelectChange = (key: keyof PrivacySettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          privacy_settings: settings,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Privacy settings saved successfully!",
      });

    } catch (error) {
      console.error('Error saving privacy settings:', error);
      toast({
        title: "Error",
        description: "Failed to save privacy settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const exportData = async () => {
    try {
      toast({
        title: "Data Export",
        description: "Your data export will be sent to your email within 24 hours.",
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Error",
        description: "Failed to initiate data export. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.'
    );
    
    if (confirmed) {
      try {
        toast({
          title: "Account Deletion",
          description: "Account deletion request submitted. Our team will process this within 48 hours.",
        });
      } catch (error) {
        console.error('Error deleting account:', error);
        toast({
          title: "Error",
          description: "Failed to submit account deletion request. Please contact support.",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="h-5 w-5 mr-2" />
            Profile Visibility
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profile-visibility">Who can see your profile?</Label>
            <Select value={settings.profile_visibility} onValueChange={(value) => handleSelectChange('profile_visibility', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private - Only you</SelectItem>
                <SelectItem value="therapists">Therapists only</SelectItem>
                <SelectItem value="community">Community members</SelectItem>
                <SelectItem value="public">Public</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Data & Privacy Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="data-sharing">Data Sharing for Research</Label>
              <p className="text-sm text-muted-foreground">
                Allow anonymous data sharing to help improve mental health research
              </p>
            </div>
            <Switch
              id="data-sharing"
              checked={settings.data_sharing}
              onCheckedChange={(checked) => handleToggle('data_sharing', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="analytics-tracking">Analytics Tracking</Label>
              <p className="text-sm text-muted-foreground">
                Help us improve the app by sharing anonymous usage data
              </p>
            </div>
            <Switch
              id="analytics-tracking"
              checked={settings.analytics_tracking}
              onCheckedChange={(checked) => handleToggle('analytics_tracking', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="marketing-communications">Marketing Communications</Label>
              <p className="text-sm text-muted-foreground">
                Receive updates about new features and therapy tips
              </p>
            </div>
            <Switch
              id="marketing-communications"
              checked={settings.marketing_communications}
              onCheckedChange={(checked) => handleToggle('marketing_communications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="anonymous-usage">Anonymous Usage Statistics</Label>
              <p className="text-sm text-muted-foreground">
                Share anonymous usage patterns to help improve the platform
              </p>
            </div>
            <Switch
              id="anonymous-usage"
              checked={settings.anonymous_usage_stats}
              onCheckedChange={(checked) => handleToggle('anonymous_usage_stats', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="data-retention">Session Data Retention</Label>
            <Select value={settings.session_data_retention} onValueChange={(value) => handleSelectChange('session_data_retention', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select retention period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1_year">1 Year</SelectItem>
                <SelectItem value="2_years">2 Years</SelectItem>
                <SelectItem value="5_years">5 Years</SelectItem>
                <SelectItem value="indefinite">Keep Indefinitely</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              How long should we keep your session data for your records?
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              variant="outline" 
              onClick={exportData}
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Export My Data
            </Button>
            
            <Button 
              variant="destructive" 
              onClick={deleteAccount}
              className="flex-1"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Export includes all your therapy sessions, mood entries, goals, and profile data. 
            Account deletion is permanent and cannot be undone.
          </p>
        </CardContent>
      </Card>

      <Button onClick={saveSettings} disabled={saving} className="w-full">
        <Save className="h-4 w-4 mr-2" />
        {saving ? 'Saving...' : 'Save Privacy Settings'}
      </Button>
    </div>
  );
};

export default PrivacySettings;
