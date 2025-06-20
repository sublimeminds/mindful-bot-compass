
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, ArrowRight, Sparkles, Shield, Heart } from 'lucide-react';
import AuthModal from '@/components/AuthModal';
import QuickSignupWithPlan from '@/components/subscription/QuickSignupWithPlan';

const HeroSection = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showQuickSignup, setShowQuickSignup] = useState(false);

  const handleGetStarted = () => {
    setShowAuthModal(true);
  };

  const handleStartTrial = () => {
    setShowQuickSignup(true);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-therapy-50 via-calm-50 to-therapy-100 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23E0F2FE\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"4\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Trust Badge */}
          <Badge variant="secondary" className="mb-6 bg-white/80 backdrop-blur-sm">
            <Shield className="h-3 w-3 mr-1" />
            HIPAA Compliant & Secure
          </Badge>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Your Personal
            <span className="text-therapy-600 relative">
              <span className="relative z-10"> AI Therapist</span>
              <svg className="absolute -bottom-2 left-0 w-full h-3 z-0" viewBox="0 0 200 12" fill="none">
                <path d="M0 8C40 4, 80 4, 120 8C160 12, 200 8, 200 6" stroke="#7C3AED" strokeWidth="3" fill="none"/>
              </svg>
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-therapy-600 to-calm-600">
              Available 24/7
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Get professional therapy support whenever you need it. Our AI-powered platform provides personalized mental health care that adapts to your unique needs.
          </p>

          {/* Key Benefits */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <Badge variant="outline" className="bg-white/60 backdrop-blur-sm text-gray-700 border-gray-200">
              <Heart className="h-3 w-3 mr-1 text-therapy-500" />
              Personalized Care
            </Badge>
            <Badge variant="outline" className="bg-white/60 backdrop-blur-sm text-gray-700 border-gray-200">
              <Sparkles className="h-3 w-3 mr-1 text-calm-500" />
              AI-Powered Insights
            </Badge>
            <Badge variant="outline" className="bg-white/60 backdrop-blur-sm text-gray-700 border-gray-200">
              <Shield className="h-3 w-3 mr-1 text-green-500" />
              100% Private
            </Badge>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="bg-therapy-600 hover:bg-therapy-700 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
              onClick={handleGetStarted}
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-therapy-600 text-therapy-600 hover:bg-therapy-600 hover:text-white px-8 py-6 text-lg rounded-full transition-all duration-300 group"
              onClick={() => scrollToSection('demo')}
            >
              <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Watch Demo
            </Button>
          </div>

          {/* Quick Trial CTA */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">Ready to get started? Try our premium features free for 7 days.</p>
            <Button 
              variant="ghost" 
              className="text-therapy-600 hover:text-therapy-700 hover:bg-therapy-50 underline underline-offset-4"
              onClick={handleStartTrial}
            >
              Start Free Trial
            </Button>
          </div>

          {/* Social Proof */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <p className="text-gray-500 text-sm mb-4">Trusted by thousands of users worldwide</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="text-2xl font-bold text-gray-400">10K+</div>
              <div className="text-gray-300">•</div>
              <div className="text-2xl font-bold text-gray-400">4.9★</div>
              <div className="text-gray-300">•</div>
              <div className="text-2xl font-bold text-gray-400">24/7</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Signup Modal */}
      {showQuickSignup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Start Your Free Trial</h3>
            <p className="text-gray-600 mb-4">Get access to all premium features for 7 days, absolutely free.</p>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setShowQuickSignup(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  setShowQuickSignup(false);
                  setShowAuthModal(true);
                }}
                className="flex-1 bg-therapy-600 hover:bg-therapy-700"
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </section>
  );
};

export default HeroSection;
