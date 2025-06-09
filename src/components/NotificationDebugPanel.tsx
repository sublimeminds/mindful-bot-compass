import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/contexts/AuthContext';
import { useIntelligentNotifications } from '@/hooks/useIntelligentNotifications';
import { IntelligentNotificationService } from '@/services/intelligentNotificationService';
import { NotificationService } from '@/services/notificationService';
import { supabase } from '@/integrations/supabase/client';
import { Bell, Zap, Target, Lightbulb, Heart, TrendingUp, Clock, Settings } from 'lucide-react';

const NotificationDebugPanel = () => {
  const { user } = useAuth();
  const { triggerCustomNotification } = useIntelligentNotifications();
  
  const [customTitle, setCustomTitle] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [customType, setCustomType] = useState<'session_reminder' | 'milestone_achieved' | 'insight_generated' | 'mood_check' | 'progress_update'>('session_reminder');
  const [customPriority, setCustomPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isLoading, setIsLoading] = useState(false);

  const handlePresetNotification = async (preset: string) => {
    if (!user) return;
    setIsLoading(true);

    try {
      switch (preset) {
        case 'session_reminder':
          await triggerCustomNotification(
            'session_reminder',
            '🧘 Time for Self-Care',
            "It's been a while since your last session. Take a few minutes to check in with yourself.",
            'medium'
          );
          break;
        
        case 'milestone_5':
          await triggerCustomNotification(
            'milestone_achieved',
            '🎉 First Steps Milestone!',
            "Congratulations! You've completed 5 therapy sessions and are building great habits.",
            'high',
            { milestone: 'First Steps', sessionCount: 5 }
          );
          break;
        
        case 'milestone_streak':
          await triggerCustomNotification(
            'milestone_achieved',
            '🔥 7-Day Streak!',
            "Amazing! You've maintained a 7-day therapy streak. Your consistency is paying off.",
            'high',
            { milestone: '7-Day Streak', streakDays: 7 }
          );
          break;
        
        case 'technique_insight':
          await triggerCustomNotification(
            'insight_generated',
            '🌟 New Technique Discovery',
            "We noticed you tried breathing exercises today. This technique has shown great results for reducing anxiety.",
            'medium',
            { technique: 'breathing_exercises', effectiveness: 'high' }
          );
          break;
        
        case 'mood_pattern':
          await triggerCustomNotification(
            'insight_generated',
            '📊 Mood Pattern Detected',
            "Your mood tends to improve significantly after morning sessions. Consider scheduling more sessions in the AM.",
            'medium',
            { pattern: 'morning_improvement', confidence: 0.85 }
          );
          break;
        
        case 'progress_update':
          await triggerCustomNotification(
            'progress_update',
            '📈 Weekly Progress Report',
            "This week you completed 3 sessions and your average mood improved by 2 points. Keep up the great work!",
            'low',
            { sessionsThisWeek: 3, moodImprovement: 2 }
          );
          break;
        
        case 'mood_check':
          await triggerCustomNotification(
            'mood_check',
            '💙 How are you feeling?',
            "You haven't tracked your mood today. A quick check-in can help us provide better insights.",
            'low'
          );
          break;
      }
    } catch (error) {
      console.error('Error triggering preset notification:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomNotification = async () => {
    if (!user || !customTitle || !customMessage) return;
    setIsLoading(true);

    try {
      await triggerCustomNotification(
        customType,
        customTitle,
        customMessage,
        customPriority
      );
      
      // Clear the form
      setCustomTitle('');
      setCustomMessage('');
      setCustomType('session_reminder');
      setCustomPriority('medium');
    } catch (error) {
      console.error('Error triggering custom notification:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestInactivityReminder = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      await IntelligentNotificationService.generateInactivityReminders();
    } catch (error) {
      console.error('Error generating inactivity reminders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestSessionInsights = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      // Mock session data for testing
      const mockSessionDetails = {
        techniques: ['breathing_exercises', 'mindfulness'],
        duration: 25 * 60 * 1000, // 25 minutes
        mood_before: 3,
        mood_after: 7,
      };

      await IntelligentNotificationService.processSessionCompletion(user.id, mockSessionDetails);
    } catch (error) {
      console.error('Error generating session insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetupCronJobs = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('setup-cron-job');
      
      if (error) {
        console.error('Error setting up cron jobs:', error);
      } else {
        console.log('Cron jobs setup result:', data);
      }
    } catch (error) {
      console.error('Error setting up cron jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTriggerScheduledNotifications = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-intelligent-notifications', {
        body: { source: 'manual_test' }
      });
      
      if (error) {
        console.error('Error triggering scheduled notifications:', error);
      } else {
        console.log('Scheduled notifications result:', data);
      }
    } catch (error) {
      console.error('Error triggering scheduled notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <Card className="mb-6">
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">Please sign in to test notifications</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 border-dashed">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          Notification Debug Panel
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Test the notification system with preset scenarios or create custom notifications
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Preset Notifications */}
        <div>
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Preset Notifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePresetNotification('session_reminder')}
              disabled={isLoading}
              className="justify-start"
            >
              <Heart className="h-4 w-4 mr-2" />
              Session Reminder
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePresetNotification('milestone_5')}
              disabled={isLoading}
              className="justify-start"
            >
              <Target className="h-4 w-4 mr-2" />
              5 Sessions Milestone
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePresetNotification('milestone_streak')}
              disabled={isLoading}
              className="justify-start"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              7-Day Streak
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePresetNotification('technique_insight')}
              disabled={isLoading}
              className="justify-start"
            >
              <Lightbulb className="h-4 w-4 mr-2" />
              Technique Insight
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePresetNotification('mood_pattern')}
              disabled={isLoading}
              className="justify-start"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Mood Pattern
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePresetNotification('progress_update')}
              disabled={isLoading}
              className="justify-start"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Progress Update
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePresetNotification('mood_check')}
              disabled={isLoading}
              className="justify-start"
            >
              <Heart className="h-4 w-4 mr-2" />
              Mood Check-in
            </Button>
          </div>
        </div>

        {/* Advanced Testing */}
        <div>
          <h3 className="font-medium mb-3">Advanced Testing</h3>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestSessionInsights}
              disabled={isLoading}
            >
              Test Session Analysis
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestInactivityReminder}
              disabled={isLoading}
            >
              Test Inactivity Check
            </Button>
          </div>
        </div>

        {/* Scheduled Notifications */}
        <div>
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Scheduled Notifications
          </h3>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSetupCronJobs}
              disabled={isLoading}
            >
              <Settings className="h-4 w-4 mr-2" />
              Setup Cron Jobs
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleTriggerScheduledNotifications}
              disabled={isLoading}
            >
              <Clock className="h-4 w-4 mr-2" />
              Trigger Scheduled Check
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Cron jobs run automatically: hourly checks, daily summaries at 9 AM, weekly reports on Sundays
          </p>
        </div>

        {/* Custom Notification Form */}
        <div className="border-t pt-4">
          <h3 className="font-medium mb-3">Custom Notification</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Type</label>
                <Select value={customType} onValueChange={(value: any) => setCustomType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="session_reminder">Session Reminder</SelectItem>
                    <SelectItem value="milestone_achieved">Milestone Achieved</SelectItem>
                    <SelectItem value="insight_generated">Insight Generated</SelectItem>
                    <SelectItem value="mood_check">Mood Check</SelectItem>
                    <SelectItem value="progress_update">Progress Update</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Priority</label>
                <Select value={customPriority} onValueChange={(value: any) => setCustomPriority(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      <Badge variant="secondary">Low</Badge>
                    </SelectItem>
                    <SelectItem value="medium">
                      <Badge variant="outline">Medium</Badge>
                    </SelectItem>
                    <SelectItem value="high">
                      <Badge variant="destructive">High</Badge>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Title</label>
              <Input
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Enter notification title..."
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Message</label>
              <Textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Enter notification message..."
                rows={3}
              />
            </div>
            
            <Button
              onClick={handleCustomNotification}
              disabled={isLoading || !customTitle || !customMessage}
              className="w-full"
            >
              Send Custom Notification
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationDebugPanel;
