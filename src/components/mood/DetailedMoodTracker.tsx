
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Heart, Brain, Zap, Shield, Moon, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface MoodTrackerProps {
  onMoodSubmit?: (data: any) => void;
}

const DetailedMoodTracker = ({ onMoodSubmit }: MoodTrackerProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [moodData, setMoodData] = useState({
    overall: [7],
    anxiety: [3],
    depression: [2],
    stress: [4],
    energy: [6],
    sleep_quality: [7],
    social_connection: [6],
    notes: '',
    activities: [] as string[],
    triggers: [] as string[]
  });

  const commonActivities = [
    'Exercise', 'Meditation', 'Reading', 'Socializing', 'Work', 'Hobbies',
    'Outdoor time', 'Music', 'Cooking', 'Gaming', 'Learning', 'Relaxing'
  ];

  const commonTriggers = [
    'Work stress', 'Relationship issues', 'Financial worry', 'Health concerns',
    'Social situations', 'Weather', 'Sleep issues', 'News/media', 'Family',
    'Technology', 'Travel', 'Deadlines'
  ];

  const moodCategories = [
    { key: 'overall', label: 'Overall Mood', icon: Heart, description: 'How do you feel in general?' },
    { key: 'anxiety', label: 'Anxiety Level', icon: Brain, description: 'How anxious or worried do you feel?' },
    { key: 'depression', label: 'Depression Level', icon: Brain, description: 'How sad or down do you feel?' },
    { key: 'stress', label: 'Stress Level', icon: Shield, description: 'How stressed or overwhelmed do you feel?' },
    { key: 'energy', label: 'Energy Level', icon: Zap, description: 'How energetic do you feel?' },
    { key: 'sleep_quality', label: 'Sleep Quality', icon: Moon, description: 'How well did you sleep last night?' },
    { key: 'social_connection', label: 'Social Connection', icon: Users, description: 'How connected to others do you feel?' }
  ];

  const saveMoodMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { error } = await supabase.from('mood_entries').insert({
        user_id: user.id,
        overall: data.overall[0],
        anxiety: data.anxiety[0],
        depression: data.depression[0],
        stress: data.stress[0],
        energy: data.energy[0],
        sleep_quality: data.sleep_quality[0],
        social_connection: data.social_connection[0],
        notes: data.notes,
        activities: data.activities,
        triggers: data.triggers
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['mood-entries'] });
      toast({
        title: "Mood Logged Successfully",
        description: "Your mood entry has been saved.",
      });
      
      // Reset form
      setMoodData({
        overall: [7],
        anxiety: [3],
        depression: [2],
        stress: [4],
        energy: [6],
        sleep_quality: [7],
        social_connection: [6],
        notes: '',
        activities: [],
        triggers: []
      });

      onMoodSubmit?.(data);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save mood entry",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = () => {
    saveMoodMutation.mutate(moodData);
  };

  const toggleActivity = (activity: string) => {
    setMoodData(prev => ({
      ...prev,
      activities: prev.activities.includes(activity)
        ? prev.activities.filter(a => a !== activity)
        : [...prev.activities, activity]
    }));
  };

  const toggleTrigger = (trigger: string) => {
    setMoodData(prev => ({
      ...prev,
      triggers: prev.triggers.includes(trigger)
        ? prev.triggers.filter(t => t !== trigger)
        : [...prev.triggers, trigger]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Mood Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {moodCategories.map((category) => {
          const IconComponent = category.icon;
          return (
            <Card key={category.key}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <IconComponent className="h-5 w-5 text-therapy-600" />
                    <h3 className="font-medium">{category.label}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>1 (Low)</span>
                      <span className="font-medium">{moodData[category.key as keyof typeof moodData][0]}/10</span>
                      <span>10 (High)</span>
                    </div>
                    <Slider
                      value={moodData[category.key as keyof typeof moodData] as number[]}
                      onValueChange={(value) => setMoodData(prev => ({ ...prev, [category.key]: value }))}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Activities Today</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {commonActivities.map(activity => (
              <Badge
                key={activity}
                variant={moodData.activities.includes(activity) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleActivity(activity)}
              >
                {activity}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Triggers */}
      <Card>
        <CardHeader>
          <CardTitle>Triggers or Stressors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {commonTriggers.map(trigger => (
              <Badge
                key={trigger}
                variant={moodData.triggers.includes(trigger) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleTrigger(trigger)}
              >
                {trigger}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={moodData.notes}
            onChange={(e) => setMoodData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="How are you feeling today? Any specific thoughts or events?"
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit} 
          disabled={saveMoodMutation.isPending}
          className="bg-therapy-600 hover:bg-therapy-700"
        >
          {saveMoodMutation.isPending ? 'Saving...' : 'Save Mood Entry'}
        </Button>
      </div>
    </div>
  );
};

export default DetailedMoodTracker;
