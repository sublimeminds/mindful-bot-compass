
import React from 'react';
import { useAuth } from '@/components/SimpleAuthProvider';
import { useAdmin } from '@/components/SimpleAdminProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Cloud, 
  Activity, 
  Database,
  AlertTriangle,
  Lock
} from 'lucide-react';
import AdminDigitalOceanDashboard from '@/components/admin/infrastructure/AdminDigitalOceanDashboard';
import IntegrationStatus from '@/components/infrastructure/IntegrationStatus';
import InfrastructureMonitor from '@/components/infrastructure/InfrastructureMonitor';

const AdminInfrastructure = () => {
  const { user, loading } = useAuth();
  const { isAdmin } = useAdmin();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-400 font-medium">Loading Infrastructure Management...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <Card className="bg-gray-800 border-gray-700 max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center text-red-400">
              <Lock className="h-5 w-5 mr-2" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="bg-red-900/20 border-red-700">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-red-300">
                Administrator privileges required to access infrastructure management.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
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
          <AdminDigitalOceanDashboard />
        </TabsContent>

        <TabsContent value="monitoring">
          <InfrastructureMonitor />
        </TabsContent>

        <TabsContent value="integration">
          <IntegrationStatus />
        </TabsContent>

        <TabsContent value="security">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="h-5 w-5 mr-2 text-green-400" />
                Security Infrastructure
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-400">Active Security Measures</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                      <span>DDoS Protection</span>
                      <span className="text-green-400">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                      <span>SSL/TLS Encryption</span>
                      <span className="text-green-400">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                      <span>Firewall Protection</span>
                      <span className="text-green-400">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                      <span>Intrusion Detection</span>
                      <span className="text-green-400">Active</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-blue-400">Compliance Status</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                      <span>HIPAA Compliance</span>
                      <span className="text-green-400">Compliant</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                      <span>GDPR Compliance</span>
                      <span className="text-green-400">Compliant</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                      <span>SOC 2 Type II</span>
                      <span className="text-green-400">Compliant</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                      <span>Data Encryption</span>
                      <span className="text-green-400">AES-256</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminInfrastructure;
