
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, BarChart3, TrendingUp, Calendar, Brain, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import SessionAnalyticsDashboard from "@/components/analytics/SessionAnalyticsDashboard";
import { useSessionHistory } from "@/hooks/useSessionHistory";
import { useSessionStats } from "@/hooks/useSessionStats";
import Header from "@/components/Header";

const SessionAnalytics = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  const { sessionSummaries, isLoading: sessionsLoading } = useSessionHistory();
  const { stats, isLoading: statsLoading } = useSessionStats();

  if (sessionsLoading || statsLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-8">Loading analytics...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold flex items-center">
                  <BarChart3 className="h-6 w-6 mr-2" />
                  Session Analytics
                </h1>
                <p className="text-muted-foreground">
                  Comprehensive insights into your therapy progress and patterns
                </p>
              </div>
            </div>
          </div>

          {/* Quick Overview Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Sessions</p>
                      <p className="text-2xl font-bold">{stats.totalSessions}</p>
                    </div>
                    <Calendar className="h-6 w-6 text-therapy-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">This Week</p>
                      <p className="text-2xl font-bold">{stats.weeklyProgress}</p>
                    </div>
                    <Target className="h-6 w-6 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Improvement</p>
                      <p className="text-2xl font-bold">+{stats.averageMoodImprovement.toFixed(1)}</p>
                    </div>
                    <TrendingUp className="h-6 w-6 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Messages</p>
                      <p className="text-2xl font-bold">{stats.totalMessages}</p>
                    </div>
                    <Brain className="h-6 w-6 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Analytics Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="progress" className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Progress</span>
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center space-x-2">
                <Brain className="h-4 w-4" />
                <span>Insights</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {sessionSummaries.length > 0 ? (
                <SessionAnalyticsDashboard />
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No session data yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Complete some therapy sessions to see your analytics
                    </p>
                    <Button onClick={() => navigate('/chat')}>
                      <Brain className="h-4 w-4 mr-2" />
                      Start Your First Session
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="progress" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Progress Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Detailed progress tracking coming soon
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>AI-Powered Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      AI insights and recommendations coming soon
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default SessionAnalytics;
