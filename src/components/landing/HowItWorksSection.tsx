import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, ArrowRight } from 'lucide-react';
import GradientLogo from '@/components/ui/GradientLogo';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';

const steps = [
  {
    number: "01",
    title: "Quick Signup & Assessment",
    description: "Create your account and complete our personalized assessment to understand your unique needs and goals.",
    features: ["5-minute setup", "Privacy-focused", "Personalized matching"]
  },
  {
    number: "02", 
    title: "Choose Your AI Therapist",
    description: "Select from different therapeutic approaches and personality styles that resonate with you.",
    features: ["Multiple approaches", "Personality matching", "Instant availability"]
  },
  {
    number: "03",
    title: "Start Your Journey",
    description: "Begin your personalized therapy sessions with 24/7 access to your AI companion.",
    features: ["Immediate access", "Voice & text options", "Progress tracking"]
  },
  {
    number: "04",
    title: "Track Your Progress",
    description: "Monitor your mental health journey with detailed analytics and personalized insights.",
    features: ["Visual progress", "Goal achievement", "Adaptive recommendations"]
  }
];

const HowItWorksSection = () => {
  return (
    <SafeComponentWrapper name="HowItWorksSection">
      <div className="min-h-screen flex flex-col justify-center w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto w-full space-y-8 sm:space-y-12 lg:space-y-16">
          <div className="text-center space-y-4 sm:space-y-6">
            <div className="flex items-center justify-center">
              <GradientLogo 
                size="lg"
                className="drop-shadow-sm"
              />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800">
              How TherapySync Works
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Get started on your mental health journey in just a few simple steps. 
              Our AI-powered platform makes professional therapy support accessible anytime, anywhere.
            </p>
          </div>

          {/* Mobile: Single column, Desktop: 4 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="h-full hover:shadow-xl transition-all duration-300 group hover:scale-105 bg-white border border-therapy-200">
                  <CardContent className="p-4 sm:p-6">
                    <div className="text-center space-y-3 sm:space-y-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-harmony-500 via-balance-500 to-flow-600 rounded-full flex items-center justify-center mx-auto group-hover:animate-swirl-breathe shadow-lg">
                        <span className="text-lg sm:text-2xl font-bold text-white">{step.number}</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-slate-800">{step.title}</h3>
                      <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{step.description}</p>
                    </div>

                    <div className="space-y-2 mt-4">
                      {step.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2">
                          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-harmony-500 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-slate-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Arrow connector for desktop only */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-6 w-6 text-harmony-500" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Brand reinforcement */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-sm text-slate-500">
              <span>Powered by</span>
              <GradientLogo 
                size="sm"
                className="opacity-60"
              />
              <span className="font-medium bg-gradient-to-r from-harmony-600 to-flow-600 bg-clip-text text-transparent">TherapySync AI</span>
            </div>
          </div>
        </div>
      </div>
    </SafeComponentWrapper>
  );
};

export default HowItWorksSection;