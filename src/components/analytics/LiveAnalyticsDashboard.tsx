import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Brain, 
  AlertTriangle, 
  TrendingUp, 
  Clock,
  Target,
  Heart,
  Zap
} from 'lucide-react';
import { liveAnalyticsService } from '@/services/liveAnalyticsService';
import { useSimpleApp } from '@/hooks/useSimpleApp';

interface AnalyticsData {
  recent_events: any[];
  session_analytics: any[];
  summary: {
    total_events: number;
    crisis_events: number;
    breakthrough_events: number;
    average_quality_score: number;
    intervention_needed: boolean;
  };
}

const LiveAnalyticsDashboard = () => {
  const { user } = useSimpleApp();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const loadAnalytics = async () => {
      try {
        setLoading(true);
        const data = await liveAnalyticsService.getDashboardData(user.id);
        setAnalyticsData(data);
      } catch (err) {
        console.error('Error loading analytics:', err);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();

    // Start live analytics
    liveAnalyticsService.startAnalytics();

    // Refresh data every 30 seconds
    const interval = setInterval(loadAnalytics, 30000);

    return () => {
      clearInterval(interval);
      liveAnalyticsService.stopAnalytics();
    };
  }, [user?.id]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'crisis': return 'destructive';
      case 'high': return 'secondary';
      case 'elevated': return 'outline';
      default: return 'default';
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'crisis_indicator': return AlertTriangle;
      case 'breakthrough': return Zap;
      case 'mood_change': return Heart;
      case 'technique_applied': return Target;
      default: return Activity;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <Activity className="h-5 w-5 animate-spin" />
          <span>Loading analytics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold">{analyticsData?.summary.total_events || 0}</p>
              </div>
              <Activity className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Breakthrough Moments</p>
                <p className="text-2xl font-bold">{analyticsData?.summary.breakthrough_events || 0}</p>
              </div>
              <Zap className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Session Quality</p>
                <p className="text-2xl font-bold">
                  {(analyticsData?.summary.average_quality_score * 100 || 0).toFixed(0)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Intervention Status</p>
                <Badge variant={analyticsData?.summary.intervention_needed ? 'destructive' : 'default'}>
                  {analyticsData?.summary.intervention_needed ? 'Needed' : 'Stable'}
                </Badge>
              </div>
              <Brain className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">Recent Events</TabsTrigger>
          <TabsTrigger value="sessions">Session Analysis</TabsTrigger>
          <TabsTrigger value="patterns">Pattern Recognition</TabsTrigger>
        </TabsList>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5" />
                Live Event Stream
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {analyticsData?.recent_events.map((event, index) => {
                    const Icon = getEventIcon(event.event_type);
                    return (
                      <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border">
                        <Icon className="h-5 w-5 text-primary mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium capitalize">
                              {event.event_type.replace('_', ' ')}
                            </p>
                            <div className="flex items-center space-x-2">
                              <Badge variant={getSeverityColor(event.severity_level)}>
                                {event.severity_level}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                <Clock className="inline h-3 w-3 mr-1" />
                                {new Date(event.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                          {event.event_data && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {event.event_data.message_analysis?.themes?.join(', ') ||
                               event.event_data.technique ||
                               'Event processed'}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {(!analyticsData?.recent_events || analyticsData.recent_events.length === 0) && (
                    <div className="text-center text-muted-foreground py-8">
                      <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No recent events to display</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="mr-2 h-5 w-5" />
                Session Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {analyticsData?.session_analytics.map((session, index) => (
                    <div key={index} className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-medium">
                          Session {session.session_id.slice(-8)}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Badge variant={session.intervention_needed ? 'destructive' : 'default'}>
                            Quality: {(session.session_quality_score * 100).toFixed(0)}%
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(session.analysis_timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Primary Emotion</p>
                          <p className="font-medium capitalize">
                            {session.emotion_scores?.current_emotion || 'Unknown'}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Crisis Risk</p>
                          <p className="font-medium">
                            {((session.crisis_indicators?.risk_level || 0) * 100).toFixed(0)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Engagement</p>
                          <p className="font-medium">
                            {((session.engagement_metrics?.overall_engagement || 0) * 100).toFixed(0)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Breakthroughs</p>
                          <p className="font-medium">
                            {session.breakthrough_moments?.length || 0}
                          </p>
                        </div>
                      </div>

                      {session.approach_recommendations && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-sm text-muted-foreground">Recommended Approach:</p>
                          <p className="text-sm font-medium">
                            {session.approach_recommendations.primary}
                            {session.approach_recommendations.secondary && 
                              ` + ${session.approach_recommendations.secondary}`}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                  {(!analyticsData?.session_analytics || analyticsData.session_analytics.length === 0) && (
                    <div className="text-center text-muted-foreground py-8">
                      <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No session analytics available</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Pattern Recognition
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Emotional Patterns</h4>
                  <div className="text-sm text-muted-foreground">
                    Pattern analysis will be enhanced as more session data is collected.
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Technique Effectiveness</h4>
                  <div className="text-sm text-muted-foreground">
                    Machine learning models will identify the most effective therapeutic techniques for your specific needs.
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Crisis Prediction</h4>
                  <div className="text-sm text-muted-foreground">
                    Advanced algorithms will learn to predict and prevent crisis situations before they occur.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LiveAnalyticsDashboard;