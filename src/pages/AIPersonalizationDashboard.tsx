import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Target, TrendingUp, Lightbulb, Settings, Zap } from 'lucide-react';

const AIPersonalizationDashboard = () => {
  const { user } = useAuth();
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  const [personalityProfile, setPersonalityProfile] = useState<any>({});
  const [adaptationLevel, setAdaptationLevel] = useState(75);

  useEffect(() => {
    if (user) {
      fetchAIData();
    }
  }, [user]);

  const fetchAIData = async () => {
    // Mock AI insights data
    setAiInsights([
      {
        id: 1,
        type: 'pattern',
        title: 'Communication Style Analysis',
        description: 'You respond best to direct, supportive communication with visual examples.',
        confidence: 89,
        impact: 'high',
        actionable: true
      },
      {
        id: 2,
        type: 'recommendation',
        title: 'Optimal Session Timing',
        description: 'Your engagement peaks during afternoon sessions (2-4 PM).',
        confidence: 76,
        impact: 'medium',
        actionable: true
      },
      {
        id: 3,
        type: 'insight',
        title: 'Therapeutic Technique Preference',
        description: 'CBT techniques show 34% higher effectiveness for your profile.',
        confidence: 82,
        impact: 'high',
        actionable: false
      }
    ]);

    setPersonalityProfile({
      communicationStyle: 'Direct & Supportive',
      learningPreference: 'Visual & Interactive',
      motivationStyle: 'Goal-Oriented',
      stressResponse: 'Problem-Solving Focused',
      adaptabilityScore: 85
    });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 bg-green-100';
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Personalization Dashboard</h1>
          <p className="text-gray-600 mt-1">Intelligent insights and adaptive therapy customization</p>
        </div>
        <Button>
          <Settings className="w-4 h-4 mr-2" />
          AI Settings
        </Button>
      </div>

      {/* AI Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Adaptation</CardTitle>
            <Brain className="h-4 w-4 text-therapy-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adaptationLevel}%</div>
            <Progress value={adaptationLevel} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">Personalization level</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Insights</CardTitle>
            <Lightbulb className="h-4 w-4 text-therapy-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aiInsights.length}</div>
            <p className="text-xs text-muted-foreground">Generated this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Effectiveness</CardTitle>
            <TrendingUp className="h-4 w-4 text-therapy-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+23%</div>
            <p className="text-xs text-muted-foreground">Improvement with AI</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confidence Score</CardTitle>
            <Zap className="h-4 w-4 text-therapy-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84%</div>
            <p className="text-xs text-muted-foreground">AI prediction accuracy</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="insights" className="space-y-4">
        <TabsList>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="patterns">Behavioral Patterns</TabsTrigger>
          <TabsTrigger value="recommendations">Smart Recommendations</TabsTrigger>
          <TabsTrigger value="profile">Personality Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4">
            {aiInsights.map((insight) => (
              <Card key={insight.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Brain className="w-5 h-5 text-therapy-600" />
                        <h3 className="font-semibold">{insight.title}</h3>
                        <Badge className={getImpactColor(insight.impact)}>
                          {insight.impact} impact
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{insight.description}</p>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">Confidence:</span>
                          <Badge className={getConfidenceColor(insight.confidence)}>
                            {insight.confidence}%
                          </Badge>
                        </div>
                        {insight.actionable && (
                          <Button size="sm" variant="outline">
                            Apply Insight
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Communication Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Direct Communication</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Visual Learning</span>
                      <span>78%</span>
                    </div>
                    <Progress value={78} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Emotional Processing</span>
                      <span>92%</span>
                    </div>
                    <Progress value={92} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Session Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Morning Sessions</span>
                      <span>65%</span>
                    </div>
                    <Progress value={65} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Afternoon Sessions</span>
                      <span>89%</span>
                    </div>
                    <Progress value={89} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Evening Sessions</span>
                      <span>71%</span>
                    </div>
                    <Progress value={71} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Therapy Technique Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { technique: 'Cognitive Behavioral Therapy', match: 94, reason: 'Excellent fit for goal-oriented approach' },
                    { technique: 'Mindfulness-Based Interventions', match: 87, reason: 'Complements stress management patterns' },
                    { technique: 'Dialectical Behavior Therapy', match: 76, reason: 'Good for emotional regulation skills' },
                    { technique: 'Acceptance and Commitment Therapy', match: 68, reason: 'Moderate fit based on values alignment' }
                  ].map((rec, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium">{rec.technique}</h3>
                        <p className="text-sm text-gray-500">{rec.reason}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={rec.match >= 90 ? 'bg-green-100 text-green-800' : 
                                        rec.match >= 80 ? 'bg-blue-100 text-blue-800' : 
                                        'bg-yellow-100 text-yellow-800'}>
                          {rec.match}% match
                        </Badge>
                        <Button size="sm" variant="outline">
                          Learn More
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Personality Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Communication Style</label>
                    <p className="text-lg font-medium">{personalityProfile.communicationStyle}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Learning Preference</label>
                    <p className="text-lg font-medium">{personalityProfile.learningPreference}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Motivation Style</label>
                    <p className="text-lg font-medium">{personalityProfile.motivationStyle}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Stress Response</label>
                    <p className="text-lg font-medium">{personalityProfile.stressResponse}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Adaptability Score</label>
                    <div className="flex items-center space-x-3">
                      <Progress value={personalityProfile.adaptabilityScore} className="flex-1" />
                      <span className="text-lg font-medium">{personalityProfile.adaptabilityScore}%</span>
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

export default AIPersonalizationDashboard;