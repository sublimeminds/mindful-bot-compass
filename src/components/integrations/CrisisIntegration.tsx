
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/SimpleAuthProvider';
import { CrisisManagementService } from '@/services/crisisManagementService';
import { 
  AlertTriangle, 
  Phone, 
  MessageSquare, 
  Shield,
  Heart,
  Users,
  Clock,
  MapPin
} from 'lucide-react';

const CrisisIntegration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [emergencyContacts, setEmergencyContacts] = useState<any[]>([]);
  const [crisisResources, setCrisisResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const crisisServices = [
    {
      id: 'crisis-text-line',
      name: 'Crisis Text Line',
      icon: MessageSquare,
      description: '24/7 crisis support via text message',
      contact: 'Text HOME to 741741',
      features: ['24/7 Availability', 'Trained Counselors', 'Confidential', 'Free Service'],
      color: 'bg-red-500',
      type: 'text'
    },
    {
      id: 'suicide-prevention',
      name: 'National Suicide Prevention Lifeline',
      icon: Phone,
      description: 'National 24-hour suicide prevention hotline',
      contact: '988',
      features: ['Immediate Support', 'Professional Staff', 'Multi-language', 'Follow-up Care'],
      color: 'bg-blue-500',
      type: 'phone'
    },
    {
      id: 'samhsa-helpline',
      name: 'SAMHSA National Helpline',
      icon: Phone,
      description: 'Mental health and substance abuse treatment referral',
      contact: '1-800-662-HELP (4357)',
      features: ['Treatment Referrals', 'Insurance Guidance', 'Local Resources', 'Family Support'],
      color: 'bg-green-500',
      type: 'phone'
    },
    {
      id: 'teen-line',
      name: 'Teen Line',
      icon: Users,
      description: 'Peer support for teenagers in crisis',
      contact: 'Text TEEN to 839863',
      features: ['Peer Support', 'Teen-focused', 'Evening Hours', 'Text & Phone'],
      color: 'bg-purple-500',
      type: 'both'
    }
  ];

  useEffect(() => {
    if (user) {
      loadCrisisData();
    }
  }, [user]);

  const loadCrisisData = async () => {
    try {
      const [contacts, resources] = await Promise.all([
        CrisisManagementService.getUserEmergencyContacts(),
        CrisisManagementService.getCrisisResources()
      ]);

      setEmergencyContacts(contacts);
      setCrisisResources(resources);
    } catch (error) {
      console.error('Error loading crisis data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addEmergencyContact = async () => {
    try {
      const contact = await CrisisManagementService.createEmergencyContact({
        contact_type: 'personal',
        name: 'Dr. Sarah Johnson',
        phone_number: '+1-555-0123',
        email: 'dr.johnson@therapycenter.com',
        relationship: 'Primary Therapist',
        is_primary: true
      });

      if (contact) {
        setEmergencyContacts([...emergencyContacts, contact]);
        toast({
          title: "Emergency Contact Added",
          description: "Contact has been added to your crisis support network",
        });
      }
    } catch (error) {
      console.error('Error adding emergency contact:', error);
    }
  };

  const createSafetyPlan = async () => {
    try {
      const safetyPlan = await CrisisManagementService.createSafetyPlan({
        plan_name: 'My Crisis Safety Plan',
        warning_signs: [
          'Feeling overwhelmed or hopeless',
          'Difficulty sleeping for multiple days',
          'Isolating from friends and family',
          'Thoughts of self-harm'
        ],
        coping_strategies: [
          'Deep breathing exercises',
          'Call a trusted friend',
          'Listen to calming music',
          'Take a warm bath',
          'Write in journal'
        ],
        social_contacts: {
          friend1: { name: 'Alex Smith', phone: '+1-555-0100' },
          family1: { name: 'Mom', phone: '+1-555-0101' }
        },
        professional_contacts: {
          therapist: { name: 'Dr. Johnson', phone: '+1-555-0123' },
          crisis_line: { name: 'Crisis Text Line', contact: 'Text HOME to 741741' }
        },
        reasons_to_live: [
          'My family needs me',
          'I want to see my goals achieved',
          'Tomorrow might be better',
          'I can help others who are struggling'
        ]
      });

      if (safetyPlan) {
        toast({
          title: "Safety Plan Created",
          description: "Your personal safety plan has been saved",
        });
      }
    } catch (error) {
      console.error('Error creating safety plan:', error);
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
      {/* Crisis Alert Banner */}
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-900 mb-1">Crisis Support Available 24/7</h3>
            <p className="text-sm text-red-600 mb-3">
              If you're experiencing a mental health crisis, immediate help is available. 
              Don't wait - reach out now.
            </p>
            <div className="flex space-x-3">
              <Button size="sm" className="bg-red-600 hover:bg-red-700">
                <Phone className="h-4 w-4 mr-2" />
                Call 988
              </Button>
              <Button size="sm" variant="outline" className="border-red-300 text-red-700">
                <MessageSquare className="h-4 w-4 mr-2" />
                Text HOME to 741741
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Crisis Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {crisisServices.map((service) => {
          const Icon = service.icon;
          
          return (
            <Card key={service.id} className="border-therapy-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 ${service.color} rounded-lg`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base">{service.name}</CardTitle>
                    <p className="text-sm text-therapy-600">{service.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-center text-therapy-900">
                    {service.contact}
                  </p>
                </div>
                
                <div>
                  <h5 className="font-medium text-therapy-900 mb-2 text-sm">Available Support</h5>
                  <div className="flex flex-wrap gap-1">
                    {service.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {service.type === 'phone' || service.type === 'both' ? (
                    <Button size="sm" className="flex-1">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </Button>
                  ) : null}
                  {service.type === 'text' || service.type === 'both' ? (
                    <Button size="sm" variant="outline" className="flex-1">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Text Now
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Emergency Contacts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Emergency Contacts</span>
            </CardTitle>
            <Button onClick={addEmergencyContact} size="sm">
              Add Contact
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {emergencyContacts.length > 0 ? (
            <div className="space-y-3">
              {emergencyContacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-gray-600">{contact.relationship}</p>
                      <p className="text-sm text-gray-500">{contact.phone_number}</p>
                    </div>
                  </div>
                  {contact.is_primary && (
                    <Badge variant="default">Primary</Badge>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No emergency contacts added yet</p>
              <Button onClick={addEmergencyContact} size="sm" className="mt-2">
                Add Your First Contact
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Safety Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Personal Safety Plan</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-therapy-600">
              A safety plan is a personalized, practical plan that can help you stay safe when having suicidal thoughts. 
              It includes strategies to help you cope with difficult emotions and situations.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />
                  Warning Signs
                </h4>
                <p className="text-sm text-gray-600">Identify personal warning signs of crisis</p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2 flex items-center">
                  <Heart className="h-4 w-4 mr-2 text-red-500" />
                  Coping Strategies
                </h4>
                <p className="text-sm text-gray-600">Personal strategies to manage difficult emotions</p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2 flex items-center">
                  <Users className="h-4 w-4 mr-2 text-blue-500" />
                  Support Network
                </h4>
                <p className="text-sm text-gray-600">Friends, family, and professionals to contact</p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2 flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-green-500" />
                  Environmental Safety
                </h4>
                <p className="text-sm text-gray-600">Steps to make your environment safer</p>
              </div>
            </div>
            
            <Button onClick={createSafetyPlan} className="w-full">
              Create My Safety Plan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Crisis Resources */}
      {crisisResources.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Local Crisis Resources</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {crisisResources.slice(0, 3).map((resource) => (
                <div key={resource.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{resource.name}</h4>
                      <p className="text-sm text-gray-600">{resource.description}</p>
                      {resource.phone_number && (
                        <p className="text-sm font-medium text-blue-600 mt-1">
                          {resource.phone_number}
                        </p>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {resource.resource_type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CrisisIntegration;
