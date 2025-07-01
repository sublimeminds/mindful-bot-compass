
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Phone, MessageCircle, Clock } from 'lucide-react';

const CrisisSupportPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50/30 to-balance-50/30">
      <Header />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <AlertTriangle className="h-16 w-16 text-therapy-500 mx-auto mb-4" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6 therapy-text-gradient">
              Crisis Support
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Immediate help is available. You're not alone, and support is just a click away.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center bg-white/80 backdrop-blur-sm border-2 border-therapy-200">
              <CardHeader>
                <Phone className="h-12 w-12 text-therapy-500 mx-auto mb-4" />
                <CardTitle className="text-therapy-800">Emergency Hotline</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  24/7 crisis hotline for immediate support
                </p>
                <Button className="w-full bg-therapy-500 hover:bg-therapy-600 text-white">
                  Call Now: 988
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center bg-white/80 backdrop-blur-sm border-2 border-harmony-200">
              <CardHeader>
                <MessageCircle className="h-12 w-12 text-harmony-500 mx-auto mb-4" />
                <CardTitle className="text-harmony-800">Crisis Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Text-based support for immediate assistance
                </p>
                <Button className="w-full bg-harmony-500 hover:bg-harmony-600 text-white">
                  Start Crisis Chat
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center bg-white/80 backdrop-blur-sm border-2 border-balance-200">
              <CardHeader>
                <Clock className="h-12 w-12 text-balance-500 mx-auto mb-4" />
                <CardTitle className="text-balance-800">AI Emergency Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Immediate AI-powered crisis intervention
                </p>
                <Button className="w-full bg-balance-500 hover:bg-balance-600 text-white">
                  Get AI Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CrisisSupportPage;
