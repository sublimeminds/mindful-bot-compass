
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, MessageSquare, ExternalLink, AlertTriangle } from 'lucide-react';

const CrisisResourcesPage = () => {
  const resources = [
    {
      name: "National Suicide Prevention Lifeline",
      phone: "988",
      description: "24/7 crisis support for suicide prevention",
      type: "phone"
    },
    {
      name: "Crisis Text Line",
      phone: "Text HOME to 741741",
      description: "24/7 text-based crisis support",
      type: "text"
    },
    {
      name: "National Domestic Violence Hotline",
      phone: "1-800-799-7233",
      description: "Support for domestic violence situations",
      type: "phone"
    },
    {
      name: "SAMHSA National Helpline",
      phone: "1-800-662-4357",
      description: "Mental health and substance abuse support",
      type: "phone"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50/30 to-balance-50/30">
      <Header />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <AlertTriangle className="h-16 w-16 text-therapy-500 mx-auto mb-4" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6 therapy-text-gradient">
              Crisis Resources
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Immediate help is available. These resources provide 24/7 support during mental health crises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {resources.map((resource, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-2 border-therapy-200">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-2">
                    {resource.type === 'phone' ? (
                      <Phone className="h-6 w-6 text-therapy-500" />
                    ) : (
                      <MessageSquare className="h-6 w-6 text-therapy-500" />
                    )}
                    <CardTitle className="text-therapy-800">{resource.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{resource.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-therapy-700">{resource.phone}</span>
                    <Button size="sm" variant="outline" className="border-therapy-500 text-therapy-600 hover:bg-therapy-50">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-therapy-50/50 border-2 border-therapy-300">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold text-therapy-800 mb-2">
                If you're in immediate danger, call 911
              </h3>
              <p className="text-therapy-600">
                Don't hesitate to seek immediate help if you or someone you know is at risk of harm.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CrisisResourcesPage;
