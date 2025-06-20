
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MessageCircle, Heart, Star, Calendar, Shield, UserPlus, Bookmark, TrendingUp, Award } from 'lucide-react';

const Community = () => {
  const supportGroups = [
    {
      name: 'Anxiety Support Circle',
      members: 247,
      description: 'A safe space to share experiences and coping strategies for anxiety management.',
      nextMeeting: '2024-06-22 7:00 PM',
      isActive: true
    },
    {
      name: 'Depression Recovery Group',
      members: 189,
      description: 'Supporting each other through depression with understanding and encouragement.',
      nextMeeting: '2024-06-23 6:30 PM',
      isActive: true
    },
    {
      name: 'Mindfulness & Meditation',
      members: 312,
      description: 'Exploring mindfulness practices and meditation techniques together.',
      nextMeeting: '2024-06-24 8:00 PM',
      isActive: true
    },
    {
      name: 'Young Adults Mental Health',
      members: 156,
      description: 'Mental health support specifically for young adults navigating life transitions.',
      nextMeeting: '2024-06-25 7:30 PM',
      isActive: true
    }
  ];

  const communityStats = [
    { label: 'Active Members', value: '2,847', icon: Users },
    { label: 'Support Groups', value: '24', icon: MessageCircle },
    { label: 'Weekly Sessions', value: '72', icon: Calendar },
    { label: 'Success Stories', value: '431', icon: Star }
  ];

  const featuredStories = [
    {
      title: 'Finding Hope Again',
      author: 'Sarah M.',
      excerpt: 'After months of struggling with anxiety, I found my path to healing through this community...',
      readTime: '3 min read',
      likes: 42
    },
    {
      title: 'My Journey with Depression',
      author: 'Michael R.',
      excerpt: 'The support I received here helped me realize I wasn\'t alone in my struggles...',
      readTime: '5 min read',
      likes: 38
    },
    {
      title: 'Building Confidence Through Connection',
      author: 'Emma L.',
      excerpt: 'Sharing my story and hearing others helped me build the confidence I needed...',
      readTime: '4 min read',
      likes: 56
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <div className="bg-gradient-to-br from-therapy-50 to-harmony-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Users className="h-12 w-12 text-therapy-600 mr-3" />
              <h1 className="text-4xl font-bold text-therapy-900">Community</h1>
            </div>
            <p className="text-xl text-therapy-600 max-w-3xl mx-auto">
              Connect with others on their mental health journey and find support in our compassionate community.
            </p>
          </div>

          {/* Community Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {communityStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <IconComponent className="h-8 w-8 text-therapy-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-therapy-900">{stat.value}</div>
                    <div className="text-sm text-therapy-600">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Support Groups */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-therapy-900">Active Support Groups</h2>
              <Button className="bg-therapy-600 hover:bg-therapy-700">
                <UserPlus className="h-4 w-4 mr-2" />
                Join a Group
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {supportGroups.map((group, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-therapy-800">{group.name}</CardTitle>
                      <div className="flex items-center text-sm text-therapy-600">
                        <Users className="h-4 w-4 mr-1" />
                        {group.members}
                      </div>
                    </div>
                    <p className="text-therapy-600">{group.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-therapy-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        Next: {group.nextMeeting}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                        <Button size="sm" className="bg-therapy-600 hover:bg-therapy-700">
                          Join
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Featured Success Stories */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-therapy-900">Success Stories</h2>
              <Button variant="outline">
                <Star className="h-4 w-4 mr-2" />
                View All Stories
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredStories.map((story, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg text-therapy-800">{story.title}</CardTitle>
                    <p className="text-sm text-therapy-600">by {story.author}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-therapy-700 mb-4">{story.excerpt}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-therapy-600">{story.readTime}</span>
                      <div className="flex items-center text-therapy-600">
                        <Heart className="h-4 w-4 mr-1" />
                        {story.likes}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Community Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-therapy-600 mx-auto mb-4" />
                <CardTitle className="text-therapy-800">Safe Environment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-therapy-600">
                  Our community is moderated 24/7 to ensure a safe, supportive environment for all members.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Award className="h-12 w-12 text-therapy-600 mx-auto mb-4" />
                <CardTitle className="text-therapy-800">Peer Recognition</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-therapy-600">
                  Celebrate milestones and achievements with others who understand your journey.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-therapy-600 mx-auto mb-4" />
                <CardTitle className="text-therapy-800">Progress Together</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-therapy-600">
                  Track your progress and support others as you all work toward better mental health.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Card className="max-w-2xl mx-auto bg-gradient-to-r from-therapy-600 to-harmony-600 text-white">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Ready to Join Our Community?</h3>
                <p className="text-therapy-100 mb-6">
                  Take the first step toward connecting with others who understand your journey. 
                  Our community is here to support you every step of the way.
                </p>
                <Button size="lg" className="bg-white text-therapy-600 hover:bg-therapy-50">
                  Get Started Today
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Community;
