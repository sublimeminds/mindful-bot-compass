import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Zap, Heart, Brain, Users, Shield, Clock, Globe, BarChart3, MessageSquare, Activity } from 'lucide-react';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';
import FeaturesIcon from '@/components/icons/custom/FeaturesIcon';
import AppleStyleButton from '@/components/ui/AppleStyleButton';
import OptimizedSectionContainer from '@/components/sections/OptimizedSectionContainer';

const EnhancedFeaturesSection = () => {
  const coreFeatures = [
    {
      icon: Brain,
      title: "AI-Powered Insights",
      story: "Emma discovered patterns in her anxiety triggers through AI analysis, leading to breakthrough moments she never saw coming.",
      benefits: ["Pattern Recognition", "Predictive Analytics", "Personalized Recommendations"],
      gradient: "from-therapy-500 to-harmony-500",
      highlight: "94% accuracy in mood prediction"
    },
    {
      icon: Heart,
      title: "Emotional Intelligence",
      story: "Our AI recognizes subtle emotional cues, adapting its responses in real-time to provide exactly the support you need.",
      benefits: ["Emotion Detection", "Adaptive Responses", "Crisis Prevention"],
      gradient: "from-calm-500 to-therapy-500",
      highlight: "Real-time emotional analysis"
    },
    {
      icon: Users,
      title: "Cultural Awareness",
      story: "Maria found therapy that truly understood her cultural background, making healing feel authentic and respectful.",
      benefits: ["Cultural Sensitivity", "Multilingual Support", "Diverse Perspectives"],
      gradient: "from-harmony-500 to-balance-500",
      highlight: "150+ cultural frameworks"
    }
  ];

  const platformCapabilities = [
    {
      icon: Shield,
      title: "Privacy First",
      metric: "256-bit",
      description: "Military-grade encryption"
    },
    {
      icon: Clock,
      title: "24/7 Available",
      metric: "Always",
      description: "Round-the-clock support"
    },
    {
      icon: Globe,
      title: "Global Reach",
      metric: "85+",
      description: "Countries supported"
    },
    {
      icon: Zap,
      title: "Instant Response",
      metric: "<2s",
      description: "Lightning-fast AI"
    }
  ];

  // Enhanced animated features for the last section
  const advancedFeatures = [
    {
      icon: BarChart3,
      title: "AI Powered Insights",
      description: "Deep analytics revealing hidden patterns in your mental health journey",
      animation: "chart",
      color: "from-therapy-500 to-calm-500"
    },
    {
      icon: MessageSquare,
      title: "Intelligent Conversations",
      description: "Context-aware dialogue that remembers and builds on every interaction",
      animation: "chat",
      color: "from-calm-500 to-harmony-500"
    },
    {
      icon: Activity,
      title: "Wellness Monitoring",
      description: "Continuous health tracking with proactive intervention capabilities",
      animation: "pulse",
      color: "from-harmony-500 to-balance-500"
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with a global network of peers on similar journeys",
      animation: "network",
      color: "from-balance-500 to-flow-500"
    }
  ];

  return (
    <SafeComponentWrapper name="EnhancedFeaturesSection">
      <OptimizedSectionContainer className="bg-gradient-to-br from-white via-therapy-25 to-harmony-25">
        
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-6 bg-therapy-100 text-therapy-800 border-therapy-200 px-6 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            Next-Generation Platform
          </Badge>
          
          <h2 className="text-5xl md:text-7xl font-bold text-foreground mb-8 leading-tight">
            Technology That
            <span className="block bg-gradient-to-r from-therapy-600 via-harmony-600 to-calm-600 bg-clip-text text-transparent">
              Truly Cares
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Beyond simple chatbots. Our AI understands context, emotion, and culture to deliver 
            therapy experiences that feel genuinely human.
          </p>
        </div>

        {/* Hero Feature Showcase */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          
          {/* Visual Side */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-therapy-100 to-harmony-100 rounded-3xl p-8 border border-therapy-200 shadow-2xl overflow-hidden">
              
              {/* Main icon */}
              <div className="relative z-10 flex justify-center mb-8">
                <FeaturesIcon size={160} />
              </div>
              
              {/* Animated feature indicators */}
              <div className="relative z-10 grid grid-cols-2 gap-4">
                {platformCapabilities.map((cap, index) => (
                  <motion.div
                    key={cap.title}
                    className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-lg"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.2 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <cap.icon className="w-6 h-6 text-therapy-600 mx-auto mb-2" />
                    <div className="text-lg font-bold text-therapy-600">{cap.metric}</div>
                    <div className="text-xs text-muted-foreground">{cap.description}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-bold text-foreground mb-4">
                AI That Understands You
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Our platform goes beyond surface-level interactions. We've trained our AI 
                on thousands of therapeutic conversations, cultural contexts, and emotional nuances 
                to provide support that feels authentic and effective.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-therapy-50 rounded-xl p-4 border border-therapy-100">
                  <div className="text-2xl font-bold text-therapy-600">89%</div>
                  <div className="text-sm text-muted-foreground">User satisfaction</div>
                </div>
                <div className="bg-harmony-50 rounded-xl p-4 border border-harmony-100">
                  <div className="text-2xl font-bold text-harmony-600">2.4M+</div>
                  <div className="text-sm text-muted-foreground">Conversations</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Features Stories */}
        <div className="space-y-12 mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Features That Change Lives
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real stories from real people whose mental health journeys were transformed by our technology.
            </p>
          </div>

          {coreFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              
              {/* Content */}
              <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                <div className="flex items-center space-x-4 mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-foreground">{feature.title}</h4>
                    <Badge className="bg-therapy-50 text-therapy-700 border-therapy-200 mt-1">
                      {feature.highlight}
                    </Badge>
                  </div>
                </div>
                
                <blockquote className="text-lg italic text-muted-foreground mb-6 leading-relaxed border-l-4 border-therapy-200 pl-6">
                  "{feature.story}"
                </blockquote>
                
                <div className="space-y-3">
                  {feature.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-therapy-500 rounded-full"></div>
                      <span className="text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual */}
              <div className={index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                <Card className="bg-gradient-to-br from-therapy-50 to-harmony-50 border border-therapy-100 shadow-lg">
                  <CardContent className="p-8">
                    <div className="aspect-square bg-white rounded-2xl flex items-center justify-center shadow-lg">
                      <div className={`w-24 h-24 rounded-full bg-gradient-to-r ${feature.gradient} flex items-center justify-center`}>
                        <feature.icon className="w-12 h-12 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Advanced Features - Replacing static icons */}
        <div className="space-y-8 mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Advanced Capabilities
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Cutting-edge features powered by next-generation AI technology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advancedFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="group"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card className="bg-white border border-gray-200 hover:border-therapy-300 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden h-full">
                  <CardContent className="p-6 text-center">
                    {/* Animated icon background */}
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.color} mx-auto mb-6 flex items-center justify-center relative overflow-hidden group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-10 h-10 text-white relative z-10" />
                      
                      {/* Animation overlays based on type */}
                      {feature.animation === 'chart' && (
                        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent animate-pulse" />
                      )}
                      {feature.animation === 'chat' && (
                        <div className="absolute inset-0">
                          <div className="absolute top-2 right-2 w-2 h-2 bg-white/60 rounded-full animate-ping" />
                        </div>
                      )}
                      {feature.animation === 'pulse' && (
                        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      )}
                      {feature.animation === 'network' && (
                        <div className="absolute inset-0">
                          <div className="absolute top-1 left-3 w-1 h-1 bg-white/60 rounded-full animate-ping" />
                          <div className="absolute bottom-2 right-3 w-1 h-1 bg-white/60 rounded-full animate-ping delay-1000" />
                        </div>
                      )}
                    </div>
                    
                    <h4 className="text-xl font-bold text-foreground mb-3">{feature.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-therapy-600 hover:text-therapy-700 hover:bg-therapy-50 group/btn w-full"
                      >
                        Learn More
                        <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-therapy-600 to-harmony-600 rounded-3xl p-12 text-white shadow-2xl">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              Experience the Future of Mental Healthcare
            </h3>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands who've discovered what personalized, AI-powered therapy can do for their mental health journey.
            </p>
            <AppleStyleButton 
              variant="outline"
              size="lg" 
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              icon={ArrowRight}
            >
              Start Your Journey
            </AppleStyleButton>
          </div>
        </div>
      </OptimizedSectionContainer>
    </SafeComponentWrapper>
  );
};

export default EnhancedFeaturesSection;