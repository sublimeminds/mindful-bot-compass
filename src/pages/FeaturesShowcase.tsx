
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, Heart, Target, BookOpen, BarChart3, Calendar,
  Zap, Lightbulb, TrendingUp, Settings, ArrowRight, Star,
  CheckCircle, Smartphone, Clock, Globe, Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSafeSEO } from '@/hooks/useSafeSEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const FeaturesShowcase = () => {
  const navigate = useNavigate();

  useSafeSEO({
    title: 'New Platform Features - Advanced Mental Health Tools | TherapySync',
    description: 'Discover our latest features: AI-powered mood tracking, digital journaling, goal management, and comprehensive third-party integrations.',
    keywords: 'mental health features, mood tracking, digital journaling, goal tracking, therapy integrations, AI wellness tools'
  });

  const featuredFeatures = [
    {
      title: 'AI-Powered Mood Tracking',
      description: 'Advanced mood analytics with pattern recognition, trigger identification, and personalized insights to understand your emotional well-being.',
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
      image: '/placeholder-mood-tracking.jpg',
      benefits: ['Daily mood patterns', 'Trigger analysis', 'Correlation insights', 'Progress visualization'],
      path: '/auth'
    },
    {
      title: 'Digital Notebook & Journaling',
      description: 'AI-enhanced journaling with voice-to-text, mood correlation, therapeutic prompts, and intelligent insights for deeper self-reflection.',
      icon: BookOpen,
      color: 'from-blue-500 to-indigo-500',
      image: '/placeholder-notebook.jpg',
      benefits: ['Voice-to-text journaling', 'AI insights', 'Mood correlation', 'Export & sharing'],
      path: '/auth'
    },
    {
      title: 'Comprehensive Goal Tracking',
      description: 'SMART goals framework with progress tracking, milestone celebrations, and AI-powered recommendations for achieving your mental health objectives.',
      icon: Target,
      color: 'from-green-500 to-emerald-500',
      image: '/placeholder-goals.jpg',
      benefits: ['SMART goals framework', 'Progress visualization', 'Milestone tracking', 'AI recommendations'],
      path: '/auth'
    },
    {
      title: 'Advanced Integrations Hub',
      description: 'Connect with your favorite health apps, wearables, and productivity tools for a unified mental wellness ecosystem.',
      icon: Settings,
      color: 'from-purple-500 to-violet-500',
      image: '/placeholder-integrations.jpg',
      benefits: ['Health app sync', 'Wearable integration', 'Calendar sync', 'Third-party APIs'],
      path: '/auth'
    }
  ];

  const additionalFeatures = [
    {
      icon: Brain,
      title: 'AI-Powered Analytics',
      description: 'Deep insights into your mental health patterns with predictive analytics and personalized recommendations.',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: BarChart3,
      title: 'Progress Reporting',
      description: 'Comprehensive progress reports with visual analytics and exportable insights for you and your healthcare team.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'Intelligent session scheduling with mood-based recommendations and optimal timing suggestions.',
      color: 'from-green-500 to-teal-500'
    },
    {
      icon: Globe,
      title: 'Multi-language Support',
      description: 'Full platform support in 29 languages with culturally sensitive AI responses and localized content.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Enterprise-grade security with end-to-end encryption, HIPAA compliance, and complete data ownership.',
      color: 'from-slate-600 to-slate-800'
    },
    {
      icon: Smartphone,
      title: 'Mobile-First Design',
      description: 'Fully responsive design optimized for mobile devices with offline capabilities and push notifications.',
      color: 'from-teal-500 to-cyan-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-white to-indigo-50">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-therapy-100/50 to-indigo-100/50"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-therapy-500 to-indigo-500 text-white px-8 py-3 text-sm font-semibold shadow-lg border-0">
              <Zap className="h-4 w-4 mr-2" />
              Latest Platform Features
              <Star className="h-4 w-4 ml-2" />
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-therapy-600 to-indigo-600 bg-clip-text text-transparent">
                Revolutionary Mental Health Tools
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Discover our cutting-edge features designed to enhance your mental wellness journey with AI-powered insights, 
              comprehensive tracking, and seamless integrations.
            </p>
            
            <Button 
              size="lg"
              className="bg-gradient-to-r from-therapy-500 to-indigo-500 hover:from-therapy-600 hover:to-indigo-600 text-white border-0 px-8 py-6 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              onClick={() => navigate('/auth')}
            >
              <Heart className="h-5 w-5 mr-2" />
              Get Started Free
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-therapy-600 to-indigo-600 bg-clip-text text-transparent">
                Powerful New Features
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Experience the future of mental health support with our advanced AI-powered tools
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {featuredFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                  <div className={`h-48 bg-gradient-to-r ${feature.color} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute top-6 left-6">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-6 right-6">
                      <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                        New Feature
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-slate-800">{feature.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-slate-600 text-lg leading-relaxed">{feature.description}</p>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-center gap-2 text-sm text-slate-600">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          {benefit}
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      className={`w-full bg-gradient-to-r ${feature.color} text-white border-0 hover:shadow-lg transition-all duration-300`}
                      onClick={() => navigate(feature.path)}
                    >
                      Explore Feature
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-20 bg-gradient-to-r from-therapy-50/50 to-indigo-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-therapy-600 to-indigo-600 bg-clip-text text-transparent">
                Complete Platform Overview
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Comprehensive mental health support with advanced technology integration
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-800">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-therapy-500 to-indigo-500 text-white p-12 shadow-2xl border-0">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Experience These Features?
              </h2>
              <p className="text-xl mb-8 text-therapy-100 max-w-2xl mx-auto">
                Join thousands who are already using our advanced mental health platform to improve their well-being.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-white text-therapy-600 hover:bg-therapy-50 px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  onClick={() => navigate('/auth')}
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Start Your Journey
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                  onClick={() => navigate('/pricing')}
                >
                  <TrendingUp className="h-5 w-5 mr-2" />
                  View Pricing
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FeaturesShowcase;
