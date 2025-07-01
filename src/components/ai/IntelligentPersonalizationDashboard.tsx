import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Lightbulb, 
  TrendingUp, 
  Clock, 
  Target, 
  Zap,
  AlertCircle,
  CheckCircle,
  Calendar,
  BarChart3,
  Sparkles,
  Activity,
  Eye
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { EnhancedPersonalizationService } from '@/services/enhancedPersonalizationService';
import { cn } from '@/lib/utils';

interface AIInsight {
  id: string;
  type: 'pattern' | 'recommendation' | 'prediction' | 'achievement';
  title: string;
  description: string;
  confidence: number;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  actionable: boolean;
  timestamp: string;
}

interface UserPatternSummary {
  moodCycles: {
    bestDays: string[];
    worstDays: string[];
    confidence: number;
  };
  sessionTiming: {
    optimalHours: number[];
    confidence: number;
  };
  techniquePreferences: {
    mostEffective: string[];
    leastEffective: string[];
    confidence: number;
  };
}

const IntelligentPersonalizationDashboard = () => {
  const { user } = useAuth();
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [patterns, setPatterns] = useState<UserPatternSummary | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [riskAssessment, setRiskAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('insights');

  useEffect(() => {
    if (user) {
      loadPersonalizationData();
    }
  }, [user]);

  const loadPersonalizationData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const [userPatterns, contextualRecs, riskPrediction] = await Promise.all([
        EnhancedPersonalizationService.analyzeUserPatterns(user.id),
        EnhancedPersonalizationService.generateContextualRecommendations(user.id),
        EnhancedPersonalizationService.predictMoodRisk(user.id)
      ]);

      // Process patterns into summary
      const patternSummary = processPatterns(userPatterns);
      setPatterns(patternSummary);
      setRecommendations(contextualRecs);
      setRiskAssessment(riskPrediction);

      // Generate AI insights
      const aiInsights = generateInsights(userPatterns, contextualRecs, riskPrediction);
      setInsights(aiInsights);

    } catch (error) {
      console.error('Error loading personalization data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processPatterns = (userPatterns: any[]): UserPatternSummary => {
    const moodPattern = userPatterns.find(p => p.type === 'mood_cycle');
    const timingPattern = userPatterns.find(p => p.type === 'session_timing');
    const techniquePattern = userPatterns.find(p => p.type === 'technique_preference');

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return {
      moodCycles: {
        bestDays: moodPattern?.pattern?.bestDays?.map((day: number) => dayNames[day]) || [],
        worstDays: [], // Could be derived from pattern analysis
        confidence: moodPattern?.confidence || 0
      },
      sessionTiming: {
        optimalHours: timingPattern?.pattern?.preferredHours || [],
        confidence: timingPattern?.confidence || 0
      },
      techniquePreferences: {
        mostEffective: techniquePattern?.pattern?.mostEffective || [],
        leastEffective: [], // Could be derived from effectiveness data
        confidence: techniquePattern?.confidence || 0
      }
    };
  };

  const generateInsights = (patterns: any[], recs: any[], risk: any): AIInsight[] => {
    const insights: AIInsight[] = [];
    const now = new Date().toISOString();

    // Pattern-based insights
    patterns.forEach(pattern => {
      if (pattern.confidence > 0.7) {
        insights.push({
          id: `pattern_${pattern.type}`,
          type: 'pattern',
          title: `Strong ${pattern.type.replace('_', ' ')} Pattern Detected`,
          description: `I've identified a reliable pattern in your ${pattern.type.replace('_', ' ')} with ${Math.round(pattern.confidence * 100)}% confidence`,
          confidence: pattern.confidence,
          priority: pattern.confidence > 0.8 ? 'high' : 'medium',
          actionable: true,
          timestamp: now
        });
      }
    });

    // Risk-based insights
    if (risk.riskLevel !== 'low') {
      insights.push({
        id: 'risk_prediction',
        type: 'prediction',
        title: `${risk.riskLevel === 'high' ? 'High' : 'Medium'} Risk Detected`,
        description: `Based on recent patterns, I recommend taking proactive steps: ${risk.suggestedActions.slice(0, 2).join(', ')}`,
        confidence: risk.confidence,
        priority: risk.riskLevel === 'high' ? 'urgent' : 'high',
        actionable: true,
        timestamp: now
      });
    }

    // Recommendation insights
    if (recs.length > 0) {
      const highConfidenceRecs = recs.filter(r => r.confidence > 0.8);
      if (highConfidenceRecs.length > 0) {
        insights.push({
          id: 'high_confidence_recs',
          type: 'recommendation',
          title: 'Personalized Recommendations Available',
          description: `I have ${highConfidenceRecs.length} high-confidence recommendations ready for you`,
          confidence: Math.max(...highConfidenceRecs.map(r => r.confidence)),
          priority: 'medium',
          actionable: true,
          timestamp: now
        });
      }
    }

    return insights.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-blue-500';
      case 'low': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-therapy-600 animate-pulse" />
          <h2 className="text-2xl font-bold">AI Personalization Dashboard</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-therapy-600" />
          <h2 className="text-2xl font-bold">AI Personalization Dashboard</h2>
        </div>
        <Button onClick={loadPersonalizationData} variant="outline" size="sm">
          <Activity className="h-4 w-4 mr-2" />
          Refresh Insights
        </Button>
      </div>

      {/* Risk Assessment Alert */}
      {riskAssessment && riskAssessment.riskLevel !== 'low' && (
        <Card className={cn(
          "border-l-4",
          riskAssessment.riskLevel === 'high' ? "border-l-red-500 bg-red-50" : "border-l-orange-500 bg-orange-50"
        )}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className={cn(
                "h-5 w-5",
                riskAssessment.riskLevel === 'high' ? "text-red-600" : "text-orange-600"
              )} />
              <h3 className="font-semibold">Proactive Support Recommended</h3>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {riskAssessment.suggestedActions[0]}
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <Badge className={cn(
                "text-xs",
                riskAssessment.riskLevel === 'high' ? "bg-red-100 text-red-800" : "bg-orange-100 text-orange-800"
              )}>
                {riskAssessment.riskLevel} risk
              </Badge>
              <span className="text-xs text-gray-500">
                {Math.round(riskAssessment.confidence * 100)}% confidence
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="insights" className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4" />
            <span>AI Insights</span>
          </TabsTrigger>
          <TabsTrigger value="patterns" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Patterns</span>
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center space-x-2">
            <Lightbulb className="h-4 w-4" />
            <span>Recommendations</span>
          </TabsTrigger>
          <TabsTrigger value="predictions" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Predictions</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {insights.map(insight => (
              <Card key={insight.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={cn("w-2 h-2 rounded-full", getPriorityColor(insight.priority))}></div>
                        <h3 className="font-semibold">{insight.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {insight.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3 text-gray-400" />
                          <span className={cn("text-xs font-medium", getConfidenceColor(insight.confidence))}>
                            {Math.round(insight.confidence * 100)}% confidence
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {new Date(insight.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    {insight.actionable && (
                      <Button size="sm" variant="outline">
                        Take Action
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            {insights.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-600 mb-2">Learning About You</h3>
                  <p className="text-gray-500">
                    Keep using the app and I'll start generating personalized insights based on your patterns.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          {patterns && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Mood Cycles */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>Mood Patterns</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Best Days</p>
                      <div className="flex flex-wrap gap-1">
                        {patterns.moodCycles.bestDays.map(day => (
                          <Badge key={day} className="text-xs bg-green-100 text-green-800">
                            {day}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Confidence</span>
                      <span className={cn("text-xs font-medium", getConfidenceColor(patterns.moodCycles.confidence))}>
                        {Math.round(patterns.moodCycles.confidence * 100)}%
                      </span>
                    </div>
                    <Progress value={patterns.moodCycles.confidence * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Session Timing */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>Optimal Timing</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Best Hours</p>
                      <div className="flex flex-wrap gap-1">
                        {patterns.sessionTiming.optimalHours.map(hour => (
                          <Badge key={hour} className="text-xs bg-blue-100 text-blue-800">
                            {hour}:00
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Confidence</span>
                      <span className={cn("text-xs font-medium", getConfidenceColor(patterns.sessionTiming.confidence))}>
                        {Math.round(patterns.sessionTiming.confidence * 100)}%
                      </span>
                    </div>
                    <Progress value={patterns.sessionTiming.confidence * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Technique Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-sm">
                    <Target className="h-4 w-4" />
                    <span>Effective Techniques</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Most Effective</p>
                      <div className="space-y-1">
                        {patterns.techniquePreferences.mostEffective.slice(0, 3).map(technique => (
                          <div key={technique} className="flex items-center space-x-2">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            <span className="text-xs">{technique}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Confidence</span>
                      <span className={cn("text-xs font-medium", getConfidenceColor(patterns.techniquePreferences.confidence))}>
                        {Math.round(patterns.techniquePreferences.confidence * 100)}%
                      </span>
                    </div>
                    <Progress value={patterns.techniquePreferences.confidence * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {recommendations.map(rec => (
              <Card key={rec.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Lightbulb className="h-4 w-4 text-yellow-600" />
                        <h3 className="font-semibold">{rec.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {rec.type}
                        </Badge>
                        <Badge className={cn(
                          "text-xs",
                          rec.priority === 'urgent' ? "bg-red-100 text-red-800" :
                          rec.priority === 'high' ? "bg-orange-100 text-orange-800" :
                          rec.priority === 'medium' ? "bg-blue-100 text-blue-800" :
                          "bg-gray-100 text-gray-800"
                        )}>
                          {rec.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                      <p className="text-xs text-gray-500 mb-3">{rec.reasoning}</p>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-gray-500">Confidence:</span>
                          <span className={cn("text-xs font-medium", getConfidenceColor(rec.confidence))}>
                            {Math.round(rec.confidence * 100)}%
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-gray-500">Impact:</span>
                          <span className="text-xs font-medium text-green-600">
                            {Math.round(rec.estimatedImpact * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" className="bg-therapy-600 hover:bg-therapy-700">
                      Apply
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {recommendations.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-600 mb-2">No Recommendations Yet</h3>
                  <p className="text-gray-500">
                    Continue using the app and I'll generate personalized recommendations for you.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Mood Risk Prediction</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {riskAssessment ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Current Risk Level:</span>
                    <Badge className={cn(
                      "text-sm",
                      riskAssessment.riskLevel === 'high' ? "bg-red-100 text-red-800" :
                      riskAssessment.riskLevel === 'medium' ? "bg-orange-100 text-orange-800" :
                      "bg-green-100 text-green-800"
                    )}>
                      {riskAssessment.riskLevel}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">Suggested Actions:</p>
                    <ul className="space-y-1">
                      {riskAssessment.suggestedActions.map((action: string, index: number) => (
                        <li key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Prediction Confidence:</span>
                    <span className={cn("text-sm font-medium", getConfidenceColor(riskAssessment.confidence))}>
                      {Math.round(riskAssessment.confidence * 100)}%
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-600 mb-2">Analyzing Patterns</h3>
                  <p className="text-gray-500">
                    I need more data to make accurate predictions about your wellbeing.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntelligentPersonalizationDashboard;