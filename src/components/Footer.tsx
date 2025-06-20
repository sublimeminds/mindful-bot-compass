
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Heart, Shield, Globe, Users, Brain, Sparkles } from 'lucide-react';
import GradientLogo from '@/components/ui/GradientLogo';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gradient-to-br from-therapy-600 via-harmony-600 to-balance-600 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <GradientLogo size="sm" />
              <h3 className="text-xl font-bold">TherapySync</h3>
            </div>
            <p className="text-white/80 text-sm leading-relaxed max-w-md">
              Advanced AI-powered mental health platform designed to support your wellness journey 
              with enterprise-grade security and personalized therapeutic interventions.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-white/70" />
                <span className="text-xs text-white/70">HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-white/70" />
                <span className="text-xs text-white/70">Available Worldwide</span>
              </div>
            </div>
          </div>
          
          {/* Product Section */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Product</h4>
            <div className="space-y-3">
              <Button 
                variant="link" 
                className="p-0 h-auto text-white/80 hover:text-white justify-start text-sm"
                onClick={() => navigate('/therapysync-ai')}
              >
                <Brain className="h-3 w-3 mr-2" />
                TherapySync AI
              </Button>
              <Button 
                variant="link" 
                className="p-0 h-auto text-white/80 hover:text-white justify-start text-sm"
                onClick={() => {
                  navigate('/');
                  setTimeout(() => {
                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
              >
                <Sparkles className="h-3 w-3 mr-2" />
                Features
              </Button>
              <Button 
                variant="link" 
                className="p-0 h-auto text-white/80 hover:text-white justify-start text-sm"
                onClick={() => {
                  navigate('/');
                  setTimeout(() => {
                    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
              >
                Pricing
              </Button>
            </div>
          </div>
          
          {/* Support Section */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Support</h4>
            <div className="space-y-3">
              <Button 
                variant="link" 
                className="p-0 h-auto text-white/80 hover:text-white justify-start text-sm"
                onClick={() => navigate('/help')}
              >
                Help Center
              </Button>
              <Button 
                variant="link" 
                className="p-0 h-auto text-white/80 hover:text-white justify-start text-sm"
                onClick={() => navigate('/community')}
              >
                <Users className="h-3 w-3 mr-2" />
                Community
              </Button>
              <Button 
                variant="link" 
                className="p-0 h-auto text-white/80 hover:text-white justify-start text-sm"
              >
                Contact Us
              </Button>
            </div>
          </div>
          
          {/* Company Section */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Company</h4>
            <div className="space-y-3">
              <Button 
                variant="link" 
                className="p-0 h-auto text-white/80 hover:text-white justify-start text-sm"
              >
                About Us
              </Button>
              <Button 
                variant="link" 
                className="p-0 h-auto text-white/80 hover:text-white justify-start text-sm"
              >
                Privacy Policy
              </Button>
              <Button 
                variant="link" 
                className="p-0 h-auto text-white/80 hover:text-white justify-start text-sm"
              >
                Terms of Service
              </Button>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-white/20 pt-8 mt-12 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-white/70 text-sm">
            © 2024 TherapySync. All rights reserved.
          </p>
          <div className="flex items-center space-x-2">
            <span className="text-white/70 text-sm">Made with</span>
            <Heart className="h-4 w-4 text-white/80" />
            <span className="text-white/70 text-sm">for mental wellness</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
