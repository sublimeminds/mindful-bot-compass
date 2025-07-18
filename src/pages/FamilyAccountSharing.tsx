import React from 'react';
import { Users, Shield, Heart, Settings, Star, Calendar, UserPlus, Lock, Eye, Bell, Award, TrendingUp, ArrowRight, Check, Play, Globe, Smartphone, MessageSquare, Video, BarChart3, Clock, Zap } from 'lucide-react';

const FamilyAccountSharing = () => {
  const features = [
    {
      icon: Shield,
      title: "Advanced Parental Controls",
      description: "Comprehensive security controls for monitoring and managing family member access with age-appropriate content filtering",
      gradient: "from-blue-500 to-indigo-600",
      features: ["Content Filtering", "Session Monitoring", "Time Limits", "Privacy Controls"]
    },
    {
      icon: Heart,
      title: "Shared Family Progress",
      description: "Track family wellness goals, celebrate achievements together, and build stronger connections through shared milestones",
      gradient: "from-red-500 to-pink-600",
      features: ["Goal Tracking", "Milestone Celebrations", "Progress Sharing", "Family Insights"]
    },
    {
      icon: Settings,
      title: "Personalized Settings",
      description: "Individual therapy settings and preferences for each family member while maintaining family oversight and coordination",
      gradient: "from-purple-500 to-violet-600",
      features: ["Individual Profiles", "Custom Preferences", "Therapy Matching", "Privacy Settings"]
    },
    {
      icon: UserPlus,
      title: "Multi-User Management",
      description: "Easy account management for multiple family members with role-based permissions and access controls",
      gradient: "from-green-500 to-emerald-600",
      features: ["Role Management", "User Permissions", "Account Linking", "Family Hierarchy"]
    },
    {
      icon: Bell,
      title: "Family Notifications",
      description: "Stay connected with important updates, achievements, and alerts across all family members",
      gradient: "from-orange-500 to-amber-600",
      features: ["Real-time Alerts", "Progress Updates", "Achievement Notifications", "Emergency Alerts"]
    },
    {
      icon: BarChart3,
      title: "Family Analytics",
      description: "Comprehensive insights into family mental health trends, progress patterns, and collaborative wellness metrics",
      gradient: "from-cyan-500 to-blue-600",
      features: ["Family Insights", "Trend Analysis", "Wellness Metrics", "Progress Reports"]
    }
  ];

  const plans = [
    {
      name: "Family Starter",
      members: "Up to 4 members",
      price: "$29",
      period: "/month",
      features: [
        "Basic parental controls",
        "Shared progress tracking",
        "Individual therapy sessions",
        "Family milestone tracking",
        "Basic analytics dashboard",
        "Email support"
      ],
      popular: false
    },
    {
      name: "Family Pro",
      members: "Up to 6 members",
      price: "$49",
      period: "/month",
      features: [
        "Advanced parental controls",
        "Real-time family insights",
        "Group therapy sessions",
        "Crisis support integration",
        "Advanced analytics & reports",
        "24/7 priority support",
        "Family coaching sessions"
      ],
      popular: true
    },
    {
      name: "Family Enterprise",
      members: "Unlimited members",
      price: "$89",
      period: "/month",
      features: [
        "Enterprise-grade security",
        "Custom family programs",
        "Dedicated family coordinator",
        "White-label solutions",
        "API access",
        "Custom integrations",
        "On-premise deployment"
      ],
      popular: false
    }
  ];

  const stats = [
    { label: "Active Family Accounts", value: "12.5K", suffix: "+" },
    { label: "Family Members Served", value: "48.2K", suffix: "+" },
    { label: "Family Satisfaction", value: "96", suffix: "%" },
    { label: "Average Engagement", value: "4.2x", suffix: "" }
  ];

  const benefits = [
    {
      icon: Lock,
      title: "Privacy & Security First",
      description: "Bank-grade encryption and privacy controls ensure your family's data is always secure"
    },
    {
      icon: Globe,
      title: "Global Accessibility",
      description: "Access your family account from anywhere with seamless synchronization"
    },
    {
      icon: Smartphone,
      title: "Multi-Device Support",
      description: "Works across all devices - phones, tablets, desktops, and smart TVs"
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Round-the-clock access to support and emergency resources"
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
              Family Account Sharing
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
              Comprehensive family mental health support with shared accounts, parental controls, and collaborative wellness tracking
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
                Create Family Account
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-white/80 backdrop-blur-sm text-therapy-600 border border-therapy-200 px-8 py-4 rounded-xl font-semibold hover:bg-white transition-all duration-300 flex items-center gap-2">
                <Play className="h-4 w-4" />
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Complete Family Wellness Solution
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything your family needs for collaborative mental health support and growth
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
              
              <div className="space-y-2">
                {feature.features.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Families Choose TherapySync
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Built with families in mind - secure, accessible, and designed for collaborative wellness
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

        {/* Pricing Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Choose Your Family Plan
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Flexible pricing options designed to grow with your family's needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, index) => (
            <div key={index} className={`bg-white rounded-2xl p-8 shadow-sm border transition-all duration-300 hover:shadow-lg ${plan.popular ? 'border-therapy-500 ring-2 ring-therapy-500/20 scale-105' : 'border-border hover:-translate-y-1'}`}>
              {plan.popular && (
                <div className="bg-gradient-to-r from-therapy-500 to-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-full text-center mb-6">
                  Most Popular
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                <p className="text-muted-foreground mb-4">{plan.members}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${plan.popular ? 'bg-gradient-to-r from-therapy-600 to-blue-600 text-white hover:shadow-lg' : 'bg-gray-100 text-foreground hover:bg-gray-200'}`}>
                Get Started
              </button>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="relative bg-gradient-to-r from-therapy-600 via-blue-600 to-indigo-600 rounded-3xl p-12 text-center text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Start Your Family's Mental Health Journey Today
            </h2>
            <p className="text-xl mb-8 text-white/90 max-w-3xl mx-auto">
              Join thousands of families who have transformed their mental health with collaborative care and shared support
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-therapy-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl">
                Create Family Account
              </button>
              <button className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-8 py-4 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyAccountSharing;