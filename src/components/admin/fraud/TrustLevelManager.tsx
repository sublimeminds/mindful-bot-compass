import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, TrendingUp, Users, Award, Settings, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface TrustLevelManagerProps {
  onStatsUpdate: () => void;
}

const TrustLevelManager: React.FC<TrustLevelManagerProps> = ({ onStatsUpdate }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');

  // Mock data for trust progression
  const trustProgressionData = [
    { date: '2024-01-01', trusted: 45, building: 30, new: 20, suspicious: 5 },
    { date: '2024-01-02', trusted: 48, building: 28, new: 19, suspicious: 5 },
    { date: '2024-01-03', trusted: 52, building: 26, new: 18, suspicious: 4 },
    { date: '2024-01-04', trusted: 55, building: 25, new: 17, suspicious: 3 },
    { date: '2024-01-05', trusted: 58, building: 24, new: 16, suspicious: 2 },
    { date: '2024-01-06', trusted: 61, building: 23, new: 14, suspicious: 2 },
    { date: '2024-01-07', trusted: 65, building: 22, new: 12, suspicious: 1 }
  ];

  const milestoneData = [
    { milestone: 'First Verification', users: 1250, avgTime: '2.3 hours' },
    { milestone: 'Location Confirmed', users: 980, avgTime: '1.2 days' },
    { milestone: 'Payment History', users: 750, avgTime: '3.5 days' },
    { milestone: 'Behavioral Trust', users: 520, avgTime: '7.2 days' },
    { milestone: 'Full Trust Status', users: 320, avgTime: '14.8 days' }
  ];

  const trustRulesConfig = [
    { 
      name: 'Location Consistency',
      weight: 30,
      threshold: 0.8,
      status: 'active',
      description: 'Monitors location changes and IP consistency'
    },
    {
      name: 'Payment Behavior',
      weight: 25,
      threshold: 0.75,
      status: 'active',
      description: 'Analyzes payment patterns and frequency'
    },
    {
      name: 'Device Fingerprinting',
      weight: 20,
      threshold: 0.7,
      status: 'active',
      description: 'Tracks device consistency and browser patterns'
    },
    {
      name: 'Time-based Patterns',
      weight: 15,
      threshold: 0.6,
      status: 'active',
      description: 'Monitors usage timing and session patterns'
    },
    {
      name: 'Social Verification',
      weight: 10,
      threshold: 0.5,
      status: 'disabled',
      description: 'External verification through social media'
    }
  ];

  const currentDistribution = [
    { name: 'Trusted', value: 65, color: '#10B981', count: 3250 },
    { name: 'Building', value: 22, color: '#3B82F6', count: 1100 },
    { name: 'New', value: 12, color: '#6B7280', count: 600 },
    { name: 'Suspicious', value: 1, color: '#EF4444', count: 50 }
  ];

  return (
    <div className="space-y-6">
      {/* Trust Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {currentDistribution.map((level) => (
          <Card key={level.name} className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-400 text-sm">{level.name} Users</p>
                  <p className="text-3xl font-bold text-white">{level.count.toLocaleString()}</p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center`} style={{ backgroundColor: `${level.color}20` }}>
                  <Shield className="h-6 w-6" style={{ color: level.color }} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Progress value={level.value} className="flex-1 mr-3" />
                <span className="text-sm font-bold" style={{ color: level.color }}>
                  {level.value}%
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="progression" className="space-y-6">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="progression" className="data-[state=active]:bg-blue-600">
            <TrendingUp className="h-4 w-4 mr-2" />
            Trust Progression
          </TabsTrigger>
          <TabsTrigger value="milestones" className="data-[state=active]:bg-blue-600">
            <Award className="h-4 w-4 mr-2" />
            Trust Milestones
          </TabsTrigger>
          <TabsTrigger value="rules" className="data-[state=active]:bg-blue-600">
            <Settings className="h-4 w-4 mr-2" />
            Trust Rules
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600">
            <Users className="h-4 w-4 mr-2" />
            Trust Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="progression" className="space-y-6">
          {/* Trust Progression Chart */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Trust Level Progression Over Time
                </span>
                <div className="flex space-x-2">
                  {['7d', '30d', '90d'].map((period) => (
                    <Button
                      key={period}
                      size="sm"
                      variant={selectedTimeframe === period ? 'default' : 'outline'}
                      onClick={() => setSelectedTimeframe(period)}
                    >
                      {period}
                    </Button>
                  ))}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={trustProgressionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9CA3AF"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => new Date(value).getDate().toString()}
                  />
                  <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Line type="monotone" dataKey="trusted" stroke="#10B981" strokeWidth={2} name="Trusted" />
                  <Line type="monotone" dataKey="building" stroke="#3B82F6" strokeWidth={2} name="Building" />
                  <Line type="monotone" dataKey="new" stroke="#6B7280" strokeWidth={2} name="New" />
                  <Line type="monotone" dataKey="suspicious" stroke="#EF4444" strokeWidth={2} name="Suspicious" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Current Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Current Trust Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={currentDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {currentDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Bulk Approve Building Trust
                </Button>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Shield className="h-4 w-4 mr-2" />
                  Run Trust Evaluation
                </Button>
                <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Review Suspicious Cases
                </Button>
                <Button variant="outline" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Adjust Trust Parameters
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Trust Milestones & Progression
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {milestoneData.map((milestone, index) => (
                  <div key={milestone.milestone} className="relative">
                    <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          index === 0 ? 'bg-green-500' : 
                          index <= 2 ? 'bg-blue-500' : 'bg-gray-500'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{milestone.milestone}</h3>
                          <p className="text-gray-400 text-sm">Average completion: {milestone.avgTime}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">{milestone.users}</p>
                        <p className="text-gray-400 text-sm">users completed</p>
                      </div>
                    </div>
                    {index < milestoneData.length - 1 && (
                      <div className="absolute left-5 top-16 w-0.5 h-6 bg-gray-600"></div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Trust Evaluation Rules
                </span>
                <Button size="sm">
                  Save Changes
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {trustRulesConfig.map((rule, index) => (
                  <div key={rule.name} className="p-4 bg-gray-900 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-white font-medium">{rule.name}</h3>
                        <Badge className={rule.status === 'active' ? 'bg-green-600' : 'bg-gray-600'}>
                          {rule.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">{rule.weight}%</p>
                        <p className="text-gray-400 text-sm">weight</p>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{rule.description}</p>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <label className="text-gray-400 text-sm">Threshold</label>
                        <Progress value={rule.threshold * 100} className="mt-1" />
                      </div>
                      <span className="text-sm text-gray-300">{rule.threshold}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Trust Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Avg. Trust Build Time</p>
                    <p className="text-3xl font-bold text-blue-400">12.3</p>
                    <p className="text-gray-400 text-xs">days</p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-400" />
                </div>
                <p className="text-xs text-green-400 mt-2">-2.1 days from last month</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Trust Success Rate</p>
                    <p className="text-3xl font-bold text-green-400">87.2%</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
                <p className="text-xs text-green-400 mt-2">+3.4% from last month</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Escalations</p>
                    <p className="text-3xl font-bold text-yellow-400">24</p>
                    <p className="text-gray-400 text-xs">this week</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-yellow-400" />
                </div>
                <p className="text-xs text-red-400 mt-2">+12 from last week</p>
              </CardContent>
            </Card>
          </div>

          {/* Trust Score Distribution */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Trust Score Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { range: '0-20%', count: 45 },
                  { range: '21-40%', count: 120 },
                  { range: '41-60%', count: 280 },
                  { range: '61-80%', count: 450 },
                  { range: '81-100%', count: 890 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="range" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrustLevelManager;