import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Monitor, 
  Smartphone, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useSecurityMonitor } from '@/hooks/useSecurityMonitor';
import { formatDistanceToNow } from 'date-fns';

export const SecurityDashboard: React.FC = () => {
  const {
    devices,
    sessions,
    alerts,
    isLoading,
    trustDevice,
    revokeDevice,
    terminateSession,
    detectSharing
  } = useSecurityMonitor();

  const [sharingAnalysis, setSharingAnalysis] = useState<any>(null);

  const handleDetectSharing = async () => {
    const analysis = await detectSharing();
    setSharingAnalysis(analysis);
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Smartphone className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (score: number) => {
    if (score > 0.8) return 'destructive';
    if (score > 0.6) return 'outline';
    return 'secondary';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Security Center</h2>
          <p className="text-muted-foreground">
            Monitor and manage your account security
          </p>
        </div>
        <Button onClick={handleDetectSharing} variant="outline">
          <Shield className="h-4 w-4 mr-2" />
          Run Security Check
        </Button>
      </div>

      {/* Security Alerts */}
      {alerts.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You have {alerts.length} unresolved security alert{alerts.length !== 1 ? 's' : ''}.
          </AlertDescription>
        </Alert>
      )}

      {/* Sharing Analysis Results */}
      {sharingAnalysis && (
        <Alert variant={sharingAnalysis.requires_action ? 'destructive' : 'default'}>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">
                Account Sharing Analysis: {Math.round(sharingAnalysis.confidence_score * 100)}% confidence
              </p>
              <div className="text-sm space-y-1">
                <p>Active sessions: {sharingAnalysis.active_sessions}</p>
                <p>Unique locations: {sharingAnalysis.unique_locations}</p>
                {sharingAnalysis.indicators.length > 0 && (
                  <p>Indicators: {sharingAnalysis.indicators.join(', ')}</p>
                )}
              </div>
              {sharingAnalysis.requires_action && (
                <p className="text-sm font-medium">
                  Action required: Please review your active sessions and devices.
                </p>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="devices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="devices">Trusted Devices</TabsTrigger>
          <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
          <TabsTrigger value="alerts">Security Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="devices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trusted Devices</CardTitle>
              <CardDescription>
                Manage devices that have access to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-muted-foreground">Loading devices...</p>
              ) : devices.length === 0 ? (
                <p className="text-muted-foreground">No devices found</p>
              ) : (
                <div className="space-y-4">
                  {devices.map((device) => (
                    <div key={device.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getDeviceIcon(device.device_type)}
                        <div>
                          <p className="font-medium">{device.device_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {device.os} • {device.browser}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Last used {formatDistanceToNow(new Date(device.last_used_at))} ago
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {device.is_trusted ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Trusted
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <XCircle className="h-3 w-3 mr-1" />
                            Untrusted
                          </Badge>
                        )}
                        <div className="flex gap-1">
                          {!device.is_trusted && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => trustDevice(device.id)}
                            >
                              Trust
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => revokeDevice(device.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>
                Monitor your current login sessions across all devices
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-muted-foreground">Loading sessions...</p>
              ) : sessions.length === 0 ? (
                <p className="text-muted-foreground">No active sessions found</p>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Monitor className="h-4 w-4" />
                        <div>
                          <p className="font-medium">Session {session.session_token.slice(0, 8)}...</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {session.ip_address?.toString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Last active {formatDistanceToNow(new Date(session.last_activity))} ago
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => terminateSession(session.session_token)}
                      >
                        Terminate
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Alerts</CardTitle>
              <CardDescription>
                Recent security notifications and suspicious activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-muted-foreground">Loading alerts...</p>
              ) : alerts.length === 0 ? (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-lg font-medium">All clear!</p>
                  <p className="text-muted-foreground">No security alerts at this time.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                          <span className="font-medium capitalize">
                            {alert.alert_type.replace('_', ' ')}
                          </span>
                        </div>
                        <Badge variant={getSeverityColor(alert.confidence_score)}>
                          {Math.round(alert.confidence_score * 100)}% confidence
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Detected {formatDistanceToNow(new Date(alert.triggered_at))} ago
                      </p>
                      {alert.evidence && (
                        <div className="text-xs text-muted-foreground">
                          <pre>{JSON.stringify(alert.evidence, null, 2)}</pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};