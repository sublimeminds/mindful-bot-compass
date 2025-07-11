import React, { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  MessageCircle, 
  Shield, 
  Heart, 
  Clock, 
  Globe, 
  AlertTriangle,
  Users,
  Headphones,
  ExternalLink
} from 'lucide-react';

const CrisisSupport = () => {
  const [expandedResource, setExpandedResource] = useState<string | null>(null);

  const emergencyContacts = [
    {
      name: "National Suicide Prevention Lifeline",
      phone: "988",
      description: "24/7 crisis support in English and Spanish",
      country: "United States",
      availability: "24/7"
    },
    {
      name: "Crisis Text Line",
      phone: "Text HOME to 741741",
      description: "Free, 24/7 crisis support via text",
      country: "United States",
      availability: "24/7"
    },
    {
      name: "International Association for Suicide Prevention",
      phone: "Visit iasp.info/resources",
      description: "Global directory of crisis centers",
      country: "International",
      availability: "Varies"
    },
    {
      name: "Samaritans",
      phone: "116 123",
      description: "Free crisis support",
      country: "United Kingdom",
      availability: "24/7"
    }
  ];

  const crisisResources = [
    {
      id: "immediate",
      title: "Immediate Crisis Support",
      icon: AlertTriangle,
      color: "from-red-500 to-red-600",
      description: "If you're in immediate danger or having thoughts of self-harm",
      resources: [
        "Call emergency services (911, 999, etc.)",
        "Go to your nearest emergency room",
        "Call a crisis hotline",
        "Reach out to a trusted friend or family member"
      ]
    },
    {
      id: "support",
      title: "24/7 Support Lines",
      icon: Phone,
      color: "from-therapy-500 to-therapy-600",
      description: "Professional crisis counselors available around the clock",
      resources: [
        "National Suicide Prevention Lifeline: 988",
        "Crisis Text Line: Text HOME to 741741",
        "SAMHSA National Helpline: 1-800-662-4357",
        "Trans Lifeline: 877-565-8860"
      ]
    },
    {
      id: "online",
      title: "Online Crisis Chat",
      icon: MessageCircle,
      color: "from-calm-500 to-calm-600",
      description: "Real-time chat support when you can't talk on the phone",
      resources: [
        "Crisis Text Line Web Chat",
        "National Suicide Prevention Lifeline Chat",
        "7 Cups Crisis Support",
        "IMAlive Crisis Chat"
      ]
    },
    {
      id: "specialized",
      title: "Specialized Support",
      icon: Users,
      color: "from-harmony-500 to-harmony-600",
      description: "Targeted support for specific communities and situations",
      resources: [
        "LGBT National Hotline: 1-888-843-4564",
        "RAINN Sexual Assault Hotline: 1-800-656-4673",
        "National Domestic Violence Hotline: 1-800-799-7233",
        "Veterans Crisis Line: 1-800-273-8255"
      ]
    }
  ];

  const warningSignsData = [
    {
      category: "Emotional",
      signs: [
        "Overwhelming sadness or despair",
        "Intense anger or rage",
        "Feeling trapped or hopeless",
        "Severe mood swings",
        "Emotional numbness"
      ]
    },
    {
      category: "Behavioral",
      signs: [
        "Talking about death or suicide",
        "Withdrawing from friends and family",
        "Giving away possessions",
        "Increased substance use",
        "Reckless behavior"
      ]
    },
    {
      category: "Physical",
      signs: [
        "Changes in sleep patterns",
        "Loss of appetite",
        "Fatigue or low energy",
        "Frequent physical complaints",
        "Neglecting personal hygiene"
      ]
    }
  ];

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-therapy-50">
        {/* Emergency Banner */}
        <div className="bg-red-600 text-white py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center text-center">
              <AlertTriangle className="h-6 w-6 mr-3" />
              <div className="text-lg font-semibold">
                If you're in immediate danger, call emergency services: 911 (US), 999 (UK), 112 (EU)
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-6 bg-red-100 text-red-800 px-8 py-3 text-sm font-semibold border-red-200">
                <Shield className="h-4 w-4 mr-2" />
                Crisis Support
                <Heart className="h-4 w-4 ml-2" />
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-red-600 to-therapy-600 bg-clip-text text-transparent">
                  You Are Not Alone
                </span>
              </h1>
              
              <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
                If you're going through a crisis or having thoughts of self-harm, help is available 24/7. 
                Reach out to professional crisis counselors who understand and care.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => window.open('tel:988')}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg rounded-xl shadow-xl"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Call Crisis Hotline (988)
                </Button>
                <Button 
                  onClick={() => window.open('sms:741741')}
                  variant="outline"
                  className="border-2 border-therapy-300 text-therapy-700 px-8 py-4 text-lg rounded-xl"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Text HOME to 741741
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Crisis Resources */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 therapy-text-gradient">
              Immediate Support Resources
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {crisisResources.map((resource) => (
                <Card 
                  key={resource.id} 
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm cursor-pointer"
                  onClick={() => setExpandedResource(expandedResource === resource.id ? null : resource.id)}
                >
                  <CardHeader className="pb-4">
                    <div className={`w-16 h-16 bg-gradient-to-r ${resource.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                      <resource.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-800">{resource.title}</CardTitle>
                    <p className="text-slate-600">{resource.description}</p>
                  </CardHeader>
                  
                  {expandedResource === resource.id && (
                    <CardContent className="pt-0">
                      <ul className="space-y-3">
                        {resource.resources.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-therapy-500 rounded-full mr-3 mt-2"></div>
                            <span className="text-slate-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Warning Signs */}
        <section className="py-16 bg-gradient-to-r from-therapy-100 to-calm-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 therapy-text-gradient">
              Warning Signs to Watch For
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {warningSignsData.map((category, index) => (
                <Card key={index} className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-slate-800">{category.category} Signs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {category.signs.map((sign, signIndex) => (
                        <li key={signIndex} className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-3 mt-2"></div>
                          <span className="text-slate-700 text-sm">{sign}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* International Resources */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 therapy-text-gradient">
              International Crisis Resources
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {emergencyContacts.map((contact, index) => (
                <Card key={index} className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-slate-800">{contact.name}</h3>
                        <p className="text-therapy-600 font-semibold text-lg">{contact.phone}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {contact.country}
                      </Badge>
                    </div>
                    <p className="text-slate-600 mb-3">{contact.description}</p>
                    <div className="flex items-center text-sm text-slate-500">
                      <Clock className="h-4 w-4 mr-1" />
                      Available: {contact.availability}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Support Message */}
        <section className="py-16 bg-gradient-to-r from-therapy-600 via-therapy-700 to-calm-600 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Heart className="h-16 w-16 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Your Life Has Value
              </h2>
              <p className="text-xl text-therapy-100 mb-8">
                Crisis situations are temporary, but the support available to you is constant. 
                Professional counselors are standing by to help you through this difficult time.
              </p>
              <div className="text-lg text-therapy-100">
                Remember: Asking for help is a sign of strength, not weakness.
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default CrisisSupport;