
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MessageSquare, Heart } from 'lucide-react';

const CommunityPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-harmony-50/30 to-flow-50/30">
      <Header />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 therapy-text-gradient">
              Community Support
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with others on their mental wellness journey in a safe, supportive environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <Users className="h-12 w-12 text-harmony-500 mx-auto mb-4" />
                <CardTitle>Support Groups</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Join moderated support groups based on your specific needs and interests.
                </p>
                <Button variant="outline">Join Groups</Button>
              </CardContent>
            </Card>

            <Card className="text-center bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <MessageSquare className="h-12 w-12 text-flow-500 mx-auto mb-4" />
                <CardTitle>Community Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Engage in real-time conversations with peer supporters and mental health advocates.
                </p>
                <Button variant="outline">Start Chatting</Button>
              </CardContent>
            </Card>

            <Card className="text-center bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <Heart className="h-12 w-12 text-balance-500 mx-auto mb-4" />
                <CardTitle>Peer Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Connect one-on-one with trained peer supporters who understand your journey.
                </p>
                <Button variant="outline">Find Support</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CommunityPage;
