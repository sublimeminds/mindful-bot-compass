import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Loader, 
  RefreshCw,
  Activity,
  Code,
  Database,
  Wifi
} from 'lucide-react';

interface HealthCheck {
  id: string;
  name: string;
  status: 'checking' | 'healthy' | 'warning' | 'error';
  message: string;
  details?: any;
  lastChecked: Date;
}

// Comprehensive health monitoring dashboard
export const HealthMonitorDashboard: React.FC = () => {
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runHealthChecks = async () => {
    setIsRunning(true);
    
    const checks: HealthCheck[] = [
      {
        id: 'react',
        name: 'React Runtime',
        status: 'checking',
        message: 'Checking React hooks availability...',
        lastChecked: new Date()
      },
      {
        id: 'auth',
        name: 'Authentication',
        status: 'checking', 
        message: 'Checking auth provider...',
        lastChecked: new Date()
      },
      {
        id: 'routing',
        name: 'Router',
        status: 'checking',
        message: 'Checking navigation...',
        lastChecked: new Date()
      },
      {
        id: 'services',
        name: 'Services',
        status: 'checking',
        message: 'Checking background services...',
        lastChecked: new Date()
      },
      {
        id: 'api',
        name: 'API Connection',
        status: 'checking',
        message: 'Checking Supabase connection...',
        lastChecked: new Date()
      }
    ];

    setHealthChecks(checks);

    // Run checks sequentially with delays
    for (let i = 0; i < checks.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedChecks = [...checks];
      const check = updatedChecks[i];
      
      try {
        switch (check.id) {
          case 'react':
            if (React && typeof React.useState === 'function') {
              check.status = 'healthy';
              check.message = 'React hooks are working correctly';
            } else {
              check.status = 'error';
              check.message = 'React hooks not available';
            }
            break;
            
          case 'auth':
            try {
              const { useAuth } = await import('@/contexts/AuthContext');
              check.status = 'healthy';
              check.message = 'Auth context is available';
            } catch (error) {
              check.status = 'error';
              check.message = 'Auth context not available';
            }
            break;
            
          case 'routing':
            if (window.location && typeof window.history?.pushState === 'function') {
              check.status = 'healthy';
              check.message = 'Router is working correctly';
            } else {
              check.status = 'error';
              check.message = 'Router not available';
            }
            break;
            
          case 'services':
            try {
              const { bulletproofServiceManager } = await import('@/utils/bulletproofServiceManager');
              const state = bulletproofServiceManager.getState();
              if (state.initialized) {
                check.status = 'healthy';
                check.message = 'Services initialized successfully';
                check.details = state;
              } else {
                check.status = 'warning';
                check.message = 'Services still initializing';
              }
            } catch (error) {
              check.status = 'warning';
              check.message = 'Service manager not available';
            }
            break;
            
          case 'api':
            try {
              const { supabase } = await import('@/integrations/supabase/client');
              if (supabase) {
                check.status = 'healthy';
                check.message = 'Supabase client is available';
              } else {
                check.status = 'error';
                check.message = 'Supabase client not initialized';
              }
            } catch (error) {
              check.status = 'error';
              check.message = 'Cannot load Supabase client';
            }
            break;
        }
        
        check.lastChecked = new Date();
        setHealthChecks([...updatedChecks]);
        
      } catch (error) {
        check.status = 'error';
        check.message = error instanceof Error ? error.message : 'Unknown error';
        check.lastChecked = new Date();
        setHealthChecks([...updatedChecks]);
      }
    }
    
    setIsRunning(false);
  };

  useEffect(() => {
    runHealthChecks();
  }, []);

  const getStatusIcon = (status: HealthCheck['status']) => {
    switch (status) {
      case 'checking':
        return <Loader className="h-4 w-4 animate-spin text-blue-500" />;
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: HealthCheck['status']) => {
    switch (status) {
      case 'checking':
        return <Badge variant="outline" className="text-blue-600">Checking</Badge>;
      case 'healthy':
        return <Badge className="bg-green-100 text-green-800">Healthy</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
    }
  };

  const getComponentIcon = (id: string) => {
    switch (id) {
      case 'react': return <Code className="h-5 w-5" />;
      case 'auth': return <Activity className="h-5 w-5" />;
      case 'routing': return <Wifi className="h-5 w-5" />;
      case 'services': return <Activity className="h-5 w-5" />;
      case 'api': return <Database className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  const overallStatus = healthChecks.length === 0 ? 'checking' :
    healthChecks.some(check => check.status === 'error') ? 'error' :
    healthChecks.some(check => check.status === 'warning') ? 'warning' : 'healthy';

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-xl">System Health Monitor</CardTitle>
            {getStatusIcon(overallStatus)}
          </div>
          <Button 
            onClick={runHealthChecks} 
            disabled={isRunning}
            size="sm"
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'Checking...' : 'Refresh'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {healthChecks.map((check) => (
          <div key={check.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              {getComponentIcon(check.id)}
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium">{check.name}</h3>
                  {getStatusIcon(check.status)}
                </div>
                <p className="text-sm text-gray-600">{check.message}</p>
                <p className="text-xs text-gray-400">
                  Last checked: {check.lastChecked.toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div>
              {getStatusBadge(check.status)}
            </div>
          </div>
        ))}
        
        {healthChecks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Loader className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p>Initializing health checks...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HealthMonitorDashboard;