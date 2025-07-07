import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

// Health check component for production monitoring
const HealthCheck = () => {
  const [healthStatus, setHealthStatus] = React.useState({
    status: 'checking',
    timestamp: new Date().toISOString(),
    services: {
      database: 'unknown',
      authentication: 'unknown',
      storage: 'unknown'
    }
  });

  React.useEffect(() => {
    const checkHealth = async () => {
      try {
        // Basic health checks
        const checks = {
          database: await checkDatabase(),
          authentication: await checkAuthentication(),
          storage: await checkStorage()
        };

        const allHealthy = Object.values(checks).every(status => status === 'healthy');
        
        setHealthStatus({
          status: allHealthy ? 'healthy' : 'degraded',
          timestamp: new Date().toISOString(),
          services: checks
        });
      } catch (error) {
        setHealthStatus({
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          services: {
            database: 'error',
            authentication: 'error',
            storage: 'error'
          }
        });
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const checkDatabase = async (): Promise<'healthy' | 'unhealthy' | 'error'> => {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { error } = await supabase.from('profiles').select('id').limit(1);
      return error ? 'unhealthy' : 'healthy';
    } catch {
      return 'error';
    }
  };

  const checkAuthentication = async (): Promise<'healthy' | 'unhealthy' | 'error'> => {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { error } = await supabase.auth.getSession();
      return error ? 'unhealthy' : 'healthy';
    } catch {
      return 'error';
    }
  };

  const checkStorage = async (): Promise<'healthy' | 'unhealthy' | 'error'> => {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { error } = await supabase.storage.listBuckets();
      return error ? 'unhealthy' : 'healthy';
    } catch {
      return 'error';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'checking':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-100 text-green-800">Healthy</Badge>;
      case 'checking':
        return <Badge className="bg-yellow-100 text-yellow-800">Checking</Badge>;
      case 'degraded':
        return <Badge className="bg-yellow-100 text-yellow-800">Degraded</Badge>;
      default:
        return <Badge className="bg-red-100 text-red-800">Unhealthy</Badge>;
    }
  };

  // This component is only shown in development or to admins
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>System Health</span>
          {getStatusBadge(healthStatus.status)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm">Database</span>
          <div className="flex items-center space-x-2">
            {getStatusIcon(healthStatus.services.database)}
            <span className="text-sm capitalize">{healthStatus.services.database}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Authentication</span>
          <div className="flex items-center space-x-2">
            {getStatusIcon(healthStatus.services.authentication)}
            <span className="text-sm capitalize">{healthStatus.services.authentication}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Storage</span>
          <div className="flex items-center space-x-2">
            {getStatusIcon(healthStatus.services.storage)}
            <span className="text-sm capitalize">{healthStatus.services.storage}</span>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          Last checked: {new Date(healthStatus.timestamp).toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthCheck;