import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  User, 
  Settings, 
  Bell, 
  Lock, 
  Download, 
  Trash2,
  ArrowLeft,
  Camera,
  Moon
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useNotificationPreferences } from "@/hooks/useNotificationPreferences";

const UserProfile = () => {
  const { user, updateProfile, signOut } = useAuth();
  const { preferences, isLoading: prefsLoading, updatePreferences } = useNotificationPreferences();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [profileData, setProfileData] = useState({
    name: '',
    email: ''
  });

  const [appPreferences, setAppPreferences] = useState({
    darkMode: false
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.user_metadata?.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateProfile({
        name: profileData.name
      });
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationPreferenceChange = async (key: string, value: boolean | string) => {
    if (!preferences) return;
    
    await updatePreferences({ [key]: value });
  };

  const handleAppPreferenceChange = (key: string, value: boolean) => {
    setAppPreferences(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Preference Updated",
      description: `${key} has been ${value ? 'enabled' : 'disabled'}.`,
    });
  };

  const handleExportData = () => {
    toast({
      title: "Data Export",
      description: "Your data export has been initiated. You'll receive an email when ready.",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account Deletion",
      description: "Please contact support to delete your account.",
      variant: "destructive",
    });
  };

  const getUserInitials = () => {
    const name = profileData.name || user?.email || '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Profile & Settings</h1>
            <p className="text-muted-foreground">
              Manage your account and preferences
            </p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="" alt={profileData.name} />
                      <AvatarFallback className="text-lg">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" size="sm">
                        <Camera className="h-4 w-4 mr-2" />
                        Change Photo
                      </Button>
                      <p className="text-sm text-muted-foreground mt-2">
                        JPG, GIF or PNG. 1MB max.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600"
                    disabled={isLoading}
                  >
                    {isLoading ? "Updating..." : "Update Profile"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {prefsLoading ? (
                  <div className="text-center py-4 text-muted-foreground">
                    Loading preferences...
                  </div>
                ) : preferences ? (
                  <>
                    {/* Notification Types */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Session Reminders</h4>
                          <p className="text-sm text-muted-foreground">
                            Get reminded about therapy sessions and self-care
                          </p>
                        </div>
                        <Switch
                          checked={preferences.sessionReminders}
                          onCheckedChange={(checked) => handleNotificationPreferenceChange('sessionReminders', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Milestone Achievements</h4>
                          <p className="text-sm text-muted-foreground">
                            Celebrate your progress and achievements
                          </p>
                        </div>
                        <Switch
                          checked={preferences.milestoneNotifications}
                          onCheckedChange={(checked) => handleNotificationPreferenceChange('milestoneNotifications', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Progress Updates</h4>
                          <p className="text-sm text-muted-foreground">
                            Weekly summaries of your mental health progress
                          </p>
                        </div>
                        <Switch
                          checked={preferences.progressUpdates}
                          onCheckedChange={(checked) => handleNotificationPreferenceChange('progressUpdates', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Insight Notifications</h4>
                          <p className="text-sm text-muted-foreground">
                            AI-generated insights about your therapy patterns
                          </p>
                        </div>
                        <Switch
                          checked={preferences.insightNotifications}
                          onCheckedChange={(checked) => handleNotificationPreferenceChange('insightNotifications', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Streak Reminders</h4>
                          <p className="text-sm text-muted-foreground">
                            Maintain your therapy session streaks
                          </p>
                        </div>
                        <Switch
                          checked={preferences.streakReminders}
                          onCheckedChange={(checked) => handleNotificationPreferenceChange('streakReminders', checked)}
                        />
                      </div>
                    </div>

                    {/* Advanced Settings */}
                    <div className="border-t pt-6">
                      <h4 className="font-medium mb-4">Advanced Settings</h4>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="frequency">Notification Frequency</Label>
                          <Select
                            value={preferences.notificationFrequency}
                            onValueChange={(value) => handleNotificationPreferenceChange('notificationFrequency', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="minimal">Minimal - Only essential notifications</SelectItem>
                              <SelectItem value="normal">Normal - Balanced notifications</SelectItem>
                              <SelectItem value="frequent">Frequent - All available notifications</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="quietStart">Quiet Hours Start</Label>
                            <Input
                              id="quietStart"
                              type="time"
                              value={preferences.quietHoursStart || ''}
                              onChange={(e) => handleNotificationPreferenceChange('quietHoursStart', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="quietEnd">Quiet Hours End</Label>
                            <Input
                              id="quietEnd"
                              type="time"
                              value={preferences.quietHoursEnd || ''}
                              onChange={(e) => handleNotificationPreferenceChange('quietHoursEnd', e.target.value)}
                            />
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          No notifications will be sent during quiet hours
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    Failed to load notification preferences
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  App Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Dark Mode</h4>
                    <p className="text-sm text-muted-foreground">
                      Switch to dark theme for better night viewing
                    </p>
                  </div>
                  <Switch
                    checked={appPreferences.darkMode}
                    onCheckedChange={(checked) => handleAppPreferenceChange('darkMode', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="h-5 w-5 mr-2" />
                  Privacy & Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Data Export</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Download a copy of all your data including sessions, moods, and goals.
                  </p>
                  <Button variant="outline" onClick={handleExportData}>
                    <Download className="h-4 w-4 mr-2" />
                    Export My Data
                  </Button>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Data Retention</h4>
                  <p className="text-sm text-muted-foreground">
                    Your therapy sessions and personal data are stored securely and are only accessible to you. 
                    We retain your data for as long as your account is active.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Sign Out</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Sign out of your account on this device.
                  </p>
                  <Button variant="outline" onClick={() => signOut()}>
                    Sign Out
                  </Button>
                </div>

                <div>
                  <h4 className="font-medium mb-2 text-red-600">Delete Account</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <Button variant="destructive" onClick={handleDeleteAccount}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;
