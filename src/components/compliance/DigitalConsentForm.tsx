import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, Lock, Eye, FileText, AlertCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface ConsentItem {
  id: string;
  title: string;
  description: string;
  required: boolean;
  icon: React.ReactNode;
}

const DigitalConsentForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [consents, setConsents] = useState<Record<string, boolean>>({});
  const [hasReadTerms, setHasReadTerms] = useState(false);

  const consentItems: ConsentItem[] = [
    {
      id: 'therapy_services',
      title: 'AI Therapy Services',
      description: 'I consent to receive AI-powered therapy services and understand that this is not a replacement for human professional therapy. I understand the limitations of AI therapy and will seek human professional help when needed.',
      required: true,
      icon: <Shield className="h-5 w-5 text-therapy-600" />
    },
    {
      id: 'data_processing',
      title: 'Data Processing & Storage',
      description: 'I consent to the collection, processing, and secure storage of my therapy session data, mood tracking information, and assessment responses for the purpose of providing personalized therapy services.',
      required: true,
      icon: <Lock className="h-5 w-5 text-blue-600" />
    },
    {
      id: 'crisis_intervention',
      title: 'Crisis Intervention Protocols',
      description: 'I understand that if my responses indicate I may be at risk of harm to myself or others, appropriate crisis intervention measures may be initiated, which could include contacting emergency services or designated contacts.',
      required: true,
      icon: <AlertCircle className="h-5 w-5 text-red-600" />
    },
    {
      id: 'research_participation',
      title: 'Anonymized Research (Optional)',
      description: 'I consent to having my anonymized and de-identified data used for research purposes to improve AI therapy services. Personal identifying information will never be used in research.',
      required: false,
      icon: <Eye className="h-5 w-5 text-green-600" />
    },
    {
      id: 'communication_preferences',
      title: 'Communication & Notifications',
      description: 'I consent to receive therapy-related communications, appointment reminders, and wellness check-ins through the platform and via email/SMS.',
      required: false,
      icon: <FileText className="h-5 w-5 text-purple-600" />
    }
  ];

  const submitConsentMutation = useMutation({
    mutationFn: async (consentData: Record<string, boolean>) => {
      if (!user?.id) throw new Error('User not authenticated');

      const consentRecords = Object.entries(consentData)
        .filter(([_, consented]) => consented)
        .map(([consentType, _]) => ({
          user_id: user.id,
          consent_type: consentType,
          consent_version: '1.0',
          consent_data: {
            user_agent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            ip_address: 'client_side' // In a real app, you'd get this from the server
          },
          ip_address: '0.0.0.0', // Placeholder
          user_agent: navigator.userAgent
        }));

      const { data, error } = await supabase
        .from('digital_consents')
        .insert(consentRecords)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Consent Recorded",
        description: "Your consent preferences have been saved successfully.",
      });
    },
    onError: (error) => {
      console.error('Error submitting consent:', error);
      toast({
        title: "Error",
        description: "Failed to save consent preferences. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleConsentChange = (consentId: string, checked: boolean) => {
    setConsents(prev => ({ ...prev, [consentId]: checked }));
  };

  const handleSubmit = () => {
    // Check if all required consents are given
    const requiredConsents = consentItems.filter(item => item.required);
    const missingRequired = requiredConsents.some(item => !consents[item.id]);

    if (missingRequired) {
      toast({
        title: "Required Consents Missing",
        description: "Please provide consent for all required items to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!hasReadTerms) {
      toast({
        title: "Terms Not Acknowledged",
        description: "Please confirm that you have read and understood the terms.",
        variant: "destructive",
      });
      return;
    }

    submitConsentMutation.mutate(consents);
  };

  const allRequiredConsentsGiven = consentItems
    .filter(item => item.required)
    .every(item => consents[item.id]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="text-center">
          <Shield className="h-12 w-12 text-therapy-600 mx-auto mb-4" />
          <CardTitle className="text-2xl">Digital Consent & Privacy Agreement</CardTitle>
          <p className="text-therapy-600">
            Before we begin, please review and provide consent for the following items.
            Your privacy and safety are our top priorities.
          </p>
        </CardHeader>
      </Card>

      {/* Consent Items */}
      <div className="space-y-4">
        {consentItems.map((item) => (
          <Card key={item.id} className="transition-all duration-200 hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  {item.icon}
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-therapy-900">{item.title}</h3>
                    {item.required && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                        Required
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-therapy-700 leading-relaxed">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={item.id}
                      checked={consents[item.id] || false}
                      onCheckedChange={(checked) => 
                        handleConsentChange(item.id, checked as boolean)
                      }
                    />
                    <label 
                      htmlFor={item.id} 
                      className="text-sm font-medium cursor-pointer"
                    >
                      I consent to {item.title.toLowerCase()}
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Terms and Conditions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Terms & Conditions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-40 w-full border rounded-md p-4 mb-4">
            <div className="text-sm space-y-2 text-therapy-700">
              <h4 className="font-semibold">Therapeutic Limitations</h4>
              <p>
                This AI therapy service is designed to supplement, not replace, traditional therapy. 
                It should not be used as the sole treatment for serious mental health conditions.
              </p>
              
              <h4 className="font-semibold mt-4">Emergency Situations</h4>
              <p>
                If you are experiencing a mental health emergency, please contact emergency services 
                immediately (911) or call the National Suicide Prevention Lifeline (988).
              </p>
              
              <h4 className="font-semibold mt-4">Data Security</h4>
              <p>
                We employ industry-standard encryption and security measures to protect your data. 
                However, no system is 100% secure, and you acknowledge this inherent risk.
              </p>
              
              <h4 className="font-semibold mt-4">Service Availability</h4>
              <p>
                While we strive for 24/7 availability, the service may occasionally be unavailable 
                due to maintenance or technical issues.
              </p>
            </div>
          </ScrollArea>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={hasReadTerms}
              onCheckedChange={(checked) => setHasReadTerms(checked as boolean)}
            />
            <label htmlFor="terms" className="text-sm font-medium cursor-pointer">
              I have read and understand the terms and conditions above
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <p className="text-sm text-therapy-600">
              By clicking "I Agree & Continue", you acknowledge that you have read, 
              understood, and agree to the selected consent items and terms.
            </p>
            
            <Button
              onClick={handleSubmit}
              disabled={!allRequiredConsentsGiven || !hasReadTerms || submitConsentMutation.isPending}
              className="bg-therapy-600 hover:bg-therapy-700 px-8"
              size="lg"
            >
              {submitConsentMutation.isPending 
                ? 'Saving...' 
                : 'I Agree & Continue'
              }
            </Button>
            
            {!allRequiredConsentsGiven && (
              <p className="text-xs text-red-600">
                Please provide consent for all required items to continue.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DigitalConsentForm;