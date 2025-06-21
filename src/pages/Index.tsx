
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
  Target
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
              Your AI-powered mental health companion. Experience personalized therapy, 
              mood tracking, and community support all in one comprehensive platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleGetStarted}
                size="lg"
                className="bg-gradient-to-r from-harmony-500 to-flow-500 hover:from-harmony-600 hover:to-flow-600"
              >
                Get Started
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button 
                onClick={handleStartTherapy}
                variant="outline"
                size="lg"
                className="border-harmony-300 text-harmony-700 hover:bg-harmony-50"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Start AI Therapy
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
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

          {/* AI Therapy Highlight */}
          <Card className="border-0 bg-gradient-to-r from-harmony-500 to-flow-500 text-white mb-16">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-4">
                    <Brain className="h-8 w-8 mr-3" />
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">AI-Powered Therapy Sessions</h2>
                  <p className="text-harmony-100 mb-6 text-lg">
                    Experience personalized mental health support with our advanced AI therapists. 
                    Available 24/7, tailored to your unique needs and therapeutic preferences.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      onClick={handleStartTherapy}
                      variant="secondary"
                      size="lg"
                      className="bg-white text-harmony-700 hover:bg-harmony-50"
                    >
                      Start Your First Session
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                    <Button 
                      onClick={() => navigate('/features-overview')}
                      variant="outline"
                      size="lg"
                      className="border-white text-white hover:bg-white/10"
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <Card className="text-center border-0 bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-harmony-600 mb-2">24/7</div>
                <p className="text-muted-foreground">AI Support Available</p>
              </CardContent>
            </Card>
            <Card className="text-center border-0 bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-flow-600 mb-2">100%</div>
                <p className="text-muted-foreground">Private & Secure</p>
              </CardContent>
            </Card>
            <Card className="text-center border-0 bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-harmony-600 mb-2">∞</div>
                <p className="text-muted-foreground">Personalized Approaches</p>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Mental Health Journey?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands who have found support, healing, and growth through TherapySync's 
              comprehensive mental health platform.
            </p>
            <Button 
              onClick={handleGetStarted}
              size="lg"
              className="bg-gradient-to-r from-harmony-500 to-flow-500 hover:from-harmony-600 hover:to-flow-600"
            >
              Get Started Today
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Index;
