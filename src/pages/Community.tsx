
import React from 'react';
import { Users, MessageSquare, Calendar, Heart, Shield, Star, Award, TrendingUp, Globe, Coffee, Lightbulb, Target, ArrowRight, Check, Play, Video, Mic, Camera, BookOpen, Hand, TreePine, Music, Bell, Activity, Zap, Plus, Search } from 'lucide-react';

const Community = () => {
  const communityFeatures = [
    {
      icon: Users,
      title: "Support Groups",
      description: "Join specialized support groups based on your specific mental health goals and challenges",
      gradient: "from-blue-500 to-indigo-600",
      features: ["Peer Support", "Expert Moderation", "Safe Spaces", "24/7 Access"],
      members: "50K+"
    },
    {
      icon: MessageSquare,
      title: "Discussion Forums",
      description: "Engage in meaningful conversations about mental health topics with a supportive community",
      gradient: "from-green-500 to-emerald-600",
      features: ["Topic-Based", "Anonymous Options", "Expert Insights", "Moderated Content"],
      members: "125K+"
    },
    {
      icon: Calendar,
      title: "Group Events",
      description: "Participate in virtual events, workshops, and group therapy sessions with fellow members",
      gradient: "from-purple-500 to-violet-600",
      features: ["Live Sessions", "Workshops", "Webinars", "Social Events"],
      members: "75K+"
    },
    {
      icon: Award,
      title: "Milestone Sharing",
      description: "Celebrate your progress and achievements with a community that understands your journey",
      gradient: "from-orange-500 to-amber-600",
      features: ["Progress Tracking", "Achievement Badges", "Peer Recognition", "Inspiration"],
      members: "200K+"
    },
    {
      icon: Shield,
      title: "Crisis Support Network",
      description: "Access immediate peer support and professional resources during difficult moments",
      gradient: "from-red-500 to-pink-600",
      features: ["24/7 Support", "Crisis Protocols", "Professional Backup", "Immediate Response"],
      members: "25K+"
    },
    {
      icon: Lightbulb,
      title: "Wellness Challenges",
      description: "Join community challenges to build healthy habits and achieve wellness goals together",
      gradient: "from-cyan-500 to-blue-600",
      features: ["Group Challenges", "Habit Building", "Progress Tracking", "Rewards System"],
      members: "180K+"
    }
  ];

  const communityGroups = [
    {
      name: "Anxiety Support Circle",
      members: "12.5K",
      category: "Mental Health",
      description: "A safe space for sharing anxiety management strategies",
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      name: "Depression Recovery Network",
      members: "8.3K",
      category: "Mental Health",
      description: "Supporting each other through depression recovery",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      name: "Mindfulness & Meditation",
      members: "15.7K",
      category: "Wellness",
      description: "Daily meditation and mindfulness practice group",
      gradient: "from-purple-500 to-violet-600"
    },
    {
      name: "Young Adults Mental Health",
      members: "9.2K",
      category: "Age-Specific",
      description: "Mental health support for young adults (18-25)",
      gradient: "from-orange-500 to-amber-600"
    },
    {
      name: "Family & Caregivers",
      members: "6.8K",
      category: "Support",
      description: "For families and caregivers of those with mental health challenges",
      gradient: "from-red-500 to-pink-600"
    },
    {
      name: "Workplace Wellness",
      members: "11.4K",
      category: "Professional",
      description: "Managing mental health in professional environments",
      gradient: "from-cyan-500 to-blue-600"
    }
  ];

  const stats = [
    { label: "Active Members", value: "2.1M", suffix: "" },
    { label: "Support Groups", value: "850", suffix: "+" },
    { label: "Daily Interactions", value: "45K", suffix: "+" },
    { label: "Success Stories", value: "125K", suffix: "+" }
  ];

  const benefits = [
    {
      icon: Heart,
      title: "Emotional Support",
      description: "Connect with people who understand your journey and provide genuine support"
    },
    {
      icon: Globe,
      title: "Global Community",
      description: "Access support from members around the world, available 24/7"
    },
    {
      icon: Coffee,
      title: "Peer Learning",
      description: "Learn practical strategies and coping mechanisms from peer experiences"
    },
    {
      icon: Target,
      title: "Accountability",
      description: "Stay motivated with community accountability and encouragement"
    }
  ];

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
              Connect with a supportive community of millions on their mental health journey. Find your tribe, share experiences, and grow together.
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
                Join Community
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-white/80 backdrop-blur-sm text-therapy-600 border border-therapy-200 px-8 py-4 rounded-xl font-semibold hover:bg-white transition-all duration-300 flex items-center gap-2">
                <Play className="h-4 w-4" />
                Explore Groups
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Community Features */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need for Community Support
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive community features designed to foster connection, support, and growth
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {communityFeatures.map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-border hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{feature.description}</p>
              
              <div className="space-y-2 mb-4">
                {feature.features.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-therapy-600 font-semibold text-sm">{feature.members} members</span>
                <button className="text-therapy-600 hover:text-therapy-700 transition-colors">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Popular Groups */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Popular Support Groups
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of members in our most active and supportive communities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {communityGroups.map((group, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-all duration-300 group">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${group.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Users className="h-6 w-6 text-white" />
                </div>
                <span className="text-xs bg-therapy-100 text-therapy-700 px-2 py-1 rounded-full">{group.category}</span>
              </div>
              
              <h3 className="text-lg font-semibold text-foreground mb-2">{group.name}</h3>
              <p className="text-muted-foreground text-sm mb-4">{group.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{group.members} members</span>
                <button className="bg-therapy-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-therapy-600 transition-colors">
                  Join
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Join Our Community
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the power of connection and support in your mental health journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-all duration-300 group text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-therapy-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                <benefit.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground text-sm">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="relative bg-gradient-to-r from-therapy-600 via-blue-600 to-indigo-600 rounded-3xl p-12 text-center text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Connect with Your Community?
            </h2>
            <p className="text-xl mb-8 text-white/90 max-w-3xl mx-auto">
              Join millions of people on their mental health journey. Find support, share experiences, and grow together in a safe, moderated environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-therapy-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl">
                Join Community Free
              </button>
              <button className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-8 py-4 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300">
                Browse Groups
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
