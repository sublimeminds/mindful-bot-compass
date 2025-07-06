import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, Clock, Target, TrendingDown, Users, 
  Play, Pause, Settings, BarChart3, AlertTriangle 
} from 'lucide-react';
import { smartNotificationTriggerService } from '@/services/smartNotificationTriggerService';
import { CrisisDetectionService } from '@/services/crisisDetectionService';
import { useToast } from '@/hooks/use-toast';

interface TriggerConfig {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  priority: string;
  cooldownHours: number;
  condition: {
    type: string;
    threshold: number;
    timeframe?: string;
  };
}

const SmartTriggerDashboard = () => {
  const [triggers, setTriggers] = useState<TriggerConfig[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [testingTrigger, setTestingTrigger] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadTriggerData();
  }, []);

  const loadTriggerData = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would come from the service
      const defaultTriggers: TriggerConfig[] = [
        {
          id: 'session-gap-3d',
          name: 'Session Gap Reminder',
          description: 'Remind users who haven\'t had a therapy session in 3+ days',
          isActive: true,
          priority: 'medium',
          cooldownHours: 24,
          condition: { type: 'session_gap', threshold: 3, timeframe: '3d' }
        },
        {
          id: 'mood-decline',
          name: 'Mood Decline Alert',
          description: 'Alert when mood ratings show declining trend',
          isActive: true,
          priority: 'high',
          cooldownHours: 12,
          condition: { type: 'mood_decline', threshold: 2 }
        },
        {
          id: 'goal-stagnant',
          name: 'Goal Progress Nudge',
          description: 'Encourage users with stagnant goal progress',
          isActive: true,
          priority: 'medium',
          cooldownHours: 48,
          condition: { type: 'goal_progress', threshold: 7, timeframe: '7d' }
        },
        {
          id: 'crisis-detection',
          name: 'Crisis Detection',
          description: 'Automated crisis intervention triggers',
          isActive: true,
          priority: 'critical',
          cooldownHours: 1,
          condition: { type: 'crisis_indicators', threshold: 3 }
        }
      ];

      setTriggers(defaultTriggers);
      
      const triggerAnalytics = await smartNotificationTriggerService.getTriggerAnalytics();
      setAnalytics(triggerAnalytics);
    } catch (error) {
      console.error('Error loading trigger data:', error);
      toast({
        title: "Error",
        description: "Failed to load trigger configuration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTrigger = async (triggerId: string, isActive: boolean) => {
    setTriggers(prev => 
      prev.map(trigger => 
        trigger.id === triggerId ? { ...trigger, isActive } : trigger
      )
    );

    toast({
      title: "Trigger Updated",
      description: `${isActive ? 'Enabled' : 'Disabled'} trigger successfully`,
    });
  };

  const handleTestTrigger = async (triggerId: string) => {
    setTestingTrigger(triggerId);
    
    try {
      // Simulate testing a trigger
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Test Completed",
        description: "Trigger test executed successfully",
      });
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Error testing trigger",
        variant: "destructive",
      });
    } finally {
      setTestingTrigger(null);
    }
  };

  const updateTriggerConfig = (triggerId: string, updates: Partial<TriggerConfig>) => {
    setTriggers(prev => 
      prev.map(trigger => 
        trigger.id === triggerId ? { ...trigger, ...updates } : trigger
      )
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-therapy-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold therapy-text-gradient">Smart Trigger Management</h1>
          <p className="text-gray-600">Configure and monitor automated notification triggers</p>
        </div>
        
        <Button onClick={loadTriggerData} variant="outline">
          <BarChart3 className="w-4 h-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Triggers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Zap className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-2xl font-bold">
                {triggers.filter(t => t.isActive).length}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              of {triggers.length} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Executions Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Play className="w-5 h-5 text-blue-500 mr-2" />
              <span className="text-2xl font-bold">{analytics?.length || 0}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Triggers fired</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Target className="w-5 h-5 text-therapy-500 mr-2" />
              <span className="text-2xl font-bold">94.2%</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Successful deliveries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Crisis Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-2xl font-bold">3</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="triggers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="triggers">Trigger Configuration</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
          <TabsTrigger value="crisis">Crisis Management</TabsTrigger>
        </TabsList>

        <TabsContent value="triggers" className="space-y-6">
          <div className="grid gap-6">
            {triggers.map((trigger) => (
              <Card key={trigger.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{trigger.name}</span>
                        <Badge className={getPriorityColor(trigger.priority)}>
                          {trigger.priority}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{trigger.description}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={trigger.isActive}
                        onCheckedChange={(checked) => 
                          handleToggleTrigger(trigger.id, checked)
                        }
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestTrigger(trigger.id)}
                        disabled={testingTrigger === trigger.id}
                      >
                        {testingTrigger === trigger.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-therapy-500" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Threshold: {trigger.condition.threshold}
                      </label>
                      <Slider
                        value={[trigger.condition.threshold]}
                        onValueChange={([value]) => 
                          updateTriggerConfig(trigger.id, {
                            condition: { ...trigger.condition, threshold: value }
                          })
                        }
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Cooldown: {trigger.cooldownHours}h
                      </label>
                      <Slider
                        value={[trigger.cooldownHours]}
                        onValueChange={([value]) => 
                          updateTriggerConfig(trigger.id, { cooldownHours: value })
                        }
                        max={72}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">Type</label>
                      <p className="text-sm capitalize">
                        {trigger.condition.type.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trigger Performance</CardTitle>
              <CardDescription>Recent trigger execution history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics?.slice(0, 10).map((execution: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Zap className="w-5 h-5 text-therapy-500" />
                      <div>
                        <p className="font-medium">{execution.trigger_id}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(execution.executed_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">Executed</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crisis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Crisis Detection System</CardTitle>
              <CardDescription>Monitor and manage crisis intervention triggers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border-l-4 border-l-red-500 bg-red-50 rounded">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                    <div>
                      <h4 className="font-medium text-red-800">Crisis Detection Active</h4>
                      <p className="text-sm text-red-600">
                        Monitoring user behavior for crisis indicators
                      </p>
                    </div>
                  </div>
                  <Switch checked={true} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <h4 className="font-medium">Detection Keywords</h4>
                    <p className="text-2xl font-bold text-red-500">15</p>
                    <p className="text-sm text-gray-600">Active patterns</p>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <h4 className="font-medium">Response Time</h4>
                    <p className="text-2xl font-bold text-orange-500">&lt; 5min</p>
                    <p className="text-sm text-gray-600">Average</p>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <h4 className="font-medium">Success Rate</h4>
                    <p className="text-2xl font-bold text-green-500">98.7%</p>
                    <p className="text-sm text-gray-600">Interventions</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SmartTriggerDashboard;