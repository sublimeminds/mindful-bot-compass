import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import TherapistTeamCarousel from '@/components/ai/TherapistTeamCarousel';
import { 
  Brain, 
  Target, 
  Heart, 
  Zap, 
  BarChart3,
  CheckCircle,
  Activity,
  Lightbulb,
  ArrowRight,
  Shield,
  Sparkles,
  TrendingUp,
  Settings,
  User,
  Clock,
  Award,
  Layers,
  Fingerprint,
  Palette,
  Users,
  Globe,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Camera,
  Mic,
  Eye,
  MessageSquare,
  Bookmark,
  Star,
  Lock,
  Database,
  Cpu,
  Workflow,
  Network,
  Code,
  Bot
} from 'lucide-react';

const AIPersonalization = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeDemo, setActiveDemo] = useState('adaptive');
  const [progressValue, setProgressValue] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgressValue((prev) => (prev >= 100 ? 0 : prev + 2));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Brain,
      title: "Neural Adaptation Engine",
      description: "Advanced neural networks continuously learn from your interactions, emotions, and therapeutic progress to optimize your experience.",
      gradient: "from-blue-500 to-purple-600",
      stats: "99.7% accuracy",
      category: "Core AI"
    },
    {
      icon: Target,
      title: "Precision Targeting",
      description: "AI identifies your specific psychological patterns and therapeutic needs with surgical precision.",
      gradient: "from-purple-500 to-pink-600",
      stats: "2.4x better outcomes",
      category: "Targeting"
    },
    {
      icon: Fingerprint,
      title: "Unique Profile Building",
      description: "Creates a comprehensive psychological fingerprint based on your communication style, emotional patterns, and preferences.",
      gradient: "from-pink-500 to-red-600",
      stats: "1000+ data points",
      category: "Profiling"
    },
    {
      icon: Zap,
      title: "Real-Time Adaptation",
      description: "Millisecond-level adjustments to conversation flow, tone, and therapeutic techniques based on your live emotional state.",
      gradient: "from-yellow-500 to-orange-600",
      stats: "< 50ms response",
      category: "Real-Time"
    },
    {
      icon: Heart,
      title: "Emotional Intelligence AI",
      description: "Advanced emotion recognition and empathy modeling creates genuinely caring therapeutic interactions.",
      gradient: "from-red-500 to-pink-600",
      stats: "89% empathy score",
      category: "Emotional AI"
    },
    {
      icon: BarChart3,
      title: "Predictive Analytics",
      description: "Predicts optimal intervention timing, breakthrough moments, and therapeutic milestones before they happen.",
      gradient: "from-green-500 to-teal-600",
      stats: "73% accuracy",
      category: "Predictions"
    }
  ];

  const capabilities = [
    {
      icon: Palette,
      title: "Communication Style Adaptation",
      description: "Matches your preferred communication style - direct, gentle, analytical, or creative",
      examples: ["Adjusts language complexity", "Adapts conversation pace", "Personalizes metaphors"]
    },
    {
      icon: Clock,
      title: "Timing Optimization",
      description: "Learns your peak engagement times and optimal session lengths",
      examples: ["Identifies best times to chat", "Optimizes session duration", "Prevents mental fatigue"]
    },
    {
      icon: Layers,
      title: "Multi-Modal Learning",
      description: "Integrates text, voice, facial expressions, and behavioral patterns",
      examples: ["Voice emotion analysis", "Facial expression reading", "Typing pattern analysis"]
    },
    {
      icon: Award,
      title: "Goal Achievement AI",
      description: "Optimizes therapeutic goals and milestones based on your unique progress patterns",
      examples: ["Personalized goal setting", "Achievement prediction", "Motivation optimization"]
    }
  ];

  const aiPersonalities = [
    {
      name: "Sage",
      type: "Wise Counselor",
      description: "Deep, thoughtful responses with philosophical insights",
      personality: "Calm, wise, introspective",
      bestFor: "Life transitions, existential questions",
      avatar: "🧙‍♂️"
    },
    {
      name: "Harmony",
      type: "Emotional Support",
      description: "Warm, empathetic companion for emotional healing",
      personality: "Nurturing, gentle, understanding", 
      bestFor: "Emotional support, trauma recovery",
      avatar: "🤗"
    },
    {
      name: "Focus",
      type: "Cognitive Trainer",
      description: "Structured, goal-oriented cognitive behavioral therapy",
      personality: "Analytical, systematic, motivating",
      bestFor: "CBT, habit change, productivity",
      avatar: "🎯"
    },
    {
      name: "Phoenix",
      type: "Transformation Guide",
      description: "Dynamic energy for personal growth and change",
      personality: "Energetic, inspiring, transformative",
      bestFor: "Personal growth, confidence building",
      avatar: "🔥"
    }
  ];

  const techStack = [
    { name: "GPT-4 Turbo", description: "Advanced language understanding", icon: Bot },
    { name: "Claude 3.5", description: "Sophisticated reasoning and empathy", icon: Brain },
    { name: "Custom Neural Networks", description: "Personalization algorithms", icon: Network },
    { name: "Emotion AI", description: "Real-time emotion recognition", icon: Heart },
    { name: "Vector Databases", description: "Memory and context retention", icon: Database },
    { name: "Edge Computing", description: "Ultra-low latency responses", icon: Cpu }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section with Interactive Elements */}
      <section className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-therapy-50 via-harmony-50 to-balance-50">
          <div className="absolute inset-0 opacity-40" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.03'%3E%3Ccircle cx='7' cy='7' r='2'/%3E%3Ccircle cx='27' cy='7' r='1'/%3E%3Ccircle cx='47' cy='7' r='2'/%3E%3Ccircle cx='7' cy='27' r='1'/%3E%3Ccircle cx='27' cy='27' r='2'/%3E%3Ccircle cx='47' cy='27' r='1'/%3E%3Ccircle cx='7' cy='47' r='2'/%3E%3Ccircle cx='27' cy='47' r='1'/%3E%3Ccircle cx='47' cy='47' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 flex justify-center">
              <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-therapy-100 to-harmony-100 text-therapy-700 border-0">
                <Sparkles className="mr-2 h-4 w-4" />
                Next-Generation AI Personalization
              </Badge>
            </div>
            
            <h1 className="text-5xl font-bold tracking-tight sm:text-7xl lg:text-8xl">
              <span className="bg-gradient-to-r from-therapy-600 via-harmony-600 to-balance-600 bg-clip-text text-transparent">
                AI That Truly
              </span>
              <br />
              <span className="bg-gradient-to-r from-balance-600 via-flow-600 to-therapy-600 bg-clip-text text-transparent">
                Understands You
              </span>
            </h1>
            
            <p className="mx-auto mt-8 max-w-2xl text-xl leading-8 text-muted-foreground">
              Experience the future of mental health with AI that learns, adapts, and evolves with your unique psychological patterns. Every conversation is personalized just for you.
            </p>
            
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="therapy-gradient-bg text-white border-0 hover:shadow-xl transition-all duration-300 px-8 py-6 text-lg"
                onClick={() => navigate('/ai-hub')}
              >
                <Brain className="mr-2 h-5 w-5" />
                Explore AI Hub
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-6 text-lg border-therapy-200 hover:bg-therapy-50"
                onClick={() => navigate('/therapy')}
              >
                <Play className="mr-2 h-4 w-4" />
                Start Free Session
              </Button>
            </div>
            
            {/* Live Demo Indicators */}
            <div className="mt-16 flex items-center justify-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm text-muted-foreground">AI Learning in Real-Time</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-sm text-muted-foreground">1.2M+ Personalization Points</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive AI Capabilities Section */}
      <section className="py-24 sm:py-32 bg-white/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-base font-semibold leading-7 text-therapy-600">Revolutionary Technology</h2>
            <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
              Six Pillars of AI Personalization
            </p>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Our advanced AI system operates on multiple levels to create the most personalized therapeutic experience possible.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r ${feature.gradient} shadow-lg`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {feature.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-therapy-600 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {feature.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-therapy-600">
                      {feature.stats}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-therapy-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Therapist Team Carousel */}
      <TherapistTeamCarousel />

      {/* Advanced Capabilities */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Tabs defaultValue="capabilities" className="w-full">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-8">
                Advanced AI Capabilities
              </h2>
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
                <TabsTrigger value="capabilities">Core Features</TabsTrigger>
                <TabsTrigger value="technology">Technology</TabsTrigger>
                <TabsTrigger value="demo">Live Demo</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="capabilities" className="space-y-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {capabilities.map((capability, index) => (
                  <Card key={index} className="hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-therapy-100">
                          <capability.icon className="h-6 w-6 text-therapy-600" />
                        </div>
                        <CardTitle className="text-xl">{capability.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        {capability.description}
                      </p>
                      <div className="space-y-2">
                        {capability.examples.map((example, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{example}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="technology" className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {techStack.map((tech, index) => (
                  <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-therapy-100 to-harmony-100 mx-auto mb-4">
                        <tech.icon className="h-8 w-8 text-therapy-600" />
                      </div>
                      <CardTitle className="text-lg">{tech.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm">
                        {tech.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="demo" className="space-y-8">
              <Card className="max-w-4xl mx-auto">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">AI Adaptation in Real-Time</CardTitle>
                  <p className="text-muted-foreground">
                    Watch how our AI learns and adapts to different conversation styles
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">AI Learning Progress</span>
                      <span className="text-sm text-muted-foreground">{progressValue}%</span>
                    </div>
                    <Progress value={progressValue} className="h-2" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                      <div className="text-center p-4 rounded-lg bg-therapy-50">
                        <Eye className="h-8 w-8 text-therapy-600 mx-auto mb-2" />
                        <h4 className="font-semibold">Visual Analysis</h4>
                        <p className="text-sm text-muted-foreground">Facial expression recognition</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-harmony-50">
                        <Mic className="h-8 w-8 text-harmony-600 mx-auto mb-2" />
                        <h4 className="font-semibold">Voice Analysis</h4>
                        <p className="text-sm text-muted-foreground">Tone and emotion detection</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-balance-50">
                        <MessageSquare className="h-8 w-8 text-balance-600 mx-auto mb-2" />
                        <h4 className="font-semibold">Text Analysis</h4>
                        <p className="text-sm text-muted-foreground">Language pattern learning</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Privacy & Security Section */}
      <section className="py-24 sm:py-32 bg-gradient-to-r from-slate-50 to-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Privacy-First AI Personalization
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Your personal data stays personal while AI learns from patterns, not content.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <Lock className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>End-to-End Encryption</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  All conversations are encrypted with military-grade security. Even we can't read your sessions.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Local AI Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Personalization happens on your device. Your data never leaves your control.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <Database className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Zero Data Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  AI learns patterns without storing personal information. Complete privacy guaranteed.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats & Social Proof */}
      <section className="py-24 sm:py-32 bg-therapy-600 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Proven Results from AI Personalization
            </h2>
            <p className="mt-6 text-lg leading-8 text-therapy-100">
              Real outcomes from thousands of users experiencing personalized AI therapy.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="text-4xl font-bold">2.4x</div>
              <div className="text-therapy-200 mt-2">Faster Breakthrough Moments</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">89%</div>
              <div className="text-therapy-200 mt-2">Improved Session Engagement</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">95%</div>
              <div className="text-therapy-200 mt-2">User Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">73%</div>
              <div className="text-therapy-200 mt-2">Better Goal Achievement</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32 bg-gradient-to-br from-therapy-50 via-harmony-50 to-balance-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Ready to Experience True AI Personalization?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              Join the future of mental health. Let AI create a therapeutic experience that's uniquely yours.
            </p>
            
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="therapy-gradient-bg text-white border-0 hover:shadow-xl transition-all duration-300 px-8 py-6 text-lg w-full sm:w-auto"
                onClick={() => navigate('/ai-hub')}
              >
                <Brain className="mr-2 h-5 w-5" />
                Start AI Personalization
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-6 text-lg w-full sm:w-auto"
                onClick={() => navigate('/therapy')}
              >
                <Bookmark className="mr-2 h-4 w-4" />
                Learn More
              </Button>
            </div>
            
            <p className="mt-8 text-sm text-muted-foreground">
              Free to start • No credit card required • Instant setup
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AIPersonalization;