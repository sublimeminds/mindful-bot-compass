
import React from 'react';
import AdminProtection from '@/components/admin/AdminProtection';
import AdminErrorBoundary from '@/components/admin/AdminErrorBoundary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Cloud, 
  Activity, 
  Database
} from 'lucide-react';
import AdminDigitalOceanDashboard from '@/components/admin/infrastructure/AdminDigitalOceanDashboard';
import IntegrationStatus from '@/components/infrastructure/IntegrationStatus';
import InfrastructureMonitor from '@/components/infrastructure/InfrastructureMonitor';
import AdminSecurityDashboard from '@/components/admin/AdminSecurityDashboard';

const AdminInfrastructure = () => {
  return (
    <AdminProtection requiredPermission="manage_infrastructure">
      <AdminErrorBoundary>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-3">
            <Shield className="h-6 w-6 text-blue-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">Infrastructure Management</h1>
              <p className="text-gray-400">Manage cloud infrastructure, monitoring, and security systems</p>
            </div>
          </div>

          {/* Infrastructure Management Tabs */}
          <Tabs defaultValue="digitalocean" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800">
              <TabsTrigger value="digitalocean" className="data-[state=active]:bg-blue-600">
                <Cloud className="h-4 w-4 mr-2" />
                DigitalOcean
              </TabsTrigger>
              <TabsTrigger value="monitoring" className="data-[state=active]:bg-blue-600">
                <Activity className="h-4 w-4 mr-2" />
                Monitoring
              </TabsTrigger>
              <TabsTrigger value="integration" className="data-[state=active]:bg-blue-600">
                <Database className="h-4 w-4 mr-2" />
                Integration Status
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-blue-600">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="digitalocean">
              <AdminErrorBoundary>
                <AdminDigitalOceanDashboard />
              </AdminErrorBoundary>
            </TabsContent>

            <TabsContent value="monitoring">
              <AdminErrorBoundary>
                <InfrastructureMonitor />
              </AdminErrorBoundary>
            </TabsContent>

            <TabsContent value="integration">
              <AdminErrorBoundary>
                <IntegrationStatus />
              </AdminErrorBoundary>
            </TabsContent>

            <TabsContent value="security">
              <AdminErrorBoundary>
                <AdminSecurityDashboard />
              </AdminErrorBoundary>
            </TabsContent>
          </Tabs>
        </div>
      </AdminErrorBoundary>
    </AdminProtection>
  );
};

export default AdminInfrastructure;
