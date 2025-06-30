
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Headphones, 
  Mic, 
  Volume2, 
  Globe, 
  Brain, 
  Heart, 
  Eye,
  Zap,
  MessageSquare,
  Users,
  Shield,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSafeSEO } from '@/hooks/useSafeSEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const VoiceTechnology = () => {
  const navigate = useNavigate();
  
  useSafeSEO({
    title: 'Advanced Voice Technology - TherapySync AI',
    description: 'Experience natural voice conversations with emotion detection, 29-language support, and real-time AI therapy interactions.',
    keywords: 'AI voice therapy, emotion detection, multilingual therapy, voice technology, natural conversations'
  });

  const voiceFeatures = [
    {
      icon: Volume2,
      title: "Natural Voice Synthesis",
      description: "State-of-the-art voice generation that sounds human-like and emotionally responsive.",
      details: ["High-quality audio output", "Emotion-aware intonation", "Natural speech patterns", "Real-time generation"]
    },
    {
      icon: Eye,
      title: "Emotion Detection",
      description: "Advanced AI analyzes your voice patterns to detect emotional states and respond appropriately.",
      details: ["Real-time emotion analysis", "Stress level detection", "Mood pattern recognition", "Adaptive responses"]
    },
    {
      icon: Globe,
      title: "29 Languages Supported",
      description: "Communicate in your preferred language with full cultural sensitivity and context awareness.",
      details: ["Native pronunciation", "Cultural adaptation", "Regional dialects", "Real-time translation"]
    },
    {
      icon: Brain,
      title: "Contextual Understanding",
      description: "AI processes not just words but tone, pace, and emotional context for deeper conversations.",
      details: ["Context preservation", "Conversation memory", "Emotional continuity", "Personalized responses"]
    }
  ];

  const technicalSpecs = [
    { label: "Audio Quality", value: "48kHz, 16-bit" },
    { label: "Response Time", value: "< 200ms" },
    { label: "Languages", value: "29 Supported" },
    { label: "Emotion Detection", value: "98% Accuracy" },
    { label: "Uptime", value: "99.9%" },
    { label: "Encryption", value: "End-to-End" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-calm-50 via-white to-therapy-50">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 therapy-gradient-bg opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <Badge className="mb-6 therapy-gradient-bg text-white px-8 py-3 text-sm font-semibold shadow-lg border-0">
              <Headphones className="h-4 w-4 mr-2" />
              Advanced Voice AI
              <Sparkles className="h-4 w-4 ml-2" />
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="therapy-text-gradient-animated">
                Revolutionary Voice Technology
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Experience the future of mental health care with natural voice conversations, 
              real-time emotion detection, and multilingual support powered by advanced AI.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="therapy-gradient-bg text-white px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0"
                onClick={() => navigate('/therapy-chat')}
              >
                <Mic className="h-5 w-5 mr-2" />
                Try Voice Chat
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-therapy-300 text-therapy-700 hover:bg-therapy-50 px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-therapy-500/20 transition-all duration-300 hover:scale-105"
                onClick={() => navigate('/auth')}
              >
                <Heart className="h-5 w-5 mr-2" />
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Voice Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="therapy-text-gradient">
                Advanced Voice Capabilities
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our voice technology combines cutting-edge AI with emotional intelligence 
              to create truly natural therapeutic conversations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {voiceFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <div className="w-16 h-16 therapy-gradient-bg rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-800">{feature.title}</CardTitle>
                    <p className="text-slate-600 text-lg leading-relaxed">{feature.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-center space-x-3">
                          <div className="w-2 h-2 therapy-gradient-bg rounded-full"></div>
                          <span className="text-sm text-slate-600">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-20 bg-gradient-to-r from-therapy-50/50 to-calm-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="therapy-text-gradient">
                Technical Specifications
              </span>
            </h2>
            <p className="text-xl text-slate-600">
              Industry-leading performance and reliability metrics
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {technicalSpecs.map((spec, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold therapy-text-gradient mb-2">{spec.value}</div>
                  <div className="text-sm text-slate-600 font-medium">{spec.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Language Support */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="therapy-text-gradient">
                Global Language Support
              </span>
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              Accessible mental health care in your native language
            </p>
          </div>
          
          <Card className="therapy-gradient-bg text-white p-12 shadow-2xl">
            <div className="text-center">
              <Globe className="h-16 w-16 mx-auto mb-6 opacity-80" />
              <h3 className="text-2xl font-bold mb-4">29 Languages Supported</h3>
              <p className="text-therapy-100 mb-8 max-w-2xl mx-auto">
                From English and Spanish to Mandarin and Arabic, our AI therapists 
                communicate naturally in your preferred language with full cultural sensitivity.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
                {["English", "Spanish", "French", "German", "Italian", "Portuguese", "Chinese", "Japanese", "Korean", "Arabic", "Hindi", "Russian"].map((lang) => (
                  <div key={lang} className="bg-white/10 backdrop-blur-sm rounded-lg p-2 font-medium">
                    {lang}
                  </div>
                ))}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 font-medium">
                  +17 More
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Card className="bg-gradient-to-br from-therapy-50 to-calm-50 border-0 shadow-2xl p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 therapy-text-gradient">
                Experience Voice Therapy Today
              </h2>
              <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                Join thousands who have discovered the power of natural voice conversations 
                for mental health support and healing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="therapy-gradient-bg text-white px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0"
                  onClick={() => navigate('/therapy-chat')}
                >
                  <Headphones className="h-5 w-5 mr-2" />
                  Start Voice Session
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-therapy-300 text-therapy-700 hover:bg-therapy-50 px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-therapy-500/20 transition-all duration-300 hover:scale-105"
                  onClick={() => navigate('/pricing')}
                >
                  <Zap className="h-5 w-5 mr-2" />
                  View Pricing
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

export default VoiceTechnology;
