
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, MessageCircle, Activity } from 'lucide-react';

const RealTimeMetrics = () => {
  const [activeUsers, setActiveUsers] = useState(247);
  const [sessionsData, setSessionsData] = useState([
    { time: '00:00', sessions: 12, users: 45 },
    { time: '04:00', sessions: 8, users: 32 },
    { time: '08:00', sessions: 28, users: 89 },
    { time: '12:00', sessions: 45, users: 156 },
    { time: '16:00', sessions: 67, users: 203 },
    { time: '20:00', sessions: 34, users: 178 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates
      setActiveUsers(prev => prev + Math.floor(Math.random() * 10) - 5);
      
      setSessionsData(prev => {
        const newData = [...prev];
        newData.push({
          time: new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          }),
          sessions: Math.floor(Math.random() * 80) + 20,
          users: Math.floor(Math.random() * 250) + 100
        });
        return newData.slice(-10); // Keep only last 10 data points
      });
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center space-x-2">
            <Activity className="h-5 w-5 text-blue-400" />
            <span>Real-time Activity</span>
          </CardTitle>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-400">Live</span>
            </div>
            <Badge variant="outline" className="border-green-400 text-green-400">
              {activeUsers} Active
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Users className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-gray-400">Online Users</span>
            </div>
            <div className="text-2xl font-bold text-white">{activeUsers}</div>
            <div className="text-xs text-green-400">+12% from yesterday</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <MessageCircle className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-gray-400">Active Sessions</span>
            </div>
            <div className="text-2xl font-bold text-white">89</div>
            <div className="text-xs text-green-400">+5% from last hour</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <TrendingUp className="h-4 w-4 text-orange-400" />
              <span className="text-sm text-gray-400">Response Time</span>
            </div>
            <div className="text-2xl font-bold text-white">1.2s</div>
            <div className="text-xs text-green-400">-0.3s improvement</div>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sessionsData}>
              <defs>
                <linearGradient id="sessionsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="time" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }} 
              />
              <Area
                type="monotone"
                dataKey="sessions"
                stroke="#8884d8"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#sessionsGradient)"
                name="Sessions"
              />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#82ca9d"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#usersGradient)"
                name="Users"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeMetrics;
