
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, LineChart, Line } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Brain, TrendingUp, MessageSquare, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TherapistPerformance {
  id: string;
  name: string;
  title: string;
  sessionsCount: number;
  averageRating: number;
  moodImprovement: number;
  responseTime: number;
  completionRate: number;
  specialties: string[];
}

interface PerformanceData {
  therapists: TherapistPerformance[];
  usageDistribution: Array<{ name: string; sessions: number; color: string }>;
  effectivenessData: Array<{ name: string; improvement: number; satisfaction: number }>;
  trendsData: Array<{ month: string; sessions: number; satisfaction: number }>;
}

const TherapistPerformanceData = () => {
  const [data, setData] = useState<PerformanceData>({
    therapists: [],
    usageDistribution: [],
    effectivenessData: [],
    trendsData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTherapistData();
  }, []);

  const fetchTherapistData = async () => {
    try {
      setLoading(true);

      // Get all therapist personalities
      const { data: therapists } = await supabase
        .from('therapist_personalities')
        .select('*')
        .eq('is_active', true);

      // Get therapist compatibility data
      const { data: compatibilityData } = await supabase
        .from('therapist_compatibility')
        .select('*');

      // Get session analytics for effectiveness data
      const { data: sessionAnalytics } = await supabase
        .from('session_analytics')
        .select('*');

      // Calculate performance metrics for each therapist
      const therapistPerformance: TherapistPerformance[] = (therapists || []).map(therapist => {
        const compatibilities = compatibilityData?.filter(c => c.therapist_id === therapist.id) || [];
        
        const sessionsCount = compatibilities.reduce((sum, c) => sum + c.session_count, 0);
        const averageRating = compatibilities.length > 0
          ? compatibilities.reduce((sum, c) => sum + (c.average_rating || 0), 0) / compatibilities.length
          : 0;

        // Mock additional metrics (in real app, these would be calculated from actual data)
        const moodImprovement = Math.random() * 3 + 1; // 1-4 improvement
        const responseTime = Math.random() * 60 + 30; // 30-90 seconds
        const completionRate = Math.random() * 20 + 80; // 80-100%

        return {
          id: therapist.id,
          name: therapist.name,
          title: therapist.title,
          sessionsCount,
          averageRating: Math.round(averageRating * 10) / 10,
          moodImprovement: Math.round(moodImprovement * 10) / 10,
          responseTime: Math.round(responseTime),
          completionRate: Math.round(completionRate),
          specialties: therapist.specialties || []
        };
      });

      // Sort by sessions count
      therapistPerformance.sort((a, b) => b.sessionsCount - a.sessionsCount);

      // Create usage distribution
      const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
      const usageDistribution = therapistPerformance.slice(0, 6).map((therapist, index) => ({
        name: therapist.name,
        sessions: therapist.sessionsCount,
        color: colors[index % colors.length]
      }));

      // Create effectiveness data
      const effectivenessData = therapistPerformance.slice(0, 8).map(therapist => ({
        name: therapist.name.split(' ')[0], // First name only for chart
        improvement: therapist.moodImprovement,
        satisfaction: therapist.averageRating
      }));

      // Mock trends data (last 6 months)
      const trendsData = [];
      const monthNames = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      for (let i = 0; i < 6; i++) {
        trendsData.push({
          month: monthNames[i],
          sessions: Math.floor(Math.random() * 200) + 100,
          satisfaction: Math.random() * 1 + 4 // 4-5 rating
        });
      }

      setData({
        therapists: therapistPerformance,
        usageDistribution,
        effectivenessData,
        trendsData
      });
    } catch (error) {
      console.error('Error fetching therapist data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-600 rounded mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-600 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Performing Therapists */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Therapist Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.therapists.slice(0, 5).map((therapist, index) => (
              <div key={therapist.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                    <Avatar>
                      <AvatarFallback className="bg-blue-600 text-white">
                        <Brain className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{therapist.name}</h3>
                    <p className="text-sm text-gray-400">{therapist.title}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      {therapist.specialties.slice(0, 2).map((specialty, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-white">{therapist.sessionsCount}</div>
                    <div className="text-xs text-gray-400">Sessions</div>
                  </div>
                  <div>
                    <div className="flex items-center text-lg font-bold text-white">
                      <Star className="h-3 w-3 mr-1 text-yellow-400" />
                      {therapist.averageRating || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-400">Rating</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">+{therapist.moodImprovement}</div>
                    <div className="text-xs text-gray-400">Mood ↑</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">{therapist.completionRate}%</div>
                    <div className="text-xs text-gray-400">Complete</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Distribution */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Session Distribution by Therapist</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                sessions: {
                  label: "Sessions",
                  color: "#3b82f6",
                },
              }}
              className="h-64"
            >
              <BarChart data={data.usageDistribution} layout="horizontal">
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="sessions" fill="#3b82f6" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Effectiveness Comparison */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Effectiveness vs Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                improvement: {
                  label: "Mood Improvement",
                  color: "#10b981",
                },
                satisfaction: {
                  label: "User Satisfaction",
                  color: "#f59e0b",
                },
              }}
              className="h-64"
            >
              <BarChart data={data.effectivenessData}>
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="improvement" fill="#10b981" name="Mood Improvement" />
                <Bar dataKey="satisfaction" fill="#f59e0b" name="Satisfaction" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Trends Over Time */}
        <Card className="bg-gray-800 border-gray-700 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Therapist Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                sessions: {
                  label: "Total Sessions",
                  color: "#3b82f6",
                },
                satisfaction: {
                  label: "Avg Satisfaction",
                  color: "#f59e0b",
                },
              }}
              className="h-64"
            >
              <LineChart data={data.trendsData}>
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="sessions" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Sessions"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="satisfaction" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  name="Satisfaction"
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TherapistPerformanceData;
