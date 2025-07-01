
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Heart, Users, Zap, Globe, Headphones } from 'lucide-react';

const FeaturesShowcasePage = () => {
  const features = [
    {
      icon: Brain,
      title: "AI Therapy Chat",
      description: "24/7 intelligent conversations with our AI therapist",
      color: "therapy"
    },
    {
      icon: Headphones,
      title: "Voice Technology", 
      description: "Natural voice conversations and audio library",
      color: "calm"
    },
    {
      icon: Globe,
      title: "Cultural AI",
      description: "Culturally sensitive and personalized care",
      color: "balance"
    },
    {
      icon: Users,
      title: "Family Features",
      description: "Family dashboard and shared insights",
      color: "harmony"
    },
    {
      icon: Heart,
      title: "Mood Tracking",
      description: "Advanced mood analytics and insights",
      color: "flow"
    },
    {
      icon: Zap,
      title: "Crisis Support",
      description: "Immediate help when you need it most",
      color: "therapy"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50/30 to-calm-50/30">
      <Header />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 therapy-text-gradient">
              Feature Showcase
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore the powerful features that make TherapySync the most comprehensive AI therapy platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="text-center bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <IconComponent className={`h-12 w-12 text-${feature.color}-500 mx-auto mb-4`} />
                    <CardTitle className={`text-${feature.color}-800`}>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FeaturesShowcasePage;
