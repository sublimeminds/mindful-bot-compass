
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, History, Settings, BarChart3 } from 'lucide-react';
import SessionScheduler from './SessionScheduler';
import SessionHistory from './SessionHistory';

const SessionManager = () => {
  const [activeTab, setActiveTab] = useState('schedule');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-therapy-700 mb-2">Session Management</h1>
        <p className="text-gray-600">Schedule, track, and manage your therapy sessions</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="schedule" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Schedule Session</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center space-x-2">
            <History className="h-4 w-4" />
            <span>Session History</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-6">
          <SessionScheduler />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <SessionHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SessionManager;
