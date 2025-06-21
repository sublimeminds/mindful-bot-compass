
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Heart, 
  Shield, 
  Users, 
  Star,
  ArrowRight,
  CheckCircle,
  MessageSquare,
  Zap,
  Clock,
  Globe,
  Award,
  TrendingUp,
  Volume2,
  Mic,
  Eye,
  BarChart3,
  Crown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSEO } from '@/hooks/useSEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Index = () => {
  const navigate = useNavigate();
  
  useSEO({
    title: 'TherapySync - AI-Powered Mental Health Platform',
    description: 'Transform your mental health journey with AI-powered therapy, advanced voice technology, and personalized care.',
    keywords: 'AI therapy, mental health, voice technology, personalized therapy, crisis management'
  });

  const features = [
    {
      icon: Brain,
      title: "Advanced AI Technology",
      description: "Cutting-edge AI that understands emotions, context, and therapeutic nuances with 98% accuracy",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Volume2,
      title: "Advanced Voice Technology",
      description: "Natural, emotionally-aware voice conversations with real-time emotion detection in 29 languages",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Shield,
      title: "24/7 Crisis Management",
      description: "Real-time crisis detection with automatic escalation and emergency intervention protocols",
      color: "from-red-500 to-orange-500"
    },
    {
      icon: Users,
      title: "Personalized Therapist Matching",
      description: "AI-powered matching to connect you with the perfect therapist for your unique needs",
      color: "from-green-500 to-teal-500"
    }
  ];

  const stats = [
    { number: "98%", label: "AI Accuracy Rate", icon: Brain },
    { number: "29", label: "Languages Supported", icon: Globe },
    { number: "24/7", label: "Crisis Support", icon: Shield },
    { number: "8", label: "AI Therapists", icon: Users }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Software Engineer",
      content: "TherapySync's AI technology helped me overcome my anxiety. The voice conversations feel so natural and understanding.",
      rating: 5
    },
    {
      name: "David L.",
      role: "Teacher",
      content: "The crisis management feature was life-changing. Having 24/7 support gave me the confidence to seek help.",
      rating: 5
    },
    {
      name: "Maria R.",
      role: "Healthcare Worker",
      content: "The multilingual support and cultural sensitivity made all the difference in my therapy journey.",
      rating: 5
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Badge className="mb-6 bg-gradient-to-r from-therapy-500 to-calm-500 text-white px-6 py-2">
              <Zap className="h-4 w-4 mr-2" />
              Advanced AI Voice Technology
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-therapy-900 mb-6 leading-tight">
              Transform Your Mental Health
              <span className="block bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">
                with AI-Powered Therapy
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-therapy-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Experience personalized therapy with advanced AI technology, natural voice conversations, 
              and 24/7 crisis support. Your mental wellness journey starts here.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700 text-white px-8 py-4 text-lg"
                onClick={() => navigate('/register')}
              >
                <Heart className="h-5 w-5 mr-2" />
                Start Your Journey
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-therapy-300 text-therapy-700 hover:bg-therapy-50 px-8 py-4 text-lg"
                onClick={() => navigate('/therapysync-ai')}
              >
                <Brain className="h-5 w-5 mr-2" />
                Try TherapySync AI
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-therapy-500">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                HIPAA Compliant
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                End-to-End Encryption
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Evidence-Based Approaches
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                24/7 Support
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-full mb-4">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-therapy-900 mb-2">{stat.number}</div>
                  <div className="text-therapy-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-therapy-900 mb-6">
              Comprehensive Mental Health Platform
            </h2>
            <p className="text-xl text-therapy-600 max-w-3xl mx-auto">
              Our advanced technology combines AI intelligence, voice synthesis, and evidence-based therapy 
              to provide personalized mental health support.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-therapy-900 mb-4">{feature.title}</h3>
                    <p className="text-therapy-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Voice Technology Showcase */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Volume2 className="h-16 w-16 mx-auto mb-6" />
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Advanced Voice Technology
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Experience natural, emotionally-aware conversations with our cutting-edge voice synthesis technology. 
              Real-time emotion detection and 29-language support provide truly personalized therapy.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-4">
                <Mic className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Natural Conversations</h3>
                <p className="text-blue-100 text-sm">
                  Engage in natural, flowing conversations with AI therapists that understand context and emotion.
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-4">
                <Eye className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Emotion Detection</h3>
                <p className="text-blue-100 text-sm">
                  Real-time analysis of voice patterns to detect emotional states and provide appropriate support.
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-4">
                <Globe className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Global Accessibility</h3>
                <p className="text-blue-100 text-sm">
                  Support for 29 languages with cultural sensitivity and regional voice adaptations.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button 
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50"
              onClick={() => navigate('/voice-technology')}
            >
              <Volume2 className="h-5 w-5 mr-2" />
              Explore Voice Technology
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-therapy-900 mb-6">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-therapy-600 max-w-3xl mx-auto">
              See how TherapySync has transformed mental health journeys around the world.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {renderStars(testimonial.rating)}
                  </div>
                  <p className="text-therapy-700 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-therapy-900">{testimonial.name}</div>
                    <div className="text-sm text-therapy-500">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-therapy-500 to-calm-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Mental Health?
          </h2>
          <p className="text-xl text-therapy-100 mb-8 max-w-3xl mx-auto">
            Join thousands who have found healing, growth, and peace through our AI-powered therapy platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-white text-therapy-600 hover:bg-therapy-50 px-8 py-4 text-lg"
              onClick={() => navigate('/register')}
            >
              <Heart className="h-5 w-5 mr-2" />
              Start Free Trial
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg"
              onClick={() => navigate('/plans')}
            >
              <Crown className="h-5 w-5 mr-2" />
              View Plans
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
