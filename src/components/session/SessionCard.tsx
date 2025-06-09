
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, TrendingUp, TrendingDown, Minus, Eye } from "lucide-react";
import { SessionSummary } from "@/services/sessionHistoryService";
import { format } from "date-fns";

interface SessionCardProps {
  session: SessionSummary;
  onViewDetails: (session: SessionSummary) => void;
}

const SessionCard = ({ session, onViewDetails }: SessionCardProps) => {
  const getMoodTrendIcon = () => {
    if (!session.moodChange) return <Minus className="h-4 w-4 text-gray-500" />;
    if (session.moodChange > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (session.moodChange < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getEffectivenessColor = () => {
    switch (session.effectiveness) {
      case 'high': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getEffectivenessValue = () => {
    switch (session.effectiveness) {
      case 'high': return 85;
      case 'medium': return 60;
      case 'low': return 30;
      default: return 0;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>{format(session.date, 'MMMM dd, yyyy')}</span>
          </CardTitle>
          <Badge 
            variant="outline"
            className={`${
              session.effectiveness === 'high' ? 'border-green-200 text-green-700' :
              session.effectiveness === 'medium' ? 'border-yellow-200 text-yellow-700' :
              'border-red-200 text-red-700'
            }`}
          >
            {session.effectiveness} effectiveness
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Session Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{session.duration} minutes</span>
          </div>
          {session.moodBefore && session.moodAfter && (
            <div className="flex items-center space-x-2">
              {getMoodTrendIcon()}
              <span className="text-sm">
                {session.moodBefore} → {session.moodAfter}
                {session.moodChange !== undefined && (
                  <span className={`ml-1 ${session.moodChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ({session.moodChange > 0 ? '+' : ''}{session.moodChange})
                  </span>
                )}
              </span>
            </div>
          )}
        </div>

        {/* Effectiveness Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Session Effectiveness</span>
            <span className="text-sm text-muted-foreground">{getEffectivenessValue()}%</span>
          </div>
          <Progress value={getEffectivenessValue()} className="h-2" />
        </div>

        {/* Techniques */}
        <div className="space-y-2">
          <span className="text-sm font-medium">Techniques Used</span>
          <div className="flex flex-wrap gap-1">
            {session.techniques.slice(0, 3).map((technique, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {technique}
              </Badge>
            ))}
            {session.techniques.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{session.techniques.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Key Insights Preview */}
        {session.keyInsights.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm font-medium">Key Insight</span>
            <p className="text-sm text-muted-foreground">
              {session.keyInsights[0]}
              {session.keyInsights.length > 1 && '...'}
            </p>
          </div>
        )}

        <Button 
          variant="outline" 
          className="w-full mt-4"
          onClick={() => onViewDetails(session)}
        >
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default SessionCard;
