
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Headphones, 
  Shield, 
  Globe, 
  BarChart3, 
  MessageSquare, 
  Heart, 
  Zap,
  Eye,
  Mic,
  Clock,
  Users,
  Calendar,
  Target,
  TrendingUp,
  Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSafeSEO } from '@/hooks/useSafeSEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const FeaturesOverview = () => {
  const navigate = useNavigate();
  
  useSafeSEO({
    title: 'Features Overview - TherapySync AI Platform',
    description: 'Explore all TherapySync features: AI therapy, voice technology, crisis support, analytics, and personalized mental health care.',
    keywords: 'AI therapy features, voice technology, mental health analytics, crisis support, personalized therapy'
  });

  const coreFeatures = [
    {
      icon: Brain,
      title: "Advanced AI Therapy",
      description: "State-of-the-art AI therapists trained in multiple therapeutic approaches including CBT, DBT, and mindfulness-based interventions.",
      features: ["8 Different AI Therapists", "Multiple Therapeutic Approaches", "Personalized Treatment Plans", "Real-time Adaptation"],
      color: "from-therapy-500 to-calm-500"
    },
    {
      icon: Headphones,
      title: "Voice Technology",
      description: "Natural voice conversations with emotion detection and 29-language support for truly accessible mental health care.",
      features: ["Natural Voice Synthesis", "Emotion Detection", "29 Languages", "Real-time Processing"],
      color: "from-calm-500 to-therapy-500"
    },
    {
      icon: Shield,
      title: "24/7 Crisis Support",
      description: "Automated crisis detection with immediate intervention protocols and emergency resource connection.",
      features: ["Real-time Crisis Detection", "Emergency Contacts", "Safety Planning", "Immediate Escalation"],
      color: "from-therapy-600 to-harmony-600"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Comprehensive progress tracking with mood analytics, goal achievement metrics, and personalized insights.",
      features: ["Mood Pattern Analysis", "Progress Visualization", "Goal Tracking", "Personalized Insights"],
      color: "from-balance-500 to-flow-500"
    }
  ];

  const additionalFeatures = [
    { icon: Globe, title: "Cultural AI Adaptation", description: "Culturally sensitive responses" },
    { icon: MessageSquare, title: "Smart Chat Interface", description: "Intuitive conversation flow" },
    { icon: Eye, title: "Visual Progress Tracking", description: "Beautiful data visualization" },
    { icon: Mic, title: "Voice Journal", description: "Audio diary capabilities" },
    { icon: Clock, title: "Flexible Scheduling", description: "24/7 availability" },
    { icon: Users, title: "Community Support", description: "Peer connection features" },
    { icon: Calendar, title: "Session Planning", description: "Smart scheduling system" },
    { icon: Target, title: "Goal Setting", description: "Personalized objectives" },
    { icon: TrendingUp, title: "Progress Reports", description: "Detailed analytics" },
    { icon: Award, title: "Achievement System", description: "Milestone recognition" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-white to-calm-50">
      <Header />
      
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-6 therapy-gradient-bg text-white px-8 py-3 text-sm font-semibold shadow-lg border-0">
              <Zap className="h-4 w-4 mr-2" />
              Complete Feature Set
              <Brain className="h-4 w-4 ml-2" />
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="therapy-text-gradient-animated">
                Comprehensive Mental Health Platform
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Discover all the powerful features that make TherapySync the most advanced 
              AI-powered mental health platform available today.
            </p>
          </div>

          {/* Core Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {coreFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-800">{feature.title}</CardTitle>
                    <p className="text-slate-600 text-lg leading-relaxed">{feature.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {feature.features.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center space-x-2">
                          <div className="w-2 h-2 therapy-gradient-bg rounded-full"></div>
                          <span className="text-sm text-slate-600 font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Additional Features Grid */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="therapy-text-gradient">
                Additional Features
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {additionalFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 therapy-gradient-bg rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-bold text-slate-800 mb-2">{feature.title}</h3>
                      <p className="text-sm text-slate-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="therapy-gradient-bg rounded-3xl p-12 text-white shadow-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Experience All Features?
              </h2>
              <p className="text-xl mb-8 text-therapy-100 max-w-2xl mx-auto">
                Start your mental health journey today with access to all these powerful features.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-white text-therapy-600 hover:bg-therapy-50 px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  onClick={() => navigate('/auth')}
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Start Free Trial
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                  onClick={() => navigate('/therapy-chat')}
                >
                  <Brain className="h-5 w-5 mr-2" />
                  Try Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FeaturesOverview;
