import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Zap, AlertTriangle, Users, TrendingUp, Settings } from 'lucide-react';
import { therapyContextManager } from '@/services/therapyContextManager';

interface ModelConfig {
  id: string;
  name: string;
  provider: 'anthropic' | 'openai';
  taskTypes: string[];
  userTiers: string[];
  isActive: boolean;
  priority: number;
  costPerRequest: number;
  avgResponseTime: number;
  qualityScore: number;
}

const ModelRoutingConfig = () => {
  const [modelConfigs, setModelConfigs] = useState<ModelConfig[]>([
    {
      id: '1',
      name: 'claude-opus-4-20250514',
      provider: 'anthropic',
      taskTypes: ['crisis', 'complex-therapy', 'cultural-sensitive'],
      userTiers: ['premium', 'enterprise'],
      isActive: true,
      priority: 1,
      costPerRequest: 0.015,
      avgResponseTime: 2500,
      qualityScore: 0.95
    },
    {
      id: '2', 
      name: 'claude-sonnet-4-20250514',
      provider: 'anthropic',
      taskTypes: ['daily-therapy', 'mood-analysis', 'general-conversation'],
      userTiers: ['free', 'premium', 'enterprise'],
      isActive: true,
      priority: 2,
      costPerRequest: 0.003,
      avgResponseTime: 1200,
      qualityScore: 0.90
    },
    {
      id: '3',
      name: 'gpt-4.1-2025-04-14',
      provider: 'openai', 
      taskTypes: ['creative', 'content-generation', 'voice-interaction'],
      userTiers: ['premium', 'enterprise'],
      isActive: true,
      priority: 3,
      costPerRequest: 0.010,
      avgResponseTime: 1800,
      qualityScore: 0.88
    }
  ]);

  const [routingRules, setRoutingRules] = useState({
    crisis: 'claude-opus-4-20250514',
    dailyTherapy: 'claude-sonnet-4-20250514',
    creative: 'gpt-4.1-2025-04-14',
    cultural: 'claude-opus-4-20250514',
    free: 'claude-sonnet-4-20250514',
    premium: 'claude-opus-4-20250514',
    enterprise: 'claude-opus-4-20250514'
  });

  const taskTypes = [
    { id: 'crisis', name: 'Crisis Intervention', icon: AlertTriangle, color: 'text-red-500' },
    { id: 'daily-therapy', name: 'Daily Therapy', icon: Brain, color: 'text-blue-500' },
    { id: 'mood-analysis', name: 'Mood Analysis', icon: TrendingUp, color: 'text-green-500' },
    { id: 'cultural-sensitive', name: 'Cultural Therapy', icon: Users, color: 'text-purple-500' },
    { id: 'creative', name: 'Creative Techniques', icon: Zap, color: 'text-yellow-500' },
    { id: 'voice-interaction', name: 'Voice Interaction', icon: Settings, color: 'text-pink-500' }
  ];

  const userTiers = ['free', 'premium', 'enterprise'];

  const toggleModelStatus = (modelId: string) => {
    setModelConfigs(prev => prev.map(model => 
      model.id === modelId ? { ...model, isActive: !model.isActive } : model
    ));
  };

  const updateRoutingRule = (taskType: string, modelName: string) => {
    setRoutingRules(prev => ({ ...prev, [taskType]: modelName }));
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'anthropic': return 'bg-purple-100 text-purple-800';
      case 'openai': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">AI Model Routing Configuration</h2>
          <p className="text-gray-400">Configure intelligent model selection and routing rules</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Settings className="h-4 w-4 mr-2" />
          Save Configuration
        </Button>
      </div>

      {/* Model Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {modelConfigs.map((model) => (
          <Card key={model.id} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-white">{model.name}</CardTitle>
                <Switch 
                  checked={model.isActive}
                  onCheckedChange={() => toggleModelStatus(model.id)}
                />
              </div>
              <Badge className={getProviderColor(model.provider)}>
                {model.provider.toUpperCase()}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-2 bg-gray-700 rounded">
                  <p className="text-green-400 font-bold">${model.costPerRequest}</p>
                  <p className="text-gray-400">Per Request</p>
                </div>
                <div className="text-center p-2 bg-gray-700 rounded">
                  <p className="text-blue-400 font-bold">{model.avgResponseTime}ms</p>
                  <p className="text-gray-400">Avg Response</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-300">Task Types:</p>
                <div className="flex flex-wrap gap-1">
                  {model.taskTypes.map(task => (
                    <Badge key={task} variant="outline" className="text-xs">
                      {task}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-300">User Tiers:</p>
                <div className="flex flex-wrap gap-1">
                  {model.userTiers.map(tier => (
                    <Badge key={tier} variant="outline" className="text-xs">
                      {tier}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Quality Score</span>
                <span className="text-sm font-bold text-green-400">{(model.qualityScore * 100).toFixed(0)}%</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Task-Based Routing Rules */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            Task-Based Routing Rules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {taskTypes.map(task => {
              const TaskIcon = task.icon;
              return (
                <div key={task.id} className="p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center mb-3">
                    <TaskIcon className={`h-5 w-5 mr-2 ${task.color}`} />
                    <span className="text-white font-medium">{task.name}</span>
                  </div>
                  <Select 
                    value={routingRules[task.id as keyof typeof routingRules] || ''} 
                    onValueChange={(value) => updateRoutingRule(task.id, value)}
                  >
                    <SelectTrigger className="bg-gray-600 border-gray-500">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      {modelConfigs.filter(m => m.isActive).map(model => (
                        <SelectItem key={model.id} value={model.name}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* User Tier Routing */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Users className="h-5 w-5 mr-2" />
            User Tier Default Models
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {userTiers.map(tier => (
              <div key={tier} className="p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center mb-3">
                  <span className="text-white font-medium capitalize">{tier} Users</span>
                </div>
                <Select 
                  value={routingRules[tier as keyof typeof routingRules] || ''} 
                  onValueChange={(value) => updateRoutingRule(tier, value)}
                >
                  <SelectTrigger className="bg-gray-600 border-gray-500">
                    <SelectValue placeholder="Select default model" />
                  </SelectTrigger>
                  <SelectContent>
                    {modelConfigs
                      .filter(m => m.isActive && m.userTiers.includes(tier))
                      .map(model => (
                        <SelectItem key={model.id} value={model.name}>
                          {model.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fallback Configuration */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Fallback & Emergency Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-700 rounded-lg">
              <label className="text-white font-medium mb-2 block">Primary Fallback Model</label>
              <Select defaultValue="claude-sonnet-4-20250514">
                <SelectTrigger className="bg-gray-600 border-gray-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {modelConfigs.filter(m => m.isActive).map(model => (
                    <SelectItem key={model.id} value={model.name}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="p-4 bg-gray-700 rounded-lg">
              <label className="text-white font-medium mb-2 block">Crisis Emergency Model</label>
              <Select defaultValue="claude-opus-4-20250514">
                <SelectTrigger className="bg-gray-600 border-gray-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {modelConfigs.filter(m => m.isActive).map(model => (
                    <SelectItem key={model.id} value={model.name}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-red-900/20 border border-red-700 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
              <span className="text-red-200">Auto-escalate to highest capability model for crisis detection</span>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModelRoutingConfig;