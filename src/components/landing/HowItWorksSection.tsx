
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
      <section className="py-20 bg-gradient-to-br from-harmony-50 via-balance-50 to-flow-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <GradientLogo 
              size="xl"
              className="drop-shadow-sm"
            />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-800">
            How TherapySync Works
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Get started on your mental health journey in just a few simple steps. 
            Our AI-powered platform makes professional therapy support accessible anytime, anywhere.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="h-full hover:shadow-xl transition-all duration-300 group hover:scale-105 bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-harmony-500 via-balance-500 to-flow-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-swirl-breathe shadow-lg">
                        <span className="text-2xl font-bold text-white">{step.number}</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-slate-800">{step.title}</h3>
                      <p className="text-slate-600 text-sm mb-4">{step.description}</p>
                    </div>

                    <div className="space-y-2">
                      {step.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-harmony-500 flex-shrink-0" />
                          <span className="text-sm text-slate-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Arrow connector for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-6 w-6 text-harmony-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Brand reinforcement */}
        <div className="mt-16 text-center">
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
    </section>
    </SafeComponentWrapper>
  );
};

export default HowItWorksSection;
