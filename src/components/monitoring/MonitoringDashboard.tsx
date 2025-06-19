
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RuntimeMonitor from './RuntimeMonitor';
import ErrorTracker from './ErrorTracker';
import NetworkMonitor from './NetworkMonitor';
import SystemHealthMonitor from '../system/SystemHealthMonitor';

const MonitoringDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Application Monitoring</h1>
        <p className="text-muted-foreground">
          Real-time monitoring and diagnostics for your application health
        </p>
      </div>

      <Tabs defaultValue="runtime" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="runtime">Runtime</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="runtime" className="space-y-6">
          <RuntimeMonitor />
        </TabsContent>

        <TabsContent value="errors" className="space-y-6">
          <ErrorTracker />
        </TabsContent>

        <TabsContent value="network" className="space-y-6">
          <NetworkMonitor />
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <SystemHealthMonitor />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MonitoringDashboard;
