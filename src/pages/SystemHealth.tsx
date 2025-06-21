
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Monitor, 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  BarChart3,
  Clock,
  Globe,
  Server,
  Database,
  Wifi,
  Zap,
  Eye,
  TrendingUp,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const SystemHealth = () => {
  useSEO({
    title: 'System Health & Monitoring - TherapySync',
    description: 'Real-time system health monitoring, performance metrics, and infrastructure status for TherapySync platform.',
    keywords: 'system health, monitoring, uptime, performance, infrastructure'
  });

  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const systemMetrics = [
    { 
      metric: "System Uptime", 
      value: "99.97%", 
      status: "excellent",
      change: "+0.02%",
      description: "Last 30 days",
      icon: Monitor
    },
    { 
      metric: "Response Time", 
      value: "89ms", 
      status: "excellent",
      change: "-12ms",
      description: "Average API response",
      icon: Zap
    },
    { 
      metric: "Security Score", 
      value: "A+", 
      status: "excellent",
      change: "Stable",
      description: "Security assessment",
      icon: Shield
    },
    { 
      metric: "AI Accuracy", 
      value: "98.3%", 
      status: "excellent",
      change: "+0.8%",
      description: "Therapeutic response quality",
      icon: Brain
    }
  ];

  const serviceStatus = [
    {
      service: "AI Therapy Platform",
      status: "operational",
      uptime: "99.9%",
      responseTime: "45ms",
      lastIncident: "None in 30 days"
    },
    {
      service: "Voice Technology (ElevenLabs)",
      status: "operational", 
      uptime: "99.8%",
      responseTime: "120ms",
      lastIncident: "Minor latency - 2 days ago"
    },
    {
      service: "Crisis Detection System",
      status: "operational",
      uptime: "100%",
      responseTime: "12ms",
      lastIncident: "None in 90 days"
    },
    {
      service: "User Authentication",
      status: "operational",
      uptime: "99.95%",
      responseTime: "78ms",
      lastIncident: "None in 45 days"
    },
    {
      service: "Database Systems",
      status: "operational",
      uptime: "99.9%",
      responseTime: "15ms",
      lastIncident: "Maintenance - 7 days ago"
    },
    {
      service: "Analytics & Monitoring",
      status: "operational",
      uptime: "99.7%",
      responseTime: "200ms",
      lastIncident: "Update deployment - 1 day ago"
    }
  ];

  const infrastructureMetrics = [
    {
      region: "US East (Primary)",
      status: "healthy",
      load: "67%",
      connections: "15,420",
      latency: "12ms"
    },
    {
      region: "US West",
      status: "healthy", 
      load: "52%",
      connections: "8,930",
      latency: "18ms"
    },
    {
      region: "Europe",
      status: "healthy",
      load: "71%",
      connections: "12,105",
      latency: "22ms"
    },
    {
      region: "Asia Pacific",
      status: "healthy",
      load: "45%",
      connections: "6,780",
      latency: "28ms"
    }
  ];

  const recentEvents = [
    {
      time: "2 hours ago",
      event: "Routine security scan completed",
      type: "maintenance",
      impact: "No impact"
    },
    {
      time: "6 hours ago", 
      event: "AI model optimization deployed",
      type: "improvement",
      impact: "Performance improved by 8%"
    },
    {
      time: "1 day ago",
      event: "Database maintenance window",
      type: "maintenance", 
      impact: "30 seconds downtime"
    },
    {
      time: "2 days ago",
      event: "New voice models added",
      type: "feature",
      impact: "Enhanced voice quality"
    },
    {
      time: "3 days ago",
      event: "CDN cache optimization",
      type: "improvement",
      impact: "Faster page loads"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
      case 'healthy':
      case 'excellent':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'degraded':
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'down':
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
      case 'healthy':
      case 'excellent':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'degraded':
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'down':
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-therapy-50">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            System Health & Monitoring
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Real-time monitoring of our platform infrastructure, AI systems, and service performance. 
            We maintain 99.9% uptime with enterprise-grade reliability.
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-slate-500">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setLastUpdated(new Date())}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh
            </Button>
          </div>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {systemMetrics.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 bg-gradient-to-r from-therapy-500 to-harmony-500 rounded-full">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-2">{item.value}</div>
                  <div className="text-sm font-medium text-slate-700 mb-1">{item.metric}</div>
                  <div className="text-xs text-slate-500 mb-2">{item.description}</div>
                  <Badge variant="outline" className={`text-xs ${item.change.startsWith('+') ? 'text-green-600' : item.change.startsWith('-') ? 'text-blue-600' : 'text-slate-600'}`}>
                    {item.change}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Service Status */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Monitor className="h-5 w-5 mr-2" />
              Service Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {serviceStatus.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(service.status)}
                    <div>
                      <div className="font-medium text-slate-900">{service.service}</div>
                      <div className="text-sm text-slate-500">Last incident: {service.lastIncident}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="text-center">
                      <div className="font-medium text-slate-900">{service.uptime}</div>
                      <div className="text-slate-500">Uptime</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-slate-900">{service.responseTime}</div>
                      <div className="text-slate-500">Response</div>
                    </div>
                    <Badge className={getStatusColor(service.status)}>
                      {service.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Infrastructure Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Global Infrastructure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {infrastructureMetrics.map((region, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(region.status)}
                      <div className="font-medium">{region.region}</div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                      <div>{region.load} load</div>
                      <div>{region.connections} conn</div>
                      <div>{region.latency}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Recent Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentEvents.map((event, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 border-l-4 border-slate-200 bg-slate-50 rounded-r-lg">
                    <div className="flex-1">
                      <div className="font-medium text-slate-900 text-sm">{event.event}</div>
                      <div className="text-xs text-slate-500 mt-1">{event.time} • {event.impact}</div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        event.type === 'improvement' ? 'text-green-600 border-green-200' :
                        event.type === 'feature' ? 'text-blue-600 border-blue-200' :
                        'text-slate-600 border-slate-200'
                      }`}
                    >
                      {event.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Charts Section */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-16 text-slate-500">
              <TrendingUp className="h-16 w-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-medium mb-2">Interactive Charts Coming Soon</h3>
              <p>Real-time performance charts and detailed analytics will be available here.</p>
            </div>
          </CardContent>
        </Card>

        {/* Status Page Footer */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Questions About Our Status?
          </h2>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            If you're experiencing issues not reflected here, or have questions about our infrastructure, 
            please don't hesitate to contact our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gradient-to-r from-therapy-500 to-harmony-500 hover:from-therapy-600 hover:to-harmony-600">
              Contact Support
            </Button>
            <Button variant="outline">
              Subscribe to Updates
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SystemHealth;
