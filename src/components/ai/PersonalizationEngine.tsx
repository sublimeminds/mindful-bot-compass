
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  User, 
  Target, 
  TrendingUp, 
  Sparkles,
  Settings,
  Heart,
  MessageSquare,
  Clock,
  Zap
} from 'lucide-react';

interface PersonalizationInsight {
  id: string;
  category: 'behavior' | 'preference' | 'goal' | 'mood';
  title: string;
  description: string;
  confidence: number;
  actionSuggestion: string;
  impact: 'high' | 'medium' | 'low';
}

interface UserPersona {
  type: 'analytical' | 'expressive' | 'supportive' | 'action-oriented';
  traits: string[];
  preferences: {
    communicationStyle: string;
    sessionFormat: string;
    reminderFrequency: string;
  };
}

const PersonalizationEngine = () => {
  const [insights, setInsights] = useState<PersonalizationInsight[]>([]);
  const [userPersona, setUserPersona] = useState<UserPersona | null>(null);
  const [adaptationScore, setAdaptationScore] = useState(78);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    // Mock AI-generated insights
    const mockInsights: PersonalizationInsight[] = [
      {
        id: '1',
        category: 'behavior',
        title: 'Evening Session Preference',
        description: 'User shows 85% higher engagement during evening sessions (6-8 PM)',
        confidence: 92,
        actionSuggestion: 'Schedule automatic reminders for evening therapy sessions',
        impact: 'high'
      },
      {
        id: '2',
        category: 'mood',
        title: 'Stress Pattern Recognition',
        description: 'Elevated stress levels detected on Mondays and after work calls',
        confidence: 87,
        actionSuggestion: 'Implement proactive mindfulness suggestions on Mondays',
        impact: 'high'
      },
      {
        id: '3',
        category: 'preference',
        title: 'Visual Learning Style',
        description: 'User responds better to visual exercises vs. text-based techniques',
        confidence: 79,
        actionSuggestion: 'Prioritize visual breathing guides and mood tracking charts',
        impact: 'medium'
      },
      {
        id: '4',
        category: 'goal',
        title: 'Short-term Goal Success',
        description: 'Higher completion rate for goals under 7 days vs. longer-term goals',
        confidence: 83,
        actionSuggestion: 'Break down long-term goals into weekly milestones',
        impact: 'medium'
      }
    ];

    const mockPersona: UserPersona = {
      type: 'analytical',
      traits: ['Detail-oriented', 'Data-driven', 'Systematic approach', 'Goal-focused'],
      preferences: {
        communicationStyle: 'Direct and informative',
        sessionFormat: 'Structured with clear objectives',
        reminderFrequency: 'Daily with progress metrics'
      }
    };

    setInsights(mockInsights);
    setUserPersona(mockPersona);
  }, []);

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setAdaptationScore(Math.min(100, adaptationScore + Math.floor(Math.random() * 10)));
      setIsAnalyzing(false);
    }, 3000);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'behavior': return <User className="h-4 w-4" />;
      case 'preference': return <Heart className="h-4 w-4" />;
      case 'goal': return <Target className="h-4 w-4" />;
      case 'mood': return <MessageSquare className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Personalization Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-therapy-600" />
              <span>AI Personalization Engine</span>
            </CardTitle>
            <Button onClick={runAnalysis} disabled={isAnalyzing}>
              {isAnalyzing ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Run Analysis
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-therapy-600 mb-1">{adaptationScore}%</div>
              <div className="text-sm text-muted-foreground">Adaptation Score</div>
              <Progress value={adaptationScore} className="mt-2" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">{insights.length}</div>
              <div className="text-sm text-muted-foreground">Active Insights</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {userPersona ? '1' : '0'}
              </div>
              <div className="text-sm text-muted-foreground">Persona Identified</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="insights" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="persona">User Persona</TabsTrigger>
          <TabsTrigger value="adaptations">Adaptations</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          {insights.map((insight) => (
            <Card key={insight.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="p-2 bg-therapy-100 rounded-lg">
                      {getCategoryIcon(insight.category)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold">{insight.title}</h4>
                        <Badge variant="outline" className={getImpactColor(insight.impact)}>
                          {insight.impact} impact
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {insight.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>Confidence: {insight.confidence}%</span>
                        <span>Category: {insight.category}</span>
                      </div>
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-800">
                          💡 Suggestion: {insight.actionSuggestion}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Apply
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="persona">
          {userPersona && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>User Persona: {userPersona.type}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Personality Traits</h4>
                  <div className="flex flex-wrap gap-2">
                    {userPersona.traits.map((trait, index) => (
                      <Badge key={index} variant="secondary">{trait}</Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h5 className="font-medium text-sm mb-2">Communication Style</h5>
                    <p className="text-sm text-muted-foreground">
                      {userPersona.preferences.communicationStyle}
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium text-sm mb-2">Session Format</h5>
                    <p className="text-sm text-muted-foreground">
                      {userPersona.preferences.sessionFormat}
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium text-sm mb-2">Reminder Preference</h5>
                    <p className="text-sm text-muted-foreground">
                      {userPersona.preferences.reminderFrequency}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Customize Persona Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="adaptations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Interface Adaptations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Dark mode preference</span>
                  <Badge variant="outline">Auto-detected</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Large text mode</span>
                  <Badge variant="outline">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Notification timing</span>
                  <Badge variant="outline">Optimized</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Color scheme</span>
                  <Badge variant="outline">Calming blues</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Content Adaptations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Technique recommendations</span>
                  <Badge variant="outline">Personalized</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Session length</span>
                  <Badge variant="outline">15-20 min</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Goal complexity</span>
                  <Badge variant="outline">Simplified</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Language tone</span>
                  <Badge variant="outline">Professional</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Behavioral Predictions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Optimal session time: 7:30 PM</p>
                    <p className="text-sm text-muted-foreground">
                      Based on 3 months of engagement data
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Goal completion likelihood: 84%</p>
                    <p className="text-sm text-muted-foreground">
                      For goals set this week
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Heart className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-medium">Stress spike prediction: Low risk</p>
                    <p className="text-sm text-muted-foreground">
                      Next 48 hours outlook
                    </p>
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

export default PersonalizationEngine;
