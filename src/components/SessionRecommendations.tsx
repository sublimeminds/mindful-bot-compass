
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Brain, Play, Lightbulb } from "lucide-react";
import { SessionRecommendationService } from "@/services/sessionRecommendationService";
import { useSession } from "@/contexts/SessionContext";
import { useOnboardingData } from "@/hooks/useOnboardingData";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const SessionRecommendations = () => {
  const { user } = useAuth();
  const { sessions, startSession } = useSession();
  const { onboardingData } = useOnboardingData();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user && sessions) {
      const personalizedRecs = SessionRecommendationService.getPersonalizedRecommendations(
        sessions,
        onboardingData,
        7 // Default mood for now
      );
      setRecommendations(personalizedRecs);
    }
  }, [user, sessions, onboardingData]);

  const handleStartSession = async (recommendation: any) => {
    try {
      await startSession();
      // Store the recommendation for the AI to use
      sessionStorage.setItem('sessionRecommendation', JSON.stringify(recommendation));
      navigate('/chat');
      toast({
        title: "Session Started",
        description: `Starting your ${recommendation.title} session. The AI will guide you through this focused session.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="h-5 w-5 mr-2" />
          Recommended Sessions
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Personalized therapy sessions based on your goals and recent progress
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec) => (
          <div key={rec.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h4 className="font-medium">{rec.title}</h4>
                <p className="text-sm text-muted-foreground">{rec.description}</p>
              </div>
              <Badge className={getDifficultyColor(rec.difficulty)}>
                {rec.difficulty}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {rec.estimatedDuration} min
              </div>
              <div className="flex items-center">
                <Lightbulb className="h-4 w-4 mr-1" />
                {rec.techniques.length} techniques
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {rec.techniques.slice(0, 3).map((technique: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {technique}
                </Badge>
              ))}
              {rec.techniques.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{rec.techniques.length - 3} more
                </Badge>
              )}
            </div>

            <Button 
              onClick={() => handleStartSession(rec)}
              className="w-full mt-3"
              size="sm"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Session
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SessionRecommendations;
