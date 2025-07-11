import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useIntegrations } from '@/hooks/useIntegrations';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Apple, Heart, Activity, Moon, Smartphone, CheckCircle, Shield, AlertTriangle } from 'lucide-react';

interface AppleHealthSetupWizardProps {
  onComplete?: () => void;
}

const AppleHealthSetupWizard = ({ onComplete }: AppleHealthSetupWizardProps) => {
  const { user } = useAuth();
  const { createIntegration } = useIntegrations();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const healthPermissions = [
    {
      id: 'heart_rate',
      name: 'Heart Rate',
      description: 'Monitor stress and anxiety levels through heart rate variability',
      icon: Heart,
      category: 'Vital Signs',
      therapeutic_value: 'Correlate physical stress with mood patterns'
    },
    {
      id: 'sleep_analysis',
      name: 'Sleep Data',
      description: 'Track sleep quality and its impact on mental health',
      icon: Moon,
      category: 'Sleep',
      therapeutic_value: 'Identify sleep-mood relationships for better therapy'
    },
    {
      id: 'activity_data',
      name: 'Activity & Exercise',
      description: 'Monitor physical activity levels and exercise patterns',
      icon: Activity,
      category: 'Fitness',
      therapeutic_value: 'Recommend activity-based interventions'
    },
    {
      id: 'mindfulness_minutes',
      name: 'Mindfulness Sessions',
      description: 'Track meditation and breathing exercises',
      icon: Apple,
      category: 'Mental Health',
      therapeutic_value: 'Measure mindfulness practice consistency'
    }
  ];

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions(prev => [...prev, permissionId]);
    } else {
      setSelectedPermissions(prev => prev.filter(id => id !== permissionId));
    }
  };

  const setupIntegration = async () => {
    try {
      const integration = await createIntegration('apple_health', {
        health_permissions: selectedPermissions,
        platform_user_id: user?.id || '',
        data_sync_frequency: 'hourly',
        privacy_level: 'high'
      });

      setIsCompleted(true);
      toast({
        title: "Apple Health Connected!",
        description: "Health data will be securely synced to enhance your therapy insights.",
      });

      setTimeout(() => {
        onComplete?.();
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Setup Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (isCompleted) {
    return (
      <Card className="text-center">
        <CardContent className="p-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Apple Health Integration Complete!</h3>
          <p className="text-gray-600 mb-4">
            Your health data will now provide valuable insights to enhance your therapy experience.
          </p>
          <div className="flex justify-center gap-2">
            <Badge className="bg-green-100 text-green-800">
              <Shield className="h-3 w-3 mr-1" />
              HIPAA Compliant
            </Badge>
            <Badge className="bg-blue-100 text-blue-800">
              <Heart className="h-3 w-3 mr-1" />
              Health Insights
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Apple className="h-6 w-6 text-gray-600" />
          <span className="text-lg font-semibold">Apple Health Setup - Step {currentStep} of 2</span>
        </div>
        <div className="flex space-x-2">
          <div className={`w-3 h-3 rounded-full ${currentStep >= 1 ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
          <div className={`w-3 h-3 rounded-full ${currentStep >= 2 ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
        </div>
      </div>

      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Health Data Permissions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">How Health Data Enhances Your Therapy:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Correlate physical health metrics with mood patterns</li>
                <li>Identify stress triggers through heart rate variability</li>
                <li>Optimize therapy timing based on sleep quality</li>
                <li>Track the effectiveness of mindfulness practices</li>
                <li>Provide personalized activity recommendations</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Select Health Data to Share:</h4>
              {healthPermissions.map((permission) => {
                const IconComponent = permission.icon;
                const isSelected = selectedPermissions.includes(permission.id);
                
                return (
                  <div key={permission.id} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                    <Checkbox 
                      checked={isSelected}
                      onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
                          <IconComponent className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h5 className="font-medium">{permission.name}</h5>
                          <Badge variant="outline" className="text-xs">
                            {permission.category}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{permission.description}</p>
                      <p className="text-xs text-blue-600 font-medium">
                        Therapeutic Value: {permission.therapeutic_value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Button 
              onClick={() => setCurrentStep(2)}
              disabled={selectedPermissions.length === 0}
              className="w-full bg-gray-600 hover:bg-gray-700"
            >
              Continue to Privacy Settings
            </Button>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Selected Permissions: {selectedPermissions.length}
              </h4>
              <p className="text-sm text-green-700">
                You've granted access to {selectedPermissions.length} health data types for enhanced therapy insights.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Privacy Protections:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-green-500" />
                  <div className="text-sm">
                    <div className="font-medium">End-to-End Encryption</div>
                    <div className="text-gray-600">All health data encrypted</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Apple className="h-5 w-5 text-blue-500" />
                  <div className="text-sm">
                    <div className="font-medium">HealthKit Security</div>
                    <div className="text-gray-600">Apple's secure health platform</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Heart className="h-5 w-5 text-red-500" />
                  <div className="text-sm">
                    <div className="font-medium">HIPAA Compliance</div>
                    <div className="text-gray-600">Medical-grade privacy</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Activity className="h-5 w-5 text-purple-500" />
                  <div className="text-sm">
                    <div className="font-medium">Anonymous Analysis</div>
                    <div className="text-gray-600">No personal identifiers</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                Important Note
              </h4>
              <p className="text-sm text-amber-700">
                This integration requires the TherapySync iOS app. Health data cannot be accessed through the web browser due to Apple's security restrictions. You'll be redirected to download the app after setup.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Data Usage:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                <li>Health metrics will be analyzed to provide therapy insights</li>
                <li>Data correlations help identify mood and stress patterns</li>
                <li>Your therapist AI will receive anonymized health trends</li>
                <li>You can revoke permissions at any time in the iOS app</li>
                <li>Raw health data is never shared with third parties</li>
              </ul>
            </div>

            <Button 
              onClick={setupIntegration}
              className="w-full bg-gray-600 hover:bg-gray-700"
            >
              Complete Apple Health Setup
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AppleHealthSetupWizard;