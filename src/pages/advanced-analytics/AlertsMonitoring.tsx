import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  AlertTriangle, 
  Bell, 
  Clock, 
  Filter, 
  Search, 
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap,
  Users,
  Server,
  Database,
  Mail,
  BarChart3
} from 'lucide-react';

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'acknowledged' | 'resolved' | 'silenced';
  category: 'performance' | 'security' | 'system' | 'user' | 'integration';
  source: string;
  timestamp: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  escalationLevel: number;
  affectedUsers?: number;
}

interface AlertRule {
  id: string;
  name: string;
  condition: string;
  threshold: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  isEnabled: boolean;
  notifications: string[];
  cooldown: number;
}

const AlertsMonitoring = () => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      title: 'High Memory Usage',
      description: 'Memory usage has exceeded 85% on production server',
      severity: 'high',
      status: 'active',
      category: 'performance',
      source: 'System Monitor',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      escalationLevel: 2,
      affectedUsers: 0
    },
    {
      id: '2',
      title: 'Failed Login Attempts',
      description: 'Multiple failed login attempts detected from IP 192.168.1.100',
      severity: 'medium',
      status: 'acknowledged',
      category: 'security',
      source: 'Auth Service',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      acknowledgedBy: 'admin@example.com',
      acknowledgedAt: new Date(Date.now() - 300000).toISOString(),
      escalationLevel: 1,
      affectedUsers: 1
    },
    {
      id: '3',
      title: 'Database Connection Pool Warning',
      description: 'Connection pool usage is approaching maximum capacity',
      severity: 'medium',
      status: 'active',
      category: 'system',
      source: 'Database Monitor',
      timestamp: new Date(Date.now() - 900000).toISOString(),
      escalationLevel: 1,
      affectedUsers: 50
    },
    {
      id: '4',
      title: 'API Response Time Spike',
      description: 'API response times have increased by 300% in the last 5 minutes',
      severity: 'critical',
      status: 'active',
      category: 'performance',
      source: 'API Gateway',
      timestamp: new Date(Date.now() - 180000).toISOString(),
      escalationLevel: 3,
      affectedUsers: 247
    },
    {
      id: '5',
      title: 'Webhook Delivery Failure',
      description: 'WhatsApp webhook failing to deliver messages for 10+ minutes',
      severity: 'high',
      status: 'resolved',
      category: 'integration',
      source: 'Integration Service',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      resolvedAt: new Date(Date.now() - 300000).toISOString(),
      escalationLevel: 2,
      affectedUsers: 156
    }
  ]);

  const [alertRules] = useState<AlertRule[]>([
    {
      id: '1',
      name: 'High CPU Usage',
      condition: 'CPU > 80%',
      threshold: '5 minutes',
      severity: 'high',
      isEnabled: true,
      notifications: ['email', 'slack'],
      cooldown: 300
    },
    {
      id: '2',
      name: 'Memory Usage Critical',
      condition: 'Memory > 90%',
      threshold: '2 minutes',
      severity: 'critical',
      isEnabled: true,
      notifications: ['email', 'slack', 'sms'],
      cooldown: 180
    },
    {
      id: '3',
      name: 'API Error Rate',
      condition: 'Error Rate > 5%',
      threshold: '3 minutes',
      severity: 'medium',
      isEnabled: true,
      notifications: ['email'],
      cooldown: 600
    },
    {
      id: '4',
      name: 'Failed Logins',
      condition: 'Failed logins > 10/minute',
      threshold: '1 minute',
      severity: 'medium',
      isEnabled: true,
      notifications: ['email', 'slack'],
      cooldown: 900
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

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
      case 'active': return 'bg-red-100 text-red-800';
      case 'acknowledged': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'silenced': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <AlertCircle className="h-4 w-4" />;
      case 'acknowledged': return <Clock className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'silenced': return <XCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'performance': return <Zap className="h-4 w-4" />;
      case 'security': return <AlertTriangle className="h-4 w-4" />;
      case 'system': return <Server className="h-4 w-4" />;
      case 'user': return <Users className="h-4 w-4" />;
      case 'integration': return <Database className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || alert.category === categoryFilter;
    
    return matchesSearch && matchesSeverity && matchesStatus && matchesCategory;
  });

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { 
            ...alert, 
            status: 'acknowledged', 
            acknowledgedBy: 'current-user@example.com',
            acknowledgedAt: new Date().toISOString()
          }
        : alert
    ));
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { 
            ...alert, 
            status: 'resolved',
            resolvedAt: new Date().toISOString()
          }
        : alert
    ));
  };

  const getAlertStats = () => {
    const total = alerts.length;
    const active = alerts.filter(a => a.status === 'active').length;
    const critical = alerts.filter(a => a.severity === 'critical').length;
    const acknowledged = alerts.filter(a => a.status === 'acknowledged').length;
    
    return { total, active, critical, acknowledged };
  };

  const stats = getAlertStats();

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold therapy-text-gradient">Alerts & Monitoring</h1>
          <p className="text-muted-foreground">System alerts, monitoring rules, and incident management</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
          <Button>
            <Bell className="h-4 w-4 mr-2" />
            Create Rule
          </Button>
        </div>
      </div>

      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-600">{stats.active}</p>
            <p className="text-sm text-muted-foreground">Active Alerts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <XCircle className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-600">{stats.critical}</p>
            <p className="text-sm text-muted-foreground">Critical Alerts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-600">{stats.acknowledged}</p>
            <p className="text-sm text-muted-foreground">Acknowledged</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Total Alerts</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="alerts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
          <TabsTrigger value="rules">Alert Rules</TabsTrigger>
          <TabsTrigger value="history">Alert History</TabsTrigger>
        </TabsList>

        {/* Active Alerts */}
        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Alert Management</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search alerts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={severityFilter} onValueChange={setSeverityFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severity</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="acknowledged">Acknowledged</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredAlerts.map((alert) => (
                  <div key={alert.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <Badge className={getStatusColor(alert.status)}>
                            {getStatusIcon(alert.status)}
                            <span className="ml-1">{alert.status}</span>
                          </Badge>
                          <div className="flex items-center space-x-1 text-muted-foreground">
                            {getCategoryIcon(alert.category)}
                            <span className="text-xs">{alert.category}</span>
                          </div>
                        </div>
                        <h3 className="font-semibold text-lg">{alert.title}</h3>
                        <p className="text-muted-foreground">{alert.description}</p>
                        
                        <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                          <span>Source: {alert.source}</span>
                          <span>Time: {new Date(alert.timestamp).toLocaleString()}</span>
                          {alert.affectedUsers && <span>Affected: {alert.affectedUsers} users</span>}
                          <span>Level: {alert.escalationLevel}</span>
                        </div>

                        {alert.acknowledgedBy && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Acknowledged by {alert.acknowledgedBy} at {new Date(alert.acknowledgedAt!).toLocaleString()}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        {alert.status === 'active' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => acknowledgeAlert(alert.id)}
                            >
                              Acknowledge
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => resolveAlert(alert.id)}
                            >
                              Resolve
                            </Button>
                          </>
                        )}
                        {alert.status === 'acknowledged' && (
                          <Button 
                            size="sm"
                            onClick={() => resolveAlert(alert.id)}
                          >
                            Resolve
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alert Rules */}
        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <CardTitle>Alert Rules Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alertRules.map((rule) => (
                  <div key={rule.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold">{rule.name}</h3>
                        <Badge className={getSeverityColor(rule.severity)}>
                          {rule.severity}
                        </Badge>
                        <Switch checked={rule.isEnabled} />
                      </div>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Condition:</span>
                        <p className="font-mono">{rule.condition}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Threshold:</span>
                        <p>{rule.threshold}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Notifications:</span>
                        <div className="flex space-x-1 mt-1">
                          {rule.notifications.map((notif) => (
                            <Badge key={notif} variant="outline" className="text-xs">
                              {notif}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alert History */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Alert History & Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Alert History Chart</p>
                  <p className="text-sm text-gray-400">Historical alert trends and patterns</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AlertsMonitoring;