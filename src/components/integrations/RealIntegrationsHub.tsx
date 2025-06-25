import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/components/SimpleAuthProvider';
import { useRealIntegrations } from '@/hooks/useRealIntegrations';
import { 
  MessageSquare, 
  Calendar, 
  Video, 
  Heart, 
  FileText, 
  AlertTriangle,
  Smartphone,
  Zap,
  Settings,
  Plus,
  ExternalLink,
  CreditCard,
  BarChart3,
  Workflow,
  Brain
} from 'lucide-react';

// Import existing integration components
import SMSIntegration from './SMSIntegration';
import CalendarIntegration from './CalendarIntegration';
import AdvancedHealthIntegration from './AdvancedHealthIntegration';
import VideoIntegration from './VideoIntegration';
import EHRIntegration from './EHRIntegration';
import CrisisIntegration from './CrisisIntegration';
import MobileIntegration from './MobileIntegration';
import SlackIntegration from './SlackIntegration';
import StripeIntegration from './StripeIntegration';
import GoogleAnalyticsIntegration from './GoogleAnalyticsIntegration';
import ZapierIntegration from './ZapierIntegration';
import AnthropicIntegration from './AnthropicIntegration';

const RealIntegrationsHub = () => {
  const { user } = useAuth();
  const {
    integrations,
    userIntegrations,
    loading,
    enableIntegration,
    disableIntegration,
    isIntegrationEnabled,
    getIntegrationSettings
  } = useRealIntegrations();

  const getIconForType = (type: string) => {
    switch (type) {
      case 'messaging':
      case 'sms':
        return MessageSquare;
      case 'calendar':
        return Calendar;
      case 'video':
        return Video;
      case 'health':
        return Heart;
      case 'ehr':
        return FileText;
      case 'crisis':
        return AlertTriangle;
      case 'mobile':
        return Smartphone;
      case 'slack':
        return MessageSquare;
      case 'payment':
        return CreditCard;
      case 'analytics':
        return BarChart3;
      case 'automation':
        return Workflow;
      case 'ai':
        return Brain;
      default:
        return Zap;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'messaging':
      case 'sms':
        return 'bg-blue-500';
      case 'calendar':
        return 'bg-green-500';
      case 'video':
        return 'bg-purple-500';
      case 'health':
        return 'bg-red-500';
      case 'ehr':
        return 'bg-orange-500';
      case 'crisis':
        return 'bg-yellow-500';
      case 'mobile':
        return 'bg-indigo-500';
      case 'slack':
        return 'bg-violet-500';
      case 'payment':
        return 'bg-emerald-500';
      case 'analytics':
        return 'bg-cyan-500';
      case 'automation':
        return 'bg-pink-500';
      case 'ai':
        return 'bg-rose-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getIntegrationsByType = (type: string) => {
    return integrations.filter(integration => integration.type === type);
  };

  const IntegrationCard = ({ integration }: { integration: any }) => {
    const Icon = getIconForType(integration.type);
    const isEnabled = isIntegrationEnabled(integration.id);
    const settings = getIntegrationSettings(integration.id);
    
    const handleToggle = async (enabled: boolean) => {
      if (enabled) {
        await enableIntegration(integration.id, { auto_enabled: true });
      } else {
        await disableIntegration(integration.id);
      }
    };
    
    return (
      <Card className="border-therapy-200 hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${getTypeColor(integration.type)}`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg text-therapy-900">{integration.name}</CardTitle>
                <p className="text-sm text-therapy-600">{integration.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={isEnabled ? "default" : "outline"} className="capitalize">
                {isEnabled ? 'Connected' : 'Available'}
              </Badge>
              <Switch
                checked={isEnabled}
                onCheckedChange={handleToggle}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex justify-between items-center">
            <Badge variant="secondary" className="text-xs">
              {integration.type}
            </Badge>
            {isEnabled && (
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Configure</span>
              </Button>
            )}
          </div>
          {isEnabled && Object.keys(settings).length > 0 && (
            <div className="mt-2 text-xs text-gray-600">
              <p>Last configured: {new Date().toLocaleDateString()}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-600"></div>
      </div>
    );
  }

  const enabledCount = userIntegrations.filter(ui => ui.is_enabled).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-therapy-900">Integrations Hub</h1>
          <p className="text-therapy-600 mt-2">
            Connect your favorite platforms and enhance your therapy experience
          </p>
        </div>
        <Badge variant="outline" className="text-therapy-600 border-therapy-300">
          <Zap className="h-4 w-4 mr-1" />
          {enabledCount} Active
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-therapy-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Messaging</p>
                <p className="text-2xl font-bold">{getIntegrationsByType('messaging').length + getIntegrationsByType('sms').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-therapy-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Payment</p>
                <p className="text-2xl font-bold">{getIntegrationsByType('payment').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-therapy-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">AI</p>
                <p className="text-2xl font-bold">{getIntegrationsByType('ai').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-therapy-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Workflow className="h-5 w-5 text-pink-500" />
              <div>
                <p className="text-sm font-medium">Automation</p>
                <p className="text-2xl font-bold">{getIntegrationsByType('automation').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integration Tabs */}
      <Tabs defaultValue="messaging" className="space-y-6">
        <TabsList className="grid w-full grid-cols-12">
          <TabsTrigger value="messaging">
            <MessageSquare className="h-4 w-4 mr-2" />
            Messaging
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <Calendar className="h-4 w-4 mr-2" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="health">
            <Heart className="h-4 w-4 mr-2" />
            Health
          </TabsTrigger>
          <TabsTrigger value="video">
            <Video className="h-4 w-4 mr-2" />
            Video
          </TabsTrigger>
          <TabsTrigger value="ehr">
            <FileText className="h-4 w-4 mr-2" />
            EHR
          </TabsTrigger>
          <TabsTrigger value="mobile">
            <Smartphone className="h-4 w-4 mr-2" />
            Mobile
          </TabsTrigger>
          <TabsTrigger value="slack">
            <MessageSquare className="h-4 w-4 mr-2" />
            Slack
          </TabsTrigger>
          <TabsTrigger value="payment">
            <CreditCard className="h-4 w-4 mr-2" />
            Payment
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="automation">
            <Workflow className="h-4 w-4 mr-2" />
            Automation
          </TabsTrigger>
          <TabsTrigger value="ai">
            <Brain className="h-4 w-4 mr-2" />
            AI
          </TabsTrigger>
          <TabsTrigger value="crisis">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Crisis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messaging" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getIntegrationsByType('messaging').map(integration => (
              <IntegrationCard key={integration.id} integration={integration} />
            ))}
            {getIntegrationsByType('sms').map(integration => (
              <IntegrationCard key={integration.id} integration={integration} />
            ))}
          </div>
          <SMSIntegration />
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <StripeIntegration />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <GoogleAnalyticsIntegration />
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <ZapierIntegration />
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <AnthropicIntegration />
        </TabsContent>

        {/* Keep existing tabs */}
        <TabsContent value="calendar" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getIntegrationsByType('calendar').map(integration => (
              <IntegrationCard key={integration.id} integration={integration} />
            ))}
          </div>
          <CalendarIntegration />
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getIntegrationsByType('health').map(integration => (
              <IntegrationCard key={integration.id} integration={integration} />
            ))}
          </div>
          <AdvancedHealthIntegration />
        </TabsContent>

        <TabsContent value="video" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getIntegrationsByType('video').map(integration => (
              <IntegrationCard key={integration.id} integration={integration} />
            ))}
          </div>
          <VideoIntegration />
        </TabsContent>

        <TabsContent value="ehr" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getIntegrationsByType('ehr').map(integration => (
              <IntegrationCard key={integration.id} integration={integration} />
            ))}
          </div>
          <EHRIntegration />
        </TabsContent>

        <TabsContent value="mobile" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getIntegrationsByType('mobile').map(integration => (
              <IntegrationCard key={integration.id} integration={integration} />
            ))}
          </div>
          <MobileIntegration />
        </TabsContent>

        <TabsContent value="slack" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getIntegrationsByType('slack').map(integration => (
              <IntegrationCard key={integration.id} integration={integration} />
            ))}
          </div>
          <SlackIntegration />
        </TabsContent>

        <TabsContent value="crisis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getIntegrationsByType('crisis').map(integration => (
              <IntegrationCard key={integration.id} integration={integration} />
            ))}
          </div>
          <CrisisIntegration />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RealIntegrationsHub;
