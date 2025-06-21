
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Brain, 
  Heart,
  Sparkles,
  ArrowRight,
  BookOpen,
  Calendar,
  Users,
  Shield,
  Zap,
  Target,
  Volume2,
  Play,
  Star,
  Check,
  Globe,
  Headphones,
  Award,
  TrendingUp
} from 'lucide-react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GradientLogo from '@/components/ui/GradientLogo';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useSimpleApp();

  const features = [
    {
      icon: MessageCircle,
      title: "AI Therapy Sessions",
      description: "Connect with AI therapists for personalized mental health support",
      path: "/therapy"
    },
    {
      icon: Brain,
      title: "Mood Tracking",
      description: "Track and understand your emotional patterns over time",
      path: "/mood-tracking"
    },
    {
      icon: Target,
      title: "Goal Setting",
      description: "Set and achieve personal mental health goals",
      path: "/goals"
    },
    {
      icon: BookOpen,
      title: "Digital Notebook",
      description: "Journal your thoughts and track your progress",
      path: "/notebook"
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "AI-powered scheduling for therapy sessions",
      path: "/smart-scheduling"
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with others on similar mental health journeys",
      path: "/community"
    }
  ];

  const therapists = [
    {
      name: "Dr. Sarah Chen",
      specialty: "Anxiety & CBT",
      voice: "Aria",
      personality: "Professional & Direct",
      avatar: "👩‍⚕️"
    },
    {
      name: "Dr. Michael Rodriguez",
      specialty: "Trauma & EMDR",
      voice: "Callum",
      personality: "Gentle & Patient",
      avatar: "👨‍⚕️"
    },
    {
      name: "Dr. Emily Johnson",
      specialty: "Mindfulness",
      voice: "Charlotte",
      personality: "Soothing & Wise",
      avatar: "👩‍🏫"
    }
  ];

  const pricingTiers = [
    {
      name: "Free",
      price: "$0",
      features: ["5 AI sessions/month", "Basic mood tracking", "Community access", "Text-based chat"],
      color: "from-gray-500 to-gray-600"
    },
    {
      name: "Premium",
      price: "$29",
      popular: true,
      features: ["Unlimited AI sessions", "Voice conversations", "Advanced analytics", "Premium voices"],
      color: "from-harmony-500 to-flow-500"
    },
    {
      name: "Plus",
      price: "$79",
      features: ["Everything in Premium", "Voice cloning", "API access", "Priority support"],
      color: "from-therapy-500 to-calm-500"
    }
  ];

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  const handleStartTherapy = () => {
    if (user) {
      navigate('/therapy');
    } else {
      navigate('/auth');
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-harmony-50 to-flow-50">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <GradientLogo size="lg" className="drop-shadow-lg" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-harmony-600 to-flow-600 bg-clip-text text-transparent mb-6">
              TherapySync
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Your AI-powered mental health companion with advanced voice technology. 
              Experience personalized therapy, mood tracking, and community support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleGetStarted}
                size="lg"
                className="bg-gradient-to-r from-harmony-500 to-flow-500 hover:from-harmony-600 hover:to-flow-600"
              >
                Get Started Free
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button 
                onClick={handleStartTherapy}
                variant="outline"
                size="lg"
                className="border-harmony-300 text-harmony-700 hover:bg-harmony-50"
              >
                <Play className="h-5 w-5 mr-2" />
                Try Voice Demo
              </Button>
            </div>
          </div>

          {/* Voice Technology Highlight */}
          <Card className="border-0 bg-gradient-to-r from-therapy-500 to-calm-500 text-white mb-16">
            <CardContent className="p-8">
              <div className="text-center">
                <Volume2 className="h-12 w-12 mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-4">Powered by ElevenLabs AI Voice Technology</h2>
                <p className="text-therapy-100 mb-6 text-lg max-w-2xl mx-auto">
                  Experience natural, emotionally aware conversations with our AI therapists. 
                  Supporting 29 languages with premium voice quality.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <Headphones className="h-8 w-8 mx-auto mb-2" />
                    <div className="font-semibold">Premium Voices</div>
                    <div className="text-sm opacity-90">Therapist-matched</div>
                  </div>
                  <div className="text-center">
                    <Brain className="h-8 w-8 mx-auto mb-2" />
                    <div className="font-semibold">Emotion Detection</div>
                    <div className="text-sm opacity-90">Real-time analysis</div>
                  </div>
                  <div className="text-center">
                    <Globe className="h-8 w-8 mx-auto mb-2" />
                    <div className="font-semibold">29 Languages</div>
                    <div className="text-sm opacity-90">Global support</div>
                  </div>
                  <div className="text-center">
                    <Shield className="h-8 w-8 mx-auto mb-2" />
                    <div className="font-semibold">HIPAA Compliant</div>
                    <div className="text-sm opacity-90">Secure & private</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Comprehensive Mental Health Platform</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card 
                  key={index} 
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm"
                  onClick={() => navigate(feature.path)}
                >
                  <CardHeader className="text-center pb-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-harmony-500 to-flow-500 rounded-lg mx-auto mb-4">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Meet Our Therapists */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Meet Your AI Therapists</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Each therapist has a unique personality, specialization, and voice powered by ElevenLabs technology.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {therapists.map((therapist, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4">{therapist.avatar}</div>
                    <h3 className="font-bold text-lg mb-2">{therapist.name}</h3>
                    <Badge variant="outline" className="mb-2">{therapist.specialty}</Badge>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center justify-center space-x-2">
                        <Volume2 className="h-4 w-4" />
                        <span>Voice: {therapist.voice}</span>
                      </div>
                      <div>{therapist.personality}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center">
              <Button 
                onClick={() => navigate('/therapists')}
                variant="outline"
                className="border-harmony-300 text-harmony-700 hover:bg-harmony-50"
              >
                <Users className="h-4 w-4 mr-2" />
                Meet All Therapists
              </Button>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="mb-16" id="pricing">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Start free and upgrade as you grow. All plans include AI therapy sessions and community support.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {pricingTiers.map((tier, index) => (
                <Card key={index} className={`relative ${tier.popular ? 'ring-2 ring-harmony-500 scale-105' : ''}`}>
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-harmony-500 text-white">
                        <Star className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">{tier.name}</CardTitle>
                    <div className="text-3xl font-bold">
                      {tier.price}
                      {tier.price !== "$0" && <span className="text-base font-normal">/month</span>}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {tier.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center text-sm">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full bg-gradient-to-r ${tier.color} text-white`}
                      onClick={() => navigate('/plans')}
                    >
                      {tier.price === "$0" ? "Get Started" : "Choose Plan"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center">
              <Button 
                onClick={() => navigate('/compare-plans')}
                variant="outline"
                className="border-harmony-300 text-harmony-700 hover:bg-harmony-50"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Compare All Features
              </Button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <Card className="text-center border-0 bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-harmony-600 mb-2">24/7</div>
                <p className="text-muted-foreground">AI Support Available</p>
              </CardContent>
            </Card>
            <Card className="text-center border-0 bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-flow-600 mb-2">29</div>
                <p className="text-muted-foreground">Languages Supported</p>
              </CardContent>
            </Card>
            <Card className="text-center border-0 bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-therapy-600 mb-2">100%</div>
                <p className="text-muted-foreground">Private & Secure</p>
              </CardContent>
            </Card>
            <Card className="text-center border-0 bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-calm-600 mb-2">∞</div>
                <p className="text-muted-foreground">Personalized Care</p>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Mental Health?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands who have found support, healing, and growth through TherapySync's 
              AI-powered mental health platform with premium voice technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleGetStarted}
                size="lg"
                className="bg-gradient-to-r from-harmony-500 to-flow-500 hover:from-harmony-600 hover:to-flow-600"
              >
                Start Your Free Journey
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button 
                onClick={() => navigate('/therapists')}
                variant="outline"
                size="lg"
                className="border-harmony-300 text-harmony-700 hover:bg-harmony-50"
              >
                <Volume2 className="h-5 w-5 mr-2" />
                Experience Voice Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Index;
