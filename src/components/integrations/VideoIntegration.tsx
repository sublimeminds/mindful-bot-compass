
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/SimpleAuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { 
  Video, 
  Calendar, 
  Clock, 
  Shield, 
  Settings,
  ExternalLink,
  Camera,
  CameraOff
} from 'lucide-react';

interface VideoSettings {
  auto_record_sessions: boolean;
  video_quality: string;
  audio_only_fallback: boolean;
  background_blur: boolean;
  waiting_room_enabled: boolean;
  session_reminders: boolean;
}

const VideoIntegration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<VideoSettings>({
    auto_record_sessions: false,
    video_quality: 'hd',
    audio_only_fallback: true,
    background_blur: true,
    waiting_room_enabled: true,
    session_reminders: true
  });
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const videoPlatforms = [
    {
      id: 'zoom',
      name: 'Zoom',
      icon: Video,
      description: 'Professional video conferencing with recording capabilities',
      features: ['HD Video', 'Screen Sharing', 'Recording', 'Waiting Room']
    },
    {
      id: 'teams',
      name: 'Microsoft Teams',
      icon: Video,
      description: 'Enterprise-grade video meetings with security features',
      features: ['End-to-End Encryption', 'Calendar Integration', 'Chat', 'Recording']
    }
  ];

  useEffect(() => {
    if (user) {
      loadVideoIntegrations();
    }
  }, [user]);

  const loadVideoIntegrations = async () => {
    try {
      const { data, error } = await supabase
        .from('user_integrations')
        .select('*, integrations(*)')
        .eq('user_id', user?.id)
        .eq('integrations.type', 'video');

      if (error) throw error;

      const connected = data?.filter(integration => integration.is_enabled)
        .map(integration => integration.integrations?.name || '') || [];
      
      setConnectedPlatforms(connected);

      // Load settings from the first connected platform
      if (data && data.length > 0 && data[0].settings) {
        setSettings({ ...settings, ...(data[0].settings as Partial<VideoSettings>) });
      }
    } catch (error) {
      console.error('Error loading video integrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectPlatform = async (platformId: string) => {
    try {
      const { data: integration, error: integrationError } = await supabase
        .from('integrations')
        .select('id')
        .eq('type', 'video')
        .eq('name', platformId === 'zoom' ? 'Zoom' : 'Microsoft Teams')
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

      setConnectedPlatforms([...connectedPlatforms, platformId === 'zoom' ? 'Zoom' : 'Microsoft Teams']);
      
      toast({
        title: "Platform Connected",
        description: `${platformId === 'zoom' ? 'Zoom' : 'Microsoft Teams'} has been connected successfully`,
      });

    } catch (error) {
      console.error('Error connecting platform:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to the video platform. Please try again.",
        variant: "destructive"
      });
    }
  };

  const updateSettings = async (newSettings: Partial<VideoSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);

    try {
      const { data: integrations } = await supabase
        .from('integrations')
        .select('id')
        .eq('type', 'video');

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
        description: "Your video preferences have been saved",
      });
    } catch (error) {
      console.error('Error updating video settings:', error);
      toast({
        title: "Error",
        description: "Failed to update settings",
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
      {/* Platform Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {videoPlatforms.map((platform) => {
          const Icon = platform.icon;
          const isConnected = connectedPlatforms.includes(platform.name);
          
          return (
            <Card key={platform.id} className="border-therapy-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Icon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{platform.name}</CardTitle>
                      <p className="text-sm text-therapy-600">{platform.description}</p>
                    </div>
                  </div>
                  <Badge variant={isConnected ? "default" : "outline"}>
                    {isConnected ? 'Connected' : 'Available'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-therapy-900 mb-2">Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {platform.features.map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => connectPlatform(platform.id)}
                    disabled={isConnected}
                    size="sm"
                    className="w-full"
                  >
                    {isConnected ? (
                      <>
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </>
                    ) : (
                      <>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Connect {platform.name}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Settings Card - Only show if at least one platform is connected */}
      {connectedPlatforms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Video Session Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium text-therapy-900">Session Configuration</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Camera className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="font-medium">Auto-Record Sessions</p>
                      <p className="text-sm text-therapy-600">Automatically record therapy sessions for review</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.auto_record_sessions}
                    onCheckedChange={(checked) => updateSettings({ auto_record_sessions: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CameraOff className="h-4 w-4 text-orange-500" />
                    <div>
                      <p className="font-medium">Audio-Only Fallback</p>
                      <p className="text-sm text-therapy-600">Switch to audio-only if video quality is poor</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.audio_only_fallback}
                    onCheckedChange={(checked) => updateSettings({ audio_only_fallback: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="font-medium">Background Blur</p>
                      <p className="text-sm text-therapy-600">Automatically blur background for privacy</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.background_blur}
                    onCheckedChange={(checked) => updateSettings({ background_blur: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4 text-purple-500" />
                    <div>
                      <p className="font-medium">Waiting Room</p>
                      <p className="text-sm text-therapy-600">Enable waiting room for added security</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.waiting_room_enabled}
                    onCheckedChange={(checked) => updateSettings({ waiting_room_enabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-indigo-500" />
                    <div>
                      <p className="font-medium">Session Reminders</p>
                      <p className="text-sm text-therapy-600">Send reminders before video sessions</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.session_reminders}
                    onCheckedChange={(checked) => updateSettings({ session_reminders: checked })}
                  />
                </div>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-purple-900 mb-1">Privacy & Security</h4>
                  <p className="text-sm text-purple-600">
                    All video sessions are encrypted end-to-end. Recordings are stored securely and 
                    only accessible to you and your therapist with your explicit consent.
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

export default VideoIntegration;
