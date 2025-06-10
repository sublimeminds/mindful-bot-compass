
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';
import { 
  Activity, 
  Users, 
  MessageSquare, 
  Zap,
  Globe,
  Smartphone,
  Monitor
} from 'lucide-react';

interface RealTimeMetricsProps {
  dateRange: { from: Date; to: Date };
}

const RealTimeMetrics = ({ dateRange }: RealTimeMetricsProps) => {
  const [liveData, setLiveData] = useState({
    activeUsers: 1234,
    activeSessions: 567,
    messagesPerMinute: 89,
    serverLoad: 23.5
  });

  const [chartData, setChartData] = useState([
    { time: '00:00', users: 450, sessions: 230, messages: 45 },
    { time: '04:00', users: 380, sessions: 190, messages: 35 },
    { time: '08:00', users: 890, sessions: 445, messages: 78 },
    { time: '12:00', users: 1200, sessions: 600, messages: 95 },
    { time: '16:00', users: 1450, sessions: 725, messages: 110 },
    { time: '20:00', users: 1100, sessions: 550, messages: 85 },
  ]);

  const deviceData = [
    { device: 'Desktop', users: 45, color: '#3B82F6' },
    { device: 'Mobile', users: 35, color: '#10B981' },
    { device: 'Tablet', users: 20, color: '#F59E0B' },
  ];

  const geographicData = [
    { region: 'North America', users: 540, percentage: 43.8 },
    { region: 'Europe', users: 320, percentage: 25.9 },
    { region: 'Asia', users: 280, percentage: 22.7 },
    { region: 'Other', users: 94, percentage: 7.6 },
  ];

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 20 - 10),
        activeSessions: prev.activeSessions + Math.floor(Math.random() * 10 - 5),
        messagesPerMinute: prev.messagesPerMinute + Math.floor(Math.random() * 10 - 5),
        serverLoad: Math.max(0, Math.min(100, prev.serverLoad + Math.random() * 4 - 2))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Users</p>
                <p className="text-2xl font-bold text-white">{liveData.activeUsers.toLocaleString()}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-green-400" />
                <Badge variant="outline" className="text-green-400 animate-pulse">Live</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Sessions</p>
                <p className="text-2xl font-bold text-white">{liveData.activeSessions.toLocaleString()}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-blue-400" />
                <Badge variant="outline" className="text-blue-400 animate-pulse">Live</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Messages/Min</p>
                <p className="text-2xl font-bold text-white">{liveData.messagesPerMinute}</p>
              </div>
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-purple-400" />
                <Badge variant="outline" className="text-purple-400 animate-pulse">Live</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Server Load</p>
                <p className="text-2xl font-bold text-white">{liveData.serverLoad.toFixed(1)}%</p>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                <Badge 
                  variant="outline" 
                  className={`animate-pulse ${
                    liveData.serverLoad > 80 ? 'text-red-400' : 
                    liveData.serverLoad > 60 ? 'text-yellow-400' : 'text-green-400'
                  }`}
                >
                  {liveData.serverLoad > 80 ? 'High' : liveData.serverLoad > 60 ? 'Medium' : 'Low'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Chart */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Real-time Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="users" 
                  stackId="1"
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.3}
                  name="Active Users"
                />
                <Area 
                  type="monotone" 
                  dataKey="sessions" 
                  stackId="2"
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.3}
                  name="Active Sessions"
                />
                <Line 
                  type="monotone" 
                  dataKey="messages" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  name="Messages/Hour"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Device & Geographic Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Monitor className="h-5 w-5 mr-2" />
              Device Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deviceData.map((device, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: device.color }}
                    />
                    <span className="text-white">{device.device}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">{device.users}%</span>
                    <div className="w-20 h-2 bg-gray-700 rounded-full">
                      <div 
                        className="h-2 rounded-full"
                        style={{ 
                          width: `${device.users}%`,
                          backgroundColor: device.color
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Geographic Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {geographicData.map((region, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-white">{region.region}</span>
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-400">{region.users}</span>
                    <Badge variant="outline">{region.percentage}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealTimeMetrics;
