
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, ThumbsUp, ThumbsDown, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SessionRatingProps {
  sessionId: string;
  onSubmit?: (rating: number, feedback: string) => void;
}

const SessionRating = ({ sessionId, onSubmit }: SessionRatingProps) => {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please provide a rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    onSubmit?.(rating, feedback);
    setSubmitted(true);
    toast({
      title: "Thank You!",
      description: "Your session feedback has been recorded.",
    });
  };

  if (submitted) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Heart className="h-12 w-12 text-therapy-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Thank You for Your Feedback!</h3>
          <p className="text-muted-foreground">
            Your input helps us improve your therapy experience.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Star className="h-5 w-5 mr-2 text-therapy-600" />
          Rate Your Session
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Star Rating */}
        <div>
          <p className="text-sm font-medium mb-2">How was your session today?</p>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`p-1 transition-colors ${
                  star <= rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'
                }`}
              >
                <Star className="h-6 w-6 fill-current" />
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {rating === 0 && "Click to rate"}
            {rating === 1 && "Poor"}
            {rating === 2 && "Fair"}
            {rating === 3 && "Good"}
            {rating === 4 && "Very Good"}
            {rating === 5 && "Excellent"}
          </p>
        </div>

        {/* Quick Feedback Buttons */}
        <div>
          <p className="text-sm font-medium mb-2">Quick feedback:</p>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFeedback(prev => prev + "Helpful insights. ")}
            >
              <ThumbsUp className="h-3 w-3 mr-1" />
              Helpful
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFeedback(prev => prev + "Could be improved. ")}
            >
              <ThumbsDown className="h-3 w-3 mr-1" />
              Needs Work
            </Button>
          </div>
        </div>

        {/* Detailed Feedback */}
        <div>
          <p className="text-sm font-medium mb-2">Additional comments (optional):</p>
          <Textarea
            placeholder="Share any specific thoughts about your session..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={3}
          />
        </div>

        <Button onClick={handleSubmit} className="w-full">
          Submit Feedback
        </Button>
      </CardContent>
    </Card>
  );
};

export default SessionRating;
