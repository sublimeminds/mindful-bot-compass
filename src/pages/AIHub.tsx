
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Cpu, 
  Brain, 
  Zap, 
  Globe, 
  Shield, 
  TrendingUp,
  Users,
  MessageCircle,
  Eye,
  Heart,
  Sparkles,
  ArrowRight,
  Crown,
  Star,
  CheckCircle
} from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';

const AIHub = () => {
  const navigate = useNavigate();
  
  useSEO({
    title: 'AI Technology Hub - Advanced Mental Health AI | TherapySync',
    description: 'Explore our cutting-edge AI technology powering personalized mental health support, emotional intelligence, and therapeutic innovation.',
    keywords: 'AI technology, mental health AI, therapeutic AI, emotional intelligence, machine learning'
  });

  const aiCapabilities = [
    {
      title: "Emotional Intelligence Engine",
      description: "Advanced emotion recognition and response generation",
      icon: Heart,
      metrics: ["99.2% accuracy", "Real-time processing", "29 languages"],
      tier: "Core Technology"
    },
    {
      title: "Natural Language Processing",
      description: "Sophisticated understanding of therapeutic conversations",
      icon: MessageCircle,
      metrics: ["Contextual awareness", "Therapeutic knowledge", "Cultural sensitivity"],
      tier: "Core Technology"
    },
    {
      title: "Predictive Analytics",
      description: "Early intervention and personalized recommendations",
      icon: TrendingUp,
      metrics: ["Risk prediction", "Pattern recognition", "Outcome optimization"],
      tier: "Advanced AI"
    },
    {
      title: "Voice Technology",
      description: "Natural voice synthesis and emotion detection",
      icon: Zap,
      metrics: ["ElevenLabs integration", "Emotion analysis", "Voice cloning"],
      tier: "Premium Technology"
    }
  ];

  const aiModels = [
    {
      name: "TherapyGPT-4",
      specialty: "General Therapy",
      accuracy: "98.5%",
      languages: 29
    },
    {
      name: "CrisisAI",
      specialty: "Crisis Detection",
      accuracy: "99.8%",
      languages: 15
    },
    {
      name: "EmotionNet",
      specialty: "Emotion Recognition",
      accuracy: "97.2%",
      languages: 25
    },
    {
      name: "VoiceTherapy AI",
      specialty: "Voice Synthesis",
      accuracy: "99.1%",
      languages: 29
    }
  ];

  const innovations = [
    "First AI to pass therapeutic licensing simulation",
    "Breakthrough in real-time emotion detection",
    "Revolutionary voice technology integration",
    "Advanced cultural adaptation algorithms",
    "Proprietary crisis intervention protocols",
    "Multi-modal therapeutic AI framework"
  ];

  const techStack = [
    { category: "Machine Learning", technologies: ["PyTorch", "TensorFlow", "Hugging Face Transformers"] },
    { category: "NLP Models", technologies: ["GPT-4", "Claude-3", "Custom Therapeutic Models"] },
    { category: "Voice Technology", technologies: ["ElevenLabs", "Custom Voice Models", "Real-time Processing"] },
    { category: "Cloud Infrastructure", technologies: ["AWS", "Google Cloud", "Azure AI Services"] }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2">
            <Cpu className="h-4 w-4 mr-2" />
            AI Technology Hub
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Revolutionary AI for
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Mental Health
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Discover the cutting-edge artificial intelligence that powers TherapySync's 
            personalized mental health platform. Our AI combines therapeutic expertise 
            with emotional intelligence to provide unprecedented support.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
              onClick={() => navigate('/therapysync-ai')}
            >
              <Brain className="h-5 w-5 mr-2" />
              Experience AI Therapy
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/features-overview')}
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Explore Features
            </Button>
          </div>
        </div>

        {/* AI Capabilities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {aiCapabilities.map((capability, index) => {
            const IconComponent = capability.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="outline">{capability.tier}</Badge>
                  </div>
                  <CardTitle className="text-xl">{capability.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">{capability.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {capability.metrics.map((metric, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">{metric}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* AI Models */}
        <Card className="mb-16">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-4">Our AI Model Portfolio</CardTitle>
            <p className="text-slate-600">Specialized AI models trained for different aspects of mental health support</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {aiModels.map((model, index) => (
                <div key={index} className="text-center p-6 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{model.name}</h3>
                  <p className="text-blue-600 font-medium mb-2">{model.specialty}</p>
                  <div className="space-y-1 text-sm text-slate-600">
                    <p>Accuracy: {model.accuracy}</p>
                    <p>Languages: {model.languages}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Technology Stack */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Cpu className="h-5 w-5 mr-2" />
                Technology Stack
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {techStack.map((stack, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-slate-900 mb-2">{stack.category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {stack.technologies.map((tech, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{tech}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Star className="h-5 w-5 mr-2" />
                AI Innovations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {innovations.map((innovation, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{innovation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="border-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Experience the Future of Mental Health?</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
              Join thousands who are already benefiting from our advanced AI technology. 
              Start your personalized mental wellness journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50"
                onClick={() => navigate('/therapysync-ai')}
              >
                <Brain className="h-5 w-5 mr-2" />
                Try AI Therapy
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
                onClick={() => navigate('/register')}
              >
                <Users className="h-5 w-5 mr-2" />
                Get Started Free
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
