
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, Headphones, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VoiceTechnologyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-calm-50/30 to-harmony-50/30">
      <Header />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 therapy-text-gradient">
              Voice Technology
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience natural voice conversations with our AI therapist using advanced speech recognition and synthesis technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center bg-white/80 backdrop-blur-sm border border-calm-200/50">
              <CardHeader>
                <Mic className="h-12 w-12 text-calm-500 mx-auto mb-4" />
                <CardTitle className="text-calm-800">Voice Recognition</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Speak naturally and our AI will understand your emotions, tone, and meaning.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center bg-white/80 backdrop-blur-sm border border-harmony-200/50">
              <CardHeader>
                <Volume2 className="h-12 w-12 text-harmony-500 mx-auto mb-4" />
                <CardTitle className="text-harmony-800">Natural Speech</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Hear responses in a warm, human-like voice that feels comfortable and reassuring.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center bg-white/80 backdrop-blur-sm border border-flow-200/50">
              <CardHeader>
                <Headphones className="h-12 w-12 text-flow-500 mx-auto mb-4" />
                <CardTitle className="text-flow-800">Audio Library</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Access guided meditations, breathing exercises, and therapeutic audio content.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button 
              onClick={() => navigate('/get-started')}
              className="bg-gradient-to-r from-calm-500 to-harmony-500 hover:from-calm-600 hover:to-harmony-600 text-white px-8 py-4 text-lg"
            >
              Try Voice Therapy
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VoiceTechnologyPage;
