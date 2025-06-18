
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle, Target, Brain, Heart, Award } from 'lucide-react';

const ProgressTimeline = () => {
  const timelineEvents = [
    {
      date: '2024-01-15',
      type: 'milestone',
      title: 'Started Therapy Journey',
      description: 'Completed onboarding and first assessment',
      icon: <Brain className="h-4 w-4" />,
      color: 'bg-therapy-500'
    },
    {
      date: '2024-01-18',
      type: 'session',
      title: 'First Breakthrough Session',
      description: 'Identified key anxiety triggers and coping strategies',
      icon: <CheckCircle className="h-4 w-4" />,
      color: 'bg-calm-500'
    },
    {
      date: '2024-01-22',
      type: 'goal',
      title: 'Goal Achievement: Daily Mindfulness',
      description: 'Successfully practiced mindfulness for 7 consecutive days',
      icon: <Target className="h-4 w-4" />,
      color: 'bg-harmony-500'
    },
    {
      date: '2024-01-25',
      type: 'insight',
      title: 'Emotional Pattern Recognition',
      description: 'AI identified correlation between sleep and mood patterns',
      icon: <Heart className="h-4 w-4" />,
      color: 'bg-flow-500'
    },
    {
      date: '2024-01-28',
      type: 'achievement',
      title: 'Earned "Consistency Champion" Badge',
      description: 'Completed 10 therapy sessions within the first month',
      icon: <Award className="h-4 w-4" />,
      color: 'bg-therapy-600'
    },
    {
      date: '2024-02-01',
      type: 'milestone',
      title: 'One Month Progress Review',
      description: '68% improvement in overall wellness scores',
      icon: <CheckCircle className="h-4 w-4" />,
      color: 'bg-calm-600'
    }
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'milestone': return 'bg-therapy-100 text-therapy-700 border-therapy-200';
      case 'session': return 'bg-calm-100 text-calm-700 border-calm-200';
      case 'goal': return 'bg-harmony-100 text-harmony-700 border-harmony-200';
      case 'insight': return 'bg-flow-100 text-flow-700 border-flow-200';
      case 'achievement': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Your Mental Health Journey Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {timelineEvents.map((event, index) => (
            <div key={index} className="relative flex items-start space-x-4">
              {/* Timeline line */}
              {index !== timelineEvents.length - 1 && (
                <div className="absolute left-6 top-12 h-16 w-0.5 bg-gray-200" />
              )}
              
              {/* Event icon */}
              <div className={`flex-shrink-0 w-12 h-12 rounded-full ${event.color} text-white flex items-center justify-center`}>
                {event.icon}
              </div>
              
              {/* Event content */}
              <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                  <Badge variant="outline" className={getEventTypeColor(event.type)}>
                    {event.type}
                  </Badge>
                </div>
                <p className="text-gray-600 mb-2">{event.description}</p>
                <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Future milestones */}
        <div className="mt-8 p-4 bg-therapy-50 rounded-lg border border-therapy-200">
          <h4 className="font-semibold text-therapy-700 mb-2">Upcoming Milestones</h4>
          <div className="space-y-2 text-sm text-therapy-600">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>30-Day Consistency Streak (3 days remaining)</span>
            </div>
            <div className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span>Advanced CBT Techniques Unlock (5 sessions remaining)</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span>Emotional Wellness Master Badge (18% progress remaining)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressTimeline;
