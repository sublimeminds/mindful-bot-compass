import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Star } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { getItemIcon } from '@/utils/iconUtils';
import { useNavigationMenus } from '@/hooks/useNavigationMenus';

const EnterpriseHeroSection = () => {
  const navigate = useNavigate();
  const [activeMetric, setActiveMetric] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const { menuConfig, loading } = useNavigationMenus();

  // Helper function to safely render icons
  const renderIcon = (iconName: string, props: { size?: number; className?: string } = {}) => {
    const IconComponent = getItemIcon(iconName);
    return React.createElement(IconComponent as React.ComponentType<any>, props);
  };

  // Auto-cycling metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMetric((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-cycling testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Get all navigation features organized by menu
  const organizeFeaturesByMenu = (): Record<string, { icon: string; items: any[] }> => {
    if (!menuConfig.menus || !menuConfig.items) return {};
    
    const organized: Record<string, { icon: string; items: any[] }> = {};
    menuConfig.menus
      .filter(menu => menu.is_active)
      .sort((a, b) => a.position - b.position)
      .forEach(menu => {
        const menuItems = menuConfig.items
          .filter(item => item.menu_id === menu.id && item.is_active)
          .sort((a, b) => a.position - b.position);
        
        if (menuItems.length > 0) {
          organized[menu.label] = {
            icon: menu.icon,
            items: menuItems
          };
        }
      });
    
    return organized;
  };

  const featuresData = organizeFeaturesByMenu();

  const metrics = [
    { value: "50k+", label: "People Supported", icon: "for-individuals", trend: "Growing Daily" },
    { value: "4.9/5", label: "User Rating", icon: Star, trend: "Highly Rated" },
    { value: "24/7", label: "Always Available", icon: "crisis-support", trend: "Anytime" },
    { value: "Private", label: "Secure & Safe", icon: "enterprise-security", trend: "HIPAA Protected" }
  ];

  const testimonials = [
    {
      quote: "This AI therapist helped me work through my anxiety in ways I never thought possible. I feel so much calmer.",
      author: "Sarah M.",
      role: "Marketing Professional",
      company: "Individual User"
    },
    {
      quote: "Having someone to talk to anytime I need it has been life-changing. The conversations feel so real and helpful.",
      author: "Michael R.",
      role: "College Student",
      company: "Individual User"
    },
    {
      quote: "I was skeptical at first, but this AI really understands me. It's like having a therapist in my pocket.",
      author: "Emily W.",
      role: "Working Parent",
      company: "Individual User"
    }
  ];

  // Main hero features using custom icons
  const heroFeatures = [
    { icon: "therapy-sync-ai-core", label: "8+ AI Personalities" },
    { icon: "enterprise-security", label: "Private & Secure" },
    { icon: "ai-therapy-chat", label: "Instant Support" },
    { icon: "crisis-support-system", label: "24/7 Crisis Support" }
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-therapy-50/20 via-background to-calm-50/10 pt-20 pb-8">
      {/* Industry-Grade Multi-layered Background System */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary Gradient Orbs with Advanced Effects */}
        <div className="absolute -top-32 -right-32 w-[32rem] h-[32rem] rounded-full opacity-15 animate-swirl-breathe">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-therapy-400 via-calm-400 to-harmony-400 blur-3xl"></div>
        </div>
        <div className="absolute -bottom-40 -left-40 w-[28rem] h-[28rem] rounded-full opacity-12 animate-swirl-breathe" style={{animationDelay: '2s'}}>
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-harmony-300 via-flow-300 to-therapy-300 blur-3xl"></div>
        </div>
        
        {/* Floating Custom Icon Constellation */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-[15%] left-[8%] animate-wave-therapy">
            {renderIcon("therapy-sync-ai-core", { size: 32, className: "text-therapy-500" })}
          </div>
          <div className="absolute top-[25%] right-[12%] animate-pulse-neural" style={{animationDelay: '1s'}}>
            {renderIcon("ai-therapy-chat", { size: 28, className: "text-calm-500" })}
          </div>
          <div className="absolute bottom-[20%] left-[15%] animate-breathe-mindful" style={{animationDelay: '2s'}}>
            {renderIcon("voice-ai-therapy", { size: 30, className: "text-harmony-500" })}
          </div>
          <div className="absolute bottom-[35%] right-[8%] animate-shield-secure" style={{animationDelay: '3s'}}>
            {renderIcon("crisis-support-system", { size: 26, className: "text-flow-500" })}
          </div>
          <div className="absolute top-[40%] left-[5%] animate-bounce-family" style={{animationDelay: '4s'}}>
            {renderIcon("group-therapy-ai", { size: 24, className: "text-mindful-500" })}
          </div>
          <div className="absolute bottom-[50%] right-[15%] animate-connect-sync" style={{animationDelay: '5s'}}>
            {renderIcon("integrations-hub", { size: 28, className: "text-balance-500" })}
          </div>
        </div>
        
        {/* Enhanced Neural Network Pattern */}
        <div className="absolute inset-0 opacity-[0.06]">
          <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-therapy-500 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-calm-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/4 left-1/3 w-2.5 h-2.5 bg-harmony-500 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-flow-500 rounded-full animate-pulse" style={{animationDelay: '3s'}}></div>
          
          {/* Advanced Connecting Network */}
          <svg className="absolute inset-0 w-full h-full" style={{zIndex: 1}}>
            <defs>
              <linearGradient id="neural-line" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--therapy-500))" stopOpacity="0.15"/>
                <stop offset="50%" stopColor="hsl(var(--calm-500))" stopOpacity="0.1"/>
                <stop offset="100%" stopColor="hsl(var(--harmony-500))" stopOpacity="0.15"/>
              </linearGradient>
              <linearGradient id="neural-line-alt" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--flow-500))" stopOpacity="0.12"/>
                <stop offset="100%" stopColor="hsl(var(--therapy-500))" stopOpacity="0.08"/>
              </linearGradient>
            </defs>
            <line x1="25%" y1="25%" x2="75%" y2="33%" stroke="url(#neural-line)" strokeWidth="1.5" className="animate-pulse"/>
            <line x1="33%" y1="33%" x2="66%" y2="75%" stroke="url(#neural-line)" strokeWidth="1.5" className="animate-pulse" style={{animationDelay: '1s'}}/>
            <line x1="75%" y1="25%" x2="25%" y2="75%" stroke="url(#neural-line-alt)" strokeWidth="1.5" className="animate-pulse" style={{animationDelay: '2s'}}/>
            <line x1="15%" y1="60%" x2="85%" y2="40%" stroke="url(#neural-line-alt)" strokeWidth="1" className="animate-pulse" style={{animationDelay: '3s'}}/>
          </svg>
        </div>
        
        {/* Glassmorphism Layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-therapy-50/[0.01] backdrop-blur-[0.5px]"></div>
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Column - Content */}
          <div className="space-y-8">
            
            {/* Trust Badge & Alert */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 border border-therapy-200/50 shadow-therapy-subtle">
                {renderIcon("enterprise-security", { className: "h-4 w-4 text-therapy-600" })}
                <span className="text-sm font-semibold text-therapy-700">Your Privacy Protected</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              
              <div className="inline-flex items-center space-x-2 bg-harmony-50/80 backdrop-blur-sm rounded-full px-3 py-1 border border-harmony-200/50">
                {renderIcon("ai-personalization", { className: "h-3 w-3 text-harmony-600" })}
                <span className="text-xs font-medium text-harmony-700">New: 8 AI Personalities Available</span>
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="block text-foreground">Your Personal</span>
                <span className="block therapy-text-gradient-animated">AI Therapist</span>
                <span className="block text-foreground">Is Here for You</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
                Get personalized mental health support whenever you need it. 
                <span className="font-semibold therapy-text-gradient"> Safe, private, </span>
                and designed to help you feel 
                <span className="font-bold text-therapy-600"> 40% calmer in just 2 weeks.</span>
              </p>
            </div>

            {/* Dynamic Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics.map((metric, index) => (
                <div 
                  key={index}
                  className={cn(
                    "p-4 rounded-xl border transition-all duration-300 cursor-pointer",
                    activeMetric === index 
                      ? "bg-therapy-50 border-therapy-200 shadow-therapy-glow scale-105" 
                      : "bg-white/50 border-gray-200 hover:border-therapy-200"
                  )}
                  onMouseEnter={() => setActiveMetric(index)}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    {typeof metric.icon === 'string' ? 
                      renderIcon(metric.icon, { 
                        className: cn(
                          "h-4 w-4",
                          activeMetric === index ? "text-therapy-600" : "text-gray-600"
                        )
                      }) :
                      React.createElement(metric.icon, { 
                        className: cn(
                          "h-4 w-4",
                          activeMetric === index ? "text-therapy-600" : "text-gray-600"
                        )
                      })
                    }
                    <span className="text-xs font-medium text-green-600">{metric.trend}</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                  <div className="text-sm text-muted-foreground">{metric.label}</div>
                </div>
              ))}
            </div>

            {/* Call-to-Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={() => navigate('/get-started')}
                className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 text-white font-semibold px-8 py-6 text-lg rounded-xl shadow-therapy-glow hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <span>Start Your Journey Free</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-therapy-200 text-therapy-700 hover:bg-therapy-50 font-semibold px-8 py-6 text-lg rounded-xl transition-all duration-300 hover:scale-105 relative z-20"
              >
                <Play className="mr-2 h-5 w-5" />
                <span>See How It Works</span>
              </Button>
            </div>

            {/* Enhanced Personal Features with Custom Icons */}
            <div className="grid grid-cols-2 gap-4">
              {heroFeatures.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-therapy-200/30 hover:border-therapy-300/50 transition-all duration-300 hover:bg-white/80">
                  {renderIcon("security-compliance", { className: "h-4 w-4 text-green-500 flex-shrink-0" })}
                  {renderIcon(feature.icon, { size: 20, className: "text-therapy-600 flex-shrink-0" })}
                  <span className="text-sm font-medium text-therapy-700">{feature.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Interactive Visual */}
          <div className="relative">
            
            {/* Main Interactive Dashboard */}
            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              
              {/* Enhanced Dashboard Header with AI Icon */}
              <div className="bg-gradient-to-r from-therapy-500 to-calm-500 p-6 text-white relative overflow-hidden">
                <div className="absolute top-2 right-2 opacity-20">
                  {renderIcon("therapy-sync-ai-core", { size: 40, className: "text-white" })}
                </div>
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      {renderIcon("ai-therapy-chat", { size: 24, className: "text-white" })}
                      Your Therapy Journey
                    </h3>
                    <p className="text-therapy-100">AI-Powered Progress & Insights</p>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              {/* Dashboard Content */}
              <div className="p-6 space-y-6">
                
                {/* Progress Visualization */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">Your Progress</h4>
                  <div className="space-y-3">
                    {['Mood Improvement', 'Stress Reduction', 'Coping Skills'].map((metric, index) => (
                      <div key={metric} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{metric}</span>
                          <span className="font-semibold text-therapy-600">{75 + index * 10}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-therapy-500 to-calm-500 rounded-full transition-all duration-1000 ease-out"
                            style={{width: `${75 + index * 10}%`, animationDelay: `${index * 200}ms`}}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enhanced AI Insights Panel with Custom Icon */}
                <div className="bg-gradient-to-br from-therapy-50 to-calm-50 rounded-xl p-4 border border-therapy-200/50 relative overflow-hidden">
                  <div className="absolute top-1 right-1 opacity-10">
                    {renderIcon("therapy-sync-ai-core", { size: 32, className: "text-therapy-600" })}
                  </div>
                  <div className="flex items-center space-x-2 mb-3 relative z-10">
                    {renderIcon("therapy-sync-ai-core", { size: 20, className: "text-therapy-600 animate-pulse-neural" })}
                    <span className="font-semibold text-therapy-700">AI Personal Insights</span>
                    <div className="ml-auto bg-therapy-600 text-white text-xs px-2 py-1 rounded-full">Live</div>
                  </div>
                  <p className="text-sm text-therapy-700 relative z-10">
                    Your therapy progress shows 40% improvement in anxiety management. AI recommends mindfulness techniques.
                  </p>
                </div>

                {/* Mini Charts */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Mood Trend</div>
                    <div className="h-12 bg-gradient-to-r from-therapy-100 to-calm-100 rounded-lg flex items-end justify-center space-x-1 p-2">
                      {[0.5, 0.7, 0.6, 0.8, 0.9, 0.85, 0.95].map((height, index) => (
                        <div 
                          key={index}
                          className="w-2 bg-therapy-500 rounded-sm transition-all duration-500"
                          style={{height: `${height * 100}%`, animationDelay: `${index * 100}ms`}}
                        ></div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Support Sessions</div>
                    <div className="h-12 bg-gradient-to-r from-calm-100 to-harmony-100 rounded-lg flex items-center justify-center">
                      <div className="relative w-8 h-8">
                        <div className="absolute inset-0 bg-calm-500 rounded-full animate-ping opacity-30"></div>
                        <div className="absolute inset-0 bg-calm-500 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-xl p-4 border border-therapy-200/50 animate-bounce-family">
              {renderIcon("healthcare-providers", { className: "h-6 w-6 text-therapy-600" })}
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-xl p-3 border border-calm-200/50 animate-slide-smooth">
              {renderIcon("progress-reports", { className: "h-5 w-5 text-calm-600" })}
            </div>
          </div>
        </div>

        {/* Industry-Grade Comprehensive Platform Features Showcase */}
        <div className="mt-24 pt-20 relative">
          {/* Enhanced Section Header */}
          <div className="text-center mb-20 relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.02]">
              <div className="absolute top-0 left-1/4 animate-wave-therapy">
                {renderIcon("therapy-sync-ai-core", { size: 60, className: "text-therapy-500" })}
              </div>
              <div className="absolute top-0 right-1/4 animate-pulse-neural" style={{animationDelay: '1s'}}>
                {renderIcon("ai-therapy-chat", { size: 50, className: "text-calm-500" })}
              </div>
            </div>
            
            <h2 className="text-5xl lg:text-6xl font-bold mb-8 relative z-10">
              <span className="therapy-text-gradient">Complete Mental Health</span>
              <br />
              <span className="text-foreground">Platform Suite</span>
            </h2>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Industry-leading AI therapy technology with comprehensive tools for mental health professionals, 
              enterprises, and individuals seeking personalized care
            </p>
          </div>

          {/* All Features Showcase - Complete Navigation Features */}
          {loading ? (
            <div className="text-center text-gray-500">Loading platform features...</div>
          ) : (
            <div className="space-y-24">
              {Object.entries(featuresData).map(([menuLabel, menuData], menuIndex) => {
                const MenuIcon = getItemIcon(menuData.icon);
                return (
                  <div key={menuIndex} className="space-y-12">
                    <div className="text-center">
                      <div className="inline-flex items-center gap-4 bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-4 border border-therapy-200/50 mb-6">
                        {renderIcon(menuData.icon, { size: 32, className: "text-therapy-600 animate-pulse-neural" })}
                        <h3 className="text-3xl font-bold therapy-text-gradient">{menuLabel}</h3>
                      </div>
                      <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                        Comprehensive {menuLabel.toLowerCase()} features designed to enhance your mental health journey
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                      {menuData.items.map((item, itemIndex) => {
                        return (
                          <div key={itemIndex} className="group bg-white/90 backdrop-blur-xl rounded-2xl p-8 border border-gray-200/50 hover:border-therapy-300/70 transition-all duration-500 hover:shadow-therapy-glow hover:scale-105 relative overflow-hidden">
                            {/* Background Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-therapy-50/20 via-transparent to-calm-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            
                            <div className="relative z-10">
                              <div className="mb-6">
                                <div className="w-20 h-20 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 border border-therapy-200/30">
                                  {renderIcon(item.icon, { size: 40, className: "text-therapy-600 group-hover:text-therapy-700 transition-colors" })}
                                </div>
                                {item.badge && (
                                  <span className="inline-block px-3 py-1.5 rounded-full text-xs font-bold mb-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                                    {item.badge}
                                  </span>
                                )}
                                <h4 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-therapy-700 transition-colors">{item.title}</h4>
                                <p className="text-sm text-gray-600 group-hover:text-gray-700 leading-relaxed">{item.description}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Section - Social Proof */}
        <div className="mt-20 pt-12 border-t border-gray-200/50">
          
          {/* Customer Testimonial Carousel */}
          <div className="text-center mb-12">
            <div className="max-w-4xl mx-auto">
              <div className="relative h-32 overflow-hidden">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className={cn(
                      "absolute inset-0 transition-all duration-500 transform",
                      currentTestimonial === index 
                        ? "opacity-100 translate-y-0" 
                        : "opacity-0 translate-y-4"
                    )}
                  >
                    <blockquote className="text-lg lg:text-xl text-muted-foreground italic mb-4">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="text-sm font-semibold text-foreground">{testimonial.author}</div>
                      <span className="text-muted-foreground">•</span>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      <span className="text-muted-foreground">•</span>
                      <div className="text-sm font-medium text-therapy-600">{testimonial.company}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Testimonial Indicators */}
              <div className="flex justify-center space-x-2 mt-6">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-300",
                      currentTestimonial === index 
                        ? "bg-therapy-500 w-8" 
                        : "bg-gray-300 hover:bg-therapy-300"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Personal Benefits */}
          <div className="text-center text-sm text-muted-foreground space-y-2">
            <div className="flex flex-wrap justify-center items-center gap-6">
              <div className="flex items-center space-x-2">
                {renderIcon("security-compliance", { className: "h-4 w-4 text-green-500" })}
                <span>100% Private & Secure</span>
              </div>
              <div className="flex items-center space-x-2">
                {renderIcon("enterprise-security", { className: "h-4 w-4 text-green-500" })}
                <span>HIPAA Protected</span>
              </div>
              <div className="flex items-center space-x-2">
                {renderIcon("crisis-support", { className: "h-4 w-4 text-green-500" })}
                <span>Always Available</span>
              </div>
              <div className="flex items-center space-x-2">
                {renderIcon("getting-started", { className: "h-4 w-4 text-green-500" })}
                <span>No Credit Card Required</span>
              </div>
            </div>
            <p className="text-xs">Start your free journey today • Your conversations are always private • Cancel anytime</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnterpriseHeroSection;