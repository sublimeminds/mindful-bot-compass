
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/SimpleAuthProvider';
import { 
  MessageSquare, 
  calendar, 
  Video, 
  Heart, 
  FileText, 
  AlertTriangle,
  mobile,
  Zap,
  Settings,
  Plus,
  ExternalLink
} from 'lucide-react';
import EnhancedAPIManagement from './EnhancedAPIManagement';
import SMSIntegration from './SMSIntegration';
import CalendarIntegration from './CalendarIntegration';
import AdvancedHealthIntegration from './AdvancedHealthIntegration';
import VideoIntegration from './VideoIntegration';
import EHRIntegration from './EHRIntegration';
import CrisisIntegration from './CrisisIntegration';
import MobileIntegration from './MobileIntegration';

interface Integration {
  id: string;
  name: string;
  type: string;
  description: string;
  is_active: boolean;
  configuration: any;
}

interface UserIntegration {
  id: string;
  integration_id: string;
  is_enabled: boolean;
  settings: any;
}

const IntegrationsHub = () => {
  const { user } = useAuth();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [userIntegrations, setUserIntegrations] = useState<UserIntegration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadIntegrations();
      loadUserIntegrations();
    }
  }, [user]);

  const loadIntegrations = async () => {
    try {
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setIntegrations(data || []);
    } catch (error) {
      console.error('Error loading integrations:', error);
    }
  };

  const loadUserIntegrations = async () => {
    try {
      // Mock data until database types are updated
      setUserIntegrations([]);
    } catch (error) {
      console.error('Error loading user integrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'messaging':
      case 'sms':
        return MessageSquare;
      case 'calendar':
        return calendar;
      case 'video':
        return Video;
      case 'health':
        return Heart;
      case 'ehr':
        return FileText;
      case 'crisis':
        return AlertTriangle;
      case 'mobile':
        return mobile;
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
      default:
        return 'bg-gray-500';
    }
  };

  const isIntegrationEnabled = (integrationId: string) => {
    return userIntegrations.some(ui => ui.integration_id === integrationId && ui.is_enabled);
  };

  const getIntegrationsByType = (type: string) => {
    return integrations.filter(integration => integration.type === type);
  };

  const IntegrationCard = ({ integration }: { integration: Integration }) => {
    const Icon = getIconForType(integration.type);
    const isEnabled = isIntegrationEnabled(integration.id);
    
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
            <Badge variant={isEnabled ? "default" : "outline"} className="capitalize">
              {isEnabled ? 'Connected' : 'Available'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex justify-between items-center">
            <Badge variant="secondary" className="text-xs">
              {integration.type}
            </Badge>
            <Button 
              variant={isEnabled ? "outline" : "default"}
              size="sm"
              className="flex items-center space-x-2"
            >
              {isEnabled ? (
                <>
                  <Settings className="h-4 w-4" />
                  <span>Configure</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>Connect</span>
                </>
              )}
            </Button>
          </div>
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
          {userIntegrations.filter(ui => ui.is_enabled).length} Active
        </Badge>
      </div>

      {/* Integration Tabs */}
      <Tabs defaultValue="messaging" className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="messaging">
            <MessageSquare className="h-4 w-4 mr-2" />
            Messaging
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <calendar className="h-4 w-4 mr-2" />
            calendar
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
            <mobile className="h-4 w-4 mr-2" />
            Mobile
          </TabsTrigger>
          <TabsTrigger value="api">
            <Zap className="h-4 w-4 mr-2" />
            API
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

        <TabsContent value="api" className="space-y-4">
          <EnhancedAPIManagement />
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

export default IntegrationsHub;
