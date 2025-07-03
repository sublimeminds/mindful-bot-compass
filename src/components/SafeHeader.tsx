import React from 'react';
import { Link } from 'react-router-dom';
import SmartErrorBoundary from '@/components/SmartErrorBoundary';
import { Button } from '@/components/ui/button';
import GradientLogo from '@/components/ui/GradientLogo';

// Safe Header content with bulletproof auth integration
const SafeHeaderContent = () => {
  const [user, setUser] = React.useState(null);

  // Safe auth hook with fallback
  React.useEffect(() => {
    try {
      // Try to get bulletproof auth if available
      import('@/contexts/AuthContext').then(({ useAuth }) => {
        try {
          const { user: authUser } = useAuth();
          setUser(authUser);
        } catch (error) {
          console.warn('SafeHeader: Auth not available');
        }
      }).catch(() => {
        console.warn('SafeHeader: Auth context not available');
      });
    } catch (error) {
      console.warn('SafeHeader: Failed to load auth');
    }
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <SmartErrorBoundary componentName="Logo" fallback={<div className="w-8 h-8 bg-therapy-500 rounded-lg"></div>}>
              <GradientLogo size="sm" />
            </SmartErrorBoundary>
            <span className="text-xl font-bold therapy-text-gradient">TherapySync</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/features-showcase" 
              className="text-slate-600 hover:text-therapy-600 transition-colors"
            >
              Features
            </Link>
            <Link 
              to="/pricing" 
              className="text-slate-600 hover:text-therapy-600 transition-colors"
            >
              Pricing
            </Link>
            <Link 
              to="/help" 
              className="text-slate-600 hover:text-therapy-600 transition-colors"
            >
              Help
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link to="/dashboard">
                  <Button variant="ghost" className="text-therapy-600">
                    Dashboard
                  </Button>
                </Link>
                <div className="w-8 h-8 bg-therapy-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/auth">
                  <Button variant="ghost" className="text-therapy-600 hover:text-therapy-700">
                    Sign In
                  </Button>
                </Link>
                <Link to="/onboarding">
                  <Button className="bg-therapy-600 hover:bg-therapy-700 text-white">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// Safe Header with error boundary
const SafeHeader = () => {
  return (
    <SmartErrorBoundary 
      componentName="Header"
      fallback={
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-therapy-500 rounded-lg"></div>
                <span className="text-xl font-bold text-therapy-600">TherapySync</span>
              </Link>
              <div className="flex items-center space-x-3">
                <Link to="/auth">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/onboarding">
                  <Button>Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        </header>
      }
    >
      <SafeHeaderContent />
    </SmartErrorBoundary>
  );
};

export default SafeHeader;