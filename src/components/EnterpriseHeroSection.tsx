import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Star, Heart, Sparkles, Shield, Users, Zap, Brain, Clock, Lightbulb, Globe, Cpu, BarChart3, AlertTriangle, Waves, Mic, Target, TrendingUp } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { getItemIcon } from '@/utils/iconUtils';
import SafeBulletproofAvatar from '@/components/avatar/SafeBulletproofAvatar';
import { therapistPersonas } from '@/components/avatar/TherapistAvatarPersonas';
import { TherapySyncAICore } from '@/components/ai-hub/TherapySyncAICore';

const testimonials = [
  {
    quote: "The AI understood my cultural background in ways I never expected. It felt like talking to someone who truly gets me.",
    author: "Maria Rodriguez",
    role: "Product Manager",
    impact: "78% Improvement"
  },
  {
    quote: "Real-time crisis detection helped me during my darkest moments. The immediate professional support was life-changing.",
    author: "James Chen",
    role: "Software Engineer", 
    impact: "Complete Recovery"
  },
  {
    quote: "The voice analysis picked up on things I couldn't even articulate. It's like having a therapist who reads between the lines.",
    author: "Dr. Sarah Johnson",
    role: "Medical Professional",
    impact: "92% Satisfaction"
  }
];

const EnterpriseHeroSection = () => {
  const navigate = useNavigate();
  const renderIcon = getItemIcon;
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-therapy-50 via-white to-calm-50/30 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-therapy-300/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-calm-300/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-5">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10 pt-20 pb-20">
        
        {/* Hero Section */}
        <div className="text-center mb-20 space-y-8">
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="inline-flex items-center space-x-2 bg-white rounded-full px-4 py-2 border border-therapy-200 shadow-lg">
              <Shield className="h-6 w-6 text-therapy-600" />
              <span className="text-sm font-semibold text-therapy-700">HIPAA Protected</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div className="inline-flex items-center space-x-2 bg-white rounded-full px-4 py-2 border border-therapy-200 shadow-lg">
              <AlertTriangle className="h-6 w-6 text-calm-600" />
              <span className="text-sm font-semibold text-calm-700">24/7 Crisis Support</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div className="inline-flex items-center space-x-2 bg-white rounded-full px-4 py-2 border border-therapy-200 shadow-lg">
              <Brain className="h-6 w-6 text-harmony-600" />
              <span className="text-sm font-semibold text-harmony-700">AI-Powered</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Main Headline */}
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              <span className="text-foreground">Enterprise-Grade </span>
              <span className="bg-gradient-to-r from-therapy-600 via-calm-500 to-harmony-400 bg-clip-text text-transparent">
                AI Therapy
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Advanced AI that adapts to cultural contexts, detects crises in real-time, and delivers 
              personalized therapeutic interventions with enterprise-level security and compliance.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-6 pt-8">
            <Button
              size="lg"
              onClick={() => navigate('/get-started')}
              className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 text-white font-semibold px-8 py-6 text-lg rounded-xl shadow-therapy-glow hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Sparkles className="mr-3 h-6 w-6" />
              <span>Start Free Enterprise Trial</span>
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/demo')}
              className="border-therapy-300 text-therapy-700 hover:bg-therapy-50 font-semibold px-8 py-6 text-lg rounded-xl transition-all duration-300 hover:scale-105"
            >
              <Play className="mr-3 h-5 w-5" />
              Watch Live Demo
            </Button>
          </div>

          {/* Social Proof */}
          <div className="pt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="font-medium">4.9/5 from 10,000+ users</span>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4 text-red-500" />
              <span>Trusted by Fortune 500 companies</span>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span>SOC 2 Type II Certified</span>
            </div>
          </div>
        </div>

        {/* AI Therapy Team Gallery */}
        <div className="mb-32">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Meet Your AI Therapy Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose from 24 specialized AI therapists across 3 tiers, each with unique personalities, cultural expertise, and therapeutic specializations.
            </p>
          </div>

          {/* Tier Indicators */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-6 bg-white rounded-full px-8 py-4 border border-therapy-200 shadow-lg">
              <div className="text-center">
                <div className="w-3 h-3 bg-gray-400 rounded-full mx-auto mb-1"></div>
                <span className="text-xs font-medium text-gray-600">Free Tier</span>
              </div>
              <div className="text-center">
                <div className="w-3 h-3 bg-therapy-500 rounded-full mx-auto mb-1"></div>
                <span className="text-xs font-medium text-therapy-600">Premium</span>
              </div>
              <div className="text-center">
                <div className="w-3 h-3 bg-gradient-to-r from-therapy-600 to-calm-500 rounded-full mx-auto mb-1"></div>
                <span className="text-xs font-medium text-therapy-700">Professional</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-8">
              {Object.entries(therapistPersonas).slice(0, 12).map(([id, persona], index) => {
                const tier = index < 4 ? 'free' : index < 8 ? 'premium' : 'professional';
                const tierColors = {
                  free: 'border-gray-300 bg-gray-50/50',
                  premium: 'border-therapy-300 bg-therapy-50/50',
                  professional: 'border-gradient-to-r from-therapy-400 to-calm-400 bg-gradient-to-br from-therapy-50 to-calm-50'
                };
                const specialties = ['CBT', 'DBT', 'Mindfulness', 'Trauma', 'EMDR', 'Somatic', 'Humanistic', 'Psychodynamic', 'Solution-Focused', 'Family Systems', 'Crisis', 'Cultural'][index] || 'Specialized';
                
                return (
                  <div
                    key={id}
                    className={`group relative bg-white rounded-2xl p-4 border border-therapy-200 hover:border-therapy-300 transition-all duration-500 hover:shadow-therapy-glow hover:scale-105 ${tier === 'professional' ? 'ring-1 ring-therapy-200' : ''}`}
                  >
                    <div className="relative">
                      <SafeBulletproofAvatar
                        therapistId={id}
                        therapistName={persona.name}
                        className="w-16 h-16 mx-auto mb-3"
                      />
                      <div className="absolute -top-1 -right-1 flex flex-col space-y-1">
                        <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                        {tier === 'professional' && (
                          <div className="w-4 h-4 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-full border-2 border-white">
                            <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold text-sm text-foreground truncate">{persona.name}</h3>
                      <p className="text-xs text-therapy-600 font-medium">{specialties}</p>
                      <div className="text-xs text-muted-foreground mt-1">
                        {tier === 'free' ? 'Basic Support' : tier === 'premium' ? 'Advanced Care' : 'Expert Guidance'}
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-therapy-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                    
                    {/* Cultural Expertise Badge */}
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="bg-white rounded-lg px-2 py-1 border border-therapy-200">
                        <div className="flex items-center justify-center space-x-1">
                          <Globe className="h-3 w-3 text-harmony-500" />
                          <span className="text-xs font-medium text-harmony-600">Multi-cultural</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center">
              <div className="inline-flex items-center space-x-4 bg-white rounded-full px-6 py-3 border border-therapy-200 shadow-lg">
                <div className="flex -space-x-2">
                  {Object.entries(therapistPersonas).slice(12, 17).map(([id], i) => (
                    <SafeBulletproofAvatar
                      key={id}
                      therapistId={id}
                      therapistName={`Dr. ${i + 13}`}
                      className="w-8 h-8 border-2 border-white"
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-therapy-700">+12 More Specialists Available</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/therapists')}
                  className="text-therapy-600 hover:text-therapy-700 font-medium"
                >
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* TherapySync AI Core */}
        <TherapySyncAICore />
        

        {/* Testimonials Section */}
        <div className="mt-32 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-12">
            <span className="text-foreground">Real Stories, </span>
            <span className="bg-gradient-to-r from-therapy-600 to-calm-500 bg-clip-text text-transparent">Real Results</span>
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative h-40 overflow-hidden">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={cn(
                    "absolute inset-0 transition-all duration-500 transform",
                    activeTestimonial === index 
                      ? "opacity-100 translate-y-0" 
                      : "opacity-0 translate-y-4"
                  )}
                >
                  <div className="bg-white rounded-2xl p-8 border border-therapy-200">
                    <blockquote className="text-lg lg:text-xl text-muted-foreground italic mb-6">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="flex items-center justify-center gap-4">
                      <div className="text-center">
                        <div className="font-semibold text-foreground">{testimonial.author}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      </div>
                      <div className="w-px h-8 bg-therapy-300"></div>
                      <div className="text-center">
                        <div className="font-semibold text-therapy-600">{testimonial.impact}</div>
                        <div className="text-sm text-muted-foreground">Improvement</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Testimonial Indicators */}
            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all duration-300",
                    activeTestimonial === index 
                      ? "bg-therapy-500 w-8" 
                      : "bg-gray-300 hover:bg-therapy-300"
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="mt-24 text-center space-y-8 bg-gradient-to-r from-therapy-500/10 via-calm-400/10 to-harmony-300/10 rounded-3xl p-12 border border-therapy-200/30">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
            Ready to Transform Your Mental Health?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands who have found healing, growth, and peace through AI-powered therapy. 
            Your journey to better mental health starts with a single conversation.
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span>100% Private & Secure</span>
            </div>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-green-500" />
              <span>24/7 Support Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-green-500" />
              <span>No Credit Card Required</span>
            </div>
          </div>

          <Button
            size="lg"
            onClick={() => navigate('/get-started')}
            className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 text-white font-semibold px-12 py-6 text-xl rounded-xl shadow-therapy-glow hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Sparkles className="mr-3 h-6 w-6" />
            <span>Begin Your Healing Journey Today</span>
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
          
          <p className="text-xs text-muted-foreground">
            Free to start • Your conversations are always private • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};

export default EnterpriseHeroSection;