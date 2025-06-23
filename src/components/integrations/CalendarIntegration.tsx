
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ExternalLink, Settings } from 'lucide-react';

const CalendarIntegration = () => {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <CardTitle>Calendar Integration</CardTitle>
              <p className="text-sm text-therapy-600">
                Sync appointments and set automated reminders
              </p>
            </div>
          </div>
          <Badge variant={isConnected ? "default" : "outline"}>
            {isConnected ? 'Connected' : 'Available'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Google Calendar</span>
              </div>
              <p className="text-sm text-therapy-600 mb-3">
                Sync with your Google Calendar for seamless appointment management
              </p>
              <Button size="sm" disabled>
                <ExternalLink className="h-4 w-4 mr-2" />
                Coming Soon
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-4 w-4 text-purple-600" />
                <span className="font-medium">Outlook Calendar</span>
              </div>
              <p className="text-sm text-therapy-600 mb-3">
                Integration with Microsoft Outlook and Office 365
              </p>
              <Button size="sm" disabled>
                <ExternalLink className="h-4 w-4 mr-2" />
                Coming Soon
              </Button>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Planned Features</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Automatic appointment scheduling</li>
              <li>• Reminder notifications</li>
              <li>• Availability sync</li>
              <li>• Time zone handling</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarIntegration;
