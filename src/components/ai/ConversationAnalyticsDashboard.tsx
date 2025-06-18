
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, TrendingUp, MessageSquare, Target, AlertTriangle, Lightbulb } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface ConversationInsight {
  id: string;
  type: 'pattern' | 'trend' | 'risk' | 'opportunity';
  title: string;
  description: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
  actionable: boolean;
  suggestedActions: string[];
  timestamp: Date;
}

interface AnalyticsData {
  emotionalTrends: Array<{ date: string; anxiety: number; depression: number; stress: number; joy: number }>;
  topicDistribution: Array<{ topic: string; frequency: number; sentiment: number }>;
  progressMetrics: Array<{ metric: string; current: number; target: number; trend: string }>;
  riskFactors: Array<{ factor: string; level: number; category: string }>;
}

const ConversationAnalyticsDashboard = () => {
  const [insights, setInsights] = useState<ConversationInsight[]>([]);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');

  useEffect(() => {
    loadConversationInsights();
    loadAnalyticsData();
  }, [selectedTimeframe]);

  const loadConversationInsights = async () => {
    // Mock data - would come from AI analysis service
    const mockInsights: ConversationInsight[] = [
      {
        id: '1',
        type: 'pattern',
        title: 'Recurring Anxiety Patterns',
        description: 'User shows increased anxiety levels every Monday morning, possibly work-related stress.',
        confidence: 87,
        severity: 'medium',
        actionable: true,
        suggestedActions: ['Schedule relaxation techniques before Monday', 'Explore work-related stress management'],
        timestamp: new Date()
      },
      {
        id: '2',
        type: 'trend',
        title: 'Improving Sleep Quality',
        description: 'Sleep quality mentions have improved 23% over the past 2 weeks.',
        confidence: 92,
        severity: 'low',
        actionable: false,
        suggestedActions: ['Continue current sleep hygiene practices'],
        timestamp: new Date()
      },
      {
        id: '3',
        type: 'risk',
        title: 'Social Isolation Indicators',
        description: 'Decreased mentions of social activities and relationships in recent sessions.',
        confidence: 74,
        severity: 'high',
        actionable: true,
        suggestedActions: ['Encourage social connection activities', 'Explore barriers to social engagement'],
        timestamp: new Date()
      },
      {
        id: '4',
        type: 'opportunity',
        title: 'Mindfulness Engagement',
        description: 'User responds positively to mindfulness techniques, showing 40% better engagement.',
        confidence: 85,
        severity: 'low',
        actionable: true,
        suggestedActions: ['Increase mindfulness-based interventions', 'Introduce advanced meditation practices'],
        timestamp: new Date()
      }
    ];
    setInsights(mockInsights);
  };

  const loadAnalyticsData = async () => {
    // Mock analytics data
    const mockData: AnalyticsData = {
      emotionalTrends: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        anxiety: Math.random() * 10,
        depression: Math.random() * 8,
        stress: Math.random() * 9,
        joy: Math.random() * 7 + 3
      })).reverse(),
      topicDistribution: [
        { topic: 'Work Stress', frequency: 45, sentiment: -0.3 },
        { topic: 'Relationships', frequency: 32, sentiment: 0.1 },
        { topic: 'Self-Care', frequency: 28, sentiment: 0.4 },
        { topic: 'Sleep', frequency: 25, sentiment: 0.2 },
        { topic: 'Exercise', frequency: 18, sentiment: 0.5 }
      ],
      progressMetrics: [
        { metric: 'Mood Stability', current: 7.2, target: 8.0, trend: 'improving' },
        { metric: 'Stress Management', current: 6.8, target: 7.5, trend: 'stable' },
        { metric: 'Social Connection', current: 5.4, target: 7.0, trend: 'declining' },
        { metric: 'Sleep Quality', current: 7.8, target: 8.0, trend: 'improving' }
      ],
      riskFactors: [
        { factor: 'Work Burnout', level: 6.2, category: 'professional' },
        { factor: 'Social Isolation', level: 7.1, category: 'social' },
        { factor: 'Sleep Disruption', level: 4.3, category: 'physical' },
        { factor: 'Negative Thought Patterns', level: 5.8, category: 'cognitive' }
      ]
    };
    setAnalyticsData(mockData);
  };

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    await loadConversationInsights();
    await loadAnalyticsData();
    setIsAnalyzing(false);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'pattern': return <TrendingUp className="h-4 w-4" />;
      case 'trend': return <MessageSquare className="h-4 w-4" />;
      case 'risk': return <AlertTriangle className="h-4 w-4" />;
      case 'opportunity': return <Lightbulb className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Conversation Analytics</h1>
          <p className="text-muted-foreground">Advanced insights from your therapy conversations</p>
        </div>
        <div className="flex items-center space-x-4">
          <select 
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="border rounded-md px-3 py-1"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <Button 
            onClick={runAnalysis}
            disabled={isAnalyzing}
            className="flex items-center space-x-2"
          >
            <Brain className="h-4 w-4" />
            <span>{isAnalyzing ? 'Analyzing...' : 'Run Analysis'}</span>
          </Button>
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Brain className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">{insights.length}</div>
            <p className="text-sm text-muted-foreground">Active Insights</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">
              {insights.filter(i => i.actionable).length}
            </div>
            <p className="text-sm text-muted-foreground">Actionable Items</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-500" />
            <div className="text-2xl font-bold">
              {insights.filter(i => i.severity === 'high').length}
            </div>
            <p className="text-sm text-muted-foreground">High Priority</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">
              {Math.round(insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length)}%
            </div>
            <p className="text-sm text-muted-foreground">Avg Confidence</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="emotions">Emotional Trends</TabsTrigger>
          <TabsTrigger value="topics">Topic Analysis</TabsTrigger>
          <TabsTrigger value="progress">Progress Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="h-5 w-5 mr-2" />
                Conversation Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.map((insight) => (
                  <div key={insight.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getInsightIcon(insight.type)}
                        <div>
                          <h3 className="font-medium">{insight.title}</h3>
                          <p className="text-sm text-muted-foreground capitalize">{insight.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getSeverityColor(insight.severity)}>
                          {insight.severity}
                        </Badge>
                        <span className="text-sm font-medium">{insight.confidence}% confidence</span>
                      </div>
                    </div>
                    
                    <p className="text-sm">{insight.description}</p>
                    
                    {insight.actionable && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Suggested Actions:</h4>
                        <ul className="text-sm space-y-1">
                          {insight.suggestedActions.map((action, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emotions">
          <Card>
            <CardHeader>
              <CardTitle>Emotional Trends Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData?.emotionalTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).getDate().toString()}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <Line type="monotone" dataKey="anxiety" stroke="#ef4444" strokeWidth={2} />
                    <Line type="monotone" dataKey="depression" stroke="#8b5cf6" strokeWidth={2} />
                    <Line type="monotone" dataKey="stress" stroke="#f59e0b" strokeWidth={2} />
                    <Line type="monotone" dataKey="joy" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="topics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Topic Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData?.topicDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ topic, frequency }) => `${topic}: ${frequency}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="frequency"
                      >
                        {analyticsData?.topicDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Topic Sentiment Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData?.topicDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="topic" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="sentiment" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Progress Metrics & Risk Factors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Progress Towards Goals</h3>
                  {analyticsData?.progressMetrics.map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{metric.metric}</span>
                        <span>{metric.current}/{metric.target}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            metric.trend === 'improving' ? 'bg-green-500' :
                            metric.trend === 'declining' ? 'bg-red-500' : 'bg-yellow-500'
                          }`}
                          style={{ width: `${(metric.current / metric.target) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Risk Factor Assessment</h3>
                  {analyticsData?.riskFactors.map((factor, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <span className="font-medium">{factor.factor}</span>
                        <p className="text-xs text-muted-foreground capitalize">{factor.category}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{factor.level}/10</div>
                        <div className={`text-xs ${
                          factor.level >= 7 ? 'text-red-600' :
                          factor.level >= 5 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {factor.level >= 7 ? 'High' : factor.level >= 5 ? 'Medium' : 'Low'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConversationAnalyticsDashboard;
