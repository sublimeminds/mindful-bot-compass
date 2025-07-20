
import React from 'react';
import { useSafeSEO } from '@/hooks/useSafeSEO';
import RegionalNavigationHeader from '@/components/navigation/RegionalNavigationHeader';
import Footer from '@/components/Footer';
import GradientLogo from '@/components/ui/GradientLogo';
import GradientButton from '@/components/ui/GradientButton';
import InteractiveChatDemo from '@/components/demo/InteractiveChatDemo';
import ProgressTracker from '@/components/landing/ProgressTracker';
import EnhancedPricingPage from '@/components/pricing/EnhancedPricingPage';
import UnifiedSearch from '@/components/search/UnifiedSearch';

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
  MessageSquare,
  Lock,
  FileText,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  useSafeSEO({
    title: 'TherapySync - AI-Powered Mental Health Support',
    description: 'Experience personalized AI therapy with voice technology, 24/7 crisis support, and culturally sensitive care. Start your mental health journey today.',
    keywords: 'AI therapy, mental health, online therapy, voice therapy, crisis support, mental wellness'
  });

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

  const complianceStandards = [
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "Full compliance with healthcare privacy regulations"
    },
    {
      icon: Globe,
      title: "GDPR Ready",
      description: "European data protection standards implemented"
    },
    {
      icon: Lock,
      title: "SOC 2 Certified",
      description: "Rigorous security and availability controls"
    },
    {
      icon: FileText,
      title: "CCPA Compliant",
      description: "California consumer privacy rights protected"
    },
    {
      icon: Eye,
      title: "ISO 27001",
      description: "International information security management"
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
      <RegionalNavigationHeader />
      <ProgressTracker />
      
      {/* Hero Section */}
      <section id="hero" className="py-8 lg:py-12 relative overflow-hidden" key={`hero-${Date.now()}`}>
        {/* Dynamic Gradient Background */}
        <div className="absolute inset-0 hero-gradient-bg"></div>
        
        {/* Neural Network Orbs */}
        <div className="neural-orb therapy w-24 h-24 top-20 left-1/4" style={{ animationDelay: '0s' }}></div>
        <div className="neural-orb calm w-16 h-16 top-1/3 right-1/5" style={{ animationDelay: '2s' }}></div>
        <div className="neural-orb harmony w-20 h-20 bottom-1/3 left-1/6" style={{ animationDelay: '4s' }}></div>
        <div className="neural-orb balance w-12 h-12 top-1/2 left-3/4" style={{ animationDelay: '1s' }}></div>
        <div className="neural-orb flow w-18 h-18 bottom-20 right-1/4" style={{ animationDelay: '3s' }}></div>
        
        {/* Morphing Shapes */}
        <div className="morphing-shape w-32 h-32 top-24 right-1/3" style={{ animationDelay: '0s' }}></div>
        <div className="morphing-shape w-20 h-20 bottom-32 left-1/2" style={{ animationDelay: '5s' }}></div>
        <div className="morphing-shape w-16 h-16 top-2/3 left-1/5" style={{ animationDelay: '2.5s' }}></div>
        
        {/* Orbit Elements */}
        <div className="orbit-element top-1/4 left-1/3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-therapy-400 to-calm-400 opacity-60"></div>
        </div>
        <div className="orbit-element bottom-1/4 right-1/3" style={{ animationDelay: '10s' }}>
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-harmony-400 to-balance-400 opacity-60"></div>
        </div>
        
        {/* Data Stream Particles */}
        <div className="data-particle left-1/6" style={{ animationDelay: '0s', background: 'hsl(var(--therapy-500))' }}></div>
        <div className="data-particle left-1/4" style={{ animationDelay: '1s', background: 'hsl(var(--calm-500))' }}></div>
        <div className="data-particle right-1/4" style={{ animationDelay: '2s', background: 'hsl(var(--harmony-500))' }}></div>
        <div className="data-particle right-1/6" style={{ animationDelay: '3s', background: 'hsl(var(--balance-500))' }}></div>
        <div className="data-particle left-1/2" style={{ animationDelay: '4s', background: 'hsl(var(--flow-500))' }}></div>
        <div className="data-particle right-1/2" style={{ animationDelay: '1.5s', background: 'hsl(var(--therapy-400))' }}></div>
        
        {/* Neural Connection SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <line className="neural-connection" x1="20%" y1="30%" x2="80%" y2="40%" style={{ animationDelay: '0s' }} />
          <line className="neural-connection" x1="60%" y1="20%" x2="40%" y2="70%" style={{ animationDelay: '2s' }} />
          <line className="neural-connection" x1="30%" y1="60%" x2="70%" y2="30%" style={{ animationDelay: '4s' }} />
          <line className="neural-connection" x1="10%" y1="50%" x2="90%" y2="60%" style={{ animationDelay: '1s' }} />
          <line className="neural-connection" x1="80%" y1="80%" x2="20%" y2="20%" style={{ animationDelay: '3s' }} />
        </svg>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative hero-breathe">
                <GradientLogo size="xl" className="animate-swirl-breathe animate-glow-pulse" />
                {/* Logo Aura Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-therapy-500/20 to-calm-500/20 rounded-full blur-xl scale-150 -z-10"></div>
              </div>
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
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-fade-in">
              <GradientButton 
                size="lg" 
                className="px-8 py-4 text-lg font-bold hover-scale transition-all duration-300"
                onClick={() => navigate('/onboarding')}
              >
                <Heart className="h-5 w-5 mr-2" />
                Start Free Trial
              </GradientButton>
              <Button 
                size="lg" 
                className="bg-white/90 backdrop-blur-sm border-2 border-therapy-300 text-therapy-700 hover:bg-therapy-50 hover:border-therapy-400 px-8 py-4 text-lg font-bold transition-all duration-300 hover-scale"
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

      {/* Compliance Standards Section */}
      <section id="compliance" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-2xl mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              <span className="therapy-text-gradient">
                Trusted & Compliant
              </span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Your privacy and security are our top priorities. We meet the highest industry standards for healthcare data protection.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-4xl mx-auto">
            {complianceStandards.map((standard, index) => {
              const IconComponent = standard.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-12 h-12 bg-gradient-to-r from-therapy-100 to-calm-100 rounded-xl flex items-center justify-center mx-auto mb-3 transition-all duration-300 group-hover:from-therapy-500 group-hover:to-calm-500 group-hover:scale-110">
                    <IconComponent className="h-6 w-6 text-therapy-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="font-semibold text-sm text-slate-800 mb-1">{standard.title}</h3>
                  <p className="text-xs text-slate-500">{standard.description}</p>
                </div>
              );
            })}
          </div>
          
          <div className="text-center mt-8">
            <Button 
              variant="outline" 
              onClick={() => navigate('/compliance')}
            >
              <FileText className="h-4 w-4 mr-2" />
              View Full Compliance Details
            </Button>
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

      {/* Enhanced Regional Pricing Section */}
      <EnhancedPricingPage />

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
                  onClick={() => navigate('/onboarding')}
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Choose Your Plan
                </Button>
                <Button 
                  size="lg" 
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-therapy-600 px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  onClick={() => navigate('/onboarding')}
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Start Onboarding
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
