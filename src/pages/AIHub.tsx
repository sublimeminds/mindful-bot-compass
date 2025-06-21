
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Cpu, 
  Zap, 
  Eye, 
  Volume2, 
  TrendingUp,
  Shield,
  Globe,
  Users,
  MessageCircle,
  ArrowRight,
  Sparkles,
  Heart,
  Target,
  BarChart3,
  Mic
} from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';

const AIHub = () => {
  const navigate = useNavigate();
  
  useSEO({
    title: 'AI Technology Hub - Advanced Mental Health AI | TherapySync',
    description: 'Explore our cutting-edge AI technology for mental health, including voice synthesis, emotion detection, and therapeutic intelligence.',
    keywords: 'AI technology, mental health AI, voice synthesis, emotion detection, therapeutic AI'
  });

  const aiTechnologies = [
    {
      title: "Therapeutic Intelligence Engine",
      description: "Advanced AI trained on millions of therapy sessions and clinical data",
      icon: Brain,
      capabilities: ["Natural language understanding", "Contextual awareness", "Therapeutic response generation"],
      accuracy: "98.3%",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Voice Emotion Analysis",
      description: "Real-time emotion detection from voice patterns and speech",
      icon: Volume2,
      capabilities: ["Emotion recognition", "Stress detection", "Mood tracking"],
      accuracy: "94.7%",
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Crisis Detection System",
      description: "AI-powered early warning system for mental health crises",
      icon: Shield,
      capabilities: ["Risk assessment", "Pattern recognition", "Immediate alerts"],
      accuracy: "99.1%",
      color: "from-red-500 to-red-600"
    },
    {
      title: "Personalization Engine",
      description: "Adaptive AI that learns and personalizes therapy approaches",
      icon: Target,
      capabilities: ["Preference learning", "Adaptive responses", "Progress optimization"],
      accuracy: "96.8%",
      color: "from-green-500 to-green-600"
    }
  ];

  const technicalSpecs = [
    {
      category: "Processing Power",
      specs: [
        "Neural networks with 175B+ parameters",
        "Real-time processing < 100ms",
        "Distributed computing infrastructure",
        "Advanced GPU acceleration"
      ]
    },
    {
      category: "Data & Training",
      specs: [
        "10M+ therapy session transcripts",
        "Evidence-based therapeutic models",
        "Continuous learning algorithms",
        "Privacy-preserving training"
      ]
    },
    {
      category: "Security & Privacy",
      specs: [
        "End-to-end encryption",
        "HIPAA compliant infrastructure", 
        "Zero-knowledge architecture",
        "SOC 2 Type II certified"
      ]
    },
    {
      category: "Integration",
      specs: [
        "RESTful API access",
        "Webhook notifications",
        "Multi-platform SDKs",
        "Real-time streaming"
      ]
    }
  ];

  const innovations = [
    {
      title: "Multimodal Therapy AI",
      description: "First AI to combine voice, text, and behavioral data for comprehensive therapy",
      impact: "40% improvement in therapy outcomes",
      icon: Cpu
    },
    {
      title: "Cultural AI Adaptation",
      description: "AI that adapts to cultural contexts and communication styles",
      impact: "29 languages supported",
      icon: Globe
    },
    {
      title: "Predictive Wellness Analytics",
      description: "AI predicts mental health patterns and recommends preventive care",
      impact: "60% reduction in crisis incidents",
      icon: TrendingUp
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2">
            <Brain className="h-4 w-4 mr-2" />
            Advanced AI Technology
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            AI Technology Hub
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              for Mental Health
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Explore the cutting-edge AI technologies powering TherapySync's mental health platform. 
            From voice emotion analysis to crisis detection, discover how AI is revolutionizing therapy.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
              onClick={() => navigate('/therapysync-ai')}
            >
              <Zap className="h-5 w-5 mr-2" />
              Experience Our AI
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/voice-technology')}
            >
              <Volume2 className="h-5 w-5 mr-2" />
              Voice Technology
            </Button>
          </div>
        </div>

        {/* AI Technologies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {aiTechnologies.map((tech, index) => {
            const IconComponent = tech.icon;
            return (
              <Card key={index} className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 bg-gradient-to-r ${tech.color} rounded-full`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      {tech.accuracy} Accuracy
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{tech.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">{tech.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-slate-700">Key Capabilities:</h4>
                    <ul className="space-y-1">
                      {tech.capabilities.map((capability, i) => (
                        <li key={i} className="flex items-center text-sm">
                          <Sparkles className="h-3 w-3 text-blue-500 mr-2" />
                          {capability}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Technical Specifications */}
        <Card className="mb-16">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-4">Technical Specifications</CardTitle>
            <p className="text-slate-600">Enterprise-grade AI infrastructure built for scale and reliability</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {technicalSpecs.map((category, index) => (
                <div key={index} className="space-y-4">
                  <h3 className="font-semibold text-lg text-slate-900 border-b border-slate-200 pb-2">
                    {category.category}
                  </h3>
                  <ul className="space-y-2">
                    {category.specs.map((spec, i) => (
                      <li key={i} className="flex items-start text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        {spec}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Innovations */}
        <Card className="mb-16">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-4">AI Innovations & Breakthroughs</CardTitle>
            <p className="text-slate-600">Pioneering the future of AI-powered mental health care</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {innovations.map((innovation, index) => {
                const IconComponent = innovation.icon;
                return (
                  <div key={index} className="text-center p-6 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{innovation.title}</h3>
                    <p className="text-sm text-slate-600 mb-3">{innovation.description}</p>
                    <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                      {innovation.impact}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <BarChart3 className="h-5 w-5 mr-2" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="font-medium">Response Time</span>
                  <Badge variant="outline" className="text-green-600">< 100ms</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="font-medium">Uptime</span>
                  <Badge variant="outline" className="text-green-600">99.9%</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="font-medium">Concurrent Users</span>
                  <Badge variant="outline" className="text-blue-600">100K+</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="font-medium">Languages Supported</span>
                  <Badge variant="outline" className="text-purple-600">29</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Eye className="h-5 w-5 mr-2" />
                AI Capabilities Demo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => navigate('/voice-technology')}
                >
                  <Volume2 className="h-4 w-4 mr-2" />
                  Voice Emotion Analysis Demo
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => navigate('/therapysync-ai')}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Therapeutic AI Chat Demo
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => navigate('/crisis-management')}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Crisis Detection Demo
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => navigate('/therapist-matching')}
                >
                  <Users className="h-4 w-4 mr-2" />
                  AI Matching Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="border-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Experience the Future of AI Therapy</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
              Our AI technologies are transforming mental health care. Join thousands who are experiencing 
              the power of AI-driven therapy and wellness support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50"
                onClick={() => navigate('/therapysync-ai')}
              >
                <Brain className="h-5 w-5 mr-2" />
                Try TherapySync AI
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
                onClick={() => navigate('/register')}
              >
                <Heart className="h-5 w-5 mr-2" />
                Start Your Journey
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default AIHub;
