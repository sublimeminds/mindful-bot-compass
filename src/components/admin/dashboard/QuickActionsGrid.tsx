
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MessageSquare, 
  AlertTriangle, 
  Plus, 
  Settings, 
  FileText,
  Brain,
  Shield,
  Zap,
  Mail,
  Download,
  Upload
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActionsGrid = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Add New User',
      description: 'Create a new user account',
      icon: Plus,
      color: 'bg-blue-500',
      action: () => navigate('/admin/users/new'),
      urgent: false
    },
    {
      title: 'Crisis Alerts',
      description: 'Review pending interventions',
      icon: AlertTriangle,
      color: 'bg-red-500',
      action: () => navigate('/admin/crisis'),
      urgent: true,
      badge: 3
    },
    {
      title: 'AI Configuration',
      description: 'Update AI models',
      icon: Brain,
      color: 'bg-purple-500',
      action: () => navigate('/admin/ai'),
      urgent: false
    },
    {
      title: 'User Messages',
      description: 'Send announcements',
      icon: Mail,
      color: 'bg-green-500',
      action: () => navigate('/admin/user-communications'),
      urgent: false
    },
    {
      title: 'System Health',
      description: 'Check system status',
      icon: Shield,
      color: 'bg-orange-500',
      action: () => navigate('/admin/system-health'),
      urgent: false
    },
    {
      title: 'Export Data',
      description: 'Download reports',
      icon: Download,
      color: 'bg-indigo-500',
      action: () => navigate('/admin/custom-reports'),
      urgent: false
    },
    {
      title: 'Content Upload',
      description: 'Add therapy resources',
      icon: Upload,
      color: 'bg-cyan-500',
      action: () => navigate('/admin/content'),
      urgent: false
    },
    {
      title: 'Performance',
      description: 'Optimize system',
      icon: Zap,
      color: 'bg-yellow-500',
      action: () => navigate('/admin/performance'),
      urgent: false
    }
  ];

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Zap className="h-5 w-5 text-yellow-400" />
          <span>Quick Actions</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-4 border-gray-700 hover:bg-gray-700 flex flex-col items-start space-y-2 relative"
              onClick={action.action}
            >
              {action.badge && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs"
                >
                  {action.badge}
                </Badge>
              )}
              <div className="flex items-center space-x-2 w-full">
                <div className={`p-2 rounded-lg ${action.color}`}>
                  <action.icon className="h-4 w-4 text-white" />
                </div>
                {action.urgent && (
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                )}
              </div>
              <div className="text-left">
                <div className="font-medium text-white text-sm">{action.title}</div>
                <div className="text-xs text-gray-400">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsGrid;
