import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MessageSquare, 
  Phone, 
  CheckCircle, 
  AlertCircle, 
  Settings, 
  Send,
  Clock,
  Shield,
  Bell
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface WhatsAppConfig {
  id?: string;
  user_id: string;
  response_delay_seconds: number;
  business_hours_enabled: boolean;
  business_hours_start: string | null;
  business_hours_end: string | null;
  auto_responses_enabled: boolean;
  crisis_escalation_enabled: boolean;
  message_encryption_enabled: boolean;
  custom_greeting?: string;
  out_of_hours_message?: string;
}

interface WhatsAppIntegration {
  id?: string;
  user_id: string;
  phone_number: string;
  whatsapp_number: string | null;
  verification_status: string;
  is_active: boolean;
  privacy_settings: any;
}

const WhatsAppSetup = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [integration, setIntegration] = useState<WhatsAppIntegration | null>(null);
  const [config, setConfig] = useState<WhatsAppConfig>({
    user_id: user?.id || '',
    response_delay_seconds: 2,
    business_hours_enabled: false,
    business_hours_start: null,
    business_hours_end: null,
    auto_responses_enabled: true,
    crisis_escalation_enabled: true,
    message_encryption_enabled: true,
    custom_greeting: 'Hello! I\'m your AI therapy assistant. How can I help you today?',
    out_of_hours_message: 'Thanks for reaching out! I\'m currently offline but will respond during business hours.'
  });
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'setup' | 'verify' | 'config'>('setup');
  const [testMessage, setTestMessage] = useState('Hello! This is a test message from your therapy assistant.');

  useEffect(() => {
    if (user) {
      loadExistingIntegration();
    }
  }, [user]);

  const loadExistingIntegration = async () => {
    if (!user) return;

    try {
      // Load WhatsApp integration
      const { data: integrationData, error: integrationError } = await supabase
        .from('whatsapp_integrations')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!integrationError && integrationData) {
        setIntegration({
          ...integrationData,
          privacy_settings: typeof integrationData.privacy_settings === 'string' 
            ? JSON.parse(integrationData.privacy_settings) 
            : integrationData.privacy_settings || { data_sharing: false, message_history: false }
        });
        setPhoneNumber(integrationData.phone_number);
        
        if (integrationData.verification_status === 'verified') {
          setStep('config');
        } else {
          setStep('verify');
        }
      }

      // Load WhatsApp config
      const { data: configData, error: configError } = await supabase
        .from('whatsapp_config')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!configError && configData) {
        setConfig(configData);
      }
    } catch (error) {
      console.error('Error loading integration:', error);
    }
  };

  const handlePhoneSetup = async () => {
    if (!phoneNumber || !user) {
      toast({
        title: "Error",
        description: "Please enter a valid phone number.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Call verification function
      const { data, error } = await supabase.functions.invoke('whatsapp-verify-phone', {
        body: {
          phoneNumber: phoneNumber,
          userId: user.id
        }
      });

      if (error) throw error;

      toast({
        title: "Verification code sent",
        description: "Please check your WhatsApp for the verification code.",
      });

      setStep('verify');
    } catch (error: any) {
      console.error('Error setting up phone:', error);
      toast({
        title: "Setup failed",
        description: error.message || "Failed to send verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async () => {
    if (!verificationCode || !user) {
      toast({
        title: "Error",
        description: "Please enter the verification code.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Verify the code and activate integration
      const { error } = await supabase
        .from('whatsapp_integrations')
        .update({
          verification_status: 'verified',
          is_active: true,
          verified_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('verification_code', verificationCode);

      if (error) throw error;

      toast({
        title: "WhatsApp verified!",
        description: "Your WhatsApp integration is now active.",
      });

      await loadExistingIntegration();
      setStep('config');
    } catch (error: any) {
      console.error('Error verifying code:', error);
      toast({
        title: "Verification failed",
        description: "Invalid verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfigSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('whatsapp_config')
        .upsert({
          ...config,
          user_id: user.id
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast({
        title: "Configuration saved",
        description: "Your WhatsApp settings have been updated.",
      });
    } catch (error: any) {
      console.error('Error saving config:', error);
      toast({
        title: "Save failed",
        description: error.message || "Failed to save configuration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestMessage = async () => {
    if (!user || !integration) return;

    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('whatsapp-send-message', {
        body: {
          message: testMessage,
          userId: user.id,
          integrationId: integration.id
        }
      });

      if (error) throw error;

      toast({
        title: "Test message sent",
        description: "Check your WhatsApp for the test message.",
      });
    } catch (error: any) {
      console.error('Error sending test message:', error);
      toast({
        title: "Test failed",
        description: error.message || "Failed to send test message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = () => {
    if (!integration) return <Badge variant="outline">Not Connected</Badge>;
    
    switch (integration.verification_status) {
      case 'verified':
        return <Badge variant="default" className="bg-green-500">
          <CheckCircle className="h-3 w-3 mr-1" />
          Connected
        </Badge>;
      case 'pending':
        return <Badge variant="outline">
          <Clock className="h-3 w-3 mr-1" />
          Pending Verification
        </Badge>;
      default:
        return <Badge variant="destructive">
          <AlertCircle className="h-3 w-3 mr-1" />
          Not Verified
        </Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>WhatsApp Integration</span>
            </div>
            {getStatusBadge()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Connect WhatsApp to receive therapy support, session reminders, and crisis management via messaging.
          </p>
        </CardContent>
      </Card>

      {/* Setup Steps */}
      {step === 'setup' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Phone className="h-5 w-5" />
              <span>Phone Setup</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1234567890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Enter your phone number with country code (e.g., +1234567890)
              </p>
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                We'll send a verification code to your WhatsApp. Your phone number is encrypted and never shared.
              </AlertDescription>
            </Alert>

            <Button onClick={handlePhoneSetup} disabled={loading || !phoneNumber}>
              {loading ? 'Sending...' : 'Send Verification Code'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Verification Step */}
      {step === 'verify' && (
        <Card>
          <CardHeader>
            <CardTitle>Verify Your Phone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                type="text"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="mt-1"
                maxLength={6}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Check your WhatsApp for the verification code
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleVerification} disabled={loading || !verificationCode}>
                {loading ? 'Verifying...' : 'Verify Code'}
              </Button>
              <Button variant="outline" onClick={() => setStep('setup')}>
                Change Phone
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Configuration */}
      {step === 'config' && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Chat Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Auto Response Settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Responses</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically respond to incoming messages
                    </p>
                  </div>
                  <Switch
                    checked={config.auto_responses_enabled}
                    onCheckedChange={(checked) => 
                      setConfig(prev => ({ ...prev, auto_responses_enabled: checked }))
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="greeting">Custom Greeting Message</Label>
                  <Textarea
                    id="greeting"
                    value={config.custom_greeting}
                    onChange={(e) => 
                      setConfig(prev => ({ ...prev, custom_greeting: e.target.value }))
                    }
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="delay">Response Delay (seconds)</Label>
                  <Select
                    value={config.response_delay_seconds.toString()}
                    onValueChange={(value) => 
                      setConfig(prev => ({ ...prev, response_delay_seconds: parseInt(value) }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Immediate</SelectItem>
                      <SelectItem value="1">1 second</SelectItem>
                      <SelectItem value="2">2 seconds</SelectItem>
                      <SelectItem value="5">5 seconds</SelectItem>
                      <SelectItem value="10">10 seconds</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Business Hours */}
              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Business Hours</Label>
                    <p className="text-sm text-muted-foreground">
                      Only respond during specific hours
                    </p>
                  </div>
                  <Switch
                    checked={config.business_hours_enabled}
                    onCheckedChange={(checked) => 
                      setConfig(prev => ({ ...prev, business_hours_enabled: checked }))
                    }
                  />
                </div>

                {config.business_hours_enabled && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="start-time">Start Time</Label>
                        <Input
                          id="start-time"
                          type="time"
                          value={config.business_hours_start || '09:00'}
                          onChange={(e) => 
                            setConfig(prev => ({ ...prev, business_hours_start: e.target.value }))
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="end-time">End Time</Label>
                        <Input
                          id="end-time"
                          type="time"
                          value={config.business_hours_end || '17:00'}
                          onChange={(e) => 
                            setConfig(prev => ({ ...prev, business_hours_end: e.target.value }))
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="out-of-hours">Out of Hours Message</Label>
                      <Textarea
                        id="out-of-hours"
                        value={config.out_of_hours_message}
                        onChange={(e) => 
                          setConfig(prev => ({ ...prev, out_of_hours_message: e.target.value }))
                        }
                        className="mt-1"
                        rows={2}
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Security Settings */}
              <div className="space-y-4 border-t pt-4">
                <h4 className="font-medium">Security & Privacy</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Crisis Escalation</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically escalate crisis situations
                    </p>
                  </div>
                  <Switch
                    checked={config.crisis_escalation_enabled}
                    onCheckedChange={(checked) => 
                      setConfig(prev => ({ ...prev, crisis_escalation_enabled: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Message Encryption</Label>
                    <p className="text-sm text-muted-foreground">
                      Encrypt stored messages for security
                    </p>
                  </div>
                  <Switch
                    checked={config.message_encryption_enabled}
                    onCheckedChange={(checked) => 
                      setConfig(prev => ({ ...prev, message_encryption_enabled: checked }))
                    }
                  />
                </div>
              </div>

              <Button onClick={handleConfigSave} disabled={loading}>
                {loading ? 'Saving...' : 'Save Configuration'}
              </Button>
            </CardContent>
          </Card>

          {/* Test Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Send className="h-5 w-5" />
                <span>Test Integration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="test-message">Test Message</Label>
                <Textarea
                  id="test-message"
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <Button onClick={handleTestMessage} disabled={loading || !testMessage}>
                {loading ? 'Sending...' : 'Send Test Message'}
              </Button>

              <Alert>
                <Bell className="h-4 w-4" />
                <AlertDescription>
                  Send a test message to verify your WhatsApp integration is working correctly.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default WhatsAppSetup;