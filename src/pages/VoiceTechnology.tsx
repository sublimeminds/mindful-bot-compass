
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
import { enhancedVoiceService } from '@/services/voiceService';

const VoiceTechnology = () => {
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
      name: "Dr. Sarah Chen - Aria",
      voiceId: "9BWtsMINqrJLrRacOk9x",
      style: "Professional & Empathetic",
      sample: "Hello, I'm Dr. Sarah Chen. I specialize in anxiety management using cognitive behavioral therapy techniques."
    },
    {
      name: "Dr. Emily Johnson - Charlotte", 
      voiceId: "XB0fDUnXU5powFXDhCwa",
      style: "Calm & Mindful",
      sample: "Welcome, I'm Dr. Emily Johnson. Let's explore mindfulness practices that can bring peace to your daily life."
    },
    {
      name: "Dr. Michael Rodriguez - Callum",
      voiceId: "N2lVS1w4EtoT3dr4eOWO", 
      style: "Gentle & Supportive",
      sample: "I'm Dr. Michael Rodriguez. I create a safe space for trauma recovery using gentle, evidence-based approaches."
    }
  ];

  const playVoiceDemo = async (demo: typeof demoVoices[0]) => {
    if (playingDemo === demo.voiceId) {
      enhancedVoiceService.stop();
      setPlayingDemo(null);
      return;
    }

    setPlayingDemo(demo.voiceId);
    try {
      await enhancedVoiceService.playTherapistMessage(demo.sample, demo.voiceId);
    } catch (error) {
      console.error('Voice demo error:', error);
    } finally {
      setPlayingDemo(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Advanced Voice Technology
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Powered by ElevenLabs
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto mb-8">
            Experience the future of AI therapy with natural, emotionally-aware voice conversations. 
            Our advanced voice technology combines ElevenLabs' cutting-edge synthesis with real-time emotion detection.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
              <Volume2 className="h-4 w-4 mr-2" />
              Studio Quality Audio
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
              <Languages className="h-4 w-4 mr-2" />
              29 Languages
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
              <Eye className="h-4 w-4 mr-2" />
              Emotion Detection
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
              <Heart className="h-4 w-4 mr-2" />
              Therapeutic Grade
            </Badge>
          </div>
        </div>

        {/* Voice Features */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Voice Technology Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {voiceFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                      </div>
                      <Badge className={feature.tier === 'Plus' ? 'bg-purple-500' : 'bg-blue-500'}>
                        {feature.tier === 'Plus' ? <Crown className="h-3 w-3 mr-1" /> : <Zap className="h-3 w-3 mr-1" />}
                        {feature.tier}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 mb-4">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.features.map((item, fIndex) => (
                        <li key={fIndex} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Voice Demos */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">Experience Our Voices</h2>
          <p className="text-xl text-slate-600 text-center mb-12 max-w-3xl mx-auto">
            Listen to our AI therapists and experience the natural, emotionally-aware conversations powered by ElevenLabs technology.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {demoVoices.map((demo, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <h3 className="font-semibold text-lg text-slate-900 mb-2">{demo.name}</h3>
                    <Badge variant="outline" className="mb-3">{demo.style}</Badge>
                    <p className="text-sm text-slate-600 mb-4">"{demo.sample}"</p>
                    <Button
                      onClick={() => playVoiceDemo(demo)}
                      className="w-full"
                      disabled={playingDemo !== null}
                    >
                      {playingDemo === demo.voiceId ? (
                        <>
                          <Pause className="h-4 w-4 mr-2" />
                          Playing...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Play Sample
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Language Support */}
        <Card className="mb-20">
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center">
              <Languages className="h-6 w-6 mr-3" />
              Global Language Support
            </CardTitle>
            <p className="text-center text-slate-600 mt-2">
              Comprehensive voice technology available in 29 languages with cultural sensitivity
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {languageSupport.map((language, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-slate-50 rounded-lg">
                  <Globe className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <span className="text-sm text-slate-700">{language}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Technical Specifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                Technical Specifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Audio Quality</span>
                  <span>48kHz, 16-bit</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Latency</span>
                  <span>&lt; 300ms</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Voice Models</span>
                  <span>8 Specialized Therapists</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Emotion Detection</span>
                  <span>Real-time Analysis</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Language Support</span>
                  <span>29 Languages</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-medium">Cultural Adaptation</span>
                  <span>Regional Sensitivity</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2" />
                Premium Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  "ElevenLabs studio-grade voice synthesis",
                  "Real-time emotion detection and analysis", 
                  "Voice-based stress level monitoring",
                  "Adaptive speech patterns based on user state",
                  "Cultural voice sensitivity and regional accents",
                  "Advanced voice analytics and progress tracking",
                  "Interruption handling and natural dialogue flow",
                  "Voice customization and preference settings"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-12">
          <Volume2 className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">
            Experience the Future of AI Therapy
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of users experiencing natural, emotionally-aware therapy conversations 
            with our advanced voice technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50"
              onClick={() => window.location.href = '/therapists'}
            >
              <Users className="h-5 w-5 mr-2" />
              Meet Our AI Therapists
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              onClick={() => window.location.href = '/register'}
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VoiceTechnology;
