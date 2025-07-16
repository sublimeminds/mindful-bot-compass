import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, Shield, Globe, Zap, Pause, Play, Download, Filter } from 'lucide-react';

interface FraudEvent {
  id: string;
  timestamp: string;
  type: 'detection' | 'prevention' | 'alert' | 'resolution';
  severity: 'low' | 'medium' | 'high' | 'critical';
  event: string;
  location: string;
  userId?: string;
  details: any;
  autoResolved: boolean;
}

const RealTimeFraudFeed = () => {
  const [events, setEvents] = useState<FraudEvent[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  // Simulate real-time events
  useEffect(() => {
    if (!isLive) return;

    const generateEvent = (): FraudEvent => {
      const types = ['detection', 'prevention', 'alert', 'resolution'] as const;
      const severities = ['low', 'medium', 'high', 'critical'] as const;
      const locations = ['US', 'IN', 'AR', 'BR', 'PK', 'BD', 'VPN'];
      const events = [
        'Suspicious location change detected',
        'VPN usage blocked',
        'Multiple account creation attempt',
        'Rapid subscription creation',
        'Location verification failed',
        'Trust level downgraded',
        'Pricing abuse detected',
        'Payment pattern anomaly',
        'Device fingerprint mismatch',
        'Geographic impossibility detected'
      ];

      return {
        id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        type: types[Math.floor(Math.random() * types.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        event: events[Math.floor(Math.random() * events.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        userId: `user_${Math.random().toString(36).substr(2, 8)}`,
        details: {
          ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          confidence: Math.random(),
          action: 'blocked'
        },
        autoResolved: Math.random() > 0.7
      };
    };

    const interval = setInterval(() => {
      const newEvent = generateEvent();
      setEvents(prev => [newEvent, ...prev.slice(0, 99)]); // Keep last 100 events
    }, Math.random() * 3000 + 1000); // Random interval between 1-4 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-600 text-white';
      case 'medium': return 'bg-yellow-600 text-white';
      case 'low': return 'bg-blue-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'detection': return <AlertTriangle className="h-4 w-4" />;
      case 'prevention': return <Shield className="h-4 w-4" />;
      case 'alert': return <Zap className="h-4 w-4" />;
      case 'resolution': return <Shield className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'detection': return 'text-yellow-400';
      case 'prevention': return 'text-green-400';
      case 'alert': return 'text-red-400';
      case 'resolution': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const filteredEvents = events.filter(event => {
    if (filterType !== 'all' && event.type !== filterType) return false;
    if (filterSeverity !== 'all' && event.severity !== filterSeverity) return false;
    return true;
  });

  const exportEvents = () => {
    const csvContent = [
      ['Timestamp', 'Type', 'Severity', 'Event', 'Location', 'User ID', 'Auto Resolved'].join(','),
      ...filteredEvents.map(event => [
        event.timestamp,
        event.type,
        event.severity,
        event.event.replace(/,/g, ';'),
        event.location,
        event.userId || '',
        event.autoResolved ? 'Yes' : 'No'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fraud-events-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span className="flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              Real-time Fraud Detection Feed
            </span>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Live Feed</span>
                <Switch
                  checked={isLive}
                  onCheckedChange={setIsLive}
                />
                {isLive ? (
                  <div className="flex items-center text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                    <span className="text-sm">LIVE</span>
                  </div>
                ) : (
                  <div className="flex items-center text-gray-400">
                    <Pause className="h-4 w-4 mr-2" />
                    <span className="text-sm">PAUSED</span>
                  </div>
                )}
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white rounded px-3 py-1 text-sm"
              >
                <option value="all">All Types</option>
                <option value="detection">Detection</option>
                <option value="prevention">Prevention</option>
                <option value="alert">Alert</option>
                <option value="resolution">Resolution</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white rounded px-3 py-1 text-sm"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={exportEvents}
              className="flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Badge variant="outline" className="text-gray-300">
              {filteredEvents.length} events
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Live Feed */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>Live Event Stream</span>
            <Badge className={isLive ? 'bg-green-600' : 'bg-gray-600'}>
              {isLive ? 'MONITORING' : 'PAUSED'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] w-full">
            <div className="space-y-2">
              {filteredEvents.length === 0 ? (
                <div className="text-center py-8">
                  <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No events to display</p>
                  <p className="text-gray-500 text-sm">Events will appear here when the live feed is active</p>
                </div>
              ) : (
                filteredEvents.map((event, index) => (
                  <div
                    key={event.id}
                    className={`p-3 rounded-lg border transition-all duration-500 ${
                      index === 0 && isLive
                        ? 'bg-blue-900/30 border-blue-500 animate-pulse'
                        : 'bg-gray-900 border-gray-600'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className={`p-2 rounded-full ${getTypeColor(event.type)}`}>
                          {getTypeIcon(event.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="text-white font-medium truncate">{event.event}</p>
                            <Badge className={getSeverityColor(event.severity)}>
                              {event.severity.toUpperCase()}
                            </Badge>
                            {event.autoResolved && (
                              <Badge variant="outline" className="text-green-400 border-green-400">
                                AUTO-RESOLVED
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span className="flex items-center">
                              <Globe className="h-3 w-3 mr-1" />
                              {event.location}
                            </span>
                            {event.userId && (
                              <span>User: {event.userId.slice(0, 12)}...</span>
                            )}
                            <span>IP: {event.details.ip}</span>
                            <span>Confidence: {(event.details.confidence * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-xs text-gray-400">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Events/Hour</p>
                <p className="text-3xl font-bold text-blue-400">
                  {Math.floor(filteredEvents.length * (3600 / Math.max(1, (Date.now() - new Date(filteredEvents[filteredEvents.length - 1]?.timestamp || Date.now()).getTime()) / 1000)))}
                </p>
              </div>
              <Zap className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Auto-Resolved</p>
                <p className="text-3xl font-bold text-green-400">
                  {Math.round((filteredEvents.filter(e => e.autoResolved).length / Math.max(1, filteredEvents.length)) * 100)}%
                </p>
              </div>
              <Shield className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Critical Events</p>
                <p className="text-3xl font-bold text-red-400">
                  {filteredEvents.filter(e => e.severity === 'critical').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Unique Locations</p>
                <p className="text-3xl font-bold text-purple-400">
                  {new Set(filteredEvents.map(e => e.location)).size}
                </p>
              </div>
              <Globe className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealTimeFraudFeed;