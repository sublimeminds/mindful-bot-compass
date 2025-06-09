
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSmartNotificationTriggers } from "@/hooks/useSmartNotificationTriggers";
import { Brain, Zap, Clock, TrendingUp, Play, BarChart3 } from "lucide-react";
import { format } from "date-fns";

const SmartTriggerDashboard = () => {
  const { triggerAnalytics, isLoading, runTriggerCheck, runDailyCheck, isRunningCheck } = useSmartNotificationTriggers();

  const getTriggerTypeColor = (triggerId: string) => {
    if (triggerId.includes('session')) return 'bg-blue-100 text-blue-800';
    if (triggerId.includes('mood')) return 'bg-red-100 text-red-800';
    if (triggerId.includes('goal')) return 'bg-green-100 text-green-800';
    if (triggerId.includes('streak')) return 'bg-orange-100 text-orange-800';
    if (triggerId.includes('milestone')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getTriggerIcon = (triggerId: string) => {
    if (triggerId.includes('session')) return Clock;
    if (triggerId.includes('mood')) return TrendingUp;
    if (triggerId.includes('goal')) return Brain;
    if (triggerId.includes('streak')) return Zap;
    if (triggerId.includes('milestone')) return BarChart3;
    return Brain;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-therapy-500" />
            Smart Notification Triggers
          </h2>
          <p className="text-muted-foreground">
            AI-powered notifications based on user behavior patterns
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={runTriggerCheck}
            disabled={isRunningCheck}
            variant="outline"
            size="sm"
          >
            <Play className="h-4 w-4 mr-2" />
            Test Triggers
          </Button>
          <Button
            onClick={runDailyCheck}
            disabled={isRunningCheck}
            size="sm"
          >
            <Zap className="h-4 w-4 mr-2" />
            Run Daily Check
          </Button>
        </div>
      </div>

      {/* Trigger Types Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              Session Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Gentle nudges when users haven't had therapy sessions
            </p>
            <Badge className="mt-2 bg-blue-100 text-blue-800">Active</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-red-500" />
              Mood Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Support when mood patterns show concerning trends
            </p>
            <Badge className="mt-2 bg-red-100 text-red-800">Active</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Brain className="h-4 w-4 text-green-500" />
              Goal Motivation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Encouragement for stagnant goal progress
            </p>
            <Badge className="mt-2 bg-green-100 text-green-800">Active</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Recent Trigger Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Trigger Activity</CardTitle>
          <CardDescription>
            Latest automated notifications sent based on user behavior
          </CardDescription>
        </CardHeader>
        <CardContent>
          {triggerAnalytics.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No trigger activity yet</p>
              <p className="text-sm">Smart triggers will appear here as they're executed</p>
            </div>
          ) : (
            <div className="space-y-3">
              {triggerAnalytics.slice(0, 10).map((activity, index) => {
                const Icon = getTriggerIcon(activity.trigger_id);
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">
                          {activity.trigger_id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.profiles?.email || 'Unknown user'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getTriggerTypeColor(activity.trigger_id)}>
                        {activity.trigger_id.split('-')[0]}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(activity.executed_at), 'MMM d, HH:mm')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartTriggerDashboard;
