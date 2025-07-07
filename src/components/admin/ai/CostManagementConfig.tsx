import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { DollarSign, TrendingUp, AlertTriangle, Target, BarChart3, Settings } from 'lucide-react';

interface ModelCostConfig {
  modelName: string;
  provider: string;
  costPerRequest: number;
  monthlyBudget: number;
  currentSpend: number;
  requestCount: number;
  isActive: boolean;
  tier: 'free' | 'premium' | 'enterprise';
}

const CostManagementConfig = () => {
  const [modelCosts, setModelCosts] = useState<ModelCostConfig[]>([
    {
      modelName: 'claude-opus-4-20250514',
      provider: 'anthropic',
      costPerRequest: 0.015,
      monthlyBudget: 5000,
      currentSpend: 3247.50,
      requestCount: 216500,
      isActive: true,
      tier: 'enterprise'
    },
    {
      modelName: 'claude-sonnet-4-20250514',
      provider: 'anthropic',
      costPerRequest: 0.003,
      monthlyBudget: 2000,
      currentSpend: 892.45,
      requestCount: 297483,
      isActive: true,
      tier: 'premium'
    },
    {
      modelName: 'gpt-4.1-2025-04-14',
      provider: 'openai',
      costPerRequest: 0.010,
      monthlyBudget: 1500,
      currentSpend: 456.78,
      requestCount: 45678,
      isActive: true,
      tier: 'premium'
    }
  ]);

  const [budgetSettings, setBudgetSettings] = useState({
    totalMonthlyBudget: 10000,
    alertThreshold: 80,
    autoScaleDown: true,
    emergencyOverride: true,
    costOptimization: true,
    usageReporting: true,
    predictiveBudgeting: true,
    tierBasedLimits: true
  });

  const [tierLimits, setTierLimits] = useState({
    free: { dailyRequests: 100, monthlyBudget: 0 },
    premium: { dailyRequests: 1000, monthlyBudget: 50 },
    enterprise: { dailyRequests: 10000, monthlyBudget: 500 }
  });

  const [optimizationRules, setOptimizationRules] = useState([
    {
      id: '1',
      name: 'Cost-Quality Balance',
      description: 'Use cheaper models for routine tasks, premium for complex ones',
      isActive: true,
      savings: 34
    },
    {
      id: '2',
      name: 'Time-Based Routing',
      description: 'Use faster models during peak hours, efficient models off-peak',
      isActive: true,
      savings: 18
    },
    {
      id: '3',
      name: 'User Tier Optimization',
      description: 'Route requests based on user subscription level',
      isActive: true,
      savings: 22
    },
    {
      id: '4', 
      name: 'Batch Processing',
      description: 'Group similar requests to optimize API calls',
      isActive: false,
      savings: 15
    }
  ]);

  const getUsagePercentage = (current: number, budget: number) => {
    return Math.min((current / budget) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-400';
    if (percentage >= 75) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getBudgetStatus = (current: number, budget: number) => {
    const percentage = getUsagePercentage(current, budget);
    if (percentage >= 90) return { color: 'bg-red-900/20 border-red-700', status: 'Critical' };
    if (percentage >= 75) return { color: 'bg-yellow-900/20 border-yellow-700', status: 'Warning' };
    return { color: 'bg-green-900/20 border-green-700', status: 'Healthy' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">AI Cost Management & Optimization</h2>
          <p className="text-gray-400">Monitor and optimize AI model costs and usage patterns</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="border-blue-600 text-blue-400 hover:bg-blue-900/20">
            <BarChart3 className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <DollarSign className="h-4 w-4 mr-2" />
            Save Budget Settings
          </Button>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Monthly Budget</p>
                <p className="text-2xl font-bold text-white">${budgetSettings.totalMonthlyBudget.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Current Spend</p>
                <p className="text-2xl font-bold text-yellow-400">
                  ${modelCosts.reduce((sum, model) => sum + model.currentSpend, 0).toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Remaining Budget</p>
                <p className="text-2xl font-bold text-green-400">
                  ${(budgetSettings.totalMonthlyBudget - modelCosts.reduce((sum, model) => sum + model.currentSpend, 0)).toLocaleString()}
                </p>
              </div>
              <Target className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Requests</p>
                <p className="text-2xl font-bold text-blue-400">
                  {modelCosts.reduce((sum, model) => sum + model.requestCount, 0).toLocaleString()}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Model Cost Breakdown */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            AI Model Cost Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {modelCosts.map((model, index) => {
              const usagePercentage = getUsagePercentage(model.currentSpend, model.monthlyBudget);
              const budgetStatus = getBudgetStatus(model.currentSpend, model.monthlyBudget);
              
              return (
                <div key={index} className={`p-4 rounded-lg border ${budgetStatus.color}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-white">{model.modelName}</h3>
                      <Badge className={`${model.provider === 'anthropic' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                        {model.provider.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">{model.tier}</Badge>
                    </div>
                    <Badge className={budgetStatus.color}>{budgetStatus.status}</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-3">
                    <div className="text-center p-2 bg-gray-700 rounded">
                      <p className="text-lg font-bold text-white">${model.costPerRequest}</p>
                      <p className="text-xs text-gray-400">Per Request</p>
                    </div>
                    <div className="text-center p-2 bg-gray-700 rounded">
                      <p className="text-lg font-bold text-blue-400">{model.requestCount.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">Total Requests</p>
                    </div>
                    <div className="text-center p-2 bg-gray-700 rounded">
                      <p className="text-lg font-bold text-yellow-400">${model.currentSpend.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">Current Spend</p>
                    </div>
                    <div className="text-center p-2 bg-gray-700 rounded">
                      <p className="text-lg font-bold text-green-400">${model.monthlyBudget.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">Monthly Budget</p>
                    </div>
                    <div className="text-center p-2 bg-gray-700 rounded">
                      <p className={`text-lg font-bold ${getUsageColor(usagePercentage)}`}>
                        {usagePercentage.toFixed(1)}%
                      </p>
                      <p className="text-xs text-gray-400">Budget Used</p>
                    </div>
                  </div>

                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        usagePercentage >= 90 ? 'bg-red-500' : 
                        usagePercentage >= 75 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${usagePercentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Budget Settings */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Budget Management Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-white font-medium mb-2 block">Monthly Budget Limit</label>
                <Input
                  type="number"
                  value={budgetSettings.totalMonthlyBudget}
                  onChange={(e) => setBudgetSettings(prev => ({ ...prev, totalMonthlyBudget: parseInt(e.target.value) }))}
                  className="bg-gray-700 border-gray-600"
                  placeholder="Enter monthly budget"
                />
              </div>

              <div>
                <label className="text-white font-medium mb-3 block">
                  Alert Threshold: {budgetSettings.alertThreshold}%
                </label>
                <Slider
                  value={[budgetSettings.alertThreshold]}
                  onValueChange={(value) => setBudgetSettings(prev => ({ ...prev, alertThreshold: value[0] }))}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-4">
              {Object.entries(budgetSettings).slice(2).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <label className="text-white text-sm font-medium">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </label>
                  <Switch 
                    checked={value as boolean}
                    onCheckedChange={(checked) => 
                      setBudgetSettings(prev => ({ ...prev, [key]: checked }))
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Tier Limits */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">User Tier Cost Limits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(tierLimits).map(([tier, limits]) => (
              <div key={tier} className="p-4 bg-gray-700 rounded-lg">
                <h3 className="text-lg font-medium text-white mb-3 capitalize">{tier} Users</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-400">Daily Requests</label>
                    <Input
                      type="number"
                      value={limits.dailyRequests}
                      onChange={(e) => setTierLimits(prev => ({
                        ...prev,
                        [tier]: { ...prev[tier as keyof typeof prev], dailyRequests: parseInt(e.target.value) }
                      }))}
                      className="bg-gray-600 border-gray-500 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Monthly Budget ($)</label>
                    <Input
                      type="number"
                      value={limits.monthlyBudget}
                      onChange={(e) => setTierLimits(prev => ({
                        ...prev,
                        [tier]: { ...prev[tier as keyof typeof prev], monthlyBudget: parseInt(e.target.value) }
                      }))}
                      className="bg-gray-600 border-gray-500 text-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cost Optimization Rules */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Cost Optimization Rules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {optimizationRules.map((rule) => (
              <div key={rule.id} className="p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-white">{rule.name}</h3>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-100 text-green-800">
                      {rule.savings}% savings
                    </Badge>
                    <Switch 
                      checked={rule.isActive}
                      onCheckedChange={() => {
                        setOptimizationRules(prev => prev.map(r => 
                          r.id === rule.id ? { ...r, isActive: !r.isActive } : r
                        ));
                      }}
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-400">{rule.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cost Analytics */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Cost Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-900/20 border border-green-700 rounded-lg">
              <div className="text-2xl font-bold text-green-400">28%</div>
              <div className="text-sm text-green-200">Cost Reduction</div>
              <div className="text-xs text-gray-400">vs last month</div>
            </div>
            <div className="text-center p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">$0.0087</div>
              <div className="text-sm text-blue-200">Avg Cost/Request</div>
              <div className="text-xs text-gray-400">optimized routing</div>
            </div>
            <div className="text-center p-4 bg-purple-900/20 border border-purple-700 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">18 days</div>
              <div className="text-sm text-purple-200">Budget Remaining</div>
              <div className="text-xs text-gray-400">at current rate</div>
            </div>
            <div className="text-center p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
              <div className="text-2xl font-bold text-yellow-400">$1,247</div>
              <div className="text-sm text-yellow-200">Projected Savings</div>
              <div className="text-xs text-gray-400">this month</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CostManagementConfig;