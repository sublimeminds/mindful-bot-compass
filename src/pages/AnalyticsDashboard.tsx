import React from 'react';
import { BarChart3, TrendingUp, Activity, Target, Brain, Calendar, ArrowRight, Check, Play, Users, Clock, Zap, Globe, Eye, Database, PieChart, LineChart, Gauge, Settings, Bell } from 'lucide-react';

const AnalyticsDashboard = () => {
  const features = [
    {
      icon: TrendingUp,
      title: "Advanced Progress Analytics",
      description: "Track your therapy progress with detailed trend analysis, pattern recognition, and predictive insights",
      gradient: "from-blue-500 to-indigo-600",
      features: ["Trend Analysis", "Pattern Recognition", "Predictive Insights", "Goal Tracking"]
    },
    {
      icon: Activity,
      title: "Real-Time Activity Insights",
      description: "Comprehensive insights into your therapy activities, engagement levels, and behavioral patterns",
      gradient: "from-green-500 to-emerald-600",
      features: ["Activity Monitoring", "Engagement Metrics", "Behavioral Patterns", "Session Analysis"]
    },
    {
      icon: Target,
      title: "Goal Achievement Tracking",
      description: "Monitor progress toward your therapy goals with visual dashboards and milestone celebrations",
      gradient: "from-purple-500 to-violet-600",
      features: ["Visual Dashboards", "Milestone Tracking", "Achievement Badges", "Progress Reports"]
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Advanced AI analysis of your therapy data to provide personalized recommendations and insights",
      gradient: "from-orange-500 to-amber-600",
      features: ["AI Analysis", "Personalized Recommendations", "Predictive Modeling", "Smart Alerts"]
    },
    {
      icon: PieChart,
      title: "Interactive Visualizations",
      description: "Beautiful, interactive charts and graphs that make your therapy data easy to understand",
      gradient: "from-red-500 to-pink-600",
      features: ["Interactive Charts", "Custom Dashboards", "Data Visualization", "Export Options"]
    },
    {
      icon: Database,
      title: "Comprehensive Reporting",
      description: "Generate detailed reports for yourself, family members, or healthcare providers",
      gradient: "from-cyan-500 to-blue-600",
      features: ["Custom Reports", "Healthcare Provider Sharing", "Family Insights", "Export Features"]
    }
  ];

  const analyticTypes = [
    {
      name: "Mood Analytics",
      description: "Track mood patterns and emotional trends",
      icon: Activity,
      metrics: "15+ metrics"
    },
    {
      name: "Session Analytics",
      description: "Analyze therapy session effectiveness",
      icon: Clock,
      metrics: "20+ insights"
    },
    {
      name: "Goal Progress",
      description: "Monitor therapy goal achievements",
      icon: Target,
      metrics: "Custom tracking"
    },
    {
      name: "Behavioral Patterns",
      description: "Identify behavioral trends and triggers",
      icon: Brain,
      metrics: "AI-powered"
    }
  ];

  const stats = [
    { label: "Data Points Analyzed", value: "2.5M", suffix: "+" },
    { label: "Analytics Reports Generated", value: "125K", suffix: "+" },
    { label: "Insights Accuracy", value: "94", suffix: "%" },
    { label: "User Satisfaction", value: "4.8", suffix: "/5" }
  ];

  const benefits = [
    {
      icon: Eye,
      title: "Clear Insights",
      description: "Transform complex therapy data into clear, actionable insights"
    },
    {
      icon: Globe,
      title: "Universal Access",
      description: "Access your analytics from any device, anywhere in the world"
    },
    {
      icon: Zap,
      title: "Real-Time Updates",
      description: "Get instant updates as your therapy data changes and evolves"
    },
    {
      icon: Settings,
      title: "Customizable",
      description: "Tailor your analytics dashboard to focus on what matters most"
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
              <BarChart3 className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-therapy-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Analytics Dashboard
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
              Advanced analytics with custom reporting, AI-powered insights, and comprehensive data visualization for your mental health journey
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
                View Dashboard
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
            Powerful Analytics Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive analytics tools designed to provide deep insights into your mental health journey
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

        {/* Analytics Types */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Analytics Categories
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore different types of analytics available in your dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {analyticTypes.map((type, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-all duration-300 group text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-therapy-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                <type.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{type.name}</h3>
              <p className="text-muted-foreground text-sm mb-3">{type.description}</p>
              <div className="text-therapy-600 font-semibold text-sm">{type.metrics}</div>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose Our Analytics
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Advanced analytics capabilities designed for mental health professionals and patients
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
              Unlock Advanced Analytics Today
            </h2>
            <p className="text-xl mb-8 text-white/90 max-w-3xl mx-auto">
              Get deeper insights into your therapy journey with our premium analytics dashboard and AI-powered recommendations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-therapy-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl">
                Upgrade to Premium
              </button>
              <button className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-8 py-4 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300">
                View Sample Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;