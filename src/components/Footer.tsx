
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Heart, Shield, Globe, Users, Brain, Sparkles } from 'lucide-react';
import GradientLogo from '@/components/ui/GradientLogo';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-therapy-900 to-harmony-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <GradientLogo size="sm" />
              <h3 className="text-xl font-bold">TherapySync</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed max-w-md">
              Advanced AI-powered mental health platform designed to support your wellness journey 
              with enterprise-grade security and personalized therapeutic interventions.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-therapy-400" />
                <span className="text-xs text-slate-400">HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-harmony-400" />
                <span className="text-xs text-slate-400">Available Worldwide</span>
              </div>
            </div>
          </div>
          
          {/* Product Section */}
          <div className="space-y-4">
            <h4 className="font-semibold text-therapy-200">Product</h4>
            <div className="space-y-3">
              <Button 
                variant="link" 
                className="p-0 h-auto text-slate-300 hover:text-therapy-200 justify-start text-sm"
                onClick={() => navigate('/therapysync-ai')}
              >
                <Brain className="h-3 w-3 mr-2" />
                TherapySync AI
              </Button>
              <Button 
                variant="link" 
                className="p-0 h-auto text-slate-300 hover:text-therapy-200 justify-start text-sm"
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
                className="p-0 h-auto text-slate-300 hover:text-therapy-200 justify-start text-sm"
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
            <h4 className="font-semibold text-harmony-200">Support</h4>
            <div className="space-y-3">
              <Button 
                variant="link" 
                className="p-0 h-auto text-slate-300 hover:text-harmony-200 justify-start text-sm"
                onClick={() => navigate('/help')}
              >
                Help Center
              </Button>
              <Button 
                variant="link" 
                className="p-0 h-auto text-slate-300 hover:text-harmony-200 justify-start text-sm"
                onClick={() => navigate('/community')}
              >
                <Users className="h-3 w-3 mr-2" />
                Community
              </Button>
              <Button 
                variant="link" 
                className="p-0 h-auto text-slate-300 hover:text-harmony-200 justify-start text-sm"
              >
                Contact Us
              </Button>
            </div>
          </div>
          
          {/* Company Section */}
          <div className="space-y-4">
            <h4 className="font-semibold text-balance-200">Company</h4>
            <div className="space-y-3">
              <Button 
                variant="link" 
                className="p-0 h-auto text-slate-300 hover:text-balance-200 justify-start text-sm"
              >
                About Us
              </Button>
              <Button 
                variant="link" 
                className="p-0 h-auto text-slate-300 hover:text-balance-200 justify-start text-sm"
              >
                Privacy Policy
              </Button>
              <Button 
                variant="link" 
                className="p-0 h-auto text-slate-300 hover:text-balance-200 justify-start text-sm"
              >
                Terms of Service
              </Button>
            </div>
          </div>
        </div>
        
        {/* Trust Indicators */}
        <div className="mt-12 pt-8 border-t border-slate-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center mb-8">
            <div className="flex flex-col items-center space-y-2">
              <div className="text-therapy-300 text-lg font-semibold">25K+</div>
              <div className="text-slate-400 text-xs">Users Helped</div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="text-harmony-300 text-lg font-semibold">150K+</div>
              <div className="text-slate-400 text-xs">Sessions Completed</div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="text-balance-300 text-lg font-semibold">98%</div>
              <div className="text-slate-400 text-xs">Satisfaction Rate</div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="text-flow-300 text-lg font-semibold">24/7</div>
              <div className="text-slate-400 text-xs">AI Support</div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-slate-400 text-sm">
            © 2024 TherapySync. All rights reserved.
          </p>
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 text-sm">Made with</span>
            <Heart className="h-4 w-4 text-therapy-400" />
            <span className="text-slate-400 text-sm">for mental wellness</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
