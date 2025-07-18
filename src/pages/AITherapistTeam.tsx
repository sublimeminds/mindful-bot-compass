import React from 'react';
import { Users, Brain, Heart, Shield, Star, Zap, Palette, Mic, Camera, Video, MessageSquare, Target, Compass, Globe, Award, Sparkles, ArrowRight, Check, Play, ChevronDown } from 'lucide-react';

const AITherapistTeam = () => {
  const therapists = [
    {
      name: "Dr. Sarah Chen",
      specialty: "Cognitive Behavioral Therapy",
      description: "Leading expert in anxiety, depression, and thought pattern restructuring with 15+ years of experience",
      icon: Brain,
      gradient: "from-blue-500 to-indigo-600",
      features: ["Anxiety Management", "Depression Support", "CBT Techniques", "Cognitive Restructuring"],
      sessions: "2,847",
      rating: "4.9"
    },
    {
      name: "Dr. Marcus Johnson",
      specialty: "Dialectical Behavior Therapy",
      description: "Specialist in emotional regulation and interpersonal effectiveness with advanced DBT certification",
      icon: Heart,
      gradient: "from-red-500 to-pink-600",
      features: ["Emotional Regulation", "Crisis Management", "Mindfulness", "Interpersonal Skills"],
      sessions: "2,394",
      rating: "4.8"
    },
    {
      name: "Dr. Elena Rodriguez",
      specialty: "Trauma-Focused Therapy",
      description: "Expert in PTSD, trauma recovery, and resilience building with specialized trauma training",
      icon: Shield,
      gradient: "from-emerald-500 to-teal-600",
      features: ["PTSD Treatment", "Trauma Recovery", "EMDR Therapy", "Resilience Building"],
      sessions: "1,956",
      rating: "4.9"
    },
    {
      name: "Dr. Alex Kim",
      specialty: "Mindfulness-Based Therapy",
      description: "Master practitioner of present-moment awareness and acceptance-based therapeutic approaches",
      icon: Star,
      gradient: "from-amber-500 to-orange-600",
      features: ["Mindfulness Training", "Meditation Guidance", "Stress Reduction", "Present Awareness"],
      sessions: "3,127",
      rating: "4.8"
    },
    {
      name: "Dr. Priya Patel",
      specialty: "Family Systems Therapy",
      description: "Renowned expert in relationship dynamics, family counseling, and systemic therapeutic approaches",
      icon: Users,
      gradient: "from-purple-500 to-violet-600",
      features: ["Family Counseling", "Relationship Therapy", "Communication Skills", "Family Dynamics"],
      sessions: "1,743",
      rating: "4.9"
    },
    {
      name: "Dr. James Wright",
      specialty: "Solution-Focused Therapy",
      description: "Pioneer in goal-setting and rapid therapeutic interventions with proven success methodologies",
      icon: Target,
      gradient: "from-cyan-500 to-blue-600",
      features: ["Goal Achievement", "Rapid Results", "Solution Building", "Brief Therapy"],
      sessions: "2,651",
      rating: "4.8"
    },
    {
      name: "Dr. Maya Singh",
      specialty: "Multicultural Therapy",
      description: "Expert in culturally responsive therapy with deep understanding of diverse backgrounds",
      icon: Globe,
      gradient: "from-rose-500 to-pink-600",
      features: ["Cultural Sensitivity", "Diverse Perspectives", "Identity Support", "Cross-Cultural Care"],
      sessions: "1,892",
      rating: "4.9"
    },
    {
      name: "Dr. David Lee",
      specialty: "Art & Creative Therapy",
      description: "Innovative therapist using creative expression and artistic modalities for healing",
      icon: Palette,
      gradient: "from-indigo-500 to-purple-600",
      features: ["Creative Expression", "Art Therapy", "Music Therapy", "Creative Healing"],
      sessions: "1,567",
      rating: "4.7"
    },
    {
      name: "Dr. Lisa Thompson",
      specialty: "Group & Community Therapy",
      description: "Specialist in group dynamics and community-based therapeutic interventions",
      icon: Sparkles,
      gradient: "from-green-500 to-emerald-600",
      features: ["Group Sessions", "Peer Support", "Community Building", "Social Connection"],
      sessions: "2,238",
      rating: "4.8"
    }
  ];

  const features = [
    {
      icon: Video,
      title: "3D Avatar Interaction",
      description: "Lifelike 3D avatars with realistic expressions and gestures"
    },
    {
      icon: Mic,
      title: "Voice Recognition",
      description: "Advanced voice analysis for emotional state detection"
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Real-time therapeutic insights and personalized recommendations"
    },
    {
      icon: MessageSquare,
      title: "Multi-Modal Communication",
      description: "Text, voice, and visual communication options"
    }
  ];

  const stats = [
    { label: "Active Therapists", value: "9", suffix: "" },
    { label: "Therapy Sessions", value: "18.4K", suffix: "+" },
    { label: "Success Rate", value: "94", suffix: "%" },
    { label: "Patient Satisfaction", value: "4.8", suffix: "/5" }
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
              AI Therapist Team
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
              Meet our specialized AI therapists with unique approaches, 3D avatars, and proven therapeutic methodologies
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
                Start Free Consultation
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
            Advanced AI Therapy Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our AI therapists combine cutting-edge technology with proven therapeutic methods
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-border hover:shadow-md transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-r from-therapy-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Therapists Grid */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Meet Your Therapy Team
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Each AI therapist brings unique expertise and personalized approaches to your mental health journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {therapists.map((therapist, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-border hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
              <div className="relative mb-6">
                <div className={`w-16 h-16 bg-gradient-to-r ${therapist.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <therapist.icon className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  Online
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-2">{therapist.name}</h3>
              <p className="text-therapy-600 font-medium text-sm mb-3">{therapist.specialty}</p>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{therapist.description}</p>
              
              <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{therapist.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{therapist.sessions} sessions</span>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                {therapist.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <button className="w-full bg-gradient-to-r from-therapy-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                Start Session
              </button>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="relative bg-gradient-to-r from-therapy-600 via-blue-600 to-indigo-600 rounded-3xl p-12 text-center text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Meet Your AI Therapist?
            </h2>
            <p className="text-xl mb-8 text-white/90 max-w-3xl mx-auto">
              Take our quick assessment to be matched with the perfect AI therapist for your unique needs and goals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-therapy-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl">
                Take Assessment
              </button>
              <button className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-8 py-4 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITherapistTeam;