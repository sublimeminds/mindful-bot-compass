
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const SimpleNotificationSettings = () => {
  const [settings, setSettings] = useState({
    email_notifications: true,
    session_reminders: true,
    progress_updates: true,
    milestone_notifications: true,
    insight_notifications: true,
    streak_reminders: true,
    weekly_reports: false,
    daily_summaries: false,
    notification_frequency: 'normal' as 'minimal' | 'normal' | 'frequent'
  });

  const handleSwitchChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    console.log('Saving notification settings:', settings);
    // TODO: Save to backend when ready
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
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

        {/* Reports */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Reports</h3>
          
          {[
            { key: 'weekly_reports', label: 'Weekly Reports' },
            { key: 'daily_summaries', label: 'Daily Summaries' }
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

        {/* Frequency */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notification Frequency</h3>
          <select
            value={settings.notification_frequency}
            onChange={(e) => setSettings(prev => ({ 
              ...prev, 
              notification_frequency: e.target.value as 'minimal' | 'normal' | 'frequent'
            }))}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="minimal">Minimal</option>
            <option value="normal">Normal</option>
            <option value="frequent">Frequent</option>
          </select>
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Settings
        </Button>
      </CardContent>
    </Card>
  );
};

export default SimpleNotificationSettings;
