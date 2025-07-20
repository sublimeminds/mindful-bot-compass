
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Zap, 
  MessageCircle, 
  BarChart3, 
  Settings, 
  Sparkles,
  Cpu,
  Activity,
  Shield
} from 'lucide-react';

const AIHub = () => {
  const [activeAI, setActiveAI] = useState('therapist');

  const aiModules = [
    {
      id: 'therapist',
      name: 'AI Therapist',
      description: 'Your primary therapeutic companion with advanced emotional intelligence',
      status: 'active',
      version: '2.1.0',
      icon: Brain,
      capabilities: ['Emotional Intelligence', 'CBT Techniques', 'Crisis Support', 'Progress Tracking']
    },
    {
      id: 'wellness',
      name: 'Wellness Coach',
      description: 'Proactive wellness monitoring and lifestyle guidance',
      status: 'active',
      version: '1.8.3',
      icon: Activity,
      capabilities: ['Mood Tracking', 'Habit Formation', 'Wellness Plans', 'Daily Check-ins']
    },
    {
      id: 'crisis',
      name: 'Crisis Support AI',
      description: 'Specialized crisis intervention and emergency response',
      status: 'standby',
      version: '1.5.2',
      icon: Shield,
      capabilities: ['Crisis Detection', 'Emergency Protocols', '24/7 Monitoring', 'Resource Connection']
    },
    {
      id: 'analytics',
      name: 'Insight Engine',
      description: 'Advanced analytics and pattern recognition for therapy insights',
      status: 'active',
      version: '2.0.1',
      icon: BarChart3,
      capabilities: ['Progress Analysis', 'Pattern Recognition', 'Predictive Insights', 'Report Generation']
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'standby':
        return <Badge className="bg-yellow-100 text-yellow-800">Standby</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">
          AI Hub
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Manage and interact with your personalized AI therapeutic ecosystem
        </p>
      </div>

      <Tabs value={activeAI} onValueChange={setActiveAI} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {aiModules.map((module) => (
            <TabsTrigger key={module.id} value={module.id} className="flex items-center space-x-2">
              <module.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{module.name.split(' ')[0]}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {aiModules.map((module) => (
          <TabsContent key={module.id} value={module.id} className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-therapy-100 rounded-lg">
                      <module.icon className="h-8 w-8 text-therapy-600" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{module.name}</CardTitle>
                      <p className="text-muted-foreground mt-1">{module.description}</p>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    {getStatusBadge(module.status)}
                    <p className="text-sm text-muted-foreground">v{module.version}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Capabilities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {module.capabilities.map((capability, index) => (
                      <Badge key={index} variant="secondary" className="justify-center">
                        {capability}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button className="flex items-center space-x-2">
                    <MessageCircle className="h-4 w-4" />
                    <span>Start Session</span>
                  </Button>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Settings className="h-4 w-4" />
                    <span>Configure</span>
                  </Button>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4" />
                    <span>View Analytics</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* AI Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Cpu className="h-5 w-5" />
                    <span>Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Response Time</span>
                      <span className="text-sm font-medium">127ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Accuracy</span>
                      <span className="text-sm font-medium">94.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Uptime</span>
                      <span className="text-sm font-medium">99.8%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Zap className="h-5 w-5" />
                    <span>Usage</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Sessions Today</span>
                      <span className="text-sm font-medium">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">This Week</span>
                      <span className="text-sm font-medium">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total</span>
                      <span className="text-sm font-medium">247</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Sparkles className="h-5 w-5" />
                    <span>Insights</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Progress Score</span>
                      <span className="text-sm font-medium">8.4/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Mood Trend</span>
                      <span className="text-sm font-medium text-green-600">↗ Improving</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Goals Met</span>
                      <span className="text-sm font-medium">7/10</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AIHub;
