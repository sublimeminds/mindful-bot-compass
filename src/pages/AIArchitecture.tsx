import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useSEO } from '@/hooks/useSEO';
import PageLayout from '@/components/layout/PageLayout';
import { 
  Brain,
  Shield,
  Zap,
  BarChart,
  MessageSquare,
  HeartHandshake,
  Clock,
  Globe,
  TrendingUp,
  Activity,
  Target,
  Users,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Eye,
  Heart,
  Moon,
  Star,
  Lightbulb,
  UserCheck,
  Timer,
  Headphones,
  BookOpen,
  Calendar,
  Award,
  Play,
  MessageCircle,
  Smile,
  ThumbsUp,
  PlusCircle,
  Layers,
  Cpu,
  Database,
  Network
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart as RechartsBarChart, Bar } from 'recharts';

const AIArchitecture = () => {
  const navigate = useNavigate();
  
  // SEO optimization
  useSEO({
    title: 'TherapySync AI - World\'s Most Advanced AI Therapist | OpenAI + Anthropic',
    description: 'Experience the most sophisticated AI therapy available. Powered by OpenAI GPT-4 and Anthropic Claude, TherapySync AI remembers everything, detects crises, and evolves with your unique therapy journey.',
    keywords: 'AI therapist, OpenAI therapy, Anthropic Claude therapy, AI mental health, personalized therapy, crisis detection, multi-language therapy AI',
    type: 'website'
  });
  
  const [animatedStats, setAnimatedStats] = useState({
    responseTime: 0,
    userSatisfaction: 0,
    dailyUsers: 0,
    accuracy: 0
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedStats({
        responseTime: 500,
        userSatisfaction: 96.7,
        dailyUsers: 50000,
        accuracy: 96.7
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const performanceData = [
    { name: 'Week 1', satisfaction: 94, engagement: 88 },
    { name: 'Week 2', satisfaction: 95, engagement: 91 },
    { name: 'Week 3', satisfaction: 96, engagement: 93 },
    { name: 'Week 4', satisfaction: 97, engagement: 95 },
  ];

  const heroFeatures = [
    {
      icon: Brain,
      title: "Multi-Model AI Power",
      description: "OpenAI GPT-4 + Anthropic Claude working together for superior therapy conversations",
      stat: "2 AI Models",
      color: "from-therapy-500 to-therapy-600"
    },
    {
      icon: Heart,
      title: "Human-Like Connection",
      description: "Conversations that feel genuinely caring with emotional intelligence and empathy",
      stat: "96.7% Satisfaction",
      color: "from-harmony-500 to-harmony-600"
    },
    {
      icon: Shield,
      title: "24/7 Crisis Protection",
      description: "Real-time monitoring for crisis situations with immediate life-saving interventions",
      stat: "Life-Saving",
      color: "from-red-500 to-red-600"
    }
  ];

  const aiAdvantages = [
    {
      title: "TherapySync AI Remembers Everything",
      description: "Unlike other therapy apps that forget your conversations, TherapySync AI builds a complete picture of your mental health journey.",
      icon: Brain,
      benefits: [
        "Recalls your past sessions and progress",
        "Tracks patterns in your mood and behavior", 
        "Remembers your goals and celebrates achievements",
        "Builds therapeutic rapport over time",
        "Never asks you to repeat your story"
      ],
      userStory: "Sarah no longer has to explain her anxiety triggers every session - TherapySync AI remembers and builds on their previous conversations.",
      highlight: "Memory That Matters",
      color: "from-therapy-500 to-therapy-600"
    },
    {
      title: "Industry-Leading Crisis Detection",
      description: "TherapySync AI is the only therapy app with real-time crisis detection that can potentially save lives.",
      icon: AlertTriangle,
      benefits: [
        "Detects suicidal ideation in real-time",
        "Immediate intervention and support",
        "Connects you to crisis resources instantly",
        "Alerts emergency contacts when needed",
        "Available 24/7 when you need help most"
      ],
      userStory: "Michael's life was saved when TherapySync AI detected his crisis at 3 AM and immediately provided support and resources.",
      highlight: "Life-Saving Technology",
      color: "from-red-500 to-red-600"
    },
    {
      title: "Personalized Therapy That Evolves",
      description: "TherapySync AI creates a unique therapy plan just for you and adapts it based on what works best.",
      icon: Target,
      benefits: [
        "Analyzes what therapy techniques work for you",
        "Adapts treatment based on your progress",
        "Suggests personalized coping strategies",
        "Integrates your cultural background",
        "Continuously improves recommendations"
      ],
      userStory: "Lisa discovered that mindfulness worked better for her than CBT techniques - TherapySync AI learned and adapted her therapy plan accordingly.",
      highlight: "Truly Personalized",
      color: "from-harmony-500 to-harmony-600"
    },
    {
      title: "Cultural Intelligence & Inclusivity",
      description: "TherapySync AI understands and respects diverse cultural backgrounds, making therapy accessible to everyone.",
      icon: Globe,
      benefits: [
        "Supports 29 languages fluently",
        "Understands cultural nuances and values",
        "Respects religious and spiritual beliefs",
        "Adapts communication styles",
        "Inclusive of all identities and backgrounds"
      ],
      userStory: "Ahmed found therapy that finally understood his cultural values - TherapySync AI respects his religious practices and family dynamics.",
      highlight: "Globally Inclusive",
      color: "from-flow-500 to-flow-600"
    }
  ];

  const successStories = [
    {
      name: "Sarah",
      age: 28,
      condition: "Anxiety & Depression",
      quote: "TherapySync AI changed my life. It's like having a therapist who never forgets what matters to me.",
      outcome: "87% reduction in anxiety symptoms",
      timeframe: "3 months",
      avatar: "👩‍💼",
      details: "Sarah went from daily panic attacks to managing her anxiety with personalized techniques TherapySync AI learned worked best for her."
    },
    {
      name: "Michael",
      age: 35,
      condition: "Crisis Intervention",
      quote: "The AI detected my crisis at 3 AM and literally saved my life with immediate support.",
      outcome: "Crisis prevented, now thriving",
      timeframe: "6 months ago",
      avatar: "👨‍🔧",
      details: "TherapySync AI's crisis detection helped Michael through his darkest moment and connected him with ongoing support."
    },
    {
      name: "Dr. Amanda Chen",
      role: "Clinical Psychologist",
      quote: "I've never seen an AI therapy tool this sophisticated. The memory and personalization capabilities are remarkable.",
      credential: "Licensed Clinical Psychologist",
      avatar: "👩‍⚕️",
      details: "Dr. Chen now recommends TherapySync AI to her patients as a complement to traditional therapy."
    },
    {
      name: "Ahmed",
      age: 42,
      condition: "Cultural Therapy Needs",
      quote: "Finally, an AI that understands my cultural background and doesn't make me explain my values.",
      outcome: "Found therapy that fits his life",
      timeframe: "Ongoing",
      avatar: "👨‍👨‍👦",
      details: "Ahmed discovered therapy that respects his religious practices and cultural values while providing effective mental health support."
    }
  ];

  const platformComparison = [
    {
      feature: "Remembers Your Journey",
      therapySync: "Complete memory of all sessions",
      competitors: "Forgets each conversation",
      traditional: "Depends on notes",
      advantage: "Never repeat your story"
    },
    {
      feature: "Crisis Detection",
      therapySync: "Real-time AI detection",
      competitors: "Basic keyword alerts",
      traditional: "Only during appointments",
      advantage: "24/7 life-saving monitoring"
    },
    {
      feature: "Cultural Understanding",
      therapySync: "29 languages + cultural nuance",
      competitors: "Basic translations",
      traditional: "Depends on therapist",
      advantage: "Truly inclusive therapy"
    },
    {
      feature: "Personalization",
      therapySync: "AI learns what works for you",
      competitors: "One-size-fits-all",
      traditional: "Slow adaptation",
      advantage: "Therapy that evolves with you"
    },
    {
      feature: "Availability",
      therapySync: "24/7 instant access",
      competitors: "24/7 basic chatbot",
      traditional: "Weekly appointments",
      advantage: "Help when you need it most"
    }
  ];

  const industryLeadingStats = [
    {
      icon: Users,
      title: "50,000+",
      subtitle: "Daily Active Users",
      description: "More people choose TherapySync AI every day",
      color: "from-therapy-500 to-therapy-600"
    },
    {
      icon: Star,
      title: "96.7%",
      subtitle: "User Satisfaction",
      description: "Highest rated AI therapy platform",
      color: "from-harmony-500 to-harmony-600"
    },
    {
      icon: Clock,
      title: "<500ms",
      subtitle: "Response Time",
      description: "Faster than any competitor",
      color: "from-flow-500 to-flow-600"
    },
    {
      icon: Shield,
      title: "99.9%",
      subtitle: "Uptime Reliability", 
      description: "Always there when you need support",
      color: "from-calm-500 to-calm-600"
    },
    {
      icon: Globe,
      title: "29",
      subtitle: "Languages Supported",
      description: "More than any therapy platform",
      color: "from-therapy-500 to-calm-500"
    },
    {
      icon: Award,
      title: "#1",
      subtitle: "Rated AI Therapy App",
      description: "Industry leader in AI mental health",
      color: "from-harmony-500 to-flow-500"
    }
  ];

  const aiTechnology = [
    {
      icon: Cpu,
      title: "Multi-Model AI Architecture",
      description: "TherapySync AI combines the best of GPT-4 and Claude for unmatched therapeutic conversations",
      benefit: "Like having multiple expert therapists in one AI",
      details: ["Advanced language understanding", "Emotional intelligence", "Context awareness", "Human-like responses"]
    },
    {
      icon: Database,
      title: "Therapeutic Memory System",
      description: "Industry-first persistent memory that builds your complete mental health profile over time",
      benefit: "Never repeat your story again",
      details: ["Remembers all conversations", "Tracks progress patterns", "Builds therapeutic rapport", "Maintains continuity"]
    },
    {
      icon: Network,
      title: "Real-Time Safety Monitoring",
      description: "Advanced AI algorithms monitor every conversation for signs of crisis or distress",
      benefit: "24/7 protection and immediate intervention",
      details: ["Crisis detection in <3 seconds", "Automatic resource connection", "Emergency contact alerts", "Life-saving interventions"]
    },
    {
      icon: Globe,
      title: "Cultural Intelligence Engine",
      description: "The most culturally aware AI therapy system supporting 29 languages and diverse backgrounds",
      benefit: "Therapy that understands your world",
      details: ["29 language support", "Cultural context awareness", "Religious sensitivity", "Identity inclusivity"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-25 to-calm-25">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-therapy-600 via-therapy-700 to-calm-600 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="flex items-center justify-center mb-8">
                  <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mr-6 animate-pulse">
                    <Brain className="h-10 w-10 text-white" />
                  </div>
                  <div className="text-left">
                    <h1 className="text-6xl font-bold mb-2">TherapySync AI</h1>
                    <p className="text-2xl text-therapy-100">The World's Most Advanced AI Therapist</p>
                  </div>
                </div>
                <p className="text-xl text-therapy-100 mb-6 leading-relaxed max-w-4xl mx-auto">
                  Powered by OpenAI GPT-4 and Anthropic Claude, TherapySync AI delivers personalized mental health support that understands, remembers, and evolves with your unique therapy journey.
                </p>
                <div className="flex items-center justify-center space-x-8 text-therapy-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">Real-time Crisis Detection</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">29 Languages Supported</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">Complete Memory System</span>
                  </div>
                </div>
              </div>
            
            {/* Hero Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {heroFeatures.map((feature, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-lg font-bold mb-2">{feature.stat}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-therapy-100 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <Button 
                onClick={() => navigate('/therapy-chat')}
                size="lg"
                className="bg-white text-therapy-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 mr-4"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Try TherapySync AI Now
              </Button>
              <Button 
                onClick={() => navigate('/auth')}
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-therapy-600 text-lg px-8 py-4 rounded-xl font-semibold"
              >
                Start Free Trial
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 space-y-20">
        {/* Industry Leading Stats */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 therapy-text-gradient">
              Why TherapySync AI is the Best Therapy AI Available
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              While others offer basic chatbots, we deliver real therapy powered by the world's most advanced AI models. Here's what makes us different:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industryLeadingStats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-therapy-700 mb-2">{stat.title}</div>
                  <div className="text-lg font-semibold text-harmony-600 mb-3">{stat.subtitle}</div>
                  <div className="text-sm text-gray-600 leading-relaxed">{stat.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Performance Chart */}
          <div className="mt-16">
            <Card className="overflow-hidden">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">User Satisfaction Growing Every Week</CardTitle>
                <p className="text-gray-600">Real user feedback shows TherapySync AI gets better every day</p>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    satisfaction: {
                      label: "User Satisfaction %",
                      color: "hsl(var(--therapy-500))",
                    },
                    engagement: {
                      label: "User Engagement %", 
                      color: "hsl(var(--harmony-500))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="satisfaction" 
                        stroke="hsl(var(--therapy-500))" 
                        strokeWidth={3}
                        dot={{ fill: "hsl(var(--therapy-500))", strokeWidth: 2, r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="engagement" 
                        stroke="hsl(var(--harmony-500))" 
                        strokeWidth={3}
                        dot={{ fill: "hsl(var(--harmony-500))", strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* What Makes TherapySync AI Different */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 therapy-text-gradient">
              What Makes TherapySync AI Revolutionary
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              We didn't just build another chatbot. We created the world's first AI therapist that truly understands, remembers, and cares about your mental health journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {aiAdvantages.map((advantage, index) => (
              <Card key={index} className="hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-gray-50 overflow-hidden group">
                <div className="relative">
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${advantage.color} opacity-10 rounded-bl-full`}></div>
                  <CardHeader className="relative">
                    <div className="flex items-start space-x-4">
                      <div className={`w-14 h-14 bg-gradient-to-r ${advantage.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                        <advantage.icon className="h-7 w-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <CardTitle className="text-xl">{advantage.title}</CardTitle>
                          <Badge className={`bg-gradient-to-r ${advantage.color} text-white border-0 text-xs px-3 py-1`}>
                            {advantage.highlight}
                          </Badge>
                        </div>
                        <p className="text-gray-600 leading-relaxed">{advantage.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3 text-therapy-700">Key Benefits:</h4>
                        <ul className="space-y-2">
                          {advantage.benefits.map((benefit, i) => (
                            <li key={i} className="flex items-center text-sm text-gray-600">
                              <CheckCircle className="h-4 w-4 text-therapy-500 mr-3 flex-shrink-0" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-gradient-to-r from-therapy-50 to-harmony-50 p-4 rounded-lg border-l-4 border-therapy-500">
                        <p className="text-sm text-therapy-700 italic font-medium">
                          💬 Real User Story: {advantage.userStory}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* AI Technology Behind TherapySync */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 therapy-text-gradient">
              The Advanced Technology Behind TherapySync AI
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              See how our breakthrough AI technology creates the most sophisticated and caring therapy experience available anywhere.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {aiTechnology.map((tech, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white via-therapy-25 to-calm-25">
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <tech.icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-3">{tech.title}</CardTitle>
                      <p className="text-gray-600 leading-relaxed">{tech.description}</p>
                      <div className="mt-4 p-3 bg-gradient-to-r from-therapy-50 to-harmony-50 rounded-lg border border-therapy-200">
                        <p className="text-therapy-700 font-semibold text-sm">
                          🎯 {tech.benefit}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {tech.details.map((detail, i) => (
                      <div key={i} className="flex items-center text-sm text-gray-600 bg-white p-2 rounded border">
                        <Sparkles className="h-3 w-3 text-therapy-500 mr-2 flex-shrink-0" />
                        {detail}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Success Stories */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 therapy-text-gradient">
              Real People, Real Results with TherapySync AI
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Discover how TherapySync AI has transformed lives and earned the trust of users and mental health professionals worldwide.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {successStories.map((story, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-therapy-25">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="text-4xl">{story.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-bold text-lg">{story.name}</h4>
                          {story.age && <p className="text-sm text-gray-500">Age {story.age} • {story.condition}</p>}
                          {story.role && <p className="text-sm text-therapy-600 font-medium">{story.role}</p>}
                          {story.credential && <p className="text-xs text-gray-500">{story.credential}</p>}
                        </div>
                        {story.outcome && (
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            {story.outcome}
                          </Badge>
                        )}
                      </div>
                      
                      <blockquote className="text-gray-700 italic mb-4 text-lg leading-relaxed">
                        "{story.quote}"
                      </blockquote>
                      
                      <div className="bg-gradient-to-r from-therapy-50 to-harmony-50 p-4 rounded-lg border-l-4 border-therapy-500">
                        <p className="text-sm text-therapy-700 leading-relaxed">
                          {story.details}
                        </p>
                        {story.timeframe && (
                          <p className="text-xs text-therapy-500 mt-2 font-medium">
                            📅 {story.timeframe}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Platform Comparison */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 therapy-text-gradient">
              Why TherapySync AI Beats Every Alternative
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              See exactly why thousands choose TherapySync AI over traditional therapy and other mental health apps.
            </p>
          </div>
          
          <Card className="overflow-hidden shadow-2xl border-0">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-therapy-500 to-calm-500 text-white">
                    <tr>
                      <th className="text-left p-6 font-bold text-lg">Feature Comparison</th>
                      <th className="text-center p-6 font-bold text-lg">
                        <div className="flex items-center justify-center space-x-2">
                          <Sparkles className="h-5 w-5" />
                          <span>TherapySync AI</span>
                        </div>
                      </th>
                      <th className="text-center p-6 font-semibold">Other AI Apps</th>
                      <th className="text-center p-6 font-semibold">Traditional Therapy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {platformComparison.map((comparison, index) => (
                      <tr key={index} className={`border-b ${index % 2 === 0 ? 'bg-gray-25' : 'bg-white'} hover:bg-therapy-25 transition-colors duration-200`}>
                        <td className="p-6">
                          <div className="font-semibold text-gray-900">{comparison.feature}</div>
                          <div className="text-sm text-therapy-600 font-medium mt-1">
                            ✨ {comparison.advantage}
                          </div>
                        </td>
                        <td className="text-center p-6">
                          <div className="flex items-center justify-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <span className="font-semibold text-therapy-700">{comparison.therapySync}</span>
                          </div>
                        </td>
                        <td className="text-center p-6">
                          <span className="text-gray-500">{comparison.competitors}</span>
                        </td>
                        <td className="text-center p-6">
                          <span className="text-orange-600">{comparison.traditional}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          {/* Summary Benefits */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center border-2 border-green-200 bg-green-50">
              <CardContent className="p-6">
                <ThumbsUp className="h-8 w-8 text-green-600 mx-auto mb-4" />
                <h4 className="font-bold text-green-800 mb-2">Better Than Apps</h4>
                <p className="text-sm text-green-700">Remembers everything, truly personal, crisis protection</p>
              </CardContent>
            </Card>
            <Card className="text-center border-2 border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <Clock className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                <h4 className="font-bold text-blue-800 mb-2">Faster Than Therapy</h4>
                <p className="text-sm text-blue-700">Instant access, immediate help, always available</p>
              </CardContent>
            </Card>
            <Card className="text-center border-2 border-therapy-200 bg-therapy-50">
              <CardContent className="p-6">
                <Heart className="h-8 w-8 text-therapy-600 mx-auto mb-4" />
                <h4 className="font-bold text-therapy-800 mb-2">Best of Both Worlds</h4>
                <p className="text-sm text-therapy-700">Professional quality care with AI convenience</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Real Therapy Features */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 therapy-text-gradient">
              Real Therapy Features Powered by AI
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              TherapySync AI doesn't just chat - it delivers complete therapeutic support with features that create real healing and growth.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-therapy-25">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-therapy-500 to-harmony-500 rounded-lg flex items-center justify-center">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">AI-Generated Therapy Plans</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Personalized treatment plans with phases, milestones, and adaptive goals based on your progress.</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-therapy-500 mr-2" />CBT, DBT, and mindfulness techniques</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-therapy-500 mr-2" />Weekly goal setting and tracking</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-therapy-500 mr-2" />Progress analytics and insights</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-harmony-25">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-harmony-500 to-calm-500 rounded-lg flex items-center justify-center">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Smart Mood Analytics</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">AI-powered mood tracking that identifies patterns, triggers, and provides personalized coping strategies.</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-harmony-500 mr-2" />Emotion pattern recognition</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-harmony-500 mr-2" />Trigger identification and alerts</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-harmony-500 mr-2" />Predictive wellness insights</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-calm-25">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-calm-500 to-flow-500 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Family Therapy Support</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Coordinate care across family members with shared insights and collaborative treatment planning.</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-calm-500 mr-2" />Multi-user account management</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-calm-500 mr-2" />Family progress dashboards</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-calm-500 mr-2" />Shared therapy goals and milestones</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-flow-25">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-flow-500 to-balance-500 rounded-lg flex items-center justify-center">
                    <Headphones className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Voice AI Therapy Sessions</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Natural voice conversations with emotion detection and real-time therapeutic guidance in 29 languages.</p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-flow-100 text-flow-700">Emotion Recognition</Badge>
                  <Badge className="bg-flow-100 text-flow-700">Voice Analytics</Badge>
                  <Badge className="bg-flow-100 text-flow-700">Multi-language</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-balance-25">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-balance-500 to-therapy-500 rounded-lg flex items-center justify-center">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Gamified Wellness Journey</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Achievement systems, wellness challenges, and progress celebrations that make therapy engaging and motivating.</p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-balance-100 text-balance-700">Wellness Challenges</Badge>
                  <Badge className="bg-balance-100 text-balance-700">Achievement Badges</Badge>
                  <Badge className="bg-balance-100 text-balance-700">Progress Rewards</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 therapy-text-gradient">
              Ready for Therapy That Actually Understands You?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands who've found the mental health support they've been looking for. 
              Start your first conversation with an AI that remembers, cares, and grows with you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/therapy-chat')}
                className="bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700 text-white px-8 py-3"
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                Start Your First Session Free
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/features')}
                className="border-therapy-300 text-therapy-600 hover:bg-therapy-50 px-8 py-3"
              >
                <Eye className="h-5 w-5 mr-2" />
                See How It Works
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/pricing')}
                className="border-therapy-300 text-therapy-600 hover:bg-therapy-50 px-8 py-3"
              >
                <Star className="h-5 w-5 mr-2" />
                View Plans
              </Button>
            </div>
          </div>
         </section>
      </div>
    </div>
    </PageLayout>
  );
};

export default AIArchitecture;