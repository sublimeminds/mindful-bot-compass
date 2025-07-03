import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Heart, Shield } from 'lucide-react';

const MinimalIndex = () => {
  console.log('MinimalIndex: Rendering minimal homepage');

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50">
      {/* Header */}
      <header className="p-6 border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-therapy-600" />
            <span className="text-2xl font-bold text-therapy-900">TherapySync</span>
          </div>
          <Button className="bg-therapy-600 hover:bg-therapy-700">Get Started</Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-therapy-900 mb-6">
            AI-Powered Mental Health Support
          </h1>
          <p className="text-xl text-therapy-700 mb-8 max-w-3xl mx-auto">
            Experience personalized therapy with advanced AI technology, voice interactions, and 24/7 crisis support.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-therapy-600 hover:bg-therapy-700">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-therapy-600" />
                AI Therapy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-therapy-700">
                Personalized therapy sessions with AI trained in multiple therapeutic approaches.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-calm-600" />
                Crisis Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-therapy-700">
                24/7 crisis intervention and immediate support when you need it most.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-harmony-600" />
                Privacy First
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-therapy-700">
                Your data is encrypted and secure with industry-leading privacy standards.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default MinimalIndex;