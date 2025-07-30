import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Heart, 
  Target, 
  Calendar, 
  TrendingUp, 
  MessageSquare,
  Sparkles,
  Users,
  FileText
} from 'lucide-react';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';

const QuickActionsWidget = () => {
  const quickActions = [
    {
      title: 'Start AI Session',
      subtitle: 'Begin therapy chat',
      icon: Brain,
      color: 'from-therapy-500 to-calm-500',
      path: '/therapy-chat',
      priority: 'high'
    },
    {
      title: 'Mood Check-in',
      subtitle: 'Track your feelings',
      icon: Heart,
      color: 'from-harmony-500 to-balance-500',
      path: '/mood-tracker',
      priority: 'high'
    },
    {
      title: 'Set Goals',
      subtitle: 'Plan your progress',
      icon: Target,
      color: 'from-flow-500 to-therapy-500',
      path: '/goals',
      priority: 'medium'
    },
    {
      title: 'Schedule Session',
      subtitle: 'Book your next session',
      icon: Calendar,
      color: 'from-calm-500 to-harmony-500',
      path: '/sessions',
      priority: 'medium'
    },
    {
      title: 'Session Analytics',
      subtitle: 'Review transcripts',
      icon: FileText,
      color: 'from-therapy-500 to-purple-500',
      path: '/session-analytics',
      priority: 'medium'
    },
    {
      title: 'View Analytics',
      subtitle: 'See your progress',
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
      path: '/analytics',
      priority: 'low'
    },
    {
      title: 'Community',
      subtitle: 'Connect with others',
      icon: Users,
      color: 'from-green-500 to-blue-500',
      path: '/community',
      priority: 'low'
    }
  ];

  const handleActionClick = (path: string, title: string) => {
    console.log(`Navigating to ${path} for ${title}`);
    window.location.href = path;
  };

  const getPriorityActions = () => {
    return quickActions.filter(action => action.priority === 'high');
  };

  const getSecondaryActions = () => {
    return quickActions.filter(action => action.priority !== 'high');
  };

  return (
    <SafeComponentWrapper name="QuickActionsWidget">
      <Card className="bg-white border border-therapy-100 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-therapy-50 to-calm-50">
          <CardTitle className="flex items-center text-therapy-800">
            <Sparkles className="h-5 w-5 mr-2" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          {/* Priority Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {getPriorityActions().map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Button
                  key={index}
                  className={`h-16 flex flex-col space-y-1 bg-gradient-to-r ${action.color} text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border-0`}
                  onClick={() => handleActionClick(action.path, action.title)}
                >
                  <IconComponent className="h-5 w-5" />
                  <span className="font-medium text-sm">{action.title}</span>
                  <span className="text-xs opacity-90">{action.subtitle}</span>
                </Button>
              );
            })}
          </div>

          {/* Secondary Actions */}
          <div className="pt-3 border-t border-therapy-100">
            <div className="grid grid-cols-2 gap-2">
              {getSecondaryActions().map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="h-12 flex flex-col space-y-1 hover:bg-therapy-50 border-therapy-200 text-therapy-700"
                    onClick={() => handleActionClick(action.path, action.title)}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="text-xs font-medium">{action.title}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Daily Tip */}
          <div className="pt-3 border-t border-therapy-100">
            <div className="bg-gradient-to-r from-therapy-25 to-calm-25 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <div className="text-lg">💡</div>
                <div>
                  <p className="text-xs font-medium text-therapy-800 mb-1">Daily Tip</p>
                  <p className="text-xs text-muted-foreground">
                    Try deep breathing for 5 minutes to reduce stress and improve focus.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </SafeComponentWrapper>
  );
};

export default QuickActionsWidget;