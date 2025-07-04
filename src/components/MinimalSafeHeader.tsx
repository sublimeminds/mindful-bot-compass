import React from 'react';
import { Button } from '@/components/ui/button';
import { safeNavigate } from '@/components/SafeNavigation';
import GradientLogo from '@/components/ui/GradientLogo';

// Ultra-minimal header that works without any React context
const MinimalSafeHeader = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <button 
            onClick={() => safeNavigate('/')}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <GradientLogo size="sm" />
            <span className="text-xl font-bold therapy-text-gradient">TherapySync</span>
          </button>

          {/* Simple navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Button 
              variant="ghost" 
              onClick={() => safeNavigate('/features')}
              className="text-therapy-600 hover:text-therapy-700 hover:bg-therapy-50"
            >
              Features
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => safeNavigate('/pricing')}
              className="text-therapy-600 hover:text-therapy-700 hover:bg-therapy-50"
            >
              Pricing
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => safeNavigate('/help')}
              className="text-therapy-600 hover:text-therapy-700 hover:bg-therapy-50"
            >
              Help
            </Button>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              onClick={() => safeNavigate('/auth')}
              className="text-therapy-600 hover:text-therapy-700 hover:bg-therapy-50"
            >
              Sign In
            </Button>
            <Button 
              onClick={() => safeNavigate('/get-started')}
              className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600 text-white px-6 py-2"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MinimalSafeHeader;