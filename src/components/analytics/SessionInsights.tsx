
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Star, Lightbulb, Target, BarChart3 } from "lucide-react";
import { useSession } from "@/contexts/SessionContext";

const SessionInsights = () => {
  const { getSessionInsights } = useSession();
  const insights = getSessionInsights();

  const getMoodTrendColor = (trend: number) => {
    if (trend > 1) return "text-green-600";
    if (trend > 0) return "text-blue-600";
    if (trend > -1) return "text-yellow-600";
    return "text-red-600";
  };

  const getMoodTrendText = (trend: number) => {
    if (trend > 1) return "Significantly improving";
    if (trend > 0) return "Improving";
    if (trend > -1) return "Stable";
    return "Needs attention";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Sessions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{insights.totalSessions}</div>
          <p className="text-xs text-muted-foreground">
            Therapy sessions completed
          </p>
        </CardContent>
      </Card>

      {/* Average Rating */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Session Rating</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {insights.averageRating > 0 ? insights.averageRating.toFixed(1) : 'N/A'}
          </div>
          <p className="text-xs text-muted-foreground">
            Average session helpfulness
          </p>
          {insights.averageRating > 0 && (
            <div className="flex mt-2">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.round(insights.averageRating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mood Trend */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Mood Trend</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getMoodTrendColor(insights.moodTrend)}`}>
            {insights.moodTrend > 0 ? '+' : ''}{insights.moodTrend.toFixed(1)}
          </div>
          <p className="text-xs text-muted-foreground">
            {getMoodTrendText(insights.moodTrend)}
          </p>
          <Progress 
            value={Math.min(100, Math.max(0, (insights.moodTrend + 5) * 10))} 
            className="mt-2 h-1"
          />
        </CardContent>
      </Card>

      {/* Breakthroughs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Breakthroughs</CardTitle>
          <Lightbulb className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{insights.totalBreakthroughs}</div>
          <p className="text-xs text-muted-foreground">
            Key insights discovered
          </p>
        </CardContent>
      </Card>

      {/* Most Used Techniques */}
      {insights.mostUsedTechniques.length > 0 && (
        <Card className="md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Most Effective Techniques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {insights.mostUsedTechniques.map((technique, index) => (
                <Badge 
                  key={technique} 
                  variant={index === 0 ? "default" : "secondary"}
                  className="text-sm"
                >
                  {technique}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              These are the therapy techniques you've used most frequently in your sessions.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SessionInsights;
