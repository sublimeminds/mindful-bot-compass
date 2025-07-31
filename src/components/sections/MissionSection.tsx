import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Globe, 
  Shield, 
  Users, 
  Lightbulb, 
  Target,
  ArrowRight,
  Sparkles,
  Brain,
  Compass
} from 'lucide-react';

const MissionSection = () => {
  const values = [
    {
      icon: Heart,
      title: "Empathy First",
      description: "Every interaction prioritizes understanding, compassion, and genuine human connection.",
      gradient: "from-therapy-500 to-harmony-500"
    },
    {
      icon: Globe,
      title: "Universally Accessible",
      description: "Breaking down barriers to mental health care across cultures, languages, and geographies.",
      gradient: "from-calm-500 to-therapy-500"
    },
    {
      icon: Shield,
      title: "Privacy Protected",
      description: "Your mental health journey remains completely private with enterprise-grade security.",
      gradient: "from-harmony-500 to-calm-500"
    },
    {
      icon: Users,
      title: "Clinically Backed",
      description: "Every AI response is grounded in evidence-based therapeutic practices and research.",
      gradient: "from-therapy-500 to-balance-500"
    }
  ];

  const impact = [
    {
      metric: "2.8M+",
      label: "Lives Touched",
      description: "People who've found support through our platform"
    },
    {
      metric: "89%",
      label: "Improved Wellbeing",
      description: "Users report significant mental health improvements"
    },
    {
      metric: "150+",
      label: "Countries Served",
      description: "Global reach across diverse cultures and communities"
    },
    {
      metric: "24/7",
      label: "Always There",
      description: "Round-the-clock support when you need it most"
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Mission Hero */}
      <div className="text-center mb-20">
        <Badge variant="secondary" className="mb-8 bg-white text-foreground border px-6 py-3 text-base font-medium shadow-lg">
          <Compass className="w-5 h-5 mr-2" />
          Our Mission
        </Badge>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight text-white">
          <span className="block">Democratizing</span>
          <span className="bg-gradient-to-r from-therapy-300 via-harmony-300 to-calm-300 bg-clip-text text-transparent">
            Mental Health Care
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
          We believe everyone deserves access to quality mental health support, 
          regardless of location, language, or economic status. Our AI-powered platform 
          makes professional therapy accessible to anyone, anywhere, anytime.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-therapy-500 to-harmony-600 hover:from-therapy-600 hover:to-harmony-700 text-white px-10 py-4 text-lg font-medium group transition-all duration-300 shadow-lg"
          >
            <Sparkles className="mr-3 h-5 w-5" />
            Join Our Mission
            <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
      </div>

      {/* Core Values */}
      <div className="mb-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Our Core Values
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            The principles that guide every decision, every feature, and every interaction on our platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-500 bg-white border-therapy-200 hover:border-therapy-300">
              <CardContent className="p-8 text-center">
                <div className={`w-20 h-20 bg-gradient-to-br ${value.gradient} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <value.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Impact Metrics */}
      <div className="mb-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Our Global Impact
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Real numbers from real people whose lives have been transformed through accessible mental health care.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {impact.map((item, index) => (
            <div key={index} className="text-center p-8 bg-white rounded-2xl border border-therapy-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-4xl md:text-5xl font-bold text-therapy-600 mb-2">{item.metric}</div>
              <div className="text-lg font-semibold text-foreground mb-2">{item.label}</div>
              <div className="text-sm text-muted-foreground">{item.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Vision Statement */}
      <div className="bg-white rounded-3xl p-12 border border-therapy-200 shadow-xl">
        <div className="text-center max-w-4xl mx-auto">
          <div className="w-16 h-16 bg-gradient-to-br from-therapy-500 to-harmony-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <Lightbulb className="h-8 w-8 text-white" />
          </div>
          
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Our Vision for the Future
          </h3>
          
          <p className="text-xl text-muted-foreground leading-relaxed mb-8">
            "A world where mental health support is as accessible as asking a question, 
            as personal as talking to a trusted friend, and as effective as working with 
            the world's best therapists. We're not just building technology—we're 
            building hope, healing, and human connection at scale."
          </p>
          
          <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
            <div className="w-12 h-12 bg-therapy-100 rounded-full flex items-center justify-center">
              <Brain className="h-6 w-6 text-therapy-600" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-foreground">Dr. Sarah Chen, Co-Founder</div>
              <div>Clinical Psychologist & AI Ethics Researcher</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionSection;