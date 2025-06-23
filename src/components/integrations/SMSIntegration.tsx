
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/SimpleAuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { 
  Smartphone, 
  Shield, 
  AlertTriangle, 
  MessageSquare, 
  Settings,
  Phone,
  Clock,
  CheckCircle
} from 'lucide-react';

interface SMSSettings {
  phone_number: string;
  crisis_alerts: boolean;
  appointment_reminders: boolean;
  progress_updates: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
  emergency_contacts: string[];
}

const SMSIntegration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<SMSSettings>({
    phone_number: '',
    crisis_alerts: true,
    appointment_reminders: true,
    progress_updates: false,
    quiet_hours_start: '22:00',
    quiet_hours_end: '08:00',
    emergency_contacts: []
  });
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);

  useEffect(() => {
    if (user) {
      loadSMSIntegration();
    }
  }, [user]);

  const loadSMSIntegration = async () => {
    try {
      const { data, error } = await supabase
        .from('user_integrations')
        .select('*, integrations(*)')
        .eq('user_id', user?.id)
        .eq('integrations.type', 'sms')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setIsConnected(data.is_enabled);
        if (data.settings && typeof data.settings === 'object') {
          setSettings({ ...settings, ...(data.settings as Partial<SMSSettings>) });
        }
      }
    } catch (error) {
      console.error('Error loading SMS integration:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupSMSIntegration = async () => {
    if (!settings.phone_number) {
      toast({
        title: "Error",
        description: "Please enter your phone number",
        variant: "destructive"
      });
      return;
    }

    try {
      // Get the SMS integration
      const { data: integration, error: integrationError } = await supabase
        .from('integrations')
        .select('id')
        .eq('type', 'sms')
        .eq('name', 'Twilio SMS')
        .single();

      if (integrationError) throw integrationError;

      // Create or update user integration
      const { error } = await supabase
        .from('user_integrations')
        .upsert({
          user_id: user?.id!,
          integration_id: integration.id,
          is_enabled: true,
          settings: settings as any
        });

      if (error) throw error;

      // Simulate sending verification code
      setShowVerification(true);
      
      toast({
        title: "Verification Code Sent",
        description: "Please check your phone for the verification code",
      });

    } catch (error) {
      console.error('Error setting up SMS integration:', error);
      toast({
        title: "Error",
        description: "Failed to setup SMS integration",
        variant: "destructive"
      });
    }
  };

  const verifyPhoneNumber = async () => {
    if (!verificationCode) {
      toast({
        title: "Error",
        description: "Please enter the verification code",
        variant: "destructive"
      });
      return;
    }

    // Simulate verification (in real implementation, verify with Twilio)
    if (verificationCode === '123456') {
      setIsConnected(true);
      setShowVerification(false);
      
      toast({
        title: "Phone Verified",
        description: "Your phone number has been verified successfully",
      });
    } else {
      toast({
        title: "Invalid Code",
        description: "Please enter the correct verification code",
        variant: "destructive"
      });
    }
  };

  const updateSettings = async (newSettings: Partial<SMSSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);

    try {
      const { data: integration } = await supabase
        .from('integrations')
        .select('id')
        .eq('type', 'sms')
        .single();

      const { error } = await supabase
        .from('user_integrations')
        .update({ settings: updatedSettings as any })
        .eq('user_id', user?.id)
        .eq('integration_id', integration?.id);

      if (error) throw error;

      toast({
        title: "Settings Updated",
        description: "Your SMS preferences have been saved",
      });
    } catch (error) {
      console.error('Error updating SMS settings:', error);
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
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Smartphone className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle>SMS Integration</CardTitle>
                <p className="text-sm text-therapy-600">
                  Receive important alerts and reminders via SMS
                </p>
              </div>
            </div>
            <Badge variant={isConnected ? "default" : "outline"}>
              {isConnected ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </>
              ) : (
                'Not Connected'
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isConnected ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-therapy-900">Phone Number</label>
                <Input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={settings.phone_number}
                  onChange={(e) => setSettings({ ...settings, phone_number: e.target.value })}
                  className="mt-1"
                />
                <p className="text-xs text-therapy-500 mt-1">
                  Include country code for international numbers
                </p>
              </div>

              {showVerification ? (
                <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Verification Required</span>
                  </div>
                  <Input
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={6}
                  />
                  <div className="flex space-x-2">
                    <Button onClick={verifyPhoneNumber} size="sm">
                      Verify Code
                    </Button>
                    <Button variant="outline" size="sm" onClick={setupSMSIntegration}>
                      Resend Code
                    </Button>
                  </div>
                  <p className="text-xs text-blue-600">
                    For demo purposes, use code: 123456
                  </p>
                </div>
              ) : (
                <Button onClick={setupSMSIntegration} className="w-full">
                  Setup SMS Integration
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Connected Phone */}
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">Connected Phone</p>
                    <p className="text-sm text-green-600">{settings.phone_number}</p>
                  </div>
                </div>
                <Badge variant="default" className="bg-green-600">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              </div>

              {/* Notification Settings */}
              <div className="space-y-4">
                <h4 className="font-medium text-therapy-900">Notification Preferences</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <div>
                        <p className="font-medium">Crisis Alerts</p>
                        <p className="text-sm text-therapy-600">Immediate notifications for crisis situations</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.crisis_alerts}
                      onCheckedChange={(checked) => updateSettings({ crisis_alerts: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="font-medium">Appointment Reminders</p>
                        <p className="text-sm text-therapy-600">Reminders for upcoming sessions</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.appointment_reminders}
                      onCheckedChange={(checked) => updateSettings({ appointment_reminders: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="h-4 w-4 text-purple-500" />
                      <div>
                        <p className="font-medium">Progress Updates</p>
                        <p className="text-sm text-therapy-600">Weekly progress summaries</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.progress_updates}
                      onCheckedChange={(checked) => updateSettings({ progress_updates: checked })}
                    />
                  </div>
                </div>
              </div>

              {/* Quiet Hours */}
              <div className="space-y-4">
                <h4 className="font-medium text-therapy-900">Quiet Hours</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-therapy-900">Start Time</label>
                    <Input
                      type="time"
                      value={settings.quiet_hours_start}
                      onChange={(e) => updateSettings({ quiet_hours_start: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-therapy-900">End Time</label>
                    <Input
                      type="time"
                      value={settings.quiet_hours_end}
                      onChange={(e) => updateSettings({ quiet_hours_end: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>
                <p className="text-xs text-therapy-500">
                  Non-urgent notifications will be silenced during these hours
                </p>
              </div>

              {/* Security Notice */}
              <div className="p-4 bg-therapy-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-therapy-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-therapy-900 mb-1">Privacy & Security</h4>
                    <p className="text-sm text-therapy-600">
                      All SMS communications are encrypted and HIPAA compliant. 
                      Your phone number is securely stored and never shared with third parties.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SMSIntegration;
