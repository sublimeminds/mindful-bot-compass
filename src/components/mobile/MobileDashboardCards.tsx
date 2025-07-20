
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Heart, 
  Target, 
  BarChart3, 
  Calendar,
  Brain,
  Sparkles,
  TrendingUp,
  ChevronRight
} from 'lucide-react';

const MobileDashboardCards = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Start Therapy Session',
      description: 'Begin your AI-powered therapy session',
      icon: Brain,
      action: () => navigate('/therapy-session'),
      color: 'bg-therapy-500',
      urgent: true
    },
    {
      title: 'Quick Mood Check',
      description: 'Log your current mood',
      icon: Heart,
      action: () => navigate('/mood'),
      color: 'bg-rose-500'
    },
    {
      title: 'View Progress',
      description: 'See your therapy journey',
      icon: BarChart3,
      action: () => navigate('/analytics'),
      color: 'bg-blue-500'
    },
    {
      title: 'Check Goals',
      description: 'Review your objectives',
      icon: Target,
      action: () => navigate('/goals'),
      color: 'bg-green-500'
    }
  ];

  const todaysInsights = [
    {
      type: 'mood',
      title: 'Mood Trending Up',
      description: 'Your mood has improved 15% this week',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      type: 'session',
      title: 'Session Due',
      description: 'You have a therapy session scheduled',
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      type: 'achievement',
      title: 'Goal Achieved!',
      description: 'Completed daily meditation streak',
      icon: Sparkles,
      color: 'text-yellow-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Card 
              key={index}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg active:scale-95 ${
                action.urgent ? 'ring-2 ring-therapy-200 bg-gradient-to-br from-therapy-50 to-therapy-100' : ''
              }`}
              onClick={action.action}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${action.color} text-white shrink-0`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{action.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Today's Insights */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Today's Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {todaysInsights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <Icon className={`h-5 w-5 mt-0.5 ${insight.color}`} />
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{insight.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/activity')}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-3 p-3 border-l-4 border-therapy-500 bg-therapy-50 rounded">
            <MessageSquare className="h-4 w-4 text-therapy-600" />
            <div className="flex-1">
              <p className="text-sm font-medium">Completed therapy session</p>
              <p className="text-xs text-muted-foreground">2 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 border-l-4 border-rose-500 bg-rose-50 rounded">
            <Heart className="h-4 w-4 text-rose-600" />
            <div className="flex-1">
              <p className="text-sm font-medium">Logged mood: Happy</p>
              <p className="text-xs text-muted-foreground">5 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 border-l-4 border-green-500 bg-green-50 rounded">
            <Target className="h-4 w-4 text-green-600" />
            <div className="flex-1">
              <p className="text-sm font-medium">Updated goal progress</p>
              <p className="text-xs text-muted-foreground">1 day ago</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileDashboardCards;
