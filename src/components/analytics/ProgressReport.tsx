
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  Target, 
  Brain,
  Clock,
  Star
} from "lucide-react";
import { AnalyticsData } from "@/services/analyticsService";
import { useToast } from "@/hooks/use-toast";

interface ProgressReportProps {
  analyticsData: AnalyticsData;
  dateRange: string;
}

const ProgressReport = ({ analyticsData, dateRange }: ProgressReportProps) => {
  const { toast } = useToast();

  const handleExportReport = () => {
    // Mock export functionality
    toast({
      title: "Report Exported",
      description: "Your progress report has been downloaded as PDF.",
    });
  };

  const calculateOverallProgress = () => {
    const goals = Object.values(analyticsData.goalProgress);
    if (goals.length === 0) return 0;
    
    const totalProgress = goals.reduce((sum, goal) => sum + goal.progress, 0);
    return Math.round(totalProgress / goals.length);
  };

  const getOverallRating = () => {
    const overallProgress = calculateOverallProgress();
    const { overallTrend } = analyticsData.moodTrends;
    const streakScore = Math.min(analyticsData.sessionStats.currentStreak / 7, 1) * 20;
    
    let score = overallProgress * 0.4 + streakScore;
    
    if (overallTrend === 'improving') score += 20;
    else if (overallTrend === 'declining') score -= 10;
    
    return Math.min(Math.max(score, 0), 100);
  };

  const getRatingText = (rating: number) => {
    if (rating >= 80) return 'Excellent Progress';
    if (rating >= 60) return 'Good Progress';
    if (rating >= 40) return 'Steady Progress';
    if (rating >= 20) return 'Some Progress';
    return 'Getting Started';
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 80) return 'text-green-600';
    if (rating >= 60) return 'text-blue-600';
    if (rating >= 40) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const overallProgress = calculateOverallProgress();
  const overallRating = getOverallRating();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Progress Report
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Comprehensive analysis for {dateRange}
            </p>
          </div>
          <Button variant="outline" onClick={handleExportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Rating */}
        <div className="text-center p-6 bg-muted rounded-lg">
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-6 w-6 ${
                  i < Math.floor(overallRating / 20) 
                    ? 'text-yellow-500 fill-current' 
                    : 'text-gray-300'
                }`} 
              />
            ))}
          </div>
          <h3 className={`text-xl font-bold ${getRatingColor(overallRating)}`}>
            {getRatingText(overallRating)}
          </h3>
          <p className="text-muted-foreground">
            Overall therapy progress score: {Math.round(overallRating)}%
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-therapy-500" />
            <p className="text-xl font-bold">{analyticsData.sessionStats.totalSessions}</p>
            <p className="text-sm text-muted-foreground">Sessions</p>
          </div>
          
          <div className="text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p className="text-xl font-bold">{overallProgress}%</p>
            <p className="text-sm text-muted-foreground">Goal Progress</p>
          </div>
          
          <div className="text-center">
            <Brain className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <p className="text-xl font-bold">{analyticsData.moodTrends.averageMood.toFixed(1)}</p>
            <p className="text-sm text-muted-foreground">Avg Mood</p>
          </div>
          
          <div className="text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <p className="text-xl font-bold">{Math.round(analyticsData.sessionStats.averageDuration)}</p>
            <p className="text-sm text-muted-foreground">Avg Duration</p>
          </div>
        </div>

        {/* Progress Breakdown */}
        <div className="space-y-4">
          <h4 className="font-medium">Progress Breakdown</h4>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Session Consistency</span>
                <span>{Math.min(analyticsData.sessionStats.currentStreak * 10, 100)}%</span>
              </div>
              <Progress value={Math.min(analyticsData.sessionStats.currentStreak * 10, 100)} />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Mood Stability</span>
                <span>{Math.max(100 - analyticsData.moodTrends.moodVariability * 10, 0).toFixed(0)}%</span>
              </div>
              <Progress value={Math.max(100 - analyticsData.moodTrends.moodVariability * 10, 0)} />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Goal Achievement</span>
                <span>{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} />
            </div>
          </div>
        </div>

        {/* Key Highlights */}
        <div className="space-y-3">
          <h4 className="font-medium">Key Highlights</h4>
          <div className="space-y-2">
            {analyticsData.sessionStats.currentStreak >= 3 && (
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Achievement
                </Badge>
                <span className="text-sm">
                  {analyticsData.sessionStats.currentStreak}-day session streak
                </span>
              </div>
            )}
            
            {analyticsData.moodTrends.overallTrend === 'improving' && (
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Progress
                </Badge>
                <span className="text-sm">Mood trending upward</span>
              </div>
            )}
            
            {analyticsData.patterns.mostEffectiveTechniques.length > 0 && (
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  Insight
                </Badge>
                <span className="text-sm">
                  Most effective technique: {analyticsData.patterns.mostEffectiveTechniques[0]}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        {analyticsData.insights.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Recommendations</h4>
            <div className="space-y-2">
              {analyticsData.insights.slice(0, 3).map((insight, index) => (
                <div key={index} className="text-sm text-muted-foreground">
                  • {insight.description}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgressReport;
