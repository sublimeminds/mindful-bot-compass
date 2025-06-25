import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Area, AreaChart
} from 'recharts';

const RealAnalyticsDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for demonstration
  const analyticsData = {
    overview: {
      totalSessions: 150,
      averageDuration: 45,
      userEngagement: 85,
      positiveFeedback: 92,
    },
    sessionTrends: [
      { date: 'Jan', sessions: 25 },
      { date: 'Feb', sessions: 30 },
      { date: 'Mar', sessions: 40 },
      { date: 'Apr', sessions: 35 },
      { date: 'May', sessions: 45 },
    ],
    userDemographics: [
      { name: '18-24', value: 400 },
      { name: '25-34', value: 300 },
      { name: '35-44', value: 200 },
      { name: '45+', value: 100 },
    ],
    feedbackBreakdown: [
      { name: 'Positive', value: 92 },
      { name: 'Neutral', value: 5 },
      { name: 'Negative', value: 3 },
    ],
  };

  if (!user) {
    return <div>Please log in to view analytics.</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Real Analytics Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="sessionTrends">Session Trends</TabsTrigger>
              <TabsTrigger value="userDemographics">User Demographics</TabsTrigger>
              <TabsTrigger value="feedbackBreakdown">Feedback Breakdown</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Sessions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.overview.totalSessions}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Average Duration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.overview.averageDuration} mins</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>User Engagement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.overview.userEngagement}%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Positive Feedback</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.overview.positiveFeedback}%</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="sessionTrends">
              <Card>
                <CardHeader>
                  <CardTitle>Session Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analyticsData.sessionTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="sessions" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="userDemographics">
              <Card>
                <CardHeader>
                  <CardTitle>User Demographics</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analyticsData.userDemographics}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label
                      >
                        {analyticsData.userDemographics.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`#${((index + 1) * 555).toString(16)}`} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="feedbackBreakdown">
              <Card>
                <CardHeader>
                  <CardTitle>Feedback Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData.feedbackBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealAnalyticsDashboard;
