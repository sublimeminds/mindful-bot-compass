import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Globe, 
  TrendingUp, 
  Heart, 
  MessageSquare,
  Activity,
  Zap,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  EnhancedCommunityService, 
  EnhancedCommunityMetrics, 
  CulturalCommunityInsight 
} from '@/services/enhancedCommunityService';

const CommunityAnalyticsDashboard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<EnhancedCommunityMetrics | null>(null);
  const [insights, setInsights] = useState<CulturalCommunityInsight[]>([]);
  const [communityHealth, setCommunityHealth] = useState<any>(null);

  useEffect(() => {
    loadCommunityAnalytics();
  }, []);

  const loadCommunityAnalytics = async () => {
    setLoading(true);
    try {
      const [metricsData, insightsData, healthData] = await Promise.all([
        EnhancedCommunityService.getCommunityMetrics(),
        EnhancedCommunityService.generateCommunityInsights(),
        EnhancedCommunityService.monitorCommunityHealth()
      ]);

      setMetrics(metricsData);
      setInsights(insightsData);
      setCommunityHealth(healthData);
    } catch (error) {
      console.error('Error loading community analytics:', error);
      toast({
        title: "Error",
        description: "Failed to load community analytics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500/20 text-green-400';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400';
      case 'critical': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getHealthStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'low': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">Community Analytics</h2>
            <p className="text-muted-foreground">Monitor cultural community health and engagement</p>
          </div>
        </div>
        <Button onClick={loadCommunityAnalytics} disabled={loading}>
          Refresh Data
        </Button>
      </div>

      {/* Community Health Status */}
      {communityHealth && (
        <Card className={`border-2 ${
          communityHealth.status === 'healthy' ? 'border-green-200 bg-green-50/50' :
          communityHealth.status === 'warning' ? 'border-yellow-200 bg-yellow-50/50' :
          'border-red-200 bg-red-50/50'
        }`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getHealthStatusIcon(communityHealth.status)}
              Community Health: {communityHealth.status.charAt(0).toUpperCase() + communityHealth.status.slice(1)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {communityHealth.issues.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Issues:</p>
                <ul className="text-sm space-y-1">
                  {communityHealth.issues.map((issue: string, index: number) => (
                    <li key={index} className="flex items-center">
                      <AlertTriangle className="h-3 w-3 mr-2 text-yellow-500" />
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {communityHealth.recommendations.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Recommendations:</p>
                <ul className="text-sm space-y-1">
                  {communityHealth.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="flex items-center">
                      <Target className="h-3 w-3 mr-2 text-blue-500" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Members</p>
                <p className="text-2xl font-bold text-blue-400">{metrics?.totalMembers || 0}</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cultural Backgrounds</p>
                <p className="text-2xl font-bold text-green-400">{metrics?.culturalBackgrounds || 0}</p>
              </div>
              <Globe className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cross-Cultural Connections</p>
                <p className="text-2xl font-bold text-purple-400">{metrics?.crossCulturalConnections || 0}</p>
              </div>
              <Heart className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cultural Engagement</p>
                <p className="text-2xl font-bold text-orange-400">
                  {Math.round((metrics?.culturalContentEngagement || 0) * 100)}%
                </p>
              </div>
              <Zap className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cultural">Cultural Impact</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Community Growth</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Member Growth Rate</span>
                    <span className="text-sm font-medium">+23%</span>
                  </div>
                  <Progress value={23} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Cultural Diversity Index</span>
                    <span className="text-sm font-medium">87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Active Languages</span>
                    <span className="text-sm font-medium">{metrics?.activeLanguages || 0}</span>
                  </div>
                  <Progress value={(metrics?.activeLanguages || 0) * 10} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cultural Programs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Cultural Events This Month</span>
                  <span className="font-bold">{metrics?.culturalEventsThisMonth || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Family Integration Rate</span>
                  <span className="font-bold">{Math.round((metrics?.familyIntegrationRate || 0) * 100)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Peer Matching Success</span>
                  <span className="font-bold">{Math.round((metrics?.peerMatchingSuccessRate || 0) * 100)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Cultural Content Usage</span>
                  <span className="font-bold">High</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cultural" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cultural Representation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {['Asian', 'Hispanic/Latino', 'African', 'European', 'Middle Eastern', 'Indigenous'].map((culture, index) => (
                  <div key={culture} className="flex justify-between items-center">
                    <span className="text-sm">{culture}</span>
                    <span className="text-sm font-medium">{Math.round(Math.random() * 25 + 5)}%</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Language Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {['English', 'Spanish', 'Mandarin', 'Arabic', 'Hindi', 'French'].map((language, index) => (
                  <div key={language} className="flex justify-between items-center">
                    <span className="text-sm">{language}</span>
                    <span className="text-sm font-medium">{Math.round(Math.random() * 30 + 10)}%</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cultural Adaptations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Content Adaptation Rate</span>
                    <span className="text-sm font-medium">94%</span>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Cultural Sensitivity Score</span>
                    <span className="text-sm font-medium">91%</span>
                  </div>
                  <Progress value={91} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Daily Active Users</span>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Post Interaction Rate</span>
                    <span className="text-sm font-medium">65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Event Participation</span>
                    <span className="text-sm font-medium">82%</span>
                  </div>
                  <Progress value={82} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Peer Connection Success</span>
                    <span className="text-sm font-medium">89%</span>
                  </div>
                  <Progress value={89} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Cultural Stories</span>
                  <Badge variant="secondary">95% Engagement</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Milestone Celebrations</span>
                  <Badge variant="secondary">88% Engagement</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Q&A Posts</span>
                  <Badge variant="secondary">76% Engagement</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Resource Sharing</span>
                  <Badge variant="secondary">82% Engagement</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-medium">{insight.title}</h3>
                        <Badge className={getImpactColor(insight.impact)}>
                          {insight.impact} impact
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{insight.description}</p>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">
                          {Math.round(insight.confidence * 100)}% Confidence
                        </Badge>
                        <Badge variant="secondary">{insight.type.replace('_', ' ')}</Badge>
                        {insight.actionable && (
                          <Badge className="bg-green-500/20 text-green-400">
                            Actionable
                          </Badge>
                        )}
                      </div>
                    </div>
                    <BarChart3 className="h-5 w-5 text-primary ml-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityAnalyticsDashboard;