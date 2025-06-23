
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  MessageCircle, 
  AlertTriangle, 
  Settings, 
  Plus,
  Edit,
  Trash2,
  Shield,
  Clock
} from 'lucide-react';

const RecentActivityFeed = () => {
  const activities = [
    {
      id: 1,
      type: 'user_registration',
      description: 'New user registered: john.doe@email.com',
      icon: Plus,
      time: '2 minutes ago',
      severity: 'info'
    },
    {
      id: 2,
      type: 'crisis_intervention',
      description: 'Crisis intervention triggered for user ID: 12345',
      icon: AlertTriangle,
      time: '5 minutes ago',
      severity: 'urgent'
    },
    {
      id: 3,
      type: 'ai_config_update',
      description: 'AI model configuration updated by admin',
      icon: Settings,
      time: '12 minutes ago',
      severity: 'info'
    },
    {
      id: 4,
      type: 'session_completed',
      description: 'Therapy session completed: 45 minutes duration',
      icon: MessageCircle,
      time: '18 minutes ago',
      severity: 'success'
    },
    {
      id: 5,
      type: 'user_update',
      description: 'User profile updated: jane.smith@email.com',
      icon: Edit,
      time: '23 minutes ago',
      severity: 'info'
    },
    {
      id: 6,
      type: 'security_alert',
      description: 'Multiple failed login attempts detected',
      icon: Shield,
      time: '35 minutes ago',
      severity: 'warning'
    },
    {
      id: 7,
      type: 'content_deletion',
      description: 'Therapy content removed: "Mindfulness Exercise 3"',
      icon: Trash2,
      time: '1 hour ago',
      severity: 'warning'
    },
    {
      id: 8,
      type: 'user_registration',
      description: 'New user registered: alice.wilson@email.com',
      icon: Plus,
      time: '1 hour ago',
      severity: 'info'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'urgent': return 'text-red-400 bg-red-400/10';
      case 'warning': return 'text-yellow-400 bg-yellow-400/10';
      case 'success': return 'text-green-400 bg-green-400/10';
      default: return 'text-blue-400 bg-blue-400/10';
    }
  };

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case 'urgent': return 'destructive';
      case 'warning': return 'secondary';
      case 'success': return 'default';
      default: return 'outline';
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Clock className="h-5 w-5 text-purple-400" />
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-900 rounded-lg hover:bg-gray-850 transition-colors">
              <div className={`p-2 rounded-lg ${getSeverityColor(activity.severity)}`}>
                <activity.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium leading-5">
                  {activity.description}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400">{activity.time}</span>
                  <Badge 
                    variant={getSeverityBadgeColor(activity.severity)}
                    className="text-xs"
                  >
                    {activity.severity}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivityFeed;
