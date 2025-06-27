
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
  Smartphone,
  Lock,
  Target,
  Lightbulb
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSafeSEO } from '@/hooks/useSafeSEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const HowItWorks = () => {
  const navigate = useNavigate();
  
  useSafeSEO({
    title: 'How TherapySync Works - AI-Powered Mental Health Platform',
    description: 'Learn how TherapySync transforms mental health care with AI technology, voice interactions, and personalized therapy.',
    keywords: 'how therapy works, AI therapy process, mental health platform, voice therapy, personalized care'
  });

  const steps = [
    {
      number: "01",
      title: "Quick Assessment",
      description: "Complete our comprehensive mental health assessment to understand your unique needs, goals, and preferences.",
      icon: UserCheck,
      features: ["5-minute personalized assessment", "Privacy-focused questionnaire", "AI-powered analysis", "Cultural sensitivity"],
      details: "Our intelligent assessment evaluates your mental health needs, therapeutic preferences, and personal goals to create a customized treatment plan."
    },
    {
      number: "02", 
      title: "Choose Your AI Therapist",
      description: "Select from our diverse range of AI therapists, each specialized in different therapeutic approaches and personality styles.",
      icon: Brain,
      features: ["8 specialized AI therapists", "Multiple therapeutic approaches", "Personality matching", "Instant availability 24/7"],
      details: "Our AI therapists are trained in CBT, DBT, mindfulness, and other evidence-based approaches, with distinct personalities to match your preferences."
    },
    {
      number: "03",
      title: "Start Voice Sessions",
      description: "Begin personalized therapy with natural voice conversations or text-based sessions in your preferred language.",
      icon: Headphones,
      features: ["Natural voice conversations", "29 languages supported", "Real-time emotion detection", "Text and voice options"],
      details: "Experience therapy like never before with our advanced voice technology that understands emotions, context, and cultural nuances."
    },
    {
      number: "04",
      title: "Track Progress",
      description: "Monitor your mental health journey with detailed analytics, mood tracking, and personalized insights.",
      icon: BarChart3,
      features: ["Visual progress tracking", "Mood analytics", "Goal achievement metrics", "Adaptive recommendations"],
      details: "Our intelligent system tracks your progress and adapts your treatment plan based on your responses and improvements over time."
    }
  ];

  const features = [
    {
      icon: Volume2,
      title: "Advanced Voice Technology",
      description: "Natural, emotionally-aware conversations with real-time emotion detection",
      benefits: ["98% accuracy in emotion recognition", "Natural conversation flow", "Cultural adaptation", "29 languages supported"]
    },
    {
      icon: Shield,
      title: "24/7 Crisis Management",
      description: "Automatic crisis detection with immediate intervention protocols",
      benefits: ["Real-time risk assessment", "Emergency escalation", "Crisis resource connection", "Safety plan activation"]
    },
    {
      icon: Brain,
      title: "AI-Powered Personalization",
      description: "Adaptive therapy that learns and evolves with your progress",
      benefits: ["Personalized treatment plans", "Adaptive recommendations", "Learning from interactions", "Continuous optimization"]
    },
    {
      icon: Users,
      title: "Human Therapist Integration",
      description: "Seamless connection to licensed human therapists when needed",
      benefits: ["Professional oversight", "Escalation protocols", "Hybrid care model", "Licensed therapist network"]
    }
  ];

  const technologies = [
    {
      icon: Mic,
      title: "Voice Recognition",
      description: "Advanced speech processing with emotional intelligence"
    },
    {
      icon: Eye,
      title: "Emotion Detection",
      description: "Real-time analysis of emotional states and patterns"
    },
    {
      icon: Lock,
      title: "Privacy Protection",
      description: "End-to-end encryption and HIPAA compliance"
    },
    {
      icon: Globe,
      title: "Global Accessibility",
      description: "Multi-language support with cultural sensitivity"
    }
  ];

  const faqs = [
    {
      question: "Is AI therapy as effective as human therapy?",
      answer: "Studies show that AI therapy can be highly effective for many conditions, especially when combined with human oversight. Our platform provides 24/7 availability and consistent quality while maintaining the option to connect with human therapists."
    },
    {
      question: "How secure is my personal information?",
      answer: "We use end-to-end encryption, HIPAA compliance, and never store sensitive conversations. Your privacy and security are our top priorities."
    },
    {
      question: "Can I switch between AI and human therapists?",
      answer: "Yes, our platform seamlessly integrates AI and human therapists. You can escalate to a human therapist at any time or use both in combination."
    },
    {
      question: "What therapeutic approaches do you support?",
      answer: "Our AI therapists are trained in CBT, DBT, mindfulness-based therapy, acceptance and commitment therapy, and other evidence-based approaches."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 to-calm-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-gradient-to-r from-therapy-500 to-calm-500 text-white px-6 py-2">
              <Lightbulb className="h-4 w-4 mr-2" />
              How It Works
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-therapy-900 mb-6 leading-tight">
              Your Journey to
              <span className="block bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">
                Better Mental Health
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-therapy-600 mb-8 leading-relaxed">
              Discover how TherapySync combines cutting-edge AI technology with proven therapeutic methods 
              to provide personalized mental health support anytime, anywhere.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700 text-white px-8 py-4 text-lg"
                onClick={() => navigate('/auth')}
              >
                <Heart className="h-5 w-5 mr-2" />
                Start Your Journey
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-therapy-300 text-therapy-700 hover:bg-therapy-50 px-8 py-4 text-lg"
                onClick={() => navigate('/downloads')}
              >
                <Smartphone className="h-5 w-5 mr-2" />
                Download App
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Steps */}
      <section className="py-20 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-therapy-900 mb-6">
              Simple Steps to Better Mental Health
            </h2>
            <p className="text-xl text-therapy-600 max-w-3xl mx-auto">
              Our streamlined process makes it easy to start your mental health journey with AI-powered support.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="relative">
                  <Card className="h-full hover:shadow-xl transition-all duration-300 group hover:scale-105 bg-white">
                    <CardContent className="p-6">
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse shadow-lg">
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        <div className="text-sm font-bold text-therapy-500 mb-2">STEP {step.number}</div>
                        <h3 className="text-xl font-semibold mb-3 text-therapy-800">{step.title}</h3>
                        <p className="text-therapy-600 text-sm mb-4">{step.description}</p>
                        <p className="text-xs text-therapy-500 mb-4">{step.details}</p>
                      </div>

                      <div className="space-y-2">
                        {step.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-therapy-500 flex-shrink-0" />
                            <span className="text-sm text-therapy-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Arrow connector for desktop */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ArrowRight className="h-6 w-6 text-therapy-500" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-gradient-to-br from-harmony-50 via-balance-50 to-flow-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-therapy-900 mb-6">
              Powerful Features That Make a Difference
            </h2>
            <p className="text-xl text-therapy-600 max-w-3xl mx-auto">
              Our platform combines advanced AI technology with evidence-based therapeutic approaches.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="p-8 hover:shadow-xl transition-all duration-300 bg-white">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-therapy-900 mb-2">{feature.title}</h3>
                      <p className="text-therapy-600 mb-4">{feature.description}</p>
                      <div className="space-y-2">
                        {feature.benefits.map((benefit, benefitIndex) => (
                          <div key={benefitIndex} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-therapy-500 flex-shrink-0" />
                            <span className="text-sm text-therapy-600">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Advanced Technology Stack
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Built on cutting-edge AI and machine learning technologies for the best therapeutic experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {technologies.map((tech, index) => {
              const IconComponent = tech.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-4 hover:bg-white/20 transition-colors">
                    <IconComponent className="h-12 w-12 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">{tech.title}</h3>
                    <p className="text-blue-100 text-sm">{tech.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-therapy-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-therapy-600 max-w-3xl mx-auto">
              Get answers to common questions about our AI-powered therapy platform.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6">
                <h3 className="text-lg font-semibold text-therapy-900 mb-3">{faq.question}</h3>
                <p className="text-therapy-600 leading-relaxed">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-therapy-500 to-calm-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Start Your Mental Health Journey?
          </h2>
          <p className="text-xl text-therapy-100 mb-8 max-w-3xl mx-auto">
            Join thousands who have found healing and growth through our AI-powered therapy platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-white text-therapy-600 hover:bg-therapy-50 px-8 py-4 text-lg"
              onClick={() => navigate('/auth')}
            >
              <Heart className="h-5 w-5 mr-2" />
              Start Free Trial
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg"
              onClick={() => navigate('/downloads')}
            >
              <Smartphone className="h-5 w-5 mr-2" />
              Download App
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowItWorks;
