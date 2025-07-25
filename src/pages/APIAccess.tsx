import React from 'react';
import { BookOpen, Code, Database, Zap, Shield, Settings, ArrowRight, Check, Play, Globe, Key, Clock, Bell, Users, Lock, FileText, Webhook, Terminal, Server } from 'lucide-react';

const APIAccess = () => {
  const apiFeatures = [
    {
      icon: Code,
      title: "RESTful API Architecture",
      description: "Full REST API access for integrating therapy data with your applications and systems",
      gradient: "from-blue-500 to-indigo-600",
      features: ["Complete REST API", "JSON Response Format", "Rate Limiting", "Versioning Support"]
    },
    {
      icon: Zap,
      title: "Real-Time Webhooks",
      description: "Real-time notifications and data updates via webhook integration for instant synchronization",
      gradient: "from-green-500 to-emerald-600",
      features: ["Real-time Updates", "Custom Endpoints", "Retry Logic", "Event Filtering"]
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Enterprise-grade security with OAuth 2.0, API keys, and HIPAA-compliant data protection",
      gradient: "from-purple-500 to-violet-600",
      features: ["OAuth 2.0", "API Key Authentication", "HIPAA Compliance", "End-to-End Encryption"]
    },
    {
      icon: Database,
      title: "Comprehensive Data Access",
      description: "Access to all therapy data including sessions, progress, analytics, and user information",
      gradient: "from-orange-500 to-amber-600",
      features: ["Session Data", "Progress Metrics", "User Profiles", "Analytics Exports"]
    },
    {
      icon: Terminal,
      title: "Developer Tools",
      description: "Comprehensive developer tools including SDKs, documentation, and testing environments",
      gradient: "from-red-500 to-pink-600",
      features: ["Interactive Docs", "SDKs Available", "Sandbox Environment", "Code Examples"]
    },
    {
      icon: Server,
      title: "Scalable Infrastructure",
      description: "Enterprise-grade infrastructure with 99.9% uptime, global CDN, and auto-scaling",
      gradient: "from-cyan-500 to-blue-600",
      features: ["99.9% Uptime", "Global CDN", "Auto-scaling", "Load Balancing"]
    }
  ];

  const endpoints = [
    {
      method: "GET",
      endpoint: "/api/v1/sessions",
      description: "Retrieve therapy session data",
      params: "200+ fields"
    },
    {
      method: "POST",
      endpoint: "/api/v1/progress",
      description: "Submit progress updates",
      params: "Custom metrics"
    },
    {
      method: "GET",
      endpoint: "/api/v1/analytics",
      description: "Access analytics and insights",
      params: "Real-time data"
    },
    {
      method: "WEBHOOK",
      endpoint: "/webhooks/events",
      description: "Real-time event notifications",
      params: "Instant updates"
    }
  ];

  const stats = [
    { label: "API Endpoints", value: "120", suffix: "+" },
    { label: "Active Integrations", value: "50K", suffix: "+" },
    { label: "API Uptime", value: "99.9", suffix: "%" },
    { label: "Response Time", value: "<200", suffix: "ms" }
  ];

  const benefits = [
    {
      icon: Globe,
      title: "Global Availability",
      description: "Access your API from anywhere with our global infrastructure"
    },
    {
      icon: Clock,
      title: "Lightning Fast",
      description: "Sub-200ms response times with optimized data delivery"
    },
    {
      icon: Lock,
      title: "Bank-Level Security",
      description: "Enterprise security standards with comprehensive compliance"
    },
    {
      icon: Users,
      title: "Developer Support",
      description: "Dedicated developer support and comprehensive documentation"
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
              <BookOpen className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-flow-600 to-flow-800 bg-clip-text text-transparent mb-6">
              API Access
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
              Comprehensive REST API and webhooks for seamless integration with your systems, workflows, and applications
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
              <button className="bg-gradient-to-r from-flow-600 to-flow-800 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2 group">
                Get API Access
                <Code className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-white/80 backdrop-blur-sm text-therapy-600 border border-therapy-200 px-8 py-4 rounded-xl font-semibold hover:bg-white transition-all duration-300 flex items-center gap-2">
                <Play className="h-4 w-4" />
                View Documentation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Enterprise API Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Powerful API capabilities designed for healthcare systems, enterprises, and developers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {apiFeatures.map((feature, index) => (
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

        {/* API Endpoints */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Popular API Endpoints
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Most commonly used endpoints for therapy data integration
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {endpoints.map((endpoint, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-all duration-300 group">
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${
                endpoint.method === 'GET' ? 'bg-green-100 text-green-700' :
                endpoint.method === 'POST' ? 'bg-blue-100 text-blue-700' :
                'bg-purple-100 text-purple-700'
              }`}>
                {endpoint.method}
              </div>
              
              <h3 className="text-lg font-semibold text-foreground mb-2 font-mono text-sm">
                {endpoint.endpoint}
              </h3>
              <p className="text-muted-foreground text-sm mb-3">{endpoint.description}</p>
              <div className="text-therapy-600 font-semibold text-sm">{endpoint.params}</div>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose Our API
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Built for developers, designed for healthcare, optimized for performance
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
              Start Building with Our API
            </h2>
            <p className="text-xl mb-8 text-white/90 max-w-3xl mx-auto">
              Access our powerful API to integrate TherapySync with your existing systems and build innovative healthcare solutions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-therapy-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl">
                Get API Access
              </button>
              <button className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-8 py-4 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300">
                View Documentation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIAccess;