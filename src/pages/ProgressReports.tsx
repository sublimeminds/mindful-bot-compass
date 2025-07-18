import React from 'react';
import { FileText, TrendingUp, Calendar, Share2, Download, BarChart3, ArrowRight, Check, Play, Users, Clock, Zap, Globe, Eye, Database, PieChart, LineChart, Gauge, Settings, Bell, Heart, Brain, Target, Star, Shield, Activity } from 'lucide-react';

const ProgressReports = () => {
  const reportTypes = [
    {
      icon: FileText,
      title: "Comprehensive Therapy Reports",
      description: "Detailed clinical-grade reports including session summaries, progress metrics, and therapeutic insights",
      gradient: "from-blue-500 to-indigo-600",
      features: ["Session Analysis", "Mood Tracking", "Goal Progress", "Clinical Summaries"],
      frequency: "Weekly/Monthly",
      format: "PDF, Web"
    },
    {
      icon: TrendingUp,
      title: "Progress Analytics Dashboard",
      description: "Interactive analytics showing therapy progress trends, patterns, and predictive insights",
      gradient: "from-green-500 to-emerald-600",
      features: ["Trend Analysis", "Pattern Recognition", "Predictive Insights", "Visual Charts"],
      frequency: "Real-time",
      format: "Interactive Dashboard"
    },
    {
      icon: Calendar,
      title: "Scheduled Automated Reports",
      description: "Customizable automated reports delivered to your inbox or healthcare providers on schedule",
      gradient: "from-purple-500 to-violet-600",
      features: ["Automated Delivery", "Custom Schedules", "Multiple Recipients", "Email Integration"],
      frequency: "Daily/Weekly/Monthly",
      format: "Email, PDF"
    },
    {
      icon: Share2,
      title: "Provider Sharing Reports",
      description: "HIPAA-compliant reports designed for sharing with healthcare providers and therapists",
      gradient: "from-orange-500 to-amber-600",
      features: ["HIPAA Compliance", "Provider Templates", "Secure Sharing", "Professional Format"],
      frequency: "On-demand",
      format: "PDF, Secure Link"
    },
    {
      icon: Heart,
      title: "Family Progress Reports",
      description: "Family-friendly reports showing progress that can be shared with family members and caregivers",
      gradient: "from-red-500 to-pink-600",
      features: ["Family-Safe Content", "Privacy Controls", "Milestone Highlights", "Encouraging Format"],
      frequency: "Weekly/Monthly",
      format: "PDF, Web"
    },
    {
      icon: Brain,
      title: "AI Insights Reports",
      description: "Advanced AI-generated insights into therapy patterns, breakthrough moments, and recommendations",
      gradient: "from-cyan-500 to-blue-600",
      features: ["AI Analysis", "Breakthrough Detection", "Personalized Recommendations", "Predictive Modeling"],
      frequency: "After sessions",
      format: "Interactive, PDF"
    }
  ];

  const reportFeatures = [
    {
      icon: Eye,
      title: "Multi-Format Views",
      description: "View reports in interactive dashboards, PDFs, or detailed web pages"
    },
    {
      icon: Globe,
      title: "Secure Cloud Access",
      description: "Access your reports from anywhere with enterprise-grade security"
    },
    {
      icon: Zap,
      title: "Real-Time Updates",
      description: "Reports update automatically as you progress through therapy"
    },
    {
      icon: Settings,
      title: "Fully Customizable",
      description: "Choose what data to include and how it's presented"
    }
  ];

  const reportMetrics = [
    {
      name: "Mood Trends",
      description: "Daily mood tracking with patterns and triggers",
      icon: Activity,
      color: "text-blue-600"
    },
    {
      name: "Goal Achievement",
      description: "Progress toward therapy goals with completion rates",
      icon: Target,
      color: "text-green-600"
    },
    {
      name: "Session Effectiveness",
      description: "Analysis of session impact and therapeutic outcomes",
      icon: Brain,
      color: "text-purple-600"
    },
    {
      name: "Engagement Levels",
      description: "Therapy engagement and participation metrics",
      icon: Zap,
      color: "text-orange-600"
    }
  ];

  const stats = [
    { label: "Reports Generated", value: "25K", suffix: "+" },
    { label: "Healthcare Providers", value: "1.2K", suffix: "+" },
    { label: "Data Points Tracked", value: "500M", suffix: "+" },
    { label: "Report Accuracy", value: "99.8", suffix: "%" }
  ];

  const benefits = [
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "All reports meet strict healthcare privacy and security standards"
    },
    {
      icon: Users,
      title: "Multi-Stakeholder",
      description: "Different report versions for patients, families, and providers"
    },
    {
      icon: Database,
      title: "Comprehensive Data",
      description: "Includes all therapy data, sessions, assessments, and progress"
    },
    {
      icon: Clock,
      title: "Historical Tracking",
      description: "Complete therapy history with longitudinal progress tracking"
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
              <FileText className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-therapy-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Progress Reports
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
              Comprehensive therapy progress reports for patients, families, and healthcare providers with AI-powered insights and clinical documentation
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
                Create Report
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-white/80 backdrop-blur-sm text-therapy-600 border border-therapy-200 px-8 py-4 rounded-xl font-semibold hover:bg-white transition-all duration-300 flex items-center gap-2">
                <Play className="h-4 w-4" />
                View Sample Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Types Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Comprehensive Reporting Suite
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Multiple report types designed for different audiences and purposes in your mental health journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {reportTypes.map((report, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-border hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
              <div className={`w-16 h-16 bg-gradient-to-r ${report.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                <report.icon className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-3">{report.title}</h3>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{report.description}</p>
              
              <div className="space-y-2 mb-4">
                {report.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="text-sm">
                  <div className="font-medium text-foreground">{report.frequency}</div>
                  <div className="text-muted-foreground">{report.format}</div>
                </div>
                <button className="text-therapy-600 hover:text-therapy-700 transition-colors">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Report Metrics */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Key Metrics Tracked
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive data points that power your therapy progress reports
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {reportMetrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-all duration-300 group text-center">
              <div className={`w-12 h-12 bg-gradient-to-r from-therapy-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform`}>
                <metric.icon className={`h-6 w-6 text-white`} />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{metric.name}</h3>
              <p className="text-muted-foreground text-sm">{metric.description}</p>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose Our Reports
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Professional-grade reporting designed for mental health professionals and patients
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
              Start Tracking Your Progress Today
            </h2>
            <p className="text-xl mb-8 text-white/90 max-w-3xl mx-auto">
              Generate comprehensive therapy reports to track your mental health journey and share insights with your care team
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-therapy-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl">
                Create Your First Report
              </button>
              <button className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-8 py-4 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300">
                View Sample Reports
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressReports;