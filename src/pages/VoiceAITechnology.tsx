import React from 'react';
import { Mic, Headphones, Globe, Heart, Shield, Zap, ArrowRight, CheckCircle, Brain, Waves, Bot, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const VoiceAITechnology = () => {
  const features = [
    {
      icon: Globe,
      title: "29 Languages",
      description: "Communicate in your native language with natural voice recognition and response",
      gradient: "from-calm-50 to-flow-50",
      iconColor: "text-calm-600"
    },
    {
      icon: Heart,
      title: "Emotion Detection",
      description: "Advanced AI analyzes vocal patterns to understand emotional states and responses",
      gradient: "from-flow-50 to-harmony-50",
      iconColor: "text-flow-700"
    },
    {
      icon: Headphones,
      title: "Natural Conversations",
      description: "Engage in fluid, natural-sounding conversations that feel authentic and supportive",
      gradient: "from-harmony-50 to-balance-50",
      iconColor: "text-harmony-600"
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your voice data is encrypted and processed with the highest security standards",
      gradient: "from-balance-50 to-therapy-50",
      iconColor: "text-balance-600"
    },
    {
      icon: Zap,
      title: "Real-Time Processing",
      description: "Instant voice processing and response for seamless therapeutic interactions",
      gradient: "from-therapy-50 to-calm-50",
      iconColor: "text-therapy-600"
    },
    {
      icon: Waves,
      title: "Voice Biometrics",
      description: "Analyze vocal patterns to gain insights into stress levels and emotional well-being",
      gradient: "from-calm-50 to-harmony-50",
      iconColor: "text-calm-700"
    }
  ];

  const capabilities = [
    "29+ language support",
    "Real-time emotion analysis",
    "Voice biometric insights",
    "Encrypted voice processing",
    "Natural conversation flow",
    "Therapeutic voice modulation"
  ];

  const voiceTechnologies = [
    {
      title: "ElevenLabs Integration",
      description: "Ultra-realistic voice synthesis with emotional intelligence",
      icon: Volume2,
      color: "text-purple-600"
    },
    {
      title: "AI Conversation Engine",
      description: "Advanced natural language processing for therapeutic dialogue",
      icon: Bot,
      color: "text-blue-600"
    },
    {
      title: "Real-Time Analytics",
      description: "Voice pattern analysis for emotional state monitoring",
      icon: Brain,
      color: "text-green-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-calm/5 via-transparent to-harmony/5"></div>
        
        {/* Floating Voice Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 animate-float-up">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-calm-200/20 to-flow-200/20 backdrop-blur-sm border border-calm-200/30"></div>
          </div>
          <div className="absolute top-40 right-20 animate-float-diagonal">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-harmony-200/20 to-balance-200/20 backdrop-blur-sm border border-harmony-200/30"></div>
          </div>
          <div className="absolute bottom-40 left-20 animate-float-circle">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-therapy-200/20 to-calm-200/20 backdrop-blur-sm border border-therapy-200/30"></div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-32">
          <div className="text-center space-y-8">
            <div className="animate-fade-in">
              <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium">
                <Mic className="h-4 w-4 mr-2" />
                Voice AI Technology
              </Badge>
            </div>
            
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-foreground via-calm-600 to-foreground bg-clip-text text-transparent leading-tight">
                Your Voice
                <span className="block bg-gradient-to-r from-calm-600 to-harmony-600 bg-clip-text text-transparent">
                  Your Therapy
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Natural voice conversations in 29 languages with emotion detection and analysis. 
                Experience the future of therapeutic communication with our advanced voice AI.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-fade-in">
              <Button size="lg" className="group px-8 py-3 bg-gradient-to-r from-calm-600 to-calm-500 hover:from-calm-700 hover:to-calm-600">
                Try Voice AI Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-3">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Voice Technology Stack */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powered by Advanced Voice Technologies
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our voice AI platform integrates the latest in speech synthesis, natural language processing, and emotional intelligence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {voiceTechnologies.map((tech, index) => (
              <Card 
                key={tech.title}
                className="p-8 bg-gradient-to-br from-card to-muted/30 border border-primary/10 hover:shadow-therapy-glow transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardContent className="p-0 text-center space-y-6">
                  <div className={`inline-flex p-4 rounded-xl bg-background shadow-therapy-subtle ${tech.color}`}>
                    <tech.icon className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">{tech.title}</h3>
                    <p className="text-muted-foreground">{tech.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Revolutionary Voice Capabilities
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the next generation of voice AI technology designed specifically for therapeutic applications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={feature.title}
                className={`group hover-scale border border-primary/10 bg-gradient-to-br ${feature.gradient} backdrop-blur-sm transition-all duration-300 hover:shadow-therapy-glow animate-fade-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl bg-card shadow-therapy-subtle ${feature.iconColor}`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-calm-600 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-fade-in">
              <div>
                <Badge variant="outline" className="mb-4">
                  <Brain className="h-4 w-4 mr-2" />
                  AI-Powered Voice Analysis
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Why Voice AI Matters in Therapy
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Voice carries emotional nuances that text cannot convey. Our AI analyzes vocal patterns, 
                  tone, and speech patterns to provide deeper insights into your emotional state and therapeutic progress.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {capabilities.map((capability, index) => (
                  <div 
                    key={capability}
                    className="flex items-center space-x-3 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CheckCircle className="h-5 w-5 text-calm-600 flex-shrink-0" />
                    <span className="text-sm font-medium">{capability}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative animate-fade-in">
              <Card className="p-8 bg-gradient-to-br from-calm-50 to-harmony-50 border-calm-200">
                <CardContent className="p-0">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <Zap className="h-8 w-8 text-calm-600" />
                      <h3 className="text-xl font-semibold">Live Voice Coaching</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Real-time voice guidance and emotional support with AI that adapts to your speaking patterns and emotional needs.
                    </p>
                    <Button variant="outline" className="w-full">
                      Experience Voice AI
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Card className="p-12 bg-gradient-to-r from-calm-50 via-harmony-50 to-calm-50 border-calm-200 animate-fade-in">
            <CardContent className="p-0 space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Experience Voice AI Technology
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Connect with our advanced voice AI in your preferred language. 
                  Experience natural, emotionally-aware conversations that understand you.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="group px-8 py-3 bg-gradient-to-r from-calm-600 to-calm-500 hover:from-calm-700 hover:to-calm-600">
                  Try Voice AI Now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button variant="outline" size="lg" className="px-8 py-3">
                  Technical Documentation
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                Powered by ElevenLabs and cutting-edge AI for the most natural voice experience.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default VoiceAITechnology;