
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, Brain, Heart } from 'lucide-react';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import GradientLogo from '@/components/ui/GradientLogo';

const SimpleHeader = () => {
  const { user, logout } = useSimpleApp();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-harmony-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <GradientLogo size="sm" />
            <span className="text-xl font-bold bg-gradient-to-r from-harmony-600 to-flow-600 bg-clip-text text-transparent">
              TherapySync
            </span>
          </Link>

          {/* Simple Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/therapysync-ai')}>
              <Brain className="h-4 w-4 mr-2" />
              TherapySync AI
            </Button>
            {user && (
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
            )}
            <Button variant="ghost" onClick={() => navigate('/plans')}>
              Pricing
            </Button>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => navigate('/therapysync-ai')}
                  className="bg-gradient-to-r from-harmony-500 to-flow-500 hover:from-harmony-600 hover:to-flow-600 text-white font-medium hidden sm:flex"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  TherapySync AI
                </Button>
                
                <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
                  <div className="w-8 h-8 bg-gradient-to-br from-harmony-500 to-flow-500 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                </Button>
                
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => navigate('/therapysync-ai')}
                  variant="outline"
                  size="sm"
                  className="border-harmony-300 text-harmony-700 hover:bg-harmony-50 hidden sm:flex"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Try AI
                </Button>
                <Button
                  onClick={() => navigate('/auth')}
                  variant="ghost"
                  size="sm"
                  className="hidden sm:inline-flex"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => navigate('/register')}
                  size="sm"
                  className="bg-gradient-to-r from-harmony-500 to-flow-500 hover:from-harmony-600 hover:to-flow-600"
                >
                  <Heart className="h-4 w-4 mr-2" />
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

export default SimpleHeader;
