
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Phone, MessageSquare, Clock, Shield, AlertTriangle } from 'lucide-react';
import { useSafeSEO } from '@/hooks/useSafeSEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CrisisResources = () => {
  useSafeSEO({
    title: 'Crisis Resources - Emergency Mental Health Support',
    description: '24/7 crisis support resources, emergency hotlines, and immediate mental health assistance.',
    keywords: 'mental health crisis, emergency support, suicide prevention, crisis hotline'
  });

  const crisisResources = [
    {
      title: "National Suicide Prevention Lifeline",
      phone: "988",
      description: "Free, confidential support 24/7",
      available: "24/7"
    },
    {
      title: "Crisis Text Line",
      phone: "Text HOME to 741741",
      description: "Text-based crisis support",
      available: "24/7"
    },
    {
      title: "SAMHSA National Helpline",
      phone: "1-800-662-4357",
      description: "Treatment referral and information service",
      available: "24/7"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-therapy-50">
      <Header />
      
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-red-500 text-white px-8 py-3 text-sm font-semibold shadow-lg border-0">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Crisis Support
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-red-600 to-therapy-600 bg-clip-text text-transparent">
                Immediate Help Available
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              If you're in crisis or having thoughts of suicide, help is available right now. 
              You're not alone, and your life has value.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {crisisResources.map((resource, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 bg-white border-red-200 shadow-lg">
                <CardHeader>
                  <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Phone className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-800">{resource.title}</CardTitle>
                  <p className="text-slate-600">{resource.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600 mb-4">{resource.phone}</div>
                  <div className="flex items-center justify-center gap-2 text-sm text-red-600 mb-4">
                    <Clock className="h-4 w-4" />
                    {resource.available}
                  </div>
                  <Button className="bg-red-500 hover:bg-red-600 text-white border-0 w-full">
                    Call Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Card className="bg-red-500 text-white p-12 shadow-2xl">
              <Shield className="h-16 w-16 mx-auto mb-6 opacity-80" />
              <h2 className="text-3xl font-bold mb-6">You Are Not Alone</h2>
              <p className="text-red-100 mb-8 max-w-2xl mx-auto">
                Crisis support is available 24/7. These resources are free, confidential, 
                and staffed by trained professionals who care about your wellbeing.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CrisisResources;
