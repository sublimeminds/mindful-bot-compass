import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Users, 
  Lightbulb,
  Heart,
  ArrowUp,
  ArrowDown,
  Minus,
  Star,
  Activity
} from 'lucide-react';
import { SessionInsight } from '@/services/sessionTranscriptionService';

interface SessionInsightsPanelProps {
  insights: SessionInsight;
}

const SessionInsightsPanel: React.FC<SessionInsightsPanelProps> = ({ insights }) => {
  const formatEmotionalTimeline = () => {
    if (!insights.emotional_tone_timeline || !Array.isArray(insights.emotional_tone_timeline)) {
      return [];
    }
    return insights.emotional_tone_timeline.slice(0, 10); // Show first 10 points
  };

  const getEmotionIcon = (emotion: string) => {
    const icons: Record<string, string> = {
      happy: '😊',
      sad: '😢',
      anxious: '😰',
      calm: '😌',
      frustrated: '😤',
      hopeful: '🌟',
      angry: '😠',
      confused: '😕',
      excited: '🎉',
      neutral: '😐'
    };
    return icons[emotion.toLowerCase()] || '😐';
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity >= 8) return 'bg-red-500';
    if (intensity >= 6) return 'bg-orange-500';
    if (intensity >= 4) return 'bg-yellow-500';
    if (intensity >= 2) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getTrendIcon = (value: number) => {
    if (value > 0) return <ArrowUp className="h-4 w-4 text-green-600" />;
    if (value < 0) return <ArrowDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  return (
    <div className="space-y-6">
      {/* AI Analysis Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-therapy-800">
            <Brain className="h-5 w-5" />
            AI Session Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-therapy-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-therapy-600" />
                <span className="text-sm font-medium">Engagement Level</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={85} className="flex-1" />
                <span className="text-sm font-semibold">85%</span>
              </div>
            </div>
            
            <div className="p-4 bg-calm-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="h-4 w-4 text-calm-600" />
                <span className="text-sm font-medium">Emotional Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={72} className="flex-1" />
                <span className="text-sm font-semibold">72%</span>
              </div>
            </div>
            
            <div className="p-4 bg-balance-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-balance-600" />
                <span className="text-sm font-medium">Goal Alignment</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={90} className="flex-1" />
                <span className="text-sm font-semibold">90%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emotional Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Emotional Journey
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-3">
                {formatEmotionalTimeline().map((point: any, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                    <div className="text-lg">
                      {getEmotionIcon(point.emotion)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium capitalize">{point.emotion}</span>
                        <Badge variant="outline" className="text-xs">
                          {Math.floor(point.timestamp / 60)}:{String(Math.floor(point.timestamp % 60)).padStart(2, '0')}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getIntensityColor(point.intensity)}`}
                            style={{ width: `${point.intensity * 10}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {point.intensity}/10
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Key Topics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Discussion Topics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.key_topics && Array.isArray(insights.key_topics) && insights.key_topics.slice(0, 8).map((topic, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <span className="text-sm font-medium">
                    {typeof topic === 'string' ? topic : JSON.stringify(topic)}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    High Relevance
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Breakthrough Indicators */}
      {insights.breakthrough_indicators && Array.isArray(insights.breakthrough_indicators) && insights.breakthrough_indicators.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Star className="h-4 w-4" />
              Breakthrough Moments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.breakthrough_indicators.slice(0, 5).map((breakthrough: any, index) => (
                <div key={index} className="p-4 bg-gradient-to-r from-therapy-50 to-calm-50 rounded-lg border border-therapy-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🌟</span>
                    <Badge variant="outline" className="text-xs">
                      {Math.floor(breakthrough.timestamp / 60)}:{String(Math.floor(breakthrough.timestamp % 60)).padStart(2, '0')}
                    </Badge>
                    <Badge className="text-xs bg-therapy-600 text-white">
                      Importance: {breakthrough.importance}/10
                    </Badge>
                  </div>
                  <h4 className="text-sm font-semibold mb-1 capitalize">
                    {breakthrough.type?.replace('_', ' ') || 'Breakthrough'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {breakthrough.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Therapy Techniques Used */}
      {insights.therapy_techniques_used && Array.isArray(insights.therapy_techniques_used) && insights.therapy_techniques_used.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Therapy Techniques Applied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {insights.therapy_techniques_used.map((technique, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {typeof technique === 'string' ? technique : JSON.stringify(technique)}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Indicators */}
      {insights.progress_indicators && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Progress Indicators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(insights.progress_indicators).slice(0, 6).map(([key, value]: [string, any]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <span className="text-sm font-medium capitalize">
                    {key.replace('_', ' ')}
                  </span>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(value)}
                    <span className="text-sm font-semibold">
                      {typeof value === 'number' ? value.toFixed(1) : value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SessionInsightsPanel;