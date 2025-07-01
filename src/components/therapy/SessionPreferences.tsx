import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { 
  Clock, 
  Calendar,
  Bell,
  Moon,
  Sun,
  Volume2,
  Smartphone
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SessionPreferences = () => {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState({
    sessionDuration: [30], // minutes
    preferredTime: 'flexible', // morning, afternoon, evening, flexible
    sessionFrequency: 'weekly', // daily, weekly, biweekly, monthly
    autoScheduling: false,
    reminderNotifications: true,
    reminderTime: 60, // minutes before session
    sessionType: 'mixed', // text, voice, mixed
    voiceSettings: {
      enabled: true,
      autoTranscript: true,
      voiceSpeed: [1.0],
    },
    breakReminders: true,
    sessionGoals: true,
    progressTracking: true,
    sessionNotes: true,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '07:00'
    }
  });

  const handleSliderChange = (key: string, value: number[]) => {
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      setPreferences(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as any,
          [child]: value
        }
      }));
    } else {
      setPreferences(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleToggle = (key: string, value: boolean) => {
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      setPreferences(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as any,
          [child]: value
        }
      }));
    } else {
      setPreferences(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleSelectChange = (key: string, value: string) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const savePreferences = () => {
    localStorage.setItem('session_preferences', JSON.stringify(preferences));
    toast({
      title: "Preferences Saved",
      description: "Your session preferences have been updated.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Session Preferences</h2>
        <p className="text-muted-foreground">
          Configure your therapy session settings and scheduling preferences.
        </p>
      </div>

      {/* Session Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Session Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Default Session Duration: {preferences.sessionDuration[0]} minutes</Label>
            <Slider
              value={preferences.sessionDuration}
              onValueChange={(value) => handleSliderChange('sessionDuration', value)}
              max={120}
              min={15}
              step={15}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>15 min</span>
              <span>30 min</span>
              <span>45 min</span>
              <span>60 min</span>
              <span>120 min</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Session Type</Label>
            <Select value={preferences.sessionType} onValueChange={(value) => handleSelectChange('sessionType', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text Chat Only</SelectItem>
                <SelectItem value="voice">Voice Only</SelectItem>
                <SelectItem value="mixed">Mixed (Text & Voice)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Session Frequency</Label>
            <Select value={preferences.sessionFrequency} onValueChange={(value) => handleSelectChange('sessionFrequency', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Bi-weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Scheduling */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Scheduling Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Preferred Time of Day</Label>
            <Select value={preferences.preferredTime} onValueChange={(value) => handleSelectChange('preferredTime', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Morning (6-12 PM)</SelectItem>
                <SelectItem value="afternoon">Afternoon (12-6 PM)</SelectItem>
                <SelectItem value="evening">Evening (6-10 PM)</SelectItem>
                <SelectItem value="flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Auto-scheduling</Label>
              <p className="text-sm text-muted-foreground">Automatically schedule sessions based on preferences</p>
            </div>
            <Switch
              checked={preferences.autoScheduling}
              onCheckedChange={(checked) => handleToggle('autoScheduling', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Quiet Hours</Label>
              <p className="text-sm text-muted-foreground">No notifications during these hours</p>
            </div>
            <Switch
              checked={preferences.quietHours.enabled}
              onCheckedChange={(checked) => handleToggle('quietHours.enabled', checked)}
            />
          </div>

          {preferences.quietHours.enabled && (
            <div className="grid grid-cols-2 gap-4 ml-6">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Select value={preferences.quietHours.start} onValueChange={(value) => handleSelectChange('quietHours.start', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i.toString().padStart(2, '0');
                      return (
                        <SelectItem key={i} value={`${hour}:00`}>
                          {hour}:00
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Select value={preferences.quietHours.end} onValueChange={(value) => handleSelectChange('quietHours.end', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i.toString().padStart(2, '0');
                      return (
                        <SelectItem key={i} value={`${hour}:00`}>
                          {hour}:00
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Session Reminders</Label>
              <p className="text-sm text-muted-foreground">Get notified before scheduled sessions</p>
            </div>
            <Switch
              checked={preferences.reminderNotifications}
              onCheckedChange={(checked) => handleToggle('reminderNotifications', checked)}
            />
          </div>

          {preferences.reminderNotifications && (
            <div className="space-y-2 ml-6">
              <Label>Reminder Time</Label>
              <Select value={preferences.reminderTime.toString()} onValueChange={(value) => setPreferences(prev => ({ ...prev, reminderTime: parseInt(value) }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes before</SelectItem>
                  <SelectItem value="30">30 minutes before</SelectItem>
                  <SelectItem value="60">1 hour before</SelectItem>
                  <SelectItem value="120">2 hours before</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <Label>Break Reminders</Label>
              <p className="text-sm text-muted-foreground">Gentle reminders to take breaks during long sessions</p>
            </div>
            <Switch
              checked={preferences.breakReminders}
              onCheckedChange={(checked) => handleToggle('breakReminders', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Voice Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Volume2 className="h-5 w-5 mr-2" />
            Voice Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Voice Enabled</Label>
              <p className="text-sm text-muted-foreground">Allow voice interactions during sessions</p>
            </div>
            <Switch
              checked={preferences.voiceSettings.enabled}
              onCheckedChange={(checked) => handleToggle('voiceSettings.enabled', checked)}
            />
          </div>

          {preferences.voiceSettings.enabled && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto Transcript</Label>
                  <p className="text-sm text-muted-foreground">Automatically generate session transcripts</p>
                </div>
                <Switch
                  checked={preferences.voiceSettings.autoTranscript}
                  onCheckedChange={(checked) => handleToggle('voiceSettings.autoTranscript', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label>Voice Speed: {preferences.voiceSettings.voiceSpeed[0]}x</Label>
                <Slider
                  value={preferences.voiceSettings.voiceSpeed}
                  onValueChange={(value) => handleSliderChange('voiceSettings.voiceSpeed', value)}
                  max={2.0}
                  min={0.5}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0.5x</span>
                  <span>1.0x</span>
                  <span>1.5x</span>
                  <span>2.0x</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Session Features */}
      <Card>
        <CardHeader>
          <CardTitle>Session Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Session Goals</Label>
              <p className="text-sm text-muted-foreground">Set and track goals for each session</p>
            </div>
            <Switch
              checked={preferences.sessionGoals}
              onCheckedChange={(checked) => handleToggle('sessionGoals', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Progress Tracking</Label>
              <p className="text-sm text-muted-foreground">Track your progress across sessions</p>
            </div>
            <Switch
              checked={preferences.progressTracking}
              onCheckedChange={(checked) => handleToggle('progressTracking', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Session Notes</Label>
              <p className="text-sm text-muted-foreground">Automatically save session summaries and notes</p>
            </div>
            <Switch
              checked={preferences.sessionNotes}
              onCheckedChange={(checked) => handleToggle('sessionNotes', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={savePreferences} className="w-full">
        Save Session Preferences
      </Button>
    </div>
  );
};

export default SessionPreferences;