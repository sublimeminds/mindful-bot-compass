import React, { useState } from 'react';
import { Users, MessageCircle, Heart, Star, Trophy, Calendar, Clock, Globe, Shield, Video, Headphones, Mic, UserPlus, TrendingUp, Award, BookOpen, ArrowRight, Check, Play, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CommunityGroups = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Groups');

  const features = [
    {
      icon: Users,
      title: "Support Groups",
      description: "Join specialized support groups for different mental health topics with peer guidance and professional moderation",
      gradient: "from-blue-500 to-indigo-600",
      stats: "45+ Active Groups",
      members: "12.5K+ Members"
    },
    {
      icon: Heart,
      title: "Peer Support Network",
      description: "Connect with others who understand your experiences through safe, moderated peer-to-peer connections",
      gradient: "from-red-500 to-pink-600",
      stats: "98% Satisfaction",
      members: "8.7K+ Connections"
    },
    {
      icon: Calendar,
      title: "Group Activities & Events",
      description: "Participate in guided group activities, workshops, and virtual events designed for mental wellness",
      gradient: "from-green-500 to-emerald-600",
      stats: "Weekly Events",
      members: "6.2K+ Participants"
    },
    {
      icon: Video,
      title: "Virtual Group Sessions",
      description: "Join live video sessions with AI therapists and community members for real-time support and guidance",
      gradient: "from-purple-500 to-violet-600",
      stats: "24/7 Available",
      members: "15+ Daily Sessions"
    },
    {
      icon: Shield,
      title: "Safe Space Guarantee",
      description: "All groups are professionally moderated with strict privacy policies and community guidelines",
      gradient: "from-orange-500 to-amber-600",
      stats: "100% Moderated",
      members: "Zero Tolerance Policy"
    },
    {
      icon: BookOpen,
      title: "Educational Workshops",
      description: "Learn new coping strategies, mental health techniques, and wellness practices in group learning environments",
      gradient: "from-cyan-500 to-blue-600",
      stats: "50+ Topics",
      members: "4.8★ Average Rating"
    }
  ];

  const communityGroups = [
    {
      id: 1,
      name: "Anxiety Support Circle",
      description: "A safe space for those dealing with anxiety disorders to share experiences and coping strategies",
      members: 1247,
      category: "Mental Health",
      schedule: "Daily 7 PM EST",
      moderator: "Dr. Sarah Chen",
      isLive: true,
      tags: ["Anxiety", "CBT", "Mindfulness"]
    },
    {
      id: 2,
      name: "Depression Recovery Group",
      description: "Supporting each other through depression with compassion, understanding, and professional guidance",
      members: 892,
      category: "Mental Health", 
      schedule: "Mon, Wed, Fri 6 PM EST",
      moderator: "Dr. Marcus Johnson",
      isLive: false,
      tags: ["Depression", "Recovery", "Support"]
    },
    {
      id: 3,
      name: "Trauma Survivors Network",
      description: "A healing community for trauma survivors with specialized support and evidence-based recovery approaches",
      members: 634,
      category: "Trauma",
      schedule: "Tue, Thu 8 PM EST",
      moderator: "Dr. Elena Rodriguez",
      isLive: false,
      tags: ["Trauma", "PTSD", "EMDR", "Healing"]
    },
    {
      id: 4,
      name: "Mindfulness & Meditation",
      description: "Practice mindfulness together with guided meditations and present-moment awareness techniques",
      members: 1589,
      category: "Wellness",
      schedule: "Daily 6 AM & 8 PM EST",
      moderator: "Dr. Alex Kim",
      isLive: true,
      tags: ["Mindfulness", "Meditation", "Stress Relief"]
    },
    {
      id: 5,
      name: "Family Wellness Hub",
      description: "Supporting families in their mental health journey with relationship skills and communication strategies",
      members: 423,
      category: "Family",
      schedule: "Weekends 3 PM EST",
      moderator: "Dr. Priya Patel",
      isLive: false,
      tags: ["Family", "Relationships", "Communication"]
    },
    {
      id: 6,
      name: "Young Adults Connect",
      description: "Peer support specifically for young adults navigating life transitions, career stress, and relationships",
      members: 2156,
      category: "Life Stages",
      schedule: "Nightly 9 PM EST",
      moderator: "Dr. Maya Singh",
      isLive: true,
      tags: ["Young Adults", "Career", "Transitions"]
    }
  ];

  const categories = [
    'All Groups',
    'Mental Health',
    'Trauma',
    'Wellness',
    'Family',
    'Life Stages'
  ];

  const stats = [
    { label: "Active Communities", value: "45", suffix: "+" },
    { label: "Total Members", value: "18.2K", suffix: "+" },
    { label: "Weekly Sessions", value: "120", suffix: "+" },
    { label: "Member Satisfaction", value: "96", suffix: "%" }
  ];

  const filteredGroups = selectedCategory === 'All Groups' 
    ? communityGroups 
    : communityGroups.filter(group => group.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-therapy-600/10 to-blue-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-therapy-500 to-blue-500 rounded-2xl mb-8 shadow-lg">
              <Users className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-therapy-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Community & Groups
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
              Connect with supportive communities, join guided group sessions, and build lasting connections on your mental health journey
            </p>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/40 shadow-sm">
                  <div className="text-2xl md:text-3xl font-bold text-therapy-600 mb-1">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-therapy-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2 group">
                Join Our Community
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-white/80 backdrop-blur-sm text-therapy-600 border border-therapy-200 px-8 py-4 rounded-xl font-semibold hover:bg-white transition-all duration-300 flex items-center gap-2">
                <Play className="h-4 w-4" />
                Community Tour
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Community Features & Support
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need for meaningful connections and peer support in your mental health journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-border hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{feature.description}</p>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-therapy-600 font-medium">{feature.stats}</span>
                <span className="text-muted-foreground">{feature.members}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Group Categories */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Active Support Groups
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Find your community and connect with others who share similar experiences and goals
          </p>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-therapy-600 text-white shadow-lg'
                    : 'bg-white text-therapy-600 border border-therapy-200 hover:bg-therapy-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {filteredGroups.map((group) => (
            <Card key={group.id} className="bg-white border border-border hover:shadow-lg transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg font-bold">{group.name}</CardTitle>
                      {group.isLive && (
                        <Badge variant="destructive" className="bg-red-500 text-white text-xs animate-pulse">
                          LIVE
                        </Badge>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs mb-2">
                      {group.category}
                    </Badge>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{group.members.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {group.description}
                </p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-therapy-500" />
                    <span>{group.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-therapy-500" />
                    <span>Moderated by {group.moderator}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {group.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-therapy-500 to-blue-500 text-white hover:shadow-lg transition-all duration-300"
                    size="sm"
                  >
                    Join Group
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-therapy-200 text-therapy-600 hover:bg-therapy-50"
                  >
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Community Guidelines */}
        <div className="bg-gradient-to-r from-therapy-50 to-blue-50 rounded-2xl p-8 mb-20">
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
            Community Guidelines & Safety
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-3 mx-auto">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2">Safe Environment</h4>
              <p className="text-sm text-muted-foreground">All groups are professionally moderated 24/7</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-3 mx-auto">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2">Respect & Empathy</h4>
              <p className="text-sm text-muted-foreground">Treat all members with kindness and understanding</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-3 mx-auto">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2">Privacy First</h4>
              <p className="text-sm text-muted-foreground">Your information and discussions remain confidential</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-3 mx-auto">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold mb-2">Constructive Support</h4>
              <p className="text-sm text-muted-foreground">Focus on encouragement and positive peer support</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative bg-gradient-to-r from-therapy-600 via-blue-600 to-indigo-600 rounded-3xl p-12 text-center text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Join Our Community?
            </h2>
            <p className="text-xl mb-8 text-white/90 max-w-3xl mx-auto">
              Connect with thousands of supportive community members and start building meaningful relationships today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-therapy-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl">
                Create Account & Join
              </button>
              <button className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-8 py-4 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300">
                Browse Communities
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityGroups;