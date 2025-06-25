
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  Clock, 
  FileText, 
  Users, 
  Server,
  Eye,
  CheckCircle,
  XCircle,
  Download
} from 'lucide-react';
import { incidentResponseSystem } from '@/services/incidentResponseSystem';

interface SecurityIncident {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'data_breach' | 'unauthorized_access' | 'malware' | 'ddos' | 'phishing' | 'insider_threat';
  status: 'detected' | 'investigating' | 'contained' | 'resolved' | 'closed';
  affected_systems: string[];
  affected_users: string[];
  detection_time: Date;
  response_time?: Date;
  resolution_time?: Date;
  timeline: Array<{
    id: string;
    timestamp: Date;
    event: string;
    actor: string;
    details: string;
  }>;
}

const IncidentResponseDashboard = () => {
  const [incidents, setIncidents] = useState<SecurityIncident[]>([]);
  const [activeIncidents, setActiveIncidents] = useState<SecurityIncident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<SecurityIncident | null>(null);

  useEffect(() => {
    loadIncidents();
    
    // Listen for critical security alerts
    const handleCriticalAlert = (event: CustomEvent) => {
      loadIncidents(); // Refresh incidents when new ones are created
    };
    
    window.addEventListener('criticalSecurityAlert', handleCriticalAlert);
    return () => window.removeEventListener('criticalSecurityAlert', handleCriticalAlert);
  }, []);

  const loadIncidents = () => {
    const allIncidents = incidentResponseSystem.getAllIncidents();
    const active = incidentResponseSystem.getActiveIncidents();
    
    setIncidents(allIncidents);
    setActiveIncidents(active);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'detected': return 'bg-red-100 text-red-800';
      case 'investigating': return 'bg-yellow-100 text-yellow-800';
      case 'contained': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const updateIncidentStatus = (incidentId: string, newStatus: SecurityIncident['status']) => {
    incidentResponseSystem.updateIncidentStatus(incidentId, newStatus);
    loadIncidents();
  };

  const downloadIncidentReport = (incident: SecurityIncident) => {
    const report = incidentResponseSystem.generateIncidentReport(incident.id);
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `incident-report-${incident.id}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-therapy-900">Incident Response Dashboard</h2>
          <p className="text-therapy-600 mt-1">
            Monitor and manage security incidents in real-time
          </p>
        </div>
        <Button onClick={loadIncidents} variant="outline">
          <Eye className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Active Incidents Alert */}
      {activeIncidents.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{activeIncidents.length} active security incident(s)</strong> require attention.
            {activeIncidents.filter(i => i.severity === 'critical').length > 0 && (
              <span className="ml-2 font-semibold">
                {activeIncidents.filter(i => i.severity === 'critical').length} critical incident(s) need immediate response.
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {activeIncidents.length}
            </div>
            <p className="text-xs text-muted-foreground">Requiring attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Critical Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-700">
              {incidents.filter(i => i.severity === 'critical').length}
            </div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {incidents.filter(i => 
                i.status === 'resolved' && 
                i.resolution_time && 
                new Date(i.resolution_time).toDateString() === new Date().toDateString()
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">Successfully handled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {incidents.filter(i => i.response_time).length > 0 ? 
                Math.round(
                  incidents
                    .filter(i => i.response_time)
                    .reduce((sum, i) => sum + (i.response_time!.getTime() - i.detection_time.getTime()), 0) / 
                  incidents.filter(i => i.response_time).length / 1000 / 60
                ) : 0
              }m
            </div>
            <p className="text-xs text-muted-foreground">Minutes to respond</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Incidents ({activeIncidents.length})</TabsTrigger>
          <TabsTrigger value="all">All Incidents ({incidents.length})</TabsTrigger>
          <TabsTrigger value="details">Incident Details</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeIncidents.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-green-800 mb-2">All Clear</h3>
                  <p className="text-green-600">No active security incidents at this time.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {activeIncidents.map((incident) => (
                <Card key={incident.id} className="border-l-4 border-l-red-500">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Badge className={getSeverityColor(incident.severity)}>
                            {incident.severity.toUpperCase()}
                          </Badge>
                          <Badge className={getStatusColor(incident.status)}>
                            {incident.status.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">
                            {incident.type.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{incident.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Detected: {incident.detection_time.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedIncident(incident)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadIncidentReport(incident)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Report
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-3">{incident.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Affected Systems</h4>
                        <div className="flex flex-wrap gap-1">
                          {incident.affected_systems.map((system, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              <Server className="h-3 w-3 mr-1" />
                              {system}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Affected Users</h4>
                        <div className="flex flex-wrap gap-1">
                          {incident.affected_users.map((user, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              <Users className="h-3 w-3 mr-1" />
                              {user}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {incident.status === 'detected' && (
                        <Button
                          size="sm"
                          onClick={() => updateIncidentStatus(incident.id, 'investigating')}
                          className="bg-yellow-600 hover:bg-yellow-700"
                        >
                          Start Investigation
                        </Button>
                      )}
                      {incident.status === 'investigating' && (
                        <Button
                          size="sm"
                          onClick={() => updateIncidentStatus(incident.id, 'contained')}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Mark Contained
                        </Button>
                      )}
                      {incident.status === 'contained' && (
                        <Button
                          size="sm"
                          onClick={() => updateIncidentStatus(incident.id, 'resolved')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Mark Resolved
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <div className="space-y-4">
            {incidents.map((incident) => (
              <Card key={incident.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge className={getSeverityColor(incident.severity)}>
                          {incident.severity}
                        </Badge>
                        <Badge className={getStatusColor(incident.status)}>
                          {incident.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {incident.detection_time.toLocaleDateString()}
                        </span>
                      </div>
                      <CardTitle className="text-lg">{incident.title}</CardTitle>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedIncident(incident)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{incident.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="details">
          {selectedIncident ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{selectedIncident.title}</CardTitle>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className={getSeverityColor(selectedIncident.severity)}>
                        {selectedIncident.severity}
                      </Badge>
                      <Badge className={getStatusColor(selectedIncident.status)}>
                        {selectedIncident.status}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => downloadIncidentReport(selectedIncident)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm">{selectedIncident.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Timeline</h4>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Detected:</span> {selectedIncident.detection_time.toLocaleString()}
                      </div>
                      {selectedIncident.response_time && (
                        <div className="text-sm">
                          <span className="font-medium">Response:</span> {selectedIncident.response_time.toLocaleString()}
                        </div>
                      )}
                      {selectedIncident.resolution_time && (
                        <div className="text-sm">
                          <span className="font-medium">Resolved:</span> {selectedIncident.resolution_time.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Impact</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium">Systems:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedIncident.affected_systems.map((system, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {system}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Users:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedIncident.affected_users.map((user, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {user}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Event Timeline</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {selectedIncident.timeline.map((entry) => (
                      <div key={entry.id} className="border-l-2 border-therapy-200 pl-4 pb-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <Clock className="h-3 w-3" />
                          <span className="font-medium">{entry.timestamp.toLocaleString()}</span>
                          <Badge variant="outline" className="text-xs">{entry.actor}</Badge>
                        </div>
                        <div className="text-sm font-medium mt-1">{entry.event}</div>
                        <div className="text-xs text-muted-foreground mt-1">{entry.details}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Incident Selected</h3>
                  <p className="text-gray-600">Select an incident from the list to view detailed information.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IncidentResponseDashboard;
