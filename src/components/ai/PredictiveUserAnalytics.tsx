
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Brain, 
  Target,
  Calendar,
  Activity,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PredictiveInsight {
  id: string;
  type: 'engagement' | 'mood' | 'risk' | 'opportunity';
  title: string;
  description: string;
  confidence: number;
  timeframe: string;
  actionable: boolean;
  recommendations: string[];
}

interface BehaviorPrediction {
  metric: string;
  currentValue: number;
  predictedValue: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  confidence: number;
  factors: string[];
}

const PredictiveUserAnalytics = () => {
  const { user } = useAuth();
  const [insights, setInsights] = useState<PredictiveInsight[]>([]);
  const [predictions, setPredictions] = useState<BehaviorPrediction[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [riskScore, setRiskScore] = useState<number>(0);

  useEffect(() => {
    generatePredictiveAnalytics();
  }, [user]);

  const generatePredictiveAnalytics = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));

    const mockInsights: PredictiveInsight[] = [
      {
        id: '1',
        type: 'engagement',
        title: 'High Engagement Probability',
        description: 'User is 87% likely to maintain consistent session attendance over the next 2 weeks',
        confidence: 87,
        timeframe: '2 weeks',
        actionable: true,
        recommendations: [
          'Continue current session schedule',
          'Introduce advanced techniques',
          'Set milestone goals'
        ]
      },
      {
        id: '2',
        type: 'mood',
        title: 'Mood Improvement Trend',
        description: 'Predictive models show 73% chance of sustained mood improvement',
        confidence: 73,
        timeframe: '1 month',
        actionable: true,
        recommendations: [
          'Focus on CBT techniques',
          'Increase mindfulness practice',
          'Track mood patterns daily'
        ]
      },
      {
        id: '3',
        type: 'risk',
        title: 'Potential Disengagement Risk',
        description: 'Slight risk of session dropout detected based on usage patterns',
        confidence: 65,
        timeframe: '1 week',
        actionable: true,
        recommendations: [
          'Send personalized check-in',
          'Offer flexible scheduling',
          'Provide motivation content'
        ]
      }
    ];

    const mockPredictions: BehaviorPrediction[] = [
      {
        metric: 'Weekly Sessions',
        currentValue: 3,
        predictedValue: 3.5,
        trend: 'increasing',
        confidence: 82,
        factors: ['Consistent attendance', 'Positive feedback', 'Goal achievement']
      },
      {
        metric: 'Session Duration',
        currentValue: 25,
        predictedValue: 28,
        trend: 'increasing',
        confidence: 76,
        factors: ['Engagement level', 'Topic complexity', 'User preference']
      },
      {
        metric: 'Mood Rating',
        currentValue: 6.2,
        predictedValue: 7.1,
        trend: 'increasing',
        confidence: 79,
        factors: ['Therapy progress', 'Technique effectiveness', 'Life circumstances']
      }
    ];

    setInsights(mockInsights);
    setPredictions(mockPredictions);
    setRiskScore(23); // Low risk score
    setIsAnalyzing(false);
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'engagement': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'mood': return 'bg-green-100 text-green-800 border-green-200';
      case 'risk': return 'bg-red-100 text-red-800 border-red-200';
      case 'opportunity': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'decreasing': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  const getRiskLevel = (score: number) => {
    if (score < 30) return { level: 'Low', color: 'text-green-600', bg: 'bg-green-100' };
    if (score < 60) return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { level: 'High', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const riskLevel = getRiskLevel(riskScore);

  const chartData = [
    { week: 'Week 1', actual: 6.0, predicted: 6.2 },
    { week: 'Week 2', actual: 6.3, predicted: 6.5 },
    { week: 'Week 3', actual: 6.1, predicted: 6.8 },
    { week: 'Week 4', actual: null, predicted: 7.1 },
    { week: 'Week 5', actual: null, predicted: 7.3 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-purple-500" />
              <CardTitle>Predictive User Analytics</CardTitle>
            </div>
            <Button 
              variant="outline" 
              onClick={generatePredictiveAnalytics}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? 'Analyzing...' : 'Refresh Analysis'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isAnalyzing ? (
            <div className="text-center py-8">
              <Brain className="h-12 w-12 text-purple-500 mx-auto mb-4 animate-pulse" />
              <p className="text-muted-foreground">Analyzing behavioral patterns and generating predictions...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center space-y-1">
                <p className="text-2xl font-bold text-purple-500">{insights.length}</p>
                <p className="text-xs text-muted-foreground">Insights Generated</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-2xl font-bold text-blue-500">
                  {Math.round(insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length)}%
                </p>
                <p className="text-xs text-muted-foreground">Avg Confidence</p>
              </div>
              <div className="text-center space-y-1">
                <p className={`text-2xl font-bold ${riskLevel.color}`}>{riskLevel.level}</p>
                <p className="text-xs text-muted-foreground">Risk Level</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-2xl font-bold text-green-500">{predictions.length}</p>
                <p className="text-xs text-muted-foreground">Predictions</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          {insights.map((insight) => (
            <Card key={insight.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{insight.title}</h3>
                        <Badge className={getInsightColor(insight.type)}>
                          {insight.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{insight.timeframe}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BarChart3 className="h-4 w-4 text-purple-500" />
                        <span className="text-sm text-purple-600">{insight.confidence}% confidence</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Confidence Level</span>
                      <span>{insight.confidence}%</span>
                    </div>
                    <Progress value={insight.confidence} className="h-2" />
                  </div>

                  {insight.actionable && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Recommended Actions:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {insight.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <Target className="h-3 w-3 text-purple-500" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          {predictions.map((prediction, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">{prediction.metric}</h3>
                  {getTrendIcon(prediction.trend)}
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-500">{prediction.currentValue}</p>
                    <p className="text-xs text-muted-foreground">Current</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-500">{prediction.predictedValue}</p>
                    <p className="text-xs text-muted-foreground">Predicted</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-500">{prediction.confidence}%</p>
                    <p className="text-xs text-muted-foreground">Confidence</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Contributing Factors:</h4>
                  <div className="flex flex-wrap gap-2">
                    {prediction.factors.map((factor, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {factor}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Mood Trend Prediction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis domain={[5, 8]} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="actual" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Actual Mood"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="predicted" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Predicted Mood"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PredictiveUserAnalytics;
