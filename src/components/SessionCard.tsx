
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MessageCircle, TrendingUp } from "lucide-react";
import { format } from "date-fns";

interface SessionCardProps {
  session: {
    id: string;
    startTime: Date;
    endTime?: Date;
    messageCount: number;
    mood: {
      before?: number;
      after?: number;
    };
    techniques: string[];
    notes?: string;
  };
}

const SessionCard = ({ session }: SessionCardProps) => {
  const duration = session.endTime 
    ? Math.round((session.endTime.getTime() - session.startTime.getTime()) / (1000 * 60))
    : null;

  const moodImprovement = session.mood.before && session.mood.after 
    ? session.mood.after - session.mood.before 
    : null;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">
            Therapy Session
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {session.endTime ? 'Completed' : 'In Progress'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Horizontal layout for session info */}
        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            {format(session.startTime, 'MMM d, yyyy')}
          </div>
          
          {duration && (
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              {duration} minutes
            </div>
          )}
          
          <div className="flex items-center">
            <MessageCircle className="h-4 w-4 mr-2" />
            {session.messageCount} messages
          </div>

          {moodImprovement !== null && (
            <div className="flex items-center text-sm">
              <TrendingUp className="h-4 w-4 mr-2" />
              <span className={moodImprovement >= 0 ? 'text-green-600' : 'text-red-600'}>
                Mood {moodImprovement >= 0 ? 'improved' : 'declined'} by {Math.abs(moodImprovement)}
              </span>
            </div>
          )}
        </div>

        {session.techniques.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-1">Techniques used:</p>
            <div className="flex flex-wrap gap-1">
              {session.techniques.slice(0, 4).map((technique, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {technique}
                </Badge>
              ))}
              {session.techniques.length > 4 && (
                <Badge variant="secondary" className="text-xs">
                  +{session.techniques.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {session.notes && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {session.notes}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default SessionCard;
