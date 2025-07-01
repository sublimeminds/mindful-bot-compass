
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HelpCircle, Book, MessageCircle, Phone } from 'lucide-react';

const HelpPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50/30 to-calm-50/30">
      <Header />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 therapy-text-gradient">
              Help & Support
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to your questions and get the support you need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="text-center bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <HelpCircle className="h-12 w-12 text-therapy-500 mx-auto mb-4" />
                <CardTitle>FAQ</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Common questions and answers</p>
                <Button variant="outline" size="sm">View FAQ</Button>
              </CardContent>
            </Card>

            <Card className="text-center bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <Book className="h-12 w-12 text-calm-500 mx-auto mb-4" />
                <CardTitle>Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Detailed guides and tutorials</p>
                <Button variant="outline" size="sm">Read Docs</Button>
              </CardContent>
            </Card>

            <Card className="text-center bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <MessageCircle className="h-12 w-12 text-harmony-500 mx-auto mb-4" />
                <CardTitle>Live Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Chat with our support team</p>
                <Button variant="outline" size="sm">Start Chat</Button>
              </CardContent>
            </Card>

            <Card className="text-center bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <Phone className="h-12 w-12 text-flow-500 mx-auto mb-4" />
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Email or phone support</p>
                <Button variant="outline" size="sm">Contact</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HelpPage;
