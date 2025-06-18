
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, AlertTriangle, Phone, Heart, Users, 
  MapPin, Clock, TrendingUp, CheckCircle, X
} from 'lucide-react';

interface CrisisAlert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'suicidal_ideation' | 'self_harm' | 'substance_abuse' | 'panic_attack' | 'psychosis';
  timestamp: Date;
  userId: string;
  userName: string;
  status: 'active' | 'responding' | 'resolved';
  location?: string;
  description: string;
  riskScore: number;
}

const CrisisInterventionDashboard = () => {
  const [crisisAlerts, setCrisisAlerts] = useState<CrisisAlert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<CrisisAlert | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - in real app this would come from real-time monitoring
    const mockAlerts: CrisisAlert[] = [
      {
        id: '1',
        severity: 'critical',
        type: 'suicidal_ideation',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        userId: 'user1',
        userName: 'Anonymous User',
        status: 'active',
        location: 'San Francisco, CA',
        description: 'User expressed strong suicidal thoughts with specific plan mentioned',
        riskScore: 95
      },
      {
        id: '2',
        severity: 'high',
        type: 'self_harm',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        userId: 'user2',
        userName: 'Anonymous User',
        status: 'responding',
        location: 'New York, NY',
        description: 'User reported self-harm behavior in the last 24 hours',
        riskScore: 78
      },
      {
        id: '3',
        severity: 'medium',
        type: 'panic_attack',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        userId: 'user3',
        userName: 'Anonymous User',
        status: 'resolved',
        description: 'User experiencing severe panic attack symptoms',
        riskScore: 45
      }
    ];

    setCrisisAlerts(mockAlerts);
    setLoading(false);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800 border-red-200';
      case 'responding': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleRespond = (alertId: string) => {
    setCrisisAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, status: 'responding' as const }
          : alert
      )
    );
  };

  const handleResolve = (alertId: string) => {
    setCrisisAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, status: 'resolved' as const }
          : alert
      )
    );
  };

  const activeAlerts = crisisAlerts.filter(alert => alert.status === 'active');
  const respondingAlerts = crisisAlerts.filter(alert => alert.status === 'responding');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Crisis Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-600" />
            <div className="text-2xl font-bold text-red-600">{activeAlerts.length}</div>
            <p className="text-sm text-red-700">Active Alerts</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-orange-600" />
            <div className="text-2xl font-bold text-orange-600">{respondingAlerts.length}</div>
            <p className="text-sm text-orange-700">Being Addressed</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-green-600">12</div>
            <p className="text-sm text-green-700">Resolved Today</p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-blue-600">94%</div>
            <p className="text-sm text-blue-700">Response Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Contacts */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <Phone className="h-5 w-5 mr-2" />
            Emergency Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="destructive" 
              className="h-16 flex flex-col bg-red-600 hover:bg-red-700"
              onClick={() => window.open('tel:988', '_blank')}
            >
              <Phone className="h-6 w-6 mb-1" />
              <span>Crisis Lifeline: 988</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex flex-col border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => window.open('tel:911', '_blank')}
            >
              <Shield className="h-6 w-6 mb-1" />
              <span>Emergency: 911</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-16 flex flex-col border-blue-200 text-blue-600 hover:bg-blue-50"
              onClick={() => window.open('https://suicidepreventionlifeline.org/chat/', '_blank')}
            >
              <Heart className="h-6 w-6 mb-1" />
              <span>Crisis Chat</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Crisis Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
            Active Crisis Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeAlerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p>No active crisis alerts. All users are safe.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {crisisAlerts.map((alert) => (
                <Alert key={alert.id} className="border-l-4 border-l-red-500">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span>{alert.userName}</span>
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(alert.status)}>
                        {alert.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{alert.timestamp.toLocaleTimeString()}</span>
                    </div>
                  </AlertTitle>
                  <AlertDescription>
                    <div className="mt-2 space-y-2">
                      <p>{alert.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <span className="text-sm font-medium">Risk Score:</span>
                            <Progress value={alert.riskScore} className="w-20 h-2" />
                            <span className="text-sm font-bold text-red-600">{alert.riskScore}%</span>
                          </div>
                          {alert.location && (
                            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>{alert.location}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          {alert.status === 'active' && (
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleRespond(alert.id)}
                            >
                              Respond Now
                            </Button>
                          )}
                          {alert.status === 'responding' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleResolve(alert.id)}
                            >
                              Mark Resolved
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Crisis Prevention Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="h-5 w-5 mr-2" />
            Crisis Prevention & Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col">
              <Shield className="h-6 w-6 mb-2" />
              <span className="text-sm">Safety Planning</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <Users className="h-6 w-6 mb-2" />
              <span className="text-sm">Support Groups</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <Heart className="h-6 w-6 mb-2" />
              <span className="text-sm">Wellness Resources</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <Phone className="h-6 w-6 mb-2" />
              <span className="text-sm">24/7 Helplines</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrisisInterventionDashboard;
