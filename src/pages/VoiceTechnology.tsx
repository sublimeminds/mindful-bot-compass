
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Volume2, 
  Mic, 
  Brain, 
  Languages, 
  Zap, 
  Crown, 
  Play, 
  Pause,
  CheckCircle,
  Star,
  Globe,
  TrendingUp,
  Eye,
  Heart,
  ArrowRight,
  Users
} from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';

const VoiceTechnology = () => {
  const navigate = useNavigate();
  
  useSEO({
    title: 'Voice Technology - Advanced AI Voice Synthesis | TherapySync',
    description: 'Experience our cutting-edge voice technology with ElevenLabs integration, emotion detection, and 29-language support.',
    keywords: 'voice technology, AI voice synthesis, emotion detection, therapy voices, ElevenLabs'
  });

  const [playingDemo, setPlayingDemo] = useState<string | null>(null);

  const voiceFeatures = [
    {
      title: "ElevenLabs Integration",
      description: "Premium voice synthesis with studio-quality audio",
      icon: Crown,
      features: ["Natural intonation", "Emotional expression", "Cultural sensitivity"],
      tier: "Premium"
    },
    {
      title: "Real-time Emotion Detection",
      description: "Advanced voice pattern analysis for therapeutic insights",
      icon: Eye,
      features: ["Stress detection", "Mood tracking", "Emotional state monitoring"],
      tier: "Plus"
    },
    {
      title: "Multi-language Support",
      description: "Comprehensive language coverage with cultural awareness",
      icon: Languages,
      features: ["29 languages", "Cultural adaptation", "Regional accents"],
      tier: "Premium"
    },
    {
      title: "Voice Analytics",
      description: "Deep insights from voice patterns and speech analysis",
      icon: TrendingUp,
      features: ["Progress tracking", "Pattern recognition", "Therapeutic insights"],
      tier: "Plus"
    }
  ];

  const languageSupport = [
    "English (US, UK, AU)", "Spanish (ES, MX)", "French (FR, CA)", "German", "Italian", 
    "Portuguese (BR, PT)", "Dutch", "Polish", "Turkish", "Russian", "Ukrainian",
    "Czech", "Slovak", "Slovenian", "Croatian", "Serbian", "Bulgarian", "Romanian",
    "Hungarian", "Finnish", "Swedish", "Norwegian", "Danish", "Greek", "Arabic",
    "Hebrew", "Hindi", "Japanese", "Korean", "Mandarin Chinese"
  ];

  const demoVoices = [
    {
      name: "Dr. Sarah Chen - Compassionate",
      style: "Warm & Professional",
      description: "Perfect for anxiety and depression support",
      languages: ["English", "Mandarin"]
    },
    {
      name: "Dr. Michael Rodriguez - Empathetic",
      style: "Gentle & Reassuring", 
      description: "Specialized in trauma-informed therapy",
      languages: ["English", "Spanish"]
    },
    {
      name: "Dr. Emily Johnson - Mindful",
      style: "Calm & Centered",
      description: "Mindfulness and emotional regulation focus",
      languages: ["English", "French"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2">
            <Volume2 className="h-4 w-4 mr-2" />
            Advanced Voice Technology
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Revolutionary Voice AI
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              for Mental Health
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Experience natural, emotionally-aware conversations with our cutting-edge voice synthesis technology. 
            Real-time emotion detection and 29-language support provide truly personalized therapy.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
              onClick={() => navigate('/therapysync-ai')}
            >
              <Volume2 className="h-5 w-5 mr-2" />
              Try Voice Therapy
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/plans')}
            >
              <Crown className="h-5 w-5 mr-2" />
              View Plans
            </Button>
          </div>
        </div>

        {/* Voice Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {voiceFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="outline">{feature.tier}</Badge>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
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

        {/* Language Support */}
        <Card className="mb-16">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center text-2xl mb-4">
              <Globe className="h-6 w-6 mr-2" />
              Global Language Support
            </CardTitle>
            <p className="text-slate-600">Supporting 29 languages with cultural sensitivity and regional adaptations</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {languageSupport.map((language, index) => (
                <div key={index} className="flex items-center p-3 bg-slate-50 rounded-lg">
                  <Globe className="h-4 w-4 text-blue-500 mr-2" />
                  <span className="text-sm font-medium">{language}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Voice Demos */}
        <Card className="mb-16">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-4">Meet Our AI Therapist Voices</CardTitle>
            <p className="text-slate-600">Each voice is carefully designed for specific therapeutic approaches</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {demoVoices.map((voice, index) => (
                <div key={index} className="text-center p-6 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Volume2 className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{voice.name}</h3>
                  <p className="text-blue-600 font-medium mb-2">{voice.style}</p>
                  <p className="text-sm text-slate-600 mb-4">{voice.description}</p>
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {voice.languages.map((lang, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">{lang}</Badge>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPlayingDemo(playingDemo === voice.name ? null : voice.name)}
                  >
                    {playingDemo === voice.name ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Listen
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="border-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Experience Voice Therapy?</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
              Join thousands who have discovered the power of AI voice therapy. Start your journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50"
                onClick={() => navigate('/therapysync-ai')}
              >
                <Mic className="h-5 w-5 mr-2" />
                Start Voice Session
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

export default VoiceTechnology;
