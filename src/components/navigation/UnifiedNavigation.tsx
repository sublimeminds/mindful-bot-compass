import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Menu, X } from 'lucide-react';
import MobileMenu from './MobileMenu';
import UserMenu from './UserMenu';

const UnifiedNavigation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/dashboard" className="text-gray-500 hover:bg-gray-100 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
                <Link to="/crisis-management" className="text-gray-500 hover:bg-gray-100 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">Crisis</Link>
                <Link to="/community" className="text-gray-500 hover:bg-gray-100 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">Community</Link>
                <Link to="/notebook" className="text-gray-500 hover:bg-gray-100 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">Journal</Link>
                <Link to="/dashboard/audio-library" className="text-gray-500 hover:bg-gray-100 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">Audio</Link>
                <Link to="/smart-scheduling" className="text-gray-500 hover:bg-gray-100 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">Schedule</Link>
                <Link to="/help" className="text-gray-500 hover:bg-gray-100 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">Help</Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {user ? (
                <UserMenu />
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" onClick={() => navigate('/login')}>Sign In</Button>
                  <Button onClick={() => navigate('/register')} className="bg-gradient-to-r from-harmony-500 to-flow-500 hover:from-harmony-600 hover:to-flow-600">Get Started</Button>
                </div>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <Button
              onClick={() => setIsMobileMenuOpen(true)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="block h-6 w-6" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </nav>
  );
};

export default UnifiedNavigation;
