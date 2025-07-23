
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
    <nav style={{ backgroundColor: '#ffffff', width: '100%', display: 'block' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer',
                transition: 'opacity 0.2s'
              }}
              onClick={() => navigate('/')}
            >
              <span style={{ 
                marginLeft: '8px', 
                fontSize: '20px', 
                fontWeight: 'bold',
                background: 'linear-gradient(to right, #2563eb, #7c3aed)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                TherapySync
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}  
          <div style={{ display: 'none' }} className="lg:flex lg:items-center lg:space-x-4">
            <Link to="/#features" style={{ color: '#6b7280', textDecoration: 'none', padding: '8px 12px', fontSize: '14px', fontWeight: '500' }}>
              Features
            </Link>
            <Link to="/#pricing" style={{ color: '#6b7280', textDecoration: 'none', padding: '8px 12px', fontSize: '14px', fontWeight: '500' }}>
              Pricing
            </Link>
            <Link to="/#how-it-works" style={{ color: '#6b7280', textDecoration: 'none', padding: '8px 12px', fontSize: '14px', fontWeight: '500' }}>
              How It Works
            </Link>
          </div>

          {/* User Menu / Auth Buttons */}
          <div style={{ display: 'none' }} className="md:block">
            <div style={{ marginLeft: '16px', display: 'flex', alignItems: 'center' }}>
              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '14px', color: '#374151' }}>Welcome back!</span>
                  <Button onClick={() => navigate('/dashboard')} variant="outline">
                    Dashboard
                  </Button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
          <div style={{ padding: '8px', paddingTop: '8px', paddingBottom: '12px', backgroundColor: '#ffffff', borderTop: '1px solid #e5e7eb' }}>
            <Link to="/#features" style={{ display: 'block', padding: '8px 12px', fontSize: '16px', fontWeight: '500', color: '#374151', textDecoration: 'none' }}>
              Features
            </Link>
            <Link to="/#pricing" style={{ display: 'block', padding: '8px 12px', fontSize: '16px', fontWeight: '500', color: '#374151', textDecoration: 'none' }}>
              Pricing
            </Link>
            <Link to="/#how-it-works" style={{ display: 'block', padding: '8px 12px', fontSize: '16px', fontWeight: '500', color: '#374151', textDecoration: 'none' }}>
              How It Works
            </Link>
            {!user && (
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '12px', marginTop: '12px' }}>
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
