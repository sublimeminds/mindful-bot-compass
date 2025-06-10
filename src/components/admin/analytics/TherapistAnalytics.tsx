
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Brain, 
  Heart, 
  Zap,
  Star,
  Users,
  Clock,
  MessageSquare,
  TrendingUp
} from 'lucide-react';

interface TherapistAnalyticsProps {
  dateRange: { from: Date; to: Date };
}

const TherapistAnalytics = ({ dateRange }: TherapistAnalyticsProps) => {
  const [selectedView, setSelectedView] = useState<'performance' | 'preferences' | 'effectiveness'>('performance');

  const therapistData = [
    {
      id: '1',
      name: 'Dr. Sarah Empathy',
      icon: 'Heart',
      totalSessions: 1247,
      avgRating: 4.8,
      userSatisfaction: 94.2,
      responseTime: 2.3,
      specialties: ['Anxiety', 'Depression'],
      color: '#EF4444'
    },
    {
      id: '2',
      name: 'Prof. Marcus Logic',
      icon: 'Brain',
      totalSessions: 1089,
      avgRating: 4.6,
      userSatisfaction: 91.7,
      responseTime: 1.8,
      specialties: ['CBT', 'Problem Solving'],
      color: '#3B82F6'
    },
    {
      id: '3',
      name: 'Alex Motivator',
      icon: 'Zap',
      totalSessions: 956,
      avgRating: 4.7,
      userSatisfaction: 92.8,
      responseTime: 2.1,
      specialties: ['Motivation', 'Goal Setting'],
      color: '#F59E0B'
    }
  ];

  const personalityEffectiveness = [
    { personality: 'Empathetic', effectiveness: 94, sessions: 1247, userRetention: 89 },
    { personality: 'Analytical', effectiveness: 87, sessions: 1089, userRetention: 82 },
    { personality: 'Motivational', effectiveness: 91, sessions: 956, userRetention: 85 },
  ];

  const userPreferences = [
    { personality: 'Empathetic', percentage: 45, color: '#EF4444' },
    { personality: 'Analytical', percentage: 32, color: '#3B82F6' },
    { personality: 'Motivational', percentage: 23, color: '#F59E0B' },
  ];

  const effectivenessMetrics = [
    { metric: 'User Satisfaction', empathetic: 94, analytical: 87, motivational: 91 },
    { metric: 'Session Completion', empathetic: 92, analytical: 89, motivational: 88 },
    { metric: 'Goal Achievement', empathetic: 78, analytical: 84, motivational: 89 },
    { metric: 'User Retention', empathetic: 89, analytical: 82, motivational: 85 },
    { metric: 'Response Quality', empathetic: 91, analytical: 93, motivational: 87 },
  ];

  const sessionTrends = [
    { week: 'Week 1', empathetic: 287, analytical: 234, motivational: 198 },
    { week: 'Week 2', empathetic: 312, analytical: 267, motivational: 223 },
    { week: 'Week 3', empathetic: 334, analytical: 289, motivational: 245 },
    { week: 'Week 4', empathetic: 314, analytical: 299, motivational: 290 },
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Heart': return <Heart className="h-5 w-5" />;
      case 'Brain': return <Brain className="h-5 w-5" />;
      case 'Zap': return <Zap className="h-5 w-5" />;
      default: return <Brain className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* View Selection */}
      <div className="flex space-x-4">
        <Button
          variant={selectedView === 'performance' ? 'default' : 'outline'}
          onClick={() => setSelectedView('performance')}
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          Performance
        </Button>
        <Button
          variant={selectedView === 'preferences' ? 'default' : 'outline'}
          onClick={() => setSelectedView('preferences')}
        >
          <Users className="h-4 w-4 mr-2" />
          User Preferences
        </Button>
        <Button
          variant={selectedView === 'effectiveness' ? 'default' : 'outline'}
          onClick={() => setSelectedView('effectiveness')}
        >
          <Star className="h-4 w-4 mr-2" />
          Effectiveness
        </Button>
      </div>

      {/* Therapist Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {therapistData.map((therapist) => (
          <Card key={therapist.id} className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div 
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: `${therapist.color}20` }}
                >
                  <div style={{ color: therapist.color }}>
                    {getIcon(therapist.icon)}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-white">{therapist.name}</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {therapist.specialties.map((specialty) => (
                      <Badge key={specialty} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Sessions</span>
                  <span className="text-white">{therapist.totalSessions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Rating</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="text-white">{therapist.avgRating}</span>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Satisfaction</span>
                  <span className="text-white">{therapist.userSatisfaction}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Response Time</span>
                  <span className="text-white">{therapist.responseTime}s</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedView === 'performance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Session Trends */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Session Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sessionTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="week" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="empathetic" fill="#EF4444" name="Empathetic" />
                    <Bar dataKey="analytical" fill="#3B82F6" name="Analytical" />
                    <Bar dataKey="motivational" fill="#F59E0B" name="Motivational" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Personality Effectiveness */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Personality Effectiveness</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {personalityEffectiveness.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white">{item.personality}</span>
                      <Badge variant="outline">{item.effectiveness}%</Badge>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${item.effectiveness}%`,
                          backgroundColor: index === 0 ? '#EF4444' : index === 1 ? '#3B82F6' : '#F59E0B'
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>{item.sessions} sessions</span>
                      <span>{item.userRetention}% retention</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedView === 'preferences' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Preference Distribution */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">User Preference Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={userPreferences}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="percentage"
                    >
                      {userPreferences.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center space-x-6 mt-4">
                {userPreferences.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-400">{item.personality}</span>
                    <span className="text-sm text-white">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Matching Success Rate */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Therapist Matching Success</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white">87.3%</div>
                  <div className="text-gray-400">Overall Match Success Rate</div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">First Match Success</span>
                    <span className="text-white">73.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">User Satisfaction with Match</span>
                    <span className="text-white">89.7%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Switch Rate</span>
                    <span className="text-white">12.4%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Avg Sessions Before Switch</span>
                    <span className="text-white">3.2</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedView === 'effectiveness' && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Comparative Effectiveness Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={effectivenessMetrics}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]} 
                    tick={{ fill: '#9CA3AF', fontSize: 10 }}
                  />
                  <Radar
                    name="Empathetic"
                    dataKey="empathetic"
                    stroke="#EF4444"
                    fill="#EF4444"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                  <Radar
                    name="Analytical"
                    dataKey="analytical"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                  <Radar
                    name="Motivational"
                    dataKey="motivational"
                    stroke="#F59E0B"
                    fill="#F59E0B"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TherapistAnalytics;
