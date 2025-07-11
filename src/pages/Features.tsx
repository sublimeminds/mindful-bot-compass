import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  MessageSquare, 
  Shield, 
  Heart, 
  Zap, 
  Users, 
  Globe, 
  Clock, 
  TrendingUp,
  Headphones,
  Target,
  Star,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Features = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "Advanced AI Therapy",
      description: "Our AI is powered by the latest GPT-4 and Claude models, providing intelligent, empathetic therapy sessions.",
      benefits: ["24/7 availability", "Personalized responses", "Evidence-based techniques"]
    },
    {
      icon: MessageSquare,
      title: "Multi-Modal Conversations",
      description: "Chat through text, voice, or video with natural language processing in 29+ languages.",
      benefits: ["Voice recognition", "Emotion detection", "Cultural sensitivity"]
    },
    {
      icon: Shield,
      title: "Crisis Detection & Support",
      description: "Advanced AI monitors for crisis indicators and provides immediate support and resources.",
      benefits: ["Real-time monitoring", "Emergency protocols", "Professional referrals"]
    },
    {
      icon: Heart,
      title: "Emotional Intelligence",
      description: "Our AI understands emotions, mood patterns, and provides personalized emotional support.",
      benefits: ["Mood tracking", "Pattern recognition", "Adaptive responses"]
    },
    {
      icon: Zap,
      title: "Instant Response",
      description: "Get immediate support when you need it most with sub-second response times.",
      benefits: ["No waiting lists", "Immediate availability", "Fast processing"]
    },
    {
      icon: Users,
      title: "Multiple Therapist Personalities",
      description: "Choose from different AI therapist personalities to find the perfect therapeutic match.",
      benefits: ["CBT specialists", "Mindfulness experts", "Trauma-informed care"]
    },
    {
      icon: Globe,
      title: "Global Cultural Awareness",
      description: "Culturally sensitive therapy that understands diverse backgrounds and perspectives.",
      benefits: ["29+ languages", "Cultural contexts", "Religious sensitivity"]
    },
    {
      icon: Clock,
      title: "Progress Tracking",
      description: "Comprehensive analytics and insights to track your mental health journey over time.",
      benefits: ["Mood analytics", "Progress reports", "Goal setting"]
    },
    {
      icon: TrendingUp,
      title: "Personalized Treatment Plans",
      description: "AI-generated treatment plans tailored to your specific needs and goals.",
      benefits: ["Custom strategies", "Adaptive plans", "Evidence-based"]
    }
  ];

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-white to-calm-50">
        {/* Hero Section */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="mb-6 therapy-gradient-bg text-white px-8 py-3 text-sm font-semibold shadow-lg border-0">
                <Star className="h-4 w-4 mr-2" />
                Advanced Features
                <Zap className="h-4 w-4 ml-2" />
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <span className="therapy-text-gradient-animated">
                  Revolutionary AI Therapy Features
                </span>
              </h1>
              
              <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
                Experience the future of mental health care with cutting-edge AI technology that understands, 
                adapts, and evolves with your unique therapy journey.
              </p>
              
              <Button 
                onClick={() => navigate('/ai-architecture')}
                className="therapy-gradient-bg text-white px-8 py-4 text-lg rounded-xl shadow-xl hover:scale-105 transition-all duration-300"
              >
                Explore AI Architecture
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {features.map((feature, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-800">{feature.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-slate-600 mb-4">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-center text-sm text-slate-600">
                          <div className="w-1.5 h-1.5 bg-therapy-500 rounded-full mr-3"></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Showcase */}
        <section className="py-20 bg-gradient-to-r from-therapy-600 via-therapy-700 to-calm-600 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Powered by Cutting-Edge AI
              </h2>
              <p className="text-xl text-therapy-100 mb-8">
                Our platform combines the best of OpenAI GPT-4, Anthropic Claude, and specialized mental health AI models 
                to provide the most advanced therapeutic experience available.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">99.7%</div>
                  <div className="text-therapy-200">User Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">29+</div>
                  <div className="text-therapy-200">Languages Supported</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">24/7</div>
                  <div className="text-therapy-200">Always Available</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 therapy-text-gradient">
                Ready to Experience the Future of Therapy?
              </h2>
              <p className="text-xl text-slate-600 mb-8">
                Join thousands of users who have transformed their mental health with our AI-powered platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigate('/auth')}
                  className="therapy-gradient-bg text-white px-8 py-4 text-lg rounded-xl shadow-xl hover:scale-105 transition-all duration-300"
                >
                  Start Free Trial
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                <Button 
                  onClick={() => navigate('/pricing')}
                  variant="outline"
                  className="border-2 border-therapy-300 text-therapy-700 px-8 py-4 text-lg rounded-xl hover:bg-therapy-50 transition-all duration-300"
                >
                  View Pricing
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Features;