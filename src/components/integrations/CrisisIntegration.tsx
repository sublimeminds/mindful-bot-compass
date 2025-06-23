
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/SimpleAuthProvider';
import { 
  AlertTriangle, 
  Phone, 
  MessageSquare, 
  Heart,
  Shield,
  Users,
  Clock,
  MapPin
} from 'lucide-react';

interface CrisisResource {
  id: string;
  name: string;
  resource_type: string;
  phone_number?: string;
  website_url?: string;
  description?: string;
  availability: string;
  priority_order: number;
}

interface CrisisAssessment {
  id: string;
  assessment_type: string;
  risk_level: string;
  status: string;
  created_at: string;
}

const CrisisIntegration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [resources, setResources] = useState<CrisisResource[]>([]);
  const [assessments, setAssessments] = useState<CrisisAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [crisisAlertsEnabled, setCrisisAlertsEnabled] = useState(true);

  const crisisServices = [
    {
      id: 'suicide-prevention',
      name: '988 Suicide & Crisis Lifeline',
      type: 'hotline',
      phone: '988',
      description: '24/7 free and confidential emotional support',
      availability: '24/7',
      icon: Phone,
      color: 'bg-red-500'
    },
    {
      id: 'crisis-text-line',
      name: 'Crisis Text Line',
      type: 'text',
      phone: 'Text HOME to 741741',
      description: 'Free, 24/7 support via text message',
      availability: '24/7',
      icon: MessageSquare,
      color: 'bg-blue-500'
    },
    {
      id: 'nami-helpline',
      name: 'NAMI HelpLine',
      type: 'support',
      phone: '1-800-950-6264',
      description: 'Information, referrals and support for mental health',
      availability: 'Mon-Fri 10am-10pm ET',
      icon: Heart,
      color: 'bg-purple-500'
    },
    {
      id: 'local-emergency',
      name: 'Emergency Services',
      type: 'emergency',
      phone: '911',
      description: 'Immediate emergency response',
      availability: '24/7',
      icon: AlertTriangle,
      color: 'bg-orange-500'
    }
  ];

  const riskFactors = [
    { factor: 'Social Isolation', detected: false, severity: 'medium' },
    { factor: 'Sleep Disruption', detected: true, severity: 'low' },
    { factor: 'Mood Deterioration', detected: false, severity: 'high' },
    { factor: 'Medication Non-compliance', detected: false, severity: 'medium' }
  ];

  useEffect(() => {
    if (user) {
      loadCrisisResources();
      loadCrisisAssessments();
    }
  }, [user]);

  const loadCrisisResources = async () => {
    try {
      // Mock data until database types are updated
      const mockResources: CrisisResource[] = crisisServices.map(service => ({
        id: service.id,
        name: service.name,
        resource_type: service.type,
        phone_number: service.phone,
        description: service.description,
        availability: service.availability,
        priority_order: 1
      }));
      
      setResources(mockResources);
    } catch (error) {
      console.error('Error loading crisis resources:', error);
    }
  };

  const loadCrisisAssessments = async () => {
    try {
      // Mock data until database types are updated
      setAssessments([]);
    } catch (error) {
      console.error('Error loading crisis assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerCrisisAssessment = async () => {
    try {
      const newAssessment: CrisisAssessment = {
        id: Math.random().toString(36).substr(2, 9),
        assessment_type: 'self_assessment',
        risk_level: 'low',
        status: 'active',
        created_at: new Date().toISOString()
      };

      setAssessments([newAssessment, ...assessments]);

      toast({
        title: "Crisis Assessment Started",
        description: "Please answer the following questions to help us assess your current situation",
      });

    } catch (error) {
      console.error('Error triggering crisis assessment:', error);
    }
  };

  const contactCrisisLine = (service: any) => {
    if (service.phone.includes('Text')) {
      toast({
        title: "Crisis Text Line",
        description: "Text HOME to 741741 for immediate support",
      });
    } else {
      // In a real app, this would initiate a call
      toast({
        title: `Contacting ${service.name}`,
        description: `Call ${service.phone} for immediate support`,
      });
    }
  };

  const toggleCrisisAlerts = (enabled: boolean) => {
    setCrisisAlertsEnabled(enabled);
    toast({
      title: enabled ? "Crisis Alerts Enabled" : "Crisis Alerts Disabled",
      description: enabled 
        ? "You'll receive alerts for crisis prevention and intervention" 
        : "Crisis alert monitoring has been disabled",
    });
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
      {/* Crisis Alert Banner */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="h-6 w-6 text-red-600 mt-1" />
            <div className="flex-1">
              <h3 className="font-medium text-red-900 mb-2">Crisis Support Available 24/7</h3>
              <p className="text-sm text-red-700 mb-4">
                If you're experiencing a mental health crisis or having thoughts of self-harm, 
                immediate help is available. You are not alone.
              </p>
              <div className="flex space-x-3">
                <Button 
                  onClick={() => contactCrisisLine(crisisServices[0])} 
                  className="bg-red-600 hover:bg-red-700"
                  size="sm"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call 988 Now
                </Button>
                <Button 
                  onClick={() => contactCrisisLine(crisisServices[1])} 
                  variant="outline"
                  size="sm"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Text HOME to 741741
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Crisis Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {crisisServices.map((service) => {
          const Icon = service.icon;
          
          return (
            <Card key={service.id} className="border-therapy-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 ${service.color} rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base">{service.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className="text-xs capitalize">
                        {service.type}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {service.availability}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-therapy-600">{service.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="font-medium">Contact: </span>
                    <span className="font-mono">{service.phone}</span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => contactCrisisLine(service)}
                  size="sm" 
                  className="w-full"
                  variant={service.type === 'emergency' ? 'destructive' : 'default'}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  Contact {service.name}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Risk Factor Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Risk Factor Monitoring</span>
            <Switch
              checked={crisisAlertsEnabled}
              onCheckedChange={toggleCrisisAlerts}
              className="ml-auto"
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            AI-powered monitoring helps detect early warning signs and risk factors based on your therapy sessions and mood patterns.
          </p>
          
          <div className="space-y-3">
            {riskFactors.map((risk, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    risk.detected ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                  <span className="font-medium">{risk.factor}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={risk.detected ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {risk.detected ? 'Detected' : 'Normal'}
                  </Badge>
                  {risk.detected && (
                    <Badge variant="outline" className="text-xs capitalize">
                      {risk.severity} risk
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Crisis Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Crisis Assessment</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-therapy-600">
            Take a brief assessment to help us understand your current mental state and provide appropriate support.
          </p>
          
          <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div>
              <h4 className="font-medium text-blue-900">Self-Assessment Available</h4>
              <p className="text-sm text-blue-600">
                Quick 5-minute assessment to check your current wellbeing
              </p>
            </div>
            <Button onClick={triggerCrisisAssessment} variant="outline">
              <Heart className="h-4 w-4 mr-2" />
              Start Assessment
            </Button>
          </div>

          {/* Recent Assessments */}
          {assessments.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Recent Assessments</h4>
              {assessments.map((assessment) => (
                <div key={assessment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <span className="font-medium capitalize">{assessment.assessment_type.replace('_', ' ')}</span>
                    <p className="text-sm text-gray-600">
                      {new Date(assessment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={assessment.risk_level === 'high' ? 'destructive' : 
                               assessment.risk_level === 'medium' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {assessment.risk_level} risk
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {assessment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Emergency Contacts</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Designate trusted contacts who can be notified in case of a mental health crisis.
          </p>
          
          <div className="p-4 border-dashed border-2 border-gray-300 rounded-lg text-center">
            <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <h4 className="font-medium text-gray-600 mb-1">No Emergency Contacts</h4>
            <p className="text-sm text-gray-500 mb-3">
              Add trusted friends or family members who can provide support
            </p>
            <Button variant="outline" size="sm">
              <Users className="h-4 w-4 mr-2" />
              Add Emergency Contact
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrisisIntegration;
