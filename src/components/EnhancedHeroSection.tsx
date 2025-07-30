import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Users, Shield, Brain, Sparkles, CheckCircle2, Star, Globe } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const EnhancedHeroSection = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  // Visibility trigger for animations
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Trust signals and social proof
  const trustSignals = [
    { icon: Shield, text: "HIPAA Compliant & Secure", highlight: "100% Private" },
    { icon: Users, text: "50,000+ Lives Transformed", highlight: "Real Results" },
    { icon: Brain, text: "24+ AI Therapist Specialists", highlight: "Expert Care" },
    { icon: Globe, text: "Available 24/7 Worldwide", highlight: "Always Here" }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      location: "California",
      rating: 5,
      text: "TherapySync helped me through my darkest moments. The AI understood me better than I understood myself.",
      condition: "Anxiety & Depression"
    },
    {
      name: "Michael R.",
      location: "New York",
      rating: 5,
      text: "I was skeptical about AI therapy, but this changed my life. It's like having a therapist who never sleeps.",
      condition: "PTSD Recovery"
    },
    {
      name: "Elena K.",
      location: "London",
      rating: 5,
      text: "The cultural sensitivity and personalization is incredible. Finally, therapy that truly gets me.",
      condition: "Relationship Issues"
    }
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-therapy-50/30 to-calm-50/20">
      {/* Enhanced Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[40rem] h-[40rem] rounded-full opacity-10 animate-pulse">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-therapy-400 via-calm-400 to-harmony-400 blur-3xl"></div>
        </div>
        <div className="absolute -bottom-40 -left-40 w-[35rem] h-[35rem] rounded-full opacity-8 animate-pulse" style={{animationDelay: '2s'}}>
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-harmony-300 via-flow-300 to-therapy-300 blur-3xl"></div>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10 pt-20 pb-20">
        
        {/* Hero Header */}
        <div className="text-center mb-16 space-y-8">
          <div className={cn(
            "space-y-6 max-w-6xl mx-auto transition-all duration-1000",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <h1 className="text-5xl lg:text-7xl xl:text-8xl font-bold leading-tight">
              <span className="block text-foreground">Experience Our</span>
              <span className="block bg-gradient-to-r from-therapy-600 via-calm-500 to-harmony-500 bg-clip-text text-transparent">AI Therapy Hub</span>
              <span className="block text-foreground">In Action</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-4xl mx-auto">
              Discover how our advanced AI works behind the scenes to provide 
              <span className="font-semibold text-therapy-600"> personalized, effective, and safe </span>
              mental health support that adapts to your unique needs.
            </p>
          </div>

          {/* Call-to-Action Buttons */}
          <div className={cn(
            "flex flex-col sm:flex-row justify-center gap-6 transition-all duration-1000 delay-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <Button
              size="lg"
              onClick={() => navigate('/get-started')}
              className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 text-white font-semibold px-10 py-6 text-xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Heart className="mr-3 h-6 w-6" />
              <span>Start Your AI Therapy Journey</span>
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Trust Signals */}
        <div className={cn(
          "grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 transition-all duration-1000 delay-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          {trustSignals.map((signal, index) => (
            <div key={index} className="text-center p-6 rounded-xl bg-white/60 backdrop-blur-sm border border-therapy-200/50 shadow-lg">
              <signal.icon className="h-8 w-8 mx-auto mb-3 text-therapy-500" />
              <div className="text-sm font-semibold text-therapy-600 mb-1">{signal.highlight}</div>
              <div className="text-xs text-muted-foreground">{signal.text}</div>
            </div>
          ))}
        </div>

        {/* Personal Stories Section */}
        <div className={cn(
          "mb-16 transition-all duration-1000 delay-1000",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Real People, Real Transformations
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Join thousands who've found hope, healing, and growth through our AI-powered therapy platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-therapy-200/50 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-therapy-500 text-therapy-500" />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-therapy-600 font-semibold">{testimonial.rating}.0</span>
                </div>
                
                <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
                
                <div className="border-t border-therapy-200/30 pt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                    </div>
                    <div className="text-xs bg-therapy-100 text-therapy-700 px-2 py-1 rounded-full">
                      {testimonial.condition}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Value Proposition */}
        <div className={cn(
          "text-center max-w-4xl mx-auto transition-all duration-1000 delay-1200",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <div className="bg-gradient-to-r from-therapy-500/10 via-calm-500/10 to-harmony-500/10 rounded-2xl p-8 border border-therapy-200/30">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="h-8 w-8 text-therapy-500 mr-3" />
              <h3 className="text-2xl font-bold text-foreground">Why Choose AI Therapy?</h3>
              <Sparkles className="h-8 w-8 text-therapy-500 ml-3" />
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-therapy-500 flex-shrink-0" />
                  <span className="text-muted-foreground">Available 24/7, no waiting lists</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-therapy-500 flex-shrink-0" />
                  <span className="text-muted-foreground">Completely private and judgment-free</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-therapy-500 flex-shrink-0" />
                  <span className="text-muted-foreground">Personalized to your unique needs</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-therapy-500 flex-shrink-0" />
                  <span className="text-muted-foreground">More affordable than traditional therapy</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-therapy-500 flex-shrink-0" />
                  <span className="text-muted-foreground">Evidence-based therapeutic approaches</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-therapy-500 flex-shrink-0" />
                  <span className="text-muted-foreground">Crisis detection and immediate support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedHeroSection;