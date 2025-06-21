
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import GradientLogo from '@/components/ui/GradientLogo';
import { ArrowRight, Sparkles } from 'lucide-react';

interface AnimatedOnboardingIntroProps {
  onGetStarted: () => void;
}

const AnimatedOnboardingIntro = ({ onGetStarted }: AnimatedOnboardingIntroProps) => {
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setAnimationPhase(1), 500),
      setTimeout(() => setAnimationPhase(2), 1200),
      setTimeout(() => setAnimationPhase(3), 2000),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-harmony-50 via-flow-50 to-balance-50 dark:from-harmony-950 dark:via-flow-950 dark:to-balance-950">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-harmony-300 dark:bg-harmony-600 rounded-full opacity-20 animate-pulse transition-all duration-1000 ${
              animationPhase >= 1 ? 'scale-100' : 'scale-0'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="text-center z-10 px-8 max-w-4xl mx-auto">
        {/* Logo Animation */}
        <div
          className={`transition-all duration-1000 ease-out ${
            animationPhase >= 0 ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-8'
          }`}
        >
          <div className="flex items-center justify-center mb-8">
            <GradientLogo size="hero" className="drop-shadow-2xl" />
          </div>
        </div>

        {/* Brand Name Animation */}
        <div
          className={`transition-all duration-1000 delay-500 ease-out ${
            animationPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-harmony-600 via-flow-600 to-balance-600 dark:from-harmony-400 dark:via-flow-400 dark:to-balance-400 bg-clip-text text-transparent mb-6 tracking-tight">
            TherapySync
          </h1>
        </div>

        {/* Tagline Animation */}
        <div
          className={`transition-all duration-1000 delay-1000 ease-out ${
            animationPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-xl md:text-2xl text-harmony-700 dark:text-harmony-300 mb-4 font-medium">
            Your AI-Powered Wellness Companion
          </p>
          <p className="text-lg text-harmony-600 dark:text-harmony-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Personalized therapy sessions, intelligent insights, and compassionate care - 
            all synchronized to help you achieve mental wellness harmony.
          </p>
        </div>

        {/* Call to Action Animation */}
        <div
          className={`transition-all duration-1000 delay-1500 ease-out ${
            animationPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Button
            onClick={onGetStarted}
            size="lg"
            className="bg-gradient-to-r from-harmony-600 to-flow-600 hover:from-harmony-700 hover:to-flow-700 dark:from-harmony-500 dark:to-flow-500 dark:hover:from-harmony-600 dark:hover:to-flow-600 text-white px-12 py-4 text-lg font-semibold rounded-2xl shadow-2xl hover:shadow-harmony-500/25 transform hover:scale-105 transition-all duration-300 group"
          >
            <Sparkles className="mr-3 h-5 w-5 group-hover:animate-pulse" />
            Begin Your Journey
            <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Feature Pills */}
        <div
          className={`mt-16 flex flex-wrap justify-center gap-4 transition-all duration-1000 delay-2000 ease-out ${
            animationPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {['AI Therapy', 'Mood Tracking', 'Crisis Support', 'Cultural Adaptation'].map((feature, index) => (
            <div
              key={feature}
              className="px-4 py-2 bg-white/20 dark:bg-gray-900/20 backdrop-blur-sm rounded-full border border-harmony-200 dark:border-harmony-700 text-harmony-700 dark:text-harmony-300 text-sm font-medium shadow-lg"
              style={{ animationDelay: `${2000 + index * 200}ms` }}
            >
              {feature}
            </div>
          ))}
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-harmony-200 dark:bg-harmony-800 rounded-full opacity-10 animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-flow-200 dark:bg-flow-800 rounded-full opacity-10 animate-pulse" style={{ animationDelay: '1s' }} />
    </div>
  );
};

export default AnimatedOnboardingIntro;
