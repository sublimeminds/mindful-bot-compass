import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { User, Bell, Shield, Palette } from 'lucide-react';
import UserProfile from '@/components/profile/UserProfile';
import SecurityDashboard from '@/components/profile/SecurityDashboard';
import ComprehensiveNotificationSettings from '@/components/notifications/ComprehensiveNotificationSettings';

const SettingsPage = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-6">Settings</h1>

      <Tabs defaultValue="profile" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <UserProfile />
        </TabsContent>
        <TabsContent value="security">
          <SecurityDashboard />
        </TabsContent>
        <TabsContent value="notifications">
          <ComprehensiveNotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
