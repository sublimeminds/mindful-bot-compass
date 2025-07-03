import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw,
  Activity,
  Code,
  Database,
  Globe
} from 'lucide-react';

interface HealthStatus {
  component: string;
  status: 'healthy' | 'warning' | 'error';
  message: string;
  details?: any;
}

// System health display for debugging
export const SystemHealthDisplay: React.FC = () => {
  const [healthChecks, setHealthChecks] = useState<HealthStatus[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runHealthChecks = async () => {
    setIsRunning(true);
    const checks: HealthStatus[] = [];

    // Check React
    try {
      if (React && typeof React.useState === 'function') {
        checks.push({
          component: 'React',
          status: 'healthy',
          message: 'React hooks are available and working'
        });
      } else {
        checks.push({
          component: 'React',
          status: 'error',
          message: 'React hooks not available'
        });
      }
    } catch (error) {
      checks.push({
        component: 'React',
        status: 'error',
        message: `React error: ${error instanceof Error ? error.message : 'Unknown'}`
      });
    }

    // Check Auth Context
    try {
      const { useAuth } = await import('@/contexts/AuthContext');
      const authHook = useAuth();
      checks.push({
        component: 'Auth',
        status: 'healthy',
        message: 'Auth context is available',
        details: { user: authHook.user ? 'Authenticated' : 'Not authenticated' }
      });
    } catch (error) {
      checks.push({
        component: 'Auth',
        status: 'error',
        message: `Auth context error: ${error instanceof Error ? error.message : 'Unknown'}`
      });
    }

    // Check i18n
    try {
      const i18n = await import('@/i18n');
      if (i18n.default && typeof i18n.default.t === 'function') {
        checks.push({
          component: 'i18n',
          status: 'healthy',
          message: 'i18n is initialized and working'
        });
      } else {
        checks.push({
          component: 'i18n',
          status: 'warning',
          message: 'i18n loaded but translation function not available'
        });
      }
    } catch (error) {
      checks.push({
        component: 'i18n',
        status: 'error',
        message: `i18n error: ${error instanceof Error ? error.message : 'Unknown'}`
      });
    }

    // Check Supabase
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      if (supabase && supabase.auth) {
        checks.push({
          component: 'Supabase',
          status: 'healthy',
          message: 'Supabase client is available'
        });
      } else {
        checks.push({
          component: 'Supabase',
          status: 'error',
          message: 'Supabase client not properly initialized'
        });
      }
    } catch (error) {
      checks.push({
        component: 'Supabase',
        status: 'error',
        message: `Supabase error: ${error instanceof Error ? error.message : 'Unknown'}`
      });
    }

    // Check Router
    try {
      if (window.location && typeof window.history?.pushState === 'function') {
        checks.push({
          component: 'Router',
          status: 'healthy',
          message: 'Router functionality is available'
        });
      } else {
        checks.push({
          component: 'Router',
          status: 'error',
          message: 'Router not available'
        });
      }
    } catch (error) {
      checks.push({
        component: 'Router',
        status: 'error',
        message: `Router error: ${error instanceof Error ? error.message : 'Unknown'}`
      });
    }

    // Check Service Manager
    try {
      const { bulletproofServiceManager } = await import('@/utils/bulletproofServiceManager');
      const state = bulletproofServiceManager.getState();
      if (state.initialized) {
        checks.push({
          component: 'Services',
          status: 'healthy',
          message: 'Service manager is initialized',
          details: state
        });
      } else {
        checks.push({
          component: 'Services',
          status: 'warning',
          message: 'Service manager still initializing'
        });
      }
    } catch (error) {
      checks.push({
        component: 'Services',
        status: 'warning',
        message: `Service manager error: ${error instanceof Error ? error.message : 'Unknown'}`
      });
    }

    setHealthChecks(checks);
    setIsRunning(false);
  };

  useEffect(() => {
    runHealthChecks();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getComponentIcon = (component: string) => {
    switch (component) {
      case 'React': return <Code className="h-5 w-5" />;
      case 'Auth': return <Activity className="h-5 w-5" />;
      case 'i18n': return <Globe className="h-5 w-5" />;
      case 'Supabase': return <Database className="h-5 w-5" />;
      case 'Router': return <Activity className="h-5 w-5" />;
      case 'Services': return <Activity className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-100 text-green-800">Healthy</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
    }
  };

  const overallStatus = healthChecks.length === 0 ? 'warning' :
    healthChecks.some(check => check.status === 'error') ? 'error' :
    healthChecks.some(check => check.status === 'warning') ? 'warning' : 'healthy';

  return (
    <Card className="w-full max-w-4xl mx-auto mb-8">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-xl">System Health Status</CardTitle>
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
        {healthChecks.map((check, index) => (
          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              {getComponentIcon(check.component)}
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium">{check.component}</h3>
                  {getStatusIcon(check.status)}
                </div>
                <p className="text-sm text-gray-600">{check.message}</p>
                {check.details && (
                  <pre className="text-xs text-gray-400 mt-1 max-w-md overflow-hidden">
                    {JSON.stringify(check.details, null, 2).substring(0, 200)}
                  </pre>
                )}
              </div>
            </div>
            <div>
              {getStatusBadge(check.status)}
            </div>
          </div>
        ))}
        
        {healthChecks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Activity className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p>Running health checks...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemHealthDisplay;