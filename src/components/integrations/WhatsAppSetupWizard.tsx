
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, ArrowLeft, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const WhatsAppSetupWizard = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [setupData, setSetupData] = useState({
    phoneNumber: '',
    businessName: '',
    apiKey: ''
  });

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      toast({
        title: "Setup Complete",
        description: "WhatsApp integration has been configured successfully.",
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateSetupData = (field: string, value: string) => {
    setSetupData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5" />
          <span>WhatsApp Setup Wizard - Step {currentStep} of 3</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Business Information</h3>
            <div className="space-y-2">
              <Label htmlFor="business-name">Business Name</Label>
              <Input
                id="business-name"
                value={setupData.businessName}
                onChange={(e) => updateSetupData('businessName', e.target.value)}
                placeholder="Enter your business name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone-number">Phone Number</Label>
              <Input
                id="phone-number"
                value={setupData.phoneNumber}
                onChange={(e) => updateSetupData('phoneNumber', e.target.value)}
                placeholder="Enter WhatsApp Business phone number"
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">API Configuration</h3>
            <div className="space-y-2">
              <Label htmlFor="api-key">WhatsApp Business API Key</Label>
              <Input
                id="api-key"
                type="password"
                value={setupData.apiKey}
                onChange={(e) => updateSetupData('apiKey', e.target.value)}
                placeholder="Enter your API key"
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Review and Confirm</h3>
            <div className="space-y-2">
              <p><strong>Business Name:</strong> {setupData.businessName}</p>
              <p><strong>Phone Number:</strong> {setupData.phoneNumber}</p>
              <p><strong>API Key:</strong> {'*'.repeat(setupData.apiKey.length)}</p>
            </div>
          </div>
        )}

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button onClick={handleNext}>
            {currentStep === 3 ? 'Complete Setup' : 'Next'}
            {currentStep < 3 && <ArrowRight className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WhatsAppSetupWizard;
