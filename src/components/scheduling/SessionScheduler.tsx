import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Repeat, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SessionSchedulerProps {
  userId: string;
  therapyPlanId?: string;
  onSessionScheduled: () => void;
}

interface ScheduledSession {
  id: string;
  scheduled_for: string;
  therapist_id: string;
  session_type: string;
  duration_minutes: number;
  is_recurring: boolean;
  recurrence_pattern?: string;
  recurrence_end_date?: string;
  status: string;
}

const SessionScheduler = ({ userId, therapyPlanId, onSessionScheduled }: SessionSchedulerProps) => {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<ScheduledSession[]>([]);
  const [newSession, setNewSession] = useState({
    therapist_id: '',
    session_type: 'therapy',
    scheduled_for: '',
    duration_minutes: 60,
    is_recurring: false,
    recurrence_pattern: 'weekly',
    recurrence_end_date: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadScheduledSessions();
  }, [userId]);

  const loadScheduledSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('scheduled_sessions')
        .select('*')
        .eq('user_id', userId)
        .gte('scheduled_for', new Date().toISOString())
        .order('scheduled_for', { ascending: true });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const handleScheduleSession = async () => {
    setLoading(true);
    try {
      const sessionData = {
        user_id: userId,
        therapy_plan_id: therapyPlanId,
        ...newSession,
        scheduled_for: new Date(newSession.scheduled_for).toISOString(),
        recurrence_end_date: newSession.recurrence_end_date ? 
          new Date(newSession.recurrence_end_date).toISOString() : null
      };

      // If recurring, create multiple sessions
      if (newSession.is_recurring && newSession.recurrence_end_date) {
        const sessions = generateRecurringSessions(sessionData);
        const { error } = await supabase
          .from('scheduled_sessions')
          .insert(sessions);

        if (error) throw error;
      } else {
        // Single session
        const { error } = await supabase
          .from('scheduled_sessions')
          .insert(sessionData);

        if (error) throw error;
      }

      // Schedule notifications for the session(s)
      await scheduleSessionReminders(sessionData);

      setNewSession({
        therapist_id: '',
        session_type: 'therapy',
        scheduled_for: '',
        duration_minutes: 60,
        is_recurring: false,
        recurrence_pattern: 'weekly',
        recurrence_end_date: ''
      });

      await loadScheduledSessions();
      onSessionScheduled();
      
      toast({
        title: "Success",
        description: newSession.is_recurring ? 
          "Recurring sessions scheduled successfully!" : 
          "Session scheduled successfully!",
      });
    } catch (error) {
      console.error('Error scheduling session:', error);
      toast({
        title: "Error",
        description: "Failed to schedule session. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateRecurringSessions = (baseSession: any) => {
    const sessions = [];
    const startDate = new Date(baseSession.scheduled_for);
    const endDate = new Date(baseSession.recurrence_end_date);
    
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      sessions.push({
        ...baseSession,
        scheduled_for: currentDate.toISOString(),
        recurrence_end_date: baseSession.recurrence_end_date
      });
      
      // Add interval based on pattern
      switch (baseSession.recurrence_pattern) {
        case 'daily':
          currentDate.setDate(currentDate.getDate() + 1);
          break;
        case 'weekly':
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case 'biweekly':
          currentDate.setDate(currentDate.getDate() + 14);
          break;
        case 'monthly':
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
      }
    }
    
    return sessions;
  };

  const scheduleSessionReminders = async (sessionData: any) => {
    try {
      const sessionTime = new Date(sessionData.scheduled_for);
      
      // Schedule 24-hour reminder
      const reminder24h = new Date(sessionTime);
      reminder24h.setHours(reminder24h.getHours() - 24);
      
      // Schedule 1-hour reminder  
      const reminder1h = new Date(sessionTime);
      reminder1h.setHours(reminder1h.getHours() - 1);

      const notifications = [
        {
          user_id: userId,
          type: 'session_reminder',
          title: 'Session Reminder',
          message: `You have a therapy session with ${sessionData.therapist_id} scheduled for tomorrow.`,
          scheduled_for: reminder24h.toISOString(),
          data: { session_id: 'temp', therapist_id: sessionData.therapist_id }
        },
        {
          user_id: userId,
          type: 'session_reminder',
          title: 'Session Starting Soon',
          message: `Your therapy session with ${sessionData.therapist_id} starts in 1 hour.`,
          scheduled_for: reminder1h.toISOString(),
          data: { session_id: 'temp', therapist_id: sessionData.therapist_id }
        }
      ];

      await supabase.from('notifications').insert(notifications);
    } catch (error) {
      console.error('Error scheduling reminders:', error);
    }
  };

  const handleCancelSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('scheduled_sessions')
        .update({ status: 'cancelled' })
        .eq('id', sessionId);

      if (error) throw error;

      await loadScheduledSessions();
      toast({
        title: "Session Cancelled",
        description: "The session has been cancelled successfully.",
      });
    } catch (error) {
      console.error('Error cancelling session:', error);
      toast({
        title: "Error",
        description: "Failed to cancel session.",
        variant: "destructive"
      });
    }
  };

  const getNextWeekDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().slice(0, 16);
  };

  const getRecurringEndDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 3); // Default to 3 months
    return date.toISOString().slice(0, 10);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Schedule New Session
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="therapist">Therapist</Label>
              <Select value={newSession.therapist_id} onValueChange={(value) => 
                setNewSession(prev => ({ ...prev, therapist_id: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select therapist" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dr. Sarah Chen">Dr. Sarah Chen</SelectItem>
                  <SelectItem value="Alex Rivera">Alex Rivera</SelectItem>
                  <SelectItem value="Maya Patel">Maya Patel</SelectItem>
                  <SelectItem value="Jordan Thompson">Jordan Thompson</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="sessionType">Session Type</Label>
              <Select value={newSession.session_type} onValueChange={(value) => 
                setNewSession(prev => ({ ...prev, session_type: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="therapy">Regular Therapy</SelectItem>
                  <SelectItem value="assessment">Assessment</SelectItem>
                  <SelectItem value="check_in">Check-in</SelectItem>
                  <SelectItem value="crisis">Crisis Session</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="datetime">Date & Time</Label>
              <Input
                id="datetime"
                type="datetime-local"
                value={newSession.scheduled_for}
                onChange={(e) => setNewSession(prev => ({ ...prev, scheduled_for: e.target.value }))}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>

            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Select value={newSession.duration_minutes.toString()} onValueChange={(value) => 
                setNewSession(prev => ({ ...prev, duration_minutes: parseInt(value) }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="recurring"
                checked={newSession.is_recurring}
                onCheckedChange={(checked) => 
                  setNewSession(prev => ({ ...prev, is_recurring: !!checked }))
                }
              />
              <Label htmlFor="recurring" className="flex items-center">
                <Repeat className="h-4 w-4 mr-1" />
                Recurring Appointment
              </Label>
            </div>

            {newSession.is_recurring && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pattern">Repeat Pattern</Label>
                  <Select value={newSession.recurrence_pattern} onValueChange={(value) => 
                    setNewSession(prev => ({ ...prev, recurrence_pattern: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newSession.recurrence_end_date}
                    onChange={(e) => setNewSession(prev => ({ ...prev, recurrence_end_date: e.target.value }))}
                    min={new Date().toISOString().slice(0, 10)}
                  />
                </div>
              </div>
            )}
          </div>

          <Button
            onClick={handleScheduleSession}
            disabled={!newSession.therapist_id || !newSession.scheduled_for || loading}
            className="w-full"
          >
            {loading ? 'Scheduling...' : 'Schedule Session'}
          </Button>
        </CardContent>
      </Card>

      {/* Upcoming Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No upcoming sessions scheduled
            </p>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div key={session.id} className="flex justify-between items-center p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{session.session_type}</Badge>
                      {session.is_recurring && (
                        <Badge variant="secondary">
                          <Repeat className="h-3 w-3 mr-1" />
                          Recurring
                        </Badge>
                      )}
                    </div>
                    <p className="font-medium">with {session.therapist_id}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      {new Date(session.scheduled_for).toLocaleString()}
                      <span className="ml-2">({session.duration_minutes} min)</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCancelSession(session.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionScheduler;