import React, { useEffect } from 'react';
import { useSecurityMonitoring } from '@/hooks/useSecurityMonitoring';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Eye,
  AlertCircle,
  Activity
} from 'lucide-react';
import { format } from 'date-fns';

const SecurityDashboard = () => {
  const { 
    isLoading, 
    incidents, 
    metrics, 
    fetchIncidents, 
    resolveIncident 
  } = useSecurityMonitoring();

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'investigating': return 'bg-blue-100 text-blue-800';
      case 'detected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Security Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage security incidents and threats</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={getThreatLevelColor(metrics.threatLevel)}>
            Current Threat Level: {metrics.threatLevel.toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Security Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalIncidents}</div>
            <p className="text-xs text-muted-foreground">All time incidents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.criticalIncidents}</div>
            <p className="text-xs text-muted-foreground">Requiring immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.resolvedIncidents}</div>
            <p className="text-xs text-muted-foreground">Successfully resolved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Resolution</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.averageResolutionTime}h</div>
            <p className="text-xs text-muted-foreground">Average time to resolve</p>
          </CardContent>
        </Card>
      </div>

      {/* Security Incidents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Security Incidents</span>
          </CardTitle>
          <CardDescription>
            Recent security incidents and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : incidents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p>No security incidents detected</p>
              <p className="text-sm">Your system is secure</p>
            </div>
          ) : (
            <div className="space-y-4">
              {incidents.slice(0, 10).map((incident) => (
                <div 
                  key={incident.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={getSeverityColor(incident.severity)}>
                          {incident.severity}
                        </Badge>
                        <Badge className={getStatusColor(incident.status)}>
                          {incident.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {incident.incident_type}
                        </span>
                      </div>
                      <h4 className="font-medium mb-1">{incident.description}</h4>
                      <div className="text-sm text-muted-foreground space-x-4">
                        <span>Detected: {format(new Date(incident.detected_at), 'MMM dd, HH:mm')}</span>
                        <span>Method: {incident.detection_method}</span>
                        {incident.affected_users_count > 0 && (
                          <span>Affected Users: {incident.affected_users_count}</span>
                        )}
                      </div>
                    </div>
                    {incident.status !== 'resolved' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => resolveIncident(incident.id, 'Manual resolution')}
                      >
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityDashboard;