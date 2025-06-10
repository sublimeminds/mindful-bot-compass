
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, TrendingUp, Target, Heart } from 'lucide-react';
import { AnalyticsData } from '@/services/analyticsService';

interface ProgressReportProps {
  analyticsData: AnalyticsData;
  dateRange: string;
}

const ProgressReport = ({ analyticsData, dateRange }: ProgressReportProps) => {
  const handleExportReport = () => {
    const reportData = {
      period: dateRange,
      generated: new Date().toLocaleDateString(),
      sessionStats: analyticsData.sessionStats,
      moodTrends: analyticsData.moodTrends,
      insights: analyticsData.insights
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `therapy-progress-report-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const { sessionStats, moodTrends, insights } = analyticsData;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Progress Report - {dateRange}
            </CardTitle>
            <Button onClick={handleExportReport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-therapy-50 to-therapy-100 rounded-lg">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-therapy-600" />
              <h3 className="font-semibold">Session Progress</h3>
              <p className="text-2xl font-bold text-therapy-700">{sessionStats.totalSessions}</p>
              <p className="text-sm text-muted-foreground">Total sessions completed</p>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <Heart className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <h3 className="font-semibold">Mood Improvement</h3>
              <p className="text-2xl font-bold text-green-700">+{sessionStats.averageMoodImprovement}</p>
              <p className="text-sm text-muted-foreground">Average per session</p>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <Target className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-semibold">Streak</h3>
              <p className="text-2xl font-bold text-blue-700">{sessionStats.streakDays}</p>
              <p className="text-sm text-muted-foreground">Consecutive days</p>
            </div>
          </div>

          {/* Detailed Analysis */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Detailed Analysis</h3>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Session Activity</h4>
              <ul className="space-y-1 text-sm">
                <li>• Total sessions: {sessionStats.totalSessions}</li>
                <li>• Average duration: {sessionStats.averageDuration} minutes</li>
                <li>• Total therapy time: {Math.round(sessionStats.totalMinutes / 60)}h {sessionStats.totalMinutes % 60}m</li>
                <li>• Sessions this week: {sessionStats.sessionsThisWeek}</li>
              </ul>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Mood Trends</h4>
              <ul className="space-y-1 text-sm">
                <li>• Average mood: {moodTrends.averageMood}/10</li>
                <li>• Recent change: {moodTrends.recentChange > 0 ? '+' : ''}{moodTrends.recentChange}</li>
                <li>• Overall trend: {moodTrends.overallTrend}</li>
                <li>• Mood stability: {moodTrends.moodVariability < 2 ? 'Stable' : 'Variable'}</li>
              </ul>
            </div>

            {sessionStats.mostUsedTechniques.length > 0 && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Most Used Techniques</h4>
                <ul className="space-y-1 text-sm">
                  {sessionStats.mostUsedTechniques.map((technique, index) => (
                    <li key={technique}>• {index + 1}. {technique}</li>
                  ))}
                </ul>
              </div>
            )}

            {insights.length > 0 && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Key Insights</h4>
                <ul className="space-y-2 text-sm">
                  {insights.map((insight, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-therapy-600">•</span>
                      <div>
                        <span className="font-medium">{insight.title}:</span> {insight.description}
                        {insight.actionable && (
                          <div className="text-muted-foreground mt-1">
                            💡 {insight.actionable}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Report Footer */}
          <div className="text-center text-sm text-muted-foreground pt-4 border-t">
            <p>Report generated on {new Date().toLocaleDateString()}</p>
            <p>Keep up the great work on your mental health journey! 🌟</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressReport;
