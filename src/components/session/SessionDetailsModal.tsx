
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, TrendingUp, Brain, Target, FileText } from "lucide-react";
import { SessionSummary } from "@/services/sessionHistoryService";
import { format } from "date-fns";

interface SessionDetailsModalProps {
  session: SessionSummary | null;
  isOpen: boolean;
  onClose: () => void;
}

const SessionDetailsModal = ({ session, isOpen, onClose }: SessionDetailsModalProps) => {
  if (!session) return null;

  const getEffectivenessValue = () => {
    switch (session.effectiveness) {
      case 'high': return 85;
      case 'medium': return 60;
      case 'low': return 30;
      default: return 0;
    }
  };

  const getEffectivenessColor = () => {
    switch (session.effectiveness) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Session Details - {format(session.date, 'MMMM dd, yyyy')}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Session Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Session Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Duration: {session.duration} minutes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className={getEffectivenessColor()}>
                    {session.effectiveness.charAt(0).toUpperCase() + session.effectiveness.slice(1)} Effectiveness
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Effectiveness Score</span>
                  <span className="text-sm text-muted-foreground">{getEffectivenessValue()}%</span>
                </div>
                <Progress value={getEffectivenessValue()} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Mood Tracking */}
          {session.moodBefore && session.moodAfter && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Mood Tracking</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-muted-foreground">{session.moodBefore}</div>
                    <div className="text-sm text-muted-foreground">Before</div>
                  </div>
                  <div className="flex-1 px-4">
                    <div className="relative">
                      <Progress value={(session.moodAfter / 10) * 100} className="h-3" />
                      <div className="absolute top-0 left-0 h-3 bg-muted rounded-full" 
                           style={{ width: `${(session.moodBefore / 10) * 100}%` }}>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{session.moodAfter}</div>
                    <div className="text-sm text-muted-foreground">After</div>
                  </div>
                </div>
                {session.moodChange !== undefined && (
                  <div className="text-center mt-3">
                    <Badge 
                      variant={session.moodChange >= 0 ? "default" : "destructive"}
                      className="text-sm"
                    >
                      {session.moodChange > 0 ? '+' : ''}{session.moodChange} point improvement
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Techniques Used */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>Techniques Practiced</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {session.techniques.map((technique, index) => (
                  <Badge key={index} variant="secondary">
                    {technique}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Key Insights */}
          {session.keyInsights.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {session.keyInsights.map((insight, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <span className="text-sm">{insight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Session Notes */}
          {session.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Session Notes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {session.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SessionDetailsModal;
