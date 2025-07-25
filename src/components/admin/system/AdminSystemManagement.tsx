
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Bug, Activity, FileText, Shield } from 'lucide-react';
import AdminNotificationDebugPanel from './AdminNotificationDebugPanel';
import SystemHealthMonitor from './SystemHealthMonitor';
import ConfigurationManager from './ConfigurationManager';
import AuditLogViewer from './AuditLogViewer';
import SystemAlertsNotification from './SystemAlertsNotification';

const AdminSystemManagement = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Settings className="h-6 w-6 text-orange-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">System Management</h1>
          <p className="text-gray-400">Monitor system health, debug issues, and manage configurations</p>
        </div>
      </div>

      {/* System Alerts Notification */}
      <SystemAlertsNotification />

      {/* System Management Tabs */}
      <Tabs defaultValue="health" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-gray-800">
          <TabsTrigger value="health" className="data-[state=active]:bg-orange-600">
            <Activity className="h-4 w-4 mr-2" />
            System Health
          </TabsTrigger>
          <TabsTrigger value="debug" className="data-[state=active]:bg-orange-600">
            <Bug className="h-4 w-4 mr-2" />
            Debug Panel
          </TabsTrigger>
          <TabsTrigger value="config" className="data-[state=active]:bg-orange-600">
            <Settings className="h-4 w-4 mr-2" />
            Configuration
          </TabsTrigger>
          <TabsTrigger value="audit" className="data-[state=active]:bg-orange-600">
            <Shield className="h-4 w-4 mr-2" />
            Audit Logs
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-orange-600">
            <Bug className="h-4 w-4 mr-2" />
            Notifications Debug
          </TabsTrigger>
        </TabsList>

        <TabsContent value="health">
          <SystemHealthMonitor />
        </TabsContent>

        <TabsContent value="debug">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">System Debug Tools</CardTitle>
            </CardHeader>
            <CardContent className="text-white">
              <p>General system debugging tools and utilities will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config">
          <ConfigurationManager />
        </TabsContent>

        <TabsContent value="audit">
          <AuditLogViewer />
        </TabsContent>

        <TabsContent value="notifications">
          <AdminNotificationDebugPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSystemManagement;
