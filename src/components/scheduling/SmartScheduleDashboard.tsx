
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Brain, TrendingUp, Zap, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import TimingOptimizationDashboard from '@/components/ai/TimingOptimizationDashboard';
import HabitFormationTracker from '@/components/scheduling/HabitFormationTracker';
import ContextAwareReminders from '@/components/scheduling/ContextAwareReminders';

interface SmartSchedule {
  id: string;
  title: string;
  type: 'session' | 'mood_check' | 'exercise' | 'medication' | 'self_care';
  optimalTime: string;
  confidence: number;
  nextScheduled: Date;
  adaptability: 'high' | 'medium' | 'low';
  contextFactors: string[];
}

const SmartScheduleDashboard = () => {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<SmartSchedule[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    loadSmartSchedules();
  }, [user]);

  const loadSmartSchedules = async () => {
    // Mock data - would come from AI optimization service
    const mockSchedules: SmartSchedule[] = [
      {
        id: '1',
        title: 'Therapy Session',
        type: 'session',
        optimalTime: '18:30',
        confidence: 92,
        nextScheduled: new Date(Date.now() + 24 * 60 * 60 * 1000),
        adaptability: 'high',
        contextFactors: ['End of workday', 'High engagement', 'Low stress']
      },
      {
        id: '2',
        title: 'Morning Mood Check',
        type: 'mood_check',
        optimalTime: '09:15',
        confidence: 87,
        nextScheduled: new Date(Date.now() + 12 * 60 * 60 * 1000),
        adaptability: 'medium',
        contextFactors: ['Post-coffee', 'High alertness', 'Routine establishment']
      },
      {
        id: '3',
        title: 'Mindfulness Exercise',
        type: 'exercise',
        optimalTime: '14:00',
        confidence: 78,
        nextScheduled: new Date(Date.now() + 6 * 60 * 60 * 1000),
        adaptability: 'high',
        contextFactors: ['Lunch break', 'Energy dip', 'Stress relief']
      }
    ];
    setSchedules(mockSchedules);
  };

  const optimizeSchedules = async () => {
    setIsOptimizing(true);
    // Simulate AI optimization
    await new Promise(resolve => setTimeout(resolve, 2000));
    await loadSmartSchedules();
    setIsOptimizing(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'session': return '🧘';
      case 'mood_check': return '💭';
      case 'exercise': return '🏃';
      case 'medication': return '💊';
      case 'self_care': return '💆';
      default: return '📅';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Smart Scheduling & Reminders</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          AI-powered optimal timing, context-aware notifications, and habit formation tracking
          to maximize your therapy progress and wellness routine effectiveness.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Brain className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">85%</div>
            <p className="text-sm text-muted-foreground">Avg Confidence</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">+23%</div>
            <p className="text-sm text-muted-foreground">Adherence Improved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold">12</div>
            <p className="text-sm text-muted-foreground">Active Schedules</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Bell className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">4.2</div>
            <p className="text-sm text-muted-foreground">Avg Response Time</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="schedules" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="schedules">Smart Schedules</TabsTrigger>
          <TabsTrigger value="optimization">AI Optimization</TabsTrigger>
          <TabsTrigger value="habits">Habit Tracking</TabsTrigger>
          <TabsTrigger value="reminders">Context Reminders</TabsTrigger>
        </TabsList>

        <TabsContent value="schedules" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Optimized Schedules
                </CardTitle>
                <Button 
                  onClick={optimizeSchedules}
                  disabled={isOptimizing}
                  variant="outline"
                >
                  {isOptimizing ? 'Optimizing...' : 'Re-optimize'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {schedules.map((schedule) => (
                  <div key={schedule.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getTypeIcon(schedule.type)}</span>
                        <div>
                          <h3 className="font-medium">{schedule.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Next: {schedule.nextScheduled.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span className="font-mono">{schedule.optimalTime}</span>
                        </div>
                        <div className={`text-sm font-medium ${getConfidenceColor(schedule.confidence)}`}>
                          {schedule.confidence}% confidence
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {schedule.contextFactors.map((factor, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <Badge variant={
                        schedule.adaptability === 'high' ? 'default' :
                        schedule.adaptability === 'medium' ? 'secondary' : 'outline'
                      }>
                        {schedule.adaptability} adaptability
                      </Badge>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          Adjust
                        </Button>
                        <Button size="sm">
                          Set Reminder
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization">
          <TimingOptimizationDashboard />
        </TabsContent>

        <TabsContent value="habits">
          <HabitFormationTracker />
        </TabsContent>

        <TabsContent value="reminders">
          <ContextAwareReminders />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SmartScheduleDashboard;
