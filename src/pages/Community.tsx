
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Heart, MessageSquare, Shield, Star, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSafeSEO } from '@/hooks/useSafeSEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Community = () => {
  const navigate = useNavigate();
  
  useSafeSEO({
    title: 'Community - TherapySync Support Groups',
    description: 'Join supportive communities, connect with others on similar journeys, and find peer support for mental health.',
    keywords: 'mental health community, support groups, peer support, therapy community'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-white to-calm-50">
      <Header />
      
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-6 therapy-gradient-bg text-white px-8 py-3 text-sm font-semibold shadow-lg border-0">
              <Users className="h-4 w-4 mr-2" />
              Community Support
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="therapy-text-gradient-animated">
                Connect & Heal Together
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Join a supportive community of individuals on their mental health journey. 
              Share experiences, find encouragement, and build meaningful connections.
            </p>
          </div>

          <div className="text-center mb-16">
            <Card className="therapy-gradient-bg text-white p-12 shadow-2xl">
              <Users className="h-16 w-16 mx-auto mb-6 opacity-80" />
              <h2 className="text-3xl font-bold mb-6">Community Coming Soon</h2>
              <p className="text-therapy-100 mb-8 max-w-2xl mx-auto">
                We're building a safe, supportive community space where you can connect with others, 
                share your journey, and find peer support. Join our waitlist to be notified when it launches.
              </p>
              <Button 
                size="lg"
                className="bg-white text-therapy-600 hover:bg-therapy-50 px-8 py-4 text-lg font-bold rounded-xl"
                onClick={() => navigate('/auth')}
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Join Waitlist
              </Button>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Community;
