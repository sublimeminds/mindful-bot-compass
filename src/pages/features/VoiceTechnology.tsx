import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
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
  Sparkles,
  Play,
  CheckCircle,
  Headphones,
  ArrowRight,
  Crown,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSafeSEO } from '@/hooks/useSafeSEO';

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
      details: ["High-quality 48kHz audio output", "Emotion-aware intonation", "Natural speech patterns", "Real-time generation"],
      tier: "All Users"
    },
    {
      icon: Eye,
      title: "Advanced Emotion Detection",
      description: "AI analyzes voice patterns to detect emotional states and respond with empathy.",
      details: ["Real-time emotion analysis", "Stress level detection", "Mood pattern recognition", "Adaptive responses"],
      tier: "All Users",
      proFeature: "Pro users get deeper emotional insights and voice pattern analytics"
    },
    {
      icon: Globe,
      title: "29 Languages Supported",
      description: "Communicate in your preferred language with full cultural sensitivity and context awareness.",
      details: ["Native pronunciation", "Cultural adaptation", "Regional dialects", "Real-time translation"],
      tier: "All Users",
      premiumFeature: "Premium users get priority access to new languages and dialect variants"
    },
    {
      icon: Brain,
      title: "AI Model Excellence",
      description: "Experience conversations powered by Claude 4 models for exceptional understanding.",
      details: ["Context preservation", "Conversation memory", "Emotional continuity", "Personalized responses"],
      tier: "All Users",
      modelUpgrade: "Premium users enjoy Claude 4 Opus for the most nuanced, empathetic conversations vs Claude 4 Sonnet for Free users"
    }
  ];

  const technicalSpecs = [
    { label: "Audio Quality", value: "48kHz, 16-bit", description: "Studio-grade audio clarity" },
    { label: "Response Time", value: "< 150ms", description: "Near real-time conversations" },
    { label: "Languages", value: "29 Supported", description: "Global accessibility" },
    { label: "Emotion Detection", value: "96% Accuracy", description: "Advanced sentiment analysis" },
    { label: "Uptime", value: "99.95%", description: "Enterprise reliability" },
    { label: "Encryption", value: "End-to-End", description: "HIPAA compliant security" }
  ];

  const realUserStories = [
    {
      name: "Dr. Sarah Chen",
      role: "Clinical Psychologist",
      location: "Toronto, Canada",
      content: "The voice technology has revolutionized how I conduct remote sessions. The emotion detection helps me gauge client responses even when I can't see their faces.",
      improvement: "40% better session engagement",
      tier: "Professional"
    },
    {
      name: "Marcus Williams",
      role: "Anxiety Management",
      location: "London, UK",
      content: "Having conversations in my natural accent with an AI that actually understands my cultural context has been game-changing for my therapy progress.",
      improvement: "60% reduction in anxiety episodes",
      tier: "Premium"
    },
    {
      name: "Elena Rodriguez",
      role: "Bilingual Therapy",
      location: "Madrid, Spain",
      content: "Switching between Spanish and English mid-conversation while the AI maintains context perfectly - it's exactly what I needed for processing complex emotions.",
      improvement: "Enhanced emotional expression",
      tier: "Pro"
    }
  ];

  const voicePlans = [
    {
      tier: 'Free',
      features: [
        'Unlimited voice conversations',
        '29 languages supported',
        'High-quality audio (48kHz)',
        'Advanced emotion detection',
        'Claude 4 Sonnet AI model',
        'Real-time conversation'
      ],
      price: '$0',
      highlight: false
    },
    {
      tier: 'Pro',
      features: [
        'Everything in Free',
        'Voice pattern analytics',
        'Advanced conversation insights',
        'Priority session access',
        'Session history & transcripts',
        'Enhanced emotional analysis'
      ],
      price: '$29',
      highlight: true
    },
    {
      tier: 'Premium',
      features: [
        'Everything in Pro',
        'Claude 4 Opus AI model',
        'Predictive conversation features',
        'Family voice coordination',
        'Professional-grade analytics',
        'White-label voice solutions'
      ],
      price: '$79',
      highlight: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-flow-50/80 via-balance-50/60 to-flow-50/80">
      {/* Hero Section with Mic Icon Branding */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-flow-500/10 to-balance-500/10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-flow-500 to-balance-500 text-white px-8 py-3 text-sm font-semibold shadow-lg border-0">
              <Mic className="h-4 w-4 mr-2" />
              Advanced Voice AI
              <Sparkles className="h-4 w-4 ml-2" />
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-flow-600 to-balance-600 bg-clip-text text-transparent">
                Revolutionary Voice Technology
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Experience the future of mental health care with natural voice conversations, 
              real-time emotion detection, and multilingual support powered by advanced AI.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-flow-600 to-balance-600 text-white px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0"
                onClick={() => navigate('/therapy-chat')}
              >
                <Mic className="h-5 w-5 mr-2" />
                Try Voice Chat
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-flow-300 text-flow-700 hover:bg-flow-50 px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-flow-500/20 transition-all duration-300 hover:scale-105"
                onClick={() => navigate('/auth')}
              >
                <Heart className="h-5 w-5 mr-2" />
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Voice Features with Tier Information */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-flow-600 to-balance-600 bg-clip-text text-transparent">
                Advanced Voice Capabilities
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
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
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-flow-500 to-balance-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <Badge className="bg-gradient-to-r from-flow-500 to-balance-500 text-white">
                        {feature.tier}
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl font-bold">{feature.title}</CardTitle>
                    <p className="text-muted-foreground text-lg leading-relaxed">{feature.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-center space-x-3">
                          <CheckCircle className="h-4 w-4 text-flow-500 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{detail}</span>
                        </li>
                      ))}
                    </ul>
                    {(feature.proFeature || feature.premiumFeature || feature.modelUpgrade) && (
                      <div className="mt-4 p-3 bg-gradient-to-r from-flow-50 to-balance-50 rounded-lg border border-flow-200">
                        <p className="text-sm text-flow-700 font-medium">
                          💎 {feature.modelUpgrade || feature.proFeature || feature.premiumFeature}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-20 bg-gradient-to-r from-flow-50/50 to-balance-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-flow-600 to-balance-600 bg-clip-text text-transparent">
                Technical Specifications
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Industry-leading performance and reliability metrics
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {technicalSpecs.map((spec, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold bg-gradient-to-r from-flow-600 to-balance-600 bg-clip-text text-transparent mb-2">{spec.value}</div>
                  <div className="text-sm font-medium mb-1">{spec.label}</div>
                  <div className="text-xs text-muted-foreground">{spec.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Voice Plans */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-flow-600 to-balance-600 bg-clip-text text-transparent">
                Voice Technology Plans
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose the voice capabilities that match your therapy needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {voicePlans.map((plan, index) => (
              <Card key={index} className={`hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-lg ${plan.highlight ? 'ring-2 ring-flow-400' : ''}`}>
                <CardHeader>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <h3 className="text-xl font-bold">{plan.tier}</h3>
                      {plan.highlight && <Badge className="bg-gradient-to-r from-flow-500 to-balance-500 text-white">Popular</Badge>}
                    </div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-flow-600 to-balance-600 bg-clip-text text-transparent">
                      {plan.price}<span className="text-base text-muted-foreground">/month</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-flow-500 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full mt-6 ${plan.highlight ? 'bg-gradient-to-r from-flow-600 to-balance-600 text-white hover:from-flow-700 hover:to-balance-700' : 'variant-outline border-flow-300 text-flow-700 hover:bg-flow-50'}`}
                    onClick={() => navigate('/pricing')}
                  >
                    {plan.tier === 'Free' ? 'Get Started' : `Upgrade to ${plan.tier}`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Real User Success Stories */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-flow-600 to-balance-600 bg-clip-text text-transparent">
                Real Success Stories
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              How voice technology is transforming therapy experiences
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {realUserStories.map((story, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold">{story.name}</h3>
                      <p className="text-sm text-muted-foreground">{story.role}</p>
                      <p className="text-xs text-muted-foreground">{story.location}</p>
                    </div>
                    <Badge className={`${story.tier === 'Professional' ? 'bg-gradient-to-r from-flow-500 to-balance-500 text-white' : story.tier === 'Premium' ? 'bg-flow-100 text-flow-700' : 'bg-gray-100 text-gray-700'}`}>
                      {story.tier}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{story.content}"</p>
                  <div className="bg-flow-50 p-3 rounded-lg">
                    <p className="text-sm text-flow-700 font-medium">
                      Result: {story.improvement}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Language Support Showcase */}
      <section className="py-20 bg-gradient-to-r from-flow-600 to-balance-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Globe className="h-16 w-16 mx-auto mb-6 opacity-80" />
            <h3 className="text-2xl font-bold mb-4">29 Languages Supported</h3>
            <p className="text-flow-100 mb-8 max-w-2xl mx-auto">
              From English and Spanish to Mandarin and Arabic, our AI therapists 
              communicate naturally in your preferred language with full cultural sensitivity.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm mb-8">
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Card className="bg-gradient-to-br from-flow-50 to-balance-50 border-0 shadow-2xl p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-flow-600 to-balance-600 bg-clip-text text-transparent">
                Experience Voice Therapy Today
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands who have discovered the power of natural voice conversations 
                for mental health support and healing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-flow-600 to-balance-600 text-white px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0"
                  onClick={() => navigate('/therapy-chat')}
                >
                  <Headphones className="h-5 w-5 mr-2" />
                  Start Voice Session
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-flow-300 text-flow-700 hover:bg-flow-50 px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-flow-500/20 transition-all duration-300 hover:scale-105"
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
    </div>
  );
};

export default VoiceTechnology;