import React, { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Star, 
  Shield, 
  Globe, 
  ArrowRight,
  Sparkles,
  MessageSquare,
  Users
} from 'lucide-react';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';
import { useParallaxScroll } from '@/hooks/useParallaxScroll';

const AITechnologyShowcase = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { getTransform, isParallaxEnabled } = useParallaxScroll({ speed: 0.3 });

  // Transform technical features into human stories
  const stories = [
    {
      icon: Heart,
      title: 'Learns Your Emotional Language',
      story: 'Meet Sarah, who struggled to express her anxiety. Our AI learned her unique way of describing overwhelm - from "chest tightness" to "racing thoughts" - becoming fluent in her emotional vocabulary.',
      impact: 'Personal understanding',
      color: 'from-therapy-500 to-therapy-600'
    },
    {
      icon: Shield,
      title: 'Guards Your Deepest Thoughts',
      story: 'When Marcus shared his trauma, he needed absolute privacy. Our AI creates a digital sanctuary where every word is encrypted, every session protected, ensuring your healing space remains sacred.',
      impact: 'Complete privacy',
      color: 'from-calm-500 to-calm-600'
    },
    {
      icon: Star,
      title: 'Adapts to Your Healing Journey',
      story: 'Emily\'s therapy needs changed over months - from grief support to building confidence. Our AI evolved with her, recognizing patterns and adjusting its approach as she grew stronger.',
      impact: 'Dynamic growth',
      color: 'from-harmony-500 to-harmony-600'
    },
    {
      icon: Globe,
      title: 'Honors Your Cultural Background',
      story: 'Kenji needed therapy that respected his Japanese cultural values. Our AI understood concepts like "gaman" and "ikigai," providing culturally sensitive support that felt authentic to his identity.',
      impact: 'Cultural respect',
      color: 'from-balance-500 to-balance-600'
    },
    {
      icon: MessageSquare,
      title: 'Available in Your Darkest Moments',
      story: 'At 3 AM, when panic struck, Alex found immediate support. Our AI recognized the crisis patterns and provided grounding techniques that helped him through the night until morning came.',
      impact: '24/7 presence',
      color: 'from-flow-500 to-flow-600'
    },
    {
      icon: Users,
      title: 'Grows With Every Conversation',
      story: 'Through millions of healing conversations, our AI has learned what really helps. Each session adds to a growing understanding of human resilience, making support more effective for everyone.',
      impact: 'Collective wisdom',
      color: 'from-mindful-500 to-mindful-600'
    }
  ];

  return (
    <SafeComponentWrapper name="AITechnologyShowcase">
      <div ref={sectionRef} className="py-20 px-4 bg-white relative overflow-hidden">
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
          {/* Storytelling Header */}
          <div 
            className="text-center mb-16"
            style={{
              transform: isParallaxEnabled ? getTransform(0.1) : 'none',
              willChange: 'transform'
            }}
          >
            <Badge className="mb-6 bg-therapy-100 text-therapy-800 border-therapy-200 px-6 py-3 text-base font-medium">
              <Sparkles className="w-5 h-5 mr-2" />
              Stories of Healing Technology
            </Badge>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How AI Learns to
              <span className="block bg-gradient-to-r from-therapy-600 via-harmony-600 to-calm-600 bg-clip-text text-transparent">
                Understand Your Heart
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Every breakthrough in AI therapy starts with a human story. Discover how our technology 
              learns to provide the compassionate, personalized support you deserve.
            </p>
          </div>

          {/* Human Stories Grid */}
          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
            style={{
              transform: isParallaxEnabled ? getTransform(0.05) : 'none',
              willChange: 'transform'
            }}
          >
            {stories.map((story, index) => (
              <Card 
                key={index} 
                className="group bg-white border border-gray-200 hover:border-therapy-300 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden h-full"
              >
                <CardContent className="p-8 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${story.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <story.icon className="h-8 w-8 text-white" />
                    </div>
                    <Badge 
                      variant="outline" 
                      className="bg-white border-gray-300 text-gray-700 hover:border-therapy-400"
                    >
                      {story.impact}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{story.title}</h3>
                  <p className="text-gray-600 leading-relaxed flex-grow">{story.story}</p>
                  
                  <div className="mt-6 pt-4 border-t border-gray-100">
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
            ))}
          </div>

          {/* Emotional Impact Section */}
          <div 
            className="bg-gradient-to-br from-therapy-50 to-harmony-50 rounded-3xl p-12 border border-therapy-100"
            style={{
              transform: isParallaxEnabled ? getTransform(0.15) : 'none',
              willChange: 'transform'
            }}
          >
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                The Human Touch in AI Therapy
              </h3>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our AI doesn't just process words—it understands the emotions, cultural context, and personal journey 
                behind every conversation. This is technology that truly cares.
              </p>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-therapy-500 to-therapy-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2 text-gray-900">Emotional Intelligence</h4>
                  <p className="text-gray-600">Recognizes and responds to the subtle nuances of human emotion</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-harmony-500 to-harmony-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Globe className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2 text-gray-900">Cultural Sensitivity</h4>
                  <p className="text-gray-600">Adapts to diverse backgrounds and cultural healing approaches</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-calm-500 to-calm-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2 text-gray-900">Trusted Companion</h4>
                  <p className="text-gray-600">Creates a safe space where vulnerability leads to healing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SafeComponentWrapper>
  );
};

export default AITechnologyShowcase;