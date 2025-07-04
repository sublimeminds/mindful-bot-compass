
import React from 'react';
import EnhancedHeader from '@/components/navigation/EnhancedHeader';
import SimpleErrorBoundary from '@/components/SimpleErrorBoundary';
import SafeFooter from '@/components/SafeFooter';
import GradientLogo from '@/components/ui/GradientLogo';
import GradientButton from '@/components/ui/GradientButton';
import InteractiveChatDemo from '@/components/demo/InteractiveChatDemo';
import ProgressTracker from '@/components/landing/ProgressTracker';
import SimplePricingFallback from '@/components/SimplePricingFallback';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Zap,
  MessageSquare
} from 'lucide-react';
import { safeNavigate } from '@/components/SafeNavigation';

const IndexContent = () => {
  // Manual SEO update using direct DOM manipulation - no React hooks to avoid corruption
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

  const additionalFeatures = [
    {
      icon: Clock,
      title: "Instant Access",
      description: "No waiting lists or appointments. Get support the moment you need it.",
      stats: "Available 24/7 in 29 languages"
    },
    {
      icon: Award,
      title: "Evidence-Based",
      description: "Built on proven therapeutic methods and continuously improved with user feedback.",
      stats: "Based on 50+ therapeutic approaches"
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Enterprise-grade security with end-to-end encryption for all conversations.",
      stats: "HIPAA compliant & GDPR ready"
    }
  ];

  const scrollToDemo = () => {
    const demoElement = document.getElementById('demo');
    if (demoElement) {
      demoElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-white to-calm-50">
      <SimpleErrorBoundary>
        <EnhancedHeader />
      </SimpleErrorBoundary>
      <ProgressTracker />
      
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
                onClick={() => safeNavigate('/onboarding')}
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
          
          <InteractiveChatDemo />
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="therapy-text-gradient">
                Why Choose TherapySync?
              </span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {additionalFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-slate-600 mb-4">{feature.description}</p>
                    <Badge variant="outline" className="bg-therapy-50 text-therapy-700 border-therapy-200">
                      {feature.stats}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-r from-therapy-50/50 to-calm-50/50">
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

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gradient-to-br from-slate-50 via-therapy-50 to-calm-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Choose Your <span className="bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">Wellness Plan</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Start free and upgrade as your mental wellness journey evolves. All plans include our core AI therapy features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {/* Free Plan */}
            <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-2xl bg-white/80 backdrop-blur-sm border-slate-200">
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-slate-500 to-slate-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900 mb-2">Free</CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-slate-800">$0</span>
                </div>
                <p className="text-slate-600 text-sm mb-2">Perfect for getting started</p>
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
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-therapy-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">Community access</span>
                  </li>
                </ul>
                <Button 
                  className="w-full font-semibold text-base py-3 transition-all duration-300 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white shadow-md hover:shadow-lg hover:scale-105"
                  onClick={() => safeNavigate('/onboarding')}
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
              <CardHeader className="text-center pt-16 pb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-therapy-500 to-therapy-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900 mb-2">Pro</CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-slate-800">$19.99</span>
                  <span className="text-slate-600">/month</span>
                </div>
                <p className="text-slate-600 text-sm mb-2">Comprehensive mental health support</p>
              </CardHeader>
              <CardContent className="pt-0 px-6 pb-8">
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-therapy-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">Unlimited AI therapy sessions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-therapy-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">Advanced mood analytics</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-therapy-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">Voice interaction capabilities</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-therapy-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">Priority support</span>
                  </li>
                </ul>
                <Button 
                  className="w-full font-semibold text-base py-3 transition-all duration-300 bg-gradient-to-r from-therapy-500 via-calm-500 to-therapy-600 hover:from-therapy-600 hover:via-calm-600 hover:to-therapy-700 text-white shadow-lg hover:shadow-xl hover:scale-105"
                  onClick={() => safeNavigate('/onboarding')}
                >
                  Start Pro
                </Button>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-2xl bg-white/80 backdrop-blur-sm border-slate-200">
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-harmony-500 to-balance-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-900 mb-2">Premium</CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-slate-800">$39.99</span>
                  <span className="text-slate-600">/month</span>
                </div>
                <p className="text-slate-600 text-sm mb-2">Advanced features and priority support</p>
              </CardHeader>
              <CardContent className="pt-0 px-6 pb-8">
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-therapy-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">Everything in Pro</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-therapy-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">Advanced emotion detection</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-therapy-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">Personalized treatment plans</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-therapy-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">24/7 priority support</span>
                  </li>
                </ul>
                <Button 
                  className="w-full font-semibold text-base py-3 transition-all duration-300 bg-gradient-to-r from-harmony-500 to-balance-500 hover:from-harmony-600 hover:to-balance-600 text-white shadow-lg hover:shadow-lg hover:scale-105"
                  onClick={() => safeNavigate('/onboarding')}
                >
                  Start Premium
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Family Plan Configurator */}
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-harmony-50 to-balance-50 border-harmony-200 shadow-xl">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-harmony-500 to-balance-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-slate-900 mb-4">Family Plans</CardTitle>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  Mental health support for the whole family with adaptive pricing, parental controls, and shared progress tracking.
                </p>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-800 text-lg">Family Features Include:</h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-harmony-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">Up to 6 family members</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-harmony-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">Parental controls & monitoring</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-harmony-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">Family therapy sessions</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-harmony-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">Shared progress insights</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-harmony-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">Child safety features</span>
                      </li>
                    </ul>
                  </div>
                  <div className="text-center">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-harmony-200">
                      <h5 className="text-lg font-semibold text-slate-800 mb-4">Family Plan Pricing</h5>
                      <div className="text-3xl font-bold text-harmony-600 mb-2">$59.99</div>
                      <div className="text-slate-600 mb-4">per month for up to 6 members</div>
                      <div className="text-sm text-slate-500 mb-6">
                        That's less than $10 per family member!
                      </div>
                      <Button 
                        className="w-full font-semibold py-3 bg-gradient-to-r from-harmony-500 to-balance-500 hover:from-harmony-600 hover:to-balance-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                        onClick={() => safeNavigate('/family-features')}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Learn More About Family Plans
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-slate-600 mb-4">
              No credit card required for Free plan. Start your journey today.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
              <span>🔒 HIPAA Compliant</span>
              <span>🌍 Available Worldwide</span>
              <span>💬 24/7 AI Support</span>
              <span>📱 Mobile & Web Access</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Card className="therapy-gradient-bg text-white p-12 shadow-2xl border-0">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Transform Your Mental Health?
              </h2>
              <p className="text-xl mb-8 text-therapy-100 max-w-2xl mx-auto">
                Join thousands who have discovered healing, growth, and support through our AI-powered therapy platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-white text-therapy-600 hover:bg-therapy-50 border-2 border-white hover:border-therapy-200 px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  onClick={() => safeNavigate('/onboarding')}
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Choose Your Plan
                </Button>
                <Button 
                  size="lg" 
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-therapy-600 px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  onClick={() => safeNavigate('/onboarding')}
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Start Onboarding
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <SafeFooter />
    </div>
  );
};

const Index = () => {
  return <IndexContent />;
};

export default Index;
