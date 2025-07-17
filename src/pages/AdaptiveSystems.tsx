import React, { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  Brain, 
  Target, 
  ArrowRight, 
  CheckCircle, 
  Star, 
  TrendingUp, 
  Activity, 
  Lightbulb, 
  BarChart3,
  Cpu,
  Layers,
  Gauge,
  Shield,
  Sparkles,
  Crown,
  Users,
  Clock,
  LineChart,
  PieChart,
  Globe,
  Headphones,
  Play,
  Pause
} from 'lucide-react';

const AdaptiveSystemsPage = () => {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [modelMetrics, setModelMetrics] = useState({
    claude4: { usage: 85, cost: 12.5, effectiveness: 98 },
    claudeSonnet: { usage: 65, cost: 8.2, effectiveness: 95 },
    gpt4: { usage: 45, cost: 6.8, effectiveness: 92 }
  });

  const toggleDemo = (demoId: string) => {
    setActiveDemo(activeDemo === demoId ? null : demoId);
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-therapy-50/30 to-calm-50/30">
        
        {/* Dynamic Hero Section */}
        <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-10 w-72 h-72 therapy-gradient-bg rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-calm-400 to-harmony-400 rounded-full blur-3xl animate-pulse animation-delay-400"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-balance-400 to-flow-400 rounded-full blur-3xl animate-pulse animation-delay-200"></div>
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-8">
                <div className="absolute inset-0 therapy-gradient-bg rounded-2xl shadow-therapy-glow animate-swirl-breathe"></div>
                <div className="absolute inset-2 bg-white rounded-xl flex items-center justify-center">
                  <Zap className="h-12 w-12 therapy-text-gradient-animated" />
                </div>
              </div>
              
              <Badge variant="secondary" className="mb-6 bg-gradient-to-r from-therapy-100 to-calm-100 text-therapy-800 border-therapy-300 px-4 py-2 text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                Next-Generation AI Technology
              </Badge>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                <span className="therapy-text-gradient-animated">Adaptive AI</span>
                <br />
                <span className="bg-gradient-to-r from-calm-600 via-harmony-600 to-balance-600 bg-clip-text text-transparent">Systems</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-12 leading-relaxed">
                Revolutionary AI that <span className="font-semibold text-therapy-600">learns</span>, 
                <span className="font-semibold text-calm-600"> adapts</span>, and 
                <span className="font-semibold text-harmony-600"> evolves</span> with you. 
                Our intelligent systems automatically optimize therapy approaches, personalize content, and predict your needs in real-time.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button 
                  size="lg" 
                  className="therapy-gradient-bg hover:opacity-90 text-white shadow-therapy-glow px-8 py-4 text-lg font-medium group transition-all duration-300"
                >
                  Experience Adaptive AI 
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="therapy-gradient-border px-8 py-4 text-lg font-medium hover:bg-therapy-50 transition-all duration-300"
                >
                  <Play className="mr-3 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Real-Time Model Selection Simulator */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="therapy-text-gradient">Automated Therapy Plan Creation</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                After onboarding, our AI instantly creates personalized therapy plans and continuously adapts them based on your progress.
              </p>
            </div>

            <Card className="bg-gradient-to-br from-therapy-50 to-calm-50 border-therapy-200 shadow-therapy-subtle">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold flex items-center justify-center gap-3">
                  <Cpu className="h-8 w-8 text-therapy-600" />
                  Multi-Model AI Router
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Claude 4 Opus */}
                  <Card className="border-2 border-therapy-300 bg-white shadow-lg">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-therapy-700">Claude 4 Opus</CardTitle>
                        <Badge className="bg-gradient-to-r from-therapy-500 to-therapy-600 text-white">Premium</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Usage</span>
                            <span>{modelMetrics.claude4.usage}%</span>
                          </div>
                          <Progress value={modelMetrics.claude4.usage} className="h-2" />
                        </div>
                         <div>
                           <div className="flex justify-between text-sm mb-2">
                             <span>Response Quality</span>
                             <span>Exceptional</span>
                           </div>
                           <Progress value={98} className="h-2" />
                         </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Effectiveness</span>
                            <span>{modelMetrics.claude4.effectiveness}%</span>
                          </div>
                          <Progress value={modelMetrics.claude4.effectiveness} className="h-2" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Highest quality for complex therapy, crisis situations, and premium users.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Claude Sonnet */}
                  <Card className="border-2 border-calm-300 bg-white shadow-lg">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-calm-700">Claude 4 Sonnet</CardTitle>
                        <Badge className="bg-gradient-to-r from-calm-500 to-calm-600 text-white">Free/Pro</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Usage</span>
                            <span>{modelMetrics.claudeSonnet.usage}%</span>
                          </div>
                          <Progress value={modelMetrics.claudeSonnet.usage} className="h-2" />
                        </div>
                         <div>
                           <div className="flex justify-between text-sm mb-2">
                             <span>Response Quality</span>
                             <span>High</span>
                           </div>
                           <Progress value={95} className="h-2" />
                         </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Effectiveness</span>
                            <span>{modelMetrics.claudeSonnet.effectiveness}%</span>
                          </div>
                          <Progress value={modelMetrics.claudeSonnet.effectiveness} className="h-2" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Balanced performance for general therapy sessions and free users.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* GPT-4.1 */}
                  <Card className="border-2 border-harmony-300 bg-white shadow-lg">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-harmony-700">GPT-4.1</CardTitle>
                        <Badge className="bg-gradient-to-r from-harmony-500 to-harmony-600 text-white">Fallback</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Usage</span>
                            <span>{modelMetrics.gpt4.usage}%</span>
                          </div>
                          <Progress value={modelMetrics.gpt4.usage} className="h-2" />
                        </div>
                         <div>
                           <div className="flex justify-between text-sm mb-2">
                             <span>Response Quality</span>
                             <span>Good</span>
                           </div>
                           <Progress value={92} className="h-2" />
                         </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Effectiveness</span>
                            <span>{modelMetrics.gpt4.effectiveness}%</span>
                          </div>
                          <Progress value={modelMetrics.gpt4.effectiveness} className="h-2" />
                        </div>
                         <p className="text-sm text-muted-foreground">
                           Reliable backup for high availability and system redundancy.
                         </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-white rounded-xl p-6 border border-therapy-200">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Brain className="h-5 w-5 text-therapy-600" />
                    Post-Onboarding AI Actions
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-therapy-50 rounded-lg">
                      <Target className="h-8 w-8 text-therapy-600 mx-auto mb-2" />
                      <p className="font-medium">Instant Plan Creation</p>
                      <p className="text-sm text-muted-foreground">Therapy plan generated within seconds</p>
                    </div>
                    <div className="text-center p-4 bg-calm-50 rounded-lg">
                      <Activity className="h-8 w-8 text-calm-600 mx-auto mb-2" />
                      <p className="font-medium">Live Adjustments</p>
                      <p className="text-sm text-muted-foreground">Plans update after every session</p>
                    </div>
                    <div className="text-center p-4 bg-harmony-50 rounded-lg">
                      <LineChart className="h-8 w-8 text-harmony-600 mx-auto mb-2" />
                      <p className="font-medium">Session Logs</p>
                      <p className="text-sm text-muted-foreground">Detailed progress tracking</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Comprehensive Feature Showcase */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-therapy-50/50 to-calm-50/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-therapy-600 via-calm-600 to-harmony-600 bg-clip-text text-transparent">
                  Advanced Adaptive Features
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Discover how our sophisticated AI systems work together to create the most personalized therapy experience possible.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Adaptive Therapy Service */}
              <Card className="therapy-gradient-border bg-white shadow-therapy-glow">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 therapy-gradient-bg rounded-2xl flex items-center justify-center shadow-therapy-glow">
                      <Brain className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Adaptive Therapy Service</CardTitle>
                      <p className="text-muted-foreground">Dynamic therapy plan optimization</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-lg leading-relaxed">
                    Our AI continuously analyzes your session effectiveness, emotional patterns, and therapeutic progress to automatically update your treatment plan in real-time.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-therapy-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Dynamic Approach Selection</h4>
                        <p className="text-sm text-muted-foreground">Automatically switches between CBT, DBT, mindfulness, and trauma-informed approaches</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-therapy-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Effectiveness Tracking</h4>
                        <p className="text-sm text-muted-foreground">Monitors therapy outcomes and adjusts techniques based on what works best for you</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-therapy-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Predictive Recommendations</h4>
                        <p className="text-sm text-muted-foreground">Anticipates your therapeutic needs and suggests proactive interventions</p>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => toggleDemo('therapy')}
                    variant="outline" 
                    className="w-full therapy-gradient-border hover:bg-therapy-50"
                  >
                    {activeDemo === 'therapy' ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                    {activeDemo === 'therapy' ? 'Pause Demo' : 'View Therapy Adaptation Demo'}
                  </Button>
                </CardContent>
              </Card>

              {/* Smart Therapy Service */}
              <Card className="bg-gradient-to-br from-calm-50 to-harmony-50 border-calm-200 shadow-calm-glow">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-calm-500 to-harmony-500 rounded-2xl flex items-center justify-center shadow-calm-glow">
                      <Lightbulb className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Smart Therapy Service</CardTitle>
                      <p className="text-muted-foreground">Intelligent intake and assessment</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-lg leading-relaxed">
                    Advanced AI analysis of your intake data to determine risk levels, recommend therapeutic approaches, and optimize session planning from day one.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-calm-200">
                      <h4 className="font-semibold text-calm-700 mb-2">Risk Assessment</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Confidence</span>
                          <span className="font-medium">85%</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-calm-200">
                      <h4 className="font-semibold text-calm-700 mb-2">Approach Match</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>CBT Suitability</span>
                          <span className="font-medium">92%</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-calm-600" />
                      <span className="text-sm">Recommended: CBT + Mindfulness</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-calm-600" />
                      <span className="text-sm">Session Frequency: Twice weekly</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-calm-600" />
                      <span className="text-sm">Focus Areas: Anxiety, Stress Reduction</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Subscription-Based Intelligence */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-harmony-600 via-balance-600 to-flow-600 bg-clip-text text-transparent">
                  Subscription-Aware Intelligence
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Our AI automatically optimizes your experience based on your subscription tier, providing the best possible service within your plan.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Free Tier */}
              <Card className="border-2 border-muted-foreground/20 bg-white">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-xl">Free Tier</CardTitle>
                  <p className="text-muted-foreground">Claude 4 Sonnet</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">50 sessions per month</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Basic adaptability</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Core therapy approaches</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Simple complexity tasks</span>
                    </div>
                  </div>
                  <div className="bg-muted-foreground/5 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground text-center">
                      Perfect for getting started with adaptive AI therapy
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Premium Tier */}
              <Card className="border-2 border-therapy-300 bg-gradient-to-br from-therapy-50 to-white shadow-therapy-glow scale-105">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 therapy-gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-therapy-glow">
                    <Crown className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl therapy-text-gradient">Premium Tier</CardTitle>
                  <p className="text-therapy-600 font-medium">Claude 4 Opus</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-therapy-600" />
                      <span className="text-sm">Unlimited sessions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-therapy-600" />
                      <span className="text-sm">Advanced adaptability</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-therapy-600" />
                      <span className="text-sm">Cultural adaptation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-therapy-600" />
                      <span className="text-sm">Complex analysis</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-therapy-600" />
                      <span className="text-sm">Crisis prioritization</span>
                    </div>
                  </div>
                  <div className="bg-therapy-100 p-3 rounded-lg">
                    <p className="text-xs text-therapy-700 text-center font-medium">
                      Most advanced AI for optimal outcomes
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Professional Tier */}
              <Card className="border-2 border-harmony-300 bg-gradient-to-br from-harmony-50 to-white shadow-lg">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-harmony-500 to-balance-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-harmony-700">Professional</CardTitle>
                  <p className="text-harmony-600 font-medium">Claude 4 Opus</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-harmony-600" />
                      <span className="text-sm">Advanced features</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-harmony-600" />
                      <span className="text-sm">Enhanced analytics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-harmony-600" />
                      <span className="text-sm">Progress insights</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-harmony-600" />
                      <span className="text-sm">Priority support</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-harmony-600" />
                      <span className="text-sm">Specialized tools</span>
                    </div>
                  </div>
                  <div className="bg-harmony-100 p-3 rounded-lg">
                    <p className="text-xs text-harmony-700 text-center font-medium">
                      Maximum AI intelligence for comprehensive care
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Advanced Analytics Dashboard */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-muted/30 to-therapy-50/20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-balance-600 via-flow-600 to-therapy-600 bg-clip-text text-transparent">
                  Real-Time Analytics
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Monitor how our adaptive systems optimize your therapy experience with comprehensive performance insights.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Performance Metrics */}
              <Card className="bg-white border border-balance-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <LineChart className="h-6 w-6 text-balance-600" />
                    Adaptation Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Model Selection Accuracy</span>
                        <span className="text-sm font-bold text-balance-600">96.8%</span>
                      </div>
                      <Progress value={96.8} className="h-3" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Therapy Plan Optimization</span>
                        <span className="text-sm font-bold text-therapy-600">94.2%</span>
                      </div>
                      <Progress value={94.2} className="h-3" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">User Satisfaction</span>
                        <span className="text-sm font-bold text-calm-600">98.1%</span>
                      </div>
                      <Progress value={98.1} className="h-3" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Cost Optimization</span>
                        <span className="text-sm font-bold text-harmony-600">89.5%</span>
                      </div>
                      <Progress value={89.5} className="h-3" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-therapy-600">2.3s</p>
                      <p className="text-xs text-muted-foreground">Avg Response Time</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-calm-600">99.9%</p>
                      <p className="text-xs text-muted-foreground">Uptime</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Session Progress Tracking */}
              <Card className="bg-white border border-flow-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <PieChart className="h-6 w-6 text-flow-600" />
                    Live Plan Adjustments & Session Logs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-therapy-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-therapy-700">Plan Updates</h4>
                        <p className="text-sm text-muted-foreground">Real-time therapy plan adjustments</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-therapy-600">Live</p>
                        <p className="text-xs text-muted-foreground">After each session</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-calm-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-calm-700">Session Logs</h4>
                        <p className="text-sm text-muted-foreground">Detailed progress tracking</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-calm-600">Auto</p>
                        <p className="text-xs text-muted-foreground">Generated</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-harmony-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-harmony-700">Progress Insights</h4>
                        <p className="text-sm text-muted-foreground">AI-driven improvement analysis</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-harmony-600">97.8%</p>
                        <p className="text-xs text-muted-foreground">Accuracy</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-flow-50 to-balance-50 p-4 rounded-lg border border-flow-200">
                    <h4 className="font-medium text-flow-700 mb-2">This Month's Progress</h4>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-xl font-bold text-flow-600">18</p>
                        <p className="text-xs text-muted-foreground">Plan Adjustments</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-balance-600">24</p>
                        <p className="text-xs text-muted-foreground">Session Logs</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Privacy & Ethics */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-therapy-600 via-calm-600 to-harmony-600 bg-clip-text text-transparent">
                  Privacy-First Adaptive Learning
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Our adaptive AI learns about you while maintaining the highest standards of privacy, security, and ethical AI practices.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center p-8 bg-gradient-to-br from-therapy-50 to-white border-therapy-200 shadow-therapy-subtle">
                <div className="w-16 h-16 therapy-gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-therapy-glow">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-therapy-700">End-to-End Encryption</h3>
                <p className="text-muted-foreground mb-6">
                  All learning data is encrypted at rest and in transit, ensuring your personal information remains completely private and secure.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-sm text-therapy-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>256-bit AES encryption</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-therapy-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Zero-knowledge architecture</span>
                  </div>
                </div>
              </Card>
              
              <Card className="text-center p-8 bg-gradient-to-br from-calm-50 to-white border-calm-200 shadow-calm-glow">
                <div className="w-16 h-16 bg-gradient-to-br from-calm-500 to-calm-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-calm-glow">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-calm-700">Federated Learning</h3>
                <p className="text-muted-foreground mb-6">
                  AI improvements happen locally on secure servers, with no personal data leaving your protected environment or being shared.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-sm text-calm-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Local model training</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-calm-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>No data sharing</span>
                  </div>
                </div>
               </Card>
               
               <Card className="text-center p-8 bg-gradient-to-br from-harmony-50 to-white border-harmony-200 shadow-lg">
                <div className="w-16 h-16 bg-gradient-to-br from-harmony-500 to-harmony-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-harmony-700">Adaptive Privacy Controls</h3>
                <p className="text-muted-foreground mb-6">
                  Intelligent privacy settings that adapt to your comfort level, with granular controls over what information is used for AI learning.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-sm text-harmony-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Personalized privacy levels</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-harmony-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Selective data sharing</span>
                  </div>
                </div>
               </Card>
               
                {/* Crisis Features & Interconnected Systems */}
               <Card className="col-span-full bg-gradient-to-br from-red-50 to-orange-50 border-red-200 shadow-lg">
                <div className="p-8">
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Shield className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-red-800 mb-4">Crisis Detection & Comprehensive Care</h3>
                    <p className="text-red-700 max-w-3xl mx-auto">
                      Our adaptive AI continuously monitors for crisis indicators while seamlessly integrating 50+ mental health approaches, cultural adaptations, and therapeutic techniques.
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="text-center bg-white p-6 rounded-lg border border-red-200">
                      <div className="text-3xl font-bold text-red-600 mb-2">50+</div>
                      <div className="text-sm text-red-700">Therapy Approaches</div>
                      <div className="text-xs text-red-600 mt-1">CBT, DBT, EMDR, & more</div>
                    </div>
                    <div className="text-center bg-white p-6 rounded-lg border border-orange-200">
                      <div className="text-3xl font-bold text-orange-600 mb-2">100+</div>
                      <div className="text-sm text-orange-700">Cultural Adaptations</div>
                      <div className="text-xs text-orange-600 mt-1">Global perspectives</div>
                    </div>
                    <div className="text-center bg-white p-6 rounded-lg border border-red-200">
                      <div className="text-3xl font-bold text-red-600 mb-2">24/7</div>
                      <div className="text-sm text-red-700">Crisis Monitoring</div>
                      <div className="text-xs text-red-600 mt-1">Real-time detection</div>
                    </div>
                    <div className="text-center bg-white p-6 rounded-lg border border-orange-200">
                      <div className="text-3xl font-bold text-orange-600 mb-2">200+</div>
                      <div className="text-sm text-orange-700">Techniques</div>
                      <div className="text-xs text-orange-600 mt-1">Interconnected systems</div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-red-800">Crisis Detection Features</h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-red-600 mt-0.5" />
                          <div>
                            <div className="font-medium text-red-800">Language Pattern Analysis</div>
                            <div className="text-sm text-red-700">Real-time monitoring of conversation for crisis indicators</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-red-600 mt-0.5" />
                          <div>
                            <div className="font-medium text-red-800">Automatic Escalation</div>
                            <div className="text-sm text-red-700">Instant connection to crisis counselors and emergency resources</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-red-600 mt-0.5" />
                          <div>
                            <div className="font-medium text-red-800">Safety Protocols</div>
                            <div className="text-sm text-red-700">Immediate safety measures and intervention strategies</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-orange-800">Interconnected Systems</h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                          <div>
                            <div className="font-medium text-orange-800">Cultural AI Integration</div>
                            <div className="text-sm text-orange-700">Adapts approaches based on cultural background and values</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                          <div>
                            <div className="font-medium text-orange-800">Multi-Modal Therapy</div>
                            <div className="text-sm text-orange-700">Seamlessly combines multiple therapeutic approaches</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                          <div>
                            <div className="font-medium text-orange-800">Holistic Care</div>
                            <div className="text-sm text-orange-700">All systems work together for comprehensive support</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
               </Card>
               
               <Card className="text-center p-8 bg-gradient-to-br from-harmony-50 to-white border-harmony-200 shadow-lg">
                <div className="w-16 h-16 bg-gradient-to-br from-harmony-500 to-harmony-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Headphones className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-harmony-700">Ethical AI Practices</h3>
                <p className="text-muted-foreground mb-6">
                  Our adaptive systems follow strict ethical guidelines to ensure fair, unbiased, and beneficial therapeutic outcomes for all users.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-sm text-harmony-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Bias detection & mitigation</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-harmony-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Transparent algorithms</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-therapy-600 via-therapy-500 to-calm-500 text-white relative overflow-hidden">
          {/* Background Animation */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-20 right-20 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse animation-delay-400"></div>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
              Ready to Experience 
              <br />
              <span className="text-white/90">Adaptive AI?</span>
            </h2>
            <p className="text-xl md:text-2xl mb-12 text-white/90 leading-relaxed">
              Join thousands of users who are already experiencing more personalized, effective therapy through our revolutionary adaptive AI systems.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-therapy-600 hover:bg-white/90 shadow-lg px-12 py-4 text-lg font-semibold group transition-all duration-300"
              >
                Start Your Adaptive Journey
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-therapy-600 px-12 py-4 text-lg font-semibold transition-all duration-300"
              >
                Schedule a Demo
              </Button>
            </div>
            
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-3xl font-bold mb-2">2.3s</p>
                <p className="text-white/80">Average Response Time</p>
              </div>
              <div>
                <p className="text-3xl font-bold mb-2">98.1%</p>
                <p className="text-white/80">User Satisfaction</p>
              </div>
              <div>
                <p className="text-3xl font-bold mb-2">47%</p>
                <p className="text-white/80">Faster Progress</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default AdaptiveSystemsPage;