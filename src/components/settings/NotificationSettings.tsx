
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Bell, Mail, Smartphone, Clock, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NotificationSettings = () => {
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [sessionReminders, setSessionReminders] = useState(true);
  const [goalReminders, setGoalReminders] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [crisisAlerts, setCrisisAlerts] = useState(true);
  const [reminderFrequency, setReminderFrequency] = useState('daily');
  const [quietHoursStart, setQuietHoursStart] = useState('22:00');
  const [quietHoursEnd, setQuietHoursEnd] = useState('08:00');
  const [emergencyContactEmail, setEmergencyContactEmail] = useState('');

  const handleSaveSettings = () => {
    localStorage.setItem('notificationSettings', JSON.stringify({
      emailNotifications,
      pushNotifications,
      sessionReminders,
      goalReminders,
      weeklyReports,
      crisisAlerts,
      reminderFrequency,
      quietHoursStart,
      quietHoursEnd,
      emergencyContactEmail
    }));

    toast({
      title: "Notification Settings Saved",
      description: "Your notification preferences have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>General Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Email Notifications</span>
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          {/* Push Notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="flex items-center space-x-2">
                <Smartphone className="h-4 w-4" />
                <span>Push Notifications</span>
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive push notifications on your device
              </p>
            </div>
            <Switch
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Therapy Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Session Reminders */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Session Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Get reminded about upcoming therapy sessions
              </p>
            </div>
            <Switch
              checked={sessionReminders}
              onCheckedChange={setSessionReminders}
            />
          </div>

          {/* Goal Reminders */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Goal Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Receive reminders to work on your therapy goals
              </p>
            </div>
            <Switch
              checked={goalReminders}
              onCheckedChange={setGoalReminders}
            />
          </div>

          {/* Weekly Reports */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Weekly Progress Reports</Label>
              <p className="text-sm text-muted-foreground">
                Get weekly summaries of your therapy progress
              </p>
            </div>
            <Switch
              checked={weeklyReports}
              onCheckedChange={setWeeklyReports}
            />
          </div>

          {/* Reminder Frequency */}
          <div className="space-y-2">
            <Label>Reminder Frequency</Label>
            <Select value={reminderFrequency} onValueChange={setReminderFrequency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="every-other-day">Every Other Day</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Quiet Hours</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Input
                type="time"
                value={quietHoursStart}
                onChange={(e) => setQuietHoursStart(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>End Time</Label>
              <Input
                type="time"
                value={quietHoursEnd}
                onChange={(e) => setQuietHoursEnd(e.target.value)}
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            No notifications will be sent during these hours
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Crisis Support</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Crisis Alerts */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Crisis Alert Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Immediate notifications for crisis support resources
              </p>
            </div>
            <Switch
              checked={crisisAlerts}
              onCheckedChange={setCrisisAlerts}
            />
          </div>

          {/* Emergency Contact */}
          <div className="space-y-2">
            <Label>Emergency Contact Email</Label>
            <Input
              type="email"
              placeholder="emergency@example.com"
              value={emergencyContactEmail}
              onChange={(e) => setEmergencyContactEmail(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Optional: Email to notify in case of crisis detection
            </p>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSaveSettings} className="w-full">
        <Save className="h-4 w-4 mr-2" />
        Save Notification Settings
      </Button>
    </div>
  );
};

export default NotificationSettings;
