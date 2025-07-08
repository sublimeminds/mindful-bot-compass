import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain,
  TrendingUp,
  Target,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Heart,
  Lightbulb,
  ArrowRight,
  Sparkles,
  Activity
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface TherapeuticInsight {
  id: string;
  type: 'breakthrough' | 'pattern' | 'progress' | 'recommendation';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  date: string;
  confidence: number;
  actionable: boolean;
  relatedAction?: {
    label: string;
    path: string;
  };
}

interface CompatibilityHistory {
  therapist_id: string;
  therapist_name: string;
  initial_score: number;
  current_score: number;
  sessions_count: number;
  improvement_rate: number;
  effectiveness_rating: number;
}

const AIProfileInsights = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [insights, setInsights] = useState<TherapeuticInsight[]>([]);
  const [compatibilityHistory, setCompatibilityHistory] = useState<CompatibilityHistory[]>([]);
  const [therapeuticMemory, setTherapeuticMemory] = useState<any[]>([]);
  const [crisisPatterns, setCrisisPatterns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfileInsights = async () => {
      if (!user) return;
      
      try {
        // Simulate AI-generated therapeutic insights
        const mockInsights: TherapeuticInsight[] = [
          {
            id: '1',
            type: 'breakthrough',
            title: 'Communication Pattern Breakthrough',
            description: 'You\'ve shown significant improvement in expressing emotions during therapy sessions. This breakthrough occurred during your session with Dr. Sarah Chen.',
            impact: 'high',
            date: '2024-07-05',
            confidence: 0.92,
            actionable: true,
            relatedAction: {
              label: 'Practice Communication',
              path: '/techniques/communication'
            }
          },
          {
            id: '2',
            type: 'pattern',
            title: 'Evening Anxiety Pattern Identified',
            description: 'AI analysis shows your anxiety levels consistently peak between 6-8 PM. This correlates with work transitions and family expectations.',
            impact: 'medium',
            date: '2024-07-03',
            confidence: 0.87,
            actionable: true,
            relatedAction: {
              label: 'Evening Routine Plan',
              path: '/techniques/evening-routine'
            }
          },
          {
            id: '3',
            type: 'progress',
            title: 'Sleep Quality Improvement',
            description: 'Your sleep consistency has improved by 34% over the past month, directly correlating with therapy engagement.',
            impact: 'high',
            date: '2024-07-01',
            confidence: 0.95,
            actionable: false
          },
          {
            id: '4',
            type: 'recommendation',
            title: 'Cultural Integration Opportunity',
            description: 'Based on your progress, incorporating family dynamics discussions could accelerate your therapeutic goals by an estimated 23%.',
            impact: 'medium',
            date: '2024-06-28',
            confidence: 0.79,
            actionable: true,
            relatedAction: {
              label: 'Explore Family Therapy',
              path: '/therapy-chat?focus=family'
            }
          }
        ];

        const mockCompatibilityHistory: CompatibilityHistory[] = [
          {
            therapist_id: '1',
            therapist_name: 'Dr. Sarah Chen',
            initial_score: 82,
            current_score: 93,
            sessions_count: 12,
            improvement_rate: 13.4,
            effectiveness_rating: 4.8
          },
          {
            therapist_id: '2',
            therapist_name: 'Dr. Maya Patel',
            initial_score: 76,
            current_score: 71,
            sessions_count: 3,
            improvement_rate: -6.6,
            effectiveness_rating: 3.2
          }
        ];

        const mockTherapeuticMemory = [
          {
            title: 'First Vulnerability Moment',
            description: 'User shared childhood trauma for the first time - significant trust milestone',
            importance: 0.95,
            date: '2024-06-15',
            therapist: 'Dr. Sarah Chen'
          },
          {
            title: 'Cultural Conflict Resolution',
            description: 'Breakthrough in understanding family expectations vs personal goals',
            importance: 0.88,
            date: '2024-06-22',
            therapist: 'Dr. Sarah Chen'
          },
          {
            title: 'Anxiety Coping Success',
            description: 'Successfully used breathing technique during work presentation',
            importance: 0.82,
            date: '2024-06-28',
            therapist: 'Dr. Sarah Chen'
          }
        ];

        const mockCrisisPatterns = [
          {
            pattern: 'Sunday Evening Overwhelm',
            frequency: 'Weekly',
            severity: 'Moderate',
            triggers: ['Work anticipation', 'Family calls', 'Social media'],
            effectiveness: {
              prevention: 73,
              intervention: 89
            }
          }
        ];

        setInsights(mockInsights);
        setCompatibilityHistory(mockCompatibilityHistory);
        setTherapeuticMemory(mockTherapeuticMemory);
        setCrisisPatterns(mockCrisisPatterns);
      } catch (error) {
        console.error('Error loading profile insights:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileInsights();
  }, [user]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'breakthrough': return Sparkles;
      case 'pattern': return TrendingUp;
      case 'progress': return CheckCircle;
      case 'recommendation': return Lightbulb;
      default: return Brain;
    }
  };

  const getInsightColor = (type: string, impact: string) => {
    if (type === 'breakthrough') return 'from-purple-500 to-pink-500';
    if (impact === 'high') return 'from-therapy-500 to-therapy-600';
    if (impact === 'medium') return 'from-harmony-500 to-harmony-600';
    return 'from-calm-500 to-calm-600';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Insights Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-therapy-600" />
            <span>AI Therapeutic Insights</span>
            <Badge variant="outline" className="bg-therapy-50 text-therapy-700 border-therapy-200">
              <Activity className="h-3 w-3 mr-1" />
              {insights.length} Active
            </Badge>
          </CardTitle>
          <p className="text-muted-foreground">
            AI-powered analysis of your therapeutic journey and personalized recommendations
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.map((insight) => {
            const IconComponent = getInsightIcon(insight.type);
            return (
              <div key={insight.id} className="group">
                <div className="flex items-start space-x-3 p-4 rounded-lg border border-gray-100 hover:border-therapy-200 hover:bg-therapy-25 transition-all duration-200">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${getInsightColor(insight.type, insight.impact)} flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-900">
                        {insight.title}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <Badge className={`text-xs ${getImpactColor(insight.impact)}`}>
                          {insight.impact} impact
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                      {insight.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{insight.date}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-gray-500">Confidence:</span>
                          <Progress 
                            value={insight.confidence * 100} 
                            className="w-12 h-1.5"
                          />
                          <span className="text-xs font-medium text-gray-600">
                            {Math.round(insight.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                      
                      {insight.relatedAction && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate(insight.relatedAction!.path)}
                          className="text-xs text-therapy-600 hover:text-therapy-700 hover:bg-therapy-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          {insight.relatedAction.label}
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Therapist Compatibility History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-harmony-600" />
            <span>Therapist Compatibility Evolution</span>
          </CardTitle>
          <p className="text-muted-foreground">
            Track how your compatibility with different therapists has evolved over time
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {compatibilityHistory.map((history) => (
            <div key={history.therapist_id} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">{history.therapist_name}</h4>
                <Badge variant={history.improvement_rate > 0 ? 'default' : 'secondary'}>
                  {history.improvement_rate > 0 ? '+' : ''}{history.improvement_rate.toFixed(1)}%
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Initial Score</p>
                  <p className="font-medium">{history.initial_score}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Current Score</p>
                  <p className="font-medium">{history.current_score}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Sessions</p>
                  <p className="font-medium">{history.sessions_count}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Effectiveness</p>
                  <p className="font-medium">{history.effectiveness_rating}/5.0</p>
                </div>
              </div>
              
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span>Compatibility Progress</span>
                  <span>{history.current_score}%</span>
                </div>
                <Progress value={history.current_score} className="h-2" />
              </div>
            </div>
          ))}
          
          <Button
            variant="outline"
            onClick={() => navigate('/therapist-selection')}
            className="w-full"
          >
            <Heart className="h-4 w-4 mr-2" />
            Optimize Therapist Match
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>

      {/* Therapeutic Memory Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-flow-600" />
            <span>Therapeutic Memory Timeline</span>
          </CardTitle>
          <p className="text-muted-foreground">
            Key breakthrough moments and memories from your therapeutic journey
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {therapeuticMemory.map((memory, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-3 h-3 bg-flow-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-sm">{memory.title}</h4>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {Math.round(memory.importance * 100)}% importance
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">{memory.description}</p>
                <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                  <span>{memory.date}</span>
                  <span>•</span>
                  <span>{memory.therapist}</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Crisis Pattern Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <span>Crisis Pattern Prevention</span>
          </CardTitle>
          <p className="text-muted-foreground">
            AI analysis of patterns and early intervention effectiveness
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {crisisPatterns.map((pattern, index) => (
            <div key={index} className="p-4 border rounded-lg bg-yellow-50/50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">{pattern.pattern}</h4>
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                  {pattern.frequency}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Common Triggers</p>
                  <div className="flex flex-wrap gap-1">
                    {pattern.triggers.map((trigger: string, i: number) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {trigger}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Prevention Success</p>
                    <div className="flex items-center space-x-2">
                      <Progress value={pattern.effectiveness.prevention} className="flex-1 h-2" />
                      <span className="text-sm font-medium">{pattern.effectiveness.prevention}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Intervention Success</p>
                    <div className="flex items-center space-x-2">
                      <Progress value={pattern.effectiveness.intervention} className="flex-1 h-2" />
                      <span className="text-sm font-medium">{pattern.effectiveness.intervention}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <Button
            variant="outline"
            onClick={() => navigate('/crisis-resources')}
            className="w-full"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            View Crisis Resources
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIProfileInsights;