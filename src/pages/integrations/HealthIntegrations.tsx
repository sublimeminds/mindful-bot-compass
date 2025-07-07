import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Heart, 
  Activity, 
  Moon, 
  Smartphone, 
  Watch, 
  Database, 
  Settings, 
  CheckCircle2, 
  AlertCircle, 
  Clock,
  TrendingUp,
  Shield,
  Zap
} from 'lucide-react';

interface HealthIntegration {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  status: 'connected' | 'disconnected' | 'error';
  category: 'fitness' | 'medical' | 'sleep' | 'mental';
  dataPoints?: number;
  lastSync?: string;
  accuracy?: number;
  insights?: string[];
}

const HealthIntegrations = () => {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<HealthIntegration[]>([
    {
      id: 'apple-health',
      name: 'Apple Health',
      description: 'Sync health metrics, activity, and wellness data from Apple Health',
      icon: Heart,
      status: 'connected',
      category: 'fitness',
      dataPoints: 12847,
      lastSync: '3 minutes ago',
      accuracy: 94,
      insights: ['Activity patterns correlate with mood improvements', 'Heart rate variability suggests stress reduction']
    },
    {
      id: 'google-fit',
      name: 'Google Fit',
      description: 'Track fitness activities and health metrics via Google Fit',
      icon: Activity,
      status: 'connected',
      category: 'fitness',
      dataPoints: 8934,
      lastSync: '15 minutes ago',
      accuracy: 89,
      insights: ['Step count shows consistent improvement', 'Exercise frequency linked to better sleep']
    },
    {
      id: 'fitbit',
      name: 'Fitbit',
      description: 'Comprehensive health tracking including sleep and heart rate',
      icon: Watch,
      status: 'disconnected',
      category: 'fitness',
      dataPoints: 0,
      accuracy: 0,
      insights: []
    },
    {
      id: 'sleep-cycle',
      name: 'Sleep Cycle',
      description: 'Advanced sleep tracking and analysis integration',
      icon: Moon,
      status: 'connected',
      category: 'sleep',
      dataPoints: 456,
      lastSync: '6 hours ago',
      accuracy: 96,
      insights: ['Sleep quality improving over last 30 days', 'REM sleep patterns suggest reduced anxiety']
    },
    {
      id: 'ehr-system',
      name: 'EHR Integration',
      description: 'Connect with Electronic Health Records for comprehensive care',
      icon: Database,
      status: 'error',
      category: 'medical',
      dataPoints: 234,
      lastSync: '2 days ago',
      accuracy: 85,
      insights: ['Medical history shows stress-related patterns']
    },
    {
      id: 'mood-meter',
      name: 'Mood Tracking Device',
      description: 'Wearable device for continuous mood and stress monitoring',
      icon: Smartphone,
      status: 'disconnected',
      category: 'mental',
      dataPoints: 0,
      accuracy: 0,
      insights: []
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Connected</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">Disconnected</Badge>;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'fitness':
        return 'bg-blue-100 text-blue-800';
      case 'medical':
        return 'bg-red-100 text-red-800';
      case 'sleep':
        return 'bg-purple-100 text-purple-800';
      case 'mental':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleToggleIntegration = async (integrationId: string, currentStatus: string) => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIntegrations(prev => prev.map(integration => 
        integration.id === integrationId 
          ? { 
              ...integration, 
              status: currentStatus === 'connected' ? 'disconnected' : 'connected',
              lastSync: currentStatus !== 'connected' ? 'Just now' : integration.lastSync
            }
          : integration
      ));

      toast({
        title: "Integration Updated",
        description: `${integrations.find(i => i.id === integrationId)?.name} has been ${currentStatus === 'connected' ? 'disconnected' : 'connected'}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update integration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const connectedIntegrations = integrations.filter(i => i.status === 'connected');
  const totalDataPoints = integrations.reduce((sum, i) => sum + (i.dataPoints || 0), 0);
  const averageAccuracy = Math.round(
    integrations.filter(i => i.accuracy).reduce((sum, i) => sum + (i.accuracy || 0), 0) / 
    integrations.filter(i => i.accuracy).length
  );

  const getIntegrationsByCategory = (category: string) => {
    return integrations.filter(i => i.category === category);
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Health Integrations</h1>
          <p className="text-gray-600 mt-2">
            Connect health devices and apps to enhance your therapy with personalized insights
          </p>
        </div>
        <Button>
          <Shield className="h-4 w-4 mr-2" />
          Privacy Settings
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Connected Sources</p>
                <p className="text-2xl font-bold text-green-600">{connectedIntegrations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Data Points</p>
                <p className="text-2xl font-bold text-blue-600">{formatNumber(totalDataPoints)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Avg Accuracy</p>
                <p className="text-2xl font-bold text-purple-600">{averageAccuracy}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium">Health Insights</p>
                <p className="text-2xl font-bold text-red-600">
                  {integrations.reduce((sum, i) => sum + (i.insights?.length || 0), 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="fitness">Fitness</TabsTrigger>
          <TabsTrigger value="medical">Medical</TabsTrigger>
          <TabsTrigger value="sleep">Sleep</TabsTrigger>
          <TabsTrigger value="mental">Mental Health</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {integrations.map((integration) => {
              const Icon = integration.icon;
              return (
                <Card key={integration.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-gray-100">
                          <Icon className="h-6 w-6 text-gray-700" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{integration.name}</CardTitle>
                          <CardDescription>{integration.description}</CardDescription>
                        </div>
                      </div>
                      {getStatusIcon(integration.status)}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge className={getCategoryColor(integration.category)}>
                        {integration.category.charAt(0).toUpperCase() + integration.category.slice(1)}
                      </Badge>
                      {getStatusBadge(integration.status)}
                    </div>

                    {integration.status === 'connected' && (
                      <>
                        <Separator />
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Data Points</p>
                              <p className="font-medium">{formatNumber(integration.dataPoints || 0)}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Last Sync</p>
                              <p className="font-medium">{integration.lastSync}</p>
                            </div>
                          </div>
                          
                          {integration.accuracy && (
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-500">Data Accuracy</span>
                                <span className="font-medium">{integration.accuracy}%</span>
                              </div>
                              <Progress value={integration.accuracy} className="h-2" />
                            </div>
                          )}

                          {integration.insights && integration.insights.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">Recent Insights</p>
                              <div className="space-y-1">
                                {integration.insights.slice(0, 2).map((insight, index) => (
                                  <p key={index} className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                                    • {insight}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={integration.status === 'connected'}
                          onCheckedChange={() => handleToggleIntegration(integration.id, integration.status)}
                          disabled={isLoading}
                        />
                        <Label className="text-sm">
                          {integration.status === 'connected' ? 'Connected' : 'Disconnected'}
                        </Label>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={isLoading}
                        >
                          Configure
                        </Button>
                        {integration.status === 'connected' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            disabled={isLoading}
                          >
                            View Data
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {['fitness', 'medical', 'sleep', 'mental'].map((category) => (
          <TabsContent key={category} value={category} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {getIntegrationsByCategory(category).map((integration) => {
                const Icon = integration.icon;
                return (
                  <Card key={integration.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-gray-100">
                          <Icon className="h-6 w-6 text-gray-700" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{integration.name}</CardTitle>
                          <CardDescription>{integration.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Status</span>
                        {getStatusBadge(integration.status)}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            checked={integration.status === 'connected'}
                            onCheckedChange={() => handleToggleIntegration(integration.id, integration.status)}
                            disabled={isLoading}
                          />
                          <Label className="text-sm">Enable Integration</Label>
                        </div>
                        
                        <Button variant="outline" size="sm">
                          Setup
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Category-specific information */}
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">{category} Integration Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  {category === 'fitness' && (
                    <>
                      <p>• Track activity levels and correlate with mood patterns</p>
                      <p>• Monitor heart rate variability for stress insights</p>
                      <p>• Receive personalized exercise recommendations</p>
                    </>
                  )}
                  {category === 'medical' && (
                    <>
                      <p>• Integrate medical history for comprehensive care</p>
                      <p>• Share relevant health data with therapists</p>
                      <p>• Monitor medication effects on mental health</p>
                    </>
                  )}
                  {category === 'sleep' && (
                    <>
                      <p>• Analyze sleep quality impact on mental health</p>
                      <p>• Optimize therapy scheduling based on sleep patterns</p>
                      <p>• Receive sleep hygiene recommendations</p>
                    </>
                  )}
                  {category === 'mental' && (
                    <>
                      <p>• Continuous mood monitoring for early intervention</p>
                      <p>• Real-time stress level tracking</p>
                      <p>• Trigger crisis support when needed</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default HealthIntegrations;