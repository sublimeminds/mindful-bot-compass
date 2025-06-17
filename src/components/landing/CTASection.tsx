
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Star, Clock, Shield } from 'lucide-react';
import QuickSignupWithPlan from '@/components/subscription/QuickSignupWithPlan';

const benefits = [
  {
    icon: Star,
    text: "Start free - no credit card required"
  },
  {
    icon: Clock,
    text: "Available 24/7"
  },
  {
    icon: Shield,
    text: "100% confidential"
  }
];

const CTASection = () => {
  const [urgencyTimer, setUrgencyTimer] = useState(18);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setUrgencyTimer(prev => prev > 0 ? prev - 1 : 18);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-harmony-500 via-balance-500 to-flow-600 animate-gradient-flow bg-[length:400%_400%] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-swirl-breathe"></div>
      <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full blur-xl animate-swirl-breathe" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Urgency element */}
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 bg-harmony-300 rounded-full animate-pulse"></div>
            <span className="text-white text-sm font-medium">
              {urgencyTimer} spots left for free assessment today
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Your Mental Wellness Journey
            <span className="block">Flows in Perfect Harmony</span>
          </h2>
          
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands who've found hope, healing, and harmony. 
            Sync with personalized AI therapy support in under 5 minutes.
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <IconComponent className="h-4 w-4 text-white" />
                  <span className="text-white text-sm">{benefit.text}</span>
                </div>
              );
            })}
          </div>

          {/* Main CTA */}
          <div className="space-y-4">
            <QuickSignupWithPlan>
              <Button 
                size="lg" 
                className="bg-white text-harmony-700 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:animate-swirl-grow"
              >
                Start Your Wellness Journey
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </QuickSignupWithPlan>
            
            <p className="text-white/80 text-sm">
              Free forever plan available • Upgrade anytime • Cancel anytime
            </p>
          </div>
        </div>

        {/* Social proof cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">25K+</div>
              <div className="text-white/80 text-sm">Users helped</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">4.9★</div>
              <div className="text-white/80 text-sm">Average rating</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">98%</div>
              <div className="text-white/80 text-sm">Would recommend</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
