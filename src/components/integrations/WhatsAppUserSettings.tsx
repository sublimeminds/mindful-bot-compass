
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/SimpleAuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { MessageSquare, Shield, Bell, User } from 'lucide-react';

interface WhatsAppUserSettingsProps {
  integration: any;
  onUpdate: () => void;
}

const WhatsAppUserSettings = ({ integration, onUpdate }: WhatsAppUserSettingsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [config, setConfig] = useState<any>(null);
  const [availablePrompts, setAvailablePrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserConfig();
    loadAvailablePrompts();
  }, [user]);

  const loadUserConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('whatsapp_config')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;
      setConfig(data);
    } catch (error) {
      console.error('Error loading user config:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailablePrompts = async () => {
    try {
      const { data, error } = await supabase
        .from('whatsapp_system_prompts')
        .select('id, name, personality_type')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setAvailablePrompts(data || []);
    } catch (error) {
      console.error('Error loading prompts:', error);
    }
  };

  const updateConfig = async (updates: any) => {
    try {
      const { error } = await supabase
        .from('whatsapp_config')
        .upsert({
          user_id: user?.id,
          ...config,
          ...updates,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;
      
      setConfig(prev => ({ ...prev, ...updates }));
      toast({
        title: "Settings Updated",
        description: "Your WhatsApp preferences have been saved.",
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-therapy-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-therapy-600" />
              WhatsApp Connection
            </CardTitle>
            <Badge className="bg-green-600">
              Connected to {integration?.phone_number}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-therapy-600 text-sm mb-4">
            Your WhatsApp is connected and ready for AI therapy sessions. 
            Send a message to start chatting with your AI therapist.
          </p>
          <div className="p-3 bg-therapy-50 rounded-lg">
            <p className="text-therapy-800 text-sm">
              💡 <strong>Tip:</strong> Send "Hello" or "How are you?" to begin your first conversation.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Personal Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2 text-therapy-600" />
            Personal Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Auto Responses</Label>
              <p className="text-sm text-therapy-600">
                Get instant AI therapy responses to your messages
              </p>
            </div>
            <Switch
              checked={config?.auto_responses_enabled ?? true}
              onCheckedChange={(checked) => updateConfig({ auto_responses_enabled: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label>AI Personality</Label>
            <Select
              value={config?.ai_personality_id || 'default'}
              onValueChange={(value) => updateConfig({ ai_personality_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose AI personality..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default (Empathetic)</SelectItem>
                {availablePrompts.map((prompt) => (
                  <SelectItem key={prompt.id} value={prompt.id}>
                    {prompt.name} - {prompt.personality_type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-therapy-600">
              Choose the AI personality that feels most comfortable for you
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Safety */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-therapy-600" />
            Privacy & Safety
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Crisis Support</Label>
              <p className="text-sm text-therapy-600">
                Automatically detect and respond to crisis situations
              </p>
            </div>
            <Switch
              checked={config?.crisis_escalation_enabled ?? true}
              onCheckedChange={(checked) => updateConfig({ crisis_escalation_enabled: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Message History</Label>
              <p className="text-sm text-therapy-600">
                Save conversation history for better AI understanding
              </p>
            </div>
            <Switch
              checked={config?.message_encryption_enabled ?? true}
              onCheckedChange={(checked) => updateConfig({ message_encryption_enabled: checked })}
            />
          </div>

          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-yellow-800 text-sm">
              <Shield className="h-4 w-4 inline mr-1" />
              All messages are encrypted and HIPAA compliant. Crisis situations are automatically escalated to professionals.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2 text-therapy-600" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Response Delay</Label>
            <Select
              value={config?.response_delay_seconds?.toString() || '2'}
              onValueChange={(value) => updateConfig({ response_delay_seconds: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Instant (1 second)</SelectItem>
                <SelectItem value="2">Natural (2 seconds)</SelectItem>
                <SelectItem value="5">Thoughtful (5 seconds)</SelectItem>
                <SelectItem value="10">Slow (10 seconds)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-therapy-600">
              How quickly should the AI respond to your messages?
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppUserSettings;
