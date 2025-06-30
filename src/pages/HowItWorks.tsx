
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, Heart, Target, BookOpen, BarChart3, Calendar, Users, Globe,
  Headphones, Play, Pause, Download, Star, CheckCircle, ArrowRight,
  MessageSquare, Zap, Shield, Smartphone, Clock, Volume2, Mic,
  Settings, Trophy, TrendingUp, User, Eye, Lightbulb
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSafeSEO } from '@/hooks/useSafeSEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const HowItWorks = () => {
  const navigate = useNavigate();
  const [activeAudioTab, setActiveAudioTab] = useState('podcasts');

  useSafeSEO({
    title: 'How TherapySync Works - Complete Guide to AI Therapy Platform',
    description: 'Comprehensive guide to using TherapySync for mental health support. Learn about therapy types, advanced features, audio content, and personalized AI assistance.',
    keywords: 'how therapy works, AI therapy guide, mental health platform, therapy types, mood tracking, digital notebook, meditation, therapy podcasts'
  });

  const quickStartSteps = [
    {
      number: "01",
      title: "Create Your Profile",
      description: "Complete our personalized assessment to understand your unique needs, therapy preferences, and mental health goals.",
      features: ["5-minute setup", "Privacy-focused", "Personalized matching", "Cultural preferences"],
      icon: User
    },
    {
      number: "02", 
      title: "Choose Your Therapy Path",
      description: "Select from specialized approaches including couples therapy, ADHD support, LGBTQ+ affirming care, and crisis intervention.",
      features: ["Multiple specializations", "AI-powered matching", "Cultural sensitivity", "Instant availability"],
      icon: Brain
    },
    {
      number: "03",
      title: "Start Your Journey",
      description: "Begin with personalized sessions, mood tracking, goal setting, and access to our comprehensive audio content library.",
      features: ["24/7 availability", "Voice & text options", "Progress tracking", "Audio content"],
      icon: Heart
    },
    {
      number: "04",
      title: "Track & Grow",
      description: "Monitor your progress with advanced analytics, AI insights, and personalized recommendations for continued growth.",
      features: ["Visual progress", "AI insights", "Goal achievement", "Continuous support"],
      icon: TrendingUp
    }
  ];

  const therapyTypes = [
    {
      title: "Couples & Relationship Therapy",
      description: "Strengthen relationships through communication skills, conflict resolution, and intimacy building.",
      icon: Heart,
      color: "from-rose-500 to-pink-500",
      features: [
        "Communication enhancement exercises",
        "Conflict resolution frameworks",
        "Intimacy and connection building",
        "Trust rebuilding strategies",
        "Individual and joint sessions",
        "Relationship goal setting"
      ],
      audioContent: ["Communication Skills Podcast", "Relationship Meditations", "Conflict Resolution Guides"]
    },
    {
      title: "ADHD & Neurodivergent Support",
      description: "Specialized support for executive function, focus, organization, and emotional regulation.",
      icon: Target,
      color: "from-blue-500 to-indigo-500",
      features: [
        "Executive function coaching",
        "Focus and attention strategies",
        "Organization and time management",
        "Emotional regulation techniques",
        "Sensory processing support",
        "Workplace accommodation guidance"
      ],
      audioContent: ["ADHD Focus Techniques", "Executive Function Podcasts", "Calming Soundscapes"]
    },
    {
      title: "LGBTQ+ Affirming Therapy",
      description: "Inclusive, affirming support for identity exploration, coming out, and community connection.",
      icon: Users,
      color: "from-purple-500 to-violet-500",
      features: [
        "Identity exploration and affirmation",
        "Coming out support and guidance",
        "Family and relationship dynamics",
        "Community connection resources",
        "Transition support (if applicable)",
        "Intersectionality considerations"
      ],
      audioContent: ["Pride & Identity Podcasts", "Affirming Meditations", "Community Stories"]
    },
    {
      title: "Crisis Intervention & Support",
      description: "Immediate support for mental health crises with 24/7 availability and safety planning.",
      icon: Shield,
      color: "from-red-500 to-orange-500",
      features: [
        "24/7 crisis hotline access",
        "Safety planning and risk assessment",
        "Immediate coping strategies",
        "Emergency contact integration",
        "Crisis de-escalation techniques",
        "Follow-up support protocols"
      ],
      audioContent: ["Crisis Calming Techniques", "Emergency Grounding Exercises", "Safety Affirmations"]
    },
    {
      title: "Cultural AI Features",
      description: "Culturally sensitive therapy adapted to 29+ languages and diverse cultural backgrounds.",
      icon: Globe,
      color: "from-green-500 to-teal-500",
      features: [
        "29+ language support",
        "Cultural context adaptation",
        "Traditional healing integration",
        "Family dynamics consideration",
        "Religious/spiritual sensitivity",
        "Immigration and identity support"
      ],
      audioContent: ["Multicultural Wellness", "Traditional Healing Sounds", "Language-Specific Content"]
    }
  ];

  const advancedFeatures = [
    {
      title: "AI-Powered Mood Tracking",
      description: "Advanced mood analytics with pattern recognition and personalized insights.",
      icon: BarChart3,
      color: "from-pink-500 to-rose-500",
      steps: [
        "Daily mood check-ins with detailed emotions",
        "Pattern recognition across weeks/months",
        "Trigger identification and analysis",
        "Correlation with activities and events",
        "Predictive insights for mood changes",
        "Personalized intervention recommendations"
      ]
    },
    {
      title: "Digital Notebook & Journaling",
      description: "AI-enhanced journaling with voice-to-text and therapeutic prompts.",
      icon: BookOpen,
      color: "from-blue-500 to-cyan-500",
      steps: [
        "Voice-to-text journaling capabilities",
        "AI-suggested therapeutic prompts",
        "Mood correlation with entries",
        "Progress tracking through writing",
        "Export and sharing options",
        "Privacy-first encrypted storage"
      ]
    },
    {
      title: "Comprehensive Goal Tracking",
      description: "SMART goals framework with AI-powered progress monitoring.",
      icon: Trophy,
      color: "from-green-500 to-emerald-500",
      steps: [
        "SMART goals creation wizard",
        "Milestone tracking and celebration",
        "Progress visualization charts",
        "AI-powered recommendations",
        "Accountability reminders",
        "Goal adjustment based on progress"
      ]
    },
    {
      title: "Integrations Hub",
      description: "Connect with health apps, wearables, and productivity tools.",
      icon: Settings,
      color: "from-purple-500 to-indigo-500",
      steps: [
        "Health app synchronization",
        "Wearable data integration",
        "Calendar and scheduling sync",
        "Third-party API connections",
        "Data visualization dashboard",
        "Automated progress updates"
      ]
    }
  ];

  const audioContent = {
    podcasts: [
      {
        title: "Understanding Your Mind",
        description: "Educational series covering anxiety, depression, and mental health fundamentals.",
        episodes: 24,
        duration: "15-20 min",
        voice: "Sarah",
        category: "Education"
      },
      {
        title: "Relationship Wisdom",
        description: "Communication skills, conflict resolution, and intimacy building for couples.",
        episodes: 18,
        duration: "12-18 min",
        voice: "Laura",
        category: "Relationships"
      },
      {
        title: "ADHD Success Strategies",
        description: "Executive function, focus techniques, and productivity tips for neurodivergent minds.",
        episodes: 15,
        duration: "10-15 min",
        voice: "Charlotte",
        category: "ADHD"
      },
      {
        title: "Cultural Healing Wisdom",
        description: "Traditional healing practices integrated with modern therapy approaches.",
        episodes: 20,
        duration: "18-25 min",
        voice: "Jessica",
        category: "Cultural"
      }
    ],
    meditations: [
      {
        title: "Daily Mindfulness",
        description: "10-minute guided meditations for starting your day with intention.",
        sessions: 30,
        duration: "10 min",
        voice: "Aria",
        category: "Mindfulness"
      },
      {
        title: "Sleep Stories",
        description: "Calming bedtime stories and relaxation techniques for better sleep.",
        sessions: 25,
        duration: "20-30 min",
        voice: "Charlotte",
        category: "Sleep"
      },
      {
        title: "Anxiety Relief",
        description: "Breathing exercises and grounding techniques for managing anxiety.",
        sessions: 40,
        duration: "5-15 min",
        voice: "River",
        category: "Anxiety"
      },
      {
        title: "Crisis Calming",
        description: "Immediate calming techniques for crisis situations and emotional regulation.",
        sessions: 12,
        duration: "3-8 min",
        voice: "Aria",
        category: "Crisis"
      }
    ],
    techniques: [
      {
        title: "CBT Skill Building",
        description: "Cognitive Behavioral Therapy techniques for thought pattern recognition.",
        exercises: 35,
        duration: "8-12 min",
        voice: "Laura",
        category: "CBT"
      },
      {
        title: "DBT Emotional Regulation",
        description: "Dialectical Behavior Therapy skills for emotional management.",
        exercises: 28,
        duration: "10-15 min",
        voice: "Sarah",
        category: "DBT"
      },
      {
        title: "Grounding Techniques",
        description: "5-4-3-2-1 and other grounding methods for anxiety and panic.",
        exercises: 20,
        duration: "3-7 min",
        voice: "River",
        category: "Grounding"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-white to-calm-50">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-therapy-100/30 to-calm-100/30"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-therapy-500 to-calm-500 text-white px-8 py-3 text-sm font-semibold shadow-lg border-0">
              <Brain className="h-4 w-4 mr-2" />
              Complete Platform Guide
              <Lightbulb className="h-4 w-4 ml-2" />
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">
                How TherapySync Works
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Your complete guide to AI-powered mental health support. From quick start to advanced features, 
              discover how to maximize your therapeutic journey with our comprehensive platform.
            </p>
            
            <Button 
              size="lg"
              className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 text-white border-0 px-8 py-6 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              onClick={() => navigate('/auth')}
            >
              <Heart className="h-5 w-5 mr-2" />
              Start Your Journey
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Start Guide */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">
                Quick Start Guide
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Get started with TherapySync in just four simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {quickStartSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="relative">
                  <Card className="h-full hover:shadow-xl transition-all duration-300 group hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse shadow-lg">
                        <span className="text-2xl font-bold text-white">{step.number}</span>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-r from-therapy-400 to-calm-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold text-slate-800">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 mb-4">{step.description}</p>
                      <div className="space-y-2">
                        {step.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-therapy-500 flex-shrink-0" />
                            <span className="text-sm text-slate-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Arrow connector */}
                  {index < quickStartSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ArrowRight className="h-6 w-6 text-therapy-500" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Therapy Types Deep Dive */}
      <section className="py-20 bg-gradient-to-r from-therapy-50/50 to-calm-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">
                Specialized Therapy Types
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Discover our comprehensive approach to different therapeutic specializations
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {therapyTypes.map((therapy, index) => {
              const IconComponent = therapy.icon;
              return (
                <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                  <div className={`h-32 bg-gradient-to-r ${therapy.color} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute top-6 left-6">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-slate-800">{therapy.title}</CardTitle>
                    <p className="text-slate-600 text-lg">{therapy.description}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-3">Key Features:</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {therapy.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-2 text-sm text-slate-600">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                        <Headphones className="h-4 w-4" />
                        Audio Content Available:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {therapy.audioContent.map((content, contentIndex) => (
                          <Badge key={contentIndex} variant="secondary" className="text-xs">
                            {content}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">
                Advanced Platform Features
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Master our powerful tools for enhanced therapeutic outcomes
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {advancedFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-800">{feature.title}</CardTitle>
                    <p className="text-slate-600">{feature.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {feature.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-white">{stepIndex + 1}</span>
                          </div>
                          <span className="text-sm text-slate-600">{step}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Audio Content Library */}
      <section className="py-20 bg-gradient-to-r from-therapy-50/50 to-calm-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">
                Audio Content Library
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Premium therapeutic audio content powered by ElevenLabs AI voices
            </p>
          </div>
          
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-8">
              <Tabs value={activeAudioTab} onValueChange={setActiveAudioTab}>
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="podcasts" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Podcasts
                  </TabsTrigger>
                  <TabsTrigger value="meditations" className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Meditations
                  </TabsTrigger>
                  <TabsTrigger value="techniques" className="flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    Techniques
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="podcasts" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {audioContent.podcasts.map((podcast, index) => (
                      <Card key={index} className="hover:shadow-lg transition-all duration-300">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-bold">{podcast.title}</CardTitle>
                            <Badge variant="secondary">{podcast.category}</Badge>
                          </div>
                          <p className="text-slate-600 text-sm">{podcast.description}</p>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                            <span>{podcast.episodes} episodes</span>
                            <span>{podcast.duration}</span>
                            <span>Voice: {podcast.voice}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1">
                              <Play className="h-4 w-4 mr-2" />
                              Play Latest
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="meditations" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {audioContent.meditations.map((meditation, index) => (
                      <Card key={index} className="hover:shadow-lg transition-all duration-300">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-bold">{meditation.title}</CardTitle>
                            <Badge variant="secondary">{meditation.category}</Badge>
                          </div>
                          <p className="text-slate-600 text-sm">{meditation.description}</p>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                            <span>{meditation.sessions} sessions</span>
                            <span>{meditation.duration}</span>
                            <span>Voice: {meditation.voice}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1">
                              <Play className="h-4 w-4 mr-2" />
                              Start Session
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="techniques" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {audioContent.techniques.map((technique, index) => (
                      <Card key={index} className="hover:shadow-lg transition-all duration-300">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-bold">{technique.title}</CardTitle>
                            <Badge variant="secondary">{technique.category}</Badge>
                          </div>
                          <p className="text-slate-600 text-sm">{technique.description}</p>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                            <span>{technique.exercises} exercises</span>
                            <span>{technique.duration}</span>
                            <span>Voice: {technique.voice}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1">
                              <Play className="h-4 w-4 mr-2" />
                              Practice
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-therapy-500 to-calm-500 text-white p-12 shadow-2xl border-0">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Begin Your Journey?
              </h2>
              <p className="text-xl mb-8 text-therapy-100 max-w-2xl mx-auto">
                Join thousands who are transforming their mental health with our comprehensive AI-powered platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-white text-therapy-600 hover:bg-therapy-50 px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  onClick={() => navigate('/auth')}
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Start Free Today
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                  onClick={() => navigate('/pricing')}
                >
                  <TrendingUp className="h-5 w-5 mr-2" />
                  View Pricing
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowItWorks;
