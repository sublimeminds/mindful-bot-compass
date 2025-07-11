import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, TrendingUp, Star, Clock } from 'lucide-react';
import { useUserSessionsNew } from '@/hooks/useUserSessionsNew';
import { useToast } from '@/hooks/use-toast';

interface SessionCompletionProps {
  sessionId: string;
  startMood: number;
  onComplete?: () => void;
}

const SessionCompletion: React.FC<SessionCompletionProps> = ({
  sessionId,
  startMood,
  onComplete
}) => {
  const [moodAfter, setMoodAfter] = useState<number>(startMood);
  const [sessionFeedback, setSessionFeedback] = useState<string>('');
  const [sessionRating, setSessionRating] = useState<number>(4);
  const [isCompleting, setIsCompleting] = useState(false);
  const { updateSession } = useUserSessionsNew();
  const { toast } = useToast();

  const handleCompleteSession = async () => {
    if (isCompleting) return;

    setIsCompleting(true);
    try {
      const success = await updateSession(sessionId, {
        endTime: new Date().toISOString(),
        moodAfter,
        notes: sessionFeedback,
      });

      if (success) {
        toast({
          title: "Session Complete!",
          description: "Thank you for your feedback. Your progress has been saved.",
        });

        onComplete?.();
      } else {
        throw new Error('Failed to complete session');
      }
    } catch (error) {
      console.error('Error completing session:', error);
      toast({
        title: "Completion Error",
        description: "There was an error saving your session. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCompleting(false);
    }
  };

  const getMoodChange = () => {
    const change = moodAfter - startMood;
    if (change > 0) return { text: `+${change} improvement!`, color: 'text-green-600', icon: TrendingUp };
    if (change < 0) return { text: `${change} decrease`, color: 'text-red-600', icon: TrendingUp };
    return { text: 'No change', color: 'text-gray-600', icon: TrendingUp };
  };

  const moodChange = getMoodChange();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
          Complete Your Session
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Mood Comparison */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border">
          <h4 className="font-medium mb-3">How do you feel now?</h4>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{startMood}/10</div>
              <div className="text-sm text-muted-foreground">Before Session</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{moodAfter}/10</div>
              <div className="text-sm text-muted-foreground">After Session</div>
            </div>
          </div>

          <div className="text-center">
            <Badge variant="outline" className={moodChange.color}>
              <moodChange.icon className="h-3 w-3 mr-1" />
              {moodChange.text}
            </Badge>
          </div>
        </div>

        {/* Current Mood Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Current Mood Level</label>
            <span className="text-sm font-medium">{moodAfter}/10</span>
          </div>
          <Slider
            value={[moodAfter]}
            onValueChange={(values) => setMoodAfter(values[0])}
            max={10}
            min={1}
            step={1}
            className="w-full"
          />
        </div>

        {/* Session Rating */}
        <div className="space-y-3">
          <label className="text-sm font-medium">How would you rate this session?</label>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setSessionRating(star)}
                className={`p-1 rounded transition-colors ${
                  star <= sessionRating 
                    ? 'text-yellow-500' 
                    : 'text-gray-300 hover:text-yellow-400'
                }`}
              >
                <Star 
                  className="h-6 w-6" 
                  fill={star <= sessionRating ? 'currentColor' : 'none'}
                />
              </button>
            ))}
            <span className="text-sm text-muted-foreground ml-2">
              ({sessionRating}/5 stars)
            </span>
          </div>
        </div>

        {/* Session Feedback */}
        <div className="space-y-3">
          <label htmlFor="session-feedback" className="text-sm font-medium">
            How was this session? (Optional)
          </label>
          <Textarea
            id="session-feedback"
            placeholder="Share your thoughts about this session, what was helpful, what you learned..."
            value={sessionFeedback}
            onChange={(e) => setSessionFeedback(e.target.value)}
            rows={3}
          />
        </div>

        {/* Session Summary */}
        <div className="bg-therapy-50 p-4 rounded-lg border border-therapy-200">
          <h4 className="font-medium text-therapy-900 mb-2 flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Session Summary
          </h4>
          <ul className="text-sm text-therapy-700 space-y-1">
            <li>• Session completed successfully</li>
            <li>• Your progress has been tracked</li>
            <li>• Insights will be generated from this session</li>
            <li>• Continue your journey with regular sessions</li>
          </ul>
        </div>

        {/* Complete Button */}
        <Button 
          onClick={handleCompleteSession}
          disabled={isCompleting}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
          size="lg"
        >
          {isCompleting ? (
            'Saving Session...'
          ) : (
            <>
              <CheckCircle className="h-5 w-5 mr-2" />
              Complete Session
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SessionCompletion;