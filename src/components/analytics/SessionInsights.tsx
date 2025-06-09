
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  Clock, 
  Flame, 
  BarChart3, 
  AlertCircle, 
  CheckCircle, 
  Lightbulb,
  Star,
  ArrowRight
} from "lucide-react";
import { AnalyticsData } from "@/services/analyticsService";
import { useNavigate } from "react-router-dom";

interface SessionInsightsProps {
  sessionStats: AnalyticsData['sessionStats'];
  insights: AnalyticsData['insights'];
  patterns: AnalyticsData['patterns'];
}

const SessionInsights = ({ sessionStats, insights, patterns }: SessionInsightsProps) => {
  const navigate = useNavigate();

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'concern':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'suggestion':
        return <Lightbulb className="h-4 w-4 text-blue-600" />;
      case 'milestone':
        return <Star className="h-4 w-4 text-yellow-600" />;
      default:
        return <BarChart3 className="h-4 w-4 text-gray-600" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'achievement':
        return 'bg-green-100 text-green-800';
      case 'concern':
        return 'bg-red-100 text-red-800';
      case 'suggestion':
        return 'bg-blue-100 text-blue-800';
      case 'milestone':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Session Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Session Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-therapy-500" />
              <p className="text-2xl font-bold">{sessionStats.totalSessions}</p>
              <p className="text-sm text-muted-foreground">Total Sessions</p>
            </div>
            
            <div className="text-center p-4 bg-muted rounded-lg">
              <Clock className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold">{Math.round(sessionStats.averageDuration)}</p>
              <p className="text-sm text-muted-foreground">Avg Duration (min)</p>
            </div>
            
            <div className="text-center p-4 bg-muted rounded-lg">
              <Flame className="h-8 w-8 mx-auto mb-2 text-orange-500" />
              <p className="text-2xl font-bold">{sessionStats.currentStreak}</p>
              <p className="text-sm text-muted-foreground">Current Streak</p>
            </div>
            
            <div className="text-center p-4 bg-muted rounded-lg">
              <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <p className="text-2xl font-bold">{sessionStats.longestStreak}</p>
              <p className="text-sm text-muted-foreground">Best Streak</p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Weekly Goal Progress</span>
              <span className="text-sm text-muted-foreground">
                {sessionStats.weeklyAverage.toFixed(1)} / 4 sessions
              </span>
            </div>
            <Progress value={(sessionStats.weeklyAverage / 4) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Patterns */}
      <Card>
        <CardHeader>
          <CardTitle>Your Patterns</CardTitle>
          <p className="text-sm text-muted-foreground">
            Insights based on your session data
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Best Session Day</h4>
              <p className="text-lg font-semibold text-therapy-600">{patterns.bestDayOfWeek}</p>
              <p className="text-sm text-muted-foreground">Most sessions completed</p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Preferred Time</h4>
              <p className="text-lg font-semibold text-therapy-600">{patterns.bestTimeOfDay}</p>
              <p className="text-sm text-muted-foreground">Most active time</p>
            </div>
          </div>

          {patterns.mostEffectiveTechniques.length > 0 && (
            <div>
              <h4 className="font-medium mb-3">Most Used Techniques</h4>
              <div className="flex flex-wrap gap-2">
                {patterns.mostEffectiveTechniques.map((technique, index) => (
                  <Badge key={index} variant="secondary">
                    {technique}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Insights */}
      {insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Personalized Insights</CardTitle>
            <p className="text-sm text-muted-foreground">
              AI-generated insights based on your progress
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.map((insight, index) => (
              <div 
                key={index} 
                className={`p-4 border-l-4 bg-muted/50 rounded-r-lg ${getPriorityColor(insight.priority)}`}
              >
                <div className="flex items-start space-x-3">
                  <Badge className={getInsightColor(insight.type)}>
                    {getInsightIcon(insight.type)}
                    <span className="ml-1 capitalize">{insight.type}</span>
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {insight.description}
                    </p>
                    {insight.actionable && (
                      <div className="mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate('/chat')}
                        >
                          {insight.actionable}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SessionInsights;
