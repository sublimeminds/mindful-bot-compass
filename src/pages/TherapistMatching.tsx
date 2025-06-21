
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Heart, 
  Users, 
  Sparkles, 
  CheckCircle,
  ArrowRight,
  Target,
  MessageCircle,
  Crown,
  Star,
  Zap,
  Shield
} from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const TherapistMatching = () => {
  const navigate = useNavigate();
  
  useSEO({
    title: 'AI Therapist Matching - Find Your Perfect Match | TherapySync',
    description: 'Advanced AI-powered therapist matching based on your unique needs, preferences, and therapeutic goals.',
    keywords: 'therapist matching, AI matching, personalized therapy, therapist selection'
  });

  const matchingFeatures = [
    {
      title: "Personality Analysis",
      description: "Deep analysis of your communication style and preferences",
      icon: Brain,
      features: ["Communication patterns", "Personality traits", "Therapeutic preferences"]
    },
    {
      title: "Needs Assessment",
      description: "Comprehensive evaluation of your mental health goals",
      icon: Target,
      features: ["Symptom analysis", "Goal identification", "Treatment history"]
    },
    {
      title: "AI Compatibility Score",
      description: "Advanced matching algorithm for optimal therapist pairing",
      icon: Sparkles,
      features: ["98% accuracy rate", "Continuous learning", "Personalized scoring"]
    },
    {
      title: "Cultural Sensitivity",
      description: "Matching based on cultural background and values",
      icon: Heart,
      features: ["Cultural awareness", "Language preferences", "Religious considerations"]
    }
  ];

  const matchingSteps = [
    {
      step: 1,
      title: "Complete Assessment",
      description: "Answer questions about your needs, preferences, and goals",
      icon: MessageCircle,
      duration: "5-7 minutes"
    },
    {
      step: 2,
      title: "AI Analysis",
      description: "Our AI analyzes your responses and creates your unique profile",
      icon: Brain,
      duration: "< 30 seconds"
    },
    {
      step: 3,
      title: "Therapist Matching",
      description: "Get matched with 3-5 compatible AI therapists",
      icon: Users,
      duration: "Instant"
    },
    {
      step: 4,
      title: "Start Therapy",
      description: "Begin your personalized therapy journey",
      icon: Zap,
      duration: "Immediate"
    }
  ];

  const benefits = [
    "98% match satisfaction rate",
    "Personalized therapeutic approach",
    "Cultural and linguistic compatibility",
    "Flexible therapist switching",
    "Continuous compatibility assessment",
    "Evidence-based matching algorithms"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2">
            <Sparkles className="h-4 w-4 mr-2" />
            AI-Powered Matching
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Find Your Perfect
            <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Therapist Match
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Our advanced AI matching system analyzes your unique needs, preferences, and goals 
            to connect you with the most compatible AI therapist for your journey.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              onClick={() => navigate('/therapists')}
            >
              <Users className="h-5 w-5 mr-2" />
              Start Matching Process
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/therapist-profiles')}
            >
              <Star className="h-5 w-5 mr-2" />
              Browse All Therapists
            </Button>
          </div>
        </div>

        {/* Matching Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {matchingFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-4">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.features.map((item, i) => (
                      <li key={i} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* How It Works */}
        <Card className="mb-16">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-4">How AI Matching Works</CardTitle>
            <p className="text-slate-600">A simple 4-step process to find your ideal AI therapist</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {matchingSteps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div key={index} className="text-center relative">
                    {index < matchingSteps.length - 1 && (
                      <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-purple-300 to-pink-300 transform -translate-y-1/2"></div>
                    )}
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <Badge variant="outline" className="mb-2">Step {step.step}</Badge>
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-slate-600 mb-2">{step.description}</p>
                    <Badge variant="secondary" className="text-xs">{step.duration}</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Shield className="h-5 w-5 mr-2" />
                Why Our Matching Works
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Crown className="h-5 w-5 mr-2" />
                Premium Matching Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Star className="h-4 w-4 text-purple-500 mr-3" />
                  <span className="text-sm">Advanced personality profiling</span>
                </li>
                <li className="flex items-center">
                  <Star className="h-4 w-4 text-purple-500 mr-3" />
                  <span className="text-sm">Continuous compatibility monitoring</span>
                </li>
                <li className="flex items-center">
                  <Star className="h-4 w-4 text-purple-500 mr-3" />
                  <span className="text-sm">Therapist switching recommendations</span>
                </li>
                <li className="flex items-center">
                  <Star className="h-4 w-4 text-purple-500 mr-3" />
                  <span className="text-sm">Cultural and linguistic matching</span>
                </li>
              </ul>
              <Button 
                className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                onClick={() => navigate('/plans')}
              >
                Upgrade for Premium Matching
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="border-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Match?</h2>
            <p className="text-purple-100 mb-8 max-w-2xl mx-auto text-lg">
              Join thousands who have found their ideal AI therapist through our advanced matching system. 
              Start your personalized mental wellness journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-white text-purple-600 hover:bg-purple-50"
                onClick={() => navigate('/therapists')}
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Start Matching Now
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
                onClick={() => navigate('/therapist-profiles')}
              >
                <Users className="h-5 w-5 mr-2" />
                View All Therapists
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default TherapistMatching;
