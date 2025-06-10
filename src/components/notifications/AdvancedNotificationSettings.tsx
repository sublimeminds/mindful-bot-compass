
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Bell, Clock, Brain, Heart, Target, Calendar, Settings2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface NotificationPreferences {
  sessionReminders: boolean;
  moodCheckIns: boolean;
  goalProgress: boolean;
  insights: boolean;
  emergencySupport: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  frequency: 'low' | 'medium' | 'high';
  preferredTimes: string[];
  categories: {
    therapy: boolean;
    mindfulness: boolean;
    goals: boolean;
    mood: boolean;
  };
}

const AdvancedNotificationSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    sessionReminders: true,
    moodCheckIns: true,
    goalProgress: true,
    insights: true,
    emergencySupport: true,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    },
    frequency: 'medium',
    preferredTimes: ['09:00', '18:00'],
    categories: {
      therapy: true,
      mindfulness: true,
      goals: true,
      mood: true
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSavePreferences = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Preferences Updated",
        description: "Your notification preferences have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = (key: keyof NotificationPreferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleCategoryToggle = (category: keyof NotificationPreferences['categories']) => {
    setPreferences(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: !prev.categories[category]
      }
    }));
  };

  const addPreferredTime = (time: string) => {
    if (!preferences.preferredTimes.includes(time)) {
      setPreferences(prev => ({
        ...prev,
        preferredTimes: [...prev.preferredTimes, time]
      }));
    }
  };

  const removePreferredTime = (time: string) => {
    setPreferences(prev => ({
      ...prev,
      preferredTimes: prev.preferredTimes.filter(t => t !== time)
    }));
  };

  const frequencyDescriptions = {
    low: 'Essential notifications only',
    medium: 'Balanced notification schedule',
    high: 'Frequent check-ins and reminders'
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Notification Preferences</h2>
        <p className="text-muted-foreground">
          Customize when and how you receive therapy reminders and insights
        </p>
      </div>

      {/* Basic Notification Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notification Types
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-therapy-500" />
              <div>
                <p className="font-medium">Session Reminders</p>
                <p className="text-sm text-muted-foreground">Get reminded about upcoming therapy sessions</p>
              </div>
            </div>
            <Switch
              checked={preferences.sessionReminders}
              onCheckedChange={() => handleToggle('sessionReminders')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Heart className="h-4 w-4 text-red-500" />
              <div>
                <p className="font-medium">Mood Check-ins</p>
                <p className="text-sm text-muted-foreground">Daily reminders to track your mood</p>
              </div>
            </div>
            <Switch
              checked={preferences.moodCheckIns}
              onCheckedChange={() => handleToggle('moodCheckIns')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Target className="h-4 w-4 text-green-500" />
              <div>
                <p className="font-medium">Goal Progress</p>
                <p className="text-sm text-muted-foreground">Updates on your therapy goals and milestones</p>
              </div>
            </div>
            <Switch
              checked={preferences.goalProgress}
              onCheckedChange={() => handleToggle('goalProgress')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="h-4 w-4 text-purple-500" />
              <div>
                <p className="font-medium">AI Insights</p>
                <p className="text-sm text-muted-foreground">Personalized insights and recommendations</p>
              </div>
            </div>
            <Switch
              checked={preferences.insights}
              onCheckedChange={() => handleToggle('insights')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Content Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(preferences.categories).map(([category, enabled]) => (
              <div key={category} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="capitalize font-medium">{category}</span>
                <Switch
                  checked={enabled}
                  onCheckedChange={() => handleCategoryToggle(category as keyof NotificationPreferences['categories'])}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Frequency Setting */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Frequency</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={preferences.frequency}
            onValueChange={(value: 'low' | 'medium' | 'high') => 
              setPreferences(prev => ({ ...prev, frequency: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low - {frequencyDescriptions.low}</SelectItem>
              <SelectItem value="medium">Medium - {frequencyDescriptions.medium}</SelectItem>
              <SelectItem value="high">High - {frequencyDescriptions.high}</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Preferred Times */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Preferred Times
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {preferences.preferredTimes.map(time => (
              <Badge
                key={time}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => removePreferredTime(time)}
              >
                {time} ×
              </Badge>
            ))}
          </div>
          
          <Select onValueChange={addPreferredTime}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Add preferred time" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 24 }, (_, i) => {
                const hour = i.toString().padStart(2, '0');
                const time = `${hour}:00`;
                return (
                  <SelectItem key={time} value={time} disabled={preferences.preferredTimes.includes(time)}>
                    {time}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Quiet Hours */}
      <Card>
        <CardHeader>
          <CardTitle>Quiet Hours</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Enable quiet hours</span>
            <Switch
              checked={preferences.quietHours.enabled}
              onCheckedChange={(enabled) => 
                setPreferences(prev => ({
                  ...prev,
                  quietHours: { ...prev.quietHours, enabled }
                }))
              }
            />
          </div>
          
          {preferences.quietHours.enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Start Time</label>
                <Select
                  value={preferences.quietHours.start}
                  onValueChange={(start) => 
                    setPreferences(prev => ({
                      ...prev,
                      quietHours: { ...prev.quietHours, start }
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i.toString().padStart(2, '0');
                      const time = `${hour}:00`;
                      return (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">End Time</label>
                <Select
                  value={preferences.quietHours.end}
                  onValueChange={(end) => 
                    setPreferences(prev => ({
                      ...prev,
                      quietHours: { ...prev.quietHours, end }
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i.toString().padStart(2, '0');
                      const time = `${hour}:00`;
                      return (
                        <SelectItem key={time} value={time}>
                          {time}
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

      {/* Save Button */}
      <Card>
        <CardContent className="pt-6">
          <Button 
            onClick={handleSavePreferences}
            disabled={isLoading}
            className="w-full"
          >
            <Settings2 className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Preferences'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedNotificationSettings;
