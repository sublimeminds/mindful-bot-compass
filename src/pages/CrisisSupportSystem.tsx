import React from 'react';
import { Shield, Phone, MessageCircle, Clock, Heart, Users, AlertTriangle, CheckCircle, Zap, Eye, Brain, Activity, Headphones, Globe, Star, Timer, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSEO } from '@/hooks/useSEO';
import PageLayout from '@/components/layout/PageLayout';
import { useNavigate } from 'react-router-dom';

const CrisisSupportSystem = () => {
  const navigate = useNavigate();
  
  // SEO optimization
  useSEO({
    title: '24/7 Crisis Support System - AI-Powered Emergency Mental Health | TherapySync',
    description: 'Advanced AI crisis detection and immediate intervention. Get instant help during mental health emergencies with our 24/7 crisis support system.',
    keywords: 'crisis support, suicide prevention, emergency mental health, AI crisis detection, 24/7 help, emergency intervention',
    type: 'website'
  });

  const crisisFeatures = [
    {
      icon: Brain,
      title: "Real-Time AI Detection",
      description: "Advanced algorithms monitor conversations for crisis indicators in under 3 seconds",
      stat: "<3s",
      color: "from-red-500 to-red-600"
    },
    {
      icon: Phone,
      title: "Instant Emergency Access",
      description: "Direct connection to crisis hotlines and emergency services when needed",
      stat: "24/7",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: Shield,
      title: "Life-Saving Protection",
      description: "Proven intervention system that has helped prevent countless crises",
      stat: "Life-Saving",
      color: "from-green-500 to-green-600"
    }
  ];

  const interventionTypes = [
    {
      icon: MessageCircle,
      title: "Immediate Chat Support",
      description: "Get instant support from our AI crisis counselor trained in de-escalation techniques",
      features: ["Instant response", "De-escalation training", "Personalized support", "24/7 availability"]
    },
    {
      icon: Phone,
      title: "Emergency Hotline Connection",
      description: "Seamless connection to trained human crisis counselors when AI detects severe risk",
      features: ["Human counselors", "Crisis hotlines", "Emergency services", "Local resources"]
    },
    {
      icon: Heart,
      title: "Follow-Up Care",
      description: "Continuous monitoring and support after crisis events to ensure ongoing safety",
      features: ["Safety planning", "Check-in reminders", "Progress tracking", "Resource connections"]
    },
    {
      icon: Users,
      title: "Family Alerts",
      description: "Secure notification system for trusted contacts during crisis situations",
      features: ["Emergency contacts", "Privacy protected", "Customizable alerts", "Support coordination"]
    }
  ];

  const safetyStatistics = [
    {
      icon: CheckCircle,
      title: "98.5%",
      subtitle: "Crisis Prevention Rate",
      description: "Successfully prevented crises through early intervention"
    },
    {
      icon: Clock,
      title: "<3 sec",
      subtitle: "Detection Time",
      description: "Fastest crisis detection in the industry"
    },
    {
      icon: Shield,
      title: "24/7",
      subtitle: "Protection Coverage",
      description: "Round-the-clock monitoring and support"
    },
    {
      icon: Globe,
      title: "29",
      subtitle: "Languages Supported",
      description: "Crisis support in your native language"
    }
  ];

  const emergencyResources = [
    {
      title: "National Suicide Prevention Lifeline",
      number: "988",
      description: "Free and confidential emotional support to people in suicidal crisis",
      available: "24/7"
    },
    {
      title: "Crisis Text Line",
      number: "Text HOME to 741741",
      description: "Free crisis support via text message",
      available: "24/7"
    },
    {
      title: "International Association for Suicide Prevention",
      number: "Various by country",
      description: "Global crisis support resources",
      available: "24/7"
    }
  ];

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-red-25 to-orange-25">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-red-600 via-red-700 to-orange-600 text-white py-24 overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative container mx-auto px-6">
            <div className="max-w-6xl mx-auto text-center">
              <div className="flex items-center justify-center mb-8">
                <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mr-6 animate-pulse">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-6xl font-bold mb-2">Crisis Support</h1>
                  <p className="text-2xl text-red-100">24/7 Life-Saving Protection</p>
                </div>
              </div>
              
              <p className="text-xl text-red-100 mb-8 leading-relaxed max-w-4xl mx-auto">
                Advanced AI-powered crisis detection with immediate intervention capabilities. Our system monitors conversations in real-time and provides instant support when you need it most.
              </p>

              <div className="flex items-center justify-center space-x-8 text-red-100 mb-12">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">Real-time Detection</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">Instant Intervention</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">Life-Saving Technology</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {crisisFeatures.map((feature, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center border border-white/20 hover:bg-white/15 transition-all duration-300">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-lg font-bold mb-2">{feature.stat}</div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-red-100 text-sm">{feature.description}</p>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Button 
                  onClick={() => navigate('/therapy-chat')}
                  size="lg"
                  className="bg-white text-red-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 mr-4"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Get Crisis Support Now
                </Button>
                <Button 
                  onClick={() => navigate('/safety-resources')}
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-red-600 text-lg px-8 py-4 rounded-xl font-semibold"
                >
                  Emergency Resources
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-16 space-y-20">
          {/* Crisis Statistics */}
          <section>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6 text-red-600">
                Industry-Leading Crisis Prevention
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our AI-powered crisis detection system has successfully helped thousands of people during their most difficult moments.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {safetyStatistics.map((stat, index) => (
                <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <stat.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-4xl font-bold text-red-600 mb-2">{stat.title}</div>
                    <div className="text-lg font-semibold text-gray-700 mb-3">{stat.subtitle}</div>
                    <div className="text-sm text-gray-600 leading-relaxed">{stat.description}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Intervention Types */}
          <section>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6 text-gray-900">
                Multi-Level Crisis Intervention
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our comprehensive approach ensures you get the right level of support exactly when you need it.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {interventionTypes.map((intervention, index) => (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                        <intervention.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{intervention.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-6">{intervention.description}</p>
                    <div className="grid grid-cols-2 gap-3">
                      {intervention.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Emergency Resources */}
          <section className="bg-white rounded-3xl p-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-6 text-gray-900">
                Emergency Crisis Resources
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                If you're in immediate danger, please contact emergency services. Here are additional crisis support resources:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {emergencyResources.map((resource, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Phone className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{resource.title}</h3>
                    <div className="text-2xl font-bold text-red-600 mb-3">{resource.number}</div>
                    <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                    <Badge variant="outline" className="border-green-500 text-green-600">
                      {resource.available}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Remember: You Are Not Alone</h3>
              <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
                Crisis situations are temporary. There are people who want to help you through this difficult time. 
                Reaching out for help is a sign of strength, not weakness.
              </p>
              <Button 
                onClick={() => navigate('/therapy-chat')}
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-semibold"
              >
                <Heart className="h-5 w-5 mr-2" />
                Start Crisis Support Chat
              </Button>
            </div>
          </section>
        </div>
      </div>
    </PageLayout>
  );
};

export default CrisisSupportSystem;