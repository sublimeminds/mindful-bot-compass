import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Globe, 
  Users, 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Shield,
  Heart,
  Activity,
  BarChart3,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { culturalAIService } from '@/services/culturalAiService';
import { CulturalContentLibraryService, CulturalSupportGroupService } from '@/services/culturalEnhancedServices';

interface CulturalMetrics {
  totalUsers: number;
  culturallyAdaptedSessions: number;
  culturalEffectivenessScore: number;
  biasDetectionRate: number;
  culturalContentUsage: number;
  communityEngagement: number;
  crossCulturalConnections: number;
  familyIntegrationRate: number;
}

interface BiasAlert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  content: string;
  culturalContext: string;
  detectedAt: string;
  status: 'pending' | 'reviewed' | 'resolved';
}

const CulturalAIMonitoring = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<CulturalMetrics>({
    totalUsers: 0,
    culturallyAdaptedSessions: 0,
    culturalEffectivenessScore: 0,
    biasDetectionRate: 0,
    culturalContentUsage: 0,
    communityEngagement: 0,
    crossCulturalConnections: 0,
    familyIntegrationRate: 0
  });
  const [biasAlerts, setBiasAlerts] = useState<BiasAlert[]>([]);
  const [culturalInsights, setCulturalInsights] = useState<any[]>([]);

  useEffect(() => {
    loadCulturalMetrics();
  }, []);

  const loadCulturalMetrics = async () => {
    setLoading(true);
    try {
      // Load cultural AI metrics from database
      const [alerts, insights] = await Promise.all([
        loadBiasAlerts(),
        loadCulturalInsights()
      ]);

      setBiasAlerts(alerts);
      setCulturalInsights(insights);

      // Mock metrics - in real app, fetch from cultural AI analytics
      setMetrics({
        totalUsers: 2847,
        culturallyAdaptedSessions: 1923,
        culturalEffectivenessScore: 0.87,
        biasDetectionRate: 0.95,
        culturalContentUsage: 1456,
        communityEngagement: 0.73,
        crossCulturalConnections: 234,
        familyIntegrationRate: 0.68
      });
    } catch (error) {
      console.error('Error loading cultural metrics:', error);
      toast({
        title: "Error",
        description: "Failed to load cultural AI metrics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadBiasAlerts = async (): Promise<BiasAlert[]> => {
    // Mock bias alerts - in real app, fetch from cultural_bias_detection table
    return [
      {
        id: '1',
        severity: 'medium',
        content: 'Potential cultural assumption in therapy recommendation',
        culturalContext: 'East Asian collectivist culture',
        detectedAt: '2024-01-15T10:30:00Z',
        status: 'pending'
      },
      {
        id: '2',
        severity: 'low',
        content: 'Language adaptation suggestion could be improved',
        culturalContext: 'Hispanic family dynamics',
        detectedAt: '2024-01-15T09:15:00Z',
        status: 'reviewed'
      }
    ];
  };

  const loadCulturalInsights = async (): Promise<any[]> => {
    // Mock cultural insights
    return [
      {
        insight: 'Users with family integration show 34% better therapy outcomes',
        confidence: 0.92,
        actionable: true,
        category: 'family_integration'
      },
      {
        insight: 'Cultural content usage peaks during traditional celebration periods',
        confidence: 0.87,
        actionable: true,
        category: 'content_optimization'
      },
      {
        insight: 'Cross-cultural peer matches have 23% higher engagement rates',
        confidence: 0.89,
        actionable: true,
        category: 'community_matching'
      }
    ];
  };

  const handleBiasAlertAction = async (alertId: string, action: 'approve' | 'flag') => {
    try {
      // Update bias alert status
      setBiasAlerts(prev => prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, status: action === 'approve' ? 'resolved' : 'reviewed' }
          : alert
      ));

      toast({
        title: action === 'approve' ? "Alert Resolved" : "Alert Flagged",
        description: `Bias alert has been ${action === 'approve' ? 'resolved' : 'flagged for review'}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update bias alert",
        variant: "destructive"
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400';
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'low': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      case 'medium':
        return <Shield className="h-4 w-4" />;
      case 'low':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Globe className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">Cultural AI Monitoring</h2>
            <p className="text-muted-foreground">Monitor cultural sensitivity and effectiveness</p>
          </div>
        </div>
        <Button onClick={loadCulturalMetrics} disabled={loading}>
          Refresh Metrics
        </Button>
      </div>

      {/* Cultural Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cultural Effectiveness</p>
                <p className="text-2xl font-bold text-green-400">
                  {Math.round(metrics.culturalEffectivenessScore * 100)}%
                </p>
              </div>
              <Heart className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bias Detection Rate</p>
                <p className="text-2xl font-bold text-blue-400">
                  {Math.round(metrics.biasDetectionRate * 100)}%
                </p>
              </div>
              <Shield className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Community Engagement</p>
                <p className="text-2xl font-bold text-purple-400">
                  {Math.round(metrics.communityEngagement * 100)}%
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cultural Content Usage</p>
                <p className="text-2xl font-bold text-orange-400">{metrics.culturalContentUsage}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bias Detection Alerts */}
      {biasAlerts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="w-5 h-5" />
              Cultural Bias Alerts ({biasAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {biasAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center gap-3">
                  {getSeverityIcon(alert.severity)}
                  <div>
                    <p className="font-medium">{alert.content}</p>
                    <p className="text-sm text-muted-foreground">
                      Context: {alert.culturalContext}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getSeverityColor(alert.severity)}>
                    {alert.severity}
                  </Badge>
                  {alert.status === 'pending' && (
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleBiasAlertAction(alert.id, 'approve')}
                      >
                        Resolve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleBiasAlertAction(alert.id, 'flag')}
                      >
                        Flag
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Cultural AI Tabs */}
      <Tabs defaultValue="effectiveness" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="effectiveness">Effectiveness</TabsTrigger>
          <TabsTrigger value="content">Content Analytics</TabsTrigger>
          <TabsTrigger value="community">Community Impact</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="effectiveness" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cultural Adaptation Effectiveness</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Session Adaptation Rate</span>
                    <span className="text-sm font-medium">87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">User Satisfaction</span>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Cultural Relevance Score</span>
                    <span className="text-sm font-medium">89%</span>
                  </div>
                  <Progress value={89} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Family Integration Impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Family Involvement Rate</span>
                    <span className="text-sm font-medium">68%</span>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Therapy Outcomes Improvement</span>
                    <span className="text-sm font-medium">+34%</span>
                  </div>
                  <Progress value={134} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Cultural Decision Making Support</span>
                    <span className="text-sm font-medium">76%</span>
                  </div>
                  <Progress value={76} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cultural Content Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{metrics.culturalContentUsage}</div>
                  <p className="text-sm text-muted-foreground">Content Interactions</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">4.7/5.0</div>
                  <p className="text-sm text-muted-foreground">Avg Effectiveness</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">15+</div>
                  <p className="text-sm text-muted-foreground">Cultural Backgrounds</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="community" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cultural Community Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Cross-Cultural Connections</span>
                  <span className="font-bold">{metrics.crossCulturalConnections}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Cultural Support Groups</span>
                  <span className="font-bold">12 Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Multilingual Interactions</span>
                  <span className="font-bold">89%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Cultural Event Participation</span>
                  <span className="font-bold">456 Members</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Peer Matching Success</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Cultural Compatibility</span>
                    <span className="text-sm font-medium">91%</span>
                  </div>
                  <Progress value={91} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Language Matching</span>
                    <span className="text-sm font-medium">96%</span>
                  </div>
                  <Progress value={96} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Long-term Engagement</span>
                    <span className="text-sm font-medium">84%</span>
                  </div>
                  <Progress value={84} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="space-y-4">
            {culturalInsights.map((insight, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-lg font-medium mb-2">{insight.insight}</p>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">
                          {Math.round(insight.confidence * 100)}% Confidence
                        </Badge>
                        <Badge variant="secondary">{insight.category}</Badge>
                        {insight.actionable && (
                          <Badge className="bg-green-500/20 text-green-400">
                            Actionable
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Zap className="h-5 w-5 text-primary ml-4" />
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

export default CulturalAIMonitoring;