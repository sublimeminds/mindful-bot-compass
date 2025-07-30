import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Star, Heart, Sparkles, Shield, Users, Zap, Brain, Clock, Lightbulb, Globe, Cpu, BarChart3, AlertTriangle, Waves, Mic, Target, TrendingUp } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { getItemIcon } from '@/utils/iconUtils';
import { useNavigationMenus } from '@/hooks/useNavigationMenus';
import SafeBulletproofAvatar from '@/components/avatar/SafeBulletproofAvatar';
import { therapistPersonas } from '@/components/avatar/TherapistAvatarPersonas';

const EnterpriseHeroSection = () => {
  const navigate = useNavigate();
  const [activeZone, setActiveZone] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const { menuConfig, loading } = useNavigationMenus();

  // Helper function to safely render icons
  const renderIcon = (iconName: string, props: { size?: number; className?: string } = {}) => {
    const IconComponent = getItemIcon(iconName);
    return React.createElement(IconComponent as React.ComponentType<any>, props);
  };

  // Auto-cycling experience zones
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveZone((prev) => (prev + 1) % 5);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Auto-cycling testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Visibility trigger for animations
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Get all navigation features organized by menu
  const organizeFeaturesByMenu = (): Record<string, { icon: string; items: any[] }> => {
    if (!menuConfig.menus || !menuConfig.items) return {};
    
    const organized: Record<string, { icon: string; items: any[] }> = {};
    menuConfig.menus
      .filter(menu => menu.is_active)
      .sort((a, b) => a.position - b.position)
      .forEach(menu => {
        const menuItems = menuConfig.items
          .filter(item => item.menu_id === menu.id && item.is_active)
          .sort((a, b) => a.position - b.position);
        
        if (menuItems.length > 0) {
          organized[menu.label] = {
            icon: menu.icon,
            items: menuItems
          };
        }
      });
    
    return organized;
  };

  const featuresData = organizeFeaturesByMenu();

  // Experience Zones Configuration
  const experienceZones = [
    {
      id: 'therapy-ai',
      title: 'Your AI Therapy Experience',
      subtitle: 'Choose from 24+ specialized AI therapists (7 available in free tier)',
      description: 'Choose from specialized AI therapists trained in different approaches - from CBT to mindfulness, trauma-focused to cultural therapy. Each personality adapts to your unique needs.',
      icon: 'therapy-sync-ai-core',
      bgGradient: 'from-therapy-500/20 via-calm-400/15 to-harmony-300/10',
      accentColor: 'therapy',
      features: featuresData['Therapy AI']?.items || [],
      highlight: 'Available 24/7 in your pocket',
      stats: { users: '50k+', rating: '4.9/5', uptime: '99.9%' }
    },
    {
      id: 'ecosystem',
      title: 'Complete Mental Health Ecosystem',
      subtitle: 'Everything you need for comprehensive wellness in one platform',
      description: 'Experience comprehensive mental health care through our integrated ecosystem. Track your emotional patterns with AI insights, connect with supportive communities, access immediate crisis support, and involve your family in your healing journey. Every feature works together to create a complete support network around your wellbeing.',
      icon: 'community-groups',
      bgGradient: 'from-harmony-500/20 via-balance-400/15 to-flow-300/10',
      accentColor: 'harmony',
      features: [
        { 
          icon: 'mood-progress-tracking', 
          title: 'Mood & Progress Tracking',
          description: 'Monitor your emotional patterns with AI-powered insights that help you understand triggers, celebrate progress, and receive personalized recommendations for maintaining optimal mental health.'
        },
        { 
          icon: 'crisis-support-system', 
          title: '24/7 Crisis Support',
          description: 'Get immediate support during mental health crises with our AI-powered emergency response system, direct access to trained professionals, and comprehensive safety resources available 24/7.'
        },
        { 
          icon: 'community-groups', 
          title: 'Peer Support Groups',
          description: 'Find belonging and understanding in professionally moderated communities where people with similar experiences share support, encouragement, and practical strategies for healing and growth.'
        },
        { 
          icon: 'family-account-sharing', 
          title: 'Family Account Sharing',
          description: 'Strengthen family bonds and improve communication through secure progress sharing, family therapy sessions, and tools that help your loved ones understand and support your mental health journey.'
        },
        { 
          icon: 'integrations-hub', 
          title: 'Health App Integration',
          description: 'Seamlessly integrate with fitness trackers, meditation apps, and health platforms to create a holistic view of your wellbeing that helps identify patterns and optimize your mental health strategies.'
        },
        { 
          icon: 'mental-health-library', 
          title: 'Resource Library',
          description: 'Explore our extensive library of evidence-based therapeutic resources, including guided exercises, mindfulness meditations, educational content, and self-help tools curated specifically for your mental health goals.'
        }
      ],
      highlight: 'Holistic wellness approach',
      stats: { communities: '500+', families: '10k+', sessions: '1M+' }
    },
    {
      id: 'intelligence',
      title: 'Intelligence & Insights',
      subtitle: 'Advanced analytics and integrations for deeper understanding',
      description: 'Get detailed progress reports, export your data, integrate with health apps, and access our API. Your mental health data works for you.',
      icon: 'api-access',
      bgGradient: 'from-flow-500/20 via-therapy-400/15 to-calm-300/10',
      accentColor: 'flow',
      features: featuresData['Tools & Data']?.items || [],
      highlight: 'Data-driven wellness',
      stats: { insights: '50+', integrations: '25+', exports: 'Unlimited' }
    },
    {
      id: 'solutions',
      title: 'Solutions for Everyone',
      subtitle: 'Personalized experiences for individuals, families, and organizations',
      description: 'Whether you\'re seeking personal growth, family therapy, or workplace wellness - we have tailored solutions that scale with your needs.',
      icon: 'for-families',
      bgGradient: 'from-balance-500/20 via-mindful-400/15 to-therapy-300/10',
      accentColor: 'balance',
      features: featuresData['Solutions']?.items || [],
      highlight: 'Flexible for every situation',
      stats: { individuals: '40k+', organizations: '200+', countries: '15+' }
    },
    {
      id: 'support',
      title: 'Support & Growth',
      subtitle: 'Comprehensive resources for your mental health journey',
      description: 'From onboarding to crisis support, learning resources to enterprise security - we\'re with you every step of the way.',
      icon: 'learning-hub',
      bgGradient: 'from-mindful-500/20 via-harmony-400/15 to-balance-300/10',
      accentColor: 'mindful',
      features: featuresData['Resources']?.items || [],
      highlight: 'Always supported',
      stats: { support: '24/7', resources: '100+', security: 'HIPAA' }
    }
  ];

  const testimonials = [
    {
      quote: "This AI therapist helped me work through my anxiety in ways I never thought possible. I feel so much calmer and more in control.",
      author: "Sarah M.",
      role: "Marketing Professional",
      company: "Individual User",
      impact: "40% anxiety reduction"
    },
    {
      quote: "Having someone to talk to anytime I need it has been life-changing. The conversations feel so real and genuinely helpful.",
      author: "Michael R.",
      role: "College Student", 
      company: "Individual User",
      impact: "Better sleep quality"
    },
    {
      quote: "I was skeptical at first, but this AI really understands me. It's like having a therapist in my pocket whenever I need support.",
      author: "Emily W.",
      role: "Working Parent",
      company: "Individual User",
      impact: "Improved family relationships"
    }
  ];

  const trustMetrics = [
    { value: "50k+", label: "People Supported", icon: "for-individuals", trend: "Growing Daily" },
    { value: "4.9/5", label: "User Rating", icon: Star, trend: "Highly Rated" },
    { value: "24/7", label: "Always Available", icon: "crisis-support", trend: "Anytime" },
    { value: "Private", label: "Secure & Safe", icon: "enterprise-security", trend: "HIPAA Protected" }
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-therapy-50/20 via-background to-calm-50/10">
      {/* Enhanced Multi-layered Background System */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary Gradient Orbs */}
        <div className="absolute -top-32 -right-32 w-[32rem] h-[32rem] rounded-full opacity-15 animate-swirl-breathe">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-therapy-400 via-calm-400 to-harmony-400 blur-3xl"></div>
        </div>
        <div className="absolute -bottom-40 -left-40 w-[28rem] h-[28rem] rounded-full opacity-12 animate-swirl-breathe" style={{animationDelay: '2s'}}>
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-harmony-300 via-flow-300 to-therapy-300 blur-3xl"></div>
        </div>
        
        {/* Floating Custom Icon Constellation */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute top-[15%] left-[8%] animate-wave-therapy">
            {renderIcon("therapy-sync-ai-core", { size: 32, className: "text-therapy-500" })}
          </div>
          <div className="absolute top-[25%] right-[12%] animate-pulse-neural" style={{animationDelay: '1s'}}>
            {renderIcon("ai-therapy-chat", { size: 28, className: "text-calm-500" })}
          </div>
          <div className="absolute bottom-[20%] left-[15%] animate-breathe-mindful" style={{animationDelay: '2s'}}>
            {renderIcon("voice-ai-therapy", { size: 30, className: "text-harmony-500" })}
          </div>
          <div className="absolute bottom-[35%] right-[8%] animate-shield-secure" style={{animationDelay: '3s'}}>
            {renderIcon("crisis-support-system", { size: 26, className: "text-flow-500" })}
          </div>
          <div className="absolute top-[40%] left-[5%] animate-bounce-family" style={{animationDelay: '4s'}}>
            {renderIcon("group-therapy-ai", { size: 24, className: "text-mindful-500" })}
          </div>
          <div className="absolute bottom-[50%] right-[15%] animate-connect-sync" style={{animationDelay: '5s'}}>
            {renderIcon("integrations-hub", { size: 28, className: "text-balance-500" })}
          </div>
        </div>
        
        {/* Neural Network Pattern */}
        <div className="absolute inset-0 opacity-[0.06]">
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <linearGradient id="neural-line" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--therapy-500))" stopOpacity="0.15"/>
                <stop offset="50%" stopColor="hsl(var(--calm-500))" stopOpacity="0.1"/>
                <stop offset="100%" stopColor="hsl(var(--harmony-500))" stopOpacity="0.15"/>
              </linearGradient>
            </defs>
            <line x1="25%" y1="25%" x2="75%" y2="33%" stroke="url(#neural-line)" strokeWidth="1.5" className="animate-pulse"/>
            <line x1="33%" y1="33%" x2="66%" y2="75%" stroke="url(#neural-line)" strokeWidth="1.5" className="animate-pulse" style={{animationDelay: '1s'}}/>
            <line x1="75%" y1="25%" x2="25%" y2="75%" stroke="url(#neural-line)" strokeWidth="1.5" className="animate-pulse" style={{animationDelay: '2s'}}/>
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10 pt-20 pb-20">
        
        {/* Hero Section */}
        <div className="text-center mb-20 space-y-8">
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 border border-therapy-200/50 shadow-therapy-subtle">
              {renderIcon("enterprise-security", { className: "h-6 w-6 text-therapy-600" })}
              <span className="text-sm font-semibold text-therapy-700">HIPAA Protected</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            
            <div className="inline-flex items-center space-x-2 bg-harmony-50/80 backdrop-blur-sm rounded-full px-3 py-1 border border-harmony-200/50">
              {renderIcon("therapy-sync-ai-core", { className: "h-5 w-5 text-harmony-600" })}
              <span className="text-xs font-medium text-harmony-700">24+ AI Therapists Available</span>
            </div>
          </div>

          {/* Main Headline */}
          <div className="space-y-6 max-w-6xl mx-auto">
            <h1 className={cn(
              "text-5xl lg:text-7xl xl:text-8xl font-bold leading-tight transition-all duration-1000",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}>
              <span className="block text-foreground">Transform Your</span>
              <span className="block bg-gradient-to-r from-therapy-600 via-calm-500 to-harmony-500 bg-clip-text text-transparent animate-pulse">Mental Health</span>
              <span className="block text-foreground">With AI Therapy</span>
            </h1>
            
            <p className={cn(
              "text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-4xl mx-auto transition-all duration-1000 delay-300",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}>
              Access personalized mental health support instantly with our advanced AI therapists. 
              <span className="font-semibold text-therapy-600"> Safe, private, and proven effective </span>
              in helping thousands feel 
              <span className="font-bold text-therapy-700"> 40% calmer in just 2 weeks.</span>
            </p>
          </div>

          {/* Trust Metrics */}
          <div className={cn(
            "grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto transition-all duration-1000 delay-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            {trustMetrics.map((metric, index) => (
              <div 
                key={index}
                className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-therapy-200/30 hover:border-therapy-300/50 transition-all duration-300 hover:shadow-therapy-glow hover:scale-105"
              >
                <div className="flex items-center justify-center mb-3">
                  {typeof metric.icon === 'string' ? 
                    renderIcon(metric.icon, { className: "h-8 w-8 text-therapy-600" }) :
                    React.createElement(metric.icon, { className: "h-8 w-8 text-therapy-600" })
                  }
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">{metric.value}</div>
                <div className="text-sm text-muted-foreground">{metric.label}</div>
                <div className="text-xs text-therapy-600 font-medium">{metric.trend}</div>
              </div>
            ))}
          </div>

          {/* Call-to-Action Buttons */}
          <div className={cn(
            "flex flex-col sm:flex-row justify-center gap-6 transition-all duration-1000 delay-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <Button
              size="lg"
              onClick={() => navigate('/get-started')}
              className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 text-white font-semibold px-10 py-6 text-xl rounded-xl shadow-therapy-glow hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Heart className="mr-3 h-6 w-6" />
              <span>Start Your Healing Journey</span>
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-therapy-200 text-therapy-700 hover:bg-therapy-50 font-semibold px-10 py-6 text-xl rounded-xl transition-all duration-300 hover:scale-105"
            >
              <Play className="mr-3 h-6 w-6" />
              <span>Watch Demo</span>
            </Button>
          </div>
        </div>

        {/* Experience Zones Showcase */}
        <div className="space-y-32">
          {experienceZones.map((zone, zoneIndex) => (
            <div 
              key={zone.id}
              className={cn(
                "relative rounded-3xl p-8 lg:p-12 transition-all duration-1000",
                `bg-gradient-to-br ${zone.bgGradient}`,
                "border border-white/20 backdrop-blur-sm"
              )}
            >
              {/* Zone Background Pattern */}
              <div className="absolute inset-0 opacity-[0.02]">
                <div className="absolute top-8 right-8">
                  {renderIcon(zone.icon, { size: 120, className: `text-${zone.accentColor}-500` })}
                </div>
              </div>

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                
          {/* Zone Content */}
                <div className="space-y-8">
                  <div>
                    <div className="inline-flex items-center gap-3 mb-4">
                      {renderIcon(zone.icon, { size: 48, className: `text-${zone.accentColor}-600 animate-pulse-neural` })}
                      <span className={`text-sm font-bold text-${zone.accentColor}-600 bg-white/50 px-3 py-1 rounded-full`}>
                        {zone.highlight}
                      </span>
                    </div>
                    
                    <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                      {zone.title}
                    </h2>
                    
                    <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                      {zone.subtitle}
                    </p>
                    
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {zone.description}
                    </p>
                  </div>

                  {/* Zone Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(zone.stats).map(([key, value]) => (
                      <div key={key} className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-foreground">{value}</div>
                        <div className="text-sm text-muted-foreground capitalize">{key}</div>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => {
                      switch(zone.id) {
                        case 'therapy-ai':
                          navigate('/therapist-discovery');
                          break;
                        case 'ecosystem':
                          navigate('/mood-tracking');
                          break;
                        case 'intelligence':
                          navigate('/analytics');
                          break;
                        case 'solutions':
                          navigate('/for-individuals');
                          break;
                        case 'support':
                          navigate('/getting-started');
                          break;
                        default:
                          navigate('/');
                      }
                    }}
                    className={`border-2 border-${zone.accentColor}-200 text-${zone.accentColor}-700 hover:bg-${zone.accentColor}-50`}
                  >
                    <span>Explore {zone.title}</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                {/* Zone Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {zone.features.slice(0, 6).map((feature, featureIndex) => (
                    <div 
                      key={featureIndex}
                      className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/30 hover:border-therapy-300/50 transition-all duration-300 hover:shadow-therapy-glow group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-white/80 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          {renderIcon(feature.icon, { size: 40, className: `text-${zone.accentColor}-600` })}
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                          {feature.badge && (
                            <span className="inline-block mt-2 px-2 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-700">
                              {feature.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Therapist Discovery Showcase */}
        <div className="mt-32 space-y-12">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-3 mb-4">
              {renderIcon("therapy-sync-ai-core", { size: 48, className: "text-therapy-600 animate-pulse-neural" })}
              <span className="text-sm font-bold text-therapy-600 bg-white/50 px-3 py-1 rounded-full">
                Meet Your AI Therapists
              </span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
              Discover Your Perfect
              <span className="block bg-gradient-to-r from-therapy-600 to-calm-500 bg-clip-text text-transparent">
                AI Therapy Match
              </span>
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Each AI therapist is trained in specific therapeutic approaches and specializes in different areas. 
              From anxiety and depression to trauma and relationship issues - find the personality that resonates with you.
            </p>
          </div>

          {/* Featured Therapist Profiles with Real Avatars */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(therapistPersonas).slice(0, 6).map((persona, index) => {
              const therapistData = [
                {
                  ...persona,
                  specialty: "Cognitive Behavioral Therapy",
                  approach: "CBT",
                  description: "Specializes in anxiety, depression, and negative thought patterns. Uses evidence-based techniques to help you rebuild confidence.",
                  color: "therapy",
                  availability: "Free Tier"
                },
                {
                  ...persona,
                  specialty: "Mindfulness-Based Therapy", 
                  approach: "MBCT",
                  description: "Combines mindfulness with therapeutic techniques for stress reduction, emotional regulation, and inner peace.",
                  color: "calm",
                  availability: "Free Tier"
                },
                {
                  ...persona,
                  specialty: "Trauma-Focused Therapy",
                  approach: "EMDR", 
                  description: "Specialized in trauma recovery, PTSD, and helping you process difficult experiences safely and effectively.",
                  color: "harmony",
                  availability: "Premium"
                },
                {
                  ...persona,
                  specialty: "Cultural Therapy",
                  approach: "Multicultural",
                  description: "Understands diverse cultural backgrounds and helps navigate identity, family expectations, and cultural conflicts.",
                  color: "balance",
                  availability: "Free Tier"
                },
                {
                  ...persona,
                  specialty: "Family Therapy",
                  approach: "Systemic",
                  description: "Focuses on family dynamics, relationship issues, and improving communication patterns within families.",
                  color: "mindful",
                  availability: "Premium"
                },
                {
                  ...persona,
                  specialty: "Crisis Support",
                  approach: "Crisis Intervention",
                  description: "Available 24/7 for immediate support during mental health crises and emotional emergencies.",
                  color: "flow",
                  availability: "All Tiers"
                }
              ][index];

              return (
                <div 
                  key={index}
                  className={`bg-gradient-to-br from-${therapistData.color}-50/50 to-white/80 backdrop-blur-sm rounded-2xl p-6 border border-${therapistData.color}-200/50 hover:border-${therapistData.color}-300/70 transition-all duration-300 hover:shadow-lg hover:scale-105 group`}
                >
                  {/* Therapist Avatar and Info */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <SafeBulletproofAvatar
                        therapistId={persona.therapistId}
                        therapistName={persona.name}
                        className="w-16 h-16"
                        showName={false}
                        size="md"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-foreground">{persona.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${therapistData.availability === 'Free Tier' ? 'bg-green-100 text-green-700' : therapistData.availability === 'Premium' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                          {therapistData.availability}
                        </span>
                      </div>
                      <p className={`text-sm font-medium text-${therapistData.color}-700 mb-1`}>
                        {therapistData.specialty}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {therapistData.approach} Approach
                      </p>
                    </div>
                  </div>
                  
                  {/* Personality Style Indicators */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`px-2 py-1 rounded-full bg-${therapistData.color}-100 text-${therapistData.color}-700 text-xs font-medium`}>
                      {persona.personality.approachStyle}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {persona.personality.postureStyle} style
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {therapistData.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Button
              onClick={() => navigate('/therapist-discovery')}
              className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 text-white font-semibold px-8 py-4 text-lg rounded-xl shadow-therapy-glow hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Users className="mr-2 h-5 w-5" />
              Explore All 24+ AI Therapists
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* TherapySync's AI Hub: Where Intelligence Meets Compassion */}
        <div className="mt-32 space-y-16">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-3 mb-4">
              <Brain className="h-12 w-12 text-flow-600 animate-pulse-neural" />
              <span className="text-sm font-bold text-flow-600 bg-white/50 px-3 py-1 rounded-full">
                TherapySync's AI Hub
              </span>
            </div>
            
            <h2 className="text-4xl lg:text-6xl font-bold text-foreground">
              Where Intelligence Meets
              <span className="block bg-gradient-to-r from-flow-600 via-therapy-500 to-calm-500 bg-clip-text text-transparent">
                Compassion
              </span>
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Discover the complete AI-powered journey from assessment to ongoing optimization - exactly how our AI works to transform your mental health.
            </p>
          </div>

          {/* Main AI Workflow Visualization */}
          <div className="relative bg-gradient-to-br from-flow-50/50 to-therapy-50/30 rounded-3xl p-12 border border-flow-200/50 overflow-hidden">
            
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03]">
              <svg className="w-full h-full">
                <defs>
                  <pattern id="ai-circuit" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                    <circle cx="30" cy="30" r="2" fill="hsl(var(--flow-500))"/>
                    <line x1="30" y1="0" x2="30" y2="60" stroke="hsl(var(--therapy-500))" strokeWidth="1"/>
                    <line x1="0" y1="30" x2="60" y2="30" stroke="hsl(var(--calm-500))" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#ai-circuit)"/>
              </svg>
            </div>

            {/* Central AI Hub */}
            <div className="relative text-center mb-16">
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-gradient-to-br from-flow-500 to-therapy-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse shadow-2xl">
                  <Brain className="h-16 w-16 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Intelligent Routing Hub</h3>
              <p className="text-muted-foreground">Real-time decision making for optimal therapy experiences</p>
            </div>

            {/* Enhanced AI Workflow - Real User Journey */}
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 mb-12">
              {[
                {
                  step: "1",
                  title: "Smart Onboarding",
                  description: "AI assessment analyzes your mental health needs, cultural background, and therapy preferences to create your personalized profile.",
                  icon: <Users className="h-8 w-8" />,
                  color: "therapy",
                  metrics: "5 min assessment"
                },
                {
                  step: "2", 
                  title: "AI Therapist Matching",
                  description: "Advanced algorithm selects the perfect AI therapist from 24+ personalities based on compatibility analysis.",
                  icon: <Brain className="h-8 w-8" />,
                  color: "calm",
                  metrics: "24+ specialists"
                },
                {
                  step: "3",
                  title: "Dynamic Strategy Selection",
                  description: "AI adapts therapeutic techniques in real-time, choosing from CBT, DBT, mindfulness, and trauma-informed approaches.",
                  icon: <Target className="h-8 w-8" />,
                  color: "harmony",
                  metrics: "100+ techniques"
                },
                {
                  step: "4",
                  title: "Real-Time Analysis",
                  description: "Continuous monitoring of emotional state through voice, text, and behavioral patterns for immediate support.",
                  icon: <BarChart3 className="h-8 w-8" />,
                  color: "flow",
                  metrics: "<1 sec response"
                },
                {
                  step: "5",
                  title: "Crisis Prevention",
                  description: "AI learns your patterns to predict and prevent mental health crises before they occur with professional intervention.",
                  icon: <Shield className="h-8 w-8" />,
                  color: "mindful",
                  metrics: "89% prevention"
                },
                {
                  step: "6",
                  title: "Continuous Optimization",
                  description: "AI continuously learns from your progress, refining approaches to maximize therapeutic effectiveness over time.",
                  icon: <TrendingUp className="h-8 w-8" />,
                  color: "balance",
                  metrics: "40% improvement"
                }
              ].map((step, index) => (
                <div key={index} className="relative">
                  <div className={`bg-gradient-to-br from-${step.color}-100 to-white rounded-2xl p-6 border border-${step.color}-200/50 hover:border-${step.color}-300/70 transition-all duration-300 hover:shadow-lg group h-full`}>
                    <div className={`w-16 h-16 bg-${step.color}-500 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                      {step.icon}
                    </div>
                    <div className={`text-lg font-bold text-${step.color}-600 mb-2`}>Step {step.step}</div>
                    <h4 className="font-semibold text-foreground mb-2">{step.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">{step.description}</p>
                    <div className={`text-xs font-medium text-${step.color}-600 bg-${step.color}-50 px-2 py-1 rounded-full inline-block`}>
                      {step.metrics}
                    </div>
                  </div>
                  
                  {/* Connecting Arrow */}
                  {index < 5 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ArrowRight className="h-6 w-6 text-flow-400 animate-pulse" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* AI Capabilities Showcase */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-therapy-200/50 p-8 shadow-xl">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-foreground mb-4">
                  AI Performance Dashboard
                </h3>
                <p className="text-lg text-muted-foreground">
                  Real-time metrics showing our AI's capabilities and performance
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    category: 'Intelligence',
                    capabilities: [
                      { name: 'Natural Language Understanding', level: 98 },
                      { name: 'Emotional Intelligence', level: 96 },
                      { name: 'Cultural Awareness', level: 94 },
                      { name: 'Crisis Detection', level: 99 }
                    ]
                  },
                  {
                    category: 'Personalization',
                    capabilities: [
                      { name: 'Therapy Matching', level: 95 },
                      { name: 'Technique Adaptation', level: 93 },
                      { name: 'Progress Optimization', level: 91 },
                      { name: 'Communication Style', level: 97 }
                    ]
                  },
                  {
                    category: 'Security & Privacy',
                    capabilities: [
                      { name: 'HIPAA Compliance', level: 100 },
                      { name: 'End-to-End Encryption', level: 100 },
                      { name: 'Data Protection', level: 99 },
                      { name: 'Privacy Controls', level: 98 }
                    ]
                  }
                ].map((category, categoryIndex) => (
                  <div key={category.category} className="space-y-4">
                    <h3 className="text-xl font-semibold text-foreground flex items-center">
                      <Cpu className="h-5 w-5 mr-2 text-therapy-500" />
                      {category.category}
                    </h3>
                    
                    <div className="space-y-3">
                      {category.capabilities.map((capability, index) => (
                        <div key={capability.name} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{capability.name}</span>
                            <span className="font-semibold text-therapy-600">{capability.level}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-therapy-500 to-calm-500 h-2 rounded-full transition-all duration-1000 ease-out"
                              style={{ 
                                width: `${capability.level}%`,
                                animationDelay: `${(categoryIndex * 4 + index) * 200}ms`
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-gradient-to-r from-flow-100/50 to-therapy-100/30 rounded-2xl p-8 border border-flow-200/50">
            <h3 className="text-2xl font-bold text-center text-foreground mb-8">Real-Time AI Performance</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { metric: "<200ms", label: "Response Time", color: "therapy" },
                { metric: "99.9%", label: "Uptime", color: "calm" },
                { metric: "95%", label: "User Satisfaction", color: "harmony" },
                { metric: "24/7", label: "Crisis Detection", color: "flow" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`text-3xl font-bold text-${stat.color}-600 mb-1`}>{stat.metric}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Button
              onClick={() => navigate('/ai-technology')}
              className="bg-gradient-to-r from-flow-500 to-therapy-500 hover:from-flow-600 hover:to-therapy-600 text-white font-semibold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Brain className="mr-2 h-5 w-5" />
              Experience Our AI Technology
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mt-32 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-12">
            <span className="text-foreground">Real Stories, </span>
            <span className="bg-gradient-to-r from-therapy-600 to-calm-500 bg-clip-text text-transparent">Real Results</span>
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative h-40 overflow-hidden">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={cn(
                    "absolute inset-0 transition-all duration-500 transform",
                    activeTestimonial === index 
                      ? "opacity-100 translate-y-0" 
                      : "opacity-0 translate-y-4"
                  )}
                >
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-therapy-200/30">
                    <blockquote className="text-lg lg:text-xl text-muted-foreground italic mb-6">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="flex items-center justify-center gap-4">
                      <div className="text-center">
                        <div className="font-semibold text-foreground">{testimonial.author}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      </div>
                      <div className="w-px h-8 bg-therapy-300"></div>
                      <div className="text-center">
                        <div className="font-semibold text-therapy-600">{testimonial.impact}</div>
                        <div className="text-sm text-muted-foreground">Improvement</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Testimonial Indicators */}
            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all duration-300",
                    activeTestimonial === index 
                      ? "bg-therapy-500 w-8" 
                      : "bg-gray-300 hover:bg-therapy-300"
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="mt-24 text-center space-y-8 bg-gradient-to-r from-therapy-500/10 via-calm-400/10 to-harmony-300/10 rounded-3xl p-12 border border-therapy-200/30">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
            Ready to Transform Your Mental Health?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands who have found healing, growth, and peace through AI-powered therapy. 
            Your journey to better mental health starts with a single conversation.
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              {renderIcon("enterprise-security", { className: "h-4 w-4 text-green-500" })}
              <span>100% Private & Secure</span>
            </div>
            <div className="flex items-center space-x-2">
              {renderIcon("crisis-support", { className: "h-4 w-4 text-green-500" })}
              <span>24/7 Support Available</span>
            </div>
            <div className="flex items-center space-x-2">
              {renderIcon("getting-started", { className: "h-4 w-4 text-green-500" })}
              <span>No Credit Card Required</span>
            </div>
          </div>

          <Button
            size="lg"
            onClick={() => navigate('/get-started')}
            className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 text-white font-semibold px-12 py-6 text-xl rounded-xl shadow-therapy-glow hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Sparkles className="mr-3 h-6 w-6" />
            <span>Begin Your Healing Journey Today</span>
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
          
          <p className="text-xs text-muted-foreground">
            Free to start • Your conversations are always private • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};

export default EnterpriseHeroSection;