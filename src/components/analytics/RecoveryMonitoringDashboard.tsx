import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, TrendingUp, Clock, Users, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { recoveryAnalytics } from '@/utils/recoveryAnalytics';

/**
 * Recovery Monitoring Dashboard - Real-time analytics and performance monitoring
 */
const RecoveryMonitoringDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [snapshots, setSnapshots] = useState<any[]>([]);
  const [realTimeData, setRealTimeData] = useState<any>(null);

  useEffect(() => {
    // Load initial data
    loadData();

    // Set up real-time updates
    const unsubscribe = recoveryAnalytics.onMetricsUpdate(handleMetricsUpdate);

    // Refresh data every 30 seconds
    const interval = setInterval(loadData, 30000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const loadData = () => {
    const newMetrics = recoveryAnalytics.calculateMetrics();
    const newEvents = recoveryAnalytics.getRecentEvents(20);
    const newSnapshots = recoveryAnalytics.getPerformanceSnapshots(10);

    setMetrics(newMetrics);
    setEvents(newEvents);
    setSnapshots(newSnapshots);
  };

  const handleMetricsUpdate = (newMetrics: any) => {
    setMetrics(newMetrics);
    setRealTimeData({
      timestamp: Date.now(),
      update: 'live'
    });
  };

  const exportData = () => {
    const data = recoveryAnalytics.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recovery-analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'failure':
        return '❌';
      case 'attempt':
        return '🔄';
      case 'escalation':
        return '⬆️';
      case 'auto_fix':
        return '🔧';
      default:
        return '📝';
    }
  };

  if (!metrics) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-pulse mx-auto mb-4 text-primary" />
          <p>Loading recovery analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Recovery Monitoring</h1>
            <p className="text-muted-foreground">
              Real-time analytics and performance monitoring
              {realTimeData && (
                <Badge variant="outline" className="ml-2">
                  Live
                </Badge>
              )}
            </p>
          </div>
          <Button onClick={exportData} variant="outline">
            📊 Export Data
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.successRate}%</div>
              <p className="text-xs text-muted-foreground">
                {metrics.totalAttempts} total attempts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Recovery Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.averageRecoveryTime}ms</div>
              <p className="text-xs text-muted-foreground">
                Average time to recover
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Auto-Fix Rate</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.autoFixSuccessRate}%</div>
              <p className="text-xs text-muted-foreground">
                Automatic recovery success
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Escalation Rate</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.escalationRate}%</div>
              <p className="text-xs text-muted-foreground">
                Required manual intervention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Snapshots */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {snapshots.slice(0, 5).map((snapshot, index) => (
                  <div key={snapshot.timestamp} className="flex items-center justify-between">
                    <span className="text-sm">
                      {new Date(snapshot.timestamp).toLocaleTimeString()}
                    </span>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <span className="text-xs">Memory:</span>
                        <span className="font-mono text-sm">{snapshot.memoryUsage}MB</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs">Health:</span>
                        <span className={`font-mono text-sm ${getHealthColor(snapshot.healthScore)}`}>
                          {snapshot.healthScore}/100
                        </span>
                      </div>
                      {snapshot.recoveryActive && (
                        <Badge variant="destructive" className="text-xs">
                          Recovery Active
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Common Errors */}
          <Card>
            <CardHeader>
              <CardTitle>Most Common Errors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(metrics.mostCommonErrors)
                  .sort(([,a], [,b]) => (b as number) - (a as number))
                  .slice(0, 5)
                  .map(([error, count]) => (
                    <div key={error} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{error}</span>
                      <Badge variant="outline">{count as number} times</Badge>
                    </div>
                  ))}
                {Object.keys(metrics.mostCommonErrors).length === 0 && (
                  <p className="text-sm text-muted-foreground">No errors recorded recently</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Level Usage */}
          <Card>
            <CardHeader>
              <CardTitle>Recovery Level Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(metrics.levelUsageStats)
                  .sort(([,a], [,b]) => (b as number) - (a as number))
                  .map(([level, count]) => (
                    <div key={level} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{level}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full"
                            style={{ 
                              width: `${((count as number) / metrics.totalAttempts) * 100}%` 
                            }}
                          />
                        </div>
                        <span className="text-xs font-mono">{count as number}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Events */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Recovery Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {events.slice(0, 10).map((event) => (
                  <div 
                    key={event.id} 
                    className="flex items-center justify-between p-2 rounded border text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span>{getEventIcon(event.type)}</span>
                      <div>
                        <span className="font-medium capitalize">{event.type}</span>
                        <span className="text-muted-foreground ml-2">
                          {event.level}
                        </span>
                        {event.errorType && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            {event.errorType}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(event.timestamp).toLocaleTimeString()}
                      {event.duration && (
                        <span className="ml-2">({event.duration}ms)</span>
                      )}
                    </div>
                  </div>
                ))}
                {events.length === 0 && (
                  <p className="text-sm text-muted-foreground">No recent events</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button 
                onClick={() => window.location.href = '/component-health'}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Activity className="h-4 w-4" />
                Component Health
              </Button>
              
              <Button 
                onClick={() => window.location.href = '/recovery-dashboard'}
                variant="outline"
                className="flex items-center gap-2"
              >
                <AlertTriangle className="h-4 w-4" />
                Recovery Tools
              </Button>
              
              <Button 
                onClick={loadData}
                variant="outline"
                className="flex items-center gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                Refresh Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecoveryMonitoringDashboard;