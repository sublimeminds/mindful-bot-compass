import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Activity, Users, MessageSquare, Zap, TrendingUp, Play, Pause, RotateCcw } from 'lucide-react';

interface LiveMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  changePercent: number;
  icon: any;
  color: string;
  history: number[];
}

interface ActivityEvent {
  id: string;
  type: 'user_joined' | 'session_started' | 'message_sent' | 'goal_completed' | 'alert_triggered';
  description: string;
  timestamp: string;
  severity?: 'low' | 'medium' | 'high';
}

const RealTimeMetrics = () => {
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  const [metrics, setMetrics] = useState<LiveMetric[]>([
    {
      id: '1',
      name: 'Active Users',
      value: 2847,
      unit: 'users',
      change: 23,
      changePercent: 0.8,
      icon: Users,
      color: 'text-blue-500',
      history: [2820, 2825, 2830, 2835, 2840, 2847]
    },
    {
      id: '2',
      name: 'Sessions/Hour',
      value: 156,
      unit: 'sessions',
      change: -4,
      changePercent: -2.5,
      icon: Activity,
      color: 'text-green-500',
      history: [148, 152, 158, 162, 160, 156]
    },
    {
      id: '3',
      name: 'Messages/Min',
      value: 89,
      unit: 'messages',
      change: 12,
      changePercent: 15.6,
      icon: MessageSquare,
      color: 'text-purple-500',
      history: [75, 78, 82, 85, 87, 89]
    },
    {
      id: '4',
      name: 'Response Time',
      value: 234,
      unit: 'ms',
      change: -18,
      changePercent: -7.1,
      icon: Zap,
      color: 'text-yellow-500',
      history: [252, 248, 245, 242, 238, 234]
    }
  ]);

  const [activityFeed, setActivityFeed] = useState<ActivityEvent[]>([
    {
      id: '1',
      type: 'user_joined',
      description: 'New user registered from United States',
      timestamp: new Date(Date.now() - 15000).toISOString()
    },
    {
      id: '2',
      type: 'session_started',
      description: 'AI therapy session initiated by user #2847',
      timestamp: new Date(Date.now() - 32000).toISOString()
    },
    {
      id: '3',
      type: 'goal_completed',
      description: 'Daily mindfulness goal achieved by user #2846',
      timestamp: new Date(Date.now() - 47000).toISOString()
    },
    {
      id: '4',
      type: 'message_sent',
      description: 'WhatsApp integration sent 12 notifications',
      timestamp: new Date(Date.now() - 63000).toISOString()
    },
    {
      id: '5',
      type: 'alert_triggered',
      description: 'High response time detected for API endpoint',
      timestamp: new Date(Date.now() - 89000).toISOString(),
      severity: 'medium'
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => {
        const variation = (Math.random() - 0.5) * (metric.value * 0.05);
        const newValue = Math.max(0, metric.value + variation);
        const change = newValue - metric.value;
        const changePercent = metric.value > 0 ? (change / metric.value) * 100 : 0;
        
        return {
          ...metric,
          value: Math.round(newValue),
          change: Math.round(change),
          changePercent: Number(changePercent.toFixed(1)),
          history: [...metric.history.slice(-5), Math.round(newValue)]
        };
      }));

      // Occasionally add new activity
      if (Math.random() < 0.3) {
        const eventTypes = ['user_joined', 'session_started', 'message_sent', 'goal_completed'] as const;
        const descriptions = [
          'New user registered from Canada',
          'AI therapy session initiated',
          'User completed breathing exercise',
          'Weekly goal milestone reached',
          'Crisis intervention protocol activated'
        ];
        
        const newEvent: ActivityEvent = {
          id: Date.now().toString(),
          type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
          description: descriptions[Math.floor(Math.random() * descriptions.length)],
          timestamp: new Date().toISOString(),
          severity: Math.random() < 0.1 ? 'high' : undefined
        };

        setActivityFeed(prev => [newEvent, ...prev.slice(0, 19)]);
      }

      setLastUpdate(new Date());
    }, 2000);

    return () => clearInterval(interval);
  }, [isLive]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'user_joined': return '👋';
      case 'session_started': return '🧠';
      case 'message_sent': return '💬';
      case 'goal_completed': return '🎯';
      case 'alert_triggered': return '⚠️';
      default: return '📊';
    }
  };

  const getEventColor = (type: string, severity?: string) => {
    if (severity === 'high') return 'text-red-600';
    if (severity === 'medium') return 'text-yellow-600';
    
    switch (type) {
      case 'user_joined': return 'text-blue-600';
      case 'session_started': return 'text-green-600';
      case 'message_sent': return 'text-purple-600';
      case 'goal_completed': return 'text-emerald-600';
      case 'alert_triggered': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold therapy-text-gradient">Real-Time Metrics</h1>
          <p className="text-muted-foreground">Live system metrics and activity monitoring</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Live Updates</span>
            <Switch checked={isLive} onCheckedChange={setIsLive} />
          </div>
          <Badge variant={isLive ? "default" : "secondary"} className="flex items-center space-x-1">
            {isLive ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
            <span>{isLive ? 'LIVE' : 'PAUSED'}</span>
          </Badge>
        </div>
      </div>

      {/* Status Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-sm font-medium">
                {isLive ? 'Streaming live data' : 'Data updates paused'}
              </span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>Last update: {lastUpdate.toLocaleTimeString()}</span>
              <Button variant="ghost" size="sm" onClick={() => setLastUpdate(new Date())}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-Time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const MetricIcon = metric.icon;
          const isPositive = metric.change >= 0;
          
          return (
            <Card key={metric.id} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <MetricIcon className={`h-6 w-6 ${metric.color}`} />
                  <div className={`flex items-center space-x-1 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    <TrendingUp className={`h-4 w-4 ${!isPositive ? 'rotate-180' : ''}`} />
                    <span>{isPositive ? '+' : ''}{metric.changePercent}%</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-2xl font-bold">
                    {metric.value.toLocaleString()}
                    <span className="text-sm font-normal text-muted-foreground ml-1">
                      {metric.unit}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">{metric.name}</div>
                  <div className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? '+' : ''}{metric.change} from last period
                  </div>
                </div>

                {/* Mini Chart */}
                <div className="mt-4 h-8 flex items-end space-x-1">
                  {metric.history.map((value, index) => {
                    const maxValue = Math.max(...metric.history);
                    const height = (value / maxValue) * 100;
                    return (
                      <div
                        key={index}
                        className={`flex-1 bg-gradient-to-t ${metric.color.replace('text-', 'from-')} to-transparent opacity-60`}
                        style={{ height: `${height}%` }}
                      />
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Live Activity Feed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {activityFeed.map((event) => (
                <div key={event.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                  <span className="text-lg">{getEventIcon(event.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${getEventColor(event.type, event.severity)}`}>
                      {event.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatTimeAgo(event.timestamp)}
                    </p>
                  </div>
                  {event.severity && (
                    <Badge 
                      variant="outline" 
                      className={
                        event.severity === 'high' ? 'border-red-200 text-red-700' :
                        event.severity === 'medium' ? 'border-yellow-200 text-yellow-700' :
                        'border-blue-200 text-blue-700'
                      }
                    >
                      {event.severity}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Peak Users Today</span>
              <span className="text-sm font-bold">3,247</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Sessions</span>
              <span className="text-sm font-bold">1,856</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Messages Sent</span>
              <span className="text-sm font-bold">12,943</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Goals Completed</span>
              <span className="text-sm font-bold">287</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Avg Response Time</span>
              <span className="text-sm font-bold">234ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">System Uptime</span>
              <span className="text-sm font-bold text-green-600">99.97%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-Time Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Live Metrics Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Real-Time Chart</p>
              <p className="text-sm text-gray-400">Live metrics visualization with WebSocket updates</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeMetrics;