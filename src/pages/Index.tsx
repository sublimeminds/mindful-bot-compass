
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Heart, 
  Shield, 
  Globe, 
  Headphones, 
  MessageSquare, 
  Users, 
  Zap,
  Star,
  Clock,
  Award,
  ArrowRight,
  Check,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSafeSEO } from '@/hooks/useSafeSEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GradientLogo from '@/components/ui/GradientLogo';
import PricingSection from '@/components/PricingSection';

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
    }
  ];

  const stats = [
    { number: "50,000+", label: "Active Users" },
    { number: "1M+", label: "Therapy Sessions" },
    { number: "29", label: "Languages" },
    { number: "24/7", label: "Availability" }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      text: "TherapySync has been a game-changer for my mental health journey. The AI understands me better than I expected.",
      rating: 5
    },
    {
      name: "David L.",
      text: "The voice feature makes it feel like talking to a real therapist. I love that I can get help anytime.",
      rating: 5
    },
    {
      name: "Maria G.",
      text: "Finally, therapy that understands my cultural background. The LGBTQ+ support has been incredible.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-white to-calm-50">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 therapy-gradient-bg opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <GradientLogo size="xl" className="animate-swirl-breathe" />
            </div>
            
            <Badge className="mb-6 therapy-gradient-bg text-white px-8 py-3 text-sm font-semibold shadow-lg border-0">
              <Sparkles className="h-4 w-4 mr-2" />
              AI-Powered Mental Health
              <Heart className="h-4 w-4 ml-2" />
            </Badge>
            
            <h1 className="text-4xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="therapy-text-gradient-animated">
                Your AI Therapy Companion
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto mb-8 leading-relaxed">
              Experience personalized mental health support with advanced AI therapy, 
              voice technology, and 24/7 crisis support. Start your healing journey today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="therapy-gradient-bg text-white px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0"
                onClick={() => navigate('/auth')}
              >
                <Heart className="h-5 w-5 mr-2" />
                Get Started Free
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-therapy-300 text-therapy-700 hover:bg-therapy-50 px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-therapy-500/20 transition-all duration-300 hover:scale-105"
                onClick={() => navigate('/therapy-chat')}
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                Try Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-therapy-50/50 to-calm-50/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold therapy-text-gradient mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
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

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-therapy-50/50 to-calm-50/50">
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
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-therapy-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-600 mb-4 italic">"{testimonial.text}"</p>
                  <div className="font-semibold text-slate-800">{testimonial.name}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <PricingSection />
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Card className="therapy-gradient-bg text-white p-12 shadow-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Transform Your Mental Health?
              </h2>
              <p className="text-xl mb-8 text-therapy-100 max-w-2xl mx-auto">
                Join thousands who have discovered healing, growth, and support through our AI-powered therapy platform.
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
                  onClick={() => navigate('/features-overview')}
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Explore Features
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
