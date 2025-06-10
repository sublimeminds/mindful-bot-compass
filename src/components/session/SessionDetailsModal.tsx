
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  MessageCircle,
  Brain,
  Target,
  Lightbulb,
  Star,
  BarChart3
} from "lucide-react";
import { SessionService, DetailedSession } from "@/services/sessionService";
import { format } from "date-fns";

interface SessionDetailsModalProps {
  session: any | null;
  isOpen: boolean;
  onClose: () => void;
}

const SessionDetailsModal = ({ session, isOpen, onClose }: SessionDetailsModalProps) => {
  const [detailedSession, setDetailedSession] = useState<DetailedSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!session?.id) return;
      
      setIsLoading(true);
      try {
        const details = await SessionService.getSessionDetails(session.id);
        setDetailedSession(details);
      } catch (error) {
        console.error('Error fetching session details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && session) {
      fetchDetails();
    }
  }, [session, isOpen]);

  if (!session) return null;

  const getMoodTrendIcon = () => {
    const moodChange = session.mood_after && session.mood_before 
      ? session.mood_after - session.mood_before 
      : 0;
    
    if (moodChange > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (moodChange < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getEffectivenessValue = () => {
    if (!session.mood_before || !session.mood_after) return 50;
    const improvement = session.mood_after - session.mood_before;
    return Math.max(0, Math.min(100, 50 + (improvement * 10)));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const duration = session.end_time && session.start_time
    ? Math.round((new Date(session.end_time).getTime() - new Date(session.start_time).getTime()) / (1000 * 60))
    : 0;

  const moodChange = session.mood_before && session.mood_after 
    ? session.mood_after - session.mood_before 
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Session Details - {format(new Date(session.start_time), 'MMMM dd, yyyy')}</span>
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="text-center py-8">Loading session details...</div>
        ) : (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="conversation">Conversation</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Session Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Duration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{duration} min</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center">
                      {getMoodTrendIcon()}
                      <span className="ml-2">Mood Change</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {session.mood_before && session.mood_after ? (
                      <div className="space-y-1">
                        <div className="text-2xl font-bold">
                          {session.mood_before} → {session.mood_after}
                        </div>
                        <div className={`text-sm ${moodChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {moodChange > 0 ? '+' : ''}{moodChange} points
                        </div>
                      </div>
                    ) : (
                      <div className="text-muted-foreground">Not recorded</div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Effectiveness
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold">{getEffectivenessValue()}%</div>
                      <Progress value={getEffectivenessValue()} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Techniques Used */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-5 w-5 mr-2" />
                    Techniques Used ({(session.techniques || []).length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {(session.techniques || []).map((technique: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {technique}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Key Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2" />
                    Key Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {(session.insights || []).map((insight: string, index: number) => (
                      <div key={index} className="p-3 bg-muted rounded-lg">
                        <p className="text-sm">{insight}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Session Notes */}
              {session.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Session Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {session.notes}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="conversation" className="space-y-4">
              {detailedSession?.messages && detailedSession.messages.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Conversation ({detailedSession.messages.length} messages)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-96 overflow-y-auto">
                    <div className="space-y-4">
                      {detailedSession.messages.map((message) => (
                        <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] p-3 rounded-lg ${
                            message.sender === 'user' 
                              ? 'bg-therapy-500 text-white' 
                              : 'bg-muted'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                            <div className="text-xs opacity-70 mt-1">
                              {format(message.timestamp, 'HH:mm')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No conversation data available</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              {detailedSession?.detailedInsights && detailedSession.detailedInsights.length > 0 ? (
                <div className="space-y-4">
                  {detailedSession.detailedInsights.map((insight) => (
                    <Card key={insight.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{insight.title}</CardTitle>
                          <div className="flex items-center space-x-2">
                            <Badge className={getPriorityColor(insight.priority)}>
                              {insight.priority}
                            </Badge>
                            <Badge variant="outline">
                              {insight.insightType}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          {insight.description}
                        </p>
                        {insight.actionableSuggestion && (
                          <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                            <p className="text-sm">
                              <strong>Suggestion:</strong> {insight.actionableSuggestion}
                            </p>
                          </div>
                        )}
                        {insight.confidenceScore && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            Confidence: {Math.round(insight.confidenceScore * 100)}%
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No insights generated for this session</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              {detailedSession?.analytics ? (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BarChart3 className="h-5 w-5 mr-2" />
                        Session Analytics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Effectiveness Score</label>
                          <div className="flex items-center space-x-2 mt-1">
                            <Progress value={detailedSession.analytics.effectivenessScore} className="flex-1" />
                            <span className="text-sm font-medium">{detailedSession.analytics.effectivenessScore}%</span>
                          </div>
                        </div>
                        
                        {detailedSession.analytics.sessionRating && (
                          <div>
                            <label className="text-sm font-medium">Session Rating</label>
                            <div className="flex items-center space-x-1 mt-1">
                              {Array.from({ length: 5 }, (_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${
                                    i < detailedSession.analytics!.sessionRating! 
                                      ? 'text-yellow-400 fill-current' 
                                      : 'text-gray-300'
                                  }`} 
                                />
                              ))}
                              <span className="text-sm ml-2">{detailedSession.analytics.sessionRating}/5</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {detailedSession.analytics.keyBreakthrough && (
                        <div>
                          <label className="text-sm font-medium">Key Breakthrough</label>
                          <div className="mt-1 p-3 bg-green-50 border-l-4 border-green-400 rounded">
                            <p className="text-sm">{detailedSession.analytics.keyBreakthrough}</p>
                          </div>
                        </div>
                      )}

                      {Object.keys(detailedSession.analytics.techniquesEffectiveness).length > 0 && (
                        <div>
                          <label className="text-sm font-medium">Technique Effectiveness</label>
                          <div className="mt-2 space-y-2">
                            {Object.entries(detailedSession.analytics.techniquesEffectiveness).map(([technique, score]) => (
                              <div key={technique} className="flex items-center justify-between">
                                <span className="text-sm">{technique}</span>
                                <div className="flex items-center space-x-2">
                                  <Progress value={score * 100} className="w-20" />
                                  <span className="text-sm w-10 text-right">{Math.round(score * 100)}%</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No analytics data available for this session</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SessionDetailsModal;
