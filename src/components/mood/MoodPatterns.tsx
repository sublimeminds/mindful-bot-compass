
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus, Clock, AlertTriangle, Activity } from "lucide-react";
import { MoodPattern, MoodCorrelation } from "@/services/moodTrackingService";

interface MoodPatternsProps {
  patterns: MoodPattern;
  correlations: MoodCorrelation[];
  insights: Array<{
    type: 'positive' | 'warning' | 'info';
    title: string;
    message: string;
  }>;
}

const MoodPatterns = ({ patterns, correlations, insights }: MoodPatternsProps) => {
  const getTrendIcon = () => {
    switch (patterns.trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = () => {
    switch (patterns.trend) {
      case 'improving': return 'text-green-600 bg-green-50';
      case 'declining': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'positive': return 'border-green-200 bg-green-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      default: return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {getTrendIcon()}
            <span>Mood Trend</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className={`p-3 rounded-lg ${getTrendColor()}`}>
              <p className="font-medium capitalize">{patterns.trend} Trend</p>
              <p className="text-sm">
                Average change: {patterns.averageChange > 0 ? '+' : ''}{patterns.averageChange.toFixed(1)} points
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Best time: {patterns.bestTime}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Worst time: {patterns.worstTime}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {insights.map((insight, index) => (
            <div key={index} className={`p-3 rounded-lg border ${getInsightColor(insight.type)}`}>
              <div className="flex items-start space-x-2">
                {getInsightIcon(insight.type)}
                <div>
                  <p className="font-medium text-sm">{insight.title}</p>
                  <p className="text-sm text-muted-foreground">{insight.message}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Activity Correlations */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Impact</CardTitle>
          <p className="text-sm text-muted-foreground">
            How different activities affect your mood
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {correlations.slice(0, 8).map((correlation, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{correlation.activity}</span>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={correlation.impact > 0 ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {correlation.impact > 0 ? '+' : ''}{(correlation.impact * 100).toFixed(0)}%
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      ({correlation.occurrences} times)
                    </span>
                  </div>
                </div>
                <Progress 
                  value={Math.abs(correlation.impact) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Triggers */}
      {patterns.topTriggers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span>Common Triggers</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {patterns.topTriggers.map((trigger, index) => (
                <Badge key={index} variant="outline" className="border-yellow-200">
                  {trigger}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Helpful Activities */}
      {patterns.helpfulActivities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-green-500" />
              <span>Mood Boosters</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {patterns.helpfulActivities.map((activity, index) => (
                <Badge key={index} variant="outline" className="border-green-200">
                  {activity}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MoodPatterns;
