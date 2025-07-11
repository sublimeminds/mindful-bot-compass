import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Heart, Clock, MessageSquare } from 'lucide-react';
import { useUserSessionsNew } from '@/hooks/useUserSessionsNew';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface SessionCreatorProps {
  therapistId?: string;
  therapistName?: string;
  onSessionCreated?: (sessionId: string) => void;
}

const SessionCreator: React.FC<SessionCreatorProps> = ({
  therapistId,
  therapistName,
  onSessionCreated
}) => {
  const [moodBefore, setMoodBefore] = useState<number>(5);
  const [sessionGoals, setSessionGoals] = useState<string>('');
  const [isCreating, setIsCreating] = useState(false);
  const { createSession } = useUserSessionsNew();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCreateSession = async () => {
    if (isCreating) return;

    setIsCreating(true);
    try {
      const sessionData = {
        sessionType: 'therapy',
        startTime: new Date().toISOString(),
        moodBefore,
        notes: sessionGoals,
        therapistId: therapistId || 'default-ai-therapist',
      };

      const newSession = await createSession(sessionData);
      
      if (newSession) {
        toast({
          title: "Session Started!",
          description: "Your therapy session has begun. Let's work together on your goals.",
        });

        // Navigate to therapy chat with session context
        navigate('/therapy', { 
          state: { 
            sessionId: newSession.id,
            therapistId,
            therapistName,
            moodBefore,
            sessionGoals 
          } 
        });

        onSessionCreated?.(newSession.id);
      } else {
        throw new Error('Failed to create session');
      }
    } catch (error) {
      console.error('Error creating session:', error);
      toast({
        title: "Session Creation Failed",
        description: "There was an error starting your session. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const getMoodLabel = (value: number) => {
    if (value <= 3) return 'Low';
    if (value <= 6) return 'Moderate';
    if (value <= 8) return 'Good';
    return 'Excellent';
  };

  const getMoodColor = (value: number) => {
    if (value <= 3) return 'text-red-600';
    if (value <= 6) return 'text-yellow-600';
    if (value <= 8) return 'text-blue-600';
    return 'text-green-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-therapy-600" />
          Start New Therapy Session
        </CardTitle>
        {therapistName && (
          <p className="text-sm text-muted-foreground">
            with {therapistName}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Mood Assessment */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">How are you feeling right now?</label>
            <Badge variant="outline" className={getMoodColor(moodBefore)}>
              {moodBefore}/10 - {getMoodLabel(moodBefore)}
            </Badge>
          </div>
          
          <div className="space-y-3">
            <Slider
              value={[moodBefore]}
              onValueChange={(values) => setMoodBefore(values[0])}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Very Low</span>
              <span>Moderate</span>
              <span>Excellent</span>
            </div>
          </div>
        </div>

        {/* Session Goals */}
        <div className="space-y-3">
          <label htmlFor="session-goals" className="text-sm font-medium">
            What would you like to focus on in this session? (Optional)
          </label>
          <Textarea
            id="session-goals"
            placeholder="e.g., Discuss anxiety about work, practice breathing techniques, work on communication skills..."
            value={sessionGoals}
            onChange={(e) => setSessionGoals(e.target.value)}
            rows={3}
          />
        </div>

        {/* Session Info */}
        <div className="bg-therapy-50 p-4 rounded-lg border border-therapy-200">
          <h4 className="font-medium text-therapy-900 mb-2 flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Session Information
          </h4>
          <ul className="text-sm text-therapy-700 space-y-1">
            <li>• Estimated duration: 15-45 minutes</li>
            <li>• You can end the session at any time</li>
            <li>• Your conversation will be kept confidential</li>
            <li>• Progress will be automatically tracked</li>
          </ul>
        </div>

        {/* Start Session Button */}
        <Button 
          onClick={handleCreateSession}
          disabled={isCreating}
          className="w-full bg-therapy-600 hover:bg-therapy-700 text-white py-3 text-lg"
          size="lg"
        >
          {isCreating ? (
            'Starting Session...'
          ) : (
            <>
              <Heart className="h-5 w-5 mr-2" />
              Begin Therapy Session
              <ArrowRight className="h-5 w-5 ml-2" />
            </>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          By starting this session, you acknowledge that this is an AI-powered therapy assistant 
          and not a replacement for professional medical advice.
        </p>
      </CardContent>
    </Card>
  );
};

export default SessionCreator;