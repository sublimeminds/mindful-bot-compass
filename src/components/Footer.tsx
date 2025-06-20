
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gradient-to-br from-therapy-700 via-harmony-700 to-balance-700 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">TherapySync</h3>
            <p className="text-white/80 text-sm">
              AI-powered mental health platform designed to support your wellness journey.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold">Product</h4>
            <div className="space-y-2">
              <Button 
                variant="link" 
                className="p-0 h-auto text-white/70 hover:text-white justify-start"
                onClick={() => {
                  navigate('/');
                  setTimeout(() => {
                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
              >
                Features
              </Button>
              <Button 
                variant="link" 
                className="p-0 h-auto text-white/70 hover:text-white justify-start"
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
          
          <div className="space-y-4">
            <h4 className="font-semibold">Support</h4>
            <div className="space-y-2">
              <Button 
                variant="link" 
                className="p-0 h-auto text-white/70 hover:text-white justify-start"
                onClick={() => navigate('/help')}
              >
                Help Center
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold">Company</h4>
            <div className="space-y-2">
              <Button 
                variant="link" 
                className="p-0 h-auto text-white/70 hover:text-white justify-start"
              >
                Privacy Policy
              </Button>
              <Button 
                variant="link" 
                className="p-0 h-auto text-white/70 hover:text-white justify-start"
              >
                Terms of Service
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-white/60 text-sm">
            © 2024 TherapySync. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
