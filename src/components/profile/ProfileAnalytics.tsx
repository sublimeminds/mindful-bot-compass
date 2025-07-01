
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Activity, Heart, Brain, BarChart3 } from 'lucide-react';
import { useAdvancedAnalytics } from '@/hooks/useAdvancedAnalytics';
import { useNavigate } from 'react-router-dom';

const ProfileAnalytics = () => {
  const navigate = useNavigate();
  const { data, predictiveInsights } = useAdvancedAnalytics('30d');
  const moodData = [
    { date: '2024-01-01', mood: 6, anxiety: 4, stress: 5 },
    { date: '2024-01-02', mood: 7, anxiety: 3, stress: 4 },
    { date: '2024-01-03', mood: 5, anxiety: 6, stress: 7 },
    { date: '2024-01-04', mood: 8, anxiety: 2, stress: 3 },
    { date: '2024-01-05', mood: 7, anxiety: 3, stress: 4 },
    { date: '2024-01-06', mood: 9, anxiety: 1, stress: 2 },
    { date: '2024-01-07', mood: 8, anxiety: 2, stress: 3 }
  ];

  const sessionData = [
    { week: 'Week 1', sessions: 3, duration: 45 },
    { week: 'Week 2', sessions: 4, duration: 52 },
    { week: 'Week 3', sessions: 2, duration: 38 },
    { week: 'Week 4', sessions: 5, duration: 61 }
  ];

  const techniqueData = [
    { name: 'CBT', sessions: 12, color: '#8B5CF6' },
    { name: 'Mindfulness', sessions: 8, color: '#06B6D4' },
    { name: 'Journaling', sessions: 6, color: '#10B981' },
    { name: 'Breathing', sessions: 4, color: '#F59E0B' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Mood Trends */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="h-5 w-5 mr-2" />
            Mood & Wellness Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moodData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Line type="monotone" dataKey="mood" stroke="#8B5CF6" strokeWidth={2} name="Mood" />
                <Line type="monotone" dataKey="anxiety" stroke="#EF4444" strokeWidth={2} name="Anxiety" />
                <Line type="monotone" dataKey="stress" stroke="#F59E0B" strokeWidth={2} name="Stress" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Session Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Session Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sessionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sessions" fill="#06B6D4" name="Sessions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Technique Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            Therapy Techniques Used
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={techniqueData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="sessions"
                  label={({ name, sessions }) => `${name}: ${sessions}`}
                >
                  {techniqueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Progress Metrics */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Progress Metrics
            </div>
            <Button 
              onClick={() => navigate('/analytics')} 
              variant="outline" 
              size="sm"
              className="flex items-center"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-therapy-600">
                {data.sessionEffectiveness.overall_rating.toFixed(1) || '8.5'}
              </div>
              <p className="text-sm text-muted-foreground">Session Rating</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-calm-600">
                {data.goalAnalytics.completion_rate.toFixed(0) || '72'}%
              </div>
              <p className="text-sm text-muted-foreground">Goal Completion</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-flow-600">
                {predictiveInsights.predictedOutcomes.confidence.toFixed(0) || '85'}%
              </div>
              <p className="text-sm text-muted-foreground">Prediction Confidence</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-harmony-600">
                {data.sessionEffectiveness.mood_improvement_rate.toFixed(0) || '68'}%
              </div>
              <p className="text-sm text-muted-foreground">Mood Improvement</p>
            </div>
          </div>

          {/* Quick Insights */}
          {predictiveInsights.recommendations.length > 0 && (
            <div className="mt-6 p-4 bg-therapy-50 rounded-lg border border-therapy-200">
              <h4 className="font-medium text-therapy-900 mb-2">AI Insight</h4>
              <p className="text-sm text-therapy-700">
                {predictiveInsights.recommendations[0]}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileAnalytics;
