import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import DashboardLayoutWithSidebar from '@/components/dashboard/DashboardLayoutWithSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, Zap, Webhook, Smartphone, Search, Filter,
  CheckCircle, Settings, Shield, Globe, Activity, Bell,
  Slack, Users, Phone, MessageCircle, Calendar, Video,
  AlertTriangle, Heart, Mail, Headphones, Bot
} from 'lucide-react';
import { EnhancedNotificationService } from '@/services/enhancedNotificationService';
import { useToast } from '@/hooks/use-toast';

interface PlatformIntegration {
  id: string;
  name: string;
  type: string;
  description: string;
  icon: React.ElementType;
  color: string;
  connected: boolean;
  features: string[];
  category: 'messaging' | 'productivity' | 'health' | 'entertainment';
  crisisSupport: boolean;
  aiChatEnabled: boolean;
  notificationTypes: string[];
}

const Integrations = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [connectedIntegrations, setConnectedIntegrations] = useState<Record<string, boolean>>({});
  const [notificationSettings, setNotificationSettings] = useState<Record<string, boolean>>({});
  const [pushEnabled, setPushEnabled] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }
    
    if (user) {
      initializeIntegrations();
      checkPushNotificationStatus();
    }
  }, [user, loading, navigate]);

  const initializeIntegrations = async () => {
    try {
      const integrations = await EnhancedNotificationService.getUserIntegrations(user!.id);
      const connected = integrations.reduce((acc, integration) => {
        acc[integration.platform_type] = integration.is_active;
        return acc;
      }, {} as Record<string, boolean>);
      setConnectedIntegrations(connected);
    } catch (error) {
      console.error('Error loading integrations:', error);
    }
  };

  const checkPushNotificationStatus = () => {
    if ('Notification' in window) {
      setPushEnabled(Notification.permission === 'granted');
    }
  };

  const handleEnablePushNotifications = async () => {
    const granted = await EnhancedNotificationService.requestPermission();
    if (granted) {
      const subscribed = await EnhancedNotificationService.subscribeToPush(user!.id);
      if (subscribed) {
        setPushEnabled(true);
        toast({
          title: "Push Notifications Enabled",
          description: "You'll now receive real-time notifications for therapy sessions, goals, and crisis support.",
        });
      }
    } else {
      toast({
        title: "Permission Denied",
        description: "Please enable notifications in your browser settings to receive alerts.",
        variant: "destructive"
      });
    }
  };

  const handleToggleIntegration = async (platform: string) => {
    const isCurrentlyConnected = connectedIntegrations[platform];
    
    if (!isCurrentlyConnected) {
      // Redirect to OAuth or setup flow
      window.open(`/integrations/setup/${platform}`, '_blank');
    } else {
      // Disconnect integration
      setConnectedIntegrations(prev => ({
        ...prev,
        [platform]: false
      }));
      
      toast({
        title: "Integration Disconnected",
        description: `${platform} has been disconnected from your account.`,
      });
    }
  };

  const integrations: PlatformIntegration[] = [
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      type: 'whatsapp',
      description: 'Get therapy support, mood check-ins, and crisis alerts directly in WhatsApp. AI therapists available 24/7.',
      icon: Phone,
      color: 'from-green-500 to-green-600',
      connected: connectedIntegrations.whatsapp || false,
      features: ['AI Therapy Chat', 'Crisis Support', 'Mood Check-ins', 'Session Reminders', 'Progress Updates'],
      category: 'messaging',
      crisisSupport: true,
      aiChatEnabled: true,
      notificationTypes: ['crisis', 'therapy', 'progress', 'community']
    },
    {
      id: 'slack',
      name: 'Slack',
      type: 'slack',
      description: 'Workplace mental health support with anonymous therapy, wellness check-ins, and team mood tracking.',
      icon: Slack,
      color: 'from-purple-500 to-indigo-500',
      connected: connectedIntegrations.slack || false,
      features: ['Anonymous Therapy', 'Team Wellness', 'Break Reminders', 'Stress Alerts', 'Mental Health Resources'],
      category: 'productivity',
      crisisSupport: true,
      aiChatEnabled: true,
      notificationTypes: ['therapy', 'administrative', 'integration']
    },
    {
      id: 'teams',
      name: 'Microsoft Teams',
      type: 'teams',
      description: 'Integrate therapy sessions as Teams meetings, get wellness reminders, and access mental health support.',
      icon: Video,
      color: 'from-blue-500 to-blue-600',
      connected: connectedIntegrations.teams || false,
      features: ['Therapy Meetings', 'Calendar Integration', 'Status Updates', 'Crisis Escalation', 'Team Check-ins'],
      category: 'productivity',
      crisisSupport: true,
      aiChatEnabled: true,
      notificationTypes: ['therapy', 'administrative', 'integration']
    },
    {
      id: 'messenger',
      name: 'Facebook Messenger',
      type: 'messenger',
      description: 'Casual therapy conversations, mood tracking, and community support through Messenger.',
      icon: MessageCircle,
      color: 'from-blue-600 to-purple-600',
      connected: connectedIntegrations.messenger || false,
      features: ['Casual Therapy', 'Mood Tracking', 'Community Groups', 'Crisis Support', 'Daily Check-ins'],
      category: 'messaging',
      crisisSupport: true,
      aiChatEnabled: true,
      notificationTypes: ['therapy', 'community', 'progress']
    },
    {
      id: 'discord',
      name: 'Discord',
      type: 'discord',
      description: 'Community-based mental health support with therapy groups, peer support, and crisis intervention.',
      icon: MessageSquare,
      color: 'from-indigo-500 to-purple-500',
      connected: connectedIntegrations.discord || false,
      features: ['Therapy Communities', 'Peer Support', 'Anonymous Chat', 'Crisis Bot', 'Group Challenges'],
      category: 'messaging',
      crisisSupport: true,
      aiChatEnabled: true,
      notificationTypes: ['community', 'therapy', 'crisis']
    },
    {
      id: 'telegram',
      name: 'Telegram',
      type: 'telegram',  
      description: 'Secure, encrypted therapy conversations with end-to-end privacy and crisis support.',
      icon: MessageSquare,
      color: 'from-cyan-500 to-blue-500',
      connected: connectedIntegrations.telegram || false,
      features: ['Encrypted Therapy', 'Privacy First', 'Crisis Support', 'Secure Groups', 'Anonymous Sessions'],
      category: 'messaging',
      crisisSupport: true,
      aiChatEnabled: true,
      notificationTypes: ['therapy', 'crisis', 'progress']
    },
    {
      id: 'signal',
      name: 'Signal',
      type: 'signal',
      description: 'Ultra-private therapy support with Signal\'s industry-leading encryption and security.',
      icon: Shield,
      color: 'from-gray-600 to-gray-700',
      connected: connectedIntegrations.signal || false,
      features: ['Maximum Privacy', 'Encrypted Chat', 'Anonymous Support', 'Crisis Help', 'Secure Groups'],
      category: 'messaging',
      crisisSupport: true,
      aiChatEnabled: true,
      notificationTypes: ['therapy', 'crisis']
    }
  ];

  const categories = ['All', 'messaging', 'productivity', 'health', 'entertainment'];

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || integration.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const connectedCount = Object.values(connectedIntegrations).filter(Boolean).length;

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

  if (!user) {
    return null;
  }

  return (
    <DashboardLayoutWithSidebar>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Platform Integrations</h1>
            <p className="text-gray-600 mt-2">
              Connect your favorite platforms for seamless therapy support, crisis management, and AI chat integration
            </p>
          </div>
          <Badge className="bg-therapy-100 text-therapy-800">
            {connectedCount} Connected
          </Badge>
        </div>

        <Tabs defaultValue="integrations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="integrations">
              <MessageSquare className="h-4 w-4 mr-2" />
              Platform Integrations
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notification Settings
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <Activity className="h-4 w-4 mr-2" />
              Usage Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="integrations">
            {/* Push Notifications Card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Push Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Receive real-time alerts for therapy sessions, goals, and crisis support
                    </p>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${pushEnabled ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <span className="text-sm font-medium">
                        {pushEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                  <Button 
                    onClick={handleEnablePushNotifications}
                    disabled={pushEnabled}
                    className="bg-therapy-600 hover:bg-therapy-700"
                  >
                    {pushEnabled ? 'Enabled' : 'Enable Notifications'}
                  </Button>
                </div>
              </CardContent>
            </Card>

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
              {filteredIntegrations.map((integration) => {
                const IconComponent = integration.icon;
                
                return (
                  <Card key={integration.id} className="hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${integration.color} rounded-xl flex items-center justify-center`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {integration.crisisSupport && (
                            <Badge className="bg-red-100 text-red-800 text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Crisis Support
                            </Badge>
                          )}
                          {integration.aiChatEnabled && (
                            <Badge className="bg-blue-100 text-blue-800 text-xs">
                              <Bot className="h-3 w-3 mr-1" />
                              AI Chat
                            </Badge>
                          )}
                          <Switch
                            checked={integration.connected}
                            onCheckedChange={() => handleToggleIntegration(integration.type)}
                          />
                        </div>
                      </div>
                      <CardTitle className="text-xl text-therapy-600">{integration.name}</CardTitle>
                      <Badge variant="outline" className="w-fit text-xs capitalize">
                        {integration.category}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-600 text-sm">{integration.description}</p>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-700">Features:</h4>
                        <div className="space-y-1">
                          {integration.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                              <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4">
                        <div className="flex items-center gap-2">
                          {integration.connected ? (
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

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <p className="text-gray-600">Configure how and when you receive notifications across all platforms</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { type: 'crisis', label: 'Crisis Alerts', description: 'Immediate notifications for crisis situations', priority: 'High' },
                  { type: 'therapy', label: 'Therapy Sessions', description: 'Reminders and session-related notifications', priority: 'High' },
                  { type: 'progress', label: 'Progress Updates', description: 'Goal achievements and milestone celebrations', priority: 'Medium' },
                  { type: 'community', label: 'Community Activity', description: 'Discussion replies and peer support messages', priority: 'Medium' },
                  { type: 'integration', label: 'Integration Updates', description: 'Platform connections and sync notifications', priority: 'Low' },
                  { type: 'administrative', label: 'Administrative', description: 'Billing, account, and system notifications', priority: 'Low' }
                ].map((notificationType) => (
                  <div key={notificationType.type} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{notificationType.label}</h4>
                      <p className="text-sm text-gray-600">{notificationType.description}</p>
                      <Badge className={`mt-1 text-xs ${
                        notificationType.priority === 'High' ? 'bg-red-100 text-red-800' :
                        notificationType.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {notificationType.priority} Priority
                      </Badge>
                    </div>
                    <Switch
                      checked={notificationSettings[notificationType.type] !== false}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({
                        ...prev,
                        [notificationType.type]: checked
                      }))}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Messages Sent', value: '127', icon: MessageSquare, color: 'from-blue-500 to-indigo-500' },
                { label: 'Crisis Interventions', value: '3', icon: AlertTriangle, color: 'from-red-500 to-pink-500' },
                { label: 'Platform Usage', value: '89%', icon: Activity, color: 'from-green-500 to-emerald-500' },
                { label: 'Response Time Avg', value: '2.3s', icon: Zap, color: 'from-purple-500 to-violet-500' }
              ].map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                        <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayoutWithSidebar>
  );
};

export default Integrations;