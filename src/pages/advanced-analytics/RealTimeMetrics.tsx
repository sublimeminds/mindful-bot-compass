import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Users, MessageSquare, Zap } from 'lucide-react';

const RealTimeMetrics = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Real-Time Metrics</h1>
          <p className="text-muted-foreground mt-1">Live system performance and usage analytics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                  <p className="text-3xl font-bold">1,247</p>
                  <p className="text-sm text-green-600">+8%</p>
                </div>
                <Users className="h-8 w-8 text-therapy-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Sessions</p>
                  <p className="text-3xl font-bold">234</p>
                  <p className="text-sm text-green-600">+12%</p>
                </div>
                <Activity className="h-8 w-8 text-calm-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Messages/Min</p>
                  <p className="text-3xl font-bold">567</p>
                  <p className="text-sm text-green-600">+5%</p>
                </div>
                <MessageSquare className="h-8 w-8 text-focus-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">API Calls/Min</p>
                  <p className="text-3xl font-bold">1,234</p>
                  <p className="text-sm text-green-600">+3%</p>
                </div>
                <Zap className="h-8 w-8 text-energy-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Live System Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">Live data feed active</span>
            </div>
            <p className="text-muted-foreground">Real-time performance monitoring and analytics dashboard.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealTimeMetrics;