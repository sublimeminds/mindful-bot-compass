
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { MessageSquare, Clock, Target, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SessionSettings = () => {
  const { toast } = useToast();
  const [sessionDuration, setSessionDuration] = useState('30');
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState('19:00');
  const [preferredTherapyStyle, setPreferredTherapyStyle] = useState('cognitive-behavioral');
  const [sessionGoal, setSessionGoal] = useState('stress-reduction');
  const [autoSaveProgress, setAutoSaveProgress] = useState(true);

  const therapyStyles = [
    { id: 'cognitive-behavioral', name: 'Cognitive Behavioral Therapy (CBT)' },
    { id: 'mindfulness', name: 'Mindfulness-Based Therapy' },
    { id: 'humanistic', name: 'Humanistic Therapy' },
    { id: 'psychodynamic', name: 'Psychodynamic Therapy' },
    { id: 'solution-focused', name: 'Solution-Focused Therapy' }
  ];

  const sessionGoals = [
    { id: 'stress-reduction', name: 'Stress Reduction' },
    { id: 'anxiety-management', name: 'Anxiety Management' },
    { id: 'mood-improvement', name: 'Mood Improvement' },
    { id: 'relationship-issues', name: 'Relationship Issues' },
    { id: 'self-esteem', name: 'Self-Esteem Building' },
    { id: 'general-wellness', name: 'General Wellness' }
  ];

  const handleSaveSettings = () => {
    localStorage.setItem('sessionSettings', JSON.stringify({
      sessionDuration,
      reminderEnabled,
      reminderTime,
      preferredTherapyStyle,
      sessionGoal,
      autoSaveProgress
    }));

    toast({
      title: "Session Settings Saved",
      description: "Your therapy session preferences have been updated.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5" />
          <span>Session Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Session Duration */}
        <div className="space-y-2">
          <Label>Default Session Duration</Label>
          <Select value={sessionDuration} onValueChange={setSessionDuration}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="45">45 minutes</SelectItem>
              <SelectItem value="60">1 hour</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Daily Reminder */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Daily Session Reminder</Label>
              <p className="text-sm text-muted-foreground">
                Get reminded to complete your daily therapy session
              </p>
            </div>
            <Switch
              checked={reminderEnabled}
              onCheckedChange={setReminderEnabled}
            />
          </div>
          
          {reminderEnabled && (
            <div className="space-y-2">
              <Label>Reminder Time</Label>
              <Input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Preferred Therapy Style */}
        <div className="space-y-2">
          <Label>Preferred Therapy Approach</Label>
          <Select value={preferredTherapyStyle} onValueChange={setPreferredTherapyStyle}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {therapyStyles.map((style) => (
                <SelectItem key={style.id} value={style.id}>
                  {style.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Session Goal */}
        <div className="space-y-2">
          <Label>Primary Session Goal</Label>
          <Select value={sessionGoal} onValueChange={setSessionGoal}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sessionGoals.map((goal) => (
                <SelectItem key={goal.id} value={goal.id}>
                  {goal.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Auto Save Progress */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Auto-save Progress</Label>
            <p className="text-sm text-muted-foreground">
              Automatically save your session progress and insights
            </p>
          </div>
          <Switch
            checked={autoSaveProgress}
            onCheckedChange={setAutoSaveProgress}
          />
        </div>

        <Button onClick={handleSaveSettings} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          Save Session Settings
        </Button>
      </CardContent>
    </Card>
  );
};

export default SessionSettings;
