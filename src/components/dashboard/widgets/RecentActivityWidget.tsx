
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Target, Heart, Brain, ArrowRight, Clock } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'session' | 'goal' | 'mood' | 'achievement';
  title: string;
  description: string;
  timestamp: string;
  icon: React.ReactNode;
  color: string;
}

const RecentActivityWidget = () => {
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'session',
      title: 'Completed Anxiety Session',
      description: 'Practiced breathing exercises and mindfulness',
      timestamp: '2 hours ago',
      icon: <MessageSquare className="h-4 w-4" />,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: '2',
      type: 'mood',
      title: 'Mood Check-in',
      description: 'Feeling optimistic today (8/10)',
      timestamp: '4 hours ago',
      icon: <Heart className="h-4 w-4" />,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: '3',
      type: 'goal',
      title: 'Goal Progress',
      description: 'Daily meditation - 5 day streak!',
      timestamp: 'Yesterday',
      icon: <Target className="h-4 w-4" />,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: '4',
      type: 'achievement',
      title: 'Achievement Unlocked',
      description: 'Consistent Week - 7 days of check-ins',
      timestamp: '2 days ago',
      icon: <Brain className="h-4 w-4" />,
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Recent Activity</CardTitle>
          <Button variant="ghost" size="sm">
            View All
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`p-2 rounded-full ${activity.color}`}>
                {activity.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.title}
                  </p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {activity.timestamp}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {activity.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivityWidget;
