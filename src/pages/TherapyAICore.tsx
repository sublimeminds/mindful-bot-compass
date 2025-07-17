import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Brain, 
  Zap, 
  Shield, 
  Target, 
  Users, 
  BarChart3,
  MessageSquare,
  Globe,
  Activity,
  Heart,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Cpu,
  Headphones,
  UserCheck,
  AlertTriangle,
  Layers,
  Network
} from 'lucide-react';

const TherapyAICore = () => {
  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-therapy-50/30 to-calm-50/30">
        
        {/* Hero Section */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white overflow-hidden">
          {/* Grid Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: '50px 50px'
            }}></div>
          </div>
          
          {/* Floating Tech Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-20 w-32 h-32 border border-white/20 rounded-lg rotate-12 animate-float"></div>
            <div className="absolute top-40 right-32 w-24 h-24 border border-blue-400/30 rounded-full animate-float animation-delay-200"></div>
            <div className="absolute bottom-32 left-32 w-20 h-20 border border-purple-400/30 rounded-lg rotate-45 animate-float animation-delay-400"></div>
            <div className="absolute bottom-20 right-20 w-28 h-28 border border-cyan-400/30 rounded-full animate-float animation-delay-600"></div>
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Content */}
              <div>
                <Badge variant="secondary" className="mb-6 bg-white/10 text-white border-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                  <Cpu className="w-4 h-4 mr-2" />
                  Platform Overview
                </Badge>
                
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                  <span className="text-white">TherapySync</span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">AI Core Platform</span>
                </h1>
                
                <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                  The complete mental health technology stack powered by nine interconnected AI systems, 
                  delivering personalized therapy experiences at scale.
                </p>
                
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                    <div className="text-2xl font-bold text-blue-400">9</div>
                    <div className="text-sm text-gray-300">AI Systems</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                    <div className="text-2xl font-bold text-purple-400">50+</div>
                    <div className="text-sm text-gray-300">Approaches</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                    <div className="text-2xl font-bold text-cyan-400">24/7</div>
                    <div className="text-sm text-gray-300">Monitoring</div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-medium group transition-all duration-300"
                  >
                    Explore Platform 
                    <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-medium transition-all duration-300"
                  >
                    View Architecture
                  </Button>
                </div>
              </div>
              
              {/* Right Side - Visual */}
              <div className="relative">
                {/* Central Hub */}
                <div className="relative w-80 h-80 mx-auto">
                  {/* Core Circle */}
                  <div className="absolute inset-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
                    <Brain className="h-20 w-20 text-white" />
                  </div>
                  
                  {/* Orbiting Systems */}
                  <div className="absolute inset-0 animate-spin-slow">
                    {/* System Icons */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                      <MessageSquare className="h-6 w-6 text-white" />
                    </div>
                    <div className="absolute top-1/4 right-0 transform translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                      <Globe className="h-6 w-6 text-white" />
                    </div>
                    <div className="absolute bottom-1/4 right-0 transform translate-x-1/2 translate-y-1/2 w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                      <AlertTriangle className="h-6 w-6 text-white" />
                    </div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div className="absolute bottom-1/4 left-0 transform -translate-x-1/2 translate-y-1/2 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div className="absolute top-1/4 left-0 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                      <Layers className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  
                  {/* Connection Lines */}
                  <div className="absolute inset-0 opacity-30">
                    <svg className="w-full h-full" viewBox="0 0 320 320">
                      <circle cx="160" cy="160" r="120" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4,4">
                        <animateTransform attributeName="transform" type="rotate" values="0 160 160;360 160 160" dur="20s" repeatCount="indefinite"/>
                      </circle>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Systems Overview */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="therapy-text-gradient">Comprehensive AI Ecosystem</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Nine interconnected AI systems working together to provide the most personalized and effective therapy experience.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Adaptive Systems */}
              <Card className="therapy-gradient-border bg-white shadow-therapy-glow hover:shadow-therapy-strong transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 therapy-gradient-bg rounded-2xl flex items-center justify-center shadow-therapy-glow">
                      <Zap className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Adaptive Systems</CardTitle>
                      <p className="text-sm text-muted-foreground">AI that learns and evolves</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Multi-model AI router that intelligently selects the best AI model for each situation and continuously adapts your therapy plan.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-therapy-600" />
                      <span className="text-sm">Dynamic model selection</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-therapy-600" />
                      <span className="text-sm">Real-time plan adjustments</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-therapy-600" />
                      <span className="text-sm">Effectiveness tracking</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Therapy Chat */}
              <Card className="bg-gradient-to-br from-calm-50 to-white border-calm-200 shadow-calm-glow hover:shadow-calm-strong transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-calm-500 to-calm-600 rounded-2xl flex items-center justify-center shadow-calm-glow">
                      <MessageSquare className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">AI Therapy Chat</CardTitle>
                      <p className="text-sm text-muted-foreground">Conversational therapy AI</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Advanced conversational AI trained in 50+ therapeutic approaches, providing personalized therapy sessions.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-calm-600" />
                      <span className="text-sm">50+ therapy techniques</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-calm-600" />
                      <span className="text-sm">Natural conversations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-calm-600" />
                      <span className="text-sm">Session continuity</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cultural AI */}
              <Card className="bg-gradient-to-br from-harmony-50 to-white border-harmony-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-harmony-500 to-harmony-600 rounded-2xl flex items-center justify-center">
                      <Globe className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Cultural AI</CardTitle>
                      <p className="text-sm text-muted-foreground">Culturally aware therapy</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    AI that understands and adapts to cultural backgrounds, communication styles, and family structures.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-harmony-600" />
                      <span className="text-sm">100+ cultural adaptations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-harmony-600" />
                      <span className="text-sm">25+ languages</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-harmony-600" />
                      <span className="text-sm">Religious considerations</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Routing */}
              <Card className="bg-gradient-to-br from-balance-50 to-white border-balance-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-balance-500 to-balance-600 rounded-2xl flex items-center justify-center">
                      <Network className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">AI Routing</CardTitle>
                      <p className="text-sm text-muted-foreground">Smart decision engine</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Intelligent routing system that directs users to the most appropriate AI model and therapeutic approach.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-balance-600" />
                      <span className="text-sm">Context-aware routing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-balance-600" />
                      <span className="text-sm">Priority handling</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-balance-600" />
                      <span className="text-sm">Fallback systems</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Crisis Monitoring */}
              <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center">
                      <AlertTriangle className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Crisis Monitoring</CardTitle>
                      <p className="text-sm text-muted-foreground">24/7 safety watch</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Advanced AI that continuously monitors for crisis indicators and automatically escalates to emergency support.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm">Real-time analysis</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm">Automatic escalation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm">Emergency protocols</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Community */}
              <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Community</CardTitle>
                      <p className="text-sm text-muted-foreground">Peer support network</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    AI-moderated community features with peer support, group challenges, and milestone celebrations.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">Peer connections</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">Group challenges</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">AI moderation</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mood & Progress */}
              <Card className="bg-gradient-to-br from-green-50 to-white border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                      <TrendingUp className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Mood & Progress</CardTitle>
                      <p className="text-sm text-muted-foreground">Intelligent tracking</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Advanced analytics that track mood patterns, therapy progress, and automatically adjust treatment plans.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Mood pattern analysis</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Progress visualization</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Predictive insights</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Therapy Approaches */}
              <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                      <Layers className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Therapy Approaches</CardTitle>
                      <p className="text-sm text-muted-foreground">50+ methodologies</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Comprehensive library of evidence-based therapeutic approaches that AI seamlessly integrates based on your needs.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">CBT, DBT, EMDR & more</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Evidence-based methods</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Adaptive combinations</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Personalization */}
              <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                      <UserCheck className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">AI Personalization</CardTitle>
                      <p className="text-sm text-muted-foreground">Tailored experiences</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Deep personalization engine that creates unique therapy experiences based on personality, preferences, and progress.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-indigo-600" />
                      <span className="text-sm">Personality-based</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-indigo-600" />
                      <span className="text-sm">Learning preferences</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-indigo-600" />
                      <span className="text-sm">Adaptive content</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* System Integration Visualization */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-therapy-50/50 to-calm-50/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-therapy-600 via-calm-600 to-harmony-600 bg-clip-text text-transparent">
                  Seamless Integration
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                All systems work together in perfect harmony to provide the most comprehensive and effective therapy experience.
              </p>
            </div>

            <Card className="bg-white border-therapy-200 shadow-therapy-glow">
              <CardContent className="p-12">
                <div className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-8">
                    <div className="absolute inset-0 therapy-gradient-bg rounded-full shadow-therapy-glow animate-pulse"></div>
                    <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                      <Cpu className="h-16 w-16 therapy-text-gradient-animated" />
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-bold mb-6 therapy-text-gradient">Unified AI Architecture</h3>
                  
                  <div className="grid md:grid-cols-3 gap-8 mb-12">
                    <div className="text-center">
                      <div className="w-16 h-16 therapy-gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-therapy-glow">
                        <Brain className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="text-xl font-semibold mb-2">Intelligence Layer</h4>
                      <p className="text-muted-foreground">Multi-model AI with adaptive routing and personalization</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-calm-500 to-calm-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-calm-glow">
                        <Shield className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="text-xl font-semibold mb-2">Safety Layer</h4>
                      <p className="text-muted-foreground">Crisis monitoring, privacy protection, and ethical AI</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-harmony-500 to-harmony-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Heart className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="text-xl font-semibold mb-2">Care Layer</h4>
                      <p className="text-muted-foreground">Cultural awareness, community support, and human connection</p>
                    </div>
                  </div>
                  
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Every interaction is powered by the collective intelligence of all nine systems, 
                    creating a therapy experience that's not just personalized, but truly transformative.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="relative p-12 therapy-gradient-bg rounded-3xl shadow-therapy-glow text-white overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-2xl"></div>
              </div>
              
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Ready to Experience the Future of Therapy?
                </h2>
                <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                  Join thousands of users who have transformed their mental health with our comprehensive AI therapy platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-white text-therapy-600 hover:bg-gray-50 px-8 py-4 text-lg font-medium shadow-lg"
                  >
                    Start Free Trial
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-medium"
                  >
                    Schedule Demo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default TherapyAICore;