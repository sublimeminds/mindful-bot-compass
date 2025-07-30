import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, Cpu, Gauge, MessageSquare, Brain, Target, Activity, Shield, TrendingUp } from "lucide-react";
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';

const AIWorkflowSection = () => {
  const [activeStep, setActiveStep] = useState(0);

  // Auto-cycling AI workflow steps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % aiWorkflowSteps.length);
    }, 4000);
    return () => clearInterval(interval);
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
    <SafeComponentWrapper name="AIWorkflowSection">
      <div className="min-h-screen flex flex-col justify-center w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto w-full space-y-8 sm:space-y-12 lg:space-y-16">
          
          {/* Section Header */}
          <div className="text-center space-y-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
              How Our AI Works: Step by Step
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              From first assessment to ongoing optimization, experience the complete AI-powered journey
            </p>
          </div>

          {/* Interactive Workflow Steps - Mobile-First */}
          <div className="space-y-8 lg:space-y-12">
            
            {/* Mobile: Stacked, Desktop: Side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              
              {/* Workflow Navigation */}
              <div className="space-y-4 lg:space-y-6">
                {aiWorkflowSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className={cn(
                      "p-4 sm:p-6 rounded-xl border-2 transition-all duration-500 cursor-pointer",
                      activeStep === index
                        ? `border-${step.color}-400 bg-${step.color}-50/50 shadow-lg`
                        : "border-border bg-background/60 hover:border-therapy-300"
                    )}
                    onClick={() => setActiveStep(index)}
                  >
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className={cn(
                        "p-2 sm:p-3 rounded-lg transition-all duration-300 flex-shrink-0",
                        activeStep === index
                          ? `bg-${step.color}-500 text-white shadow-lg`
                          : "bg-muted text-muted-foreground"
                      )}>
                        <step.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                          {index + 1}. {step.title}
                        </h3>
                        <p className="text-sm sm:text-base text-muted-foreground mb-4 leading-relaxed">
                          {step.description}
                        </p>
                        
                        {activeStep === index && (
                          <div className="space-y-3 animate-fade-in">
                            {/* Mobile: Single column, Desktop: Two columns */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {step.features.map((feature, idx) => (
                                <div key={idx} className="flex items-center space-x-2 text-xs sm:text-sm">
                                  <CheckCircle2 className={`h-3 w-3 sm:h-4 sm:w-4 text-${step.color}-500 flex-shrink-0`} />
                                  <span className="text-foreground">{feature}</span>
                                </div>
                              ))}
                            </div>
                            
                            <div className="flex flex-wrap gap-2 sm:gap-4 pt-2">
                              {Object.entries(step.metrics).map(([key, value]) => (
                                <div key={key} className="text-xs sm:text-sm">
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

              {/* Visual Demonstration - Mobile Optimized */}
              <div className="relative order-first lg:order-last">
                <div className={cn(
                  "relative p-4 sm:p-6 lg:p-8 rounded-2xl border transition-all duration-700",
                  `bg-gradient-to-br from-${currentStep.color}-50/30 to-${currentStep.color}-100/20`,
                  `border-${currentStep.color}-200`
                )}>
                  <div className="text-center space-y-4 lg:space-y-6">
                    <div className={cn(
                      "w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full flex items-center justify-center transition-all duration-500",
                      `bg-${currentStep.color}-500 text-white shadow-xl animate-pulse`
                    )}>
                      <currentStep.icon className="h-8 w-8 sm:h-10 sm:w-10" />
                    </div>
                    
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                      {currentStep.title}
                    </h3>
                    
                    <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                      {currentStep.visual}
                    </p>
                    
                    {/* Simulated Interface Preview - Mobile Responsive */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 sm:p-4 lg:p-6 shadow-inner">
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-1 sm:space-x-2">
                            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-400 rounded-full"></div>
                            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-full"></div>
                            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full"></div>
                          </div>
                          <div className="text-xs text-muted-foreground hidden sm:block">
                            TherapySync AI - {currentStep.title}
                          </div>
                        </div>
                        <div className="h-24 sm:h-32 bg-gradient-to-r from-therapy-100 to-calm-100 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <div className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-${currentStep.color}-500 animate-spin`}>
                              <Cpu className="h-6 w-6 sm:h-8 sm:w-8" />
                            </div>
                            <div className="text-xs sm:text-sm text-muted-foreground">
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

            {/* AI Capabilities Dashboard - Mobile Optimized */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-therapy-200/50 p-4 sm:p-6 lg:p-8 shadow-xl">
              <div className="text-center space-y-4 mb-6 lg:mb-8">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                  AI Performance Dashboard
                </h2>
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
                  Real-time metrics showing our AI's capabilities and performance
                </p>
              </div>
              
              {/* Mobile: Single column, Desktop: Three columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {aiCapabilities.map((category, categoryIndex) => (
                  <div key={category.category} className="space-y-3 lg:space-y-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-foreground flex items-center">
                      <Gauge className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-therapy-500 flex-shrink-0" />
                      <span className="break-words">{category.category}</span>
                    </h3>
                    
                    <div className="space-y-3">
                      {category.capabilities.map((capability, index) => (
                        <div key={capability.name} className="space-y-2">
                          <div className="flex justify-between text-xs sm:text-sm">
                            <span className="text-muted-foreground break-words flex-1 mr-2">{capability.name}</span>
                            <span className="font-semibold text-therapy-600 flex-shrink-0">{capability.level}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                            <div 
                              className="bg-gradient-to-r from-therapy-500 to-calm-500 h-1.5 sm:h-2 rounded-full transition-all duration-1000 ease-out"
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
        </div>
      </div>
    </SafeComponentWrapper>
  );
};

export default AIWorkflowSection;