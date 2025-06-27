
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
  Crown,
  UserCheck,
  Headphones,
  Calendar,
  Sparkles,
  Lightbulb
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSafeSEO } from '@/hooks/useSafeSEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import FeaturesSection from '@/components/FeaturesSection';
import PricingSection from '@/components/PricingSection';

const Index = () => {
  const navigate = useNavigate();
  
  useSafeSEO({
    title: 'TherapySync - AI-Powered Mental Health Platform',
    description: 'Transform your mental health journey with AI-powered therapy, advanced voice technology, and personalized care.',
    keywords: 'AI therapy, mental health, voice technology, personalized therapy, crisis management'
  });

  const features = [
    {
      icon: Brain,
      title: "Advanced AI Technology",
      description: "Cutting-edge AI that understands emotions, context, and therapeutic nuances with 98% accuracy",
      color: "from-blue-500 via-purple-500 to-cyan-500"
    },
    {
      icon: Volume2,
      title: "Advanced Voice Technology",
      description: "Natural, emotionally-aware voice conversations with real-time emotion detection in 29 languages",
      color: "from-purple-500 via-pink-500 to-red-500"
    },
    {
      icon: Shield,
      title: "24/7 Crisis Management",
      description: "Real-time crisis detection with automatic escalation and emergency intervention protocols",
      color: "from-red-500 via-orange-500 to-yellow-500"
    },
    {
      icon: Users,
      title: "Personalized Therapist Matching",
      description: "AI-powered matching to connect you with the perfect therapist for your unique needs",
      color: "from-green-500 via-teal-500 to-blue-500"
    }
  ];

  const stats = [
    { number: "98%", label: "AI Accuracy Rate", icon: Brain },
    { number: "29", label: "Languages Supported", icon: Globe },
    { number: "24/7", label: "Crisis Support", icon: Shield },
    { number: "8", label: "AI Therapists", icon: Users }
  ];

  const howItWorksSteps = [
    {
      number: "01",
      title: "Quick Assessment",
      description: "Complete our personalized mental health assessment to understand your unique needs and goals.",
      icon: UserCheck,
      features: ["5-minute setup", "Privacy-focused", "Personalized matching"]
    },
    {
      number: "02", 
      title: "Choose Your AI Therapist",
      description: "Select from different therapeutic approaches and AI personalities that resonate with you.",
      icon: Brain,
      features: ["Multiple approaches", "Personality matching", "Instant availability"]
    },
    {
      number: "03",
      title: "Start Voice Sessions",
      description: "Begin personalized therapy with natural voice conversations or text-based sessions.",
      icon: Headphones,
      features: ["Voice & text options", "Real-time emotion detection", "29 languages"]
    },
    {
      number: "04",
      title: "Track Progress",
      description: "Monitor your journey with detailed analytics, mood tracking, and personalized insights.",
      icon: BarChart3,
      features: ["Visual progress", "Goal achievement", "Adaptive recommendations"]
    }
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
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-white to-calm-50 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-70"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-50 via-transparent to-violet-50 opacity-60"></div>
      
      {/* Floating gradient orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-20 blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full opacity-10 blur-3xl animate-pulse delay-2000"></div>
      
      <div className="relative z-10">
        <Header />
        
        {/* Hero Section */}
        <section id="hero" className="relative py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <Badge className="mb-6 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 text-white px-8 py-3 text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0">
                <Sparkles className="h-4 w-4 mr-2" />
                Revolutionary AI Voice Technology
                <Zap className="h-4 w-4 ml-2" />
              </Badge>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
                <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Transform Your
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
                  Mental Health
                </span>
                <br />
                <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-lime-600 bg-clip-text text-transparent">
                  Journey
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-700 mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
                Experience the future of mental wellness with 
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold"> AI-powered therapy</span>,
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent font-bold"> natural voice conversations</span>, 
                and <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent font-bold">24/7 crisis support</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-700 hover:via-purple-700 hover:to-pink-700 text-white px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 border-0"
                  onClick={() => navigate('/auth')}
                >
                  <Heart className="h-6 w-6 mr-3" />
                  Start Your Journey
                  <ArrowRight className="h-6 w-6 ml-3" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-purple-300 text-purple-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 px-12 py-6 text-xl font-bold rounded-2xl shadow-xl hover:shadow-purple-500/20 transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm"
                  onClick={() => navigate('/therapy-chat')}
                >
                  <Brain className="h-6 w-6 mr-3" />
                  Try TherapySync AI
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center gap-8 text-sm font-semibold">
                <div className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">HIPAA Compliant</span>
                </div>
                <div className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
                  <CheckCircle className="h-5 w-5 mr-2 text-blue-500" />
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">End-to-End Encryption</span>
                </div>
                <div className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
                  <CheckCircle className="h-5 w-5 mr-2 text-purple-500" />
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Evidence-Based</span>
                </div>
                <div className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
                  <CheckCircle className="h-5 w-5 mr-2 text-red-500" />
                  <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-purple-50/60 to-white/60 backdrop-blur-sm"></div>
          <div className="container mx-auto px-4 relative">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="text-center group">
                    <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 rounded-2xl shadow-2xl group-hover:shadow-purple-500/30 transition-all duration-300 group-hover:scale-110 mb-6">
                      <IconComponent className="h-10 w-10 text-white" />
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl"></div>
                    </div>
                    <div className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-2">{stat.number}</div>
                    <div className="text-slate-600 font-medium">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50/80 via-purple-50/80 to-pink-50/80"></div>
          <div className="container mx-auto px-4 relative">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  How TherapySync Works
                </span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto font-medium">
                Get started on your mental health journey in just four simple steps. 
                Our AI-powered platform makes professional therapy support accessible anytime, anywhere.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {howItWorksSteps.map((step, index) => {
                const IconComponent = step.icon;
                const gradients = [
                  'from-violet-500 to-purple-500',
                  'from-blue-500 to-cyan-500',
                  'from-green-500 to-teal-500',
                  'from-orange-500 to-red-500'
                ];
                return (
                  <div key={index} className="relative">
                    <Card className="h-full hover:shadow-2xl transition-all duration-500 group hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                      <CardContent className="p-8">
                        <div className="text-center mb-6">
                          <div className={`w-20 h-20 bg-gradient-to-r ${gradients[index]} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-pulse shadow-2xl group-hover:shadow-purple-500/30`}>
                            <IconComponent className="h-10 w-10 text-white" />
                          </div>
                          <div className="text-sm font-bold text-purple-500 mb-3">STEP {step.number}</div>
                          <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">{step.title}</h3>
                          <p className="text-slate-600 text-sm mb-6 leading-relaxed">{step.description}</p>
                        </div>

                        <div className="space-y-3">
                          {step.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center space-x-3">
                              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                              <span className="text-sm text-slate-600 font-medium">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Arrow connector for desktop */}
                    {index < howItWorksSteps.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                        <ArrowRight className="h-8 w-8 text-purple-400" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-white via-blue-50/50 to-white"></div>
          <div className="container mx-auto px-4 relative">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
                  Comprehensive Mental Health Platform
                </span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto font-medium">
                Our advanced technology combines AI intelligence, voice synthesis, and evidence-based therapy 
                to provide personalized mental health support.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                    <CardContent className="p-10">
                      <div className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-8 shadow-2xl`}>
                        <IconComponent className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">{feature.title}</h3>
                      <p className="text-slate-600 leading-relaxed text-lg">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Voice Technology Showcase */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/10 to-transparent"></div>
          <div className="container mx-auto px-4 relative text-white">
            <div className="text-center mb-16">
              <div className="w-24 h-24 bg-gradient-to-r from-white/20 to-white/10 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
                <Volume2 className="h-12 w-12" />
              </div>
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                Advanced Voice Technology
              </h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto font-medium">
                Experience natural, emotionally-aware conversations with our cutting-edge voice synthesis technology. 
                Real-time emotion detection and 29-language support provide truly personalized therapy.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-2xl">
                  <Mic className="h-16 w-16 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold mb-4">Natural Conversations</h3>
                  <p className="text-blue-100 leading-relaxed">
                    Engage in natural, flowing conversations with AI therapists that understand context and emotion.
                  </p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-2xl">
                  <Eye className="h-16 w-16 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold mb-4">Emotion Detection</h3>
                  <p className="text-blue-100 leading-relaxed">
                    Real-time analysis of voice patterns to detect emotional states and provide appropriate support.
                  </p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-2xl">
                  <Globe className="h-16 w-16 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold mb-4">Global Accessibility</h3>
                  <p className="text-blue-100 leading-relaxed">
                    Support for 29 languages with cultural sensitivity and regional voice adaptations.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Button 
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:scale-105"
                onClick={() => navigate('/voice-technology')}
              >
                <Volume2 className="h-6 w-6 mr-3" />
                Explore Voice Technology
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/80 via-teal-50/80 to-blue-50/80"></div>
          <div className="container mx-auto px-4 relative">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
                  Trusted by Thousands
                </span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto font-medium">
                See how TherapySync has transformed mental health journeys around the world.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      {renderStars(testimonial.rating)}
                    </div>
                    <p className="text-slate-700 mb-6 italic text-lg leading-relaxed">"{testimonial.content}"</p>
                    <div>
                      <div className="font-bold text-slate-900 text-lg">{testimonial.name}</div>
                      <div className="text-sm text-slate-500">{testimonial.role}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/80 via-pink-50/80 to-violet-50/80"></div>
          <div className="relative">
            <PricingSection />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/10 to-transparent"></div>
          <div className="container mx-auto px-4 text-center relative text-white">
            <h2 className="text-4xl md:text-6xl font-bold mb-8">
              Ready to Transform Your Mental Health?
            </h2>
            <p className="text-xl text-purple-100 mb-12 max-w-3xl mx-auto font-medium">
              Join thousands who have found healing, growth, and peace through our AI-powered therapy platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg"
                className="bg-white text-purple-600 hover:bg-purple-50 px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:scale-105"
                onClick={() => navigate('/auth')}
              >
                <Heart className="h-6 w-6 mr-3" />
                Start Free Trial
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 px-12 py-6 text-xl font-bold rounded-2xl shadow-xl hover:shadow-white/20 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                onClick={() => navigate('/dashboard')}
              >
                <Crown className="h-6 w-6 mr-3" />
                View Dashboard
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Index;
