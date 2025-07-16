import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertTriangle, Eye, CheckCircle, XCircle, Search, Filter, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Alert {
  id: string;
  user_id: string;
  alert_type: string;
  severity: string;
  description: string;
  evidence: any;
  created_at: string;
  resolved_at: string | null;
  resolved_by: string | null;
  resolution_notes: string | null;
}

interface FraudAlertManagerProps {
  onStatsUpdate: () => void;
}

const FraudAlertManager: React.FC<FraudAlertManagerProps> = ({ onStatsUpdate }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  useEffect(() => {
    fetchAlerts();
  }, []);

  useEffect(() => {
    filterAlerts();
  }, [alerts, searchTerm, severityFilter, statusFilter]);

  const fetchAlerts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('regional_pricing_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch fraud alerts',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterAlerts = () => {
    let filtered = [...alerts];

    if (searchTerm) {
      filtered = filtered.filter(alert => 
        alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.user_id.includes(searchTerm) ||
        alert.alert_type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (severityFilter !== 'all') {
      filtered = filtered.filter(alert => alert.severity === severityFilter);
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'resolved') {
        filtered = filtered.filter(alert => alert.resolved_at);
      } else if (statusFilter === 'active') {
        filtered = filtered.filter(alert => !alert.resolved_at);
      }
    }

    setFilteredAlerts(filtered);
  };

  const resolveAlert = async (alertId: string, action: 'resolve' | 'dismiss') => {
    try {
      const { error } = await supabase
        .from('regional_pricing_alerts')
        .update({
          resolved_at: new Date().toISOString(),
          resolved_by: 'admin', // In a real app, use actual admin ID
          resolution_notes: resolutionNotes || `Alert ${action}d by admin`
        })
        .eq('id', alertId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Alert ${action}d successfully`,
      });

      fetchAlerts();
      onStatsUpdate();
      setSelectedAlert(null);
      setResolutionNotes('');
    } catch (error) {
      console.error('Error resolving alert:', error);
      toast({
        title: 'Error',
        description: `Failed to ${action} alert`,
        variant: 'destructive'
      });
    }
  };

  const getSeverityBadge = (severity: string) => {
    const variants = {
      high: 'bg-red-600 text-white',
      medium: 'bg-yellow-600 text-white',
      low: 'bg-blue-600 text-white'
    };
    return variants[severity as keyof typeof variants] || 'bg-gray-600 text-white';
  };

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case 'suspicious_location':
        return '🌍';
      case 'vpn_detected':
        return '🔒';
      case 'rapid_country_change':
        return '⚡';
      case 'multiple_accounts':
        return '👥';
      default:
        return '⚠️';
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading alerts...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filter Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchAlerts} variant="outline">
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>Fraud Alerts ({filteredAlerts.length})</span>
            <Badge className="bg-red-600 text-white">
              {filteredAlerts.filter(a => !a.resolved_at).length} Active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">No alerts found matching your criteria</p>
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border ${
                    alert.resolved_at ? 'bg-gray-900 border-gray-600' : 'bg-gray-750 border-gray-600'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl">{getAlertTypeIcon(alert.alert_type)}</span>
                        <Badge className={getSeverityBadge(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-gray-300">
                          {alert.alert_type.replace('_', ' ').toUpperCase()}
                        </Badge>
                        {alert.resolved_at ? (
                          <Badge className="bg-green-600 text-white">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            RESOLVED
                          </Badge>
                        ) : (
                          <Badge className="bg-red-600 text-white">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            ACTIVE
                          </Badge>
                        )}
                      </div>
                      <p className="text-white font-medium mb-1">{alert.description}</p>
                      <div className="flex items-center text-sm text-gray-400 space-x-4">
                        <span>User: {alert.user_id.slice(0, 8)}...</span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(alert.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedAlert(alert)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Alert Details</DialogTitle>
                          </DialogHeader>
                          {selectedAlert && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm text-gray-400">Alert Type</label>
                                  <p className="text-white">{selectedAlert.alert_type}</p>
                                </div>
                                <div>
                                  <label className="text-sm text-gray-400">Severity</label>
                                  <p className="text-white">{selectedAlert.severity}</p>
                                </div>
                                <div>
                                  <label className="text-sm text-gray-400">User ID</label>
                                  <p className="text-white font-mono">{selectedAlert.user_id}</p>
                                </div>
                                <div>
                                  <label className="text-sm text-gray-400">Created</label>
                                  <p className="text-white">{new Date(selectedAlert.created_at).toLocaleString()}</p>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm text-gray-400">Description</label>
                                <p className="text-white">{selectedAlert.description}</p>
                              </div>
                              <div>
                                <label className="text-sm text-gray-400">Evidence</label>
                                <pre className="bg-gray-900 p-3 rounded text-sm text-green-400 overflow-auto">
                                  {JSON.stringify(selectedAlert.evidence, null, 2)}
                                </pre>
                              </div>
                              {!selectedAlert.resolved_at && (
                                <div className="space-y-3">
                                  <div>
                                    <label className="text-sm text-gray-400">Resolution Notes</label>
                                    <Textarea
                                      value={resolutionNotes}
                                      onChange={(e) => setResolutionNotes(e.target.value)}
                                      placeholder="Add notes about the resolution..."
                                      className="bg-gray-700 border-gray-600 text-white"
                                    />
                                  </div>
                                  <div className="flex space-x-3">
                                    <Button
                                      onClick={() => resolveAlert(selectedAlert.id, 'resolve')}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Resolve
                                    </Button>
                                    <Button
                                      onClick={() => resolveAlert(selectedAlert.id, 'dismiss')}
                                      variant="outline"
                                    >
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Dismiss
                                    </Button>
                                  </div>
                                </div>
                              )}
                              {selectedAlert.resolved_at && (
                                <div className="bg-green-900/20 border border-green-700 rounded-lg p-3">
                                  <p className="text-green-400 font-medium">Resolved</p>
                                  <p className="text-sm text-gray-300">
                                    {new Date(selectedAlert.resolved_at).toLocaleString()} by {selectedAlert.resolved_by}
                                  </p>
                                  {selectedAlert.resolution_notes && (
                                    <p className="text-sm text-gray-300 mt-2">{selectedAlert.resolution_notes}</p>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      {!alert.resolved_at && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedAlert(alert);
                            resolveAlert(alert.id, 'resolve');
                          }}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FraudAlertManager;