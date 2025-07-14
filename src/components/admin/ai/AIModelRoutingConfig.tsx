import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Users, 
  Brain, 
  ToggleLeft,
  ToggleRight,
  Download,
  Upload
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  AIRoutingConfigService, 
  AIRoutingRule, 
  AIFeatureToggle, 
  UserOverride 
} from '@/services/aiRoutingConfigService';

const AIModelRoutingConfig = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [routingRules, setRoutingRules] = useState<AIRoutingRule[]>([]);
  const [featureToggles, setFeatureToggles] = useState<AIFeatureToggle[]>([]);
  const [userOverrides, setUserOverrides] = useState<UserOverride[]>([]);
  const [editingRule, setEditingRule] = useState<AIRoutingRule | null>(null);
  const [newRule, setNewRule] = useState<Partial<AIRoutingRule>>({});

  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    setLoading(true);
    try {
      const [rules, toggles, overrides] = await Promise.all([
        AIRoutingConfigService.getRoutingRules(),
        AIRoutingConfigService.getFeatureToggles(),
        AIRoutingConfigService.getUserOverrides()
      ]);
      
      setRoutingRules(rules);
      setFeatureToggles(toggles);
      setUserOverrides(overrides);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load configuration",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRule = async () => {
    try {
      const errors = AIRoutingConfigService.validateRoutingRule(newRule);
      if (errors.length > 0) {
        toast({
          title: "Validation Error",
          description: errors.join(', '),
          variant: "destructive"
        });
        return;
      }

      const rule = await AIRoutingConfigService.createRoutingRule(newRule as any);
      setRoutingRules(prev => [...prev, rule]);
      setNewRule({});
      
      toast({
        title: "Success",
        description: "Routing rule created successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create routing rule",
        variant: "destructive"
      });
    }
  };

  const handleUpdateRule = async (id: string, updates: Partial<AIRoutingRule>) => {
    try {
      const updatedRule = await AIRoutingConfigService.updateRoutingRule(id, updates);
      setRoutingRules(prev => prev.map(rule => rule.id === id ? updatedRule : rule));
      setEditingRule(null);
      
      toast({
        title: "Success",
        description: "Routing rule updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update routing rule",
        variant: "destructive"
      });
    }
  };

  const handleDeleteRule = async (id: string) => {
    try {
      await AIRoutingConfigService.deleteRoutingRule(id);
      setRoutingRules(prev => prev.filter(rule => rule.id !== id));
      
      toast({
        title: "Success",
        description: "Routing rule deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete routing rule",
        variant: "destructive"
      });
    }
  };

  const handleToggleFeature = async (id: string, enabled: boolean) => {
    try {
      const updatedToggle = await AIRoutingConfigService.updateFeatureToggle(id, { enabled });
      setFeatureToggles(prev => prev.map(toggle => toggle.id === id ? updatedToggle : toggle));
      
      toast({
        title: "Success",
        description: `Feature ${enabled ? 'enabled' : 'disabled'} successfully`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update feature toggle",
        variant: "destructive"
      });
    }
  };

  const handleExportConfig = async () => {
    try {
      const config = await AIRoutingConfigService.exportConfiguration();
      const data = JSON.stringify(config, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-routing-config-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Configuration exported successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export configuration",
        variant: "destructive"
      });
    }
  };

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'free':
        return 'bg-gray-500/20 text-gray-400';
      case 'pro':
        return 'bg-blue-500/20 text-blue-400';
      case 'premium':
        return 'bg-purple-500/20 text-purple-400';
      default:
        return 'bg-green-500/20 text-green-400';
    }
  };

  const getFeatureTypeColor = (featureType: string) => {
    const colors = {
      chat: 'bg-blue-500/20 text-blue-400',
      adaptive: 'bg-purple-500/20 text-purple-400',
      crisis: 'bg-red-500/20 text-red-400',
      cultural: 'bg-green-500/20 text-green-400',
      voice: 'bg-orange-500/20 text-orange-400',
      emotion: 'bg-pink-500/20 text-pink-400',
      background: 'bg-gray-500/20 text-gray-400'
    };
    return colors[featureType as keyof typeof colors] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          <h2 className="text-xl font-semibold">AI Model Routing Configuration</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportConfig}>
            <Download className="h-4 w-4 mr-2" />
            Export Config
          </Button>
        </div>
      </div>

      <Tabs defaultValue="routing" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="routing">Routing Rules</TabsTrigger>
          <TabsTrigger value="features">Feature Toggles</TabsTrigger>
          <TabsTrigger value="overrides">User Overrides</TabsTrigger>
        </TabsList>

        <TabsContent value="routing" className="space-y-6">
          {/* Add New Rule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create New Routing Rule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Select 
                  value={newRule.userType} 
                  onValueChange={(value) => setNewRule(prev => ({ ...prev, userType: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="User Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="all">All Users</SelectItem>
                  </SelectContent>
                </Select>

                <Select 
                  value={newRule.featureType} 
                  onValueChange={(value) => setNewRule(prev => ({ ...prev, featureType: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Feature Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chat">Chat AI</SelectItem>
                    <SelectItem value="adaptive">Adaptive Therapy</SelectItem>
                    <SelectItem value="crisis">Crisis Detection</SelectItem>
                    <SelectItem value="cultural">Cultural AI</SelectItem>
                    <SelectItem value="voice">Voice Synthesis</SelectItem>
                    <SelectItem value="emotion">Emotion Detection</SelectItem>
                    <SelectItem value="background">Background AI</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Primary Model"
                  value={newRule.modelConfig?.primary || ''}
                  onChange={(e) => setNewRule(prev => ({
                    ...prev,
                    modelConfig: { ...prev.modelConfig, primary: e.target.value }
                  }))}
                />

                <Input
                  placeholder="Max Tokens"
                  type="number"
                  value={newRule.modelConfig?.maxTokens || ''}
                  onChange={(e) => setNewRule(prev => ({
                    ...prev,
                    modelConfig: { ...prev.modelConfig, maxTokens: parseInt(e.target.value) }
                  }))}
                />
              </div>

              <div className="flex justify-end mt-4">
                <Button onClick={handleCreateRule}>
                  <Save className="h-4 w-4 mr-2" />
                  Create Rule
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Existing Rules */}
          <Card>
            <CardHeader>
              <CardTitle>Current Routing Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {routingRules.map((rule) => (
                  <div key={rule.id} className="p-4 border rounded-lg">
                    {editingRule?.id === rule.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          <Select 
                            value={editingRule.userType} 
                            onValueChange={(value) => setEditingRule(prev => ({ ...prev!, userType: value as any }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="free">Free</SelectItem>
                              <SelectItem value="pro">Pro</SelectItem>
                              <SelectItem value="premium">Premium</SelectItem>
                              <SelectItem value="all">All Users</SelectItem>
                            </SelectContent>
                          </Select>

                          <Input
                            value={editingRule.modelConfig.primary}
                            onChange={(e) => setEditingRule(prev => ({
                              ...prev!,
                              modelConfig: { ...prev!.modelConfig, primary: e.target.value }
                            }))}
                          />

                          <Input
                            type="number"
                            value={editingRule.modelConfig.maxTokens || ''}
                            onChange={(e) => setEditingRule(prev => ({
                              ...prev!,
                              modelConfig: { ...prev!.modelConfig, maxTokens: parseInt(e.target.value) }
                            }))}
                          />

                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={editingRule.enabled}
                              onCheckedChange={(checked) => setEditingRule(prev => ({ ...prev!, enabled: checked }))}
                            />
                            <span className="text-sm">Enabled</span>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingRule(null)}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleUpdateRule(rule.id, editingRule)}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Badge className={getUserTypeColor(rule.userType)}>
                            {rule.userType}
                          </Badge>
                          <Badge className={getFeatureTypeColor(rule.featureType)}>
                            {rule.featureType}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {rule.modelConfig.primary}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {rule.modelConfig.maxTokens} tokens
                          </span>
                          <Badge variant={rule.enabled ? "default" : "secondary"}>
                            {rule.enabled ? "Enabled" : "Disabled"}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingRule(rule)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteRule(rule.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feature Toggles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {featureToggles.map((toggle) => (
                  <div key={toggle.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-medium">{toggle.featureName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getUserTypeColor(toggle.userType)}>
                            {toggle.userType}
                          </Badge>
                          {toggle.rolloutPercentage && toggle.rolloutPercentage < 100 && (
                            <span className="text-sm text-muted-foreground">
                              {toggle.rolloutPercentage}% rollout
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Switch
                        checked={toggle.enabled}
                        onCheckedChange={(checked) => handleToggleFeature(toggle.id, checked)}
                      />
                      <Badge variant={toggle.enabled ? "default" : "secondary"}>
                        {toggle.enabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overrides" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Overrides</CardTitle>
            </CardHeader>
            <CardContent>
              {userOverrides.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No user overrides configured
                </p>
              ) : (
                <div className="space-y-4">
                  {userOverrides.map((override) => (
                    <div key={override.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">User: {override.userId}</p>
                        <p className="text-sm text-muted-foreground">
                          {override.overrideType}: {JSON.stringify(override.overrideValue)}
                        </p>
                        <p className="text-sm text-muted-foreground">{override.reason}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => AIRoutingConfigService.deleteUserOverride(override.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIModelRoutingConfig;
