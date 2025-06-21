
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Phone, 
  Brain, 
  Clock, 
  AlertTriangle, 
  Heart,
  Users,
  MessageCircle,
  CheckCircle,
  ArrowRight,
  Zap,
  Eye,
  Activity,
  Headphones
} from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';

const CrisisManagement = () => {
  const navigate = useNavigate();
  
  useSEO({
    title: 'Crisis Management - 24/7 AI-Powered Support | TherapySync',
    description: 'Advanced crisis detection and intervention with 24/7 support, real-time monitoring, and immediate emergency response.',
    keywords: 'crisis management, emergency support, mental health crisis, 24/7 support, suicide prevention'
  });

  const crisisFeatures = [
    {
      title: "24/7 Crisis Detection",
      description: "AI continuously monitors conversations for crisis indicators",
      icon: Eye,
      features: ["Real-time analysis", "Pattern recognition", "Immediate alerts"],
      availability: "All Plans"
    },
    {
      title: "Instant Emergency Response",
      description: "Automatic escalation to human crisis counselors",
      icon: Zap,
      features: ["< 30 second response", "Trained professionals", "Local emergency services"],
      availability: "Premium+"
    },
    {
      title: "Crisis Intervention Protocols",
      description: "Evidence-based crisis intervention techniques",
      icon: Shield,
      features: ["De-escalation strategies", "Safety planning", "Follow-up care"],
      availability: "All Plans"
    },
    {
      title: "24/7 Human Support",
      description: "Always-available human crisis counselors",
      icon: Headphones,
      features: ["Licensed professionals", "Multilingual support", "Confidential"],
      availability: "Premium+"
    }
  ];

  const emergencyContacts = [
    {
      service: "National Suicide Prevention Lifeline",
      number: "988",
      description: "24/7 free and confidential support",
      availability: "United States"
    },
    {
      service: "Crisis Text Line",
      number: "Text HOME to 741741",
      description: "24/7 crisis support via text",
      availability: "United States, Canada, UK"
    },
    {
      service: "International Association for Suicide Prevention",
      number: "Various by country",
      description: "Global crisis helplines directory",
      availability: "Worldwide"
    }
  ];

  const warningSign = [
    "Talking about wanting to die or kill themselves",
    "Looking for ways to kill themselves",
    "Talking about feeling hopeless or having no reason to live",
    "Talking about feeling trapped or in unbearable pain",
    "Talking about being a burden to others",
    "Increasing use of alcohol or drugs",
    "Acting anxious or agitated",
    "Withdrawing from family and friends",
    "Changing eating and sleeping habits",
    "Showing rage or talking about seeking revenge"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-2">
            <Shield className="h-4 w-4 mr-2" />
            24/7 Crisis Support
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Crisis Management &
            <span className="block bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Emergency Support
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Advanced AI-powered crisis detection with immediate human intervention. 
            We're here 24/7 to provide support when you need it most.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white"
              onClick={() => navigate('/crisis-resources')}
            >
              <Phone className="h-5 w-5 mr-2" />
              Get Immediate Help
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/therapysync-ai')}
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Start Safe Conversation
            </Button>
          </div>

          {/* Emergency Notice */}
          <div className="bg-red-100 border border-red-300 rounded-lg p-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-center text-red-800">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <strong>If you're in immediate danger, call 911 or your local emergency number</strong>
            </div>
          </div>
        </div>

        {/* Crisis Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {crisisFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="outline">{feature.availability}</Badge>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.features.map((item, i) => (
                      <li key={i} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* How It Works */}
        <Card className="mb-16">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-4">How Crisis Detection Works</CardTitle>
            <p className="text-slate-600">Our AI continuously monitors for crisis indicators and responds immediately</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">AI Detection</h3>
                <p className="text-sm text-slate-600">Advanced AI analyzes language patterns and emotional indicators</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Risk Assessment</h3>
                <p className="text-sm text-slate-600">Immediate risk level evaluation and appropriate response determination</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Human Intervention</h3>
                <p className="text-sm text-slate-600">Trained crisis counselors join the conversation within seconds</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Ongoing Support</h3>
                <p className="text-sm text-slate-600">Continuous monitoring and follow-up care coordination</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Warning Signs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Eye className="h-5 w-5 mr-2" />
                Warning Signs to Watch For
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {warningSign.map((sign, index) => (
                  <li key={index} className="flex items-start">
                    <AlertTriangle className="h-4 w-4 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{sign}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Phone className="h-5 w-5 mr-2" />
                Emergency Contacts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emergencyContacts.map((contact, index) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-lg">
                    <h3 className="font-semibold text-slate-900 mb-1">{contact.service}</h3>
                    <p className="text-lg font-bold text-red-600 mb-1">{contact.number}</p>
                    <p className="text-sm text-slate-600 mb-1">{contact.description}</p>
                    <Badge variant="outline" className="text-xs">{contact.availability}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="border-0 bg-gradient-to-r from-red-500 to-orange-500 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">You're Not Alone</h2>
            <p className="text-red-100 mb-8 max-w-2xl mx-auto text-lg">
              Our crisis management system is here to support you 24/7. Whether you need immediate help 
              or want to talk to someone, we're here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-white text-red-600 hover:bg-red-50"
                onClick={() => navigate('/crisis-resources')}
              >
                <Shield className="h-5 w-5 mr-2" />
                Get Help Now
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
                onClick={() => navigate('/register')}
              >
                <Heart className="h-5 w-5 mr-2" />
                Join Our Community
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default CrisisManagement;
