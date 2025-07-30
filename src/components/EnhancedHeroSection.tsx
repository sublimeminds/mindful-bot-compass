import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Play, Bot, User, Shield, Clock, Brain } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import GradientLogo from '@/components/ui/GradientLogo';

const demoConversation = [
  {
    role: 'user',
    message: "I've been feeling really anxious lately about work.",
    delay: 0
  },
  {
    role: 'ai',
    message: "I understand that work anxiety can be overwhelming. Can you tell me more about what specific aspects of work are causing you the most stress?",
    delay: 2000
  },
  {
    role: 'user', 
    message: "I have a big presentation next week and I keep worrying about messing up.",
    delay: 4000
  }
];

const EnhancedHeroSection = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isDemoActive, setIsDemoActive] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [displayedMessages, setDisplayedMessages] = useState<typeof demoConversation>([]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (!isDemoActive) return;

    const timer = setTimeout(() => {
      if (currentMessage < demoConversation.length) {
        setDisplayedMessages(prev => [...prev, demoConversation[currentMessage]]);
        setCurrentMessage(prev => prev + 1);
      }
    }, currentMessage === 0 ? 500 : demoConversation[currentMessage]?.delay || 2000);

    return () => clearTimeout(timer);
  }, [currentMessage, isDemoActive]);

  const startDemo = () => {
    setIsDemoActive(true);
    setCurrentMessage(0);
    setDisplayedMessages([]);
  };

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Simplified single background layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-background to-therapy-50/15"></div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10 pt-32 pb-20">
        
        {/* Professional Hero Content */}
        <div className="text-center max-w-6xl mx-auto space-y-16">
          
          {/* Logo and Brand Header */}
          <div className={cn(
            "flex items-center justify-center space-x-4 transition-all duration-1000",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <div className="animate-swirl-breathe">
              <GradientLogo size="lg" />
            </div>
            <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent">
              TherapySync
            </div>
          </div>
          
          {/* Clean Headline - Enhanced Mobile */}
          <div className={cn(
            "space-y-6 md:space-y-8 transition-all duration-1000 delay-200",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-light leading-tight tracking-tight text-foreground px-4 sm:px-0">
              <span className="block sm:inline">Professional AI therapy,</span>
              <br className="hidden sm:block" />
              <span className="font-medium bg-gradient-to-r from-therapy-600 to-calm-600 bg-clip-text text-transparent block sm:inline">
                available instantly
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-light px-4 sm:px-0">
              Experience evidence-based mental health support with advanced AI that adapts to your unique needs.
              <span className="block sm:inline"> Private, secure, and accessible 24/7.</span>
            </p>
          </div>

          {/* Interactive Chat Demo - Enhanced Mobile */}
          <div className={cn(
            "transition-all duration-1000 delay-400 px-4 sm:px-0",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <div className="relative max-w-4xl mx-auto">
              <Card className="bg-white/80 backdrop-blur-sm shadow-xl border border-therapy-100/50">
                <CardContent className="p-4 sm:p-6 lg:p-12">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-therapy-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-therapy-700">AI Therapy Session</span>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center space-x-1">
                      <Shield className="w-3 h-3" />
                      <span>End-to-end encrypted</span>
                    </div>
                  </div>
                  
                  <div className="space-y-6 text-left min-h-[200px]">
                    {displayedMessages.map((msg, index) => (
                      <div 
                        key={index}
                        className={cn(
                          "flex items-start space-x-3 animate-fade-in",
                          msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                        )}
                      >
                        <div className={cn(
                          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                          msg.role === 'user' 
                            ? 'bg-blue-500' 
                            : 'bg-gradient-to-r from-therapy-500 to-calm-500'
                        )}>
                          {msg.role === 'user' ? (
                            <User className="h-4 w-4 text-white" />
                          ) : (
                            <Bot className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <div className={cn(
                          "flex-1 max-w-md p-4 rounded-2xl",
                          msg.role === 'user'
                            ? 'bg-blue-500 text-white ml-auto'
                            : 'bg-therapy-50 text-therapy-700'
                        )}>
                          <p className="text-sm leading-relaxed">{msg.message}</p>
                        </div>
                      </div>
                    ))}
                    
                    {isDemoActive && currentMessage < demoConversation.length && (
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-therapy-500 to-calm-500 flex items-center justify-center">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-therapy-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-therapy-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-therapy-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    )}
                    
                    {!isDemoActive && displayedMessages.length === 0 && (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">See how our AI provides professional, empathetic support</p>
                        <Button onClick={startDemo} className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 text-white">
                          <Play className="w-4 h-4 mr-2" />
                          Start Demo
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Professional CTAs */}
          <div className={cn(
            "flex flex-col sm:flex-row justify-center gap-6 transition-all duration-1000 delay-600",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <Button
              size="lg"
              onClick={() => navigate('/get-started')}
              className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 text-white font-medium px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start onboarding
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <Button
              variant="outline"
              size="lg" 
              className="border-therapy-200 text-therapy-700 hover:bg-therapy-50 font-medium px-8 py-6 text-lg rounded-xl transition-all duration-300"
            >
              See how it works
            </Button>
          </div>

          {/* Enhanced Trust Indicators */}
          <div className={cn(
            "grid grid-cols-1 sm:grid-cols-3 gap-6 pt-16 transition-all duration-1000 delay-800",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <Card className="bg-white/60 backdrop-blur-sm border-therapy-100/50 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="text-sm font-semibold text-therapy-700 mb-1">HIPAA Compliant</div>
                <div className="text-xs text-muted-foreground">Enterprise-grade security</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/60 backdrop-blur-sm border-therapy-100/50 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="text-sm font-semibold text-therapy-700 mb-1">24/7 Available</div>
                <div className="text-xs text-muted-foreground">No appointments needed</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/60 backdrop-blur-sm border-therapy-100/50 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="text-sm font-semibold text-therapy-700 mb-1">Evidence-based</div>
                <div className="text-xs text-muted-foreground">Clinical-grade AI</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedHeroSection;