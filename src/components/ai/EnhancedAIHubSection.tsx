import React, { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  CheckCircle
} from 'lucide-react';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';
import { useParallaxScroll } from '@/hooks/useParallaxScroll';
import AIHubIcon from '@/components/icons/custom/AIHubIcon';

const EnhancedAIHubSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { getTransform, isParallaxEnabled } = useParallaxScroll({ speed: 0.3 });

  // Complete AI Ecosystem - all the pillars of our platform
  const aiEcosystem = [
    {
      category: 'Therapeutic Intelligence',
      icon: Brain,
      color: 'from-therapy-500 to-therapy-600',
      description: 'Advanced AI that understands, learns, and adapts to your emotional patterns',
      capabilities: [
        'Emotional Pattern Recognition',
        'Personalized Therapy Adaptation',
        'Crisis Prediction & Prevention',
        'Cultural Sensitivity Engine'
      ],
      metrics: { accuracy: '96%', patterns: '47 emotions', adaptation: 'Real-time' }
    },
    {
      category: 'Human Connection',
      icon: Heart,
      color: 'from-harmony-500 to-harmony-600',
      description: 'Seamless integration with human therapists when AI support needs enhancement',
      capabilities: [
        'Seamless Human Handoff',
        'Context Preservation',
        'Professional Oversight',
        'Collaborative Care Plans'
      ],
      metrics: { handoff: '<5 seconds', context: '100% retained', satisfaction: '4.9/5' }
    },
    {
      category: 'Privacy & Security',
      icon: Shield,
      color: 'from-calm-500 to-calm-600',
      description: 'Military-grade security ensuring your most sensitive conversations remain private',
      capabilities: [
        'End-to-End Encryption',
        'Zero-Knowledge Architecture',
        'HIPAA/GDPR Compliance',
        'Secure Data Processing'
      ],
      metrics: { encryption: 'AES-256', compliance: '100%', breaches: '0 ever' }
    },
    {
      category: 'Global Accessibility',
      icon: Globe,
      color: 'from-balance-500 to-balance-600',
      description: '24/7 worldwide access with cultural competency across 150+ backgrounds',
      capabilities: [
        'Multilingual Support',
        'Cultural Adaptation',
        'Global Availability',
        'Accessibility Features'
      ],
      metrics: { languages: '25+', cultures: '150+', uptime: '99.9%' }
    },
    {
      category: 'Wellness Monitoring',
      icon: Activity,
      color: 'from-flow-500 to-flow-600',
      description: 'Continuous monitoring of mental health patterns with proactive interventions',
      capabilities: [
        'Real-time Mood Tracking',
        'Progress Analytics',
        'Intervention Triggers',
        'Wellness Insights'
      ],
      metrics: { tracking: 'Continuous', insights: 'Daily', improvement: '40%' }
    },
    {
      category: 'Community Support',
      icon: Users,
      color: 'from-mindful-500 to-mindful-600',
      description: 'Connect with a supportive community while maintaining complete anonymity',
      capabilities: [
        'Anonymous Support Groups',
        'Peer Connections',
        'Shared Experiences',
        'Community Challenges'
      ],
      metrics: { members: '100k+', groups: '500+', satisfaction: '4.8/5' }
    },
    {
      category: 'Crisis Management',
      icon: Zap,
      color: 'from-rose-500 to-rose-600',
      description: 'Immediate crisis detection and response with professional intervention protocols',
      capabilities: [
        'Crisis Detection',
        'Emergency Response',
        'Professional Alerts',
        'Safety Planning'
      ],
      metrics: { detection: '<2 minutes', prevention: '89%', response: '24/7' }
    },
    {
      category: 'Personalized Therapy',
      icon: Target,
      color: 'from-purple-500 to-purple-600',
      description: 'Tailored therapeutic approaches using 100+ evidence-based techniques',
      capabilities: [
        'Technique Matching',
        'Progress Optimization',
        'Goal Setting',
        'Outcome Tracking'
      ],
      metrics: { techniques: '100+', personalization: 'Dynamic', effectiveness: '+40%' }
    },
    {
      category: 'Continuous Learning',
      icon: TrendingUp,
      color: 'from-emerald-500 to-emerald-600',
      description: 'AI that grows smarter with every interaction while protecting user privacy',
      capabilities: [
        'Machine Learning',
        'Pattern Recognition',
        'Privacy-Preserving Learning',
        'Collective Intelligence'
      ],
      metrics: { learning: 'Continuous', data: 'Privacy-protected', improvement: 'Daily' }
    }
  ];

  // Success stories showcasing the ecosystem
  const ecosystemStories = [
    {
      title: "Sarah's Journey",
      story: "From anxiety diagnosis to thriving - the complete ecosystem supported Sarah through every stage of her healing",
      timeline: "6 months",
      outcome: "95% anxiety reduction"
    },
    {
      title: "Marcus's Crisis Prevention",
      story: "AI detected depression patterns 72 hours before crisis, enabling proactive intervention and preventing hospitalization",
      timeline: "Real-time",
      outcome: "Crisis prevented"
    },
    {
      title: "Global Community Impact",
      story: "100,000+ members across 50 countries finding support, connection, and healing through our integrated platform",
      timeline: "Ongoing",
      outcome: "Growing daily"
    }
  ];

  return (
    <SafeComponentWrapper name="EnhancedAIHubSection">
      <div ref={sectionRef} className="py-20 px-4 bg-white relative overflow-hidden">
        {/* Animated background */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            transform: isParallaxEnabled ? getTransform(-0.2) : 'none',
            willChange: 'transform'
          }}
        >
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-therapy-500 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-harmony-500 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-br from-calm-500/30 to-transparent rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div 
            className="text-center mb-16"
            style={{
              transform: isParallaxEnabled ? getTransform(0.1) : 'none',
              willChange: 'transform'
            }}
          >
            <div className="flex items-center justify-center mb-6">
              <AIHubIcon className="w-12 h-12 mr-4" />
              <Badge className="bg-orange-100 text-orange-800 border-orange-200 px-6 py-3 text-base font-medium">
                <Sparkles className="w-5 h-5 mr-2" />
                Complete AI Ecosystem
              </Badge>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-orange-600 via-red-600 to-purple-600 bg-clip-text text-transparent">
                The Complete Mental Health
              </span>
              <span className="block text-gray-900 mt-2">
                AI Ecosystem
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              More than therapy - discover the comprehensive AI ecosystem that supports every aspect of your mental health journey. 
              <strong className="text-orange-600"> Nine interconnected pillars</strong> working together for your wellbeing.
            </p>
          </div>

          {/* AI Ecosystem Grid */}
          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
            style={{
              transform: isParallaxEnabled ? getTransform(0.05) : 'none',
              willChange: 'transform'
            }}
          >
            {aiEcosystem.map((pillar, index) => (
              <Card 
                key={index} 
                className="group bg-white border border-gray-200 hover:border-orange-300 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden h-full"
              >
                <CardContent className="p-8 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${pillar.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <pillar.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      {Object.entries(pillar.metrics).map(([key, value], idx) => (
                        <Badge 
                          key={idx}
                          variant="outline" 
                          className="bg-white border-gray-300 text-gray-700 hover:border-orange-400 text-xs"
                        >
                          {key}: {value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{pillar.category}</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">{pillar.description}</p>
                  
                  <div className="space-y-2 flex-grow">
                    {pillar.capabilities.map((capability, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{capability}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 group/btn w-full"
                    >
                      Explore Pillar
                      <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Success Stories */}
          <div 
            className="bg-gradient-to-br from-orange-50 via-red-50 to-purple-50 rounded-3xl p-12 border border-orange-100"
            style={{
              transform: isParallaxEnabled ? getTransform(0.15) : 'none',
              willChange: 'transform'
            }}
          >
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Real Impact from the Complete Ecosystem
                </h3>
                <p className="text-lg text-gray-600">
                  See how our integrated approach transforms lives through comprehensive support
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {ecosystemStories.map((story, index) => (
                  <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                    <h4 className="text-xl font-bold text-gray-900 mb-4">{story.title}</h4>
                    <p className="text-gray-600 leading-relaxed mb-6">{story.story}</p>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <div className="text-sm">
                        <div className="text-gray-500">Timeline</div>
                        <div className="font-semibold text-orange-600">{story.timeline}</div>
                      </div>
                      <div className="text-sm text-right">
                        <div className="text-gray-500">Outcome</div>
                        <div className="font-semibold text-green-600">{story.outcome}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-12">
                <Button className="bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-700 hover:to-red-700 px-8 py-3 text-lg font-semibold">
                  Experience the Full Ecosystem
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SafeComponentWrapper>
  );
};

export default EnhancedAIHubSection;