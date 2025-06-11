
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  BarChart3, 
  Settings, 
  Download, 
  Bell,
  Shield,
  Database
} from 'lucide-react';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Manage Users',
      description: 'View and manage user accounts',
      icon: Users,
      color: 'bg-blue-600/20 border-blue-600/30 hover:bg-blue-600/30',
      iconColor: 'text-blue-400',
      onClick: () => navigate('/admin/users')
    },
    {
      title: 'Content Library',
      description: 'Manage therapy content and templates',
      icon: FileText,
      color: 'bg-purple-600/20 border-purple-600/30 hover:bg-purple-600/30',
      iconColor: 'text-purple-400',
      onClick: () => navigate('/admin/content')
    },
    {
      title: 'View Analytics',
      description: 'Platform insights and reports',
      icon: BarChart3,
      color: 'bg-green-600/20 border-green-600/30 hover:bg-green-600/30',
      iconColor: 'text-green-400',
      onClick: () => navigate('/admin/analytics')
    },
    {
      title: 'System Settings',
      description: 'Configure platform settings',
      icon: Settings,
      color: 'bg-orange-600/20 border-orange-600/30 hover:bg-orange-600/30',
      iconColor: 'text-orange-400',
      onClick: () => navigate('/admin/system')
    },
    {
      title: 'Export Data',
      description: 'Download platform reports',
      icon: Download,
      color: 'bg-cyan-600/20 border-cyan-600/30 hover:bg-cyan-600/30',
      iconColor: 'text-cyan-400',
      onClick: () => {
        // TODO: Implement data export functionality
        console.log('Export data clicked');
      }
    },
    {
      title: 'Notifications',
      description: 'Manage system notifications',
      icon: Bell,
      color: 'bg-yellow-600/20 border-yellow-600/30 hover:bg-yellow-600/30',
      iconColor: 'text-yellow-400',
      onClick: () => {
        // TODO: Navigate to notifications management
        console.log('Notifications clicked');
      }
    },
    {
      title: 'Security Center',
      description: 'Monitor security and access',
      icon: Shield,
      color: 'bg-red-600/20 border-red-600/30 hover:bg-red-600/30',
      iconColor: 'text-red-400',
      onClick: () => {
        // TODO: Navigate to security center
        console.log('Security center clicked');
      }
    },
    {
      title: 'Database Health',
      description: 'Check database performance',
      icon: Database,
      color: 'bg-indigo-600/20 border-indigo-600/30 hover:bg-indigo-600/30',
      iconColor: 'text-indigo-400',
      onClick: () => navigate('/admin/performance')
    }
  ];

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant="ghost"
              className={`p-4 h-auto flex flex-col items-center space-y-2 border transition-colors ${action.color}`}
              onClick={action.onClick}
            >
              <action.icon className={`h-6 w-6 ${action.iconColor}`} />
              <div className="text-center">
                <p className="text-sm font-medium text-white">{action.title}</p>
                <p className="text-xs text-gray-400 mt-1">{action.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
