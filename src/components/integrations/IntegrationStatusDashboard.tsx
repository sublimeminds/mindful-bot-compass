
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  RefreshCw,
  Activity,
  Clock,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface IntegrationStatus {
  id: string;
  name: string;
  status: 'connected' | 'error' | 'disconnected' | 'testing';
  lastChecked: Date;
  responseTime: number;
  uptime: number;
  errorCount: number;
  successRate: number;
}

const IntegrationStatusDashboard = () => {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadIntegrationStatus();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(loadIntegrationStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadIntegrationStatus = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockStatuses: IntegrationStatus[] = [
        {
          id: 'whatsapp',
          name: 'WhatsApp Business',
          status: 'connected',
          lastChecked: new Date(),
          responseTime: 120,
          uptime: 99.8,
          errorCount: 2,
          successRate: 98.5
        },
        {
          id: 'stripe',
          name: 'Stripe Payments',
          status: 'connected',
          lastChecked: new Date(Date.now() - 60000),
          responseTime: 85,
          uptime: 100,
          errorCount: 0,
          successRate: 100
        },
        {
          id: 'calendar',
          name: 'Google Calendar',
          status: 'error',
          lastChecked: new Date(Date.now() - 300000),
          responseTime: 0,
          uptime: 95.2,
          errorCount: 12,
          successRate: 87.3
        },
        {
          id: 'email',
          name: 'Email Service',
          status: 'connected',
          lastChecked: new Date(Date.now() - 30000),
          responseTime: 200,
          uptime: 99.5,
          errorCount: 1,
          successRate: 99.2
        }
      ];
      
      setIntegrations(mockStatuses);
    } catch (error) {
      console.error('Failed to load integration status:', error);
      toast({
        title: "Error",
        description: "Failed to load integration status",
        variant: "destructive",
      });
    }
  };

  const refreshStatus = async () => {
    setIsRefreshing(true);
    await loadIntegrationStatus();
    setIsRefreshing(false);
    toast({
      title: "Status Updated",
      description: "Integration status has been refreshed",
    });
  };

  const testIntegration = async (integrationId: string) => {
    setIntegrations(prev => prev.map(int => 
      int.id === integrationId 
        ? { ...int, status: 'testing' as const }
        : int
    ));

    try {
      // Simulate test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const isSuccess = Math.random() > 0.3; // 70% success rate
      
      setIntegrations(prev => prev.map(int => 
        int.id === integrationId 
          ? { 
              ...int, 
              status: isSuccess ? 'connected' as const : 'error' as const,
              lastChecked: new Date(),
              responseTime: isSuccess ? Math.floor(Math.random() * 200) + 50 : 0
            }
          : int
      ));

      toast({
        title: isSuccess ? "Test Successful" : "Test Failed",
        description: isSuccess 
          ? "Integration is working correctly" 
          : "Integration test failed. Please check configuration.",
        variant: isSuccess ? "default" : "destructive"
      });
    } catch (error) {
      setIntegrations(prev => prev.map(int => 
        int.id === integrationId 
          ? { ...int, status: 'error' as const }
          : int
      ));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'testing':
        return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'testing':
        return <Badge className="bg-blue-100 text-blue-800">Testing</Badge>;
      default:
        return <Badge variant="outline">Disconnected</Badge>;
    }
  };

  const overallHealth = integrations.length > 0 
    ? integrations.filter(i => i.status === 'connected').length / integrations.length * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Overall Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-therapy-600" />
              <span>Integration Health Dashboard</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshStatus}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-therapy-600">{Math.round(overallHealth)}%</div>
              <p className="text-sm text-muted-foreground">Overall Health</p>
              <Progress value={overallHealth} className="h-2 mt-2" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {integrations.filter(i => i.status === 'connected').length}
              </div>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {integrations.filter(i => i.status === 'error').length}
              </div>
              <p className="text-sm text-muted-foreground">Errors</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {integrations.length}
              </div>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integration Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((integration) => (
          <Card key={integration.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(integration.status)}
                  <span>{integration.name}</span>
                </div>
                {getStatusBadge(integration.status)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Response Time</span>
                  </div>
                  <div className="font-medium">{integration.responseTime}ms</div>
                </div>
                <div>
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <Zap className="h-3 w-3" />
                    <span>Success Rate</span>
                  </div>
                  <div className="font-medium">{integration.successRate}%</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Uptime</div>
                  <div className="font-medium">{integration.uptime}%</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Errors (24h)</div>
                  <div className="font-medium">{integration.errorCount}</div>
                </div>
              </div>

              {/* Last Checked */}
              <div className="text-xs text-muted-foreground">
                Last checked: {integration.lastChecked.toLocaleString()}
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => testIntegration(integration.id)}
                  disabled={integration.status === 'testing'}
                >
                  {integration.status === 'testing' ? 'Testing...' : 'Test Connection'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default IntegrationStatusDashboard;
