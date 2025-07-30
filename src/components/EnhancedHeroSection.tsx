import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Heart, Sparkles, Shield, Users, Zap, Brain, Clock, Lightbulb, Globe, Cpu, BarChart3, AlertTriangle, Waves, Mic, Target, TrendingUp, MonitorSpeaker, Activity, Gauge, CheckCircle2, Timer, MessageSquare } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const EnhancedHeroSection = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Auto-cycling AI workflow steps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % aiWorkflowSteps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Visibility trigger for animations
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Enhanced AI Workflow Steps - showing the actual user journey
  const aiWorkflowSteps = [
    {
      id: 'onboarding',
      title: 'Smart Onboarding',
      description: 'AI-powered assessment analyzes your mental health needs, preferences, and goals to create a personalized therapy plan.',
      icon: MessageSquare,
      color: 'therapy',
      features: [
        'Personalized mental health assessment',
        'Cultural background analysis',
        'Therapy preference matching',
        'Goal setting and prioritization'
      ],
      metrics: { accuracy: '96%', time: '5 min', users: '50k+' },
      visual: 'Interactive questionnaire with real-time AI insights'
    },
    {
      id: 'matching',
      title: 'AI Therapist Matching',
      description: 'Advanced matching algorithm selects the perfect AI therapist from 24+ specialized personalities based on your unique profile.',
      icon: Brain,
      color: 'calm',
      features: [
        'Compatibility analysis across 50+ factors',
        'Specialized therapy approach matching',
        'Cultural competency alignment',
        'Communication style optimization'
      ],
      metrics: { specialists: '24+', accuracy: '94%', satisfaction: '4.9/5' },
      visual: 'AI analyzing therapist compatibility in real-time'
    },
    {
      id: 'strategy',
      title: 'Dynamic Strategy Selection',
      description: 'AI adapts therapeutic techniques in real-time, selecting from CBT, DBT, mindfulness, and trauma-informed approaches based on session context.',
      icon: Target,
      color: 'harmony',
      features: [
        'Real-time technique adaptation',
        'Evidence-based approach selection',
        'Progress-driven strategy evolution',
        'Cultural adaptation integration'
      ],
      metrics: { techniques: '100+', adaptation: 'Real-time', effectiveness: '40% better' },
      visual: 'Dynamic strategy tree showing technique selection'
    },
    {
      id: 'analysis',
      title: 'Real-Time Emotional Analysis',
      description: 'Continuous monitoring of emotional state through voice, text, and behavioral patterns to provide immediate support and crisis detection.',
      icon: Activity,
      color: 'flow',
      features: [
        'Voice emotion recognition',
        'Text sentiment analysis',
        'Behavioral pattern detection',
        '24/7 crisis monitoring'
      ],
      metrics: { accuracy: '98%', response: '<1 sec', uptime: '99.9%' },
      visual: 'Live emotional state visualization with safety alerts'
    },
    {
      id: 'prevention',
      title: 'Predictive Crisis Prevention',
      description: 'AI learns your patterns to predict and prevent mental health crises before they occur, with immediate professional intervention when needed.',
      icon: Shield,
      color: 'mindful',
      features: [
        'Pattern-based crisis prediction',
        'Immediate professional alerts',
        'Emergency resource activation',
        'Family notification system'
      ],
      metrics: { prevention: '89%', response: '< 2 min', professionals: '24/7' },
      visual: 'Predictive analytics dashboard with intervention triggers'
    },
    {
      id: 'optimization',
      title: 'Continuous Learning & Optimization',
      description: 'AI continuously learns from your progress, refining approaches and techniques to maximize therapeutic effectiveness over time.',
      icon: TrendingUp,
      color: 'balance',
      features: [
        'Progress tracking and analysis',
        'Technique effectiveness measurement',
        'Personalized optimization',
        'Long-term outcome prediction'
      ],
      metrics: { improvement: '40%', learning: 'Continuous', data: 'Privacy-protected' },
      visual: 'Progress analytics with personalized insights'
    }
  ];

  // AI Capabilities Showcase
  const aiCapabilities = [
    {
      category: 'Intelligence',
      capabilities: [
        { name: 'Natural Language Understanding', level: 98 },
        { name: 'Emotional Intelligence', level: 96 },
        { name: 'Cultural Awareness', level: 94 },
        { name: 'Crisis Detection', level: 99 }
      ]
    },
    {
      category: 'Personalization',
      capabilities: [
        { name: 'Therapy Matching', level: 95 },
        { name: 'Technique Adaptation', level: 93 },
        { name: 'Progress Optimization', level: 91 },
        { name: 'Communication Style', level: 97 }
      ]
    },
    {
      category: 'Security & Privacy',
      capabilities: [
        { name: 'HIPAA Compliance', level: 100 },
        { name: 'End-to-End Encryption', level: 100 },
        { name: 'Data Protection', level: 99 },
        { name: 'Privacy Controls', level: 98 }
      ]
    }
  ];

  const currentStep = aiWorkflowSteps[activeStep];

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
        <div className="text-center mb-20 space-y-8">
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

        {/* AI Workflow Visualization */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              How Our AI Works: Step by Step
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              From first assessment to ongoing optimization, experience the complete AI-powered journey
            </p>
          </div>

          {/* Interactive Workflow Steps */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Workflow Navigation */}
            <div className="space-y-6">
              {aiWorkflowSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={cn(
                    "p-6 rounded-xl border-2 transition-all duration-500 cursor-pointer",
                    activeStep === index
                      ? `border-${step.color}-400 bg-${step.color}-50/50 shadow-lg scale-105`
                      : "border-border bg-background/60 hover:border-therapy-300"
                  )}
                  onClick={() => setActiveStep(index)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={cn(
                      "p-3 rounded-lg transition-all duration-300",
                      activeStep === index
                        ? `bg-${step.color}-500 text-white shadow-lg`
                        : "bg-muted text-muted-foreground"
                    )}>
                      <step.icon className="h-6 w-6" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {index + 1}. {step.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {step.description}
                      </p>
                      
                      {activeStep === index && (
                        <div className="space-y-3 animate-fade-in">
                          <div className="grid grid-cols-2 gap-2">
                            {step.features.map((feature, idx) => (
                              <div key={idx} className="flex items-center space-x-2 text-sm">
                                <CheckCircle2 className={`h-4 w-4 text-${step.color}-500`} />
                                <span className="text-foreground">{feature}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex flex-wrap gap-4 pt-2">
                            {Object.entries(step.metrics).map(([key, value]) => (
                              <div key={key} className="text-sm">
                                <span className="text-muted-foreground capitalize">{key}: </span>
                                <span className={`font-semibold text-${step.color}-600`}>{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Visual Demonstration */}
            <div className="relative">
              <div className={cn(
                "relative p-8 rounded-2xl border transition-all duration-700",
                `bg-gradient-to-br from-${currentStep.color}-50/30 to-${currentStep.color}-100/20`,
                `border-${currentStep.color}-200`
              )}>
                <div className="text-center space-y-6">
                  <div className={cn(
                    "w-20 h-20 mx-auto rounded-full flex items-center justify-center transition-all duration-500",
                    `bg-${currentStep.color}-500 text-white shadow-xl animate-pulse`
                  )}>
                    <currentStep.icon className="h-10 w-10" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-foreground">
                    {currentStep.title}
                  </h3>
                  
                  <p className="text-lg text-muted-foreground">
                    {currentStep.visual}
                  </p>
                  
                  {/* Simulated Interface Preview */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-inner">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          TherapySync AI - {currentStep.title}
                        </div>
                      </div>
                      <div className="h-32 bg-gradient-to-r from-therapy-100 to-calm-100 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className={`w-8 h-8 mx-auto mb-2 text-${currentStep.color}-500 animate-spin`}>
                            <Cpu className="h-8 w-8" />
                          </div>
                          <div className="text-sm text-muted-foreground">
                            AI Processing: {currentStep.title}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Capabilities Dashboard */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-therapy-200/50 p-8 shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              AI Performance Dashboard
            </h2>
            <p className="text-lg text-muted-foreground">
              Real-time metrics showing our AI's capabilities and performance
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {aiCapabilities.map((category, categoryIndex) => (
              <div key={category.category} className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground flex items-center">
                  <Gauge className="h-5 w-5 mr-2 text-therapy-500" />
                  {category.category}
                </h3>
                
                <div className="space-y-3">
                  {category.capabilities.map((capability, index) => (
                    <div key={capability.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{capability.name}</span>
                        <span className="font-semibold text-therapy-600">{capability.level}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-therapy-500 to-calm-500 h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ 
                            width: `${capability.level}%`,
                            animationDelay: `${(categoryIndex * 4 + index) * 200}ms`
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedHeroSection;