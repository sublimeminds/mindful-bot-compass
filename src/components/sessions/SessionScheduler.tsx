
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Clock, User, MessageSquare, Video, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SessionScheduler = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [sessionType, setSessionType] = useState('');
  const [duration, setDuration] = useState('60');
  const [therapistPreference, setTherapistPreference] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');

  const sessionTypes = [
    { value: 'individual', label: 'Individual Therapy', icon: User },
    { value: 'group', label: 'Group Therapy', icon: MessageSquare },
    { value: 'video', label: 'Video Session', icon: Video },
    { value: 'phone', label: 'Phone Session', icon: Phone }
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  const durations = [
    { value: '30', label: '30 minutes' },
    { value: '45', label: '45 minutes' },
    { value: '60', label: '60 minutes' },
    { value: '90', label: '90 minutes' }
  ];

  const therapists = [
    { value: 'dr-smith', label: 'Dr. Sarah Smith - Anxiety & Depression' },
    { value: 'dr-jones', label: 'Dr. Michael Jones - Family Therapy' },
    { value: 'dr-brown', label: 'Dr. Emily Brown - Trauma Specialist' },
    { value: 'any', label: 'Any Available Therapist' }
  ];

  const handleScheduleSession = () => {
    if (!selectedDate || !selectedTime || !sessionType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to schedule your session.",
        variant: "destructive"
      });
      return;
    }

    // Save session to localStorage for demo
    const sessionData = {
      id: Date.now().toString(),
      date: selectedDate.toISOString(),
      time: selectedTime,
      type: sessionType,
      duration: parseInt(duration),
      therapist: therapistPreference,
      notes: sessionNotes,
      status: 'scheduled'
    };

    const existingSessions = JSON.parse(localStorage.getItem('scheduledSessions') || '[]');
    existingSessions.push(sessionData);
    localStorage.setItem('scheduledSessions', JSON.stringify(existingSessions));

    toast({
      title: "Session Scheduled Successfully",
      description: `Your ${sessionTypes.find(t => t.value === sessionType)?.label} session has been scheduled for ${selectedDate.toLocaleDateString()} at ${selectedTime}.`
    });

    // Reset form
    setSelectedTime('');
    setSessionType('');
    setSessionNotes('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5" />
            <span>Schedule a Session</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calendar */}
            <div className="space-y-3">
              <Label>Select Date</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                className="rounded-md border"
              />
            </div>

            {/* Session Details */}
            <div className="space-y-4">
              {/* Session Type */}
              <div className="space-y-2">
                <Label>Session Type *</Label>
                <Select value={sessionType} onValueChange={setSessionType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose session type" />
                  </SelectTrigger>
                  <SelectContent>
                    {sessionTypes.map(type => {
                      const IconComponent = type.icon;
                      return (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center space-x-2">
                            <IconComponent className="h-4 w-4" />
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Time Slot */}
              <div className="space-y-2">
                <Label>Time Slot *</Label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(time => (
                      <SelectItem key={time} value={time}>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>{time}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label>Duration</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map(dur => (
                      <SelectItem key={dur.value} value={dur.value}>
                        {dur.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Therapist Preference */}
              <div className="space-y-2">
                <Label>Therapist Preference</Label>
                <Select value={therapistPreference} onValueChange={setTherapistPreference}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose therapist" />
                  </SelectTrigger>
                  <SelectContent>
                    {therapists.map(therapist => (
                      <SelectItem key={therapist.value} value={therapist.value}>
                        {therapist.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Session Notes */}
          <div className="space-y-2">
            <Label>Session Notes (Optional)</Label>
            <Textarea
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              placeholder="Any specific topics you'd like to discuss or information for your therapist..."
              rows={3}
            />
          </div>

          {/* Schedule Button */}
          <Button onClick={handleScheduleSession} className="w-full" size="lg">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Schedule Session
          </Button>
        </CardContent>
      </Card>

      {/* Session Summary */}
      {selectedDate && selectedTime && sessionType && (
        <Card>
          <CardHeader>
            <CardTitle>Session Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Date:</span>
                <Badge variant="outline">{selectedDate.toLocaleDateString()}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Time:</span>
                <Badge variant="outline">{selectedTime}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Type:</span>
                <Badge>{sessionTypes.find(t => t.value === sessionType)?.label}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Duration:</span>
                <Badge variant="outline">{duration} minutes</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SessionScheduler;
