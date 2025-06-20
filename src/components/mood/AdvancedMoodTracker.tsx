
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { 
  CalendarIcon, 
  TrendingUp, 
  Heart, 
  Brain, 
  Activity, 
  Sun, 
  Moon, 
  Users, 
  Briefcase,
  Shield,
  Plus,
  Minus
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MoodEntry {
  overall: number;
  anxiety: number;
  depression: number;
  stress: number;
  energy: number;
  sleepQuality: number;
  socialInteraction: number;
  physicalActivity: number;
  notes: string;
}

const AdvancedMoodTracker = () => {
  const { user } = useSimpleApp();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [moodEntry, setMoodEntry] = useState<MoodEntry>({
    overall: 5,
    anxiety: 5,
    depression: 5,
    stress: 5,
    energy: 5,
    sleepQuality: 5,
    socialInteraction: 5,
    physicalActivity: 5,
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
      toast({
        title: "Mood Logged",
        description: "Your mood has been recorded successfully!",
      });
      setMoodEntry({
        overall: 5,
        anxiety: 5,
        depression: 5,
        stress: 5,
        energy: 5,
        sleepQuality: 5,
        socialInteraction: 5,
        physicalActivity: 5,
        notes: '',
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to log mood. Please try again.",
        variant: "destructive",
      });
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
              <Zap className="h-4 w-4 text-yellow-500" />
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
            <Label htmlFor="sleepQuality">Sleep Quality</Label>
            <div className="flex items-center space-x-2">
              <Moon className="h-4 w-4 text-blue-500" />
              <Slider
                id="sleepQuality"
                defaultValue={[moodEntry.sleepQuality]}
                max={10}
                min={1}
                step={1}
                onValueChange={(value) => handleChange('sleepQuality', value[0])}
              />
              <Badge variant="secondary">{moodEntry.sleepQuality}/10</Badge>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="socialInteraction">Social Interaction</Label>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-green-500" />
              <Slider
                id="socialInteraction"
                defaultValue={[moodEntry.socialInteraction]}
                max={10}
                min={1}
                step={1}
                onValueChange={(value) => handleChange('socialInteraction', value[0])}
              />
              <Badge variant="secondary">{moodEntry.socialInteraction}/10</Badge>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="physicalActivity">Physical Activity</Label>
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-red-500" />
              <Slider
                id="physicalActivity"
                defaultValue={[moodEntry.physicalActivity]}
                max={10}
                min={1}
                step={1}
                onValueChange={(value) => handleChange('physicalActivity', value[0])}
              />
              <Badge variant="secondary">{moodEntry.physicalActivity}/10</Badge>
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
