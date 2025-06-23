
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/SimpleAuthProvider';
import { Smartphone, MessageSquare, CheckCircle, QrCode, ArrowRight, ArrowLeft } from 'lucide-react';

interface WhatsAppSetupWizardProps {
  onComplete: () => void;
  onCancel: () => void;
}

const WhatsAppSetupWizard = ({ onComplete, onCancel }: WhatsAppSetupWizardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [integrationId, setIntegrationId] = useState<string | null>(null);

  const steps = [
    { id: 1, title: 'Phone Number', icon: Smartphone },
    { id: 2, title: 'Verification', icon: MessageSquare },
    { id: 3, title: 'Complete', icon: CheckCircle }
  ];

  const requestVerification = async () => {
    setLoading(true);
    try {
      const response = await fetch('/functions/v1/whatsapp-verify-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await user?.getSession())?.access_token}`
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
          userId: user?.id
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setIntegrationId(data.integrationId);
        // In development, show the verification code
        if (data.verificationCode) {
          toast({
            title: "Verification Code",
            description: `Your code is: ${data.verificationCode}`,
          });
        }
        setCurrentStep(2);
      } else {
        throw new Error('Failed to send verification code');
      }
    } catch (error) {
      console.error('Error requesting verification:', error);
      toast({
        title: "Error",
        description: "Failed to send verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    setLoading(true);
    try {
      // Here you would verify the code with your backend
      // For now, we'll simulate success
      toast({
        title: "Verification Successful",
        description: "Your WhatsApp integration is now active!",
      });
      setCurrentStep(3);
    } catch (error) {
      console.error('Error verifying code:', error);
      toast({
        title: "Error",
        description: "Invalid verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Add country code if missing
    if (digits.length > 0 && !digits.startsWith('1')) {
      return '+1' + digits;
    }
    
    return '+' + digits;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          
          return (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                isCompleted ? 'bg-therapy-600 border-therapy-600 text-white' :
                isActive ? 'border-therapy-600 text-therapy-600' :
                'border-gray-300 text-gray-400'
              }`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className={`ml-2 text-sm font-medium ${
                isActive ? 'text-therapy-600' : 'text-gray-500'
              }`}>
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <ArrowRight className="h-4 w-4 text-gray-400 mx-4" />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <CardTitle>WhatsApp Integration Setup</CardTitle>
              <p className="text-sm text-therapy-600">
                Connect your WhatsApp to chat with your AI therapist
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">How it works</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Send messages directly to our AI therapist via WhatsApp</li>
                  <li>• Get instant, personalized therapeutic support</li>
                  <li>• All conversations are encrypted and HIPAA compliant</li>
                  <li>• Available 24/7 whenever you need support</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                />
                <p className="text-sm text-therapy-600">
                  Enter your WhatsApp phone number with country code
                </p>
              </div>
              
              <div className="flex space-x-3">
                <Button variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button 
                  onClick={requestVerification}
                  disabled={!phoneNumber || loading}
                  className="flex-1"
                >
                  {loading ? 'Sending...' : 'Send Verification Code'}
                </Button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h3 className="font-medium text-yellow-900 mb-2">Verification Required</h3>
                <p className="text-sm text-yellow-800">
                  We've sent a verification code to {phoneNumber}. 
                  Enter the 6-digit code below to complete setup.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="123456"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                />
              </div>
              
              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button 
                  onClick={verifyCode}
                  disabled={verificationCode.length !== 6 || loading}
                  className="flex-1"
                >
                  {loading ? 'Verifying...' : 'Verify Code'}
                </Button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4 text-center">
              <div className="p-6 bg-green-50 rounded-lg">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-medium text-green-900 mb-2">Setup Complete!</h3>
                <p className="text-sm text-green-800">
                  Your WhatsApp integration is now active. You can start chatting with your AI therapist.
                </p>
              </div>
              
              <div className="p-4 bg-therapy-50 rounded-lg">
                <h4 className="font-medium text-therapy-900 mb-2">Next Steps</h4>
                <ul className="text-sm text-therapy-700 space-y-1">
                  <li>• Send "Hello" to start your first conversation</li>
                  <li>• Customize your settings in the integration panel</li>
                  <li>• Enable crisis escalation for emergency support</li>
                </ul>
              </div>
              
              <Button onClick={onComplete} className="w-full">
                Complete Setup
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppSetupWizard;
