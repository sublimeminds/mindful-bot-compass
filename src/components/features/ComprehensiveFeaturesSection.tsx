import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Brain,
  Heart,
  MessageSquare,
  Activity,
  Shield,
  Clock,
  Globe,
  Users,
  Zap,
  Target,
  TrendingUp,
  Bell,
  Calendar,
  BarChart3,
  Smartphone,
  Headphones,
  FileText,
  Camera,
  Mic,
  PlayCircle,
  ArrowRight,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Moon,
  Sun,
  Coffee,
  Smile,
  Frown,
  Meh,
  Trophy
} from 'lucide-react';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';

const ComprehensiveFeaturesSection = () => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('mental-health');

  // Comprehensive feature categories
  const featureCategories = {
    'mental-health': {
      title: 'Mental Health Core',
      description: 'Essential therapeutic features for mental wellness',
      icon: Brain,
      color: 'from-therapy-500 to-therapy-600',
      features: [
        {
          id: 'ai-therapy',
          icon: Brain,
          title: 'AI-Powered Therapy Sessions',
          description: 'Advanced conversational AI trained on 40M+ therapeutic interactions',
          benefits: ['24/7 availability', 'Evidence-based responses', 'Personalized approaches'],
          demo: 'therapy-chat',
          metrics: { accuracy: '96.4%', satisfaction: '4.9/5', response: '<200ms' }
        },
        {
          id: 'crisis-prevention',
          icon: AlertTriangle,
          title: 'Crisis Prevention System',
          description: 'Predictive AI that identifies mental health crises before they escalate',
          benefits: ['72-hour early detection', 'Immediate professional alerts', 'Safety plan activation'],
          demo: 'crisis-detection',
          metrics: { prediction: '72hrs early', prevention: '89%', response: '<2min' }
        },
        {
          id: 'mood-tracking',
          icon: Activity,
          title: 'Advanced Mood Analytics',
          description: 'Comprehensive mood tracking with pattern recognition and insights',
          benefits: ['Daily mood logging', 'Pattern analysis', 'Trigger identification'],
          demo: 'mood-tracker',
          metrics: { patterns: '247 emotions', accuracy: '92%', insights: 'Daily' }
        },
        {
          id: 'therapy-plans',
          icon: Target,
          title: 'Personalized Therapy Plans',
          description: 'Customized therapeutic journeys based on your unique needs and goals',
          benefits: ['Goal-oriented plans', 'Progress tracking', 'Adaptive protocols'],
          demo: 'therapy-plan',
          metrics: { personalization: '100%', success: '78%', adaptation: 'Real-time' }
        }
      ]
    },
    'wellness-tracking': {
      title: 'Wellness Monitoring',
      description: 'Comprehensive health and wellness tracking features',
      icon: Activity,
      color: 'from-harmony-500 to-harmony-600',
      features: [
        {
          id: 'sleep-analysis',
          icon: Moon,
          title: 'Sleep Pattern Analysis',
          description: 'Advanced sleep tracking with mental health correlation insights',
          benefits: ['Sleep quality scoring', 'Pattern recognition', 'Improvement suggestions'],
          demo: 'sleep-tracker',
          metrics: { accuracy: '94%', insights: 'Nightly', improvement: '+23%' }
        },
        {
          id: 'stress-monitoring',
          icon: Zap,
          title: 'Real-time Stress Monitoring',
          description: 'Continuous stress level tracking with intervention recommendations',
          benefits: ['Real-time monitoring', 'Stress alerts', 'Coping suggestions'],
          demo: 'stress-monitor',
          metrics: { monitoring: '24/7', alerts: 'Instant', accuracy: '91%' }
        },
        {
          id: 'habit-tracking',
          icon: Calendar,
          title: 'Habit & Routine Tracking',
          description: 'Build and maintain healthy habits with intelligent tracking and motivation',
          benefits: ['Habit formation', 'Progress visualization', 'Motivation system'],
          demo: 'habit-tracker',
          metrics: { habits: 'Unlimited', success: '67%', streaks: 'Tracked' }
        },
        {
          id: 'wellness-reports',
          icon: BarChart3,
          title: 'Comprehensive Wellness Reports',
          description: 'Detailed analytics and insights into your overall mental wellness journey',
          benefits: ['Weekly reports', 'Trend analysis', 'Professional sharing'],
          demo: 'wellness-report',
          metrics: { reports: 'Weekly', insights: '40+', sharing: 'Secure' }
        }
      ]
    },
    'communication': {
      title: 'Communication Tools',
      description: 'Advanced communication and interaction features',
      icon: MessageSquare,
      color: 'from-calm-500 to-calm-600',
      features: [
        {
          id: 'voice-therapy',
          icon: Mic,
          title: 'Voice Therapy Sessions',
          description: 'Natural voice conversations with AI therapists for immersive experiences',
          benefits: ['Natural conversations', 'Emotion detection', 'Voice analysis'],
          demo: 'voice-chat',
          metrics: { quality: 'HD', emotions: '47 types', latency: '<150ms' }
        },
        {
          id: 'multilingual',
          icon: Globe,
          title: 'Multilingual Support',
          description: 'Therapy in 25+ languages with cultural adaptation and context awareness',
          benefits: ['25+ languages', 'Cultural adaptation', 'Real-time translation'],
          demo: 'language-selector',
          metrics: { languages: '25+', cultures: '150+', accuracy: '95%' }
        },
        {
          id: 'group-therapy',
          icon: Users,
          title: 'Anonymous Group Sessions',
          description: 'Participate in supportive group therapy sessions with complete anonymity',
          benefits: ['Anonymous participation', 'Peer support', 'Moderated sessions'],
          demo: 'group-session',
          metrics: { groups: '500+', members: '100K+', satisfaction: '4.8/5' }
        },
        {
          id: 'journaling',
          icon: FileText,
          title: 'AI-Enhanced Journaling',
          description: 'Smart journaling with AI insights, prompts, and therapeutic guidance',
          benefits: ['AI writing prompts', 'Emotional analysis', 'Pattern insights'],
          demo: 'journal-entry',
          metrics: { prompts: '1000+', analysis: 'Instant', privacy: '100%' }
        }
      ]
    },
    'notifications': {
      title: 'Smart Notifications',
      description: 'Intelligent notification and reminder systems',
      icon: Bell,
      color: 'from-balance-500 to-balance-600',
      features: [
        {
          id: 'smart-reminders',
          icon: Bell,
          title: 'Intelligent Reminders',
          description: 'Smart reminders for therapy sessions, medications, and self-care activities',
          benefits: ['Context-aware timing', 'Gentle notifications', 'Adaptive scheduling'],
          demo: 'reminder-system',
          metrics: { timing: 'Optimal', adherence: '+45%', customization: 'Full' }
        },
        {
          id: 'check-ins',
          icon: Heart,
          title: 'Proactive Check-ins',
          description: 'AI-initiated wellness check-ins based on your patterns and needs',
          benefits: ['Proactive outreach', 'Pattern-based timing', 'Caring interactions'],
          demo: 'check-in',
          metrics: { frequency: 'Adaptive', engagement: '87%', helpfulness: '4.7/5' }
        },
        {
          id: 'achievement-alerts',
          icon: Trophy,
          title: 'Progress Celebrations',
          description: 'Celebrate milestones and achievements in your mental health journey',
          benefits: ['Milestone tracking', 'Achievement badges', 'Progress sharing'],
          demo: 'achievements',
          metrics: { milestones: 'Tracked', motivation: '+34%', sharing: 'Optional' }
        },
        {
          id: 'emergency-alerts',
          icon: AlertTriangle,
          title: 'Emergency Response System',
          description: 'Immediate crisis detection with emergency contact and professional intervention',
          benefits: ['Crisis detection', 'Emergency contacts', 'Professional alerts'],
          demo: 'emergency-system',
          metrics: { detection: '<2min', response: '24/7', prevention: '89%' }
        }
      ]
    },
    'privacy-security': {
      title: 'Privacy & Security',
      description: 'Advanced security and privacy protection features',
      icon: Shield,
      color: 'from-mindful-500 to-mindful-600',
      features: [
        {
          id: 'encryption',
          icon: Shield,
          title: 'End-to-End Encryption',
          description: 'Military-grade encryption ensuring complete privacy of all communications',
          benefits: ['AES-256 encryption', 'Zero-knowledge architecture', 'Quantum-resistant'],
          demo: 'encryption-demo',
          metrics: { encryption: 'AES-256', breaches: '0 ever', compliance: '100%' }
        },
        {
          id: 'anonymous-mode',
          icon: Users,
          title: 'Anonymous Usage Mode',
          description: 'Complete anonymity option for ultra-private therapeutic interactions',
          benefits: ['No personal data', 'Anonymous interactions', 'Temporary sessions'],
          demo: 'anonymous-mode',
          metrics: { anonymity: 'Complete', tracking: 'None', privacy: 'Maximum' }
        },
        {
          id: 'data-control',
          icon: FileText,
          title: 'Complete Data Control',
          description: 'Full control over your data with export, deletion, and sharing options',
          benefits: ['Data export', 'Right to deletion', 'Sharing controls'],
          demo: 'data-control',
          metrics: { control: 'Complete', export: 'Instant', deletion: 'Permanent' }
        },
        {
          id: 'secure-sharing',
          icon: Users,
          title: 'Secure Professional Sharing',
          description: 'Securely share progress with healthcare providers with granular permissions',
          benefits: ['Granular permissions', 'Time-limited access', 'Audit trails'],
          demo: 'secure-sharing',
          metrics: { permissions: 'Granular', auditing: 'Complete', security: 'Maximum' }
        }
      ]
    }
  };

  // Interactive demos for features
  const featureDemos = {
    'therapy-chat': (
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-start">
          <div className="bg-therapy-100 p-3 rounded-lg max-w-xs">
            <p className="text-sm">I've been feeling anxious about work lately...</p>
          </div>
        </div>
        <div className="flex justify-between items-start">
          <div className="bg-white p-3 rounded-lg max-w-xs ml-auto border border-therapy-200">
            <p className="text-sm">I understand. Work anxiety is very common. Let's explore what specifically is causing these feelings. Can you tell me about a recent situation that triggered your anxiety?</p>
          </div>
        </div>
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 text-xs text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>AI analyzing emotional patterns...</span>
          </div>
        </div>
      </div>
    ),
    'mood-tracker': (
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <div className="text-center mb-4">
          <h4 className="text-sm font-semibold">Today's Mood Check-in</h4>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {[Frown, Meh, Smile, Smile, Smile].map((Icon, idx) => (
            <div key={idx} className={`p-2 rounded-lg text-center cursor-pointer transition-colors ${idx === 2 ? 'bg-therapy-200' : 'bg-white hover:bg-gray-100'}`}>
              <Icon className="w-6 h-6 mx-auto mb-1" />
              <div className="text-xs">{['Poor', 'Fair', 'Good', 'Great', 'Amazing'][idx]}</div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <div className="text-xs text-gray-600 mb-2">Mood Pattern (7 days)</div>
          <div className="flex items-end space-x-1 h-12">
            {[3, 4, 2, 5, 3, 4, 3].map((height, idx) => (
              <div key={idx} className="bg-therapy-300 rounded-t" style={{ height: `${height * 20}%`, width: '14%' }}></div>
            ))}
          </div>
        </div>
      </div>
    ),
    'voice-chat': (
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="w-20 h-20 bg-therapy-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mic className="w-8 h-8 text-white" />
          </div>
          <p className="text-sm font-medium">Voice Therapy Session Active</p>
          <p className="text-xs text-gray-600">Tap to speak, AI is listening</p>
        </div>
        <div className="flex justify-center space-x-4">
          <div className="w-2 h-2 bg-therapy-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-therapy-400 rounded-full animate-pulse delay-75"></div>
          <div className="w-2 h-2 bg-therapy-400 rounded-full animate-pulse delay-150"></div>
        </div>
        <div className="text-center text-xs text-gray-500">
          Emotion detected: Calm, Thoughtful
        </div>
      </div>
    )
  };

  const currentCategory = featureCategories[activeCategory as keyof typeof featureCategories];

  return (
    <SafeComponentWrapper name="ComprehensiveFeaturesSection">
      <div className="py-20 px-4 bg-gradient-to-br from-white via-therapy-25 to-harmony-25">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge className="mb-6 bg-therapy-100 text-therapy-800 border-therapy-200 px-6 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Complete Feature Suite
            </Badge>
            
            <h2 className="text-5xl md:text-7xl font-bold text-foreground mb-8 leading-tight">
              Everything You Need for
              <span className="block bg-gradient-to-r from-therapy-600 via-harmony-600 to-calm-600 bg-clip-text text-transparent">
                Mental Wellness
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Discover the most comprehensive mental health platform with 20+ core features 
              designed to support every aspect of your wellness journey.
            </p>
          </motion.div>

          {/* Feature Categories */}
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-16">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-8">
              {Object.entries(featureCategories).map(([key, category]) => (
                <TabsTrigger key={key} value={key} className="flex items-center space-x-2">
                  <category.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{category.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(featureCategories).map(([key, category]) => (
              <TabsContent key={key} value={key}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Category Header */}
                  <div className="text-center mb-12">
                    <div className={`w-20 h-20 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                      <category.icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-foreground mb-4">{category.title}</h3>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{category.description}</p>
                  </div>

                  {/* Features Grid */}
                  <div className="grid md:grid-cols-2 gap-8">
                    {category.features.map((feature, index) => (
                      <motion.div
                        key={feature.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="group bg-white border border-gray-200 hover:border-therapy-300 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden h-full">
                          <CardContent className="p-8">
                            {/* Feature Header */}
                            <div className="flex items-start justify-between mb-6">
                              <div className={`p-4 rounded-2xl bg-gradient-to-br ${category.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className="h-8 w-8 text-white" />
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setActiveFeature(activeFeature === feature.id ? null : feature.id)}
                                className="text-therapy-600 hover:text-therapy-700"
                              >
                                <PlayCircle className="h-4 w-4 mr-2" />
                                {activeFeature === feature.id ? 'Hide Demo' : 'Live Demo'}
                              </Button>
                            </div>
                            
                            <h4 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h4>
                            <p className="text-gray-600 leading-relaxed mb-6">{feature.description}</p>
                            
                            {/* Benefits */}
                            <div className="space-y-3 mb-6">
                              {feature.benefits.map((benefit, idx) => (
                                <div key={idx} className="flex items-center space-x-3">
                                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                  <span className="text-sm text-gray-700">{benefit}</span>
                                </div>
                              ))}
                            </div>

                            {/* Metrics */}
                            <div className="grid grid-cols-3 gap-3 mb-6">
                              {Object.entries(feature.metrics).map(([key, value], idx) => (
                                <div key={idx} className="bg-gray-50 rounded-lg p-3 text-center">
                                  <div className="text-xs text-gray-500 capitalize mb-1">{key}</div>
                                  <div className="text-sm font-semibold text-gray-900">{value}</div>
                                </div>
                              ))}
                            </div>

                            {/* Interactive Demo */}
                            {activeFeature === feature.id && featureDemos[feature.demo as keyof typeof featureDemos] && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="border-t border-gray-100 pt-6"
                              >
                                <div>{featureDemos[feature.demo as keyof typeof featureDemos]}</div>
                              </motion.div>
                            )}
                            
                            <div className="pt-4 border-t border-gray-100">
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
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Platform Integration Showcase */}
          <motion.div
            className="bg-gradient-to-r from-therapy-600 to-harmony-600 rounded-3xl p-12 text-white shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center max-w-4xl mx-auto">
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                All Features Work Together Seamlessly
              </h3>
              <p className="text-xl mb-8 opacity-90 leading-relaxed">
                Our integrated platform ensures that every feature enhances the others, 
                creating a unified experience that adapts to your unique mental health journey.
              </p>
              
              {/* Feature Integration Visualization */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
                {Object.values(featureCategories).map((category, index) => (
                  <motion.div
                    key={category.title}
                    className="text-center"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      delay: index * 0.6 
                    }}
                  >
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <category.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-sm font-medium">{category.title}</div>
                  </motion.div>
                ))}
              </div>
              
              <Button 
                size="lg" 
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 px-10 py-4 text-lg font-medium group transition-all duration-300"
                variant="outline"
              >
                <Sparkles className="mr-3 h-5 w-5" />
                Experience All Features
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </SafeComponentWrapper>
  );
};

export default ComprehensiveFeaturesSection;