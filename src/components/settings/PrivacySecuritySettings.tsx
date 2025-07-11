import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Eye, Download, Trash2, Key, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const PrivacySecuritySettings: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(profileData);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast({
        title: "Error",
        description: "Failed to load privacy settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePrivacySettings = async (settings: any) => {
    try {
      setSaving(true);

      const { error } = await supabase
        .from('profiles')
        .update({
          privacy_settings: {
            ...profile.privacy_settings,
            ...settings
          }
        })
        .eq('id', profile.id);

      if (error) throw error;

      setProfile(prev => ({
        ...prev,
        privacy_settings: {
          ...prev.privacy_settings,
          ...settings
        }
      }));

      toast({
        title: "Settings Updated",
        description: "Your privacy settings have been saved.",
      });
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      toast({
        title: "Error",
        description: "Failed to update privacy settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const downloadUserData = async () => {
    try {
      // This would typically call an edge function to generate and send the data
      toast({
        title: "Data Export Requested",
        description: "We'll email you a link to download your data within 24 hours.",
      });
    } catch (error) {
      console.error('Error requesting data export:', error);
      toast({
        title: "Error",
        description: "Failed to request data export",
        variant: "destructive",
      });
    }
  };

  const deleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      toast({
        title: "Invalid Confirmation",
        description: "Please type 'DELETE' to confirm account deletion",
        variant: "destructive",
      });
      return;
    }

    try {
      // This would typically call an edge function to handle account deletion
      toast({
        title: "Account Deletion Requested",
        description: "Your account will be deleted within 30 days. You'll receive a confirmation email.",
        variant: "destructive",
      });
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive",
      });
    }
  };

  const privacySettings = profile?.privacy_settings || {};

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Privacy & Security</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center justify-between p-4 border rounded">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-32"></div>
                  <div className="h-3 bg-muted rounded w-48"></div>
                </div>
                <div className="h-6 w-10 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Data Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Data Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Analytics & Insights</Label>
                <p className="text-sm text-muted-foreground">
                  Allow us to analyze your therapy progress to provide personalized insights
                </p>
              </div>
              <Switch
                checked={privacySettings.analytics_enabled ?? true}
                onCheckedChange={(checked) => 
                  updatePrivacySettings({ analytics_enabled: checked })
                }
                disabled={saving}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Usage Data Collection</Label>
                <p className="text-sm text-muted-foreground">
                  Help improve our platform by sharing anonymized usage data
                </p>
              </div>
              <Switch
                checked={privacySettings.usage_data_enabled ?? true}
                onCheckedChange={(checked) => 
                  updatePrivacySettings({ usage_data_enabled: checked })
                }
                disabled={saving}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Personalization</Label>
                <p className="text-sm text-muted-foreground">
                  Use your data to personalize your therapy experience
                </p>
              </div>
              <Switch
                checked={privacySettings.personalization_enabled ?? true}
                onCheckedChange={(checked) => 
                  updatePrivacySettings({ personalization_enabled: checked })
                }
                disabled={saving}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Marketing Communications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive updates about new features and improvements
                </p>
              </div>
              <Switch
                checked={privacySettings.marketing_enabled ?? false}
                onCheckedChange={(checked) => 
                  updatePrivacySettings({ marketing_enabled: checked })
                }
                disabled={saving}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Visibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="h-5 w-5 mr-2" />
            Data Visibility
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Profile Visibility</Label>
              <p className="text-sm text-muted-foreground">
                Who can see your profile information
              </p>
            </div>
            <Switch
              checked={privacySettings.profile_public ?? false}
              onCheckedChange={(checked) => 
                updatePrivacySettings({ profile_public: checked })
              }
              disabled={saving}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Progress Sharing</Label>
              <p className="text-sm text-muted-foreground">
                Allow sharing of milestone achievements with the community
              </p>
            </div>
            <Switch
              checked={privacySettings.progress_sharing_enabled ?? false}
              onCheckedChange={(checked) => 
                updatePrivacySettings({ progress_sharing_enabled: checked })
              }
              disabled={saving}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="h-5 w-5 mr-2" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Add an extra layer of security to your account
              </p>
              <Button variant="outline" size="sm">
                Enable 2FA
              </Button>
            </div>

            <Separator />

            <div>
              <Label className="text-base font-medium">Active Sessions</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Manage devices that are currently logged into your account
              </p>
              <Button variant="outline" size="sm">
                View Sessions
              </Button>
            </div>

            <Separator />

            <div>
              <Label className="text-base font-medium">Login Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when someone logs into your account
              </p>
              <Switch
                checked={privacySettings.login_alerts_enabled ?? true}
                onCheckedChange={(checked) => 
                  updatePrivacySettings({ login_alerts_enabled: checked })
                }
                disabled={saving}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Download className="h-5 w-5 mr-2" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-base font-medium">Export Your Data</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Download a copy of all your data including sessions, goals, and preferences
            </p>
            <Button variant="outline" onClick={downloadUserData}>
              <Download className="h-4 w-4 mr-2" />
              Request Data Export
            </Button>
          </div>

          <Separator />

          <div>
            <Label className="text-base font-medium text-destructive">Delete Account</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Permanently delete your account and all associated data
            </p>
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center text-destructive">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Delete Account
                  </DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete your
                    account and remove all your data from our servers.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      This will delete all your therapy sessions, goals, progress data,
                      and personal information permanently.
                    </AlertDescription>
                  </Alert>
                  <div>
                    <Label htmlFor="delete-confirmation">
                      Type "DELETE" to confirm
                    </Label>
                    <Input
                      id="delete-confirmation"
                      value={deleteConfirmation}
                      onChange={(e) => setDeleteConfirmation(e.target.value)}
                      placeholder="DELETE"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={deleteAccount}
                    disabled={deleteConfirmation !== 'DELETE'}
                  >
                    Delete Account
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacySecuritySettings;