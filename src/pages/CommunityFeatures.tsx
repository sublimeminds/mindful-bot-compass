
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MessageSquare, 
  Heart, 
  Shield, 
  Crown,
  Star,
  Calendar,
  BookOpen,
  Award,
  Headphones,
  Lock,
  Zap,
  Globe,
  UserCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSafeSEO } from '@/hooks/useSafeSEO';
import PageLayout from '@/components/layout/PageLayout';

const CommunityFeatures = () => {
  const navigate = useNavigate();
  
  useSafeSEO({
    title: 'Community & Social Features - TherapySync',
    description: 'Connect with others on their mental health journey through safe, moderated support groups, peer connections, and shared experiences.',
    keywords: 'mental health community, support groups, peer support, therapy community, anonymous sharing'
  });

  const communityFeatures = [
    {
      icon: Users,
      title: "Support Groups",
      description: "Join specialized support groups for specific conditions, life situations, or therapy approaches.",
      features: ["ADHD Support", "Anxiety & Depression", "LGBTQ+ Safe Space", "Couples & Relationships", "Trauma Recovery"],
      tier: "free",
      color: "from-therapy-500 to-calm-500"
    },
    {
      icon: MessageSquare,
      title: "Anonymous Discussions",
      description: "Share experiences and insights anonymously with others who understand your journey.",
      features: ["Anonymous Posting", "Moderated Discussions", "Crisis Support", "24/7 Availability", "Safe Reporting"],
      tier: "free",
      color: "from-calm-500 to-therapy-500"
    },
    {
      icon: Heart,
      title: "Peer Connections",
      description: "Connect with accountability partners and therapy buddies for mutual support.",
      features: ["Buddy Matching", "Progress Sharing", "Milestone Celebrations", "Private Messaging", "Goal Accountability"],
      tier: "premium",
      color: "from-therapy-600 to-harmony-600"
    },
    {
      icon: Shield,
      title: "Moderated Safety",
      description: "AI-powered moderation and human oversight ensure a safe, supportive environment.",
      features: ["AI Content Filtering", "Human Moderators", "Crisis Detection", "Immediate Intervention", "Community Guidelines"],
      tier: "all",
      color: "from-balance-500 to-flow-500"
    }
  ];

  const socialFeatures = [
    { icon: Star, title: "Milestone Sharing", description: "Celebrate achievements publicly", tier: "premium" },
    { icon: Calendar, title: "Group Events", description: "Virtual meetups and activities", tier: "pro" },
    { icon: BookOpen, title: "Shared Resources", description: "Community curated content", tier: "free" },
    { icon: Award, title: "Community Badges", description: "Recognition for participation", tier: "premium" },
    { icon: Headphones, title: "Group Meditations", description: "Live guided sessions", tier: "pro" },
    { icon: UserCheck, title: "Verified Members", description: "Trusted community members", tier: "pro" }
  ];

  const safetyFeatures = [
    "End-to-end encryption for private messages",
    "AI-powered crisis detection and intervention",
    "Professional moderator oversight 24/7",
    "Anonymous reporting system",
    "Automatic content filtering for harmful material",
    "Emergency contact system integration",
    "Community guidelines enforcement",
    "User verification and identity protection"
  ];

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'free':
        return <Badge variant="secondary" className="ml-2">Free</Badge>;
      case 'premium':
        return <Badge className="ml-2 bg-gradient-to-r from-therapy-500 to-calm-500 text-white">Premium</Badge>;
      case 'pro':
        return <Badge className="ml-2 bg-gradient-to-r from-harmony-500 to-balance-500 text-white">Pro</Badge>;
      default:
        return null;
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-white to-calm-50">
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
            <Badge className="mb-6 therapy-gradient-bg text-white px-8 py-3 text-sm font-semibold shadow-lg border-0">
              <Users className="h-4 w-4 mr-2" />
              Community & Social Features
              <Heart className="h-4 w-4 ml-2" />
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="therapy-text-gradient-animated">
                Connect, Share, Heal Together
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Join a supportive community where mental health journeys are shared safely, 
              connections are meaningful, and healing happens together.
            </p>
          </div>

          {/* Core Community Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {communityFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      {getTierBadge(feature.tier)}
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-800">{feature.title}</CardTitle>
                    <p className="text-slate-600 text-lg leading-relaxed">{feature.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {feature.features.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center space-x-3">
                          <div className="w-2 h-2 therapy-gradient-bg rounded-full flex-shrink-0"></div>
                          <span className="text-sm text-slate-600 font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Additional Social Features */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="therapy-text-gradient">
                Social & Engagement Features
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {socialFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 therapy-gradient-bg rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-bold text-slate-800 mb-2 flex items-center justify-center">
                        {feature.title}
                        {getTierBadge(feature.tier)}
                      </h3>
                      <p className="text-sm text-slate-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Safety & Privacy Section */}
          <div className="mb-16">
            <Card className="bg-gradient-to-r from-therapy-500 to-calm-500 text-white border-0 shadow-2xl">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold mb-4">Safety & Privacy First</CardTitle>
                <p className="text-therapy-100 text-lg max-w-2xl mx-auto">
                  Your safety and privacy are our top priorities. We've built comprehensive 
                  safeguards to ensure a secure and supportive community environment.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {safetyFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                      <span className="text-therapy-100 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="therapy-gradient-bg rounded-3xl p-12 text-white shadow-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Join Our Community?
              </h2>
              <p className="text-xl mb-8 text-therapy-100 max-w-2xl mx-auto">
                Connect with others who understand your journey and start building meaningful 
                relationships in a safe, supportive environment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-white text-therapy-600 hover:bg-therapy-50 px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  onClick={() => navigate('/auth')}
                >
                  <Users className="h-5 w-5 mr-2" />
                  Join Community
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                  onClick={() => navigate('/community')}
                >
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Browse Groups
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default CommunityFeatures;
