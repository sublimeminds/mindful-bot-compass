
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Target, BarChart3, Settings, Brain, Calendar, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';

const QuickActionsWidget = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();

  const primaryActions = [
    {
      title: "Set Goals",
      description: "Track your progress",
      icon: Target,
      onClick: () => navigate('/goals'),
      color: "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
    },
    {
      title: "View Analytics",
      description: "See your insights",
      icon: BarChart3,
      onClick: () => navigate('/analytics'),
      color: "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
    }
  ];

  const secondaryActions = [
    { title: "Sessions", icon: Calendar, onClick: () => navigate('/session-history') },
    { title: "Techniques", icon: Brain, onClick: () => navigate('/techniques') },
    { title: "Settings", icon: Settings, onClick: () => navigate('/profile') }
  ];

  // Add admin action if user is admin
  if (isAdmin) {
    secondaryActions.unshift({ 
      title: "Admin", 
      icon: Shield, 
      onClick: () => navigate('/admin') 
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageCircle className="h-5 w-5 mr-2 text-therapy-600" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Primary Actions - Side by side for wider layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {primaryActions.map((action) => (
            <Button
              key={action.title}
              onClick={action.onClick}
              className={`h-auto p-3 flex flex-col items-center justify-center space-y-2 ${action.color}`}
            >
              <action.icon className="h-5 w-5" />
              <div className="text-center">
                <div className="font-medium text-sm">{action.title}</div>
                <div className="text-xs opacity-90">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>

        {/* Secondary Actions - Horizontal grid */}
        <div className="grid grid-cols-4 gap-2 pt-2 border-t">
          {secondaryActions.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              size="sm"
              onClick={action.onClick}
              className={`flex flex-col items-center space-y-1 h-auto py-2 ${
                action.title === 'Admin' 
                  ? 'hover:bg-red-50 border-red-200 text-red-600 hover:text-red-700' 
                  : 'hover:bg-therapy-50'
              }`}
            >
              <action.icon className="h-3 w-3" />
              <span className="text-xs">{action.title}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsWidget;
