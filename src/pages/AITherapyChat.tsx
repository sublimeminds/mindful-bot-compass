import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import TherapistTeamCarousel from '@/components/ai/TherapistTeamCarousel';
import WorkingVoiceChat from '@/components/voice/WorkingVoiceChat';
import { 
  MessageSquare, 
  Heart, 
  Users, 
  Shield, 
  Clock, 
  Star,
  Brain,
  Sparkles,
  ArrowRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Headphones,
  Monitor,
  Smartphone,
  Globe,
  Lock,
  Zap,
  TrendingUp,
  Activity,
  Award,
  CheckCircle,
  Eye,
  EyeOff,
  Settings,
  BarChart3,
  Target,
  Lightbulb,
  Fingerprint,
  Database,
  Cpu,
  Network,
  Code,
  Bot,
  MessageCircle,
  Layers,
  PenTool,
  Palette,
  ChevronRight,
  Timer,
  Calendar,
  BookOpen,
  FileText,
  Mic2,
  Camera,
  Gauge,
  Waves,
  Radio,
  PhoneCall
} from 'lucide-react';

const AITherapyChat = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeDemo, setActiveDemo] = useState('text');
  const [isPlaying, setIsPlaying] = useState(false);
  const [chatProgress, setChatProgress] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setChatProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const therapyModalities = [
    {
      id: 'cbt',
      name: 'Cognitive Behavioral Therapy',
      description: 'Identify and change negative thought patterns and behaviors',
      icon: Brain,
      color: 'from-blue-500 to-cyan-500',
      techniques: ['Thought Challenging', 'Behavioral Activation', 'Exposure Therapy'],
      effectiveness: '92%'
    },
    {
      id: 'dbt',
      name: 'Dialectical Behavior Therapy',
      description: 'Build skills for emotional regulation and interpersonal effectiveness',
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
      techniques: ['Mindfulness', 'Distress Tolerance', 'Emotion Regulation'],
      effectiveness: '88%'
    },
    {
      id: 'mindfulness',
      name: 'Mindfulness-Based Therapy',
      description: 'Develop present-moment awareness and acceptance',
      icon: Lightbulb,
      color: 'from-green-500 to-emerald-500',
      techniques: ['Meditation', 'Body Scanning', 'Breathing Exercises'],
      effectiveness: '85%'
    },
    {
      id: 'solution-focused',
      name: 'Solution-Focused Therapy',
      description: 'Focus on strengths and solutions rather than problems',
      icon: Target,
      color: 'from-orange-500 to-amber-500',
      techniques: ['Goal Setting', 'Scaling Questions', 'Exception Finding'],
      effectiveness: '90%'
    }
  ];

  const chatFeatures = [
    {
      icon: MessageSquare,
      title: "Intelligent Conversations",
      description: "Advanced AI understands context, emotions, and therapeutic goals",
      gradient: "from-blue-500 to-purple-600",
      stats: "98% accuracy",
      category: "Core AI"
    },
    {
      icon: Mic2,
      title: "Voice Therapy Sessions",
      description: "Natural speech recognition and voice-to-voice conversations",
      gradient: "from-purple-500 to-pink-600",
      stats: "Real-time processing",
      category: "Audio"
    },
    {
      icon: Video,
      title: "Visual Avatar Therapy",
      description: "Lifelike AI therapist avatars with facial expressions and gestures",
      gradient: "from-pink-500 to-red-600",
      stats: "3D realistic avatars",
      category: "Visual"
    },
    {
      icon: Brain,
      title: "Emotional Intelligence",
      description: "Detects emotional states and adapts responses accordingly",
      gradient: "from-green-500 to-teal-600",
      stats: "95% emotion accuracy",
      category: "AI"
    },
    {
      icon: Shield,
      title: "Crisis Detection",
      description: "Automatic identification of crisis situations with appropriate interventions",
      gradient: "from-red-500 to-orange-600",
      stats: "24/7 monitoring",
      category: "Safety"
    },
    {
      icon: TrendingUp,
      title: "Progress Analytics",
      description: "Real-time insights into therapy progress and effectiveness",
      gradient: "from-yellow-500 to-orange-600",
      stats: "Live analytics",
      category: "Analytics"
    }
  ];

  const conversationTypes = [
    {
      type: "Crisis Support",
      description: "Immediate support during mental health crises",
      icon: Shield,
      color: "text-red-600",
      bgColor: "bg-red-50",
      response: "< 30 seconds"
    },
    {
      type: "Daily Check-ins",
      description: "Regular mood and wellness conversations",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      response: "Personalized"
    },
    {
      type: "Skill Building",
      description: "Interactive exercises and coping strategies",
      icon: Award,
      color: "text-green-600",
      bgColor: "bg-green-50",
      response: "Guided practice"
    },
    {
      type: "Goal Planning",
      description: "Setting and tracking therapeutic objectives",
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      response: "Action plans"
    }
  ];

  const securityFeatures = [
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description: "All conversations are encrypted with military-grade security"
    },
    {
      icon: Eye,
      title: "Privacy First",
      description: "Your data is never shared, sold, or used for advertising"
    },
    {
      icon: Database,
      title: "Secure Storage",
      description: "HIPAA-compliant data storage with multiple backups"
    },
    {
      icon: Fingerprint,
      title: "Identity Protection",
      description: "Biometric authentication and anonymous options available"
    }
  ];

  const integrationChannels = [
    { name: "Web Chat", icon: Monitor, status: "Active", users: "Primary" },
    { name: "Mobile App", icon: Smartphone, status: "Active", users: "iOS & Android" },
    { name: "Voice Calls", icon: PhoneCall, status: "Beta", users: "Voice-First" },
    { name: "SMS/Text", icon: MessageCircle, status: "Active", users: "Text Support" },
    { name: "WhatsApp", icon: MessageSquare, status: "Coming Soon", users: "Planned" },
    { name: "Smart Speakers", icon: Radio, status: "Beta", users: "Hands-Free" }
  ];

  const handleStartChat = () => {
    toast({
      title: "Starting AI Therapy Chat",
      description: "Connecting you with your AI therapist...",
    });
    // Navigate to actual chat interface
    navigate('/therapy-chat');
  };

  const handleDemoSwitch = (demo: string) => {
    setActiveDemo(demo);
    toast({
      title: `${demo} Demo Selected`,
      description: `Showing ${demo} therapy chat features`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/25 to-accent/30">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${encodeURIComponent('000000')}' fill-opacity='0.08'%3E%3Ccircle cx='30' cy='30' r='3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full mb-6">
              <MessageSquare className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">AI-Powered Therapy Chat</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground drop-shadow-sm">
              Intelligent Therapy
              <span className="block">Conversations</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-foreground/90 max-w-4xl mx-auto mb-8 leading-relaxed font-medium drop-shadow-sm">
              Experience the future of mental health support with AI-powered therapy chats that understand, 
              adapt, and respond with professional-grade therapeutic techniques.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button onClick={handleStartChat} size="lg" className="px-8 py-6 text-lg">
                <MessageSquare className="mr-2 h-5 w-5" />
                Start Therapy Chat
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-6 text-lg">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Live Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">14+</div>
                <div className="text-sm text-foreground/70">AI Therapists</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">98.5%</div>
                <div className="text-sm text-foreground/70">Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">24/7</div>
                <div className="text-sm text-foreground/70">Available</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">&lt;2s</div>
                <div className="text-sm text-foreground/70">Response</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Features Section */}
      <section className="py-24 bg-gradient-to-r from-muted/20 to-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Advanced Chat Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our AI therapy chat combines cutting-edge technology with evidence-based therapeutic approaches.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {chatFeatures.map((feature, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 bg-gradient-to-br from-card to-muted/20">
                <CardHeader>
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                  <Badge variant="secondary" className="w-fit">
                    {feature.category}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-primary">{feature.stats}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Therapy Modalities Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Evidence-Based Therapy Approaches
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our AI integrates multiple therapeutic modalities to provide comprehensive mental health support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {therapyModalities.map((modality, index) => (
              <Card key={index} className="overflow-hidden border-0 shadow-xl">
                <div className={`h-2 bg-gradient-to-r ${modality.color}`} />
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${modality.color} flex items-center justify-center`}>
                      <modality.icon className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {modality.effectiveness} effective
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{modality.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{modality.description}</p>
                  <div>
                    <h4 className="font-semibold mb-2">Key Techniques:</h4>
                    <div className="flex flex-wrap gap-2">
                      {modality.techniques.map((technique, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {technique}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-24 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Experience AI Therapy Chat
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See how our AI therapist responds to different conversation styles and needs.
            </p>
          </div>

          <Tabs value={activeDemo} onValueChange={handleDemoSwitch} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="text" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Text Chat
              </TabsTrigger>
              <TabsTrigger value="voice" className="flex items-center gap-2">
                <Mic2 className="h-4 w-4" />
                Voice Chat
              </TabsTrigger>
              <TabsTrigger value="crisis" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Crisis Support
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="space-y-4">
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Advanced Text-Based Therapy Chat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/30 rounded-lg p-6 space-y-4 max-h-96 overflow-y-auto">
                    {/* User message */}
                    <div className="flex justify-start">
                      <div className="bg-secondary/20 rounded-lg p-3 max-w-sm">
                        <p className="text-sm">I've been feeling really anxious about work lately. I can't sleep and keep overthinking everything...</p>
                      </div>
                    </div>
                    
                    {/* AI thinking indicator */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground px-3">
                      <Brain className="h-4 w-4 animate-pulse" />
                      <span>AI analyzing emotional context, stress levels, and therapeutic approach...</span>
                    </div>
                    
                    {/* AI response */}
                    <div className="flex justify-end">
                      <div className="bg-primary rounded-lg p-3 max-w-sm text-primary-foreground">
                        <p className="text-sm">I hear that work anxiety is really impacting your sleep and thoughts. That overthinking cycle can be exhausting. Let's explore this together - what specific aspects of work are triggering these anxious thoughts?</p>
                      </div>
                    </div>
                    
                    {/* Follow-up user message */}
                    <div className="flex justify-start">
                      <div className="bg-secondary/20 rounded-lg p-3 max-w-sm">
                        <p className="text-sm">It's mostly my presentation next week. I keep imagining worst-case scenarios...</p>
                      </div>
                    </div>
                    
                    {/* Advanced AI response with technique suggestion */}
                    <div className="flex justify-end">
                      <div className="bg-primary rounded-lg p-3 max-w-sm text-primary-foreground">
                        <p className="text-sm">Those "what-if" thoughts can really spiral. This sounds like catastrophic thinking - a common pattern we can work with. Let's try a grounding technique: Can you name 3 things that have gone well in previous presentations?</p>
                        <div className="mt-2 p-2 bg-primary-foreground/10 rounded text-xs">
                          <strong>CBT Technique Applied:</strong> Cognitive Restructuring
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress indicator */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Activity className="h-4 w-4" />
                      Session progress: Building coping strategies
                      <Progress value={65} className="w-24 h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="voice" className="space-y-4">
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mic2 className="h-5 w-5 text-primary" />
                    Working Voice-Enabled Therapy Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/30 rounded-lg p-6">
                    <WorkingVoiceChat 
                      onSpeakingChange={(speaking) => {
                        setIsPlaying(speaking);
                        if (speaking) {
                          toast({
                            title: "AI Therapist Speaking",
                            description: "Dr. Sarah Chen is responding to your message",
                          });
                        }
                      }}
                      onTranscriptChange={(transcript) => {
                        console.log('User said:', transcript);
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>


            <TabsContent value="crisis" className="space-y-4">
              <Card className="border-0 shadow-xl border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <Shield className="h-5 w-5" />
                    Crisis Support Mode
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-red-50 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-sm font-medium text-red-800">Crisis Detection Active</span>
                    </div>
                    <p className="text-red-700 mb-4">
                      AI immediately detects crisis language and provides appropriate interventions, 
                      including emergency resources and professional escalation when needed.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <Timer className="h-4 w-4" />
                      Response time: &lt; 30 seconds
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Conversation Types */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Tailored Conversation Types
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Different chat modes designed for various therapeutic needs and situations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {conversationTypes.map((type, index) => (
              <Card key={index} className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${type.bgColor}`}>
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 rounded-full ${type.bgColor} flex items-center justify-center mx-auto mb-4`}>
                    <type.icon className={`h-8 w-8 ${type.color}`} />
                  </div>
                  <CardTitle className="text-lg">{type.type}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground text-sm mb-4">{type.description}</p>
                  <Badge variant="outline" className="bg-white/50">
                    {type.response}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Therapist Team Integration */}
      <TherapistTeamCarousel />

      {/* Platform Integrations */}
      <section className="py-24 bg-gradient-to-r from-muted/20 to-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Multi-Platform Access
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Access AI therapy chat across all your devices and preferred communication channels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrationChannels.map((channel, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all">
                <CardHeader>
                  <channel.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle className="text-lg">{channel.name}</CardTitle>
                  <Badge 
                    variant={channel.status === 'Active' ? 'default' : channel.status === 'Beta' ? 'secondary' : 'outline'}
                    className="mx-auto"
                  >
                    {channel.status}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{channel.users}</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Privacy */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Security & Privacy First
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Your therapy conversations are protected with the highest levels of security and privacy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityFeatures.map((feature, index) => (
              <Card key={index} className="text-center border-0 bg-gradient-to-br from-card to-muted/20">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Start Your AI Therapy Journey Today
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Experience the future of mental health support with intelligent, empathetic, 
            and always-available AI therapy conversations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button onClick={handleStartChat} size="lg" variant="secondary" className="px-8 py-6 text-lg">
              <MessageSquare className="mr-2 h-5 w-5" />
              Begin Free Chat Session
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-6 text-lg border-white/20 text-white hover:bg-white/10">
              <BookOpen className="mr-2 h-5 w-5" />
              Learn More
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white/80">
            <div>
              <div className="text-2xl font-bold text-white mb-1">Free</div>
              <div className="text-sm">To start</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white mb-1">24/7</div>
              <div className="text-sm">Always available</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white mb-1">Private</div>
              <div className="text-sm">Your data secure</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white mb-1">Effective</div>
              <div className="text-sm">Evidence-based</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AITherapyChat;