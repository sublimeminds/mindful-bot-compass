
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSimpleApp } from '@/hooks/useSimpleApp';

const DetailedMoodTracker = () => {
  const { user } = useSimpleApp();
  const queryClient = useQueryClient();

  const [moodData, setMoodData] = useState({
    overall: [5],
    anxiety: [5],
    depression: [5],
    stress: [5],
    energy: [5],
    sleep_quality: [5],
    social_connection: [5],
    notes: '',
    activities: [] as string[],
    triggers: [] as string[],
    weather: ''
  });

  const moodMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('mood_entries')
        .insert({
          user_id: user.id,
          overall: moodData.overall[0],
          anxiety: moodData.anxiety[0],
          depression: moodData.depression[0],
          stress: moodData.stress[0],
          energy: moodData.energy[0],
          sleep_quality: moodData.sleep_quality[0],
          social_connection: moodData.social_connection[0],
          notes: moodData.notes,
          activities: moodData.activities,
          triggers: moodData.triggers,
          weather: moodData.weather
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mood-entries'] });
      // Reset form
      setMoodData({
        overall: [5],
        anxiety: [5],
        depression: [5],
        stress: [5],
        energy: [5],
        sleep_quality: [5],
        social_connection: [5],
        notes: '',
        activities: [],
        triggers: [],
        weather: ''
      });
    },
  });

  const handleSliderChange = (key: string, value: number[]) => {
    setMoodData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    moodMutation.mutate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Mood Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mood Sliders */}
          {[
            { key: 'overall', label: 'Overall Mood' },
            { key: 'anxiety', label: 'Anxiety Level' },
            { key: 'depression', label: 'Depression Level' },
            { key: 'stress', label: 'Stress Level' },
            { key: 'energy', label: 'Energy Level' },
            { key: 'sleep_quality', label: 'Sleep Quality' },
            { key: 'social_connection', label: 'Social Connection' }
          ].map(({ key, label }) => (
            <div key={key} className="space-y-2">
              <label className="text-sm font-medium">{label}</label>
              <div className="flex items-center space-x-4">
                <Slider
                  value={moodData[key as keyof typeof moodData] as number[]}
                  onValueChange={(value) => handleSliderChange(key, value)}
                  max={10}
                  min={1}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-8">
                  {(moodData[key as keyof typeof moodData] as number[])[0]}/10
                </span>
              </div>
            </div>
          ))}

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <Textarea
              value={moodData.notes}
              onChange={(e) => setMoodData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="How was your day? Any specific thoughts or events?"
              rows={4}
            />
          </div>

          <Button 
            type="submit" 
            disabled={moodMutation.isPending}
            className="w-full"
          >
            {moodMutation.isPending ? 'Saving...' : 'Save Mood Entry'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DetailedMoodTracker;
