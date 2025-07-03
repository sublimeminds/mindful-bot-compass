import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Settings, 
  HelpCircle,
  User,
  Bell
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import GradientLogo from '@/components/ui/GradientLogo';
import LanguageSelector from '@/components/ui/LanguageSelector';

const StableHeader = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <GradientLogo size="sm" />
            <span className="text-xl font-bold therapy-text-gradient">TherapySync</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/features-overview')}
              className="flex items-center space-x-1 hover:bg-therapy-50"
            >
              <Brain className="h-4 w-4 text-therapy-500" />
              <span>AI Features</span>
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => navigate('/pricing')}
              className="flex items-center space-x-1 hover:bg-therapy-50"
            >
              <Settings className="h-4 w-4 text-therapy-500" />
              <span>Platform</span>
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => navigate('/help')}
              className="flex items-center space-x-1 hover:bg-therapy-50"
            >
              <HelpCircle className="h-4 w-4 text-therapy-500" />
              <span>Help</span>
            </Button>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-therapy-100 animate-pulse" />
            ) : user ? (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm">
                  <Bell className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm">
                  <User className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/auth')}
                  className="text-therapy-600 hover:text-therapy-700 hover:bg-therapy-50"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => navigate('/onboarding')}
                  className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 text-white px-6 py-2"
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default StableHeader;