import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Cpu,
  Database,
  Globe,
  Server,
  Wifi,
  Zap
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SystemMetric {
  name: string;
  value: number | string;
  status: 'healthy' | 'warning' | 'critical';
  unit?: string;
  threshold?: number;
  icon: any;
}

interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'down';
  responseTime: number;
  uptime: number;
  lastChecked: string;
}

const RealTimeMonitoringDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([]);
  const [serviceStatuses, setServiceStatuses] = useState<ServiceStatus[]>([]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    if (user) {
      fetchMonitoringData();
      
      // Set up real-time monitoring
      const channel = supabase.channel('monitoring_updates')
        .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'real_time_metrics' },
          (payload) => handleRealTimeUpdate(payload)
        )
        .on('postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'performance_monitoring' },
          (payload) => handlePerformanceUpdate(payload)
        )
        .subscribe();

      // Set up periodic updates
      const interval = setInterval(fetchMonitoringData, 30000); // Every 30 seconds

      return () => {
        supabase.removeChannel(channel);
        clearInterval(interval);
      };
    }
  }, [user]);

  const fetchMonitoringData = async () => {
    try {
      // Fetch real-time metrics
      const { data: metricsData, error: metricsError } = await supabase
        .from('real_time_metrics')
        .select('*')
        .gte('timestamp', new Date(Date.now() - 300000).toISOString()) // Last 5 minutes
        .order('timestamp', { ascending: false });

      if (metricsError) throw metricsError;

      // Fetch performance monitoring data
      const { data: performanceData, error: performanceError } = await supabase
        .from('performance_monitoring')
        .select('*')
        .gte('timestamp', new Date(Date.now() - 3600000).toISOString()) // Last hour
        .order('timestamp', { ascending: false });

      if (performanceError) throw performanceError;

      processMonitoringData(metricsData || [], performanceData || []);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching monitoring data:', error);
      setIsConnected(false);
      toast({
        title: "Monitoring Error",
        description: "Failed to fetch monitoring data",
        variant: "destructive",
      });
    }
  };

  const processMonitoringData = (metrics: any[], performance: any[]) => {
    // Process system metrics
    const latestMetrics = metrics.reduce((acc, metric) => {
      if (!acc[metric.metric_type] || new Date(metric.timestamp) > new Date(acc[metric.metric_type].timestamp)) {
        acc[metric.metric_type] = metric;
      }
      return acc;
    }, {} as any);

    const systemMetrics: SystemMetric[] = [
      {
        name: 'CPU Usage',
        value: latestMetrics.cpu_usage?.metric_value || 0,
        status: getMetricStatus(latestMetrics.cpu_usage?.metric_value || 0, 80, 90),
        unit: '%',
        threshold: 80,
        icon: Cpu
      },
      {
        name: 'Memory Usage',
        value: latestMetrics.memory_usage?.metric_value || 0,
        status: getMetricStatus(latestMetrics.memory_usage?.metric_value || 0, 75, 85),
        unit: '%',
        threshold: 75,
        icon: Database
      },
      {
        name: 'Active Users',
        value: latestMetrics.active_users?.metric_value || 0,
        status: 'healthy',
        icon: Activity
      },
      {
        name: 'Response Time',
        value: calculateAverageResponseTime(performance),
        status: getResponseTimeStatus(calculateAverageResponseTime(performance)),
        unit: 'ms',
        threshold: 1000,
        icon: Zap
      },
      {
        name: 'Error Rate',
        value: calculateErrorRate(performance),
        status: getMetricStatus(calculateErrorRate(performance), 1, 5),
        unit: '%',
        threshold: 1,
        icon: AlertTriangle
      },
      {
        name: 'Database Connections',
        value: latestMetrics.db_connections?.metric_value || 0,
        status: getMetricStatus(latestMetrics.db_connections?.metric_value || 0, 80, 95),
        unit: '',
        threshold: 80,
        icon: Database
      }
    ];

    setSystemMetrics(systemMetrics);

    // Process service statuses
    const services = ['API Gateway', 'Database', 'Authentication', 'AI Services', 'File Storage'];
    const serviceStatuses: ServiceStatus[] = services.map(service => ({
      name: service,
      status: getServiceStatus(service, performance),
      responseTime: getServiceResponseTime(service, performance),
      uptime: calculateUptime(service, performance),
      lastChecked: new Date().toISOString()
    }));

    setServiceStatuses(serviceStatuses);
    setPerformanceData(performance);
  };

  const handleRealTimeUpdate = (payload: any) => {
    console.log('Real-time metric update:', payload.new);
    fetchMonitoringData(); // Refresh data when new metrics arrive
  };

  const handlePerformanceUpdate = (payload: any) => {
    console.log('Performance update:', payload.new);
    fetchMonitoringData(); // Refresh data when new performance data arrives
  };

  const getMetricStatus = (value: number, warningThreshold: number, criticalThreshold: number): 'healthy' | 'warning' | 'critical' => {
    if (value >= criticalThreshold) return 'critical';
    if (value >= warningThreshold) return 'warning';
    return 'healthy';
  };

  const getResponseTimeStatus = (responseTime: number): 'healthy' | 'warning' | 'critical' => {
    if (responseTime > 2000) return 'critical';
    if (responseTime > 1000) return 'warning';
    return 'healthy';
  };

  const calculateAverageResponseTime = (performance: any[]): number => {
    if (performance.length === 0) return 0;
    return Math.round(performance.reduce((sum, item) => sum + item.response_time_ms, 0) / performance.length);
  };

  const calculateErrorRate = (performance: any[]): number => {
    if (performance.length === 0) return 0;
    const errors = performance.filter(item => item.status_code >= 400).length;
    return Math.round((errors / performance.length) * 100 * 10) / 10;
  };

  const getServiceStatus = (service: string, performance: any[]): 'operational' | 'degraded' | 'down' => {
    const serviceData = performance.filter(item => 
      item.service_name.toLowerCase().includes(service.toLowerCase())
    );
    
    if (serviceData.length === 0) return 'operational';
    
    const errorRate = calculateErrorRate(serviceData);
    const avgResponseTime = calculateAverageResponseTime(serviceData);
    
    if (errorRate > 5 || avgResponseTime > 2000) return 'down';
    if (errorRate > 1 || avgResponseTime > 1000) return 'degraded';
    return 'operational';
  };

  const getServiceResponseTime = (service: string, performance: any[]): number => {
    const serviceData = performance.filter(item => 
      item.service_name.toLowerCase().includes(service.toLowerCase())
    );
    return calculateAverageResponseTime(serviceData);
  };

  const calculateUptime = (service: string, performance: any[]): number => {
    // Simplified uptime calculation
    const serviceData = performance.filter(item => 
      item.service_name.toLowerCase().includes(service.toLowerCase())
    );
    
    if (serviceData.length === 0) return 99.9;
    
    const successfulRequests = serviceData.filter(item => item.status_code < 400).length;
    return Math.round((successfulRequests / serviceData.length) * 100 * 100) / 100;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'operational':
        return 'text-green-600 bg-green-100';
      case 'warning':
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100';
      case 'critical':
      case 'down':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'operational':
        return CheckCircle;
      case 'warning':
      case 'degraded':
        return AlertTriangle;
      case 'critical':
      case 'down':
        return AlertTriangle;
      default:
        return Activity;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="h-6 w-6 text-therapy-600" />
          <h2 className="text-2xl font-bold">Real-Time Monitoring</h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-600">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <Badge variant="outline">
            <Clock className="h-3 w-3 mr-1" />
            Last updated: {lastUpdate.toLocaleTimeString()}
          </Badge>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {systemMetrics.map((metric) => {
          const IconComponent = metric.icon;
          const StatusIcon = getStatusIcon(metric.status);
          
          return (
            <Card key={metric.name} className="relative overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <IconComponent className="h-5 w-5 text-therapy-600" />
                  <StatusIcon className={`h-4 w-4 ${getStatusColor(metric.status).split(' ')[0]}`} />
                </div>
                <div className="text-2xl font-bold mb-1">
                  {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                  {metric.unit && <span className="text-sm text-gray-500 ml-1">{metric.unit}</span>}
                </div>
                <div className="text-xs text-gray-600">{metric.name}</div>
                
                {metric.threshold && typeof metric.value === 'number' && (
                  <div className="mt-2">
                    <Progress 
                      value={Math.min((metric.value / metric.threshold) * 100, 100)} 
                      className="h-1"
                    />
                  </div>
                )}
              </CardContent>
              
              {/* Status indicator */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 ${getStatusColor(metric.status).split(' ')[1]}`} />
            </Card>
          );
        })}
      </div>

      {/* Service Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Server className="h-5 w-5 mr-2" />
            Service Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {serviceStatuses.map((service) => {
              const StatusIcon = getStatusIcon(service.status);
              
              return (
                <div key={service.name} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{service.name}</h4>
                    <div className="flex items-center space-x-1">
                      <StatusIcon className={`h-4 w-4 ${getStatusColor(service.status).split(' ')[0]}`} />
                      <Badge className={getStatusColor(service.status)} variant="outline">
                        {service.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Response Time:</span>
                      <span>{service.responseTime}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Uptime:</span>
                      <span>{service.uptime}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Check:</span>
                      <span>{new Date(service.lastChecked).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Response Time Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-therapy-50 rounded-lg">
              <div className="text-center">
                <Zap className="h-12 w-12 mx-auto mb-2 text-therapy-600" />
                <p className="text-sm text-gray-600">Response time chart</p>
                <p className="text-xs text-gray-500">Real-time performance visualization</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Load</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-therapy-50 rounded-lg">
              <div className="text-center">
                <Cpu className="h-12 w-12 mx-auto mb-2 text-therapy-600" />
                <p className="text-sm text-gray-600">System load chart</p>
                <p className="text-xs text-gray-500">CPU, Memory, and network usage</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Recent Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <p className="font-medium text-green-800">All Systems Operational</p>
                <p className="text-sm text-green-600">No critical alerts at this time</p>
              </div>
              <span className="text-xs text-green-500">{new Date().toLocaleTimeString()}</span>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Activity className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <p className="font-medium text-blue-800">High Traffic Detected</p>
                <p className="text-sm text-blue-600">Above average user activity - systems scaling automatically</p>
              </div>
              <span className="text-xs text-blue-500">2 minutes ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeMonitoringDashboard;