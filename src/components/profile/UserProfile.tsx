
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, CreditCard, Bell, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import RealBillingHistory from '@/components/subscription/RealBillingHistory';
import EnhancedAccountSettings from './EnhancedAccountSettings';
import ComprehensiveNotificationSettings from '@/components/notifications/ComprehensiveNotificationSettings';
import PrivacySettings from './PrivacySettings';

const UserProfile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('account');

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* Profile Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-therapy-500 to-calm-500 text-white font-bold text-2xl flex items-center justify-center">
                {user?.email?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <CardTitle className="text-2xl">Your Profile</CardTitle>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="account" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Account</span>
            </TabsTrigger>
            <TabsTrigger value="subscription" className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span>Billing</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Privacy</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-6">
            <EnhancedAccountSettings />
          </TabsContent>

          <TabsContent value="subscription" className="space-y-6">
            <RealBillingHistory />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <ComprehensiveNotificationSettings />
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <PrivacySettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;
