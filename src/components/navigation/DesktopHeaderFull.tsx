
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import DatabaseHeaderDropdowns from './DatabaseHeaderDropdowns';
import { Bell, User, Search } from 'lucide-react';

const DesktopHeaderFull = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="hidden lg:block bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-therapy-600 to-therapy-800 bg-clip-text text-transparent">
                TherapySync
              </span>
            </Link>

            {/* Database-driven Navigation */}
            <DatabaseHeaderDropdowns />
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Static Navigation Links */}
            <nav className="flex items-center space-x-6">
              <Link 
                to="/#features" 
                className="text-gray-600 hover:text-therapy-700 px-3 py-2 text-sm font-medium transition-colors"
              >
                Features
              </Link>
              <Link 
                to="/#pricing" 
                className="text-gray-600 hover:text-therapy-700 px-3 py-2 text-sm font-medium transition-colors"
              >
                Pricing
              </Link>
              <Link 
                to="/#how-it-works" 
                className="text-gray-600 hover:text-therapy-700 px-3 py-2 text-sm font-medium transition-colors"
              >
                How It Works
              </Link>
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-2">
              {user ? (
                <>
                  <Button variant="ghost" size="sm">
                    <Search className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Bell className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => navigate('/dashboard')} variant="outline" size="sm">
                    Dashboard
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => navigate('/login')} size="sm">
                    Sign In
                  </Button>
                  <Button onClick={() => navigate('/register')} className="bg-therapy-600 hover:bg-therapy-700 text-white" size="sm">
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DesktopHeaderFull;
