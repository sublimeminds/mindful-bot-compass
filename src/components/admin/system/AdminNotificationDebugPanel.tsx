
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Bell } from 'lucide-react';

// Import the existing NotificationDebugPanel component
import NotificationDebugPanel from '@/components/NotificationDebugPanel';

const AdminNotificationDebugPanel = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Settings className="h-6 w-6 text-orange-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">Notification Debug Panel</h1>
          <p className="text-gray-400">Test and debug notification system functionality</p>
        </div>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Bell className="h-5 w-5 mr-2 text-orange-400" />
            Debug Tools
          </CardTitle>
        </CardHeader>
        <CardContent className="text-white">
          <NotificationDebugPanel />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminNotificationDebugPanel;
