
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell } from 'lucide-react';

const NotificationTemplates = () => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Notification Templates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-gray-400">
          <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Notification template management coming soon...</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationTemplates;
