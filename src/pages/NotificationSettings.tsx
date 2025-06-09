
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useNotificationPreferences } from "@/hooks/useNotificationPreferences";
import { Bell, Clock, Mail, Smartphone, Volume2 } from "lucide-react";

const NotificationSettings = () => {
  const { preferences, isLoading, updatePreferences } = useNotificationPreferences();

  const handleToggle = (key: string, value: boolean) => {
    updatePreferences({ [key]: value });
  };

  const handleFrequencyChange = (frequency: string) => {
    updatePreferences({ notificationFrequency: frequency as 'minimal' | 'normal' | 'frequent' });
  };

  const handleQuietHoursChange = (type: 'start' | 'end', value: string) => {
    if (type === 'start') {
      updatePreferences({ quietHoursStart: value });
    } else {
      updatePreferences({ quietHoursEnd: value });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Bell className="h-8 w-8 text-therapy-500" />
          Notification Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Customize when and how you receive notifications from Mindful Bot Compass
        </p>
      </div>

      <div className="space-y-6">
        {/* General Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              General Notifications
            </CardTitle>
            <CardDescription>
              Control your overall notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications" className="text-sm font-medium">
                Email Notifications
              </Label>
              <Switch
                id="email-notifications"
                checked={preferences?.emailNotifications || false}
                onCheckedChange={(checked) => handleToggle('emailNotifications', checked)}
              />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Notification Frequency</Label>
              <Select
                value={preferences?.notificationFrequency || 'normal'}
                onValueChange={handleFrequencyChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minimal">Minimal (Essential only)</SelectItem>
                  <SelectItem value="normal">Normal (Recommended)</SelectItem>
                  <SelectItem value="frequent">Frequent (All updates)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Therapy & Wellness */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              Therapy & Wellness
            </CardTitle>
            <CardDescription>
              Notifications related to your therapy sessions and progress
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="session-reminders" className="text-sm font-medium">
                  Session Reminders
                </Label>
                <p className="text-xs text-muted-foreground">Gentle reminders for therapy sessions</p>
              </div>
              <Switch
                id="session-reminders"
                checked={preferences?.sessionReminders || false}
                onCheckedChange={(checked) => handleToggle('sessionReminders', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="progress-updates" className="text-sm font-medium">
                  Progress Updates
                </Label>
                <p className="text-xs text-muted-foreground">Weekly progress summaries</p>
              </div>
              <Switch
                id="progress-updates"
                checked={preferences?.progressUpdates || false}
                onCheckedChange={(checked) => handleToggle('progressUpdates', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="milestone-notifications" className="text-sm font-medium">
                  Milestone Achievements
                </Label>
                <p className="text-xs text-muted-foreground">Celebrate your accomplishments</p>
              </div>
              <Switch
                id="milestone-notifications"
                checked={preferences?.milestoneNotifications || false}
                onCheckedChange={(checked) => handleToggle('milestoneNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="insight-notifications" className="text-sm font-medium">
                  AI Insights
                </Label>
                <p className="text-xs text-muted-foreground">Personalized insights from your data</p>
              </div>
              <Switch
                id="insight-notifications"
                checked={preferences?.insightNotifications || false}
                onCheckedChange={(checked) => handleToggle('insightNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="streak-reminders" className="text-sm font-medium">
                  Streak Reminders
                </Label>
                <p className="text-xs text-muted-foreground">Keep your wellness streaks alive</p>
              </div>
              <Switch
                id="streak-reminders"
                checked={preferences?.streakReminders || false}
                onCheckedChange={(checked) => handleToggle('streakReminders', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Reports & Summaries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Reports & Summaries
            </CardTitle>
            <CardDescription>
              Regular reports about your wellness journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="daily-summaries" className="text-sm font-medium">
                  Daily Summaries
                </Label>
                <p className="text-xs text-muted-foreground">End-of-day wellness summaries</p>
              </div>
              <Switch
                id="daily-summaries"
                checked={preferences?.dailySummaries || false}
                onCheckedChange={(checked) => handleToggle('dailySummaries', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="weekly-reports" className="text-sm font-medium">
                  Weekly Reports
                </Label>
                <p className="text-xs text-muted-foreground">Comprehensive weekly progress reports</p>
              </div>
              <Switch
                id="weekly-reports"
                checked={preferences?.weeklyReports || false}
                onCheckedChange={(checked) => handleToggle('weeklyReports', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Quiet Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Quiet Hours
            </CardTitle>
            <CardDescription>
              Set times when you don't want to receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quiet-start">Start Time</Label>
                <Input
                  id="quiet-start"
                  type="time"
                  value={preferences?.quietHoursStart || ''}
                  onChange={(e) => handleQuietHoursChange('start', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quiet-end">End Time</Label>
                <Input
                  id="quiet-end"
                  type="time"
                  value={preferences?.quietHoursEnd || ''}
                  onChange={(e) => handleQuietHoursChange('end', e.target.value)}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              During quiet hours, only urgent notifications will be delivered
            </p>
          </CardContent>
        </Card>

        {/* Test Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Test Your Settings</CardTitle>
            <CardDescription>
              Send a test notification to verify your preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => {
                // This would trigger a test notification
                console.log('Test notification sent');
              }}
              className="w-full sm:w-auto"
            >
              Send Test Notification
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationSettings;
