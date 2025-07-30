import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, MessageSquare, BookOpen, Award, Heart, Sparkles } from 'lucide-react';

const CommunitySection = () => {
  const communityFeatures = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "Support Groups",
      description: "Join anonymous support groups with others facing similar challenges",
      participants: "15,000+ members",
      highlight: "Peer Support"
    },
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Community Forums",
      description: "Share experiences and get advice in a safe, moderated environment",
      participants: "50,000+ posts",
      highlight: "Active Discussions"
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Resource Library",
      description: "Access thousands of articles, exercises, and self-help resources",
      participants: "10,000+ resources",
      highlight: "Expert Content"
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Wellness Challenges",
      description: "Participate in monthly wellness challenges with the community",
      participants: "25,000+ participants",
      highlight: "Monthly Events"
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
    <div className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-purple-100 text-purple-800 border-purple-200">
            Community & Support
          </Badge>
          <h2 className="text-4xl font-bold text-white mb-6">
            You're Not Alone in This Journey
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Connect with a supportive community of individuals who understand your experiences. 
            Share, learn, and grow together in a safe and nurturing environment.
          </p>
        </div>

        {/* Community Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {communityFeatures.map((feature, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 text-center">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4 text-purple-400">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg text-white mb-2">{feature.title}</h3>
                <p className="text-white/80 text-sm mb-3 leading-relaxed">{feature.description}</p>
                <div className="space-y-2">
                  <Badge className="bg-purple-100/20 text-purple-200 border-purple-200/30">
                    {feature.highlight}
                  </Badge>
                  <div className="text-xs text-white/70">{feature.participants}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Support Groups */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-white text-center mb-8">Popular Support Groups</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportTypes.map((group, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${group.color} flex items-center justify-center mb-4`}>
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-white mb-2">{group.type}</h4>
                  <p className="text-white/80 text-sm mb-3">{group.description}</p>
                  <div className="text-xs text-white/70">{group.members} members</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Sparkles className="h-6 w-6 mr-2 text-yellow-400" />
                Upcoming Events
              </h3>
              <div className="space-y-4">
                {events.map((event, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                    <div>
                      <div className="font-semibold text-white">{event.title}</div>
                      <div className="text-sm text-white/70">{event.time}</div>
                    </div>
                    <Badge className="bg-yellow-100/20 text-yellow-200 border-yellow-200/30">
                      {event.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md border-white/20">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold text-white mb-4">Join Our Community</h3>
              <p className="text-white/90 mb-6">
                Connect with thousands of members who are on their own journey to better mental health. 
                Share experiences, find support, and discover you're never alone.
              </p>
              <div className="space-y-3">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  Join Support Groups
                </Button>
                <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10">
                  Browse Community Forums
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CommunitySection;