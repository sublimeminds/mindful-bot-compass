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
    <div className="min-h-screen flex flex-col justify-center w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto w-full space-y-8 sm:space-y-12 lg:space-y-16">
        <div className="text-center space-y-4 sm:space-y-6">
          <Badge className="bg-white text-gray-900 border-gray-200">
            Community & Support
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            You're Not Alone in This Journey
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Connect with a supportive community of individuals who understand your experiences. 
            Share, learn, and grow together in a safe and nurturing environment.
          </p>
        </div>

        {/* Community Features - Mobile: 2x2 grid, Desktop: 4 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {communityFeatures.map((feature, index) => (
            <Card key={index} className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
              <CardContent className="p-4 sm:p-6">
                <div className="flex justify-center mb-3 sm:mb-4 text-therapy-600">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-3 leading-relaxed">{feature.description}</p>
                <div className="space-y-2">
                  <Badge className="bg-therapy-100 text-therapy-700 border-therapy-200 text-xs">
                    {feature.highlight}
                  </Badge>
                  <div className="text-xs text-gray-600">{feature.participants}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Support Groups */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Popular Support Groups</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportTypes.map((group, index) => (
              <Card key={index} className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${group.color} flex items-center justify-center mb-4`}>
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{group.type}</h4>
                  <p className="text-gray-600 text-sm mb-3">{group.description}</p>
                  <div className="text-xs text-gray-500">{group.members} members</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="bg-white border-gray-200 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Sparkles className="h-6 w-6 mr-2 text-yellow-500" />
                Upcoming Events
              </h3>
              <div className="space-y-4">
                {events.map((event, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-semibold text-gray-900">{event.title}</div>
                      <div className="text-sm text-gray-600">{event.time}</div>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                      {event.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-lg">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Join Our Community</h3>
              <p className="text-gray-600 mb-6">
                Connect with thousands of members who are on their own journey to better mental health. 
                Share experiences, find support, and discover you're never alone.
              </p>
              <div className="space-y-3">
                <Button className="w-full bg-therapy-600 text-white hover:bg-therapy-700">
                  Join Support Groups
                </Button>
                <Button variant="outline" className="w-full border-gray-200 text-gray-900 hover:bg-gray-50">
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