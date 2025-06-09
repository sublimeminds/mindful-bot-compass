
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Plus, TrendingUp, Calendar, BarChart3, Brain, BookOpen } from "lucide-react";
import { useSession } from "@/contexts/SessionContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const QuickActions = () => {
  const { startSession, currentSession } = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleStartSession = async () => {
    try {
      await startSession();
      navigate('/chat');
      toast({
        title: "Session Started",
        description: "Your therapy session has begun. Share what's on your mind.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleContinueSession = () => {
    navigate('/chat');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {currentSession ? (
          <Button 
            onClick={handleContinueSession}
            className="w-full bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Continue Current Session
          </Button>
        ) : (
          <Button 
            onClick={handleStartSession}
            className="w-full bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Start New Session
          </Button>
        )}
        
        <Button variant="outline" className="w-full" onClick={() => navigate('/techniques')}>
          <BookOpen className="h-4 w-4 mr-2" />
          Practice Techniques
        </Button>
        
        <Button variant="outline" className="w-full" onClick={() => navigate('/mood')}>
          <Brain className="h-4 w-4 mr-2" />
          Track Mood
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border-blue-200" 
          onClick={() => navigate('/analytics')}
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          View Progress Analytics
        </Button>
        
        <Button variant="outline" className="w-full" onClick={() => navigate('/onboarding')}>
          <TrendingUp className="h-4 w-4 mr-2" />
          Update Goals & Preferences
        </Button>
        
        <Button variant="outline" className="w-full" disabled>
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Session (Coming Soon)
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
