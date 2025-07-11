import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { Target, MessageCircle, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CompactWelcomeWidget = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const quickStats = {
    weeklyGoalProgress: 75,
    sessionsThisWeek: 3,
    streakDays: 7,
    moodTrend: 'improving'
  };

  return (
    <Card className="h-full bg-gradient-to-br from-therapy-50 to-calm-50 border-therapy-200">
      <CardContent className="p-4 h-full flex flex-col justify-between">
        {/* Welcome Message */}
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-bold text-therapy-900 mb-1">
              Welcome back, {user?.user_metadata?.name || user?.email?.split('@')[0] || 'there'}! 👋
            </h3>
            <p className="text-sm text-therapy-600">
              Great progress this week. Keep it up!
            </p>
          </div>

          {/* Quick Stats - Compact Grid */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="space-y-1">
              <div className="text-lg font-bold text-therapy-700">{quickStats.weeklyGoalProgress}%</div>
              <div className="text-xs text-therapy-600">Weekly Goal</div>
              <Progress value={quickStats.weeklyGoalProgress} className="h-1.5" />
            </div>
            <div className="space-y-1">
              <div className="text-lg font-bold text-blue-700">{quickStats.sessionsThisWeek}</div>
              <div className="text-xs text-blue-600">Sessions</div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-bold text-green-700">{quickStats.streakDays}</div>
              <div className="text-xs text-green-600">Day Streak</div>
              <Badge variant="outline" className="text-xs text-green-700 border-green-200 px-1">
                {quickStats.moodTrend}
              </Badge>
            </div>
          </div>
        </div>

        {/* Primary Action */}
        <div className="space-y-2">
          <Button 
            onClick={() => navigate('/chat')}
            className="w-full bg-therapy-600 hover:bg-therapy-700 text-white"
            size="sm"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Start Chat Session
          </Button>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 text-xs"
              onClick={() => navigate('/analytics')}
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              Progress
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 text-xs"
              onClick={() => navigate('/goals')}
            >
              <Target className="h-3 w-3 mr-1" />
              Goals
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompactWelcomeWidget;