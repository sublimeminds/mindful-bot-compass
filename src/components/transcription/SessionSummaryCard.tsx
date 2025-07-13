import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Target, 
  CheckCircle, 
  TrendingUp, 
  Calendar,
  Clock,
  Star,
  ArrowRight
} from 'lucide-react';
import { SessionSummary } from '@/services/sessionTranscriptionService';

interface SessionSummaryCardProps {
  summary: SessionSummary;
  onViewFullTranscript?: () => void;
  onViewInsights?: () => void;
}

const SessionSummaryCard: React.FC<SessionSummaryCardProps> = ({
  summary,
  onViewFullTranscript,
  onViewInsights
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getEffectivenessColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 6) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (score >= 4) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const effectivenessLabel = (score: number) => {
    if (score >= 8) return 'Highly Effective';
    if (score >= 6) return 'Effective';
    if (score >= 4) return 'Moderately Effective';
    return 'Needs Improvement';
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border border-therapy-100 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-therapy-50 to-calm-50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-therapy-800">
            <FileText className="h-5 w-5" />
            Session Summary
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              {formatDate(summary.created_at)}
            </Badge>
            <Badge 
              className={`text-xs border ${getEffectivenessColor(summary.effectiveness_score)}`}
            >
              <Star className="h-3 w-3 mr-1" />
              {effectivenessLabel(summary.effectiveness_score)}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Executive Summary */}
        <div>
          <h3 className="text-sm font-semibold text-therapy-700 mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Session Overview
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {summary.executive_summary}
          </p>
        </div>

        <Separator />

        {/* Key Takeaways */}
        {summary.key_takeaways && Array.isArray(summary.key_takeaways) && summary.key_takeaways.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-therapy-700 mb-3 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Key Takeaways
            </h3>
            <div className="space-y-2">
              {summary.key_takeaways.slice(0, 4).map((takeaway, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-therapy-400 mt-2 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    {typeof takeaway === 'string' ? takeaway : JSON.stringify(takeaway)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Items */}
        {summary.action_items && Array.isArray(summary.action_items) && summary.action_items.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-therapy-700 mb-3 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Action Items
            </h3>
            <div className="space-y-2">
              {summary.action_items.slice(0, 3).map((action, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-therapy-25 rounded">
                  <CheckCircle className="h-4 w-4 text-therapy-500 flex-shrink-0" />
                  <p className="text-sm">
                    {typeof action === 'string' ? action : JSON.stringify(action)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Goals Addressed */}
        {summary.goals_addressed && Array.isArray(summary.goals_addressed) && summary.goals_addressed.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-therapy-700 mb-3 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Goals Addressed
            </h3>
            <div className="flex flex-wrap gap-2">
              {summary.goals_addressed.slice(0, 5).map((goal, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {typeof goal === 'string' ? goal : JSON.stringify(goal)}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onViewFullTranscript}
            className="flex-1"
          >
            <FileText className="h-4 w-4 mr-2" />
            View Transcript
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onViewInsights}
            className="flex-1"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            AI Insights
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionSummaryCard;