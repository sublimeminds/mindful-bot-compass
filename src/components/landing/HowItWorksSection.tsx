
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, ArrowRight } from 'lucide-react';

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
    <section className="py-20 bg-gradient-to-br from-therapy-50 to-calm-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            How MindfulAI Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started on your mental health journey in just a few simple steps. 
            Our AI-powered platform makes professional therapy support accessible anytime, anywhere.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="h-full hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-white">{step.number}</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{step.description}</p>
                    </div>

                    <div className="space-y-2">
                      {step.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-therapy-500 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Arrow connector for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-6 w-6 text-therapy-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
