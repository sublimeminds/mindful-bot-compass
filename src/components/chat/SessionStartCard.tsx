
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, MessageCircle, User } from 'lucide-react';
import { useTherapist } from '@/contexts/TherapistContext';

interface SessionStartCardProps {
  onStartSession: () => void;
}

const SessionStartCard: React.FC<SessionStartCardProps> = ({ onStartSession }) => {
  const { selectedTherapist } = useTherapist();

  if (!selectedTherapist) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Therapist Selected</h3>
          <p className="text-muted-foreground mb-4">
            Please select a therapist to start your therapy session.
          </p>
          <Button variant="outline">
            Choose Therapist
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="h-5 w-5 mr-2 text-therapy-600" />
          Ready to Start Session
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Therapist Info */}
        <div className="flex items-center space-x-3 p-4 bg-therapy-50 rounded-lg">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${selectedTherapist.colorScheme} flex items-center justify-center text-white`}>
            <Brain className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{selectedTherapist.name}</h3>
            <p className="text-sm text-muted-foreground">{selectedTherapist.title}</p>
          </div>
        </div>

        {/* Approach and Style */}
        <div className="space-y-2">
          <div>
            <span className="text-sm font-medium">Approach: </span>
            <Badge variant="outline" className="text-xs">
              {selectedTherapist.approach}
            </Badge>
          </div>
          <div>
            <span className="text-sm font-medium">Style: </span>
            <span className="text-sm text-muted-foreground">
              {selectedTherapist.communicationStyle}
            </span>
          </div>
        </div>

        {/* Session Description */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Your therapist is ready to help you with your mental health journey. 
            This is a safe space to share your thoughts and feelings.
          </p>
        </div>

        {/* Start Session Button */}
        <Button 
          onClick={onStartSession}
          className="w-full bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600"
          size="lg"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Start Session with {selectedTherapist.name.split(' ')[1]}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SessionStartCard;
