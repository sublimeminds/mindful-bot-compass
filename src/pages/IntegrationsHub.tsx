import React from 'react';
import { Zap, Shield, Eye, BarChart, Smartphone, Calendar, MessageSquare, Activity, Brain, Heart, Clock, Globe, ArrowRight, Check, Play, Star, Users, Lock, Wifi, Database, Cloud, Gauge, TrendingUp, Bell, Settings, Link, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const IntegrationsHub = () => {
  const realIntegrations = [
    {
      title: "WhatsApp Business",
      icon: MessageSquare,
      gradient: "from-green-500 to-emerald-600",
      apps: ["WhatsApp Business API", "WhatsApp Cloud API"],
      count: "2 integrations",
      description: "Send therapy reminders, session notifications, and crisis support through WhatsApp",
      features: ["Session reminders", "Crisis notifications", "Appointment scheduling", "Secure messaging"],
      status: "Active"
    },
    {
      title: "Slack Workspace",
      icon: MessageSquare,
      gradient: "from-purple-500 to-violet-600", 
      apps: ["Slack Bot", "Slack Workflows", "Custom Slash Commands"],
      count: "3 integrations",
      description: "Integrate therapy notifications and team communication for healthcare providers",
      features: ["Team notifications", "Patient progress alerts", "Custom workflows", "Channel integration"],
      status: "Active"
    },
    {
      title: "Calendar & Scheduling",
      icon: Calendar,
      gradient: "from-blue-500 to-indigo-600",
      apps: ["Google Calendar", "Outlook Calendar", "Apple Calendar", "Calendly"],
      count: "4 integrations",
      description: "Seamlessly manage therapy appointments and wellness schedules",
      features: ["Appointment booking", "Reminder notifications", "Schedule sync", "Availability management"],
      status: "Active"
    },
    {
      title: "Health & Wellness",
      icon: Activity,
      gradient: "from-red-500 to-pink-600",
      apps: ["Apple Health", "Google Fit", "Samsung Health"],
      count: "3 integrations", 
      description: "Sync physical health data for comprehensive wellness insights",
      features: ["Activity tracking", "Sleep data", "Heart rate monitoring", "Wellness metrics"],
      status: "Active"
    },
    {
      title: "Healthcare Systems",
      icon: Database,
      gradient: "from-orange-500 to-amber-600",
      apps: ["FHIR API", "HL7 Standard", "Epic Integration"],
      count: "3 integrations",
      description: "Connect with electronic health records and healthcare management systems",
      features: ["EHR integration", "Clinical data sync", "HIPAA compliance", "Provider access"],
      status: "Enterprise"
    },
    {
      title: "Communication Platforms",
      icon: Smartphone,
      gradient: "from-cyan-500 to-blue-600",
      apps: ["Email SMTP", "SMS API", "Push Notifications", "Discord"],
      count: "4 integrations",
      description: "Multi-channel communication for therapy reminders and support",
      features: ["Email notifications", "SMS alerts", "Push messages", "Voice calls"],
      status: "Active"
    }
  ];

  const stats = [
    { label: "Available Integrations", value: "20", suffix: "+" },
    { label: "Healthcare Providers", value: "500", suffix: "+" },
    { label: "Messages Sent Daily", value: "50K", suffix: "+" },
    { label: "Integration Uptime", value: "99.9", suffix: "%" }
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
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Real Mental Health Integrations
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connect the tools and platforms that matter for your mental health journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {realIntegrations.map((integration, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-border hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-16 h-16 bg-gradient-to-r ${integration.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                  <integration.icon className="h-8 w-8 text-white" />
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  integration.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                }`}>
                  {integration.status}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-2">{integration.title}</h3>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{integration.description}</p>
              
              <div className="space-y-2 mb-4">
                {integration.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-therapy-600 font-semibold text-sm">{integration.count}</span>
                <button className="text-therapy-600 hover:text-therapy-700 transition-colors">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
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
              <BarChart className="h-8 w-8 text-therapy-600" />
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