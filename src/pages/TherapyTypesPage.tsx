
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Heart, Target, Lightbulb } from 'lucide-react';

const TherapyTypesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50/30 to-calm-50/30">
      <Header />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 therapy-text-gradient">
              Therapy Types & Approaches
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI is trained in multiple evidence-based therapeutic approaches to provide personalized care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <Brain className="h-12 w-12 text-therapy-500 mx-auto mb-4" />
                <CardTitle>Cognitive Behavioral Therapy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">CBT techniques to identify and change negative thought patterns</p>
              </CardContent>
            </Card>

            <Card className="text-center bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <Heart className="h-12 w-12 text-calm-500 mx-auto mb-4" />
                <CardTitle>Mindfulness-Based Therapy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Present-moment awareness and meditation practices</p>
              </CardContent>
            </Card>

            <Card className="text-center bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <Target className="h-12 w-12 text-harmony-500 mx-auto mb-4" />
                <CardTitle>Solution-Focused Therapy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Goal-oriented approach focusing on solutions and strengths</p>
              </CardContent>
            </Card>

            <Card className="text-center bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <Lightbulb className="h-12 w-12 text-flow-500 mx-auto mb-4" />
                <CardTitle>Humanistic Approach</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Person-centered therapy emphasizing self-acceptance</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TherapyTypesPage;
