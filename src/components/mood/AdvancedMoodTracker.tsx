
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Heart, 
  Brain, 
  Activity, 
  Sun, 
  Moon, 
  Users, 
  Shield,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface MoodEntry {
  overall: number;
  anxiety: number;
  depression: number;
  stress: number;
  energy: number;
  sleep_quality: number;
  social_connection: number;
  notes: string;
}

const AdvancedMoodTracker = () => {
  const { user } = useSimpleApp();
  const queryClient = useQueryClient();

  const [moodEntry, setMoodEntry] = useState<MoodEntry>({
    overall: 5,
    anxiety: 5,
    depression: 5,
    stress: 5,
    energy: 5,
    sleep_quality: 5,
    social_connection: 5,
    notes: '',
  });

  const moodMutation = useMutation({
    mutationFn: async (newMoodEntry: MoodEntry) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('mood_entries')
        .insert({
          user_id: user.id,
          ...newMoodEntry,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mood-entries', user?.id] });
      console.log("Mood logged successfully!");
      setMoodEntry({
        overall: 5,
        anxiety: 5,
        depression: 5,
        stress: 5,
        energy: 5,
        sleep_quality: 5,
        social_connection: 5,
        notes: '',
      });
    },
    onError: (error: any) => {
      console.error('Error logging mood:', error);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    moodMutation.mutate(moodEntry);
  };

  const handleChange = (key: keyof MoodEntry, value: number | string) => {
    setMoodEntry({ ...moodEntry, [key]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Heart className="h-5 w-5 mr-2 text-therapy-600" />
          Detailed Mood Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="overall">Overall Mood</Label>
            <div className="flex items-center space-x-2">
              <Brain className="h-4 w-4 text-therapy-500" />
              <Slider
                id="overall"
                defaultValue={[moodEntry.overall]}
                max={10}
                min={1}
                step={1}
                onValueChange={(value) => handleChange('overall', value[0])}
              />
              <Badge variant="secondary">{moodEntry.overall}/10</Badge>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="anxiety">Anxiety Level</Label>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <Slider
                id="anxiety"
                defaultValue={[moodEntry.anxiety]}
                max={10}
                min={1}
                step={1}
                onValueChange={(value) => handleChange('anxiety', value[0])}
              />
              <Badge variant="secondary">{moodEntry.anxiety}/10</Badge>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="depression">Depression Level</Label>
            <div className="flex items-center space-x-2">
              <Moon className="h-4 w-4 text-blue-500" />
              <Slider
                id="depression"
                defaultValue={[moodEntry.depression]}
                max={10}
                min={1}
                step={1}
                onValueChange={(value) => handleChange('depression', value[0])}
              />
              <Badge variant="secondary">{moodEntry.depression}/10</Badge>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stress">Stress Level</Label>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-orange-500" />
              <Slider
                id="stress"
                defaultValue={[moodEntry.stress]}
                max={10}
                min={1}
                step={1}
                onValueChange={(value) => handleChange('stress', value[0])}
              />
              <Badge variant="secondary">{moodEntry.stress}/10</Badge>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="energy">Energy Level</Label>
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4 text-yellow-500" />
              <Slider
                id="energy"
                defaultValue={[moodEntry.energy]}
                max={10}
                min={1}
                step={1}
                onValueChange={(value) => handleChange('energy', value[0])}
              />
              <Badge variant="secondary">{moodEntry.energy}/10</Badge>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sleep_quality">Sleep Quality</Label>
            <div className="flex items-center space-x-2">
              <Moon className="h-4 w-4 text-blue-500" />
              <Slider
                id="sleep_quality"
                defaultValue={[moodEntry.sleep_quality]}
                max={10}
                min={1}
                step={1}
                onValueChange={(value) => handleChange('sleep_quality', value[0])}
              />
              <Badge variant="secondary">{moodEntry.sleep_quality}/10</Badge>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="social_connection">Social Connection</Label>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-green-500" />
              <Slider
                id="social_connection"
                defaultValue={[moodEntry.social_connection]}
                max={10}
                min={1}
                step={1}
                onValueChange={(value) => handleChange('social_connection', value[0])}
              />
              <Badge variant="secondary">{moodEntry.social_connection}/10</Badge>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="How was your day? Any specific events or thoughts?"
              value={moodEntry.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
            />
          </div>

          <Button disabled={moodMutation.isPending} type="submit" className="w-full">
            {moodMutation.isPending ? (
              <>
                Logging Mood...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Log Mood
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdvancedMoodTracker;
