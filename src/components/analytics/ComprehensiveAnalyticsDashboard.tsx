
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { 
  TrendingUp, 
  Activity, 
  Users, 
  Clock,
  Target,
  Brain,
  Heart,
  Calendar as CalendarIcon,
  Download,
  Share2,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';

const ComprehensiveAnalyticsDashboard = () => {
  const [selectedMetric, setSelectedMetric] = useState('mood');
  const [dateRange, setDateRange] = useState('30d');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Sample data
  const moodData = [
    { date: '2024-01-01', mood: 7, sessions: 2, stress: 4 },
    { date: '2024-01-02', mood: 6, sessions: 1, stress: 5 },
    { date: '2024-01-03', mood: 8, sessions: 2, stress: 3 },
    { date: '2024-01-04', mood: 7, sessions: 1, stress: 4 },
    { date: '2024-01-05', mood: 9, sessions: 3, stress: 2 },
    { date: '2024-01-06', mood: 6, sessions: 1, stress: 6 },
    { date: '2024-01-07', mood: 8, sessions: 2, stress: 3 }
  ];

  const sessionTypeData = [
    { name: 'Anxiety Management', value: 35, color: '#3b82f6' },
    { name: 'Mood Tracking', value: 25, color: '#10b981' },
    { name: 'Stress Relief', value: 20, color: '#f59e0b' },
    { name: 'Sleep Improvement', value: 15, color: '#8b5cf6' },
    { name: 'Goal Setting', value: 5, color: '#ef4444' }
  ];

  const weeklyProgressData = [
    { week: 'Week 1', completed: 5, planned: 7, completion: 71 },
    { week: 'Week 2', completed: 6, planned: 7, completion: 86 },
    { week: 'Week 3', completed: 4, planned: 6, completion: 67 },
    { week: 'Week 4', completed: 7, planned: 8, completion: 88 }
  ];

  const metrics = [
    {
      title: 'Average Mood',
      value: '7.2',
      change: '+0.5',
      changeType: 'positive',
      icon: Heart,
      color: 'text-pink-500'
    },
    {
      title: 'Sessions Completed',
      value: '24',
      change: '+12%',
      changeType: 'positive',
      icon: Activity,
      color: 'text-blue-500'
    },
    {
      title: 'Goals Achieved',
      value: '8/12',
      change: '67%',
      changeType: 'neutral',
      icon: Target,
      color: 'text-green-500'
    },
    {
      title: 'Stress Level',
      value: '3.8',
      change: '-1.2',
      changeType: 'positive',
      icon: Brain,
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">Comprehensive insights into your mental wellness journey</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {selectedDate ? format(selectedDate, 'MMM dd') : 'Pick date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-2xl font-bold">{metric.value}</span>
                      <Badge 
                        variant={metric.changeType === 'positive' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {metric.change}
                      </Badge>
                    </div>
                  </div>
                  <IconComponent className={`h-8 w-8 ${metric.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Mood Trends</TabsTrigger>
          <TabsTrigger value="sessions">Session Analysis</TabsTrigger>
          <TabsTrigger value="progress">Weekly Progress</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-therapy-600" />
                <span>Mood & Stress Trends</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={moodData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(value) => format(new Date(value), 'MMM dd')} />
                    <YAxis domain={[0, 10]} />
                    <Tooltip 
                      labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
                      formatter={(value, name) => [value, name === 'mood' ? 'Mood Score' : 'Stress Level']}
                    />
                    <Line type="monotone" dataKey="mood" stroke="#3b82f6" strokeWidth={2} name="mood" />
                    <Line type="monotone" dataKey="stress" stroke="#ef4444" strokeWidth={2} name="stress" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Session Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sessionTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {sessionTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {sessionTypeData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daily Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={moodData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={(value) => format(new Date(value), 'dd')} />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="sessions" 
                        stroke="#10b981" 
                        fill="#10b981" 
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Goal Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyProgressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="completed" fill="#3b82f6" name="Completed" />
                    <Bar dataKey="planned" fill="#e5e7eb" name="Planned" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  <span>AI-Generated Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Pattern Recognition</h4>
                  <p className="text-sm text-blue-700">
                    Your mood tends to improve significantly after therapy sessions, particularly on weekends.
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Positive Trend</h4>
                  <p className="text-sm text-green-700">
                    Stress levels have decreased by 24% over the past month with consistent session attendance.
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium text-yellow-900 mb-2">Recommendation</h4>
                  <p className="text-sm text-yellow-700">
                    Consider scheduling sessions earlier in the day for optimal mood impact.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Achievement Milestones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Target className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">30-Day Streak</p>
                    <p className="text-sm text-muted-foreground">Completed daily mood tracking</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Activity className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Session Milestone</p>
                    <p className="text-sm text-muted-foreground">Completed 25 therapy sessions</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Brain className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Improvement Badge</p>
                    <p className="text-sm text-muted-foreground">Stress reduction champion</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComprehensiveAnalyticsDashboard;
