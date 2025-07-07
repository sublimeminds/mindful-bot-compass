import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  MessageSquare, 
  Send, 
  Settings, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  MessageCircle,
  Bot,
  Smartphone
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
  messageCount?: number;
  responseTime?: string;
}

const MessagingPlatforms = () => {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      description: 'Connect your WhatsApp Business account for AI therapy sessions',
      icon: MessageSquare,
      status: 'connected',
      lastSync: '2 minutes ago',
      messageCount: 247,
      responseTime: '1.2s'
    },
    {
      id: 'telegram',
      name: 'Telegram Bot',
      description: 'Deploy a Telegram bot for secure therapy conversations',
      icon: Send,
      status: 'disconnected',
      messageCount: 0
    },
    {
      id: 'discord',
      name: 'Discord Community',
      description: 'Create therapy support communities on Discord',
      icon: MessageCircle,
      status: 'disconnected',
      messageCount: 0
    },
    {
      id: 'sms',
      name: 'SMS/Text Messages',
      description: 'Send therapy reminders and check-ins via SMS',
      icon: Smartphone,
      status: 'error',
      lastSync: '1 hour ago',
      messageCount: 156
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);

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

  const handleToggleIntegration = async (integrationId: string, currentStatus: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
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

  const handleTestConnection = async (integrationId: string) => {
    setIsLoading(true);
    
    try {
      // Simulate test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Connection Test",
        description: "Test message sent successfully! Check your platform for the test message.",
      });
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Could not send test message. Please check your configuration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messaging Platforms</h1>
          <p className="text-gray-600 mt-2">
            Connect messaging platforms to provide AI therapy support across multiple channels
          </p>
        </div>
        <Button onClick={() => window.location.reload()}>
          <Settings className="h-4 w-4 mr-2" />
          Refresh Status
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Connected</p>
                <p className="text-2xl font-bold text-green-600">
                  {integrations.filter(i => i.status === 'connected').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total Messages</p>
                <p className="text-2xl font-bold text-blue-600">
                  {integrations.reduce((sum, i) => sum + (i.messageCount || 0), 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Avg Response</p>
                <p className="text-2xl font-bold text-purple-600">1.2s</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">AI Accuracy</p>
                <p className="text-2xl font-bold text-orange-600">94.2%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integration Cards */}
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
                  <span className="text-sm font-medium">Status</span>
                  {getStatusBadge(integration.status)}
                </div>

                {integration.status !== 'disconnected' && (
                  <>
                    <Separator />
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Last Sync</p>
                        <p className="font-medium">{integration.lastSync}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Messages</p>
                        <p className="font-medium">{integration.messageCount || 0}</p>
                      </div>
                      {integration.responseTime && (
                        <>
                          <div>
                            <p className="text-gray-500">Response Time</p>
                            <p className="font-medium">{integration.responseTime}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Uptime</p>
                            <p className="font-medium">99.2%</p>
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
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleTestConnection(integration.id)}
                      disabled={integration.status !== 'connected' || isLoading}
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
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Setup */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Setup</CardTitle>
          <CardDescription>
            Get started with messaging platform integrations in minutes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <Input 
                id="webhook-url"
                value="https://your-app.com/api/webhooks/messaging"
                readOnly
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use this URL in your messaging platform webhook settings
              </p>
            </div>
            <div>
              <Label htmlFor="api-key">API Key</Label>
              <Input 
                id="api-key"
                type="password"
                value="sk-abc123..."
                readOnly
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">
                Your secure API key for authentication
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button>
              <Settings className="h-4 w-4 mr-2" />
              Open Integration Settings
            </Button>
            <Button variant="outline">
              View Documentation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessagingPlatforms;