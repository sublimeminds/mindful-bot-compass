
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/SimpleAuthProvider';
import { Calendar, Clock, TrendingUp, Target } from 'lucide-react';

const WelcomeWidget = () => {
  const { user } = useAuth();
  const currentHour = new Date().getHours();
  
  const getGreeting = () => {
    if (currentHour < 12) return 'Good morning';
    if (currentHour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getMotivationalMessage = () => {
    const messages = [
      "Every step forward is progress worth celebrating.",
      "Your mental health journey matters.",
      "Small improvements lead to big changes.",
      "You're stronger than you think.",
      "Today is a new opportunity for growth."
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <Card className="bg-gradient-to-r from-therapy-500 to-therapy-600 text-white border-0">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-white">
              {getGreeting()}, {user?.email?.split('@')[0] || 'there'}!
            </CardTitle>
            <p className="text-therapy-100 mt-1">
              {getMotivationalMessage()}
            </p>
          </div>
          <div className="text-right">
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long',
                month: 'short', 
                day: 'numeric' 
              })}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Day 5 streak</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span className="text-sm">2/3 goals this week</span>
            </div>
          </div>
          <Button 
            variant="secondary" 
            size="sm"
            className="bg-white/20 hover:bg-white/30 text-white border-0"
          >
            Start Session
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeWidget;
