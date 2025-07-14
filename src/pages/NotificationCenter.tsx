import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import NotificationTester from '@/components/notifications/NotificationTester';
import NotificationAdminDashboard from '@/components/admin/NotificationAdminDashboard';
import { useRealTimeNotificationTriggers } from '@/hooks/useRealTimeNotificationTriggers';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const NotificationCenterPage = () => {
  const { user, loading } = useAuth();
  
  // Initialize real-time notification triggers
  useRealTimeNotificationTriggers();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-therapy-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold therapy-text-gradient mb-2">
            Notification Center
          </h1>
          <p className="text-gray-600">
            Intelligent notifications and analytics dashboard
          </p>
        </div>
        
        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="testing">Testing Tools</TabsTrigger>
            <TabsTrigger value="admin">Admin Dashboard</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <NotificationCenter />
              </div>
              <div>
                <NotificationTester />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="testing" className="space-y-6">
            <NotificationTester />
          </TabsContent>

          <TabsContent value="admin" className="space-y-6">
            <NotificationAdminDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NotificationCenterPage;