
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Activity, 
  Clock, 
  Volume2, 
  Heart,
  Brain,
  Target,
  Award
} from 'lucide-react';

interface VoiceMetrics {
  stressLevel: number;
  emotionalState: string;
  confidenceScore: number;
  engagementLevel: number;
  voiceClarity: number;
  speakingPace: number;
  emotionalStability: number;
}

interface SessionAnalytics {
  date: string;
  stressLevel: number;
  emotionalScore: number;
  sessionDuration: number;
  voiceMetrics: VoiceMetrics;
}

const VoiceAnalytics = () => {
  const [currentMetrics, setCurrentMetrics] = useState<VoiceMetrics>({
    stressLevel: 35,
    emotionalState: 'calm',
    confidenceScore: 78,
    engagementLevel: 85,
    voiceClarity: 92,
    speakingPace: 88,
    emotionalStability: 75
  });

  const [weeklyData] = useState<SessionAnalytics[]>([
    { date: '2024-01-15', stressLevel: 45, emotionalScore: 72, sessionDuration: 30, voiceMetrics: currentMetrics },
    { date: '2024-01-16', stressLevel: 38, emotionalScore: 78, sessionDuration: 25, voiceMetrics: currentMetrics },
    { date: '2024-01-17', stressLevel: 42, emotionalScore: 75, sessionDuration: 35, voiceMetrics: currentMetrics },
    { date: '2024-01-18', stressLevel: 35, emotionalScore: 82, sessionDuration: 40, voiceMetrics: currentMetrics },
    { date: '2024-01-19', stressLevel: 30, emotionalScore: 85, sessionDuration: 45, voiceMetrics: currentMetrics },
    { date: '2024-01-20', stressLevel: 28, emotionalScore: 88, sessionDuration: 35, voiceMetrics: currentMetrics },
    { date: '2024-01-21', stressLevel: 25, emotionalScore: 90, sessionDuration: 50, voiceMetrics: currentMetrics }
  ]);

  const emotionDistribution = [
    { name: 'Calm', value: 45, color: '#10B981' },
    { name: 'Happy', value: 25, color: '#F59E0B' },
    { name: 'Neutral', value: 20, color: '#6B7280' },
    { name: 'Anxious', value: 8, color: '#EF4444' },
    { name: 'Sad', value: 2, color: '#8B5CF6' }
  ];

  const getMetricColor = (value: number) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMetricBadgeColor = (value: number) => {
    if (value >= 80) return 'bg-green-100 text-green-800';
    if (value >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* Current Session Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-therapy-500" />
            <span>Real-Time Voice Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-therapy-100 rounded-full mx-auto mb-2">
                <Heart className="h-6 w-6 text-therapy-600" />
              </div>
              <div className="text-2xl font-bold mb-1">{currentMetrics.stressLevel}%</div>
              <div className="text-sm text-muted-foreground">Stress Level</div>
              <Progress value={100 - currentMetrics.stressLevel} className="mt-2" />
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold mb-1">{currentMetrics.confidenceScore}%</div>
              <div className="text-sm text-muted-foreground">Confidence</div>
              <Progress value={currentMetrics.confidenceScore} className="mt-2" />
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
                <Volume2 className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold mb-1">{currentMetrics.voiceClarity}%</div>
              <div className="text-sm text-muted-foreground">Voice Clarity</div>
              <Progress value={currentMetrics.voiceClarity} className="mt-2" />
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold mb-1">{currentMetrics.engagementLevel}%</div>
              <div className="text-sm text-muted-foreground">Engagement</div>
              <Progress value={currentMetrics.engagementLevel} className="mt-2" />
            </div>
          </div>
          
          <div className="mt-6 flex justify-center">
            <Badge className={`text-lg px-4 py-2 ${getMetricBadgeColor(currentMetrics.emotionalStability)}`}>
              Current State: {currentMetrics.emotionalState.charAt(0).toUpperCase() + currentMetrics.emotionalState.slice(1)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Tabs */}
      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trends">Progress Trends</TabsTrigger>
          <TabsTrigger value="emotions">Emotion Analysis</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        {/* Progress Trends */}
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>7-Day Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={formatDate}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => formatDate(value as string)}
                      formatter={(value, name) => [
                        `${value}${name === 'sessionDuration' ? ' min' : '%'}`, 
                        name === 'stressLevel' ? 'Stress Level' : 
                        name === 'emotionalScore' ? 'Emotional Score' : 'Session Duration'
                      ]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="stressLevel" 
                      stroke="#EF4444" 
                      strokeWidth={2}
                      name="stressLevel"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="emotionalScore" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      name="emotionalScore"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">-20%</div>
                <div className="text-sm text-muted-foreground">Stress Reduction</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">+18%</div>
                <div className="text-sm text-muted-foreground">Emotional Score</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">35min</div>
                <div className="text-sm text-muted-foreground">Avg Session</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Emotion Analysis */}
        <TabsContent value="emotions" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Emotion Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={emotionDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {emotionDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
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
                <CardTitle>Voice Characteristics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Speaking Pace</span>
                    <span className="text-sm font-medium">{currentMetrics.speakingPace}%</span>
                  </div>
                  <Progress value={currentMetrics.speakingPace} />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Emotional Stability</span>
                    <span className="text-sm font-medium">{currentMetrics.emotionalStability}%</span>
                  </div>
                  <Progress value={currentMetrics.emotionalStability} />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Voice Clarity</span>
                    <span className="text-sm font-medium">{currentMetrics.voiceClarity}%</span>
                  </div>
                  <Progress value={currentMetrics.voiceClarity} />
                </div>

                <div className="pt-4 border-t">
                  <div className="text-sm text-muted-foreground mb-2">Analysis Summary:</div>
                  <div className="text-sm">
                    Your voice patterns show consistent improvement in emotional regulation. 
                    Speaking pace has stabilized, indicating reduced anxiety levels.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Insights */}
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>Personalized Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Award className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-green-800">Progress Milestone</div>
                    <div className="text-sm text-green-700">
                      Your stress levels have decreased by 20% over the past week. Your voice shows 
                      increased confidence and emotional stability.
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-blue-800">Recommendation</div>
                    <div className="text-sm text-blue-700">
                      Continue with breathing exercises during sessions. Your voice clarity improves 
                      significantly when you take pauses between thoughts.
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-yellow-800">Pattern Recognition</div>
                    <div className="text-sm text-yellow-700">
                      You tend to speak faster during evening sessions. Consider shorter, 
                      more frequent check-ins during high-stress periods.
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Heart className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-purple-800">Emotional Growth</div>
                    <div className="text-sm text-purple-700">
                      Your emotional vocabulary has expanded. You're expressing feelings with 
                      greater nuance and self-awareness.
                    </div>
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

export default VoiceAnalytics;
