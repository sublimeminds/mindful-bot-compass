import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Activity, 
  AlertTriangle, 
  Brain, 
  Heart, 
  TrendingUp, 
  Users,
  Clock,
  Target,
  Lightbulb,
  Shield
} from 'lucide-react';

interface TherapySessionMetrics {
  sessionId: string;
  userId: string;
  currentPhase: string;
  engagementLevel: number;
  therapeuticAlliance: number;
  crisisLevel: string;
  breakthroughProbability: number;
  lastUpdate: string;
}

interface CrisisAlert {
  sessionId: string;
  crisisLevel: string;
  riskScore: number;
  escalationTriggered: boolean;
  timestamp: string;
}

interface QualityMetrics {
  averageEngagement: number;
  averageAlliance: number;
  totalSessions: number;
  activeSessions: number;
  crisisInterventions: number;
  breakthroughMoments: number;
}

export const TherapyMonitoringDashboard: React.FC = () => {
  const [activeSessions, setActiveSessions] = useState<TherapySessionMetrics[]>([]);
  const [crisisAlerts, setCrisisAlerts] = useState<CrisisAlert[]>([]);
  const [qualityMetrics, setQualityMetrics] = useState<QualityMetrics>({
    averageEngagement: 0,
    averageAlliance: 0,
    totalSessions: 0,
    activeSessions: 0,
    crisisInterventions: 0,
    breakthroughMoments: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchActiveSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('session_real_time_status')
        .select('*')
        .order('last_update', { ascending: false });

      if (error) throw error;
      
      const sessions = data?.map(session => ({
        sessionId: session.session_id,
        userId: session.user_id,
        currentPhase: session.current_phase,
        engagementLevel: session.engagement_level || 0,
        therapeuticAlliance: session.therapeutic_alliance_score || 0,
        crisisLevel: session.crisis_level || 'none',
        breakthroughProbability: session.breakthrough_probability || 0,
        lastUpdate: session.last_update
      })) || [];

      setActiveSessions(sessions);
    } catch (error) {
      console.error('Error fetching active sessions:', error);
    }
  };

  const fetchCrisisAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('session_crisis_monitoring')
        .select('*')
        .neq('crisis_level', 'none')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      const alerts = data?.map(alert => ({
        sessionId: alert.session_id,
        crisisLevel: alert.crisis_level,
        riskScore: alert.risk_assessment_score,
        escalationTriggered: alert.escalation_triggered,
        timestamp: alert.created_at
      })) || [];

      setCrisisAlerts(alerts);
    } catch (error) {
      console.error('Error fetching crisis alerts:', error);
    }
  };

  const fetchQualityMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from('session_quality_metrics')
        .select('*');

      if (error) throw error;
      
      const metrics = {
        averageEngagement: data?.reduce((sum, item) => sum + (item.engagement_level || 0), 0) / (data?.length || 1),
        averageAlliance: data?.reduce((sum, item) => sum + (item.therapeutic_alliance_score || 0), 0) / (data?.length || 1),
        totalSessions: data?.length || 0,
        activeSessions: activeSessions.length,
        crisisInterventions: crisisAlerts.length,
        breakthroughMoments: data?.filter(item => (item.breakthrough_probability || 0) > 0.7).length || 0
      };

      setQualityMetrics(metrics);
    } catch (error) {
      console.error('Error fetching quality metrics:', error);
    }
  };

  const handleCrisisIntervention = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('session_crisis_monitoring')
        .update({
          escalation_triggered: true,
          escalation_actions: {
            timestamp: new Date().toISOString(),
            actions: ['Admin intervention triggered', 'Professional oversight activated'],
            triggered_by: 'admin'
          }
        })
        .eq('session_id', sessionId);

      if (error) throw error;

      toast({
        title: "Crisis Intervention Triggered",
        description: "Professional oversight has been activated for this session.",
        variant: "default"
      });

      await fetchCrisisAlerts();
    } catch (error) {
      console.error('Error triggering crisis intervention:', error);
      toast({
        title: "Error",
        description: "Failed to trigger crisis intervention.",
        variant: "destructive"
      });
    }
  };

  const getCrisisLevelColor = (level: string) => {
    switch (level) {
      case 'immediate': return 'bg-red-500';
      case 'high': return 'bg-red-400';
      case 'moderate': return 'bg-orange-400';
      case 'low': return 'bg-yellow-400';
      default: return 'bg-green-400';
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'opening': return 'bg-blue-500';
      case 'assessment': return 'bg-purple-500';
      case 'intervention': return 'bg-green-500';
      case 'practice': return 'bg-orange-500';
      case 'closing': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchActiveSessions(),
        fetchCrisisAlerts(),
        fetchQualityMetrics()
      ]);
      setIsLoading(false);
    };

    loadData();

    // Set up real-time updates
    const interval = setInterval(loadData, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Therapy System Monitoring</h2>
        <Button 
          onClick={() => window.location.reload()} 
          variant="outline"
          className="flex items-center gap-2"
        >
          <Activity className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Quality Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4" />
              Active Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{qualityMetrics.activeSessions}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Avg Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(qualityMetrics.averageEngagement * 100).toFixed(1)}%</div>
            <Progress value={qualityMetrics.averageEngagement * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Therapeutic Alliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(qualityMetrics.averageAlliance * 100).toFixed(1)}%</div>
            <Progress value={qualityMetrics.averageAlliance * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Crisis Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{qualityMetrics.crisisInterventions}</div>
            <p className="text-xs text-muted-foreground">Active alerts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Breakthroughs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{qualityMetrics.breakthroughMoments}</div>
            <p className="text-xs text-muted-foreground">Recent moments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Total Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{qualityMetrics.totalSessions}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active Sessions</TabsTrigger>
          <TabsTrigger value="crisis">Crisis Alerts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Therapy Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeSessions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No active sessions</p>
                ) : (
                  activeSessions.map((session) => (
                    <div key={session.sessionId} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge className={`${getPhaseColor(session.currentPhase)} text-white`}>
                            {session.currentPhase}
                          </Badge>
                          <span className="font-mono text-sm text-muted-foreground">
                            {session.sessionId}
                          </span>
                        </div>
                        <Badge className={`${getCrisisLevelColor(session.crisisLevel)} text-white`}>
                          {session.crisisLevel}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Engagement</p>
                          <div className="flex items-center gap-2">
                            <Progress value={session.engagementLevel * 100} className="h-2" />
                            <span className="text-xs">{(session.engagementLevel * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Alliance</p>
                          <div className="flex items-center gap-2">
                            <Progress value={session.therapeuticAlliance * 100} className="h-2" />
                            <span className="text-xs">{(session.therapeuticAlliance * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Breakthrough</p>
                          <div className="flex items-center gap-2">
                            <Progress value={session.breakthroughProbability * 100} className="h-2" />
                            <span className="text-xs">{(session.breakthroughProbability * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Last Update</p>
                          <p className="text-xs">
                            {new Date(session.lastUpdate).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crisis">
          <Card>
            <CardHeader>
              <CardTitle>Crisis Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {crisisAlerts.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No active crisis alerts</p>
                ) : (
                  crisisAlerts.map((alert) => (
                    <Alert key={alert.sessionId} className="border-l-4 border-l-red-500">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">
                              Crisis Level: <Badge className={`${getCrisisLevelColor(alert.crisisLevel)} text-white`}>
                                {alert.crisisLevel}
                              </Badge>
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Session: {alert.sessionId} • Risk Score: {(alert.riskScore * 100).toFixed(0)}%
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(alert.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {alert.escalationTriggered ? (
                              <Badge variant="outline" className="bg-green-50 text-green-600">
                                Escalated
                              </Badge>
                            ) : (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleCrisisIntervention(alert.sessionId)}
                                className="flex items-center gap-2"
                              >
                                <Shield className="w-4 h-4" />
                                Intervene
                              </Button>
                            )}
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>System Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Session Quality Distribution</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>High Quality (&gt;80%)</span>
                      <span className="text-green-600">
                        {activeSessions.filter(s => s.engagementLevel > 0.8).length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Medium Quality (50-80%)</span>
                      <span className="text-orange-600">
                        {activeSessions.filter(s => s.engagementLevel > 0.5 && s.engagementLevel <= 0.8).length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Low Quality (&lt;50%)</span>
                      <span className="text-red-600">
                        {activeSessions.filter(s => s.engagementLevel <= 0.5).length}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Phase Distribution</h3>
                  <div className="space-y-2">
                    {['opening', 'assessment', 'intervention', 'practice', 'closing'].map(phase => (
                      <div key={phase} className="flex justify-between text-sm">
                        <span className="capitalize">{phase}</span>
                        <span>{activeSessions.filter(s => s.currentPhase === phase).length}</span>
                      </div>
                    ))}
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