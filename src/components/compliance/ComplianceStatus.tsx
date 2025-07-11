import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Activity, 
  Server, 
  Lock, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Globe,
  Award
} from 'lucide-react';

interface ComplianceStatusProps {
  complianceData: any;
}

const ComplianceStatus: React.FC<ComplianceStatusProps> = ({ complianceData }) => {
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    activeUsers: 0,
    systemLoad: 0,
    responseTime: 0,
    securityAlerts: 0
  });

  useEffect(() => {
    // Simulate real-time metrics updates
    const interval = setInterval(() => {
      setRealTimeMetrics({
        activeUsers: Math.floor(Math.random() * 50) + 100,
        systemLoad: Math.random() * 30 + 20,
        responseTime: Math.random() * 100 + 150,
        securityAlerts: Math.floor(Math.random() * 3)
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'mostly_compliant':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.9) return 'text-green-600';
    if (score >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const complianceStandards = [
    {
      id: 'gdpr',
      name: 'GDPR',
      icon: Globe,
      description: 'General Data Protection Regulation',
      data: complianceData?.standards?.gdpr
    },
    {
      id: 'hipaa',
      name: 'HIPAA',
      icon: Shield,
      description: 'Health Insurance Portability and Accountability Act',
      data: complianceData?.standards?.hipaa
    },
    {
      id: 'soc2',
      name: 'SOC 2',
      icon: Lock,
      description: 'Service Organization Control 2',
      data: complianceData?.standards?.soc2
    },
    {
      id: 'iso27001',
      name: 'ISO 27001',
      icon: Award,
      description: 'Information Security Management',
      data: complianceData?.standards?.iso27001
    }
  ];

  return (
    <div className="space-y-6">
      {/* Real-time System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Real-time System Status</span>
            <Badge className="bg-green-100 text-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
              Live
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {realTimeMetrics.activeUsers}
              </div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {realTimeMetrics.systemLoad.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">System Load</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {realTimeMetrics.responseTime.toFixed(0)}ms
              </div>
              <div className="text-sm text-muted-foreground">Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {realTimeMetrics.securityAlerts}
              </div>
              <div className="text-sm text-muted-foreground">Security Alerts</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Standards Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Compliance Standards Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {complianceStandards.map((standard) => {
              const IconComponent = standard.icon;
              const data = standard.data;
              
              return (
                <div key={standard.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{standard.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {standard.description}
                        </div>
                      </div>
                    </div>
                    {data && getStatusIndicator(data.status)}
                  </div>
                  
                  {data && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Compliance Score</span>
                        <span className={`font-medium ${getScoreColor(data.score)}`}>
                          {Math.round(data.score * 100)}%
                        </span>
                      </div>
                      <Progress value={data.score * 100} className="h-2" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Infrastructure Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Server className="h-5 w-5" />
            <span>Infrastructure Metrics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Uptime</span>
                <span className="text-green-600 font-medium">
                  {complianceData?.metrics?.uptime_percentage || 99.9}%
                </span>
              </div>
              <Progress value={complianceData?.metrics?.uptime_percentage || 99.9} className="h-2" />
              <p className="text-xs text-muted-foreground">
                99.9% uptime guarantee with redundant infrastructure
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Data Encryption</span>
                <span className="text-green-600 font-medium">AES-256</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="h-4 w-4 text-green-500" />
                <span className="text-sm text-muted-foreground">End-to-end encrypted</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Military-grade encryption for all data at rest and in transit
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Security Incidents</span>
                <span className="text-green-600 font-medium">
                  {complianceData?.metrics?.security_incidents || 0}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-muted-foreground">No active threats</span>
              </div>
              <p className="text-xs text-muted-foreground">
                24/7 monitoring with automated threat detection
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Compliance Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                time: '2 hours ago',
                activity: 'GDPR compliance check completed',
                status: 'success',
                icon: CheckCircle
              },
              {
                time: '6 hours ago',
                activity: 'Security audit performed',
                status: 'success',
                icon: Shield
              },
              {
                time: '1 day ago',
                activity: 'Data backup verification',
                status: 'success',
                icon: Server
              },
              {
                time: '2 days ago',
                activity: 'Privacy policy updated',
                status: 'info',
                icon: Globe
              }
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`p-1 rounded-full ${
                    item.status === 'success' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    <IconComponent className={`h-3 w-3 ${
                      item.status === 'success' ? 'text-green-600' : 'text-blue-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{item.activity}</div>
                    <div className="text-xs text-muted-foreground">{item.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceStatus;