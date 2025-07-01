
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Eye, Database, Share2, Save, Download, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PrivacySettings = () => {
  const { toast } = useToast();
  const [dataSharing, setDataSharing] = useState(false);
  const [analyticsTracking, setAnalyticsTracking] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState('private');
  const [sessionRecording, setSessionRecording] = useState(true);
  const [dataRetention, setDataRetention] = useState('12-months');
  const [thirdPartyIntegrations, setThirdPartyIntegrations] = useState(false);

  const handleSaveSettings = () => {
    localStorage.setItem('privacySettings', JSON.stringify({
      dataSharing,
      analyticsTracking,
      profileVisibility,
      sessionRecording,
      dataRetention,
      thirdPartyIntegrations
    }));

    toast({
      title: "Privacy Settings Saved",
      description: "Your privacy preferences have been updated successfully.",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Data Export Initiated",
      description: "Your data export request has been processed. You'll receive an email with download instructions.",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account Deletion Requested",
      description: "Please check your email for account deletion confirmation steps.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Data Privacy</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Data Sharing */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Data Sharing for Research</Label>
              <p className="text-sm text-muted-foreground">
                Allow anonymized data to be used for mental health research
              </p>
            </div>
            <Switch
              checked={dataSharing}
              onCheckedChange={setDataSharing}
            />
          </div>

          {/* Analytics Tracking */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Analytics Tracking</Label>
              <p className="text-sm text-muted-foreground">
                Help us improve the app by sharing usage analytics
              </p>
            </div>
            <Switch
              checked={analyticsTracking}
              onCheckedChange={setAnalyticsTracking}
            />
          </div>

          {/* Session Recording */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Session Recording</Label>
              <p className="text-sm text-muted-foreground">
                Record therapy sessions for progress tracking
              </p>
            </div>
            <Switch
              checked={sessionRecording}
              onCheckedChange={setSessionRecording}
            />
          </div>

          {/* Third Party Integrations */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Third-Party Integrations</Label>
              <p className="text-sm text-muted-foreground">
                Allow connection to external health and wellness apps
              </p>
            </div>
            <Switch
              checked={thirdPartyIntegrations}
              onCheckedChange={setThirdPartyIntegrations}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5" />
            <span>Visibility Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Profile Visibility */}
          <div className="space-y-2">
            <Label>Profile Visibility</Label>
            <Select value={profileVisibility} onValueChange={setProfileVisibility}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private - Only me</SelectItem>
                <SelectItem value="therapists">Therapists only</SelectItem>
                <SelectItem value="community">Community members</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Data Retention */}
          <div className="space-y-2">
            <Label>Data Retention Period</Label>
            <Select value={dataRetention} onValueChange={setDataRetention}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3-months">3 months</SelectItem>
                <SelectItem value="6-months">6 months</SelectItem>
                <SelectItem value="12-months">12 months</SelectItem>
                <SelectItem value="indefinite">Indefinite</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Data Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={handleExportData} variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export My Data
            </Button>
            
            <Button 
              onClick={handleDeleteAccount} 
              variant="destructive" 
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Data export includes all your sessions, notes, and settings. Account deletion is permanent and cannot be undone.
          </p>
        </CardContent>
      </Card>

      <Button onClick={handleSaveSettings} className="w-full">
        <Save className="h-4 w-4 mr-2" />
        Save Privacy Settings
      </Button>
    </div>
  );
};

export default PrivacySettings;
