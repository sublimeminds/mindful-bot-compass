
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Heart, Brain, Zap, Moon, Users, AlertTriangle } from "lucide-react";
import { MoodTrackingService, DetailedMood } from "@/services/moodTrackingService";
import { useToast } from "@/hooks/use-toast";

interface DetailedMoodTrackerProps {
  onMoodSubmit: (mood: DetailedMood, activities: string[], triggers: string[], notes: string) => void;
  initialMood?: Partial<DetailedMood>;
}

const DetailedMoodTracker = ({ onMoodSubmit, initialMood = {} }: DetailedMoodTrackerProps) => {
  const [mood, setMood] = useState<DetailedMood>({
    overall: initialMood.overall || 5,
    anxiety: initialMood.anxiety || 5,
    depression: initialMood.depression || 5,
    stress: initialMood.stress || 5,
    energy: initialMood.energy || 5,
    sleep_quality: initialMood.sleep_quality || 5,
    social_connection: initialMood.social_connection || 5,
  });
  
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const moodCategories = MoodTrackingService.getMoodCategories();
  const commonActivities = MoodTrackingService.getCommonActivities();
  const commonTriggers = MoodTrackingService.getCommonTriggers();

  const handleMoodChange = (category: keyof DetailedMood, value: number[]) => {
    setMood(prev => ({ ...prev, [category]: value[0] }));
  };

  const toggleActivity = (activity: string) => {
    setSelectedActivities(prev => 
      prev.includes(activity) 
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const toggleTrigger = (trigger: string) => {
    setSelectedTriggers(prev => 
      prev.includes(trigger) 
        ? prev.filter(t => t !== trigger)
        : [...prev, trigger]
    );
  };

  const handleSubmit = () => {
    onMoodSubmit(mood, selectedActivities, selectedTriggers, notes);
    toast({
      title: "Mood Logged",
      description: "Your detailed mood has been recorded successfully.",
    });
  };

  const getMoodIcon = (category: string) => {
    switch (category) {
      case 'overall': return <Heart className="h-4 w-4" />;
      case 'anxiety': case 'stress': return <AlertTriangle className="h-4 w-4" />;
      case 'depression': return <Brain className="h-4 w-4" />;
      case 'energy': return <Zap className="h-4 w-4" />;
      case 'sleep_quality': return <Moon className="h-4 w-4" />;
      case 'social_connection': return <Users className="h-4 w-4" />;
      default: return <Heart className="h-4 w-4" />;
    }
  };

  const getMoodColor = (value: number) => {
    if (value <= 3) return 'text-red-500';
    if (value <= 6) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>How are you feeling today?</CardTitle>
        <p className="text-sm text-muted-foreground">
          Track your mood across different dimensions to better understand your mental health patterns.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mood Sliders */}
        <div className="space-y-4">
          {moodCategories.map(category => (
            <div key={category.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center space-x-2">
                  {getMoodIcon(category.key)}
                  <span>{category.label}</span>
                </Label>
                <span className={`font-semibold ${getMoodColor(mood[category.key as keyof DetailedMood] as number)}`}>
                  {mood[category.key as keyof DetailedMood]}/10
                </span>
              </div>
              <Slider
                value={[mood[category.key as keyof DetailedMood] as number]}
                onValueChange={(value) => handleMoodChange(category.key as keyof DetailedMood, value)}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
          ))}
        </div>

        {/* Activities */}
        <div className="space-y-3">
          <Label>What activities did you do today?</Label>
          <div className="flex flex-wrap gap-2">
            {commonActivities.map(activity => (
              <Badge
                key={activity}
                variant={selectedActivities.includes(activity) ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/80"
                onClick={() => toggleActivity(activity)}
              >
                {activity}
              </Badge>
            ))}
          </div>
        </div>

        {/* Triggers */}
        <div className="space-y-3">
          <Label>Any triggers or stressors today?</Label>
          <div className="flex flex-wrap gap-2">
            {commonTriggers.map(trigger => (
              <Badge
                key={trigger}
                variant={selectedTriggers.includes(trigger) ? "destructive" : "outline"}
                className="cursor-pointer hover:bg-destructive/80"
                onClick={() => toggleTrigger(trigger)}
              >
                {trigger}
              </Badge>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Additional notes</Label>
          <Textarea
            id="notes"
            placeholder="How are you feeling? Any specific thoughts or events you'd like to note..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        <Button onClick={handleSubmit} className="w-full">
          Log Mood
        </Button>
      </CardContent>
    </Card>
  );
};

export default DetailedMoodTracker;
