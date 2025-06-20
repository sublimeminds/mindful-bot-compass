
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

// Simplified notification settings to avoid type conflicts
const AdvancedNotificationSettings = () => {
  const [settings, setSettings] = useState({
    email_notifications: true,
    session_reminders: true,
    progress_updates: true,
    milestone_notifications: true,
    insight_notifications: true,
    streak_reminders: true,
    weekly_reports: false,
    daily_summaries: false,
    notification_frequency: 'normal' as const,
    volume: [5] as number[]
  });

  const handleSwitchChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleVolumeChange = (value: number[]) => {
    setSettings(prev => ({ ...prev, volume: value }));
  };

  const handleSave = () => {
    console.log('Saving notification settings:', settings);
    // TODO: Save to backend when ready
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Notification Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Notifications */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Basic Notifications</h3>
          
          {[
            { key: 'email_notifications', label: 'Email Notifications' },
            { key: 'session_reminders', label: 'Session Reminders' },
            { key: 'progress_updates', label: 'Progress Updates' },
            { key: 'milestone_notifications', label: 'Milestone Notifications' },
            { key: 'insight_notifications', label: 'Insight Notifications' },
            { key: 'streak_reminders', label: 'Streak Reminders' }
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <Label htmlFor={key}>{label}</Label>
              <Switch
                id={key}
                checked={settings[key as keyof typeof settings] as boolean}
                onCheckedChange={(value) => handleSwitchChange(key, value)}
              />
            </div>
          ))}
        </div>

        {/* Volume Control */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notification Volume</h3>
          <div className="space-y-2">
            <Label>Volume Level: {settings.volume[0]}/10</Label>
            <Slider
              value={settings.volume}
              onValueChange={handleVolumeChange}
              max={10}
              min={0}
              step={1}
              className="w-full"
            />
          </div>
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Settings
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdvancedNotificationSettings;
