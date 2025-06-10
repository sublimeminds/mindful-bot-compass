
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Bug, Activity, FileText, Shield } from 'lucide-react';
import AdminNotificationDebugPanel from './AdminNotificationDebugPanel';
import SystemHealthMonitor from './SystemHealthMonitor';
import ConfigurationManager from './ConfigurationManager';
import AuditLogViewer from './AuditLogViewer';

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

      {/* System Management Tabs */}
      <Tabs defaultValue="debug" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="debug" className="data-[state=active]:bg-orange-600">
            <Bug className="h-4 w-4 mr-2" />
            Debug Panel
          </TabsTrigger>
          <TabsTrigger value="health" className="data-[state=active]:bg-orange-600">
            <Activity className="h-4 w-4 mr-2" />
            System Health
          </TabsTrigger>
          <TabsTrigger value="config" className="data-[state=active]:bg-orange-600">
            <Settings className="h-4 w-4 mr-2" />
            Configuration
          </TabsTrigger>
          <TabsTrigger value="audit" className="data-[state=active]:bg-orange-600">
            <Shield className="h-4 w-4 mr-2" />
            Audit Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="debug">
          <AdminNotificationDebugPanel />
        </TabsContent>

        <TabsContent value="health">
          <SystemHealthMonitor />
        </TabsContent>

        <TabsContent value="config">
          <ConfigurationManager />
        </TabsContent>

        <TabsContent value="audit">
          <AuditLogViewer />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSystemManagement;
