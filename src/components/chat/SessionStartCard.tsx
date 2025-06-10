
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Brain, 
  Clock, 
  Target, 
  Heart,
  Play
} from "lucide-react";
import { useTherapist } from "@/contexts/TherapistContext";

interface SessionStartCardProps {
  onStartSession: () => void;
  isLoading?: boolean;
}

const SessionStartCard = ({ onStartSession, isLoading }: SessionStartCardProps) => {
  const { currentTherapist } = useTherapist();

  if (!currentTherapist) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Therapist Selected</h3>
          <p className="text-muted-foreground">
            Please select an AI therapist to begin your session.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={`/therapist-${currentTherapist.id}.jpg`} />
            <AvatarFallback className="bg-therapy-100 text-therapy-700 text-xl">
              {currentTherapist.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="text-xl">{currentTherapist.name}</CardTitle>
        <p className="text-muted-foreground">{currentTherapist.title}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p>{currentTherapist.description}</p>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Brain className="h-4 w-4 text-therapy-500" />
            <span className="text-sm font-medium">Approach:</span>
            <span className="text-sm text-muted-foreground">{currentTherapist.approach}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-therapy-500" />
            <span className="text-sm font-medium">Specialties:</span>
          </div>
          <div className="flex flex-wrap gap-1 ml-6">
            {currentTherapist.specialties.map((specialty) => (
              <Badge key={specialty} variant="secondary" className="text-xs">
                {specialty}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <Heart className="h-4 w-4 text-therapy-500" />
            <span className="text-sm font-medium">Communication Style:</span>
            <span className="text-sm text-muted-foreground capitalize">
              {currentTherapist.communication_style}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-therapy-500" />
            <span className="text-sm text-muted-foreground">
              Estimated session: 30-45 minutes
            </span>
          </div>
        </div>
        
        <Button 
          onClick={onStartSession}
          disabled={isLoading}
          className="w-full mt-6 bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700 text-white"
          size="lg"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Starting Session...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Play className="h-4 w-4" />
              <span>Begin Therapy Session</span>
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SessionStartCard;
