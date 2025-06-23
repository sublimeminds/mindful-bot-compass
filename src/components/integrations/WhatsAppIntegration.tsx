
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/SimpleAuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { MessageSquare, Smartphone, CheckCircle, AlertCircle, QrCode, Settings } from 'lucide-react';
import WhatsAppSetupWizard from './WhatsAppSetupWizard';
import WhatsAppMessageHistory from './WhatsAppMessageHistory';

const WhatsAppIntegration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [integration, setIntegration] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    if (user) {
      loadIntegration();
      loadConfig();
    }
  }, [user]);

  const loadIntegration = async () => {
    try {
      const { data, error } = await supabase
        .from('whatsapp_integrations')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;
      setIntegration(data);
    } catch (error) {
      console.error('Error loading WhatsApp integration:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('whatsapp_config')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;
      setConfig(data);
    } catch (error) {
      console.error('Error loading WhatsApp config:', error);
    }
  };

  const updateConfig = async (updates: any) => {
    try {
      const { error } = await supabase
        .from('whatsapp_config')
        .upsert({
          user_id: user?.id,
          ...updates,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;
      
      setConfig(prev => ({ ...prev, ...updates }));
      toast({
        title: "Settings Updated",
        description: "Your WhatsApp settings have been saved.",
      });
    } catch (error) {
      console.error('Error updating config:', error);
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const disconnectWhatsApp = async () => {
    try {
      const { error } = await supabase
        .from('whatsapp_integrations')
        .update({ is_active: false })
        .eq('user_id', user?.id);

      if (error) throw error;

      setIntegration(null);
      toast({
        title: "Disconnected",
        description: "WhatsApp has been disconnected from your account.",
      });
    } catch (error) {
      console.error('Error disconnecting WhatsApp:', error);
      toast({
        title: "Error",
        description: "Failed to disconnect WhatsApp. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = () => {
    if (!integration) return <Badge variant="outline">Not Connected</Badge>;
    if (!integration.is_active) return <Badge variant="destructive">Inactive</Badge>;
    if (integration.verification_status === 'verified') {
      return <Badge variant="default" className="bg-green-600"><CheckCircle className="h-3 w-3 mr-1" />Connected</Badge>;
    }
    return <Badge variant="secondary"><AlertCircle className="h-3 w-3 mr-1" />Pending</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-therapy-600"></div>
      </div>
    );
  }

  if (showSetup || (!integration || !integration.is_active)) {
    return (
      <WhatsAppSetupWizard 
        onComplete={() => {
          setShowSetup(false);
          loadIntegration();
        }}
        onCancel={() => setShowSetup(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* WhatsApp Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <CardTitle>WhatsApp Integration</CardTitle>
                <p className="text-sm text-therapy-600">
                  Chat with your AI therapist directly on WhatsApp
                </p>
              </div>
            </div>
            {getStatusBadge()}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {integration && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-therapy-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Smartphone className="h-5 w-5 text-therapy-600" />
                  <div>
                    <p className="font-medium text-therapy-900">Connected Phone</p>
                    <p className="text-sm text-therapy-600">{integration.phone_number}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowSetup(true)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Reconfigure
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Last message</span>
                <span className="text-sm text-therapy-600">
                  {integration.last_message_at 
                    ? new Date(integration.last_message_at).toLocaleDateString()
                    : 'Never'
                  }
                </span>
              </div>
            </div>
          )}
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setShowSetup(true)}>
              <QrCode className="h-4 w-4 mr-2" />
              Setup Guide
            </Button>
            {integration?.is_active && (
              <Button variant="destructive" onClick={disconnectWhatsApp}>
                Disconnect
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Settings Card */}
      {integration?.is_active && (
        <Card>
          <CardHeader>
            <CardTitle>WhatsApp Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-responses">Auto Responses</Label>
                  <p className="text-sm text-therapy-600">
                    Automatically respond to messages with AI therapy support
                  </p>
                </div>
                <Switch
                  id="auto-responses"
                  checked={config?.auto_responses_enabled ?? true}
                  onCheckedChange={(checked) => updateConfig({ auto_responses_enabled: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="crisis-escalation">Crisis Escalation</Label>
                  <p className="text-sm text-therapy-600">
                    Automatically escalate crisis situations to professionals
                  </p>
                </div>
                <Switch
                  id="crisis-escalation"
                  checked={config?.crisis_escalation_enabled ?? true}
                  onCheckedChange={(checked) => updateConfig({ crisis_escalation_enabled: checked })}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="response-delay">Response Delay (seconds)</Label>
                <Input
                  id="response-delay"
                  type="number"
                  min="1"
                  max="60"
                  value={config?.response_delay_seconds ?? 2}
                  onChange={(e) => updateConfig({ response_delay_seconds: parseInt(e.target.value) })}
                  className="w-24"
                />
                <p className="text-sm text-therapy-600">
                  Delay before AI responds to simulate natural conversation
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Message History */}
      {integration?.is_active && (
        <WhatsAppMessageHistory integrationId={integration.id} />
      )}
    </div>
  );
};

export default WhatsAppIntegration;
