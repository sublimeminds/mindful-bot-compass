import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  Zap, 
  FileText, 
  Users, 
  Settings, 
  CheckCircle2, 
  AlertCircle, 
  Clock,
  Trello,
  Slack,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

interface ProductivityIntegration {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  status: 'connected' | 'disconnected' | 'error';
  category: 'calendar' | 'communication' | 'project' | 'automation';
  syncCount?: number;
  lastSync?: string;
  automationCount?: number;
}

const ProductivityTools = () => {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<ProductivityIntegration[]>([
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      description: 'Sync therapy sessions and reminders with your Google Calendar',
      icon: Calendar,
      status: 'connected',
      category: 'calendar',
      syncCount: 45,
      lastSync: '5 minutes ago',
      automationCount: 12
    },
    {
      id: 'microsoft-teams',
      name: 'Microsoft Teams',
      description: 'Enable therapy support in your Teams workspace',
      icon: Users,
      status: 'connected',
      category: 'communication',
      syncCount: 23,
      lastSync: '1 hour ago',
      automationCount: 8
    },
    {
      id: 'notion',
      name: 'Notion',
      description: 'Create therapy journals and track progress in Notion',
      icon: FileText,
      status: 'disconnected',
      category: 'project',
      syncCount: 0,
      automationCount: 0
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Get therapy check-ins and crisis alerts in Slack',
      icon: Slack,
      status: 'error',
      category: 'communication',
      syncCount: 67,
      lastSync: '3 hours ago',
      automationCount: 15
    },
    {
      id: 'trello',
      name: 'Trello',
      description: 'Organize therapy goals and activities with Trello boards',
      icon: Trello,
      status: 'disconnected',
      category: 'project',
      syncCount: 0,
      automationCount: 0
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Connect TherapySync with 5000+ apps via Zapier automations',
      icon: Zap,
      status: 'connected',
      category: 'automation',
      syncCount: 156,
      lastSync: '2 minutes ago',
      automationCount: 34
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
      case 'calendar':
        return 'bg-blue-100 text-blue-800';
      case 'communication':
        return 'bg-purple-100 text-purple-800';
      case 'project':
        return 'bg-orange-100 text-orange-800';
      case 'automation':
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
  const totalSyncs = integrations.reduce((sum, i) => sum + (i.syncCount || 0), 0);
  const totalAutomations = integrations.reduce((sum, i) => sum + (i.automationCount || 0), 0);

  const getIntegrationsByCategory = (category: string) => {
    return integrations.filter(i => i.category === category);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Productivity Tools</h1>
          <p className="text-gray-600 mt-2">
            Connect your favorite productivity apps to streamline your therapy workflow
          </p>
        </div>
        <Button>
          <Settings className="h-4 w-4 mr-2" />
          Manage All
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Connected Tools</p>
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
                <p className="text-sm font-medium">Total Syncs</p>
                <p className="text-2xl font-bold text-blue-600">{totalSyncs}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Automations</p>
                <p className="text-2xl font-bold text-purple-600">{totalAutomations}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Time Saved</p>
                <p className="text-2xl font-bold text-orange-600">4.2h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="project">Project Management</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
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

                    {integration.status !== 'disconnected' && (
                      <>
                        <Separator />
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Syncs</p>
                            <p className="font-medium">{integration.syncCount || 0}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Automations</p>
                            <p className="font-medium">{integration.automationCount || 0}</p>
                          </div>
                          {integration.lastSync && (
                            <>
                              <div className="col-span-2">
                                <p className="text-gray-500">Last Sync</p>
                                <p className="font-medium">{integration.lastSync}</p>
                              </div>
                            </>
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
                          {integration.status === 'connected' ? 'Enabled' : 'Disabled'}
                        </Label>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={isLoading}
                      >
                        Configure
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {['calendar', 'communication', 'project', 'automation'].map((category) => (
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
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ProductivityTools;