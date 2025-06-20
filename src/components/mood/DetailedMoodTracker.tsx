import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const DetailedMoodTracker = ({ onMoodSubmit }: { onMoodSubmit: () => void }) => {
  const { user } = useSimpleApp();
  const { toast } = useToast();
  const [overall, setOverall] = useState(5);
  const [anxiety, setAnxiety] = useState(5);
  const [stress, setStress] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [activities, setActivities] = useState('');

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please sign in to track your mood.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('mood_entries')
        .insert({
          user_id: user.id,
          overall,
          anxiety,
          stress,
          energy,
          activities,
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Mood Logged",
        description: "Your mood has been recorded successfully!",
      });
      onMoodSubmit();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to log mood. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>How are you feeling today?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="overall">Overall Mood</Label>
          <Slider
            id="overall"
            defaultValue={[overall]}
            max={10}
            min={1}
            step={1}
            onValueChange={(value) => setOverall(value[0])}
          />
          <p className="text-sm text-muted-foreground">
            {overall}/10
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="anxiety">Anxiety Level</Label>
          <Slider
            id="anxiety"
            defaultValue={[anxiety]}
            max={10}
            min={1}
            step={1}
            onValueChange={(value) => setAnxiety(value[0])}
          />
          <p className="text-sm text-muted-foreground">
            {anxiety}/10
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="stress">Stress Level</Label>
          <Slider
            id="stress"
            defaultValue={[stress]}
            max={10}
            min={1}
            step={1}
            onValueChange={(value) => setStress(value[0])}
          />
          <p className="text-sm text-muted-foreground">
            {stress}/10
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="energy">Energy Level</Label>
          <Slider
            id="energy"
            defaultValue={[energy]}
            max={10}
            min={1}
            step={1}
            onValueChange={(value) => setEnergy(value[0])}
          />
          <p className="text-sm text-muted-foreground">
            {energy}/10
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="activities">Activities</Label>
          <Textarea
            id="activities"
            placeholder="What activities did you do today?"
            value={activities}
            onChange={(e) => setActivities(e.target.value)}
          />
        </div>

        <Button onClick={handleSubmit}>
          Log Mood
        </Button>
      </CardContent>
    </Card>
  );
};

export default DetailedMoodTracker;
