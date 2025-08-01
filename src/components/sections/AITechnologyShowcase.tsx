import React, { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Zap, 
  Shield, 
  Globe, 
  ArrowRight,
  Sparkles,
  MessageSquare,
  Heart,
  Activity,
  Cpu
} from 'lucide-react';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';
import { useParallaxScroll } from '@/hooks/useParallaxScroll';
import TherapySyncIcon from '@/components/icons/custom/TherapySyncIcon';

const AITechnologyShowcase = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { getTransform, isParallaxEnabled } = useParallaxScroll({ speed: 0.3 });

  // TherapySync AI Core Capabilities with storytelling
  const therapySyncCapabilities = [
    {
      icon: Brain,
      title: 'Emotional Intelligence That Evolves',
      story: 'Sarah discovered our AI learned her unique emotional patterns - from subtle anxiety cues to breakthrough moments. Unlike static chatbots, TherapySync AI grows more intuitive with every conversation, becoming your personal emotional translator.',
      metrics: { accuracy: '96%', learning: 'Continuous', recognition: '47 emotions' },
      color: 'from-therapy-500 to-therapy-600'
    },
    {
      icon: Zap,
      title: 'Real-Time Crisis Prevention',
      story: 'When Marcus\'s depression patterns shifted toward crisis, our AI detected the change 72 hours before he felt it himself. Immediate intervention connected him with resources, preventing a potential emergency.',
      metrics: { prevention: '89%', response: '<2 minutes', accuracy: '94%' },
      color: 'from-calm-500 to-calm-600'
    },
    {
      icon: Shield,
      title: 'Military-Grade Privacy Protection',
      story: 'Emily needed complete confidentiality for her trauma therapy. Our AI operates with bank-level encryption and zero-knowledge architecture - even our engineers can\'t access your conversations.',
      metrics: { encryption: 'AES-256', compliance: 'HIPAA/GDPR', storage: 'Zero-knowledge' },
      color: 'from-harmony-500 to-harmony-600'
    },
    {
      icon: Globe,
      title: 'Cultural Adaptation Engine',
      story: 'Kenji received therapy that understood Japanese concepts of mental health. Our AI adapts to 150+ cultural backgrounds, ensuring therapy feels authentic to your identity and values.',
      metrics: { cultures: '150+', languages: '25+', adaptation: 'Real-time' },
      color: 'from-balance-500 to-balance-600'
    },
    {
      icon: Activity,
      title: 'Therapeutic Technique Optimization',
      story: 'Alex found traditional CBT wasn\'t working. Our AI seamlessly blended DBT, mindfulness, and somatic approaches, creating a personalized therapeutic cocktail that finally clicked.',
      metrics: { techniques: '100+', personalization: 'Dynamic', effectiveness: '+40%' },
      color: 'from-flow-500 to-flow-600'
    },
    {
      icon: Cpu,
      title: 'Human-AI Collaboration',
      story: 'When automated support reached its limits, Maria was seamlessly connected to a human therapist with full context. No starting over, no lost progress - just enhanced care.',
      metrics: { handoff: 'Seamless', context: '100% retained', satisfaction: '4.9/5' },
      color: 'from-mindful-500 to-mindful-600'
    }
  ];

  return (
    <SafeComponentWrapper name="AITechnologyShowcase">
      <div ref={sectionRef} className="min-h-screen flex items-center justify-center py-12 px-4 bg-white relative overflow-hidden">
        {/* Enhanced Parallax Background with GPU optimization */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            transform: isParallaxEnabled ? getTransform(-0.2) : 'none',
            willChange: 'transform'
          }}
        >
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-therapy-500 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-calm-500 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-br from-harmony-500/30 to-transparent rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Storytelling Header - Optimized for Scroll Visibility */}
          <div 
            className="text-center mb-12"
            style={{
              transform: isParallaxEnabled ? getTransform(0.1) : 'none',
              willChange: 'transform'
            }}
          >
            <div className="flex items-center justify-center mb-6">
              <TherapySyncIcon className="w-12 h-12 mr-4" />
              <Badge className="bg-therapy-100 text-therapy-800 border-therapy-200 px-6 py-3 text-base font-medium">
                <Sparkles className="w-5 h-5 mr-2" />
                TherapySync AI: The Future of Mental Health
              </Badge>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-therapy-600 via-harmony-600 to-calm-600 bg-clip-text text-transparent">
                TherapySync AI
              </span>
              <span className="block text-gray-900 mt-2">
                Redefining Human-AI Connection
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Beyond chatbots and basic AI - TherapySync AI represents the pinnacle of therapeutic technology. 
              <strong className="text-therapy-600"> The world's most advanced AI therapy platform</strong> that truly understands, 
              adapts, and evolves with your healing journey.
            </p>
          </div>

          {/* TherapySync AI Capabilities Grid - Optimized Spacing */}
          <div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-6xl mx-auto"
            style={{
              transform: isParallaxEnabled ? getTransform(0.05) : 'none',
              willChange: 'transform'
            }}
          >
            {therapySyncCapabilities.map((capability, index) => (
              <Card 
                key={index} 
                className="group bg-white border border-gray-200 hover:border-therapy-300 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden h-full"
              >
                <CardContent className="p-8 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${capability.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <capability.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      {Object.entries(capability.metrics).map(([key, value], idx) => (
                        <Badge 
                          key={idx}
                          variant="outline" 
                          className="bg-white border-gray-300 text-gray-700 hover:border-therapy-400 text-xs"
                        >
                          {key}: {value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{capability.title}</h3>
                  <p className="text-gray-600 leading-relaxed flex-grow">{capability.story}</p>
                  
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-therapy-600 hover:text-therapy-700 hover:bg-therapy-50 group/btn w-full"
                    >
                      Explore Technology
                      <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* TherapySync AI Superiority Section */}
          <div 
            className="bg-gradient-to-br from-therapy-50 via-harmony-50 to-calm-50 rounded-3xl p-12 border border-therapy-100 relative overflow-hidden"
            style={{
              transform: isParallaxEnabled ? getTransform(0.15) : 'none',
              willChange: 'transform'
            }}
          >
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-10 left-10 w-20 h-20 bg-therapy-200 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute bottom-10 right-10 w-32 h-32 bg-harmony-200 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-calm-200 rounded-full opacity-20 animate-pulse"></div>
            </div>
            
            <div className="max-w-6xl mx-auto text-center relative z-10">
              <div className="flex items-center justify-center mb-6">
                <TherapySyncIcon className="w-16 h-16 mr-4" />
                <h3 className="text-4xl font-bold text-gray-900">
                  Why TherapySync AI Leads the Industry
                </h3>
              </div>
              
              <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-4xl mx-auto">
                While others offer basic chatbots, TherapySync AI delivers the world's most sophisticated 
                therapeutic intelligence - combining human empathy with AI precision.
              </p>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-therapy-200">
                  <div className="w-20 h-20 bg-gradient-to-br from-therapy-500 to-therapy-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Brain className="h-10 w-10 text-white" />
                  </div>
                  <h4 className="text-2xl font-semibold mb-4 text-gray-900">Advanced Emotional AI</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Our proprietary emotional intelligence engine processes 47 distinct emotional states with 96% accuracy, 
                    far exceeding industry standards of basic sentiment analysis.
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-sm text-therapy-600 font-semibold">Industry First: True Emotional Understanding</div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-harmony-200">
                  <div className="w-20 h-20 bg-gradient-to-br from-harmony-500 to-harmony-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Zap className="h-10 w-10 text-white" />
                  </div>
                  <h4 className="text-2xl font-semibold mb-4 text-gray-900">Predictive Crisis Prevention</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Revolutionary pattern recognition detects mental health crises up to 72 hours before they occur, 
                    enabling proactive intervention that saves lives.
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-sm text-harmony-600 font-semibold">89% Crisis Prevention Success Rate</div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-calm-200">
                  <div className="w-20 h-20 bg-gradient-to-br from-calm-500 to-calm-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Activity className="h-10 w-10 text-white" />
                  </div>
                  <h4 className="text-2xl font-semibold mb-4 text-gray-900">Seamless Human Integration</h4>
                  <p className="text-gray-600 leading-relaxed">
                    When AI reaches its limits, seamless handoff to human therapists with full context preservation 
                    ensures continuous, uninterrupted care.
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-sm text-calm-600 font-semibold">100% Context Retained in Handoffs</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-12 p-8 bg-gradient-to-r from-therapy-600 to-harmony-600 rounded-2xl text-white">
                <h4 className="text-2xl font-bold mb-4">Experience the TherapySync Difference</h4>
                <p className="text-lg mb-6 opacity-90">
                  Join the mental health revolution. Experience AI therapy that doesn't just respond - it truly understands.
                </p>
                <Button className="bg-white text-therapy-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                  Start Your Journey Today
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

export default AITechnologyShowcase;