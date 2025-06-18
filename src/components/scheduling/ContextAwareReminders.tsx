
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Bell, MapPin, Clock, Cloud, Smartphone, Calendar } from 'lucide-react';

interface ContextualReminder {
  id: string;
  title: string;
  type: 'location' | 'time' | 'weather' | 'mood' | 'activity' | 'calendar';
  trigger: string;
  action: string;
  isActive: boolean;
  priority: 'low' | 'medium' | 'high';
  lastTriggered?: Date;
  effectivenessScore: number;
  contextData: Record<string, any>;
}

const ContextAwareReminders = () => {
  const [reminders, setReminders] = useState<ContextualReminder[]>([]);
  const [currentContext, setCurrentContext] = useState({
    location: 'Home',
    weather: 'Sunny',
    time: '14:30',
    mood: 'Neutral',
    activity: 'Working'
  });

  useEffect(() => {
    loadReminders();
    updateCurrentContext();
  }, []);

  const loadReminders = () => {
    const mockReminders: ContextualReminder[] = [
      {
        id: '1',
        title: 'Stress Relief Reminder',
        type: 'location',
        trigger: 'At Work',
        action: 'Take 5 deep breaths when you arrive at work',
        isActive: true,
        priority: 'medium',
        lastTriggered: new Date(Date.now() - 2 * 60 * 60 * 1000),
        effectivenessScore: 87,
        contextData: { location: 'work', frequency: 'daily' }
      },
      {
        id: '2',
        title: 'Weather-Based Mood Boost',
        type: 'weather',
        trigger: 'Rainy Weather',
        action: 'Listen to uplifting music or practice gratitude',
        isActive: true,
        priority: 'low',
        effectivenessScore: 72,
        contextData: { weather: 'rainy', condition: 'precipitation > 0' }
      },
      {
        id: '3',
        title: 'Evening Wind-Down',
        type: 'time',
        trigger: '21:00',
        action: 'Start your evening routine - dim lights and prepare for sleep',
        isActive: true,
        priority: 'high',
        lastTriggered: new Date(Date.now() - 18 * 60 * 60 * 1000),
        effectivenessScore: 94,
        contextData: { time: '21:00', recurring: 'daily' }
      },
      {
        id: '4',
        title: 'Low Mood Support',
        type: 'mood',
        trigger: 'Mood Score < 3',
        action: 'Reach out to a friend or practice self-compassion',
        isActive: true,
        priority: 'high',
        effectivenessScore: 89,
        contextData: { moodThreshold: 3, action: 'support' }
      },
      {
        id: '5',
        title: 'Lunch Break Mindfulness',
        type: 'time',
        trigger: '12:30',
        action: 'Take a mindful eating break - focus on your lunch',
        isActive: false,
        priority: 'medium',
        effectivenessScore: 65,
        contextData: { time: '12:30', workdays: true }
      },
      {
        id: '6',
        title: 'Meeting Recovery',
        type: 'calendar',
        trigger: 'After Meetings',
        action: 'Take 2 minutes to reset and breathe before the next task',
        isActive: true,
        priority: 'medium',
        effectivenessScore: 81,
        contextData: { calendarEvent: 'meeting_end', duration: 2 }
      }
    ];
    setReminders(mockReminders);
  };

  const updateCurrentContext = () => {
    // Simulate real-time context updates
    const hour = new Date().getHours();
    const timeOfDay = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';
    
    setCurrentContext({
      location: hour >= 9 && hour <= 17 ? 'Work' : 'Home',
      weather: ['Sunny', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 3)],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mood: 'Neutral',
      activity: timeOfDay === 'Morning' ? 'Starting Day' : 
                timeOfDay === 'Afternoon' ? 'Working' : 'Winding Down'
    });
  };

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === id 
        ? { ...reminder, isActive: !reminder.isActive }
        : reminder
    ));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'location': return <MapPin className="h-4 w-4" />;
      case 'time': return <Clock className="h-4 w-4" />;
      case 'weather': return <Cloud className="h-4 w-4" />;
      case 'mood': return <span className="text-sm">💭</span>;
      case 'activity': return <Smartphone className="h-4 w-4" />;
      case 'calendar': return <Calendar className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEffectivenessColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const activeReminders = reminders.filter(r => r.isActive);

  return (
    <div className="space-y-6">
      {/* Current Context */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-800">
            <Smartphone className="h-5 w-5 mr-2" />
            Current Context
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span className="font-medium">{currentContext.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Cloud className="h-4 w-4 text-blue-600" />
              <span className="font-medium">{currentContext.weather}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="font-medium">{currentContext.time}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-600">💭</span>
              <span className="font-medium">{currentContext.mood}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Smartphone className="h-4 w-4 text-blue-600" />
              <span className="font-medium">{currentContext.activity}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Reminders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Context-Aware Reminders
            </div>
            <Badge variant="secondary">
              {activeReminders.length} active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reminders.map((reminder) => (
              <div key={reminder.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      {getTypeIcon(reminder.type)}
                      <span className="text-sm text-muted-foreground capitalize">
                        {reminder.type}
                      </span>
                    </div>
                    <h3 className="font-medium">{reminder.title}</h3>
                  </div>
                  <Switch
                    checked={reminder.isActive}
                    onCheckedChange={() => toggleReminder(reminder.id)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Trigger: </span>
                    <span className="font-medium">{reminder.trigger}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Action: </span>
                    <span>{reminder.action}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Badge className={getPriorityColor(reminder.priority)}>
                      {reminder.priority} priority
                    </Badge>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Effectiveness: </span>
                      <span className={`font-medium ${getEffectivenessColor(reminder.effectivenessScore)}`}>
                        {reminder.effectivenessScore}%
                      </span>
                    </div>
                  </div>
                  {reminder.lastTriggered && (
                    <div className="text-xs text-muted-foreground">
                      Last triggered: {reminder.lastTriggered.toLocaleString()}
                    </div>
                  )}
                </div>

                {reminder.isActive && (
                  <div className="pt-2 border-t">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        Edit Trigger
                      </Button>
                      <Button size="sm" variant="outline">
                        Test Now
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Context Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Context Trigger Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                  Location-Based
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Triggers when you arrive at or leave specific locations
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  Add Location Rule
                </Button>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-green-500" />
                  Time-Based
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Triggers at specific times or intervals
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  Add Time Rule
                </Button>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center">
                  <Cloud className="h-4 w-4 mr-2 text-gray-500" />
                  Weather-Based
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Triggers based on weather conditions
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  Add Weather Rule
                </Button>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center">
                  <span className="mr-2">💭</span>
                  Mood-Based
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Triggers based on mood tracking data
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  Add Mood Rule
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContextAwareReminders;
