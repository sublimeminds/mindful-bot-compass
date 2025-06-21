
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Brain, 
  Calendar, 
  Users, 
  Heart, 
  Lock, 
  Zap, 
  BarChart3, 
  Bell, 
  Monitor,
  CheckCircle,
  Star,
  Globe,
  Activity,
  HeartHandshake,
  BookOpen,
  MessageCircle,
  Mic,
  Eye,
  Target,
  TrendingUp,
  Lightbulb,
  Crown,
  ArrowRight,
  Volume2,
  Languages,
  Award,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeaturesShowcase = () => {
  const navigate = useNavigate();

  const coreFeatures = [
    {
      category: "Advanced AI Therapy",
      icon: Brain,
      color: "from-therapy-500 to-therapy-600",
      description: "State-of-the-art AI technology that understands context, emotions, and therapeutic nuances with 98% accuracy.",
      features: [
        "Natural language processing with emotional intelligence",
        "Personalized therapeutic approach selection",
        "Evidence-based intervention recommendations", 
        "Continuous learning from session outcomes",
        "Multi-language support with cultural awareness"
      ],
      links: [
        { title: "Explore TherapySync AI", href: "/therapysync-ai" },
        { title: "AI Technology Hub", href: "/ai-hub" },
        { title: "Start AI Therapy", href: "/therapy" }
      ]
    },
    {
      category: "Voice Technology & ElevenLabs Integration",
      icon: Mic,
      color: "from-blue-500 to-blue-600",
      description: "Revolutionary voice synthesis technology providing natural, emotionally-aware conversations in 29 languages.",
      features: [
        "ElevenLabs premium voice synthesis",
        "Real-time emotion detection from voice patterns",
        "Voice-based stress level monitoring",
        "Cultural voice sensitivity and adaptation",
        "Advanced voice analytics and insights"
      ],
      links: [
        { title: "Voice Technology Details", href: "/voice-technology" },
        { title: "Meet AI Therapists", href: "/therapists" },
        { title: "Voice Demo", href: "/voice-demo" }
      ]
    },
    {
      category: "Crisis Management & Safety",
      icon: Shield,
      color: "from-red-500 to-red-600",
      description: "Comprehensive 24/7 crisis detection and intervention system with automatic escalation protocols.",
      features: [
        "Real-time AI crisis detection with 95% accuracy",
        "Automatic escalation to emergency services",
        "Personalized safety planning tools",
        "24/7 crisis intervention protocols",
        "Emergency contacts integration"
      ],
      links: [
        { title: "Crisis Management Details", href: "/crisis-management" },
        { title: "Safety Resources", href: "/crisis-resources" },
        { title: "Emergency Protocols", href: "/emergency-protocols" }
      ]
    },
    {
      category: "Smart Analytics & Insights",
      icon: BarChart3,
      color: "from-green-500 to-green-600",
      description: "Comprehensive analytics platform with predictive insights and detailed progress tracking.",
      features: [
        "AI-powered progress prediction",
        "Mood pattern recognition and analysis",
        "Personalized intervention timing",
        "Outcome measurement and tracking",
        "Professional-grade reporting tools"
      ],
      links: [
        { title: "Session Analytics", href: "/session-analytics" },
        { title: "Progress Tracking", href: "/progress-tracking" },
        { title: "Professional Dashboard", href: "/professional-dashboard" }
      ]
    },
    {
      category: "Personalized Therapist Matching",
      icon: Users,
      color: "from-purple-500 to-purple-600",
      description: "Advanced AI-powered matching system to connect you with the perfect AI therapist for your needs.",
      features: [
        "Personality and preference analysis",
        "Specialization-based matching",
        "Cultural background consideration",
        "Communication style preferences",
        "Continuous improvement based on feedback"
      ],
      links: [
        { title: "Find Your Therapist", href: "/therapist-matching" },
        { title: "Therapist Profiles", href: "/therapists" },
        { title: "Individual Profiles", href: "/therapist-profiles" }
      ]
    },
    {
      category: "Digital Wellness Tools",
      icon: Heart,
      color: "from-pink-500 to-pink-600", 
      description: "Comprehensive digital toolkit for mental wellness, including journaling, techniques, and community support.",
      features: [
        "AI-enhanced digital journaling",
        "Guided therapeutic techniques library",
        "Mindfulness and meditation resources",
        "Community support groups",
        "Progress visualization tools"
      ],
      links: [
        { title: "Digital Notebook", href: "/notebook" },
        { title: "Techniques Library", href: "/techniques" },
        { title: "Community Support", href: "/community" }
      ]
    }
  ];

  const advancedFeatures = [
    {
      title: "Smart Scheduling & Optimization",
      description: "AI-optimized session timing based on your mood patterns and availability",
      icon: Calendar,
      features: ["Predictive scheduling", "Mood-based timing", "Automatic reminders"],
      href: "/smart-scheduling"
    },
    {
      title: "Enhanced Monitoring",
      description: "Advanced progress monitoring with real-time insights and alerts",
      icon: Monitor,
      features: ["Real-time monitoring", "Progress alerts", "Intervention triggers"],
      href: "/enhanced-monitoring"
    },
    {
      title: "Goal Setting & Tracking",
      description: "Intelligent goal management with AI-powered recommendations",
      icon: Target,
      features: ["SMART goals", "Progress tracking", "Achievement insights"],
      href: "/goals"
    },
    {
      title: "Therapeutic Techniques",
      description: "Comprehensive library of evidence-based therapeutic interventions",
      icon: Sparkles,
      features: ["CBT techniques", "Mindfulness practices", "Guided exercises"],
      href: "/techniques"
    }
  ];

  const elevenLabsShowcase = [
    {
      title: "Premium Voice Quality",
      description: "Studio-grade voice synthesis with natural intonation and emotional expression",
      features: ["29 language support", "Emotional adaptation", "Cultural sensitivity"]
    },
    {
      title: "Real-Time Voice Analytics",
      description: "Advanced voice pattern analysis for therapeutic insights",
      features: ["Stress detection", "Emotion tracking", "Progress monitoring"]
    },
    {
      title: "Conversational AI",
      description: "Natural, flowing conversations with interruption handling",
      features: ["Real-time responses", "Context awareness", "Natural dialogue"]
    }
  ];

  const integrationFeatures = [
    {
      title: "Privacy & Security",
      icon: Lock,
      description: "Enterprise-grade security with HIPAA compliance",
      compliance: ["HIPAA", "SOC 2", "ISO 27001", "GDPR"]
    },
    {
      title: "Global Accessibility", 
      icon: Globe,
      description: "Available worldwide with multi-language support",
      compliance: ["29 Languages", "Cultural Adaptation", "Timezone Support"]
    },
    {
      title: "Clinical Excellence",
      icon: Award,
      description: "Evidence-based protocols and professional standards",
      compliance: ["Clinical Guidelines", "Professional Standards", "Quality Assurance"]
    }
  ];

  return (
    <div className="py-16 bg-gradient-to-br from-therapy-50 to-calm-50">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold text-therapy-900 mb-6">
            Comprehensive Mental Health
            <span className="block bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">
              Technology Platform
            </span>
          </h1>
          <p className="text-xl text-therapy-600 max-w-4xl mx-auto mb-8">
            TherapySync combines cutting-edge AI technology, advanced voice synthesis, and evidence-based therapeutic approaches 
            to deliver personalized, effective mental health support at scale.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Badge className="bg-therapy-100 text-therapy-800 px-4 py-2">
              <Brain className="h-4 w-4 mr-2" />
              Advanced AI Technology
            </Badge>
            <Badge className="bg-therapy-100 text-therapy-800 px-4 py-2">
              <Mic className="h-4 w-4 mr-2" />
              ElevenLabs Voice Integration
            </Badge>
            <Badge className="bg-therapy-100 text-therapy-800 px-4 py-2">
              <Shield className="h-4 w-4 mr-2" />
              Crisis Management
            </Badge>
            <Badge className="bg-therapy-100 text-therapy-800 px-4 py-2">
              <Globe className="h-4 w-4 mr-2" />
              29 Languages
            </Badge>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700"
              onClick={() => navigate('/register')}
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/therapysync-ai')}
            >
              <Brain className="h-5 w-5 mr-2" />
              Explore AI Features
            </Button>
          </div>
        </div>

        {/* Core Features Grid */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-therapy-900 text-center mb-4">Core Features & Capabilities</h2>
          <p className="text-xl text-therapy-600 text-center mb-12 max-w-3xl mx-auto">
            Explore our comprehensive suite of AI-powered mental health tools and technologies
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {coreFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.color}`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-xl text-therapy-900">
                        {feature.category}
                      </CardTitle>
                    </div>
                    <p className="text-therapy-600 text-sm mb-4">{feature.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-3 text-therapy-800">Key Features:</h4>
                      <ul className="space-y-2">
                        {feature.features.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start space-x-3">
                            <CheckCircle className="h-4 w-4 text-therapy-500 mt-0.5 flex-shrink-0" />
                            <span className="text-therapy-700 text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h4 className="font-semibold mb-3 text-therapy-800">Learn More:</h4>
                      <div className="flex flex-wrap gap-2">
                        {feature.links.map((link, linkIndex) => (
                          <Button
                            key={linkIndex}
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(link.href)}
                            className="text-xs"
                          >
                            {link.title}
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* ElevenLabs Showcase */}
        <div className="mb-20">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
            <CardContent className="p-12">
              <div className="text-center mb-8">
                <Volume2 className="h-16 w-16 mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-4">ElevenLabs Voice Integration</h2>
                <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                  Experience the future of AI therapy with natural, emotionally-aware voice conversations 
                  powered by ElevenLabs' cutting-edge voice synthesis technology.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {elevenLabsShowcase.map((item, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                    <h3 className="font-semibold text-lg mb-3">{item.title}</h3>
                    <p className="text-blue-100 text-sm mb-4">{item.description}</p>
                    <ul className="space-y-1">
                      {item.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center text-sm text-blue-100">
                          <CheckCircle className="h-3 w-3 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-8">
                <Button 
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50"
                  onClick={() => navigate('/voice-technology')}
                >
                  <Mic className="h-5 w-5 mr-2" />
                  Explore Voice Technology
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Features */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-therapy-900 text-center mb-4">Advanced Features</h2>
          <p className="text-xl text-therapy-600 text-center mb-12 max-w-3xl mx-auto">
            Discover additional tools and capabilities that enhance your therapy experience
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advancedFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(feature.href)}>
                  <CardContent className="p-6 text-center">
                    <div className="p-3 bg-gradient-to-r from-therapy-500 to-harmony-500 rounded-full w-fit mx-auto mb-4">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-therapy-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-therapy-600 mb-3">{feature.description}</p>
                    <div className="space-y-1">
                      {feature.features.map((item, itemIndex) => (
                        <div key={itemIndex} className="text-xs text-therapy-500">• {item}</div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Integration & Compliance */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-therapy-900 text-center mb-12">
            Enterprise-Grade Security & Compliance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {integrationFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="text-center">
                  <CardContent className="p-8">
                    <div className="p-4 bg-gradient-to-r from-therapy-500 to-harmony-500 rounded-full w-fit mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-therapy-900 mb-3">{feature.title}</h3>
                    <p className="text-therapy-600 mb-4">{feature.description}</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {feature.compliance.map((cert, certIndex) => (
                        <Badge key={certIndex} variant="outline" className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="bg-white rounded-2xl p-8 mb-16 shadow-lg">
          <h2 className="text-3xl font-bold text-therapy-900 text-center mb-8">
            Explore All Features
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "System Health", href: "/system-health", icon: Monitor },
              { title: "AI Hub", href: "/ai-hub", icon: Brain },
              { title: "Voice Demo", href: "/voice-demo", icon: Volume2 },
              { title: "Crisis Resources", href: "/crisis-resources", icon: Shield },
              { title: "Therapist Profiles", href: "/therapist-profiles", icon: Users },
              { title: "Progress Analytics", href: "/session-analytics", icon: BarChart3 },
              { title: "Digital Notebook", href: "/notebook", icon: BookOpen },
              { title: "Community", href: "/community", icon: HeartHandshake }
            ].map((link, index) => {
              const IconComponent = link.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => navigate(link.href)}
                >
                  <IconComponent className="h-5 w-5" />
                  <span className="text-sm">{link.title}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-therapy-900 mb-6">
            Ready to Transform Your Mental Health Journey?
          </h2>
          <p className="text-xl text-therapy-600 mb-8 max-w-3xl mx-auto">
            Join thousands of users who trust TherapySync for comprehensive, 
            AI-powered mental health support with advanced voice technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700"
              onClick={() => navigate('/register')}
            >
              <Heart className="h-5 w-5 mr-2" />
              Start Your Journey
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/therapysync-ai')}
            >
              <Brain className="h-5 w-5 mr-2" />
              Explore AI Technology
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/system-health')}
            >
              <Monitor className="h-5 w-5 mr-2" />
              View System Status
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesShowcase;
