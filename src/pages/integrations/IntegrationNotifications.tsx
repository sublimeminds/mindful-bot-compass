import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Bell, 
  Settings, 
  Smartphone, 
  Mail, 
  MessageSquare, 
  AlertTriangle, 
  Clock, 
  Users,
  Volume2,
  VolumeX,
  Calendar,
  Target,
  Zap,
  Shield
} from 'lucide-react';

interface NotificationChannel {
  id: string;
  name: string;
  icon: React.ElementType;
  enabled: boolean;
  priority: 'high' | 'medium' | 'low';
  description: string;
  settings?: {
    [key: string]: any;
  };
}

interface NotificationType {
  id: string;
  name: string;
  description: string;
  category: 'system' | 'integration' | 'crisis' | 'user';
  enabled: boolean;
  channels: string[];
  priority: 'critical' | 'high' | 'medium' | 'low';
}

const IntegrationNotifications = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('channels');
  const [isLoading, setIsLoading] = useState(false);

  const [channels, setChannels] = useState<NotificationChannel[]>([
    {
      id: 'push',
      name: 'Push Notifications',
      icon: Smartphone,
      enabled: true,
      priority: 'high',
      description: 'Real-time push notifications to mobile and desktop',
      settings: {
        sound: true,
        vibration: true,
        showPreview: true
      }
    },
    {
      id: 'email',
      name: 'Email',
      icon: Mail,
      enabled: true,
      priority: 'medium',
      description: 'Email notifications for important updates',
      settings: {
        digest: false,
        frequency: 'immediate'
      }
    },
    {
      id: 'sms',
      name: 'SMS',
      icon: MessageSquare,
      enabled: false,
      priority: 'high',
      description: 'SMS alerts for critical notifications',
      settings: {
        phoneNumber: '+1234567890'
      }
    },
    {
      id: 'webhook',
      name: 'Webhook',
      icon: Zap,
      enabled: true,
      priority: 'medium',
      description: 'HTTP webhooks for system integrations',
      settings: {
        url: 'https://api.example.com/webhooks/notifications',
        retries: 3
      }
    }
  ]);

  const [notificationTypes, setNotificationTypes] = useState<NotificationType[]>([
    {
      id: 'integration-connected',
      name: 'Integration Connected',
      description: 'When a new integration is successfully connected',
      category: 'integration',
      enabled: true,
      channels: ['push', 'email'],
      priority: 'medium'
    },
    {
      id: 'integration-failed',
      name: 'Integration Failed',
      description: 'When an integration connection fails or encounters errors',
      category: 'integration',
      enabled: true,
      channels: ['push', 'email', 'webhook'],
      priority: 'high'
    },
    {
      id: 'sync-completed',
      name: 'Data Sync Completed',
      description: 'When scheduled data synchronization completes',
      category: 'system',
      enabled: false,
      channels: ['push'],
      priority: 'low'
    },
    {
      id: 'crisis-alert',
      name: 'Crisis Alert',
      description: 'Critical alerts requiring immediate attention',
      category: 'crisis',
      enabled: true,
      channels: ['push', 'email', 'sms', 'webhook'],
      priority: 'critical'
    },
    {
      id: 'usage-threshold',
      name: 'Usage Threshold',
      description: 'When integration usage reaches defined thresholds',
      category: 'system',
      enabled: true,
      channels: ['email'],
      priority: 'medium'
    },
    {
      id: 'user-feedback',
      name: 'User Feedback',
      description: 'When users provide feedback on integrations',
      category: 'user',
      enabled: true,
      channels: ['email'],
      priority: 'low'
    }
  ]);

  const handleChannelToggle = (channelId: string) => {
    setChannels(prev => prev.map(channel =>
      channel.id === channelId 
        ? { ...channel, enabled: !channel.enabled }
        : channel
    ));
    
    toast({
      title: "Channel Updated",
      description: `${channels.find(c => c.id === channelId)?.name} has been ${channels.find(c => c.id === channelId)?.enabled ? 'disabled' : 'enabled'}.`,
    });
  };

  const handleNotificationToggle = (notificationId: string) => {
    setNotificationTypes(prev => prev.map(notification =>
      notification.id === notificationId 
        ? { ...notification, enabled: !notification.enabled }
        : notification
    ));
    
    toast({
      title: "Notification Updated",
      description: `${notificationTypes.find(n => n.id === notificationId)?.name} has been ${notificationTypes.find(n => n.id === notificationId)?.enabled ? 'disabled' : 'enabled'}.`,
    });
  };

  const handleTestNotification = async (channelId: string) => {
    setIsLoading(true);
    
    try {
      // Simulate sending test notification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Test Notification Sent",
        description: `Test notification sent via ${channels.find(c => c.id === channelId)?.name}. Check your device/inbox.`,
      });
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Failed to send test notification. Please check your configuration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">High</Badge>;
      case 'medium':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'system':
        return <Settings className="h-4 w-4" />;
      case 'integration':
        return <Zap className="h-4 w-4" />;
      case 'crisis':
        return <AlertTriangle className="h-4 w-4" />;
      case 'user':
        return <Users className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Integration Notifications</h1>
          <p className="text-gray-600 mt-2">
            Configure how and when you receive notifications about your integrations
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Shield className="h-4 w-4 mr-2" />
            Privacy Settings
          </Button>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Advanced Config
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Active Channels</p>
                <p className="text-2xl font-bold text-blue-600">
                  {channels.filter(c => c.enabled).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium">Critical Alerts</p>
                <p className="text-2xl font-bold text-red-600">
                  {notificationTypes.filter(n => n.priority === 'critical' && n.enabled).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Avg Response</p>
                <p className="text-2xl font-bold text-green-600">2.1s</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Delivery Rate</p>
                <p className="text-2xl font-bold text-purple-600">98.7%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="channels" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {channels.map((channel) => {
              const Icon = channel.icon;
              return (
                <Card key={channel.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-gray-100">
                          <Icon className="h-6 w-6 text-gray-700" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{channel.name}</CardTitle>
                          <CardDescription>{channel.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getPriorityBadge(channel.priority)}
                        {channel.enabled ? (
                          <Volume2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <VolumeX className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={channel.enabled}
                          onCheckedChange={() => handleChannelToggle(channel.id)}
                          disabled={isLoading}
                        />
                        <Label className="text-sm">
                          {channel.enabled ? 'Enabled' : 'Disabled'}
                        </Label>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleTestNotification(channel.id)}
                          disabled={!channel.enabled || isLoading}
                        >
                          Test
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={isLoading}
                        >
                          Configure
                        </Button>
                      </div>
                    </div>

                    {channel.enabled && channel.settings && (
                      <>
                        <Separator />
                        <div className="space-y-3">
                          <p className="text-sm font-medium text-gray-700">Channel Settings</p>
                          {Object.entries(channel.settings).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                              <span className="font-medium">
                                {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <div className="space-y-4">
            {notificationTypes.map((notification) => (
              <Card key={notification.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-gray-100">
                        {getCategoryIcon(notification.category)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{notification.name}</h3>
                        <p className="text-sm text-gray-600">{notification.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getPriorityBadge(notification.priority)}
                      <Switch 
                        checked={notification.enabled}
                        onCheckedChange={() => handleNotificationToggle(notification.id)}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Category</p>
                      <Badge variant="outline" className="capitalize">
                        {notification.category}
                      </Badge>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Channels</p>
                      <div className="flex space-x-1">
                        {notification.channels.map((channelId) => {
                          const channel = channels.find(c => c.id === channelId);
                          return channel ? (
                            <Badge key={channelId} variant="secondary" className="text-xs">
                              {channel.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Notification Schedule</span>
              </CardTitle>
              <CardDescription>
                Configure when notifications should be sent and quiet hours
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="quiet-start">Quiet Hours Start</Label>
                    <Input 
                      id="quiet-start" 
                      type="time" 
                      defaultValue="22:00"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="quiet-end">Quiet Hours End</Label>
                    <Input 
                      id="quiet-end" 
                      type="time" 
                      defaultValue="08:00"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="UTC-5">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                        <SelectItem value="UTC-7">Mountain Time (UTC-7)</SelectItem>
                        <SelectItem value="UTC-6">Central Time (UTC-6)</SelectItem>
                        <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                        <SelectItem value="UTC+0">Greenwich Mean Time (UTC+0)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="batch-frequency">Batch Frequency</Label>
                    <Select defaultValue="immediate">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate</SelectItem>
                        <SelectItem value="5min">Every 5 minutes</SelectItem>
                        <SelectItem value="15min">Every 15 minutes</SelectItem>
                        <SelectItem value="1hour">Every hour</SelectItem>
                        <SelectItem value="daily">Daily digest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Weekend Notifications</p>
                    <p className="text-sm text-gray-600">Receive notifications during weekends</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Emergency Override</p>
                    <p className="text-sm text-gray-600">Critical alerts bypass quiet hours</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button>Save Schedule</Button>
                <Button variant="outline">Reset to Default</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Templates</CardTitle>
              <CardDescription>
                Customize the content and format of your notification messages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="template-select">Template Type</Label>
                  <Select defaultValue="integration-connected">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="integration-connected">Integration Connected</SelectItem>
                      <SelectItem value="integration-failed">Integration Failed</SelectItem>
                      <SelectItem value="crisis-alert">Crisis Alert</SelectItem>
                      <SelectItem value="sync-completed">Sync Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="subject">Email Subject</Label>
                  <Input 
                    id="subject" 
                    defaultValue="New Integration Connected - {{integration_name}}"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="message">Message Content</Label>
                  <Textarea 
                    id="message"
                    rows={4}
                    defaultValue="Good news! Your {{integration_name}} integration has been successfully connected to TherapySync. You can now enjoy seamless data synchronization and enhanced therapy support."
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">Available Variables:</p>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <span>{"{{integration_name}}"}</span>
                  <span>{"{{user_name}}"}</span>
                  <span>{"{{timestamp}}"}</span>
                  <span>{"{{status}}"}</span>
                  <span>{"{{error_message}}"}</span>
                  <span>{"{{sync_count}}"}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button>Save Template</Button>
                <Button variant="outline">Preview</Button>
                <Button variant="outline">Reset</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegrationNotifications;