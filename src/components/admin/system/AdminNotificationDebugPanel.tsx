
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Bell, Bug, Database, Clock } from 'lucide-react';
import NotificationDebugPanel from '@/components/NotificationDebugPanel';
import NotificationTemplateManager from '@/components/notifications/NotificationTemplateManager';

const AdminNotificationDebugPanel = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Settings className="h-6 w-6 text-orange-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Notification Management</h1>
          <p className="text-gray-400">Debug, test, and manage the notification system</p>
        </div>
      </div>

      <Tabs defaultValue="debug" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800">
          <TabsTrigger value="debug" className="data-[state=active]:bg-orange-600">
            <Bug className="h-4 w-4 mr-2" />
            Debug & Testing
          </TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-orange-600">
            <Database className="h-4 w-4 mr-2" />
            Template Management
          </TabsTrigger>
          <TabsTrigger value="system" className="data-[state=active]:bg-orange-600">
            <Clock className="h-4 w-4 mr-2" />
            System Status
          </TabsTrigger>
        </TabsList>

        <TabsContent value="debug">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Bell className="h-5 w-5 mr-2 text-orange-400" />
                Notification Debug Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white">
              <NotificationDebugPanel />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Database className="h-5 w-5 mr-2 text-orange-400" />
                Global Template Management
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white">
              <NotificationTemplateManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Clock className="h-5 w-5 mr-2 text-orange-400" />
                System Health & Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-medium text-orange-400 mb-2">Notification Queue</h3>
                    <p className="text-sm text-gray-300">Monitor pending notifications</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-medium text-orange-400 mb-2">Delivery Status</h3>
                    <p className="text-sm text-gray-300">Track notification delivery rates</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-medium text-orange-400 mb-2">Template Usage</h3>
                    <p className="text-sm text-gray-300">Analyze template performance</p>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-medium text-orange-400 mb-2">Error Logs</h3>
                    <p className="text-sm text-gray-300">Review notification errors</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminNotificationDebugPanel;
