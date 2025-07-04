
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LifeBuoy, MessageSquare, Book, Phone, Mail, Clock } from 'lucide-react';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';
import { useSafeSEO } from '@/hooks/useSafeSEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Help = () => {
  const { navigate } = useSafeNavigation();
  
  useSafeSEO({
    title: 'Help Center - TherapySync Support',
    description: 'Get help with TherapySync. Find answers, contact support, and access resources for your mental health journey.',
    keywords: 'TherapySync help, mental health support, AI therapy help, customer service'
  });

  const supportOptions = [
    {
      icon: MessageSquare,
      title: "Live Chat Support",
      description: "Get instant help from our support team",
      action: "Start Chat",
      available: "24/7"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us detailed questions or feedback",
      action: "Send Email",
      available: "Response within 24hrs"
    },
    {
      icon: Phone,
      title: "Crisis Hotline",
      description: "Immediate support for mental health emergencies",
      action: "Call Now",
      available: "24/7 Emergency"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-white to-calm-50">
      <Header />
      
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-6 therapy-gradient-bg text-white px-8 py-3 text-sm font-semibold shadow-lg border-0">
              <LifeBuoy className="h-4 w-4 mr-2" />
              Help Center
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="therapy-text-gradient-animated">
                We're Here to Help
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Get the support you need for your mental health journey. Our team is available 24/7 
              to help you make the most of TherapySync.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {supportOptions.map((option, index) => {
              const IconComponent = option.icon;
              return (
                <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <div className="w-16 h-16 therapy-gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-800">{option.title}</CardTitle>
                    <p className="text-slate-600">{option.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center gap-2 text-sm text-therapy-600 mb-4">
                      <Clock className="h-4 w-4" />
                      {option.available}
                    </div>
                    <Button className="therapy-gradient-bg text-white border-0 w-full">
                      {option.action}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center">
            <Card className="therapy-gradient-bg text-white p-12 shadow-2xl">
              <h2 className="text-3xl font-bold mb-6">Need Immediate Support?</h2>
              <p className="text-therapy-100 mb-8">
                If you're experiencing a mental health crisis, please reach out immediately.
              </p>
              <Button 
                size="lg"
                className="bg-white text-therapy-600 hover:bg-therapy-50 px-8 py-4 text-lg font-bold rounded-xl"
                onClick={() => navigate('/crisis-resources')}
              >
                Crisis Resources
              </Button>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Help;
