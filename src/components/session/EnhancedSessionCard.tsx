
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Eye, 
  MessageCircle,
  Brain,
  Star,
  Lightbulb
} from "lucide-react";
import { SessionSummary } from "@/services/sessionHistoryService";
import { format } from "date-fns";

interface EnhancedSessionCardProps {
  session: SessionSummary;
  onViewDetails: (session: SessionSummary) => void;
}

const EnhancedSessionCard = ({ session, onViewDetails }: EnhancedSessionCardProps) => {
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
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4" style={{
      borderLeftColor: session.effectiveness === 'high' ? '#10b981' : 
                      session.effectiveness === 'medium' ? '#f59e0b' : '#ef4444'
    }}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>{format(session.date, 'MMM dd, yyyy')}</span>
            <Badge variant="outline" className="text-xs">
              {format(session.date, 'EEEE')}
            </Badge>
          </CardTitle>
          <Badge 
            variant="outline"
            className={`${
              session.effectiveness === 'high' ? 'border-green-200 text-green-700 bg-green-50' :
              session.effectiveness === 'medium' ? 'border-yellow-200 text-yellow-700 bg-yellow-50' :
              'border-red-200 text-red-700 bg-red-50'
            }`}
          >
            {session.effectiveness} effectiveness
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="flex items-center justify-center">
              <Clock className="h-4 w-4 text-muted-foreground mr-1" />
              <span className="text-sm font-medium">{session.duration}min</span>
            </div>
            <p className="text-xs text-muted-foreground">Duration</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center">
              {getMoodTrendIcon()}
              {session.moodBefore && session.moodAfter && (
                <span className="text-sm font-medium ml-1">
                  {session.moodBefore}→{session.moodAfter}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Mood</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center">
              <Brain className="h-4 w-4 text-muted-foreground mr-1" />
              <span className="text-sm font-medium">{session.techniques.length}</span>
            </div>
            <p className="text-xs text-muted-foreground">Techniques</p>
          </div>
        </div>

        {/* Effectiveness Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Session Effectiveness</span>
            <div className="flex items-center space-x-1">
              {Array.from({ length: 5 }, (_, i) => (
                <Star 
                  key={i} 
                  className={`h-3 w-3 ${
                    i < Math.ceil(getEffectivenessValue() / 20) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`} 
                />
              ))}
            </div>
          </div>
          <Progress value={getEffectivenessValue()} className="h-2" />
        </div>

        {/* Techniques Preview */}
        <div className="space-y-2">
          <span className="text-sm font-medium">Techniques Used</span>
          <div className="flex flex-wrap gap-1">
            {session.techniques.slice(0, 2).map((technique, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {technique}
              </Badge>
            ))}
            {session.techniques.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{session.techniques.length - 2} more
              </Badge>
            )}
          </div>
        </div>

        {/* Key Insight Preview */}
        {session.keyInsights.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-1">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Key Insight</span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 bg-muted p-2 rounded">
              {session.keyInsights[0]}
              {session.keyInsights.length > 1 && '...'}
            </p>
          </div>
        )}

        {/* Mood Change Detail */}
        {session.moodChange !== null && (
          <div className="flex items-center justify-between p-2 bg-muted rounded">
            <span className="text-sm">Mood Change</span>
            <div className="flex items-center space-x-1">
              {getMoodTrendIcon()}
              <span className={`text-sm font-medium ${
                session.moodChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {session.moodChange > 0 ? '+' : ''}{session.moodChange} points
              </span>
            </div>
          </div>
        )}

        <Button 
          variant="outline" 
          className="w-full mt-4"
          onClick={() => onViewDetails(session)}
        >
          <Eye className="h-4 w-4 mr-2" />
          View Full Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default EnhancedSessionCard;
