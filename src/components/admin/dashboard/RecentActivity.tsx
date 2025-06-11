
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  MessageSquare, 
  Target, 
  Settings, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItem {
  id: string;
  type: 'user_action' | 'system_event' | 'admin_action' | 'session' | 'goal' | 'alert';
  title: string;
  description: string;
  user?: string;
  timestamp: Date;
  severity: 'info' | 'warning' | 'success' | 'error';
  metadata?: Record<string, any>;
}

const RecentActivity = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = () => {
      // Simulate real activity data
      const mockActivities: ActivityItem[] = [
        {
          id: '1',
          type: 'user_action',
          title: 'New User Registration',
          description: 'Sarah Johnson completed onboarding',
          user: 'Sarah Johnson',
          timestamp: new Date(Date.now() - 300000), // 5 minutes ago
          severity: 'success'
        },
        {
          id: '2',
          type: 'session',
          title: 'Therapy Session Completed',
          description: 'User completed 45-minute session with AI therapist',
          user: 'John Doe',
          timestamp: new Date(Date.now() - 900000), // 15 minutes ago
          severity: 'info'
        },
        {
          id: '3',
          type: 'system_event',
          title: 'Database Backup',
          description: 'Scheduled backup completed successfully',
          timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
          severity: 'success'
        },
        {
          id: '4',
          type: 'alert',
          title: 'High Memory Usage',
          description: 'Memory usage exceeded 80% threshold',
          timestamp: new Date(Date.now() - 2700000), // 45 minutes ago
          severity: 'warning'
        },
        {
          id: '5',
          type: 'goal',
          title: 'Goal Achievement',
          description: 'Mike Chen completed daily meditation goal',
          user: 'Mike Chen',
          timestamp: new Date(Date.now() - 3600000), // 1 hour ago
          severity: 'success'
        },
        {
          id: '6',
          type: 'admin_action',
          title: 'User Role Updated',
          description: 'Admin granted moderator role to Lisa Brown',
          user: 'Admin User',
          timestamp: new Date(Date.now() - 7200000), // 2 hours ago
          severity: 'info'
        }
      ];

      setActivities(mockActivities);
      setLoading(false);
    };

    fetchActivities();
    
    // Refresh every minute
    const interval = setInterval(fetchActivities, 60000);
    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_action': return User;
      case 'session': return MessageSquare;
      case 'goal': return Target;
      case 'admin_action': return Settings;
      case 'alert': return AlertTriangle;
      case 'system_event': return CheckCircle;
      default: return Clock;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      case 'info': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'success': return 'default';
      case 'warning': return 'secondary';
      case 'error': return 'destructive';
      case 'info': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Clock className="h-5 w-5 mr-2 text-blue-400" />
            Recent Activity
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <ExternalLink className="h-4 w-4 mr-1" />
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-gray-400">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50 animate-pulse" />
            <p>Loading recent activity...</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {activities.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              
              return (
                <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-700/30 rounded-lg border border-gray-600">
                  <div className={`p-2 rounded-lg bg-gray-600`}>
                    <Icon className={`h-4 w-4 ${getSeverityColor(activity.severity)}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-white truncate">
                        {activity.title}
                      </p>
                      <Badge variant={getSeverityBadge(activity.severity) as any} className="text-xs ml-2">
                        {activity.severity}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-400 mb-2">
                      {activity.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        {activity.user && `by ${activity.user}`}
                      </span>
                      <span>
                        {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
