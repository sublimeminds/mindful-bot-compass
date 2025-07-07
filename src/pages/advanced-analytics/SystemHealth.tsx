import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Server, Database, CheckCircle } from 'lucide-react';

const SystemHealth = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">System Health</h1>
          <p className="text-muted-foreground mt-1">Real-time monitoring and performance insights</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Activity className="h-6 w-6 mx-auto text-therapy-500 mb-2" />
              <p className="text-sm text-muted-foreground">API Response</p>
              <p className="text-2xl font-bold">156ms</p>
              <Badge className="bg-green-100 text-green-800">Good</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Server className="h-6 w-6 mx-auto text-calm-500 mb-2" />
              <p className="text-sm text-muted-foreground">CPU Usage</p>
              <p className="text-2xl font-bold">34%</p>
              <Badge className="bg-green-100 text-green-800">Normal</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Database className="h-6 w-6 mx-auto text-focus-500 mb-2" />
              <p className="text-sm text-muted-foreground">Database</p>
              <p className="text-2xl font-bold">89%</p>
              <Badge className="bg-green-100 text-green-800">Optimal</Badge>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
              All Systems Operational
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">System monitoring dashboard with real-time health metrics.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SystemHealth;