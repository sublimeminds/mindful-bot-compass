
import React from 'react';
import { useAuth } from '@/components/SimpleAuthProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AccountSettings from '@/components/profile/AccountSettings';
import AdvancedNotificationSettings from '@/components/notifications/AdvancedNotificationSettings';
import SecurityDashboard from '@/components/profile/SecurityDashboard';
import SubscriptionManager from '@/components/subscription/SubscriptionManager';

const SettingsPage = () => {
  const { user, loading } = useAuth();

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
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[80vh] bg-gradient-to-br from-therapy-50 to-calm-50">
          <div className="text-center max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold text-therapy-900 mb-4">Access Denied</h1>
            <p className="text-therapy-600 mb-6">Please sign in to access settings.</p>
            <a 
              href="/auth" 
              className="inline-block bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              Sign In
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="bg-gradient-to-br from-therapy-50 to-calm-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-therapy-900 mb-8">Settings</h1>
          
          <Tabs defaultValue="account" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <AccountSettings />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="subscription">
              <Card>
                <CardHeader>
                  <CardTitle>Subscription & Billing</CardTitle>
                </CardHeader>
                <CardContent>
                  <SubscriptionManager />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <AdvancedNotificationSettings />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security & Privacy</CardTitle>
                </CardHeader>
                <CardContent>
                  <SecurityDashboard />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SettingsPage;
