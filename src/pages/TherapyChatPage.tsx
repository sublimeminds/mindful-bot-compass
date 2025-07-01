
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, MessageCircle, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TherapyChatPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50/30 to-calm-50/30">
      <Header />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 therapy-text-gradient">
              AI Therapy Chat
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience personalized therapy sessions with our advanced AI therapist, available 24/7 to support your mental wellness journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center bg-white/80 backdrop-blur-sm border border-therapy-200/50">
              <CardHeader>
                <Brain className="h-12 w-12 text-therapy-500 mx-auto mb-4" />
                <CardTitle className="text-therapy-800">Intelligent Conversations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our AI understands context, emotions, and therapeutic techniques to provide meaningful support.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center bg-white/80 backdrop-blur-sm border border-harmony-200/50">
              <CardHeader>
                <MessageCircle className="h-12 w-12 text-harmony-500 mx-auto mb-4" />
                <CardTitle className="text-harmony-800">24/7 Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Get support whenever you need it, day or night, without scheduling appointments.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center bg-white/80 backdrop-blur-sm border border-flow-200/50">
              <CardHeader>
                <Zap className="h-12 w-12 text-flow-500 mx-auto mb-4" />
                <CardTitle className="text-flow-800">Instant Response</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  No waiting rooms or delays. Start your therapy session immediately when you need support.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button 
              onClick={() => navigate('/get-started')}
              className="bg-gradient-to-r from-therapy-500 to-harmony-500 hover:from-therapy-600 hover:to-harmony-600 text-white px-8 py-4 text-lg"
            >
              Start AI Therapy Session
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TherapyChatPage;
