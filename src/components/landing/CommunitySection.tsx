import React, { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, MessageSquare, BookOpen, Award, Heart, Sparkles, Shield, Globe, Lightbulb, ArrowRight } from 'lucide-react';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';
import { useParallaxScroll } from '@/hooks/useParallaxScroll';
import CommunityIcon from '@/components/icons/custom/CommunityIcon';

const CommunitySection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { getTransform, isParallaxEnabled } = useParallaxScroll({ speed: 0.3 });

  // Enhanced community features with storytelling
  const communityFeatures = [
    {
      icon: Users,
      title: "Anonymous Support Circles",
      story: "Maria found her safe space in our anxiety support circle. No judgement, no names - just understanding hearts sharing their journey toward healing.",
      participants: "15,000+ members",
      highlight: "Safe Anonymity",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: MessageSquare,
      title: "Healing Conversations",
      story: "Late-night panic attacks led Tom to our 24/7 community forums. Real people, real support, real understanding when he needed it most.",
      participants: "50,000+ conversations",
      highlight: "Always Available",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: BookOpen,
      title: "Wisdom Library",
      story: "Sarah discovered coping techniques shared by community members who walked her path. Peer-tested strategies that actually work in real life.",
      participants: "10,000+ resources",
      highlight: "Peer Wisdom",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Award,
      title: "Together We Thrive",
      story: "Alex joined the 30-day mindfulness challenge and found accountability partners who became lifelong friends. Growth is better together.",
      participants: "25,000+ participants",
      highlight: "Shared Growth",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: Shield,
      title: "Moderated Safety",
      story: "Every conversation is protected by AI-powered moderation and human oversight, ensuring our community remains a healing sanctuary.",
      participants: "Zero tolerance policy",
      highlight: "Complete Safety",
      color: "from-red-500 to-red-600"
    },
    {
      icon: Globe,
      title: "Global Connection",
      story: "Kenji in Tokyo found understanding with Emma in London. Mental health challenges are universal - so is human compassion.",
      participants: "50+ countries",
      highlight: "Worldwide Unity",
      color: "from-teal-500 to-teal-600"
    }
  ];

  const supportTypes = [
    {
      type: "Anxiety Support",
      members: "12,500+",
      description: "Share coping strategies and mutual encouragement",
      color: "from-blue-400 to-blue-600"
    },
    {
      type: "Depression Recovery",
      members: "8,200+",
      description: "Journey together towards healing and hope",
      color: "from-purple-400 to-purple-600"
    },
    {
      type: "Relationship Issues",
      members: "6,800+",
      description: "Navigate relationship challenges with peer support",
      color: "from-pink-400 to-pink-600"
    },
    {
      type: "Life Transitions",
      members: "5,500+",
      description: "Support during major life changes and decisions",
      color: "from-green-400 to-green-600"
    }
  ];

  const events = [
    {
      title: "Weekly Mindfulness Sessions",
      time: "Thursdays 7PM EST",
      type: "Live Group Session"
    },
    {
      title: "Mental Health Awareness Week",
      time: "May 15-21",
      type: "Community Event"
    },
    {
      title: "Anxiety Management Workshop",
      time: "Monthly",
      type: "Educational"
    }
  ];

  return (
    <SafeComponentWrapper name="CommunitySection">
      <div ref={sectionRef} className="py-20 px-4 bg-white relative overflow-hidden">
        {/* Animated background */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            transform: isParallaxEnabled ? getTransform(-0.2) : 'none',
            willChange: 'transform'
          }}
        >
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-500 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-500 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-br from-green-500/30 to-transparent rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div 
            className="text-center mb-16"
            style={{
              transform: isParallaxEnabled ? getTransform(0.1) : 'none',
              willChange: 'transform'
            }}
          >
            <div className="flex items-center justify-center mb-6">
              <CommunityIcon className="w-12 h-12 mr-4" />
              <Badge className="bg-purple-100 text-purple-800 border-purple-200 px-6 py-3 text-base font-medium">
                <Heart className="w-5 h-5 mr-2" />
                Community Stories & Connection
              </Badge>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
                You're Never Alone
              </span>
              <span className="block text-gray-900 mt-2">
                in Your Healing Journey
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Behind every username is a real person with real struggles and real victories. 
              <strong className="text-purple-600"> Join 100,000+ community members</strong> who've found 
              their tribe, their voice, and their path to healing.
            </p>
          </div>

          {/* Community Features Grid */}
          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
            style={{
              transform: isParallaxEnabled ? getTransform(0.05) : 'none',
              willChange: 'transform'
            }}
          >
            {communityFeatures.map((feature, index) => (
              <Card 
                key={index} 
                className="group bg-white border border-gray-200 hover:border-purple-300 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden h-full"
              >
                <CardContent className="p-8 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge 
                        variant="outline" 
                        className="bg-white border-gray-300 text-gray-700 hover:border-purple-400 text-xs"
                      >
                        {feature.highlight}
                      </Badge>
                      <div className="text-xs text-gray-600 text-right">{feature.participants}</div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed flex-grow">{feature.story}</p>
                  
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 group/btn w-full"
                    >
                      Join Community
                      <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Community Impact Section */}
          <div 
            className="bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 rounded-3xl p-12 border border-purple-100 relative overflow-hidden"
            style={{
              transform: isParallaxEnabled ? getTransform(0.15) : 'none',
              willChange: 'transform'
            }}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-10 left-10 w-20 h-20 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
            </div>
            
            <div className="max-w-6xl mx-auto text-center relative z-10">
              <div className="flex items-center justify-center mb-6">
                <CommunityIcon className="w-16 h-16 mr-4" />
                <h3 className="text-4xl font-bold text-gray-900">
                  A Community That Heals Together
                </h3>
              </div>
              
              <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-4xl mx-auto">
                Real stories from real people who found their strength through connection, 
                understanding, and shared hope in our global healing community.
              </p>
              
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-200">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                  <h4 className="text-2xl font-semibold mb-4 text-gray-900">100,000+ Members</h4>
                  <p className="text-gray-600 leading-relaxed">
                    A thriving global community where every voice matters and every story has the power to heal.
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-sm text-purple-600 font-semibold">Growing by 500+ members daily</div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-200">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <MessageSquare className="h-10 w-10 text-white" />
                  </div>
                  <h4 className="text-2xl font-semibold mb-4 text-gray-900">1M+ Conversations</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Millions of supportive messages exchanged, creating bonds that transcend distance and difference.
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-sm text-blue-600 font-semibold">24/7 peer support available</div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-green-200">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Lightbulb className="h-10 w-10 text-white" />
                  </div>
                  <h4 className="text-2xl font-semibold mb-4 text-gray-900">50,000+ Insights Shared</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Peer-tested coping strategies, breakthrough moments, and wisdom that can only come from lived experience.
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-sm text-green-600 font-semibold">Real strategies that work</div>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {supportTypes.map((group, index) => (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${group.color} flex items-center justify-center mb-4`}>
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-lg text-gray-900 mb-2">{group.type}</h4>
                    <p className="text-gray-600 text-sm mb-3">{group.description}</p>
                    <div className="text-xs text-gray-500">{group.members} active members</div>
                  </div>
                ))}
              </div>
              
              <div className="p-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl text-white">
                <h4 className="text-2xl font-bold mb-4">Your Journey Starts with One Connection</h4>
                <p className="text-lg mb-6 opacity-90">
                  Take the first step into a community that understands, supports, and celebrates your healing journey.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                    Join Support Groups
                  </Button>
                  <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg font-semibold">
                    Browse Forums
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SafeComponentWrapper>
  );
};

export default CommunitySection;