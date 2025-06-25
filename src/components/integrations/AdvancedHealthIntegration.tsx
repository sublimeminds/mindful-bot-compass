
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { 
  Heart, 
  Activity, 
  Smartphone, 
  Watch, 
  Moon,
  Zap,
  TrendingUp,
  Shield,
  AlertCircle
} from 'lucide-react';

interface HealthMetrics {
  heart_rate: number;
  sleep_hours: number;
  steps: number;
  stress_level: number;
  active_minutes: number;
}

interface HealthSettings {
  sync_frequency: string;
  metrics_to_track: string[];
  correlation_analysis: boolean;
  mood_health_insights: boolean;
  privacy_level: string;
}

const AdvancedHealthIntegration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<HealthSettings>({
    sync_frequency: 'hourly',
    metrics_to_track: ['heart_rate', 'sleep', 'steps', 'stress'],
    correlation_analysis: true,
    mood_health_insights: true,
    privacy_level: 'standard'
  });
  const [connectedApps, setConnectedApps] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [healthData, setHealthData] = useState<HealthMetrics>({
    heart_rate: 72,
    sleep_hours: 7.5,
    steps: 8432,
    stress_level: 3,
    active_minutes: 45
  });

  const healthApps = [
    {
      id: 'apple-health',
      name: 'Apple HealthKit',
      icon: Smartphone,
      platform: 'iOS',
      description: 'Comprehensive health data from your iPhone and Apple Watch',
      metrics: ['Heart Rate', 'Sleep Analysis', 'Steps', 'Mood', 'Workout Data'],
      status: 'available'
    },
    {
      id: 'google-fit',
      name: 'Google Fit',
      icon: Activity,
      platform: 'Android',
      description: 'Fitness and wellness data from Google\'s health platform',
      metrics: ['Activity Tracking', 'Heart Points', 'Sleep Patterns', 'Weight'],
      status: 'available'
    },
    {
      id: 'fitbit',
      name: 'Fitbit',
      icon: Watch,
      platform: 'Cross-platform',
      description: 'Detailed fitness and health tracking from Fitbit devices',
      metrics: ['24/7 Heart Rate', 'Sleep Stages', 'Stress Management', 'Activity'],
      status: 'connected'
    }
  ];

  useEffect(() => {
    if (user) {
      loadHealthIntegrations();
      // Simulate loading health data
      setTimeout(() => simulateHealthDataSync(), 2000);
    }
  }, [user]);

  const loadHealthIntegrations = async () => {
    try {
      const { data, error } = await supabase
        .from('user_integrations')
        .select('*, integrations(*)')
        .eq('user_id', user?.id)
        .eq('integrations.type', 'health');

      if (error) throw error;

      const connected = data?.filter(integration => integration.is_enabled)
        .map(integration => integration.integrations?.name || '') || [];
      
      setConnectedApps(connected);

      if (data && data.length > 0 && data[0].settings) {
        setSettings({ ...settings, ...(data[0].settings as Partial<HealthSettings>) });
      }
    } catch (error) {
      console.error('Error loading health integrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const simulateHealthDataSync = () => {
    // Simulate real-time health data updates
    setHealthData({
      heart_rate: Math.floor(Math.random() * 20) + 65,
      sleep_hours: Math.round((Math.random() * 3 + 6) * 10) / 10,
      steps: Math.floor(Math.random() * 5000) + 5000,
      stress_level: Math.floor(Math.random() * 5) + 1,
      active_minutes: Math.floor(Math.random() * 60) + 20
    });
  };

  const connectHealthApp = async (appId: string) => {
    try {
      const app = healthApps.find(a => a.id === appId);
      if (!app) return;

      const { data: integration, error: integrationError } = await supabase
        .from('integrations')
        .select('id')
        .eq('type', 'health')
        .eq('name', app.name)
        .single();

      if (integrationError) throw integrationError;

      const { error } = await supabase
        .from('user_integrations')
        .upsert({
          user_id: user?.id!,
          integration_id: integration.id,
          is_enabled: true,
          settings: settings as any
        });

      if (error) throw error;

      setConnectedApps([...connectedApps, app.name]);
      
      toast({
        title: "Health App Connected",
        description: `${app.name} has been connected successfully`,
      });

      // Simulate initial data sync
      setTimeout(simulateHealthDataSync, 1000);

    } catch (error) {
      console.error('Error connecting health app:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to the health app. Please try again.",
        variant: "destructive"
      });
    }
  };

  const updateSettings = async (newSettings: Partial<HealthSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);

    try {
      const { data: integrations } = await supabase
        .from('integrations')
        .select('id')
        .eq('type', 'health');

      if (integrations) {
        for (const integration of integrations) {
          await supabase
            .from('user_integrations')
            .update({ settings: updatedSettings as any })
            .eq('user_id', user?.id)
            .eq('integration_id', integration.id);
        }
      }

      toast({
        title: "Settings Updated",
        description: "Your health tracking preferences have been saved",
      });
    } catch (error) {
      console.error('Error updating health settings:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Health Apps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {healthApps.map((app) => {
          const Icon = app.icon;
          const isConnected = connectedApps.includes(app.name) || app.status === 'connected';
          
          return (
            <Card key={app.id} className="border-therapy-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Icon className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{app.name}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {app.platform}
                      </Badge>
                    </div>
                  </div>
                  <Badge variant={isConnected ? "default" : "outline"}>
                    {isConnected ? 'Connected' : 'Available'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-therapy-600">{app.description}</p>
                
                <div>
                  <h5 className="font-medium text-therapy-900 mb-2 text-sm">Tracked Metrics</h5>
                  <div className="flex flex-wrap gap-1">
                    {app.metrics.map((metric) => (
                      <Badge key={metric} variant="secondary" className="text-xs">
                        {metric}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Button 
                  onClick={() => connectHealthApp(app.id)}
                  disabled={isConnected}
                  size="sm" 
                  className="w-full"
                >
                  {isConnected ? 'Connected' : 'Connect'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Health Data Dashboard - Only show if apps are connected */}
      {connectedApps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Health Metrics Dashboard</span>
              <Badge variant="outline" className="ml-auto">
                Live Data
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Heart className="h-8 w-8 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-600">Heart Rate</p>
                    <p className="text-2xl font-bold text-red-600">{healthData.heart_rate}</p>
                    <p className="text-xs text-gray-500">BPM</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Moon className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Sleep</p>
                    <p className="text-2xl font-bold text-blue-600">{healthData.sleep_hours}h</p>
                    <p className="text-xs text-gray-500">Last night</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Activity className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Steps</p>
                    <p className="text-2xl font-bold text-green-600">{healthData.steps.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Today</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-8 w-8 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-600">Stress Level</p>
                    <p className="text-2xl font-bold text-orange-600">{healthData.stress_level}/5</p>
                    <Progress value={healthData.stress_level * 20} className="w-16 h-2 mt-1" />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Zap className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-600">Active Minutes</p>
                    <p className="text-2xl font-bold text-purple-600">{healthData.active_minutes}</p>
                    <p className="text-xs text-gray-500">Today</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings Card */}
      {connectedApps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Health Tracking Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Correlation Analysis</p>
                  <p className="text-sm text-therapy-600">Analyze relationships between health metrics and mood</p>
                </div>
                <Switch
                  checked={settings.correlation_analysis}
                  onCheckedChange={(checked) => updateSettings({ correlation_analysis: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Mood-Health Insights</p>
                  <p className="text-sm text-therapy-600">Generate insights linking physical and mental health</p>
                </div>
                <Switch
                  checked={settings.mood_health_insights}
                  onCheckedChange={(checked) => updateSettings({ mood_health_insights: checked })}
                />
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900 mb-1">Health Data Privacy</h4>
                  <p className="text-sm text-red-600">
                    Your health data is encrypted and stored securely. We only use aggregated, 
                    anonymized data for insights and never share personal health information.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvancedHealthIntegration;
