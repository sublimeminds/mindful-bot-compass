
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Menu, X } from 'lucide-react';

const UnifiedNavigation = () => {
  console.log('🔍 UnifiedNavigation: Component rendering - NAVIGATION CONTENT');
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white w-full" style={{ display: 'block' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div 
              className="flex items-center cursor-pointer hover:opacity-80 transition-opacity" 
              onClick={() => navigate('/')}
            >
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TherapySync
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}  
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            <Link to="/#features" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
              Features
            </Link>
            <Link to="/#pricing" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
              Pricing
            </Link>
            <Link to="/#how-it-works" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
              How It Works
            </Link>
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">Welcome back!</span>
                  <Button onClick={() => navigate('/dashboard')} variant="outline">
                    Dashboard
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" onClick={() => navigate('/login')}>Sign In</Button>
                  <Button onClick={() => navigate('/register')} className="bg-blue-600 hover:bg-blue-700 text-white">Get Started</Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <Button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              variant="ghost"
              size="sm"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <Link to="/#features" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900">
              Features
            </Link>
            <Link to="/#pricing" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900">
              Pricing
            </Link>
            <Link to="/#how-it-works" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900">
              How It Works
            </Link>
            {!user && (
              <div className="border-t pt-3 mt-3">
                <Button onClick={() => navigate('/login')} variant="ghost" className="w-full mb-2">
                  Sign In
                </Button>
                <Button onClick={() => navigate('/register')} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default UnifiedNavigation;
