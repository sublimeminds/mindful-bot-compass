import React, { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Network,
  Zap,
  Globe,
  Brain,
  Users,
  Shield,
  Activity,
  ArrowRight,
  Sparkles,
  CheckCircle
} from 'lucide-react';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';
import { useParallaxScroll } from '@/hooks/useParallaxScroll';
import AIHubIcon from '@/components/icons/custom/AIHubIcon';
import AppleStyleButton from '@/components/ui/AppleStyleButton';
import OptimizedSectionContainer from '@/components/sections/OptimizedSectionContainer';

const RedesignedAIHubSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { getTransform, isParallaxEnabled } = useParallaxScroll({ speed: 0.3 });

  // AI Ecosystem Interconnection - Focus on how everything works together
  const aiInterconnections = [
    {
      category: 'Neural Network Hub',
      icon: Network,
      color: 'from-therapy-500 to-calm-500',
      description: 'The central nervous system connecting all AI components for seamless intelligence flow',
      connections: [
        'Real-time data synchronization',
        'Cross-platform learning',
        'Intelligent routing',
        'Context preservation'
      ],
      impact: { efficiency: '+340%', response: '<0.5s', accuracy: '99.2%' }
    },
    {
      category: 'Global Intelligence Grid',
      icon: Globe,
      color: 'from-calm-500 to-harmony-500',
      description: 'Worldwide network of AI nodes sharing insights while protecting individual privacy',
      connections: [
        'Federated learning protocols',
        'Cultural intelligence sharing',
        'Anonymous pattern exchange',
        'Global best practices'
      ],
      impact: { reach: '150+ countries', insights: '2.4M daily', privacy: 'Zero-knowledge' }
    },
    {
      category: 'Adaptive Intelligence Engine',
      icon: Brain,
      color: 'from-harmony-500 to-balance-500',
      description: 'Self-evolving AI that learns from every interaction to improve therapeutic outcomes',
      connections: [
        'Continuous model refinement',
        'Therapeutic technique optimization',
        'Personalization algorithms',
        'Outcome prediction'
      ],
      impact: { learning: 'Continuous', adaptation: 'Real-time', improvement: '+12% weekly' }
    },
    {
      category: 'Human-AI Collaboration Matrix',
      icon: Users,
      color: 'from-balance-500 to-flow-500',
      description: 'Seamless integration between artificial and human intelligence for optimal care',
      connections: [
        'Smart therapist matching',
        'Context-aware handoffs',
        'Collaborative treatment plans',
        'Professional augmentation'
      ],
      impact: { satisfaction: '4.9/5', handoffs: '100% smooth', retention: '94%' }
    },
    {
      category: 'Security & Privacy Mesh',
      icon: Shield,
      color: 'from-flow-500 to-mindful-500',
      description: 'Distributed security architecture protecting data while enabling intelligent insights',
      connections: [
        'Multi-layer encryption',
        'Distributed authentication',
        'Privacy-preserving computing',
        'Secure multi-party learning'
      ],
      impact: { security: 'Military-grade', compliance: '100%', breaches: '0 ever' }
    },
    {
      category: 'Real-time Wellness Orchestra',
      icon: Activity,
      color: 'from-mindful-500 to-therapy-500',
      description: 'Synchronized monitoring and intervention system across all touchpoints',
      connections: [
        'Multi-modal data fusion',
        'Predictive intervention',
        'Cross-platform coordination',
        'Holistic wellness tracking'
      ],
      impact: { monitoring: '24/7', prevention: '89%', intervention: '<2 minutes' }
    }
  ];

  // Ecosystem benefits showcasing the interconnected power
  const ecosystemBenefits = [
    {
      title: "Collective Intelligence",
      story: "Every conversation across our global network (anonymously) improves outcomes for everyone. Maria's breakthrough in Tokyo enhances treatment for Sarah in New York.",
      metric: "2.4M+ daily insights",
      icon: Network
    },
    {
      title: "Seamless Transitions",
      story: "When Alex needed human support, the handoff was instant with full context preserved. No starting over, no lost progress - just enhanced care.",
      metric: "100% context retention",
      icon: Zap
    },
    {
      title: "Predictive Wellness",
      story: "The interconnected system detected Emma's stress patterns across multiple data points, preventing a crisis 72 hours before it would have occurred.",
      metric: "89% crisis prevention",
      icon: Activity
    }
  ];

  return (
    <SafeComponentWrapper name="RedesignedAIHubSection">
      <OptimizedSectionContainer className="bg-gradient-to-br from-white via-calm-25 to-harmony-25">
        <div ref={sectionRef} className="relative">
          {/* Enhanced Parallax Background */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              transform: isParallaxEnabled ? getTransform(-0.2) : 'none',
              willChange: 'transform'
            }}
          >
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-calm-500 to-transparent rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-harmony-500 to-transparent rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-br from-therapy-500/30 to-transparent rounded-full blur-3xl animate-pulse"></div>
          </div>

          {/* Header - Optimized for scroll visibility */}
          <div 
            className="text-center mb-12 relative z-10"
            style={{
              transform: isParallaxEnabled ? getTransform(0.1) : 'none',
              willChange: 'transform'
            }}
          >
            <div className="flex items-center justify-center mb-6">
              <AIHubIcon className="w-12 h-12 mr-4" />
              <Badge className="bg-calm-100 text-calm-800 border-calm-200 px-6 py-3 text-base font-medium">
                <Sparkles className="w-5 h-5 mr-2" />
                AI Ecosystem Interconnection
              </Badge>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-calm-600 via-harmony-600 to-therapy-600 bg-clip-text text-transparent">
                The Interconnected
              </span>
              <span className="block text-gray-900 mt-2">
                AI Ecosystem
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Beyond individual AI components - discover how our <strong className="text-calm-600">six interconnected systems</strong> work 
              together to create the world's most sophisticated mental health platform.
            </p>
          </div>

          {/* AI Interconnection Grid - Optimized for scroll */}
          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 relative z-10"
            style={{
              transform: isParallaxEnabled ? getTransform(0.05) : 'none',
              willChange: 'transform'
            }}
          >
            {aiInterconnections.map((connection, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group bg-white/90 backdrop-blur-sm border border-gray-200 hover:border-calm-300 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden h-full">
                  <CardContent className="p-6 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-2xl bg-gradient-to-br ${connection.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <connection.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        {Object.entries(connection.impact).map(([key, value], idx) => (
                          <Badge 
                            key={idx}
                            variant="outline" 
                            className="bg-white border-gray-300 text-gray-700 hover:border-calm-400 text-xs"
                          >
                            {key}: {value}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{connection.category}</h3>
                    <p className="text-gray-600 leading-relaxed mb-4 flex-grow">{connection.description}</p>
                    
                    <div className="space-y-2">
                      {connection.connections.map((conn, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{conn}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Ecosystem Benefits - Visual storytelling */}
          <div 
            className="bg-gradient-to-br from-calm-50 via-harmony-50 to-therapy-50 rounded-3xl p-8 border border-calm-100 relative overflow-hidden mb-12"
            style={{
              transform: isParallaxEnabled ? getTransform(0.15) : 'none',
              willChange: 'transform'
            }}
          >
            <div className="max-w-6xl mx-auto relative z-10">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  The Power of Interconnection
                </h3>
                <p className="text-lg text-gray-600">
                  See how our integrated ecosystem creates outcomes impossible with isolated systems
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {ecosystemBenefits.map((benefit, index) => (
                  <motion.div 
                    key={index} 
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-calm-500 to-harmony-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <benefit.icon className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h4>
                    <p className="text-gray-600 leading-relaxed mb-6 italic">"{benefit.story}"</p>
                    <div className="pt-4 border-t border-gray-100">
                      <div className="text-sm text-calm-600 font-semibold">{benefit.metric}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center relative z-10">
            <div className="bg-gradient-to-r from-calm-600 to-harmony-600 rounded-3xl p-12 text-white shadow-2xl">
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                Experience the Connected Future
              </h3>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Join the mental health revolution powered by the world's most advanced interconnected AI ecosystem.
              </p>
              <AppleStyleButton
                variant="outline"
                size="lg"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                icon={ArrowRight}
              >
                Explore the Ecosystem
              </AppleStyleButton>
            </div>
          </div>
        </div>
      </OptimizedSectionContainer>
    </SafeComponentWrapper>
  );
};

export default RedesignedAIHubSection;