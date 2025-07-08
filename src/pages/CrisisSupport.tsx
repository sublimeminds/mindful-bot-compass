
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Phone, MessageCircle, MapPin, Clock, AlertTriangle, Heart, Shield, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSafeSEO } from '@/hooks/useSafeSEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CrisisDetectionService, SafetyResource } from '@/services/crisisDetectionService';

const CrisisSupport = () => {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState<{ country: string; region: string } | null>(null);
  const [crisisResources, setCrisisResources] = useState<SafetyResource[]>([]);

  useSafeSEO({
    title: 'Crisis Support - Immediate Mental Health Resources',
    description: 'Get immediate help for mental health emergencies. 24/7 crisis support, hotlines, and emergency resources.',
    keywords: 'mental health crisis, suicide prevention, emergency support, crisis hotline, immediate help'
  });

  useEffect(() => {
    // Detect user location for localized resources
    const detectLocation = async () => {
      try {
        // This would typically use a geolocation service
        setUserLocation({ country: 'United States', region: 'North America' });
      } catch (error) {
        console.log('Could not detect location for crisis resources');
      }
    };
    
    const loadCrisisResources = async () => {
      try {
        const resources = await CrisisDetectionService.getCrisisResources('default');
        setCrisisResources(resources);
      } catch (error) {
        console.error('Error loading crisis resources:', error);
      }
    };
    
    detectLocation();
    loadCrisisResources();
  }, []);

  const internationalResources = [
    { country: 'United States', phone: '988', name: 'Suicide & Crisis Lifeline' },
    { country: 'Canada', phone: '1-833-456-4566', name: 'Talk Suicide Canada' },
    { country: 'United Kingdom', phone: '116 123', name: 'Samaritans' },
    { country: 'Australia', phone: '13 11 14', name: 'Lifeline Australia' },
    { country: 'Germany', phone: '0800 111 0 111', name: 'Nummer gegen Kummer' },
    { country: 'France', phone: '3114', name: 'Numéro national français' },
    { country: 'Japan', phone: '0570-783-556', name: 'Japan Suicide Prevention' },
    { country: 'India', phone: '91-22-2754-6669', name: 'Aasra' }
  ];

  const crisisSignsCheck = [
    'Thoughts of suicide or self-harm',
    'Feeling like there\'s no way out',
    'Extreme mood swings',
    'Withdrawal from friends and activities',
    'Increased substance use',
    'Giving away possessions',
    'Talking about death or dying',
    'Feeling trapped or in unbearable pain'
  ];

  const immediateActions = [
    {
      title: 'Call 911',
      description: 'For immediate life-threatening emergencies',
      action: 'tel:911',
      color: 'bg-red-600 hover:bg-red-700',
      icon: Phone
    },
    {
      title: 'Crisis Lifeline: 988',
      description: '24/7 free and confidential support',
      action: 'tel:988',
      color: 'bg-blue-600 hover:bg-blue-700',
      icon: Phone
    },
    {
      title: 'Crisis Text Line',
      description: 'Text HOME to 741741',
      action: 'sms:741741?body=HOME',
      color: 'bg-green-600 hover:bg-green-700',
      icon: MessageCircle
    },
    {
      title: 'Emergency Contact',
      description: 'Call your designated emergency contact',
      action: () => navigate('/profile#emergency-contacts'),
      color: 'bg-purple-600 hover:bg-purple-700',
      icon: User
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      <Header />
      
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          {/* Emergency Alert */}
          <Alert className="mb-8 border-red-300 bg-red-50">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <AlertDescription className="text-red-800 font-medium">
              <strong>If you are in immediate danger, please call 911 or go to your nearest emergency room.</strong>
              <br />
              This page provides crisis support resources. Help is available 24/7.
            </AlertDescription>
          </Alert>

          <div className="text-center mb-16">
            <Badge className="mb-6 bg-red-600 text-white px-8 py-3 text-sm font-semibold shadow-lg border-0">
              <Shield className="h-4 w-4 mr-2" />
              Crisis Support - Available 24/7
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-red-600">
                You Are Not Alone
              </span>
            </h1>
            
            <p className="text-xl text-slate-700 max-w-3xl mx-auto mb-8">
              If you're experiencing a mental health crisis, immediate help is available. 
              Trained counselors are standing by to provide support, hope, and resources.
            </p>
          </div>

          {/* Immediate Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {immediateActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Card key={index} className="hover:shadow-2xl transition-all duration-300 border-0">
                  <CardContent className="pt-6 text-center">
                    <Button
                      className={`w-full h-24 text-white ${action.color} mb-4 flex flex-col items-center justify-center space-y-2`}
                      onClick={() => {
                        if (typeof action.action === 'string' && action.action.startsWith('tel:')) {
                          window.location.href = action.action;
                        } else if (typeof action.action === 'string' && action.action.startsWith('sms:')) {
                          window.location.href = action.action;
                        } else if (typeof action.action === 'function') {
                          action.action();
                        }
                      }}
                    >
                      <IconComponent className="h-8 w-8" />
                      <span className="font-bold">{action.title}</span>
                    </Button>
                    <p className="text-sm text-slate-600">{action.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Crisis Resources */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <Card className="bg-white shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-red-700">
                  <Phone className="h-6 w-6 mr-2" />
                  Crisis Hotlines & Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {crisisResources.map((resource, index) => (
                  <div key={index} className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-red-800">{resource.title}</h4>
                      <Badge className="bg-red-100 text-red-800">
                        <Clock className="h-3 w-3 mr-1" />
                        {resource.availability}
                      </Badge>
                    </div>
                    <p className="text-sm text-red-700 mb-2">{resource.description}</p>
                    <Button
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => window.location.href = `tel:${resource.contact_info}`}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call {resource.contact_info}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-white shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-700">
                  <Heart className="h-6 w-6 mr-2" />
                  Crisis Warning Signs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-700 mb-4">
                  If you or someone you know is experiencing these signs, please reach out for help immediately:
                </p>
                <ul className="space-y-2">
                  {crisisSignsCheck.map((sign, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-700">{sign}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm text-orange-800 font-medium">
                    Remember: Crisis is temporary. Treatment works. Hope is real.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* International Resources */}
          <Card className="mb-16 bg-white shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-6 w-6 mr-2 text-blue-600" />
                International Crisis Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {internationalResources.map((resource, index) => (
                  <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-1">{resource.country}</h4>
                    <p className="text-sm text-blue-700 mb-2">{resource.name}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-blue-300 text-blue-700 hover:bg-blue-100"
                      onClick={() => window.location.href = `tel:${resource.phone}`}
                    >
                      <Phone className="h-3 w-3 mr-2" />
                      {resource.phone}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Support */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-therapy-600 to-calm-600 text-white p-12 shadow-2xl">
              <h2 className="text-3xl font-bold mb-6">After the Crisis</h2>
              <p className="text-therapy-100 mb-8 max-w-2xl mx-auto">
                Crisis support is just the beginning. Our AI therapy platform provides ongoing support 
                to help you build resilience, develop coping strategies, and maintain your mental wellness.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-white text-therapy-600 hover:bg-therapy-50 px-8 py-4 text-lg font-bold rounded-xl"
                  onClick={() => navigate('/therapy-chat')}
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Start AI Therapy Session
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-bold rounded-xl backdrop-blur-sm"
                  onClick={() => navigate('/support')}
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Get Additional Support
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CrisisSupport;
