import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle,
  Phone,
  Shield,
  Heart,
  Users,
  MessageCircle,
  Clock,
  CheckCircle,
  MapPin,
  Activity,
  Brain,
  Target
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CrisisResource {
  name: string;
  phone: string;
  type: 'hotline' | 'emergency' | 'text' | 'chat';
  availability: string;
  description: string;
}

interface SafetyPlanItem {
  id: string;
  category: string;
  title: string;
  content: string;
  order: number;
}

interface CrisisAssessment {
  id: string;
  risk_level: string;
  assessment_type: string;
  severity_indicators: string[];
  created_at: string;
}

const EnhancedCrisisManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [riskLevel, setRiskLevel] = useState<'low' | 'moderate' | 'high' | 'crisis'>('low');
  const [safetyPlan, setSafetyPlan] = useState<SafetyPlanItem[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<any[]>([]);
  const [recentAssessments, setRecentAssessments] = useState<CrisisAssessment[]>([]);
  const [isCreatingSafetyPlan, setIsCreatingSafetyPlan] = useState(false);

  const crisisResources: CrisisResource[] = [
    {
      name: '988 Suicide & Crisis Lifeline',
      phone: '988',
      type: 'hotline',
      availability: '24/7',
      description: 'Free and confidential emotional support for people in suicidal crisis or emotional distress'
    },
    {
      name: 'Crisis Text Line',
      phone: 'Text HOME to 741741',
      type: 'text',
      availability: '24/7',
      description: 'Free, 24/7 crisis support via text message'
    },
    {
      name: 'Emergency Services',
      phone: '911',
      type: 'emergency',
      availability: '24/7',
      description: 'For immediate life-threatening emergencies'
    },
    {
      name: 'SAMHSA National Helpline',
      phone: '1-800-662-4357',
      type: 'hotline',
      availability: '24/7',
      description: 'Treatment referral and information service for mental health and substance use disorders'
    },
    {
      name: 'Crisis Chat',
      phone: 'suicidepreventionlifeline.org/chat',
      type: 'chat',
      availability: '24/7',
      description: 'Online crisis chat support'
    }
  ];

  useEffect(() => {
    if (user) {
      fetchSafetyPlan();
      fetchEmergencyContacts();
      fetchRecentAssessments();
      assessCurrentRisk();
    }
  }, [user]);

  const fetchSafetyPlan = async () => {
    try {
      const { data, error } = await supabase
        .from('safety_plans')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        const planItems: SafetyPlanItem[] = [
          { id: '1', category: 'warning_signs', title: 'Warning Signs', content: data.warning_signs?.join(', ') || '', order: 1 },
          { id: '2', category: 'coping_strategies', title: 'Coping Strategies', content: data.coping_strategies?.join(', ') || '', order: 2 },
          { id: '3', category: 'reasons_to_live', title: 'Reasons to Live', content: data.reasons_to_live?.join(', ') || '', order: 3 },
          { id: '4', category: 'social_contacts', title: 'Social Contacts', content: JSON.stringify(data.social_contacts), order: 4 },
          { id: '5', category: 'professional_contacts', title: 'Professional Contacts', content: JSON.stringify(data.professional_contacts), order: 5 },
          { id: '6', category: 'environment_safety', title: 'Environment Safety', content: data.environment_safety?.join(', ') || '', order: 6 }
        ];
        setSafetyPlan(planItems);
      }
    } catch (error) {
      console.error('Error fetching safety plan:', error);
    }
  };

  const fetchEmergencyContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_active', true)
        .order('is_primary', { ascending: false });

      if (error) throw error;
      setEmergencyContacts(data || []);
    } catch (error) {
      console.error('Error fetching emergency contacts:', error);
    }
  };

  const fetchRecentAssessments = async () => {
    try {
      const { data, error } = await supabase
        .from('crisis_assessments')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setRecentAssessments(data || []);
    } catch (error) {
      console.error('Error fetching assessments:', error);
    }
  };

  const assessCurrentRisk = async () => {
    try {
      // Get latest assessment
      const { data, error } = await supabase
        .from('crisis_assessments')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      
      if (data && data.length > 0) {
        setRiskLevel(data[0].risk_level as any);
      }
    } catch (error) {
      console.error('Error assessing risk:', error);
    }
  };

  const createSafetyPlan = async () => {
    setIsCreatingSafetyPlan(true);
    
    try {
      const { error } = await supabase.functions.invoke('create-safety-plan', {
        body: { userId: user?.id }
      });

      if (error) throw error;

      await fetchSafetyPlan();
      
      toast({
        title: "Safety Plan Created",
        description: "Your personalized safety plan has been created and is ready to use.",
      });
    } catch (error) {
      console.error('Error creating safety plan:', error);
      toast({
        title: "Error",
        description: "Failed to create safety plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingSafetyPlan(false);
    }
  };

  const triggerCrisisIntervention = async () => {
    try {
      const { error } = await supabase.functions.invoke('trigger-crisis-intervention', {
        body: { 
          userId: user?.id,
          riskLevel: 'crisis',
          context: 'Manual crisis intervention triggered by user'
        }
      });

      if (error) throw error;

      toast({
        title: "🚨 Crisis Support Activated",
        description: "Emergency protocols have been initiated. Help is on the way.",
        variant: "destructive",
      });
    } catch (error) {
      console.error('Error triggering crisis intervention:', error);
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'crisis': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'moderate': return 'bg-yellow-500 text-black';
      default: return 'bg-green-500 text-white';
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'hotline': return Phone;
      case 'text': return MessageCircle;
      case 'chat': return MessageCircle;
      default: return Phone;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-therapy-600" />
          <h2 className="text-2xl font-bold">Crisis Management & Safety</h2>
        </div>
        <Badge className={getRiskLevelColor(riskLevel)}>
          <AlertTriangle className="h-3 w-3 mr-1" />
          {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk
        </Badge>
      </div>

      {/* Crisis Alert */}
      {(riskLevel === 'crisis' || riskLevel === 'high') && (
        <Alert className="border-red-500 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-700">
            <div className="flex justify-between items-center">
              <span>
                {riskLevel === 'crisis' 
                  ? 'Crisis level detected. Immediate support is available.' 
                  : 'Elevated risk detected. Consider reaching out for support.'}
              </span>
              <Button variant="destructive" size="sm" onClick={triggerCrisisIntervention}>
                Get Help Now
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="resources" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="resources">Crisis Resources</TabsTrigger>
          <TabsTrigger value="safety-plan">Safety Plan</TabsTrigger>
          <TabsTrigger value="contacts">Emergency Contacts</TabsTrigger>
          <TabsTrigger value="monitoring">Risk Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="resources">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {crisisResources.map((resource, index) => {
              const IconComponent = getResourceIcon(resource.type);
              return (
                <Card key={index} className={`${
                  resource.type === 'emergency' ? 'border-red-500 bg-red-50' : ''
                }`}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="h-5 w-5" />
                        <span className="text-lg">{resource.name}</span>
                      </div>
                      <Badge variant="outline">{resource.availability}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="font-mono text-lg font-bold">
                        {resource.phone}
                      </div>
                      <div className="flex space-x-2">
                        {resource.type === 'hotline' || resource.type === 'emergency' ? (
                          <Button 
                            size="sm" 
                            className={resource.type === 'emergency' ? 'bg-red-600 hover:bg-red-700' : ''}
                            onClick={() => window.open(`tel:${resource.phone}`, '_self')}
                          >
                            <Phone className="h-4 w-4 mr-1" />
                            Call Now
                          </Button>
                        ) : resource.type === 'chat' ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(resource.phone, '_blank')}
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Start Chat
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Text
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="safety-plan">
          <div className="space-y-4">
            {safetyPlan.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Create Your Safety Plan
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center py-8">
                  <Shield className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">No Safety Plan Found</h3>
                  <p className="text-gray-600 mb-6">
                    A safety plan is a personalized guide to help you cope with difficult moments and stay safe.
                  </p>
                  <Button onClick={createSafetyPlan} disabled={isCreatingSafetyPlan}>
                    {isCreatingSafetyPlan ? (
                      <>
                        <Activity className="h-4 w-4 mr-2 animate-spin" />
                        Creating Plan...
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4 mr-2" />
                        Create Safety Plan
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {safetyPlan.map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-therapy-50 p-4 rounded-lg">
                        {item.category === 'social_contacts' || item.category === 'professional_contacts' ? (
                          <div className="space-y-2">
                            {Object.entries(JSON.parse(item.content || '{}')).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="font-medium capitalize">{key.replace('_', ' ')}:</span>
                                <span>{value as string}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p>{item.content}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="contacts">
          <div className="space-y-4">
            {emergencyContacts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">No Emergency Contacts</h3>
                  <p className="text-gray-600 mb-6">
                    Add trusted people you can reach out to in times of crisis.
                  </p>
                  <Button>
                    <Users className="h-4 w-4 mr-2" />
                    Add Emergency Contact
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {emergencyContacts.map((contact) => (
                  <Card key={contact.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Heart className="h-5 w-5 text-red-500" />
                          <span>{contact.name}</span>
                        </div>
                        {contact.is_primary && (
                          <Badge variant="outline" className="bg-therapy-100">
                            Primary
                          </Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">Relationship:</span>
                          <span>{contact.relationship}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Phone:</span>
                          <span>{contact.phone_number}</span>
                        </div>
                        {contact.email && (
                          <div className="flex justify-between">
                            <span className="font-medium">Email:</span>
                            <span>{contact.email}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2 mt-4">
                        <Button size="sm" onClick={() => window.open(`tel:${contact.phone_number}`, '_self')}>
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                        {contact.email && (
                          <Button variant="outline" size="sm" onClick={() => window.open(`mailto:${contact.email}`, '_self')}>
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Email
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="monitoring">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  Current Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Risk Level:</span>
                    <Badge className={getRiskLevelColor(riskLevel)}>
                      {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <span className="font-medium">Assessment Date:</span>
                    <p className="text-sm text-gray-600">
                      {recentAssessments.length > 0 
                        ? new Date(recentAssessments[0].created_at).toLocaleDateString()
                        : 'No recent assessments'}
                    </p>
                  </div>

                  <Button className="w-full">
                    <Activity className="h-4 w-4 mr-2" />
                    Take Risk Assessment
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Assessment History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentAssessments.length > 0 ? (
                  <div className="space-y-3">
                    {recentAssessments.map((assessment) => (
                      <div key={assessment.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${getRiskLevelColor(assessment.risk_level)}`} />
                          <div>
                            <div className="font-medium capitalize">{assessment.risk_level} Risk</div>
                            <div className="text-sm text-gray-500">
                              {new Date(assessment.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {assessment.assessment_type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No assessment history available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedCrisisManager;