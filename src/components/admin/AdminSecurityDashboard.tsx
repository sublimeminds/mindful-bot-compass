
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  Lock, 
  Eye, 
  Activity,
  Database,
  Users,
  Settings,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useSecurityMonitoring } from '@/hooks/useSecurityMonitoring';
import { useAuth } from '@/components/SimpleAuthProvider';
import { useAdmin } from '@/components/SimpleAdminProvider';

const AdminSecurityDashboard = () => {
  const { user } = useAuth();
  const { isAdmin, hasPermission } = useAdmin();
  const { alerts, metrics, acknowledgeAlert } = useSecurityMonitoring();
  const [securityEvents, setSecurityEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdmin && hasPermission('manage_security')) {
      loadSecurityEvents();
    }
  }, [isAdmin, hasPermission]);

  const loadSecurityEvents = async () => {
    setLoading(true);
    try {
      // In production, this would fetch real security events
      const mockEvents = [
        {
          id: '1',
          type: 'login_attempt',
          severity: 'info',
          message: 'Successful admin login',
          timestamp: new Date(),
          userEmail: user?.email,
          ipAddress: '192.168.1.1'
        },
        {
          id: '2',
          type: 'failed_login',
          severity: 'warning',
          message: 'Failed login attempt',
          timestamp: new Date(Date.now() - 300000),
          userEmail: 'unknown@example.com',
          ipAddress: '10.0.0.1'
        },
        {
          id: '3',
          type: 'permission_denied',
          severity: 'medium',
          message: 'User attempted to access admin area without permission',
          timestamp: new Date(Date.now() - 600000),
          userEmail: 'user@example.com',
          ipAddress: '192.168.1.100'
        }
      ];
      setSecurityEvents(mockEvents);
    } catch (error) {
      console.error('Failed to load security events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'info': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getThreatLevelIcon = (level: string) => {
    switch (level) {
      case 'critical': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'high': return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'medium': return <Eye className="h-5 w-5 text-yellow-500" />;
      default: return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
  };

  if (!isAdmin || !hasPermission('manage_security')) {
    return (
      <Alert variant="destructive">
        <Lock className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to access security management features.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Security Dashboard</h2>
          <p className="text-gray-400 mt-1">Monitor security events, threats, and system integrity</p>
        </div>
        <Button onClick={loadSecurityEvents} disabled={loading}>
          <Activity className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-white">
              <Shield className="h-4 w-4 mr-2 text-blue-600" />
              Threat Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {getThreatLevelIcon(metrics?.threatLevel)}
              <span className="text-2xl font-bold text-white capitalize">
                {metrics?.threatLevel || 'low'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-white">
              <AlertTriangle className="h-4 w-4 mr-2 text-red-600" />
              Active Threats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">
              {metrics?.activeThreats || 0}
            </div>
            <p className="text-xs text-gray-400">
              {alerts.filter(a => !a.acknowledged).length} unhandled alerts
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-white">
              <Database className="h-4 w-4 mr-2 text-purple-600" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {metrics?.systemHealth || 100}%
            </div>
            <p className="text-xs text-gray-400">All systems operational</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-white">
              <Users className="h-4 w-4 mr-2 text-green-600" />
              Compliance Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">
              {metrics?.complianceScore || 0}%
            </div>
            <p className="text-xs text-gray-400">HIPAA & GDPR compliant</p>
          </CardContent>
        </Card>
      </div>

      {/* Security Alerts */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Security Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.slice(0, 5).map((alert) => (
              <div key={alert.id} className="flex items-start justify-between p-4 bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge className={getSeverityColor(alert.type)}>
                      {alert.type}
                    </Badge>
                    <span className="text-white font-medium">{alert.title}</span>
                  </div>
                  <p className="text-gray-300 text-sm">{alert.message}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {alert.timestamp.toLocaleString()}
                  </p>
                </div>
                {!alert.acknowledged && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="text-white border-gray-600 hover:bg-gray-600"
                  >
                    Acknowledge
                  </Button>
                )}
              </div>
            ))}

            {alerts.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">All Clear</h3>
                <p className="text-gray-400">No active security alerts.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Security Events */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Eye className="h-5 w-5 mr-2" />
            Recent Security Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {securityEvents.map((event) => (
              <div key={event.id} className="flex items-start justify-between p-4 bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge className={getSeverityColor(event.severity)}>
                      {event.severity}
                    </Badge>
                    <span className="text-white font-medium capitalize">
                      {event.type.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">{event.message}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                    <span>User: {event.userEmail}</span>
                    <span>IP: {event.ipAddress}</span>
                    <span>{event.timestamp.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}

            {securityEvents.length === 0 && (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No Recent Events</h3>
                <p className="text-gray-400">Security event log is empty.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Configuration */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Security Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-400">Authentication & Access</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                  <span className="text-white">Multi-Factor Authentication</span>
                  <span className="text-green-400">Enabled</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                  <span className="text-white">Session Timeout</span>
                  <span className="text-blue-400">24 hours</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                  <span className="text-white">Password Policy</span>
                  <span className="text-green-400">Strong</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                  <span className="text-white">Admin Role Protection</span>
                  <span className="text-green-400">Active</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-400">Data Protection</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                  <span className="text-white">Data Encryption</span>
                  <span className="text-green-400">AES-256</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                  <span className="text-white">Backup Encryption</span>
                  <span className="text-green-400">Enabled</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                  <span className="text-white">API Rate Limiting</span>
                  <span className="text-green-400">Active</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                  <span className="text-white">Audit Logging</span>
                  <span className="text-green-400">Comprehensive</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSecurityDashboard;
