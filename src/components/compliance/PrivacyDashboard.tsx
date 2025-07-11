import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Eye, 
  Database, 
  Cookie,
  Mail,
  MessageSquare,
  Trash2,
  Download,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PrivacyPreferences {
  analytics_consent: boolean;
  marketing_consent: boolean;
  third_party_sharing: boolean;
  data_retention_period: string;
  communication_preferences: any;
  cookie_preferences: any;
}

const PrivacyDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<PrivacyPreferences>({
    analytics_consent: false,
    marketing_consent: false,
    third_party_sharing: false,
    data_retention_period: '2_years',
    communication_preferences: {},
    cookie_preferences: {}
  });
  const [loading, setLoading] = useState(true);
  const [deletionRequest, setDeletionRequest] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchPrivacyPreferences();
      checkDeletionRequest();
    }
  }, [user]);

  const fetchPrivacyPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('privacy_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // Ignore "not found" error
      
      if (data) {
        setPreferences(data);
      }
    } catch (error) {
      console.error('Error fetching privacy preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkDeletionRequest = async () => {
    try {
      const { data } = await supabase
        .from('data_deletion_requests')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'pending')
        .single();

      if (data) {
        setDeletionRequest(data);
      }
    } catch (error) {
      // Ignore error if no deletion request exists
    }
  };

  const updatePreference = async (key: keyof PrivacyPreferences, value: any) => {
    try {
      const updatedPreferences = { ...preferences, [key]: value };
      setPreferences(updatedPreferences);

      const { error } = await supabase
        .from('privacy_preferences')
        .upsert({
          user_id: user?.id,
          ...updatedPreferences
        });

      if (error) throw error;

      // Also update consent records
      if (['analytics_consent', 'marketing_consent', 'third_party_sharing'].includes(key)) {
        await supabase.rpc('update_consent', {
          user_id_param: user?.id,
          consent_type_param: key,
          granted_param: value
        });
      }

      toast({
        title: "Privacy Preferences Updated",
        description: "Your privacy settings have been saved successfully.",
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast({
        title: "Error",
        description: "Failed to update privacy preferences. Please try again.",
        variant: "destructive"
      });
    }
  };

  const requestAccountDeletion = async () => {
    try {
      const { data, error } = await supabase.rpc('request_data_deletion', {
        user_id_param: user?.id,
        deletion_type: 'full_account',
        reason_text: 'User requested account deletion'
      });

      if (error) throw error;

      toast({
        title: "Account Deletion Requested",
        description: "Your account will be scheduled for deletion in 30 days. You can cancel this request anytime before then.",
        variant: "destructive"
      });

      checkDeletionRequest();
    } catch (error) {
      console.error('Error requesting deletion:', error);
      toast({
        title: "Error",
        description: "Failed to request account deletion. Please try again.",
        variant: "destructive"
      });
    }
  };

  const cancelDeletionRequest = async () => {
    try {
      const { error } = await supabase
        .from('data_deletion_requests')
        .update({ status: 'cancelled' })
        .eq('id', deletionRequest.id);

      if (error) throw error;

      setDeletionRequest(null);
      toast({
        title: "Deletion Request Cancelled",
        description: "Your account deletion request has been cancelled.",
      });
    } catch (error) {
      console.error('Error cancelling deletion:', error);
      toast({
        title: "Error",
        description: "Failed to cancel deletion request. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Account Deletion Warning */}
      {deletionRequest && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              <span>Account Deletion Scheduled</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-red-700">
              Your account is scheduled for deletion on{' '}
              <strong>{new Date(deletionRequest.scheduled_for).toLocaleDateString()}</strong>.
              This action cannot be undone after the scheduled date.
            </p>
            <Button 
              onClick={cancelDeletionRequest}
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-100"
            >
              Cancel Deletion Request
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Privacy Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Privacy Controls</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Analytics Consent */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Analytics & Usage Data</Label>
              <p className="text-xs text-muted-foreground">
                Help us improve the app by sharing anonymized usage analytics
              </p>
            </div>
            <Switch
              checked={preferences.analytics_consent}
              onCheckedChange={(value) => updatePreference('analytics_consent', value)}
            />
          </div>

          {/* Marketing Consent */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Marketing Communications</Label>
              <p className="text-xs text-muted-foreground">
                Receive updates about new features and wellness tips
              </p>
            </div>
            <Switch
              checked={preferences.marketing_consent}
              onCheckedChange={(value) => updatePreference('marketing_consent', value)}
            />
          </div>

          {/* Third Party Sharing */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Third-Party Data Sharing</Label>
              <p className="text-xs text-muted-foreground">
                Allow sharing anonymized data with research partners
              </p>
            </div>
            <Switch
              checked={preferences.third_party_sharing}
              onCheckedChange={(value) => updatePreference('third_party_sharing', value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Retention */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Data Retention</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Current Retention Period</Label>
            <Badge variant="outline" className="text-sm">
              {preferences.data_retention_period.replace('_', ' ')}
            </Badge>
            <p className="text-xs text-muted-foreground">
              Your data will be automatically deleted after this period of inactivity.
              You can request immediate deletion using the button below.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Cookie Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Cookie className="h-5 w-5" />
            <span>Cookie Preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <Label className="text-sm font-medium">Essential</Label>
              </div>
              <p className="text-xs text-muted-foreground">
                Required for basic app functionality
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge variant={preferences.analytics_consent ? "default" : "secondary"} className="text-xs">
                  {preferences.analytics_consent ? "Enabled" : "Disabled"}
                </Badge>
                <Label className="text-sm font-medium">Analytics</Label>
              </div>
              <p className="text-xs text-muted-foreground">
                Help us understand app usage
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge variant={preferences.marketing_consent ? "default" : "secondary"} className="text-xs">
                  {preferences.marketing_consent ? "Enabled" : "Disabled"}
                </Badge>
                <Label className="text-sm font-medium">Marketing</Label>
              </div>
              <p className="text-xs text-muted-foreground">
                Personalized content and offers
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-700">
            <Trash2 className="h-5 w-5" />
            <span>Account Deletion</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Delete your account and all associated data permanently. This action cannot be undone.
            Your data will be scheduled for deletion in 30 days, giving you time to change your mind.
          </p>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-red-600">This action is irreversible</span>
          </div>
          {!deletionRequest && (
            <Button 
              onClick={requestAccountDeletion}
              variant="destructive"
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Request Account Deletion
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyDashboard;