
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, Users, TrendingUp } from 'lucide-react';
import { SafeComponentWrapper } from '@/components/bulletproof/SafeComponentWrapper';

const CTASection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/onboarding');
  };

  return (
    <SafeComponentWrapper name="CTASection">
      <section className="relative py-20 bg-gradient-to-br from-therapy-600 to-calm-600 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Users className="h-3 w-3 mr-1" />
              10,000+ Users
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <TrendingUp className="h-3 w-3 mr-1" />
              4.9★ Rating
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
          </div>

          {/* Main CTA Content */}
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to Transform Your
            <span className="block text-therapy-200">Mental Health Journey?</span>
          </h2>
          
          <p className="text-xl text-therapy-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands who have found peace, clarity, and growth with our AI-powered therapy platform. Your journey to better mental health starts here.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button 
              size="lg" 
              className="bg-white text-therapy-700 hover:bg-therapy-50 px-10 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 group"
              onClick={handleGetStarted}
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-therapy-700 px-10 py-6 text-lg rounded-full transition-all duration-300"
              onClick={() => navigate('/audio-library')}
            >
              Explore Audio Library
            </Button>
          </div>

          {/* Security Notice */}
          <p className="text-therapy-200 text-sm">
            🔒 HIPAA Compliant • 256-bit Encryption • Your privacy is our priority
          </p>
        </div>
      </div>
    </section>
    </SafeComponentWrapper>
  );
};

export default CTASection;
