
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/SimpleAuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { MessageSquare, Smartphone, CheckCircle, AlertCircle, QrCode, Settings } from 'lucide-react';
import WhatsAppSetupWizard from './WhatsAppSetupWizard';
import WhatsAppUserSettings from './WhatsAppUserSettings';
import WhatsAppMessageHistory from './WhatsAppMessageHistory';

const WhatsAppIntegration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [integration, setIntegration] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSetup, setShowSetup] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (user) {
      loadIntegration();
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

  if (showSettings) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-therapy-900">WhatsApp Settings</h2>
          <Button variant="outline" onClick={() => setShowSettings(false)}>
            Back to Overview
          </Button>
        </div>
        <WhatsAppUserSettings 
          integration={integration} 
          onUpdate={loadIntegration}
        />
      </div>
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
                <CardTitle>WhatsApp AI Therapy</CardTitle>
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
                <div className="text-right">
                  <p className="text-sm text-therapy-600">Last message</p>
                  <p className="text-sm font-medium">
                    {integration.last_message_at 
                      ? new Date(integration.last_message_at).toLocaleDateString()
                      : 'Never'
                    }
                  </p>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Quick Start</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Send "Hello" to start your first conversation</li>
                  <li>• Share how you're feeling or what's on your mind</li>
                  <li>• Ask for coping strategies or techniques</li>
                  <li>• Get 24/7 support whenever you need it</li>
                </ul>
              </div>
            </div>
          )}
          
          <div className="flex justify-between">
            <div className="flex space-x-2">
              <Button onClick={() => setShowSettings(true)}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" onClick={() => setShowSetup(true)}>
                <QrCode className="h-4 w-4 mr-2" />
                Setup Guide
              </Button>
            </div>
            {integration?.is_active && (
              <Button variant="destructive" onClick={disconnectWhatsApp}>
                Disconnect
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Message History */}
      {integration?.is_active && (
        <WhatsAppMessageHistory integrationId={integration.id} />
      )}
    </div>
  );
};

export default WhatsAppIntegration;
