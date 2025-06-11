
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, TrendingUp, Users, Brain, Target, Calendar, Download, RefreshCw } from 'lucide-react';
import { AIConfigurationService } from '@/services/aiConfigurationService';

const AnalyticsInsights = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [performanceData, setPerformanceData] = useState([]);
  const [effectivenessData, setEffectivenessData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [insights] = useState([
    {
      id: 1,
      type: 'performance',
      title: 'Model Response Time Improved',
      description: 'GPT-4o Mini showing 23% faster response times compared to last week',
      impact: 'high',
      actionable: true,
      trend: 'positive',
      metric: '1.2s avg response time'
    },
    {
      id: 2,
      type: 'effectiveness',
      title: 'CBT Techniques Showing Strong Results',
      description: 'Cognitive restructuring techniques are 15% more effective for anxiety users',
      impact: 'high',
      actionable: true,
      trend: 'positive',
      metric: '89% effectiveness score'
    },
    {
      id: 3,
      type: 'usage',
      title: 'Peak Usage Patterns Identified',
      description: 'Sessions peak at 7-9 PM, consider adaptive resource allocation',
      impact: 'medium',
      actionable: true,
      trend: 'neutral',
      metric: '2.3x evening traffic'
    }
  ]);

  const [segmentAnalysis] = useState([
    {
      segment: 'High Anxiety Users',
      userCount: 847,
      avgSessionLength: '24 min',
      preferredModel: 'GPT-4o Mini',
      effectivenessScore: 89,
      topTechniques: ['Breathing exercises', 'Grounding', 'Progressive relaxation']
    },
    {
      segment: 'Depression-Focused Users',
      userCount: 623,
      avgSessionLength: '31 min',
      preferredModel: 'GPT-4o',
      effectivenessScore: 84,
      topTechniques: ['Cognitive restructuring', 'Behavioral activation', 'Self-compassion']
    },
    {
      segment: 'General Wellness Users',
      userCount: 1205,
      avgSessionLength: '18 min',
      preferredModel: 'GPT-4o Mini',
      effectivenessScore: 76,
      topTechniques: ['Mindfulness', 'Goal setting', 'Reflection']
    }
  ]);

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const [performance, effectiveness] = await Promise.all([
        AIConfigurationService.getModelPerformanceStats(),
        AIConfigurationService.getTherapyEffectivenessStats()
      ]);
      setPerformanceData(performance);
      setEffectivenessData(effectiveness);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'low': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'positive': return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'negative': return <TrendingUp className="h-4 w-4 text-red-400 rotate-180" />;
      default: return <TrendingUp className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={loadAnalyticsData}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh
          </Button>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Key Insights */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Brain className="h-5 w-5 mr-2 text-purple-400" />
            AI-Generated Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight) => (
              <div key={insight.id} className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    {getTrendIcon(insight.trend)}
                    <div className="flex-1">
                      <h3 className="text-white font-medium mb-1">{insight.title}</h3>
                      <p className="text-gray-400 text-sm mb-2">{insight.description}</p>
                      <div className="flex items-center space-x-2">
                        <Badge className={`text-xs ${getImpactColor(insight.impact)}`}>
                          {insight.impact} impact
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {insight.metric}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {insight.actionable && (
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      Take Action
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Segment Analysis */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-400" />
            User Segment Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {segmentAnalysis.map((segment, index) => (
              <div key={index} className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-white font-medium">{segment.segment}</h3>
                      <Badge variant="outline" className="text-xs">
                        {segment.userCount} users
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-400">Avg Session Length</p>
                        <p className="text-sm font-medium text-white">{segment.avgSessionLength}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Preferred Model</p>
                        <p className="text-sm font-medium text-white">{segment.preferredModel}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Effectiveness</p>
                        <p className="text-sm font-medium text-green-400">{segment.effectivenessScore}%</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Top Techniques</p>
                      <div className="flex flex-wrap gap-1">
                        {segment.topTechniques.map((technique) => (
                          <Badge key={technique} className="text-xs bg-purple-600">
                            {technique}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400">Effectiveness</span>
                    </div>
                    <Progress value={segment.effectivenessScore} className="h-2 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Model Comparison */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-green-400" />
            Model Performance Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'GPT-4o Mini', responseTime: '1.2s', accuracy: 87, cost: '$0.12', usage: 73 },
              { name: 'GPT-4o', responseTime: '2.8s', accuracy: 92, cost: '$0.45', usage: 27 }
            ].map((model, index) => (
              <div key={index} className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-medium">{model.name}</h3>
                  <Badge variant="outline" className="text-xs">
                    {model.usage}% usage
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-400">Response Time</p>
                    <p className="text-sm font-medium text-blue-400">{model.responseTime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Accuracy</p>
                    <p className="text-sm font-medium text-green-400">{model.accuracy}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Cost per Session</p>
                    <p className="text-sm font-medium text-orange-400">{model.cost}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Usage Share</p>
                    <Progress value={model.usage} className="h-2 mt-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsInsights;
