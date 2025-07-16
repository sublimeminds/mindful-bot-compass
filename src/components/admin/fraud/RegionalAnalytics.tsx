import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Globe, TrendingUp, MapPin, Shield, DollarSign, Users } from 'lucide-react';

const RegionalAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('incidents');

  // Mock data - in real implementation, fetch from Supabase
  const countryData = [
    { country: 'United States', incidents: 45, revenue: 125000, users: 2500, trustScore: 95 },
    { country: 'India', incidents: 89, revenue: 15000, users: 1800, trustScore: 72 },
    { country: 'Brazil', incidents: 34, revenue: 42000, users: 900, trustScore: 85 },
    { country: 'Argentina', incidents: 67, revenue: 8500, users: 650, trustScore: 68 },
    { country: 'Pakistan', incidents: 23, revenue: 3200, users: 450, trustScore: 61 },
    { country: 'Bangladesh', incidents: 18, revenue: 2100, users: 320, trustScore: 58 }
  ];

  const fraudTrendData = [
    { date: '2024-01-01', incidents: 12, prevented: 8 },
    { date: '2024-01-02', incidents: 15, prevented: 12 },
    { date: '2024-01-03', incidents: 8, prevented: 6 },
    { date: '2024-01-04', incidents: 22, prevented: 18 },
    { date: '2024-01-05', incidents: 18, prevented: 14 },
    { date: '2024-01-06', incidents: 25, prevented: 21 },
    { date: '2024-01-07', incidents: 14, prevented: 11 }
  ];

  const discountAbuseData = [
    { name: 'Legitimate', value: 78, color: '#10B981' },
    { name: 'Suspicious', value: 15, color: '#F59E0B' },
    { name: 'Fraudulent', value: 7, color: '#EF4444' }
  ];

  const trustDistributionData = [
    { name: 'Trusted', value: 65, color: '#10B981' },
    { name: 'Building', value: 25, color: '#3B82F6' },
    { name: 'New', value: 8, color: '#6B7280' },
    { name: 'Suspicious', value: 2, color: '#EF4444' }
  ];

  const getMetricValue = (country: any, metric: string) => {
    switch (metric) {
      case 'incidents':
        return country.incidents;
      case 'revenue':
        return `$${(country.revenue / 1000).toFixed(0)}k`;
      case 'users':
        return country.users;
      case 'trustScore':
        return `${country.trustScore}%`;
      default:
        return country.incidents;
    }
  };

  const getMetricColor = (country: any, metric: string) => {
    const value = metric === 'incidents' ? country.incidents : country.trustScore;
    if (metric === 'incidents') {
      return value > 50 ? 'text-red-400' : value > 20 ? 'text-yellow-400' : 'text-green-400';
    } else {
      return value > 80 ? 'text-green-400' : value > 60 ? 'text-yellow-400' : 'text-red-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="incidents">Incidents</SelectItem>
              <SelectItem value="revenue">Revenue</SelectItem>
              <SelectItem value="users">Users</SelectItem>
              <SelectItem value="trustScore">Trust Score</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Badge className="bg-blue-600 text-white">
          <Globe className="h-4 w-4 mr-1" />
          Global Overview
        </Badge>
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Country Rankings */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Country Analytics ({selectedMetric})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {countryData.map((country, index) => (
                <div key={country.country} className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="w-8 text-center">
                      #{index + 1}
                    </Badge>
                    <span className="text-white font-medium">{country.country}</span>
                  </div>
                  <div className="text-right">
                    <span className={`font-bold ${getMetricColor(country, selectedMetric)}`}>
                      {getMetricValue(country, selectedMetric)}
                    </span>
                    {selectedMetric === 'incidents' && (
                      <div className="text-xs text-gray-400">
                        Trust: {country.trustScore}%
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Fraud Trends */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Fraud Detection Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={fraudTrendData}>
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
                <Line 
                  type="monotone" 
                  dataKey="incidents" 
                  stroke="#EF4444" 
                  strokeWidth={2}
                  name="Fraud Attempts"
                />
                <Line 
                  type="monotone" 
                  dataKey="prevented" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Prevented"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Trust Distribution */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Trust Level Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={trustDistributionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {trustDistributionData.map((entry, index) => (
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

        {/* Discount Abuse Analysis */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Discount Usage Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={discountAbuseData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {discountAbuseData.map((entry, index) => (
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
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Detection Rate</p>
                <p className="text-3xl font-bold text-green-400">94.2%</p>
              </div>
              <Shield className="h-8 w-8 text-green-400" />
            </div>
            <p className="text-xs text-gray-400 mt-2">+2.1% from last week</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">False Positives</p>
                <p className="text-3xl font-bold text-yellow-400">3.8%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-400" />
            </div>
            <p className="text-xs text-gray-400 mt-2">-0.5% from last week</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Protected Revenue</p>
                <p className="text-3xl font-bold text-blue-400">$847k</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-400" />
            </div>
            <p className="text-xs text-gray-400 mt-2">+15.3% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Response Time</p>
                <p className="text-3xl font-bold text-purple-400">2.4s</p>
              </div>
              <Users className="h-8 w-8 text-purple-400" />
            </div>
            <p className="text-xs text-gray-400 mt-2">-0.3s from last week</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegionalAnalytics;