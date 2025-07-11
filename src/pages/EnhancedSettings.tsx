import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  User, 
  Shield, 
  Bell, 
  Mic, 
  Brain, 
  Heart, 
  Upload, 
  Download, 
  Trash2, 
  Save,
  Eye,
  EyeOff,
  Camera,
  Settings,
  Smartphone,
  Mail,
  Calendar,
  Globe,
  Volume2,
  Moon,
  Sun,
  Palette
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PageLayout from '@/components/layout/PageLayout';

const EnhancedSettings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('account');
  const [settings, setSettings] = useState({
    // Account Settings
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Working on anxiety management and personal growth.',
    timezone: 'America/New_York',
    language: 'en',
    
    // Privacy Settings
    dataSharing: true,
    analytics: false,
    profileVisibility: 'private',
    sessionRecording: true,
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    sessionReminders: true,
    progressUpdates: true,
    
    // Voice Settings
    voiceEnabled: true,
    selectedVoice: 'natural-female',
    voiceSpeed: 1.0,
    emotionDetection: true,
    
    // Therapy Settings
    sessionLength: 45,
    reminderTime: '19:00',
    crisisContacts: ['emergency@example.com'],
    therapyApproach: 'cbt',
    
    // Appearance
    theme: 'system',
    colorScheme: 'therapy'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = (section: string) => {
    toast({
      title: "Settings Saved",
      description: `Your ${section} settings have been updated successfully.`,
    });
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    });
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <PageLayout>
      <div className="bg-gradient-to-br from-therapy-25 to-calm-25 min-h-screen py-8">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold therapy-text-gradient mb-2">Settings</h1>
            <p className="text-gray-600">Customize your TherapySync experience</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 bg-white shadow-sm">
              <TabsTrigger value="account" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Account</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Privacy</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center space-x-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="voice" className="flex items-center space-x-2">
                <Mic className="h-4 w-4" />
                <span className="hidden sm:inline">Voice</span>
              </TabsTrigger>
              <TabsTrigger value="therapy" className="flex items-center space-x-2">
                <Brain className="h-4 w-4" />
                <span className="hidden sm:inline">Therapy</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center space-x-2">
                <Palette className="h-4 w-4" />
                <span className="hidden sm:inline">Appearance</span>
              </TabsTrigger>
            </TabsList>

            {/* Account Settings */}
            <TabsContent value="account" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Profile Information</span>
                  </CardTitle>
                  <CardDescription>
                    Update your personal information and profile settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="/placeholder-avatar.jpg" />
                      <AvatarFallback className="text-lg">SJ</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm">
                        <Camera className="h-4 w-4 mr-2" />
                        Change Photo
                      </Button>
                      <p className="text-sm text-gray-500">JPG, PNG or GIF. Max size 5MB.</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={settings.name}
                        onChange={(e) => setSettings({...settings, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={settings.email}
                        onChange={(e) => setSettings({...settings, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={settings.phone}
                        onChange={(e) => setSettings({...settings, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select value={settings.timezone} onValueChange={(value) => setSettings({...settings, timezone: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                          <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us a bit about yourself and your wellness goals..."
                      value={settings.bio}
                      onChange={(e) => setSettings({...settings, bio: e.target.value})}
                      rows={3}
                    />
                  </div>

                  <Button onClick={() => handleSave('profile')} className="w-full md:w-auto">
                    <Save className="h-4 w-4 mr-2" />
                    Save Profile Changes
                  </Button>
                </CardContent>
              </Card>

              {/* Password Change */}
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <Button onClick={handlePasswordChange} disabled={!newPassword || !confirmPassword}>
                    Update Password
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Settings */}
            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Privacy & Data Control</span>
                  </CardTitle>
                  <CardDescription>
                    Manage your data privacy and sharing preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Data Sharing</Label>
                        <p className="text-sm text-gray-500">
                          Share anonymized data to help improve TherapySync AI
                        </p>
                      </div>
                      <Switch
                        checked={settings.dataSharing}
                        onCheckedChange={(checked) => setSettings({...settings, dataSharing: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Analytics & Usage</Label>
                        <p className="text-sm text-gray-500">
                          Allow collection of usage data for service improvement
                        </p>
                      </div>
                      <Switch
                        checked={settings.analytics}
                        onCheckedChange={(checked) => setSettings({...settings, analytics: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Session Recording</Label>
                        <p className="text-sm text-gray-500">
                          Store therapy sessions for continuity and progress tracking
                        </p>
                      </div>
                      <Switch
                        checked={settings.sessionRecording}
                        onCheckedChange={(checked) => setSettings({...settings, sessionRecording: checked})}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Data Export & Deletion</h4>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export My Data
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </div>

                  <Button onClick={() => handleSave('privacy')} className="w-full md:w-auto">
                    <Save className="h-4 w-4 mr-2" />
                    Save Privacy Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <span>Notification Preferences</span>
                  </CardTitle>
                  <CardDescription>
                    Choose how and when you want to receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-gray-500" />
                        <div className="space-y-0.5">
                          <Label className="text-base">Email Notifications</Label>
                          <p className="text-sm text-gray-500">Progress updates and important alerts</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="h-5 w-5 text-gray-500" />
                        <div className="space-y-0.5">
                          <Label className="text-base">Push Notifications</Label>
                          <p className="text-sm text-gray-500">Real-time alerts and reminders</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.pushNotifications}
                        onCheckedChange={(checked) => setSettings({...settings, pushNotifications: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-gray-500" />
                        <div className="space-y-0.5">
                          <Label className="text-base">Session Reminders</Label>
                          <p className="text-sm text-gray-500">Daily therapy session notifications</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.sessionReminders}
                        onCheckedChange={(checked) => setSettings({...settings, sessionReminders: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Heart className="h-5 w-5 text-gray-500" />
                        <div className="space-y-0.5">
                          <Label className="text-base">Progress Updates</Label>
                          <p className="text-sm text-gray-500">Weekly insights and achievements</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.progressUpdates}
                        onCheckedChange={(checked) => setSettings({...settings, progressUpdates: checked})}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Notification Schedule</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="reminder-time">Daily Reminder Time</Label>
                        <Input
                          id="reminder-time"
                          type="time"
                          value={settings.reminderTime}
                          onChange={(e) => setSettings({...settings, reminderTime: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <Button onClick={() => handleSave('notifications')} className="w-full md:w-auto">
                    <Save className="h-4 w-4 mr-2" />
                    Save Notification Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Voice Settings */}
            <TabsContent value="voice" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mic className="h-5 w-5" />
                    <span>Voice & Audio Settings</span>
                  </CardTitle>
                  <CardDescription>
                    Customize your voice therapy experience
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Voice Therapy</Label>
                        <p className="text-sm text-gray-500">
                          Enable voice conversations with AI therapist
                        </p>
                      </div>
                      <Switch
                        checked={settings.voiceEnabled}
                        onCheckedChange={(checked) => setSettings({...settings, voiceEnabled: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Emotion Detection</Label>
                        <p className="text-sm text-gray-500">
                          Allow AI to analyze emotional state from voice patterns
                        </p>
                      </div>
                      <Switch
                        checked={settings.emotionDetection}
                        onCheckedChange={(checked) => setSettings({...settings, emotionDetection: checked})}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="voice-select">Voice Selection</Label>
                      <Select value={settings.selectedVoice} onValueChange={(value) => setSettings({...settings, selectedVoice: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="natural-female">Natural Female Voice</SelectItem>
                          <SelectItem value="natural-male">Natural Male Voice</SelectItem>
                          <SelectItem value="gentle-female">Gentle Female Voice</SelectItem>
                          <SelectItem value="warm-male">Warm Male Voice</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="voice-speed">Speech Speed</Label>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm">Slow</span>
                        <input
                          type="range"
                          min="0.5"
                          max="2.0"
                          step="0.1"
                          value={settings.voiceSpeed}
                          onChange={(e) => setSettings({...settings, voiceSpeed: parseFloat(e.target.value)})}
                          className="flex-1"
                        />
                        <span className="text-sm">Fast</span>
                      </div>
                      <p className="text-sm text-gray-500">Current speed: {settings.voiceSpeed}x</p>
                    </div>
                  </div>

                  <Button onClick={() => handleSave('voice')} className="w-full md:w-auto">
                    <Save className="h-4 w-4 mr-2" />
                    Save Voice Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Therapy Settings */}
            <TabsContent value="therapy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="h-5 w-5" />
                    <span>Therapy Preferences</span>
                  </CardTitle>
                  <CardDescription>
                    Personalize your therapeutic approach and goals
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="therapy-approach">Preferred Therapy Approach</Label>
                      <Select value={settings.therapyApproach} onValueChange={(value) => setSettings({...settings, therapyApproach: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cbt">Cognitive Behavioral Therapy (CBT)</SelectItem>
                          <SelectItem value="dbt">Dialectical Behavior Therapy (DBT)</SelectItem>
                          <SelectItem value="mindfulness">Mindfulness-Based Therapy</SelectItem>
                          <SelectItem value="psychodynamic">Psychodynamic Therapy</SelectItem>
                          <SelectItem value="humanistic">Humanistic Therapy</SelectItem>
                          <SelectItem value="mixed">Mixed Approach</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="session-length">Session Length (minutes)</Label>
                      <Select value={settings.sessionLength.toString()} onValueChange={(value) => setSettings({...settings, sessionLength: parseInt(value)})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="45">45 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Crisis Support</h4>
                    <div className="space-y-2">
                      <Label htmlFor="crisis-contacts">Emergency Contact Email</Label>
                      <Input
                        id="crisis-contacts"
                        type="email"
                        placeholder="emergency@example.com"
                        value={settings.crisisContacts[0] || ''}
                        onChange={(e) => setSettings({...settings, crisisContacts: [e.target.value]})}
                      />
                      <p className="text-sm text-gray-500">
                        This contact will be notified if our AI detects a crisis situation
                      </p>
                    </div>
                  </div>

                  <Button onClick={() => handleSave('therapy')} className="w-full md:w-auto">
                    <Save className="h-4 w-4 mr-2" />
                    Save Therapy Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance Settings */}
            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Palette className="h-5 w-5" />
                    <span>Appearance & Theme</span>
                  </CardTitle>
                  <CardDescription>
                    Customize the look and feel of your TherapySync experience
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label className="text-base">Theme Preference</Label>
                      <div className="grid grid-cols-3 gap-3">
                        <div 
                          className={`p-4 rounded-lg border cursor-pointer transition-all ${settings.theme === 'light' ? 'border-therapy-500 bg-therapy-50' : 'border-gray-200'}`}
                          onClick={() => setSettings({...settings, theme: 'light'})}
                        >
                          <Sun className="h-6 w-6 mx-auto mb-2" />
                          <p className="text-sm text-center">Light</p>
                        </div>
                        <div 
                          className={`p-4 rounded-lg border cursor-pointer transition-all ${settings.theme === 'dark' ? 'border-therapy-500 bg-therapy-50' : 'border-gray-200'}`}
                          onClick={() => setSettings({...settings, theme: 'dark'})}
                        >
                          <Moon className="h-6 w-6 mx-auto mb-2" />
                          <p className="text-sm text-center">Dark</p>
                        </div>
                        <div 
                          className={`p-4 rounded-lg border cursor-pointer transition-all ${settings.theme === 'system' ? 'border-therapy-500 bg-therapy-50' : 'border-gray-200'}`}
                          onClick={() => setSettings({...settings, theme: 'system'})}
                        >
                          <Settings className="h-6 w-6 mx-auto mb-2" />
                          <p className="text-sm text-center">System</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-base">Color Scheme</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <div 
                          className={`p-4 rounded-lg border cursor-pointer transition-all ${settings.colorScheme === 'therapy' ? 'border-therapy-500 bg-therapy-50' : 'border-gray-200'}`}
                          onClick={() => setSettings({...settings, colorScheme: 'therapy'})}
                        >
                          <div className="flex space-x-2 mb-2">
                            <div className="w-4 h-4 bg-therapy-500 rounded"></div>
                            <div className="w-4 h-4 bg-harmony-500 rounded"></div>
                            <div className="w-4 h-4 bg-calm-500 rounded"></div>
                          </div>
                          <p className="text-sm">Therapy (Default)</p>
                        </div>
                        <div 
                          className={`p-4 rounded-lg border cursor-pointer transition-all ${settings.colorScheme === 'calm' ? 'border-therapy-500 bg-therapy-50' : 'border-gray-200'}`}
                          onClick={() => setSettings({...settings, colorScheme: 'calm'})}
                        >
                          <div className="flex space-x-2 mb-2">
                            <div className="w-4 h-4 bg-blue-500 rounded"></div>
                            <div className="w-4 h-4 bg-green-500 rounded"></div>
                            <div className="w-4 h-4 bg-teal-500 rounded"></div>
                          </div>
                          <p className="text-sm">Ocean Calm</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button onClick={() => handleSave('appearance')} className="w-full md:w-auto">
                    <Save className="h-4 w-4 mr-2" />
                    Save Appearance Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
};

export default EnhancedSettings;