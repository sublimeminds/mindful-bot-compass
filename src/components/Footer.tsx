
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Heart, Shield, Globe, Users, Brain, Sparkles, Mail, Phone, MapPin, FileText, HelpCircle, Settings, Calendar, BookOpen, Zap, MessageCircle, Star, HeartHandshake } from 'lucide-react';
import GradientLogo from '@/components/ui/GradientLogo';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gradient-to-br from-therapy-700 to-harmony-700 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <GradientLogo size="sm" />
              <h3 className="text-xl font-bold">TherapySync</h3>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              Advanced AI-powered mental health platform designed to support your wellness journey 
              with enterprise-grade security and personalized therapeutic interventions.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Shield className="h-4 w-4 text-white/70 flex-shrink-0" />
                <span className="text-xs text-white/70">HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-3">
                <Globe className="h-4 w-4 text-white/70 flex-shrink-0" />
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
                className="p-0 h-auto text-white/80 hover:text-white justify-start text-sm flex items-center"
                onClick={() => navigate('/therapysync-ai')}
              >
                <Brain className="h-4 w-4 mr-3 flex-shrink-0" />
                TherapySync AI
              </Button>
              <Button 
                variant="link" 
                className="p-0 h-auto text-white/80 hover:text-white justify-start text-sm flex items-center"
                onClick={() => {
                  navigate('/');
                  setTimeout(() => {
                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
              >
                <Sparkles className="h-4 w-4 mr-3 flex-shrink-0" />
                Features
              </Button>
              <Button 
                variant="link" 
                className="p-0 h-auto text-white/80 hover:text-white justify-start text-sm flex items-center"
                onClick={() => navigate('/dashboard')}
              >
                <Zap className="h-4 w-4 mr-3 flex-shrink-0" />
                Dashboard
              </Button>
              <Button 
                variant="link" 
                className="p-0 h-auto text-white/80 hover:text-white justify-start text-sm flex items-center"
                onClick={() => navigate('/smart-scheduling')}
              >
                <Calendar className="h-4 w-4 mr-3 flex-shrink-0" />
                Smart Scheduling
              </Button>
              <Button 
                variant="link" 
                className="p-0 h-auto text-white/80 hover:text-white justify-start text-sm flex items-center"
                onClick={() => navigate('/techniques')}
              >
                <BookOpen className="h-4 w-4 mr-3 flex-shrink-0" />
                Techniques
              </Button>
              <Button 
                variant="link" 
                className="p-0 h-auto text-white/80 hover:text-white justify-start text-sm flex items-center"
                onClick={() => {
                  navigate('/');
                  setTimeout(() => {
                    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
              >
                <Settings className="h-4 w-4 mr-3 flex-shrink-0" />
                Pricing
              </Button>
            </div>
          </div>
          
          {/* Support Section */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Support & Resources</h4>
            <div className="space-y-3">
              <Button 
                variant="link" 
                className="p-0 h-auto text-white/80 hover:text-white justify-start text-sm flex items-center"
                onClick={() => navigate('/help')}
              >
                <HelpCircle className="h-4 w-4 mr-3 flex-shrink-0" />
                Help Center
              </Button>
              <Button 
                variant="link" 
                className="p-0 h-auto text-white/80 hover:text-white justify-start text-sm flex items-center"
                onClick={() => navigate('/community')}
              >
                <Users className="h-4 w-4 mr-3 flex-shrink-0" />
                Community
              </Button>
              <Button 
                variant="link" 
                className="p-0 h-auto text-white/80 hover:text-white justify-start text-sm flex items-center"
                onClick={() => navigate('/crisis-management')}
              >
                <Shield className="h-4 w-4 mr-3 flex-shrink-0" />
                Crisis Support
              </Button>
              <Button 
                variant="link" 
                className="p-0 h-auto text-white/80 hover:text-white justify-start text-sm flex items-center"
              >
                <Mail className="h-4 w-4 mr-3 flex-shrink-0" />
                Contact Us
              </Button>
              <Button 
                variant="link" 
                className="p-0 h-auto text-white/80 hover:text-white justify-start text-sm flex items-center"
              >
                <Phone className="h-4 w-4 mr-3 flex-shrink-0" />
                24/7 Support
              </Button>
              <Button 
                variant="link" 
                className="p-0 h-auto text-white/80 hover:text-white justify-start text-sm flex items-center"
                onClick={() => navigate('/help/articles')}
              >
                <BookOpen className="h-4 w-4 mr-3 flex-shrink-0" />
                Articles
              </Button>
            </div>
          </div>
          
          {/* Company Section */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Company</h4>
            <div className="space-y-3">
              <Button 
                variant="link" 
                className="p-0 h-auto text-white/80 hover:text-white justify-start text-sm flex items-center"
              >
                <Users className="h-4 w-4 mr-3 flex-shrink-0" />
                About Us
              </Button>
              <Button 
                variant="link" 
                className="p-0 h-auto text-white/80 hover:text-white justify-start text-sm flex items-center"
              >
                <Star className="h-4 w-4 mr-3 flex-shrink-0" />
                Careers
              </Button>
              <Button 
                variant="link" 
                className="p-0 h-auto text-white/80 hover:text-white justify-start text-sm flex items-center"
              >
                <FileText className="h-4 w-4 mr-3 flex-shrink-0" />
                Privacy Policy
              </Button>
              <Button 
                variant="link" 
                className="p-0 h-auto text-white/80 hover:text-white justify-start text-sm flex items-center"
              >
                <FileText className="h-4 w-4 mr-3 flex-shrink-0" />
                Terms of Service
              </Button>
              <Button 
                variant="link" 
                className="p-0 h-auto text-white/80 hover:text-white justify-start text-sm flex items-center"
              >
                <Shield className="h-4 w-4 mr-3 flex-shrink-0" />
                Security
              </Button>
              <Button 
                variant="link" 
                className="p-0 h-auto text-white/80 hover:text-white justify-start text-sm flex items-center"
              >
                <HeartHandshake className="h-4 w-4 mr-3 flex-shrink-0" />
                Partners
              </Button>
              <div className="pt-2">
                <div className="flex items-center space-x-2 text-xs text-white/70">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span>San Francisco, CA</span>
                </div>
              </div>
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
