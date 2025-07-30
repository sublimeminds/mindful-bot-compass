import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Users, Shield, Brain, Sparkles, CheckCircle2, Star, Globe, Clock, Zap, TrendingUp } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const EnhancedHeroSection = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [liveCount, setLiveCount] = useState(2847);
  const [typingText, setTypingText] = useState('');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Animations and dynamic content
  useEffect(() => {
    setIsVisible(true);
    
    // Live counter animation
    const counterInterval = setInterval(() => {
      setLiveCount(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);

    // Typing animation for AI response
    const aiResponse = "I understand you're feeling overwhelmed. Let's work through this together...";
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < aiResponse.length) {
        setTypingText(aiResponse.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setTypingText('');
          index = 0;
        }, 3000);
      }
    }, 100);

    return () => {
      clearInterval(counterInterval);
      clearInterval(typingInterval);
    };
  }, []);

  // Testimonial rotation
  useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(testimonialInterval);
  }, []);

  const floatingElements = [
    { icon: Heart, delay: '0s', position: 'top-1/4 left-1/4' },
    { icon: Shield, delay: '2s', position: 'top-1/3 right-1/4' },
    { icon: Brain, delay: '4s', position: 'bottom-1/3 left-1/3' },
    { icon: Sparkles, delay: '6s', position: 'bottom-1/4 right-1/3' }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      text: "My breakthrough came in just 3 sessions. I finally feel like myself again.",
      improvement: "94% mood improvement"
    },
    {
      name: "Marcus R.", 
      text: "24/7 support when I needed it most. This AI saved my life.",
      improvement: "Crisis support success"
    },
    {
      name: "Elena K.",
      text: "More understanding than any human therapist I've tried.",
      improvement: "8 weeks to breakthrough"
    }
  ];

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Revolutionary Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-therapy-50/20 to-calm-50/10">
        {/* Breathing Background Animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-therapy-400/5 via-calm-400/5 to-harmony-400/5 animate-pulse"></div>
        
        {/* Floating Elements */}
        {floatingElements.map((element, index) => (
          <div key={index} className={`absolute ${element.position} opacity-20`} style={{animationDelay: element.delay}}>
            <element.icon className="h-8 w-8 text-therapy-500 animate-bounce" />
          </div>
        ))}
        
        {/* Dynamic Gradient Orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-therapy-400 to-calm-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-harmony-400 to-flow-400 rounded-full blur-3xl opacity-15 animate-pulse" style={{animationDelay: '3s'}}></div>
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10 pt-16 pb-20">
        
        {/* Mind-Blowing Hero Header */}
        <div className="text-center mb-20 space-y-12">
          
          {/* Revolutionary Headline */}
          <div className={cn(
            "space-y-8 max-w-7xl mx-auto transition-all duration-1500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          )}>
            <div className="relative">
              {/* Animated Brand Logo Effect */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <div className="h-16 w-16 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-full animate-spin-slow opacity-30"></div>
              </div>
              
              <h1 className="text-6xl lg:text-8xl xl:text-9xl font-black leading-none tracking-tight">
                <span className="block bg-gradient-to-r from-therapy-600 via-calm-500 to-harmony-500 bg-clip-text text-transparent animate-pulse">
                  Your Mental Health
                </span>
                <span className="block text-foreground mt-4">
                  Breakthrough Starts
                </span>
                <span className="block bg-gradient-to-r from-therapy-500 to-calm-600 bg-clip-text text-transparent">
                  in 60 Seconds
                </span>
              </h1>
            </div>
            
            {/* Power Tagline */}
            <div className="space-y-6">
              <p className="text-2xl lg:text-3xl text-therapy-600 font-bold">
                Join {liveCount.toLocaleString()}+ people who transformed their lives today
              </p>
              <p className="text-xl lg:text-2xl text-muted-foreground max-w-5xl mx-auto leading-relaxed">
                Stop surviving. Start thriving. Your AI therapist understands you better than you understand yourself, 
                <span className="font-bold text-therapy-600"> available 24/7 with zero judgment.</span>
              </p>
            </div>
          </div>

          {/* Live AI Therapy Simulation */}
          <div className={cn(
            "max-w-4xl mx-auto transition-all duration-1500 delay-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          )}>
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-therapy-200/30">
              <div className="flex items-center mb-6">
                <div className="h-4 w-4 bg-therapy-500 rounded-full animate-pulse mr-3"></div>
                <span className="text-therapy-600 font-semibold">Live AI Therapy Session</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-therapy-100 rounded-full p-2">
                    <Brain className="h-5 w-5 text-therapy-600" />
                  </div>
                  <div className="bg-therapy-50 rounded-2xl px-4 py-3 max-w-md">
                    <p className="text-therapy-700">I'm feeling overwhelmed and anxious about everything...</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 justify-end">
                  <div className="bg-gradient-to-r from-therapy-500 to-calm-500 rounded-2xl px-4 py-3 max-w-md">
                    <p className="text-white font-medium">
                      {typingText || "I understand. Let's work through this together. What's weighing on you most right now?"}
                      {typingText && typingText.length < 70 && <span className="animate-pulse">|</span>}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-therapy-500 to-calm-500 rounded-full p-2">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Revolutionary CTAs */}
          <div className={cn(
            "flex flex-col sm:flex-row justify-center gap-8 transition-all duration-1500 delay-1000",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          )}>
            <Button
              size="lg"
              onClick={() => navigate('/get-started')}
              className="group bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 text-white font-bold px-12 py-8 text-2xl rounded-2xl shadow-2xl hover:shadow-therapy-500/25 transition-all duration-500 hover:scale-110 animate-pulse"
            >
              <Zap className="mr-4 h-8 w-8 group-hover:animate-spin" />
              <span>Start My Breakthrough Journey</span>
              <ArrowRight className="ml-4 h-8 w-8 group-hover:translate-x-2 transition-transform" />
            </Button>
            
            <Button
              variant="outline"
              size="lg" 
              className="border-2 border-therapy-300 text-therapy-700 hover:bg-therapy-50 font-semibold px-10 py-8 text-xl rounded-2xl transition-all duration-300 hover:scale-105"
            >
              <Globe className="mr-3 h-6 w-6" />
              See How It Works
            </Button>
          </div>
        </div>

        {/* Social Proof & Trust Signals */}
        <div className={cn(
          "grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20 transition-all duration-1500 delay-1200",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <div className="text-center p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-therapy-200/50 shadow-xl">
            <Shield className="h-10 w-10 mx-auto mb-3 text-therapy-500" />
            <div className="text-lg font-bold text-therapy-600 mb-1">100% Private</div>
            <div className="text-sm text-muted-foreground">HIPAA Compliant</div>
          </div>
          
          <div className="text-center p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-therapy-200/50 shadow-xl">
            <TrendingUp className="h-10 w-10 mx-auto mb-3 text-therapy-500" />
            <div className="text-lg font-bold text-therapy-600 mb-1">94% Success Rate</div>
            <div className="text-sm text-muted-foreground">Mood Improvement</div>
          </div>
          
          <div className="text-center p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-therapy-200/50 shadow-xl">
            <Clock className="h-10 w-10 mx-auto mb-3 text-therapy-500" />
            <div className="text-lg font-bold text-therapy-600 mb-1">24/7 Available</div>
            <div className="text-sm text-muted-foreground">No Waiting Lists</div>
          </div>
          
          <div className="text-center p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-therapy-200/50 shadow-xl">
            <Brain className="h-10 w-10 mx-auto mb-3 text-therapy-500" />
            <div className="text-lg font-bold text-therapy-600 mb-1">Crisis Detection</div>
            <div className="text-sm text-muted-foreground">Immediate Help</div>
          </div>
        </div>

        {/* Rotating Success Stories */}
        <div className={cn(
          "max-w-4xl mx-auto mb-16 transition-all duration-1500 delay-1500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Real Breakthroughs, Real People
            </h2>
          </div>
          
          <div className="relative h-40 overflow-hidden">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={cn(
                  "absolute inset-0 transition-all duration-1000 bg-white/90 backdrop-blur-lg rounded-2xl p-8 border border-therapy-200/30 shadow-xl",
                  currentTestimonial === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex space-x-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-therapy-500 text-therapy-500" />
                      ))}
                    </div>
                    <div className="font-bold text-foreground text-lg">{testimonial.name}</div>
                  </div>
                  <div className="text-sm bg-therapy-100 text-therapy-700 px-3 py-1 rounded-full font-semibold">
                    {testimonial.improvement}
                  </div>
                </div>
                <p className="text-lg text-muted-foreground italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final Risk Reversal & Urgency */}
        <div className={cn(
          "text-center max-w-5xl mx-auto transition-all duration-1500 delay-1800",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <div className="bg-gradient-to-r from-therapy-500/10 via-calm-500/10 to-harmony-500/10 rounded-3xl p-12 border-2 border-therapy-300/30 shadow-2xl">
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-foreground mb-4">
                100% Risk-Free Breakthrough Guarantee
              </h3>
              <p className="text-xl text-muted-foreground">
                Start your transformation today. If you don't see improvement in 7 days, we'll refund every penny.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-6 w-6 text-therapy-500" />
                <span className="font-semibold">No Credit Card Required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-6 w-6 text-therapy-500" />
                <span className="font-semibold">256-bit Encryption</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-6 w-6 text-therapy-500" />
                <span className="font-semibold">Cancel Anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedHeroSection;