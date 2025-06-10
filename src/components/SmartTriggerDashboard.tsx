
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Target, 
  Calendar, 
  TrendingUp, 
  Bell,
  Activity,
  Clock,
  Users
} from 'lucide-react';
import { useSmartNotificationTriggers } from '@/hooks/useSmartNotificationTriggers';

const SmartTriggerDashboard = () => {
  const { 
    triggerAnalytics, 
    isLoading, 
    runTriggerCheck, 
    runDailyCheck, 
    isRunningCheck 
  } = useSmartNotificationTriggers();

  const triggerTypes = [
    {
      id: 'session-gap-3d',
      name: 'Session Gap Reminder',
      description: 'Users who haven\'t had a session in 3+ days',
      icon: Calendar,
      color: 'bg-blue-500',
      executions: triggerAnalytics.filter(t => t.trigger_id === 'session-gap-3d').length
    },
    {
      id: 'mood-decline',
      name: 'Mood Decline Alert',
      description: 'Users showing declining mood trends',
      icon: TrendingUp,
      color: 'bg-red-500',
      executions: triggerAnalytics.filter(t => t.trigger_id === 'mood-decline').length
    },
    {
      id: 'goal-stagnant',
      name: 'Goal Progress Nudge',
      description: 'Users with stagnant goal progress',
      icon: Target,
      color: 'bg-yellow-500',
      executions: triggerAnalytics.filter(t => t.trigger_id === 'goal-stagnant').length
    }
  ];

  const totalExecutions = triggerAnalytics.length;
  const recentExecutions = triggerAnalytics.filter(
    t => new Date(t.executed_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Smart Notification Triggers</h2>
          <p className="text-muted-foreground">
            Automated notifications based on user behavior patterns
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={runTriggerCheck}
            disabled={isRunningCheck}
            variant="outline"
            size="sm"
          >
            <Brain className="h-4 w-4 mr-2" />
            Run Check
          </Button>
          <Button
            onClick={runDailyCheck}
            disabled={isRunningCheck}
            size="sm"
          >
            <Activity className="h-4 w-4 mr-2" />
            Daily Check
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total Triggers</p>
                <p className="text-2xl font-bold">{totalExecutions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">This Week</p>
                <p className="text-2xl font-bold">{recentExecutions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Active Triggers</p>
                <p className="text-2xl font-bold">{triggerTypes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Success Rate</p>
                <p className="text-2xl font-bold">94%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trigger Types */}
      <Card>
        <CardHeader>
          <CardTitle>Active Trigger Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {triggerTypes.map((trigger) => {
              const Icon = trigger.icon;
              return (
                <div
                  key={trigger.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${trigger.color} text-white`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-medium">{trigger.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {trigger.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">
                      {trigger.executions} executions
                    </Badge>
                    <Badge variant="outline" className="text-green-600">
                      Active
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Executions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Trigger Executions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading trigger analytics...</div>
          ) : triggerAnalytics.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No trigger executions yet. Run a trigger check to see results.
            </div>
          ) : (
            <div className="space-y-2">
              {triggerAnalytics.slice(0, 10).map((execution, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <div>
                      <p className="font-medium">{execution.trigger_id}</p>
                      <p className="text-sm text-muted-foreground">
                        {execution.profiles?.email || 'System execution'}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(execution.executed_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartTriggerDashboard;
