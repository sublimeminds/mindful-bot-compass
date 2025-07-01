import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import DashboardLayoutWithSidebar from '@/components/dashboard/DashboardLayoutWithSidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Mic,
  Palette 
} from 'lucide-react';
import EnhancedAccountSettings from '@/components/profile/EnhancedAccountSettings';
import PrivacySettings from '@/components/profile/PrivacySettings';
import SimpleNotificationSettings from '@/components/notifications/SimpleNotificationSettings';
import VoiceSettings from '@/components/voice/VoiceSettings';
import GeneralSettings from '@/components/settings/GeneralSettings';

const ComprehensiveSettingsPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
          <p className="text-therapy-600 font-medium">Loading Settings...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardLayoutWithSidebar>
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center space-x-3">
            <Settings className="h-6 w-6 text-therapy-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-1">
                Manage your account, privacy, notifications, and preferences
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
            <TabsTrigger value="account" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
            
            <TabsTrigger value="general" className="flex items-center space-x-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">General</span>
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
          </TabsList>

          <TabsContent value="account" className="space-y-6">
            <div className="bg-white rounded-lg border border-therapy-100 p-1">
              <EnhancedAccountSettings />
            </div>
          </TabsContent>

          <TabsContent value="general" className="space-y-6">
            <div className="bg-white rounded-lg border border-therapy-100 p-6">
              <GeneralSettings />
            </div>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <div className="bg-white rounded-lg border border-therapy-100 p-6">
              <PrivacySettings />
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="bg-white rounded-lg border border-therapy-100 p-6">
              <SimpleNotificationSettings />
            </div>
          </TabsContent>

          <TabsContent value="voice" className="space-y-6">
            <div className="bg-white rounded-lg border border-therapy-100 p-6">
              <div className="text-center py-8">
                <Mic className="h-12 w-12 mx-auto mb-4 text-therapy-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Voice Settings</h3>
                <p className="text-gray-600 mb-4">
                  Configure your voice preferences for therapy sessions
                </p>
                <p className="text-sm text-muted-foreground">
                  Voice settings will be available when you start a therapy session with voice features enabled.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayoutWithSidebar>
  );
};

export default ComprehensiveSettingsPage;