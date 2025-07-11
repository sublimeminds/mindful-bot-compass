import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useIntegrations } from '@/hooks/useIntegrations';
import DashboardLayoutWithSidebar from '@/components/dashboard/DashboardLayoutWithSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, Search, Filter, CheckCircle, Settings, 
  Shield, Activity, Bell, Slack, Phone, MessageCircle, 
  Calendar, Video, AlertTriangle, Bot, Plus, RefreshCw,
  TestTube, Trash2, ExternalLink, Apple, Chrome
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Import setup wizards
import WhatsAppSetupWizard from './WhatsAppSetupWizard';
import TelegramSetupWizard from './TelegramSetupWizard';
import SlackSetupWizard from './SlackSetupWizard';
import ICalSetupWizard from './ICalSetupWizard';
import AppleHealthSetupWizard from './AppleHealthSetupWizard';

interface PlatformDefinition {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  features: string[];
  category: 'messaging' | 'productivity' | 'health' | 'calendar';
  crisisSupport: boolean;
  aiChatEnabled: boolean;
  setupComponent: React.ComponentType<any>;
}

const EnhancedIntegrationsPage = () => {
  const { user } = useAuth();
  const { integrations, loading, testIntegration, syncIntegration, deleteIntegration } = useIntegrations();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showSetupWizard, setShowSetupWizard] = useState<string | null>(null);

  const platformDefinitions: PlatformDefinition[] = [
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      description: 'AI therapy chat, crisis support, and session reminders via WhatsApp',
      icon: Phone,
      color: 'from-green-500 to-green-600',
      features: ['AI Therapy Chat', 'Crisis Support', 'Session Reminders', 'Mood Check-ins', 'Progress Updates'],
      category: 'messaging',
      crisisSupport: true,
      aiChatEnabled: true,
      setupComponent: WhatsAppSetupWizard
    },
    {
      id: 'telegram',
      name: 'Telegram',
      description: 'Secure, encrypted therapy conversations with end-to-end privacy',
      icon: MessageSquare,
      color: 'from-cyan-500 to-blue-500',
      features: ['Encrypted Therapy', 'Privacy First', 'Crisis Support', 'Secure Groups', 'Anonymous Sessions'],
      category: 'messaging',
      crisisSupport: true,
      aiChatEnabled: true,
      setupComponent: TelegramSetupWizard
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Workplace mental health support with anonymous therapy and wellness check-ins',
      icon: Slack,
      color: 'from-purple-500 to-indigo-500',
      features: ['Anonymous Therapy', 'Team Wellness', 'Break Reminders', 'Stress Alerts', 'Mental Health Resources'],
      category: 'productivity',
      crisisSupport: true,
      aiChatEnabled: true,
      setupComponent: SlackSetupWizard
    },
    {
      id: 'messenger',
      name: 'Facebook Messenger',
      description: 'Casual therapy conversations and community support through Messenger',
      icon: MessageCircle,
      color: 'from-blue-600 to-purple-600',
      features: ['Casual Therapy', 'Mood Tracking', 'Community Groups', 'Crisis Support', 'Daily Check-ins'],
      category: 'messaging',
      crisisSupport: true,
      aiChatEnabled: true,
      setupComponent: WhatsAppSetupWizard // Placeholder
    },
    {
      id: 'discord',
      name: 'Discord',
      description: 'Community-based mental health support with therapy groups and peer support',
      icon: MessageSquare,
      color: 'from-indigo-500 to-purple-500',
      features: ['Therapy Communities', 'Peer Support', 'Anonymous Chat', 'Crisis Bot', 'Group Challenges'],
      category: 'messaging',
      crisisSupport: true,
      aiChatEnabled: true,
      setupComponent: TelegramSetupWizard // Placeholder
    },
    {
      id: 'ical',
      name: 'Calendar Integration',
      description: 'Sync therapy sessions and wellness goals with your calendar apps',
      icon: Calendar,
      color: 'from-orange-500 to-red-500',
      features: ['Session Scheduling', 'Goal Deadlines', 'Wellness Reminders', 'Cross-platform Sync', 'Timezone Support'],
      category: 'calendar',
      crisisSupport: false,
      aiChatEnabled: false,
      setupComponent: ICalSetupWizard
    },
    {
      id: 'apple_health',
      name: 'Apple Health',
      description: 'Integrate with HealthKit for comprehensive wellness data and insights',
      icon: Apple,
      color: 'from-gray-600 to-gray-700',
      features: ['Health Data Sync', 'Mood Correlation', 'Activity Tracking', 'Sleep Analysis', 'Heart Rate Monitoring'],
      category: 'health',
      crisisSupport: false,
      aiChatEnabled: false,
      setupComponent: AppleHealthSetupWizard
    }
  ];

  const categories = ['All', 'messaging', 'productivity', 'health', 'calendar'];

  const filteredPlatforms = platformDefinitions.filter(platform => {
    const matchesSearch = platform.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         platform.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || platform.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getIntegrationStatus = (platformId: string) => {
    return integrations.find(i => i.platform_type === platformId);
  };

  const handleTestIntegration = async (integrationId: string) => {
    try {
      await testIntegration(integrationId);
    } catch (error) {
      console.error('Test failed:', error);
    }
  };

  const handleSyncIntegration = async (integrationId: string) => {
    try {
      await syncIntegration(integrationId);
    } catch (error) {
      console.error('Sync failed:', error);
    }
  };

  const handleDeleteIntegration = async (integrationId: string) => {
    if (confirm('Are you sure you want to remove this integration?')) {
      try {
        await deleteIntegration(integrationId);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const connectedCount = integrations.filter(i => i.is_active).length;

  if (loading) {
    return (
      <DashboardLayoutWithSidebar>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
            <p className="text-therapy-600 font-medium">Loading Integrations...</p>
          </div>
        </div>
      </DashboardLayoutWithSidebar>
    );
  }

  return (
    <DashboardLayoutWithSidebar>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Platform Integrations</h1>
            <p className="text-gray-600 mt-2">
              Connect your favorite platforms for seamless therapy support and wellness tracking
            </p>
          </div>
          <Badge className="bg-therapy-100 text-therapy-800">
            {connectedCount} Connected
          </Badge>
        </div>

        <Tabs defaultValue="available" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="available">
              <MessageSquare className="h-4 w-4 mr-2" />
              Available Integrations
            </TabsTrigger>
            <TabsTrigger value="connected">
              <CheckCircle className="h-4 w-4 mr-2" />
              Connected ({connectedCount})
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <Activity className="h-4 w-4 mr-2" />
              Usage Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available">
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search integrations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? "bg-therapy-600 hover:bg-therapy-700" : ""}
                  >
                    <Filter className="h-3 w-3 mr-1" />
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Integrations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlatforms.map((platform) => {
                const IconComponent = platform.icon;
                const existingIntegration = getIntegrationStatus(platform.id);
                
                return (
                  <Card key={platform.id} className="hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${platform.color} rounded-xl flex items-center justify-center`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {platform.crisisSupport && (
                            <Badge className="bg-red-100 text-red-800 text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Crisis Support
                            </Badge>
                          )}
                          {platform.aiChatEnabled && (
                            <Badge className="bg-blue-100 text-blue-800 text-xs">
                              <Bot className="h-3 w-3 mr-1" />
                              AI Chat
                            </Badge>
                          )}
                          {existingIntegration ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Connected
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              Not Connected
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardTitle className="text-xl text-therapy-600">{platform.name}</CardTitle>
                      <Badge variant="outline" className="w-fit text-xs capitalize">
                        {platform.category}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-600 text-sm">{platform.description}</p>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-700">Features:</h4>
                        <div className="space-y-1">
                          {platform.features.slice(0, 3).map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                              <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))}
                          {platform.features.length > 3 && (
                            <p className="text-xs text-gray-500">
                              +{platform.features.length - 3} more features
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4">
                        {existingIntegration ? (
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleTestIntegration(existingIntegration.id)}
                            >
                              <TestTube className="h-4 w-4 mr-1" />
                              Test
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleSyncIntegration(existingIntegration.id)}
                            >
                              <RefreshCw className="h-4 w-4 mr-1" />
                              Sync
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            onClick={() => setShowSetupWizard(platform.id)}
                            className="bg-therapy-600 hover:bg-therapy-700"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Connect
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-1" />
                          Configure
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="connected">
            <div className="space-y-4">
              {integrations.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Integrations Connected</h3>
                    <p className="text-gray-600 mb-4">
                      Connect your first integration to get started with platform-based therapy support.
                    </p>
                    <Button onClick={() => setShowSetupWizard('whatsapp')} className="bg-therapy-600 hover:bg-therapy-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Connect WhatsApp
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                integrations.map((integration) => {
                  const platform = platformDefinitions.find(p => p.id === integration.platform_type);
                  if (!platform) return null;

                  const IconComponent = platform.icon;
                  
                  return (
                    <Card key={integration.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 bg-gradient-to-r ${platform.color} rounded-xl flex items-center justify-center`}>
                              <IconComponent className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{platform.name}</h3>
                              <p className="text-sm text-gray-600">
                                Connected • Last sync: {integration.last_sync ? new Date(integration.last_sync).toLocaleDateString() : 'Never'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleTestIntegration(integration.id)}
                            >
                              <TestTube className="h-4 w-4 mr-1" />
                              Test
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleSyncIntegration(integration.id)}
                            >
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Sync
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteIntegration(integration.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Integration Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-therapy-600">{connectedCount}</div>
                    <div className="text-sm text-gray-600">Connected Platforms</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-therapy-600">
                      {integrations.reduce((acc, i) => acc + (i.crisis_escalation_enabled ? 1 : 0), 0)}
                    </div>
                    <div className="text-sm text-gray-600">Crisis-Enabled</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-therapy-600">
                      {integrations.filter(i => i.last_sync && new Date(i.last_sync) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length}
                    </div>
                    <div className="text-sm text-gray-600">Synced Today</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Setup Wizards */}
        {showSetupWizard && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  Setup {platformDefinitions.find(p => p.id === showSetupWizard)?.name}
                </h2>
                <Button variant="outline" onClick={() => setShowSetupWizard(null)}>
                  Close
                </Button>
              </div>
              {React.createElement(
                platformDefinitions.find(p => p.id === showSetupWizard)?.setupComponent || WhatsAppSetupWizard,
                { onComplete: () => setShowSetupWizard(null) }
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayoutWithSidebar>
  );
};

export default EnhancedIntegrationsPage;