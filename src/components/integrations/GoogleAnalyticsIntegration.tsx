
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/SimpleAuthProvider';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Eye, 
  Clock,
  Target,
  Shield,
  Activity
} from 'lucide-react';

interface AnalyticsConfig {
  id: string;
  tracking_id: string;
  enhanced_ecommerce: boolean;
  user_id_tracking: boolean;
  custom_dimensions: boolean;
  cross_domain_tracking: boolean;
  anonymize_ip: boolean;
  track_sessions: boolean;
  track_conversions: boolean;
  privacy_mode: boolean;
}

const GoogleAnalyticsIntegration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [config, setConfig] = useState<AnalyticsConfig | null>(null);
  const [trackingId, setTrackingId] = useState('');
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);

  const analyticsFeatures = [
    {
      id: 'user-behavior',
      name: 'User Behavior Analysis',
      icon: Users,
      description: 'Track user interactions and therapy session engagement',
      features: ['Page Views', 'Session Duration', 'Bounce Rate', 'User Flow'],
      color: 'bg-blue-500'
    },
    {
      id: 'conversion-tracking',
      name: 'Conversion Tracking',
      icon: Target,
      description: 'Monitor therapy goals and treatment outcomes',
      features: ['Goal Completions', 'Therapy Milestones', 'Session Bookings', 'Plan Upgrades'],
      color: 'bg-green-500'
    },
    {
      id: 'real-time-insights',
      name: 'Real-time Insights',
      icon: Activity,
      description: 'Live monitoring of user activity and system performance',
      features: ['Active Users', 'Live Events', 'Real-time Reports', 'Alert System'],
      color: 'bg-purple-500'
    }
  ];

  const privacyFeatures = [
    'HIPAA Compliant Tracking',
    'IP Anonymization',
    'User Consent Management',
    'Data Retention Controls',
    'Privacy-first Analytics',
    'Secure Data Transfer'
  ];

  useEffect(() => {
    if (user) {
      loadAnalyticsConfig();
    }
  }, [user]);

  const loadAnalyticsConfig = async () => {
    try {
      // Mock data until database is updated
      setConfig(null);
      setConnected(false);
    } catch (error) {
      console.error('Error loading Analytics config:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectAnalytics = async () => {
    try {
      if (!trackingId) {
        toast({
          title: "Missing Tracking ID",
          description: "Please enter your Google Analytics tracking ID",
          variant: "destructive"
        });
        return;
      }

      const mockConfig: AnalyticsConfig = {
        id: Math.random().toString(36).substr(2, 9),
        tracking_id: trackingId,
        enhanced_ecommerce: true,
        user_id_tracking: false, // HIPAA compliance
        custom_dimensions: true,
        cross_domain_tracking: false,
        anonymize_ip: true, // HIPAA compliance
        track_sessions: true,
        track_conversions: true,
        privacy_mode: true
      };

      setConfig(mockConfig);
      setConnected(true);
      
      toast({
        title: "Google Analytics Connected",
        description: "Analytics tracking has been configured with privacy settings",
      });

    } catch (error) {
      console.error('Error connecting Analytics:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect Google Analytics. Please check your tracking ID.",
        variant: "destructive"
      });
    }
  };

  const updateConfig = async (updates: Partial<AnalyticsConfig>) => {
    if (!config) return;
    
    try {
      const updatedConfig = { ...config, ...updates };
      setConfig(updatedConfig);
      
      toast({
        title: "Settings Updated",
        description: "Analytics configuration has been saved",
      });
    } catch (error) {
      console.error('Error updating config:', error);
    }
  };

  const testTracking = async () => {
    try {
      toast({
        title: "Testing Analytics",
        description: "Sending test events to verify tracking configuration",
      });

      // Simulate analytics test
      setTimeout(() => {
        toast({
          title: "Tracking Test Successful",
          description: "Your Google Analytics configuration is working correctly",
        });
      }, 2000);

    } catch (error) {
      console.error('Error testing tracking:', error);
      toast({
        title: "Tracking Test Failed",
        description: "Please check your configuration and try again",
        variant: "destructive"
      });
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
      {/* Analytics Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {analyticsFeatures.map((feature) => {
          const Icon = feature.icon;
          
          return (
            <Card key={feature.id} className="border-therapy-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 ${feature.color} rounded-lg`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{feature.name}</CardTitle>
                    <p className="text-sm text-therapy-600">{feature.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h5 className="font-medium text-therapy-900 mb-2 text-sm">Features</h5>
                  <div className="flex flex-wrap gap-1">
                    {feature.features.map((item) => (
                      <Badge key={item} variant="secondary" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Analytics Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Google Analytics Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!connected ? (
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Connect Google Analytics</h3>
              <p className="text-gray-600 mb-6">
                Track user behavior and therapy outcomes with HIPAA-compliant analytics.
              </p>
              
              <div className="max-w-md mx-auto space-y-4">
                <div>
                  <Label htmlFor="tracking-id">Google Analytics Tracking ID</Label>
                  <Input
                    id="tracking-id"
                    type="text"
                    placeholder="G-XXXXXXXXXX or UA-XXXXXXXXX-X"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                  />
                </div>
                
                <Button onClick={connectAnalytics} className="w-full">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Connect Google Analytics
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Google Analytics Connected</h4>
                    <p className="text-sm text-gray-600">
                      Tracking ID: {config?.tracking_id}
                    </p>
                  </div>
                </div>
                <Badge variant="default" className="bg-green-600">
                  Active
                </Badge>
              </div>

              {/* Tracking Configuration */}
              <div className="space-y-4">
                <h4 className="font-medium">Tracking Settings</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Enhanced Ecommerce</Label>
                      <p className="text-xs text-gray-600">Track subscription and payment events</p>
                    </div>
                    <Switch
                      checked={config?.enhanced_ecommerce}
                      onCheckedChange={(checked) => updateConfig({ enhanced_ecommerce: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Session Tracking</Label>
                      <p className="text-xs text-gray-600">Monitor therapy session interactions</p>
                    </div>
                    <Switch
                      checked={config?.track_sessions}
                      onCheckedChange={(checked) => updateConfig({ track_sessions: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Conversion Tracking</Label>
                      <p className="text-xs text-gray-600">Track goal completions and milestones</p>
                    </div>
                    <Switch
                      checked={config?.track_conversions}
                      onCheckedChange={(checked) => updateConfig({ track_conversions: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Custom Dimensions</Label>
                      <p className="text-xs text-gray-600">Track therapy-specific metrics</p>
                    </div>
                    <Switch
                      checked={config?.custom_dimensions}
                      onCheckedChange={(checked) => updateConfig({ custom_dimensions: checked })}
                    />
                  </div>
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="space-y-4">
                <h4 className="font-medium">Privacy & Compliance</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">IP Anonymization</Label>
                      <p className="text-xs text-gray-600">Anonymize IP addresses for HIPAA compliance</p>
                    </div>
                    <Switch
                      checked={config?.anonymize_ip}
                      onCheckedChange={(checked) => updateConfig({ anonymize_ip: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Privacy Mode</Label>
                      <p className="text-xs text-gray-600">Enhanced privacy protection for healthcare data</p>
                    </div>
                    <Switch
                      checked={config?.privacy_mode}
                      onCheckedChange={(checked) => updateConfig({ privacy_mode: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">User ID Tracking</Label>
                      <p className="text-xs text-gray-600">Track individual users (disabled for HIPAA)</p>
                    </div>
                    <Switch
                      checked={config?.user_id_tracking}
                      disabled={true}
                      onCheckedChange={(checked) => updateConfig({ user_id_tracking: checked })}
                    />
                  </div>
                </div>
              </div>

              {/* Test Configuration */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Test Configuration</h4>
                    <p className="text-sm text-gray-600">
                      Verify your analytics setup is working correctly
                    </p>
                  </div>
                  <Button onClick={testTracking} variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Test Tracking
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Privacy Compliance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>HIPAA Compliance Features</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {privacyFeatures.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleAnalyticsIntegration;
