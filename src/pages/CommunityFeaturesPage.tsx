
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MessageSquare, Heart, Shield } from 'lucide-react';

const CommunityFeaturesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-harmony-50/30 to-flow-50/30">
      <Header />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 therapy-text-gradient">
              Community Features
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with others on similar journeys in a safe, moderated environment designed for mental wellness support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <Users className="h-12 w-12 text-harmony-500 mx-auto mb-4" />
                <CardTitle>Support Groups</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Topic-based groups moderated by mental health professionals</p>
              </CardContent>
            </Card>

            <Card className="text-center bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <MessageSquare className="h-12 w-12 text-flow-500 mx-auto mb-4" />
                <CardTitle>Peer Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Real-time conversations with community members</p>
              </CardContent>
            </Card>

            <Card className="text-center bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <Heart className="h-12 w-12 text-balance-500 mx-auto mb-4" />
                <CardTitle>Wellness Challenges</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Group challenges to build healthy habits together</p>
              </CardContent>
            </Card>

            <Card className="text-center bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <Shield className="h-12 w-12 text-therapy-500 mx-auto mb-4" />
                <CardTitle>Safe Environment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Moderated spaces with strict community guidelines</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CommunityFeaturesPage;
