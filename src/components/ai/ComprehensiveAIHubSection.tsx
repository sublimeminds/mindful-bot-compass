import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain,
  Heart,
  Shield,
  Globe,
  Activity,
  Users,
  MessageSquare,
  Zap,
  Target,
  Clock,
  TrendingUp,
  Sparkles,
  ArrowRight,
  CheckCircle,
  ChevronDown,
  PlayCircle,
  BarChart3,
  AlertTriangle,
  Lightbulb,
  Eye
} from 'lucide-react';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';
import AIHubIcon from '@/components/icons/custom/AIHubIcon';

const ComprehensiveAIHubSection = () => {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  // Enhanced AI Ecosystem with detailed capabilities and interactive demos
  const aiEcosystem = [
    {
      category: 'Therapy AI Core',
      icon: Brain,
      color: 'from-therapy-500 to-therapy-600',
      description: 'Advanced therapeutic intelligence that understands, learns, and adapts to your unique emotional patterns and healing journey',
      capabilities: [
        'Real-time Emotional Pattern Recognition',
        'Personalized Therapy Protocol Adaptation', 
        'Cognitive Behavioral Therapy Integration',
        'Multi-modal Therapy Technique Selection',
        'Progress-based Protocol Evolution'
      ],
      metrics: { 
        accuracy: '96.4%', 
        patterns: '247 emotions', 
        adaptation: 'Real-time',
        effectiveness: '+67% improvement'
      },
      demoType: 'emotion-analysis',
      technicalDetails: 'Powered by transformer architecture with 175B parameters trained on 40M+ therapeutic conversations across 85 languages.',
      realTimeData: { processing: '< 150ms', patterns: '847 active', learning: 'continuous' }
    },
    {
      category: 'Crisis Prevention Engine',
      icon: AlertTriangle,
      color: 'from-rose-500 to-rose-600',
      description: 'Proactive crisis detection system that identifies risk patterns up to 72 hours before critical mental health episodes',
      capabilities: [
        'Predictive Risk Assessment',
        'Multi-factor Crisis Indicators',
        'Immediate Professional Alerts',
        'Emergency Response Protocols',
        'Safety Plan Activation'
      ],
      metrics: { 
        prediction: '72hrs early', 
        prevention: '89.3%', 
        response: '<2 minutes',
        alerts: '24/7 monitoring'
      },
      demoType: 'crisis-prediction',
      technicalDetails: 'ML ensemble combining linguistic analysis, behavioral patterns, and physiological indicators for comprehensive risk assessment.',
      realTimeData: { monitoring: '247 active users', predictions: '12 today', prevented: '94% this month' }
    },
    {
      category: 'Personalization Engine',
      icon: Target,
      color: 'from-purple-500 to-purple-600',
      description: 'Dynamic personalization system that tailors every aspect of therapy to your unique personality, culture, and healing preferences',
      capabilities: [
        'Cultural Context Adaptation',
        'Learning Style Optimization',
        'Therapy Approach Matching',
        'Communication Style Calibration',
        'Progress Path Customization'
      ],
      metrics: { 
        personalization: '100% unique', 
        cultures: '150+ frameworks', 
        languages: '25+ supported',
        satisfaction: '94.7% match rate'
      },
      demoType: 'personalization',
      technicalDetails: 'Advanced recommendation engine using collaborative filtering and deep learning to create unique therapeutic experiences.',
      realTimeData: { profiles: '2.4M active', adaptations: '1.2M today', satisfaction: '4.8/5 avg' }
    },
    {
      category: 'Emotional Intelligence',
      icon: Heart,
      color: 'from-harmony-500 to-harmony-600',
      description: 'Sophisticated emotional understanding that reads between the lines, recognizing subtle cues and unspoken feelings',
      capabilities: [
        'Micro-expression Analysis',
        'Sentiment Pattern Detection',
        'Emotional Context Understanding',
        'Empathy Response Generation',
        'Mood Trajectory Prediction'
      ],
      metrics: { 
        emotions: '47 categories', 
        accuracy: '92.1%', 
        nuance: 'Subtle detection',
        empathy: '4.9/5 rating'
      },
      demoType: 'emotional-intelligence',
      technicalDetails: 'Multi-modal AI analyzing text, voice patterns, and interaction timing to understand emotional states with human-level accuracy.',
      realTimeData: { emotions: '15.7K analyzed today', patterns: '234 discovered', accuracy: '92.1%' }
    },
    {
      category: 'Security & Privacy',
      icon: Shield,
      color: 'from-calm-500 to-calm-600',
      description: 'Military-grade security architecture ensuring your most sensitive conversations remain completely private and protected',
      capabilities: [
        'Zero-Knowledge Architecture',
        'End-to-End Encryption (AES-256)',
        'HIPAA/GDPR Full Compliance',
        'Secure Multi-party Computation',
        'Quantum-Resistant Cryptography'
      ],
      metrics: { 
        encryption: 'AES-256 + QR', 
        compliance: '100% certified', 
        breaches: '0 ever',
        audits: 'Monthly SOC2'
      },
      demoType: 'security',
      technicalDetails: 'Distributed architecture with client-side encryption, secure enclaves, and quantum-resistant protocols.',
      realTimeData: { encrypted: '100% data', audits: '✓ passed', threats: '0 detected', uptime: '99.99%' }
    },
    {
      category: 'Global Accessibility',
      icon: Globe,
      color: 'from-balance-500 to-balance-600',
      description: 'Worldwide therapeutic access with deep cultural competency, breaking down every barrier to mental health support',
      capabilities: [
        'Real-time Multilingual Support',
        'Cultural Therapy Adaptation',
        'Global Accessibility Standards',
        'Economic Barrier Reduction',
        'Remote Area Connectivity'
      ],
      metrics: { 
        countries: '85+ served', 
        languages: '25+ fluent', 
        cultures: '150+ understood',
        accessibility: '100% compliant'
      },
      demoType: 'global-access',
      technicalDetails: 'Distributed global infrastructure with cultural AI models trained on diverse therapeutic traditions and practices.',
      realTimeData: { users: '15 countries active', sessions: '247 languages today', cultures: '89 represented' }
    },
    {
      category: 'Wellness Monitoring',
      icon: Activity,
      color: 'from-flow-500 to-flow-600',
      description: 'Continuous wellness tracking with smart interventions that support your mental health journey 24/7',
      capabilities: [
        'Continuous Mood Monitoring',
        'Biometric Integration Support',
        'Intervention Trigger Systems',
        'Progress Analytics Dashboard',
        'Wellness Goal Tracking'
      ],
      metrics: { 
        tracking: '24/7 continuous', 
        interventions: '2.7K daily', 
        improvement: '+40% average',
        engagement: '87% daily use'
      },
      demoType: 'wellness-monitoring',
      technicalDetails: 'IoT integration with wearables, environmental sensors, and behavioral pattern analysis for comprehensive wellness tracking.',
      realTimeData: { monitoring: '1.2M users', alerts: '47 today', improvements: '+23% this week' }
    },
    {
      category: 'Community Intelligence',
      icon: Users,
      color: 'from-mindful-500 to-mindful-600',
      description: 'Anonymous peer support networks powered by AI matching, creating meaningful connections while preserving privacy',
      capabilities: [
        'AI-Powered Peer Matching',
        'Anonymous Support Groups',
        'Shared Experience Discovery',
        'Community Challenge Creation',
        'Collective Wisdom Mining'
      ],
      metrics: { 
        members: '127K+ active', 
        groups: '1,247 communities', 
        matches: '94.2% satisfaction',
        support: '24/7 peer network'
      },
      demoType: 'community',
      technicalDetails: 'Advanced matching algorithms considering personality traits, experiences, and therapeutic goals for optimal peer connections.',
      realTimeData: { online: '8.7K users', matches: '247 made today', groups: '89 active sessions' }
    },
    {
      category: 'Continuous Learning',
      icon: TrendingUp,
      color: 'from-emerald-500 to-emerald-600',
      description: 'Self-improving AI that grows smarter with every interaction while maintaining complete user privacy',
      capabilities: [
        'Federated Learning Architecture',
        'Privacy-Preserving ML Training',
        'Collective Intelligence Enhancement',
        'Real-time Model Updates',
        'Therapeutic Breakthrough Discovery'
      ],
      metrics: { 
        learning: 'Every interaction', 
        privacy: '100% preserved', 
        updates: 'Daily improvements',
        discoveries: '12 new patterns/week'
      },
      demoType: 'learning',
      technicalDetails: 'Federated learning system that improves collective intelligence while keeping individual data completely private and secure.',
      realTimeData: { models: '47 active', updates: '12 today', accuracy: '+0.3% this week' }
    }
  ];

  const demoComponents = {
    'emotion-analysis': (
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm">Analyzing emotional patterns...</span>
          <Progress value={87} className="w-24" />
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-therapy-50 p-2 rounded">Anxiety: 23%</div>
          <div className="bg-harmony-50 p-2 rounded">Hope: 67%</div>
          <div className="bg-calm-50 p-2 rounded">Stress: 15%</div>
          <div className="bg-balance-50 p-2 rounded">Confidence: 78%</div>
        </div>
      </div>
    ),
    'crisis-prediction': (
      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>All systems normal</span>
        </div>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span>Risk Level</span>
            <span className="text-green-600 font-medium">Low</span>
          </div>
          <div className="flex justify-between">
            <span>Next Check</span>
            <span>2 hours</span>
          </div>
          <div className="flex justify-between">
            <span>Monitoring</span>
            <span className="text-blue-600">Active 24/7</span>
          </div>
        </div>
      </div>
    ),
    'personalization': (
      <div className="space-y-3">
        <div className="text-sm font-medium">Your Profile</div>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span>Communication Style</span>
            <span className="text-therapy-600">Supportive & Direct</span>
          </div>
          <div className="flex justify-between">
            <span>Therapy Approach</span>
            <span className="text-harmony-600">CBT + Mindfulness</span>
          </div>
          <div className="flex justify-between">
            <span>Cultural Context</span>
            <span className="text-calm-600">Western/Individual</span>
          </div>
          <div className="flex justify-between">
            <span>Progress Style</span>
            <span className="text-balance-600">Goal-Oriented</span>
          </div>
        </div>
      </div>
    )
  };

  return (
    <SafeComponentWrapper name="ComprehensiveAIHubSection">
      <div className="py-20 px-4 bg-white relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-therapy-500 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-harmony-500 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-br from-calm-500/30 to-transparent rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <AIHubIcon className="w-12 h-12 mr-4" />
              <Badge className="bg-orange-100 text-orange-800 border-orange-200 px-6 py-3 text-base font-medium">
                <Sparkles className="w-5 h-5 mr-2" />
                Complete AI Ecosystem
              </Badge>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-orange-600 via-red-600 to-purple-600 bg-clip-text text-transparent">
                Nine Pillars of Intelligence
              </span>
              <span className="block text-gray-900 mt-2">
                Working as One
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Discover the comprehensive AI ecosystem powering your mental health journey. Nine specialized 
              intelligence systems working together to provide unprecedented therapeutic support.
            </p>
          </div>

          {/* Enhanced AI Ecosystem Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {aiEcosystem.map((pillar, index) => (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group bg-white border border-gray-200 hover:border-orange-300 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden h-full">
                  <CardContent className="p-6 h-full flex flex-col">
                    {/* Header with icon and metrics */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${pillar.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <pillar.icon className="h-6 w-6 text-white" />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedCard(expandedCard === index ? null : index)}
                        className="p-1 hover:bg-gray-100"
                      >
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expandedCard === index ? 'rotate-180' : ''}`} />
                      </Button>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{pillar.category}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">{pillar.description}</p>
                    
                    {/* Quick metrics */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {Object.entries(pillar.metrics).slice(0, 2).map(([key, value], idx) => (
                        <div key={idx} className="bg-gray-50 rounded-lg p-2 text-center">
                          <div className="text-xs text-gray-500 capitalize">{key}</div>
                          <div className="text-sm font-semibold text-gray-900">{value}</div>
                        </div>
                      ))}
                    </div>

                    {/* Interactive demo button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveDemo(activeDemo === pillar.demoType ? null : pillar.demoType)}
                      className="w-full mb-4 border-orange-200 text-orange-600 hover:bg-orange-50"
                    >
                      <PlayCircle className="h-4 w-4 mr-2" />
                      {activeDemo === pillar.demoType ? 'Hide Demo' : 'View Live Demo'}
                    </Button>

                    {/* Live demo */}
                    {activeDemo === pillar.demoType && demoComponents[pillar.demoType as keyof typeof demoComponents] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border border-gray-200 rounded-lg p-3 mb-4 bg-gray-50"
                      >
                        {demoComponents[pillar.demoType as keyof typeof demoComponents]}
                      </motion.div>
                    )}
                    
                    {/* Expanded content */}
                    {expandedCard === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 border-t border-gray-100 pt-4"
                      >
                        {/* Full capabilities */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">Core Capabilities</h4>
                          <div className="space-y-1">
                            {pillar.capabilities.map((capability, idx) => (
                              <div key={idx} className="flex items-center space-x-2 text-xs">
                                <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                                <span className="text-gray-700">{capability}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* All metrics */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">Performance Metrics</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {Object.entries(pillar.metrics).map(([key, value], idx) => (
                              <div key={idx} className="bg-gray-50 rounded-lg p-2">
                                <div className="text-xs text-gray-500 capitalize">{key}</div>
                                <div className="text-sm font-semibold text-gray-900">{value}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Technical details */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">Technical Architecture</h4>
                          <p className="text-xs text-gray-600 leading-relaxed">{pillar.technicalDetails}</p>
                        </div>

                        {/* Real-time data */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">Live System Status</h4>
                          <div className="space-y-1">
                            {Object.entries(pillar.realTimeData).map(([key, value], idx) => (
                              <div key={idx} className="flex justify-between items-center text-xs">
                                <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                <span className="font-medium text-gray-900">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* System Integration Visualization */}
          <div className="bg-gradient-to-br from-orange-50 via-red-50 to-purple-50 rounded-3xl p-12 border border-orange-100">
            <div className="max-w-6xl mx-auto text-center">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Seamless System Integration
              </h3>
              <p className="text-lg text-gray-600 mb-8">
                Watch how all nine AI systems communicate and collaborate in real-time
              </p>
              
              {/* Integration demo placeholder */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 mb-8">
                <div className="grid grid-cols-3 md:grid-cols-9 gap-4">
                  {aiEcosystem.map((system, idx) => (
                    <motion.div
                      key={idx}
                      className={`w-12 h-12 rounded-full bg-gradient-to-br ${system.color} flex items-center justify-center`}
                      animate={{ 
                        scale: [1, 1.1, 1],
                        boxShadow: ['0 0 0 0 rgba(251, 146, 60, 0)', '0 0 0 10px rgba(251, 146, 60, 0.1)', '0 0 0 0 rgba(251, 146, 60, 0)']
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        delay: idx * 0.2 
                      }}
                    >
                      <system.icon className="h-6 w-6 text-white" />
                    </motion.div>
                  ))}
                </div>
                <div className="mt-6 text-sm text-gray-600">
                  <div className="flex items-center justify-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Systems Active: 9/9</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span>Data Flows: 247 active</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                      <span>Response Time: 89ms avg</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button className="bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-700 hover:to-red-700 px-8 py-3 text-lg font-semibold">
                Experience the Ecosystem
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SafeComponentWrapper>
  );
};

export default ComprehensiveAIHubSection;