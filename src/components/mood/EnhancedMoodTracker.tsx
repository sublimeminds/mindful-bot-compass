import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { realAnalyticsService, MoodPattern } from '@/services/realAnalyticsService';
import { 
  Heart, 
  Zap, 
  Brain, 
  Smile, 
  TrendingUp, 
  TrendingDown,
  Minus,
  Lightbulb,
  AlertTriangle
} from 'lucide-react';

const EnhancedMoodTracker = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [moodData, setMoodData] = useState({
    overall: [5],
    anxiety: [3],
    depression: [3],
    stress: [3],
    energy: [5],
    social_connection: [5]
  });
  
  const [notes, setNotes] = useState('');
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [moodPatterns, setMoodPatterns] = useState<MoodPattern[]>([]);
  const [showInsights, setShowInsights] = useState(false);

  const triggerOptions = [
    'Work stress', 'Relationship issues', 'Financial concerns', 'Health issues',
    'Sleep problems', 'Social situations', 'Weather', 'Family issues',
    'Academic pressure', 'Technology/social media', 'Isolation', 'Other'
  ];

  const activityOptions = [
    'Exercise', 'Meditation', 'Reading', 'Socializing', 'Work',
    'Hobbies', 'Rest/Sleep', 'Nature/Outdoors', 'Music', 'Therapy',
    'Self-care', 'Creative activities', 'Learning', 'Helping others'
  ];

  useEffect(() => {
    if (user) {
      loadMoodPatterns();
    }
  }, [user]);

  const loadMoodPatterns = async () => {
    if (!user) return;
    
    try {
      const patterns = await realAnalyticsService.analyzeMoodPatterns(user.id, 30);
      setMoodPatterns(patterns);
    } catch (error) {
      console.error('Error loading mood patterns:', error);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('mood_entries').insert({
        user_id: user.id,
        overall: moodData.overall[0],
        anxiety: moodData.anxiety[0],
        depression: moodData.depression[0],
        stress: moodData.stress[0],
        energy: moodData.energy[0],
        social_connection: moodData.social_connection[0],
        notes: notes || null,
        triggers: selectedTriggers.length > 0 ? selectedTriggers : null,
        activities: selectedActivities.length > 0 ? selectedActivities : null
      });

      if (error) throw error;

      toast({
        title: "Mood Entry Saved",
        description: "Your mood has been tracked successfully."
      });

      // Reset form
      setNotes('');
      setSelectedTriggers([]);
      setSelectedActivities([]);
      
      // Reload patterns to show updated insights
      loadMoodPatterns();

    } catch (error) {
      console.error('Error saving mood entry:', error);
      toast({
        title: "Error",
        description: "Failed to save mood entry. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMoodIcon = (score: number) => {
    if (score >= 8) return <Smile className="h-5 w-5 text-green-500" />;
    if (score >= 6) return <Heart className="h-5 w-5 text-blue-500" />;
    if (score >= 4) return <Minus className="h-5 w-5 text-yellow-500" />;
    return <Brain className="h-5 w-5 text-red-500" />;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getMoodLabel = (score: number): string => {
    if (score >= 9) return 'Excellent';
    if (score >= 7) return 'Good';
    if (score >= 5) return 'Okay';
    if (score >= 3) return 'Poor';
    return 'Very Poor';
  };

  const toggleSelection = (item: string, list: string[], setter: (list: string[]) => void) => {
    if (list.includes(item)) {
      setter(list.filter(i => i !== item));
    } else {
      setter([...list, item]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Mood Tracking Card */}
      <Card className="border-therapy-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-therapy-600" />
            <span>How are you feeling today?</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mood Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(moodData).map(([key, value]) => (
              <div key={key} className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium capitalize flex items-center space-x-2">
                    {getMoodIcon(value[0])}
                    <span>{key.replace('_', ' ')}</span>
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{value[0]}/10</span>
                    <Badge variant="outline" className="text-xs">
                      {getMoodLabel(value[0])}
                    </Badge>
                  </div>
                </div>
                <Slider
                  value={value}
                  onValueChange={(newValue) => 
                    setMoodData(prev => ({ ...prev, [key]: newValue }))
                  }
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>
            ))}
          </div>

          {/* Triggers Section */}
          <div className="space-y-3">
            <label className="text-sm font-medium">What might have influenced your mood?</label>
            <div className="flex flex-wrap gap-2">
              {triggerOptions.map(trigger => (
                <Badge
                  key={trigger}
                  variant={selectedTriggers.includes(trigger) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-therapy-100"
                  onClick={() => toggleSelection(trigger, selectedTriggers, setSelectedTriggers)}
                >
                  {trigger}
                </Badge>
              ))}
            </div>
          </div>

          {/* Activities Section */}
          <div className="space-y-3">
            <label className="text-sm font-medium">What activities did you do today?</label>
            <div className="flex flex-wrap gap-2">
              {activityOptions.map(activity => (
                <Badge
                  key={activity}
                  variant={selectedActivities.includes(activity) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-therapy-100"
                  onClick={() => toggleSelection(activity, selectedActivities, setSelectedActivities)}
                >
                  {activity}
                </Badge>
              ))}
            </div>
          </div>

          {/* Notes Section */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Additional notes (optional)</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How was your day? Any specific thoughts or feelings you'd like to remember?"
              className="min-h-[100px]"
            />
          </div>

          {/* Submit Button */}
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="w-full bg-therapy-600 hover:bg-therapy-700"
          >
            {isSubmitting ? 'Saving...' : 'Save Mood Entry'}
          </Button>
        </CardContent>
      </Card>

      {/* Insights and Patterns */}
      {moodPatterns.length > 0 && (
        <Card className="border-therapy-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="h-6 w-6 text-therapy-600" />
                <span>Your Mood Insights</span>
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowInsights(!showInsights)}
              >
                {showInsights ? 'Hide' : 'Show'} Details
              </Button>
            </div>
          </CardHeader>
          {showInsights && (
            <CardContent className="space-y-4">
              {moodPatterns.map((pattern, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium capitalize flex items-center space-x-2">
                      {getTrendIcon(pattern.trend)}
                      <span>{pattern.pattern_type.replace('_', ' ')}</span>
                    </h4>
                    <Badge variant={pattern.trend === 'improving' ? 'default' : pattern.trend === 'declining' ? 'destructive' : 'secondary'}>
                      {pattern.trend}
                    </Badge>
                  </div>
                  
                  {pattern.triggers.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Common triggers:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {pattern.triggers.map(trigger => (
                          <Badge key={trigger} variant="outline" className="text-xs">
                            {trigger}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {pattern.recommendations.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Recommendations:</p>
                      <ul className="text-sm text-gray-600 mt-1 space-y-1">
                        {pattern.recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <span className="text-therapy-600">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
};

export default EnhancedMoodTracker;
