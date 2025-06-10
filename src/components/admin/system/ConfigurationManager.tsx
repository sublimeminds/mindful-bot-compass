
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings2, 
  Save, 
  RefreshCw, 
  Flag, 
  Bell, 
  Shield,
  Zap
} from 'lucide-react';

interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: 'ai' | 'notifications' | 'security' | 'experimental';
}

interface AppConfig {
  sessionTimeout: number;
  maxConcurrentSessions: number;
  enableMaintenance: boolean;
  debugMode: boolean;
  apiRateLimit: number;
}

const ConfigurationManager = () => {
  const [config, setConfig] = useState<AppConfig>({
    sessionTimeout: 30,
    maxConcurrentSessions: 1000,
    enableMaintenance: false,
    debugMode: false,
    apiRateLimit: 100
  });

  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([
    {
      id: 'ai_insights',
      name: 'AI Session Insights',
      description: 'Enable AI-powered session analysis and insights',
      enabled: true,
      category: 'ai'
    },
    {
      id: 'smart_notifications',
      name: 'Smart Notifications',
      description: 'Enable intelligent notification timing optimization',
      enabled: true,
      category: 'notifications'
    },
    {
      id: 'advanced_security',
      name: 'Advanced Security',
      description: 'Enable additional security measures and monitoring',
      enabled: false,
      category: 'security'
    },
    {
      id: 'beta_features',
      name: 'Beta Features',
      description: 'Enable experimental features in development',
      enabled: false,
      category: 'experimental'
    },
    {
      id: 'voice_integration',
      name: 'Voice Integration',
      description: 'Enable voice interaction capabilities',
      enabled: false,
      category: 'experimental'
    }
  ]);

  const [loading, setLoading] = useState(false);

  const handleConfigSave = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    console.log('Configuration saved:', config);
  };

  const handleFeatureFlagToggle = (flagId: string) => {
    setFeatureFlags(prev => 
      prev.map(flag => 
        flag.id === flagId 
          ? { ...flag, enabled: !flag.enabled }
          : flag
      )
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ai': return <Zap className="h-4 w-4" />;
      case 'notifications': return <Bell className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      case 'experimental': return <Flag className="h-4 w-4" />;
      default: return <Settings2 className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ai': return 'bg-purple-500';
      case 'notifications': return 'bg-blue-500';
      case 'security': return 'bg-red-500';
      case 'experimental': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Configuration Management</h2>
        <Button
          onClick={handleConfigSave}
          disabled={loading}
          className="bg-orange-600 hover:bg-orange-700"
        >
          <Save className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800">
          <TabsTrigger value="general" className="data-[state=active]:bg-orange-600">
            <Settings2 className="h-4 w-4 mr-2" />
            General Settings
          </TabsTrigger>
          <TabsTrigger value="features" className="data-[state=active]:bg-orange-600">
            <Flag className="h-4 w-4 mr-2" />
            Feature Flags
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">General Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Session Timeout (minutes)
                  </label>
                  <Input
                    type="number"
                    value={config.sessionTimeout}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      sessionTimeout: parseInt(e.target.value) || 0
                    }))}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Max Concurrent Sessions
                  </label>
                  <Input
                    type="number"
                    value={config.maxConcurrentSessions}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      maxConcurrentSessions: parseInt(e.target.value) || 0
                    }))}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    API Rate Limit (requests/minute)
                  </label>
                  <Input
                    type="number"
                    value={config.apiRateLimit}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      apiRateLimit: parseInt(e.target.value) || 0
                    }))}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-300">Maintenance Mode</h4>
                    <p className="text-xs text-gray-400">Enable to prevent new user sessions</p>
                  </div>
                  <Switch
                    checked={config.enableMaintenance}
                    onCheckedChange={(checked) => setConfig(prev => ({
                      ...prev,
                      enableMaintenance: checked
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-300">Debug Mode</h4>
                    <p className="text-xs text-gray-400">Enable detailed logging and debugging</p>
                  </div>
                  <Switch
                    checked={config.debugMode}
                    onCheckedChange={(checked) => setConfig(prev => ({
                      ...prev,
                      debugMode: checked
                    }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Feature Flags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {featureFlags.map((flag) => (
                <div
                  key={flag.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-700 border border-gray-600"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getCategoryColor(flag.category)}`}>
                      {getCategoryIcon(flag.category)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-white">{flag.name}</h4>
                        <Badge
                          variant="outline"
                          className={`text-xs ${getCategoryColor(flag.category)} text-white border-0`}
                        >
                          {flag.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400">{flag.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={flag.enabled}
                    onCheckedChange={() => handleFeatureFlagToggle(flag.id)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConfigurationManager;
