import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StaticChatDemo from '@/components/demo/StaticChatDemo';

import GradientLogo from '@/components/ui/GradientLogo';
import GradientButton from '@/components/ui/GradientButton';
import { 
  Brain, 
  Heart, 
  Shield, 
  Globe, 
  Headphones, 
  Users,
  Sparkles,
  Star,
  Clock,
  Award,
  ArrowRight,
  CheckCircle,
  MessageSquare
} from 'lucide-react';

// Pure static index content - no React hooks, renders immediately
const StaticIndexContent = () => {
  // Manual SEO update using direct DOM manipulation - no React hooks
  if (typeof document !== 'undefined') {
    try {
      document.title = 'TherapySync - AI-Powered Mental Health Support';
      
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', 'Experience personalized AI therapy with voice technology, 24/7 crisis support, and culturally sensitive care. Start your mental health journey today.');
    } catch (error) {
      console.warn('SEO update failed, but continuing:', error);
    }
  }

  const features = [
    {
      icon: Brain,
      title: "Advanced AI Therapy",
      description: "Personalized therapy sessions with AI trained in multiple therapeutic approaches including CBT, DBT, and mindfulness techniques.",
      color: "from-therapy-500 to-calm-500"
    },
    {
      icon: Headphones,
      title: "Voice Technology",
      description: "Natural voice conversations with emotion detection in 29 languages for truly accessible mental health care.",
      color: "from-calm-500 to-therapy-500"
    },
    {
      icon: Shield,
      title: "24/7 Crisis Support",
      description: "Immediate crisis intervention with automated detection, safety planning, and emergency resource connection.",
      color: "from-therapy-600 to-harmony-600"
    },
    {
      icon: Globe,
      title: "Cultural Sensitivity",
      description: "AI trained to understand diverse cultural backgrounds and provide culturally appropriate mental health support.",
      color: "from-balance-500 to-flow-500"
    },
    {
      icon: Users,
      title: "Family Plans",
      description: "Comprehensive family mental health support with adaptive pricing, parental controls, and shared progress tracking.",
      color: "from-harmony-500 to-balance-500"
    },
    {
      icon: Heart,
      title: "Mood Analytics",
      description: "Advanced mood tracking with AI-powered insights, pattern recognition, and personalized recommendations.",
      color: "from-flow-500 to-therapy-500"
    }
  ];

  const stats = [
    { number: "100,000+", label: "Active Users" },
    { number: "2M+", label: "Therapy Sessions" },
    { number: "29", label: "Languages" },
    { number: "24/7", label: "Availability" }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Working Mother",
      text: "TherapySync has been a game-changer for my mental health journey. The AI understands me better than I expected, and the family features help me support my kids too.",
      rating: 5,
      avatar: "SM"
    },
    {
      name: "David L.",
      role: "College Student",
      text: "The voice feature makes it feel like talking to a real therapist. I love that I can get help anytime, especially during my anxiety attacks.",
      rating: 5,
      avatar: "DL"
    },
    {
      name: "Maria G.",
      role: "Healthcare Worker",
      text: "Finally, therapy that understands my cultural background. The LGBTQ+ support has been incredible, and the crisis features give me peace of mind.",
      rating: 5,
      avatar: "MG"
    }
  ];

  const scrollToDemo = () => {
    const demoElement = document.getElementById('demo');
    if (demoElement) {
      demoElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const navigateToOnboarding = () => {
    window.location.href = '/onboarding';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-white to-calm-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <GradientLogo size="sm" />
              <span className="text-2xl font-bold therapy-text-gradient">TherapySync</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-700 hover:text-therapy-600 font-medium transition-colors">Features</a>
              <a href="#demo" className="text-slate-700 hover:text-therapy-600 font-medium transition-colors">Demo</a>
              <a href="#pricing" className="text-slate-700 hover:text-therapy-600 font-medium transition-colors">Pricing</a>
              <Button variant="outline" onClick={() => window.location.href = '/auth'}>
                Sign In
              </Button>
              <GradientButton onClick={navigateToOnboarding}>
                Get Started
              </GradientButton>
            </nav>
          </div>
        </div>
      </header>


      {/* Hero Section */}
      <section id="hero" className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 therapy-gradient-bg opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <GradientLogo size="xl" className="animate-swirl-breathe" />
            </div>
            
            <Badge className="mb-6 therapy-gradient-bg text-white px-8 py-3 text-sm font-semibold shadow-lg border-0 animate-fade-in">
              <Sparkles className="h-4 w-4 mr-2" />
              AI-Powered Mental Health
              <Heart className="h-4 w-4 ml-2" />
            </Badge>
            
            <h1 className="text-4xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in">
              <span className="therapy-text-gradient-animated">
                Your AI Therapy Companion
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto mb-8 leading-relaxed animate-fade-in">
              Experience personalized mental health support with advanced AI therapy, 
              voice technology, and 24/7 crisis support. Start your healing journey today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in">
              <GradientButton 
                size="lg" 
                className="px-8 py-4 text-lg font-bold"
                onClick={navigateToOnboarding}
              >
                <Heart className="h-5 w-5 mr-2" />
                Start Free Trial
              </GradientButton>
              <Button 
                size="lg" 
                className="bg-white border-2 border-therapy-300 text-therapy-700 hover:bg-therapy-50 hover:border-therapy-400 px-8 py-4 text-lg font-bold transition-all duration-300"
                onClick={scrollToDemo}
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                Try Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-16 bg-gradient-to-r from-therapy-50/50 to-calm-50/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold therapy-text-gradient mb-2 animate-scale-in">
                  {stat.number}
                </div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="therapy-text-gradient">
                Advanced Mental Health Features
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Discover the comprehensive features designed to support your mental health journey with cutting-edge technology.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-xl group">
                  <CardHeader>
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-800">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 text-lg leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 bg-gradient-to-r from-therapy-50/50 to-calm-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="therapy-text-gradient">
                Experience AI Therapy
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              See how our AI therapist provides personalized, empathetic support through natural conversations.
            </p>
          </div>
          
          <StaticChatDemo />
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="therapy-text-gradient">
                What Our Users Say
              </span>
            </h2>
            <p className="text-xl text-slate-600">
              Join thousands who have transformed their mental health with TherapySync
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-semibold">{testimonial.avatar}</span>
                  </div>
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-therapy-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-600 mb-4 italic">"{testimonial.text}"</p>
                  <div>
                    <div className="font-semibold text-slate-800">{testimonial.name}</div>
                    <div className="text-sm text-slate-500">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Simple Pricing Section */}
      <section id="pricing" className="py-24 bg-gradient-to-br from-slate-50 via-therapy-50 to-calm-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Choose Your <span className="bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">Wellness Plan</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Start free and upgrade as your mental wellness journey evolves.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {/* Free Plan */}
            <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-2xl bg-white/80 backdrop-blur-sm border-slate-200">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-slate-900 mb-2">Free</CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-slate-800">$0</span>
                </div>
              </CardHeader>
              <CardContent className="pt-0 px-6 pb-8">
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-therapy-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">3 AI therapy sessions per month</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-therapy-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">Basic mood tracking</span>
                  </li>
                </ul>
                <Button 
                  className="w-full font-semibold text-base py-3"
                  onClick={navigateToOnboarding}
                >
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-2xl ring-4 ring-therapy-400 shadow-therapy-500/30 scale-105 bg-gradient-to-br from-therapy-50 to-calm-50 border-therapy-200">
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-therapy-500 via-calm-500 to-therapy-600 text-white text-center py-3 text-sm font-bold tracking-wide">
                ⭐ MOST POPULAR ⭐
              </div>
              <CardHeader className="text-center pb-8 pt-16">
                <CardTitle className="text-2xl font-bold text-slate-900 mb-2">Pro</CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold therapy-text-gradient">$29</span>
                  <span className="text-slate-600">/month</span>
                </div>
              </CardHeader>
              <CardContent className="pt-0 px-6 pb-8">
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-therapy-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">Unlimited AI therapy sessions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-therapy-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">Voice conversations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-therapy-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">24/7 crisis support</span>
                  </li>
                </ul>
                <GradientButton 
                  className="w-full font-semibold text-base py-3"
                  onClick={navigateToOnboarding}
                >
                  Start Pro Trial
                </GradientButton>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-2xl bg-white/80 backdrop-blur-sm border-slate-200">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-slate-900 mb-2">Premium</CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-slate-800">$99</span>
                  <span className="text-slate-600">/month</span>
                </div>
              </CardHeader>
              <CardContent className="pt-0 px-6 pb-8">
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-therapy-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">Everything in Pro</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-therapy-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">Family plan (up to 5 members)</span>
                  </li>
                </ul>
                <Button 
                  className="w-full font-semibold text-base py-3"
                  onClick={navigateToOnboarding}
                >
                  Get Premium
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <GradientLogo size="sm" />
                <span className="text-xl font-bold">TherapySync</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                AI-powered mental health support that's accessible, personalized, and available 24/7.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="text-slate-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-slate-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#demo" className="text-slate-400 hover:text-white transition-colors">Demo</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/help" className="text-slate-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="/contact" className="text-slate-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="/crisis-resources" className="text-slate-400 hover:text-white transition-colors">Crisis Resources</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/privacy" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="text-slate-400 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 text-center">
            <p className="text-slate-400 text-sm">
              © 2024 TherapySync. All rights reserved. • HIPAA Compliant • 24/7 Support
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StaticIndexContent;