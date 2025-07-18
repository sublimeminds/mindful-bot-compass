import React from 'react';
import { Zap, Shield, Eye, BarChart, Smartphone, Calendar, MessageSquare, Activity, Brain, Heart, Clock, Globe, ArrowRight, Check, Play, Star, Users, Lock, Wifi, Database, Cloud, Gauge, TrendingUp, Bell, Settings, Link, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const IntegrationsHub = () => {
  const stats = [
    { label: "Active Integrations", value: "200", suffix: "+" },
    { label: "Connected Users", value: "2.4M", suffix: "" },
    { label: "Data Points Synced", value: "1.2B", suffix: "+" },
    { label: "Uptime Guarantee", value: "99.9", suffix: "%" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-therapy-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-therapy-600/10 to-blue-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-therapy-500 to-blue-500 rounded-2xl mb-8 shadow-lg">
              <Zap className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-therapy-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Integrations Hub
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
              Connect your favorite apps and tools to create a seamless, unified mental health ecosystem with powerful insights
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
                Browse Integrations
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

      <div className="max-w-7xl mx-auto px-4 py-16">

        {/* Available Integrations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <Heart className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Health & Fitness</h3>
            <p className="text-gray-600 mb-4">
              Apple Health, Google Fit, Fitbit, MyFitnessPal, Strava
            </p>
            <span className="text-sm text-therapy-600 font-medium">20+ Apps Available</span>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <Calendar className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Calendar & Scheduling</h3>
            <p className="text-gray-600 mb-4">
              Google Calendar, Outlook, Apple Calendar, Calendly
            </p>
            <span className="text-sm text-therapy-600 font-medium">8+ Apps Available</span>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <Activity className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Mindfulness & Wellness</h3>
            <p className="text-gray-600 mb-4">
              Headspace, Calm, Insight Timer, Ten Percent Happier
            </p>
            <span className="text-sm text-therapy-600 font-medium">12+ Apps Available</span>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <Smartphone className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Sleep & Recovery</h3>
            <p className="text-gray-600 mb-4">
              Sleep Cycle, Oura Ring, Sleep Score, AutoSleep
            </p>
            <span className="text-sm text-therapy-600 font-medium">15+ Apps Available</span>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <Database className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Electronic Health Records</h3>
            <p className="text-gray-600 mb-4">
              Epic MyChart, Cerner HealtheLife, Allscripts
            </p>
            <span className="text-sm text-therapy-600 font-medium">5+ EHR Systems</span>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <Zap className="h-8 w-8 text-therapy-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Productivity & Mood</h3>
            <p className="text-gray-600 mb-4">
              Notion, Todoist, Daylio, Moodpath, Journey
            </p>
            <span className="text-sm text-therapy-600 font-medium">18+ Apps Available</span>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-therapy-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-therapy-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Private</h3>
            <p className="text-gray-600">All integrations use encrypted connections and comply with HIPAA standards</p>
          </div>
          
          <div className="text-center">
            <div className="bg-therapy-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-therapy-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Holistic View</h3>
            <p className="text-gray-600">Get a complete picture of your mental and physical health in one place</p>
          </div>
          
          <div className="text-center">
            <div className="bg-therapy-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-8 w-8 text-therapy-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Better Insights</h3>
            <p className="text-gray-600">AI-powered analysis helps identify patterns and personalize your therapy</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-therapy-600 text-white rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Connect Your Apps?</h2>
          <p className="text-xl mb-6">
            Start your journey with TherapySync and access all these integrations plus personalized AI therapy
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-therapy-600 hover:bg-gray-100"
              onClick={() => window.location.href = '/get-started'}
            >
              Get Started Free
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-therapy-600"
              onClick={() => window.location.href = '/auth'}
            >
              View Integration Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationsHub;