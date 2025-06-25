
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  Lock, 
  Eye, 
  RefreshCw,
  Zap,
  Users,
  Clock,
  TrendingUp
} from 'lucide-react';
import { securityMiddleware } from '@/services/securityMiddleware';

interface SecurityMetrics {
  totalEvents: number;
  criticalEvents: number;
  suspiciousIPs: number;
  rateLimitViolations: number;
  lastUpdate: Date;
}

const SecurityMonitorDashboard = () => {
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
  const [securityEvents, setSecurityEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSecurityData = async () => {
    setLoading(true);
    try {
      const metricsData = securityMiddleware.getSecurityMetrics();
      setMetrics(metricsData);

      // Get recent security events from localStorage
      const storedEvents = localStorage.getItem('securityEvents');
      if (storedEvents) {
        const events = JSON.parse(storedEvents);
        setSecurityEvents(events.slice(-20)); // Last 20 events
      }
    } catch (error) {
      console.error('Failed to fetch security data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurityData();
    const interval = setInterval(fetchSecurityData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'auth_failure': return <Lock className="h-4 w-4" />;
      case 'rate_limit_exceeded': return <Zap className="h-4 w-4" />;
      case 'suspicious_activity': return <Eye className="h-4 w-4" />;
      case 'security_violation': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  if (loading && !metrics) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-therapy-900">Security Monitor</h2>
          <p className="text-therapy-600 mt-1">Real-time security monitoring and threat detection</p>
        </div>
        <Button onClick={fetchSecurityData} variant="outline" disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Security Metrics Overview */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Activity className="h-4 w-4 mr-2 text-blue-600" />
                Total Events (24h)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalEvents}</div>
              <p className="text-xs text-muted-foreground">Security events detected</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-red-600" />
                Critical Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{metrics.criticalEvents}</div>
              <p className="text-xs text-muted-foreground">Requiring immediate attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Users className="h-4 w-4 mr-2 text-orange-600" />
                Suspicious IPs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{metrics.suspiciousIPs}</div>
              <p className="text-xs text-muted-foreground">Flagged for monitoring</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Zap className="h-4 w-4 mr-2 text-yellow-600" />
                Rate Limit Hits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{metrics.rateLimitViolations}</div>
              <p className="text-xs text-muted-foreground">Rate limiting triggered</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Critical Alerts */}
      {metrics && metrics.criticalEvents > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Security Alert:</strong> {metrics.criticalEvents} critical security events detected in the last 24 hours. 
            Immediate review recommended.
          </AlertDescription>
        </Alert>
      )}

      {/* Recent Security Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Recent Security Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          {securityEvents.length > 0 ? (
            <div className="space-y-3">
              {securityEvents.map((event, index) => (
                <div key={index} className="flex items-start justify-between p-3 border rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      {getEventTypeIcon(event.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium capitalize">
                          {event.type.replace('_', ' ')}
                        </span>
                        <Badge className={getSeverityColor(event.severity)}>
                          {event.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        IP: {event.ipAddress} • User: {event.userId || 'Anonymous'}
                      </p>
                      {event.details && (
                        <p className="text-xs text-muted-foreground">
                          {JSON.stringify(event.details, null, 2).slice(0, 100)}...
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">All Clear</h3>
              <p className="text-gray-600">No security events detected recently.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Security Posture
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Shield className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="font-medium mb-1">Protection Active</h3>
              <p className="text-sm text-muted-foreground">
                Rate limiting, input validation, and monitoring are operational
              </p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Lock className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="font-medium mb-1">Encryption Enabled</h3>
              <p className="text-sm text-muted-foreground">
                Sensitive data is encrypted with AES-256-GCM
              </p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Eye className="h-8 w-8 text-purple-500" />
              </div>
              <h3 className="font-medium mb-1">Active Monitoring</h3>
              <p className="text-sm text-muted-foreground">
                24/7 security event detection and anomaly analysis
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityMonitorDashboard;
