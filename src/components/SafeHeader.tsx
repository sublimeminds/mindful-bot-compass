import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SmartErrorBoundary from '@/components/SmartErrorBoundary';
import { Button } from '@/components/ui/button';
import GradientLogo from '@/components/ui/GradientLogo';
import { 
  ChevronDown, 
  Brain, 
  Heart, 
  Shield, 
  Users, 
  Headphones, 
  Globe,
  Star,
  Zap,
  Award,
  BookOpen,
  MessageSquare,
  Settings,
  User,
  LogOut,
  HelpCircle,
  CreditCard,
  Activity
} from 'lucide-react';

const SafeHeaderContent = () => {
  const [user, setUser] = React.useState(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Safe auth hook with fallback
  React.useEffect(() => {
    try {
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (dropdownName: string) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const featuresDropdownItems = [
    {
      category: "AI Therapy",
      items: [
        { name: "Voice Technology", description: "Natural voice conversations", icon: Headphones, href: "/voice-technology" },
        { name: "AI Analytics", description: "Advanced mood tracking", icon: Brain, href: "/ai-analytics" },
        { name: "Crisis Support", description: "24/7 emergency assistance", icon: Shield, href: "/crisis-resources" }
      ]
    },
    {
      category: "Therapy Types",
      items: [
        { name: "LGBTQ+ Therapy", description: "Specialized support", icon: Heart, href: "/lgbtq-therapy" },
        { name: "Couples Therapy", description: "Relationship counseling", icon: Users, href: "/couples-therapy" },
        { name: "Family Plans", description: "Support for families", icon: Globe, href: "/family-dashboard" }
      ]
    },
    {
      category: "Advanced Features",
      items: [
        { name: "Neural Interface", description: "Future technology", icon: Zap, href: "/neural-interface" },
        { name: "Quantum Therapy", description: "Next-gen healing", icon: Star, href: "/quantum-therapy" },
        { name: "Blockchain Health", description: "Secure health records", icon: Award, href: "/blockchain-health" }
      ]
    }
  ];

  const resourcesDropdownItems = [
    {
      category: "Learning",
      items: [
        { name: "Help Center", description: "Get support and answers", icon: HelpCircle, href: "/help" },
        { name: "Audio Library", description: "Guided sessions", icon: BookOpen, href: "/audio-library" },
        { name: "How It Works", description: "Learn about our process", icon: Activity, href: "/how-it-works" }
      ]
    },
    {
      category: "Community",
      items: [
        { name: "Community Hub", description: "Connect with others", icon: MessageSquare, href: "/community" },
        { name: "Support Groups", description: "Join support networks", icon: Users, href: "/community-features" },
        { name: "Success Stories", description: "Read testimonials", icon: Star, href: "/" }
      ]
    }
  ];

  const userDropdownItems = user ? [
    { name: "Dashboard", icon: Activity, href: "/dashboard" },
    { name: "Profile", icon: User, href: "/profile" },
    { name: "Settings", icon: Settings, href: "/settings" },
    { name: "Billing", icon: CreditCard, href: "/subscription" },
    { name: "Sign Out", icon: LogOut, href: "/auth", action: "logout" }
  ] : [];

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

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1" ref={dropdownRef}>
            {/* Features Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('features')}
                className="flex items-center space-x-1 px-4 py-2 text-slate-600 hover:text-therapy-600 transition-colors rounded-lg hover:bg-therapy-50"
              >
                <span>Features</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === 'features' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeDropdown === 'features' && (
                <div className="absolute top-full left-0 mt-2 w-[720px] bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                  <div className="p-6">
                    <div className="grid grid-cols-3 gap-6">
                      {featuresDropdownItems.map((category, categoryIndex) => (
                        <div key={categoryIndex}>
                          <h3 className="font-semibold text-therapy-700 mb-3 text-sm uppercase tracking-wide">
                            {category.category}
                          </h3>
                          <div className="space-y-2">
                            {category.items.map((item, itemIndex) => (
                              <Link
                                key={itemIndex}
                                to={item.href}
                                onClick={() => setActiveDropdown(null)}
                                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-therapy-50 transition-colors group"
                              >
                                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                                  <item.icon className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                  <div className="font-medium text-slate-900 group-hover:text-therapy-600 transition-colors">
                                    {item.name}
                                  </div>
                                  <div className="text-sm text-slate-500">
                                    {item.description}
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 mt-6 pt-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-600">
                          Explore all our innovative therapy features
                        </div>
                        <Link
                          to="/features-showcase"
                          onClick={() => setActiveDropdown(null)}
                          className="text-therapy-600 hover:text-therapy-700 font-medium text-sm flex items-center space-x-1"
                        >
                          <span>View all features</span>
                          <ChevronDown className="h-4 w-4 -rotate-90" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('resources')}
                className="flex items-center space-x-1 px-4 py-2 text-slate-600 hover:text-therapy-600 transition-colors rounded-lg hover:bg-therapy-50"
              >
                <span>Resources</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === 'resources' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeDropdown === 'resources' && (
                <div className="absolute top-full left-0 mt-2 w-[480px] bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-6">
                      {resourcesDropdownItems.map((category, categoryIndex) => (
                        <div key={categoryIndex}>
                          <h3 className="font-semibold text-therapy-700 mb-3 text-sm uppercase tracking-wide">
                            {category.category}
                          </h3>
                          <div className="space-y-2">
                            {category.items.map((item, itemIndex) => (
                              <Link
                                key={itemIndex}
                                to={item.href}
                                onClick={() => setActiveDropdown(null)}
                                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-therapy-50 transition-colors group"
                              >
                                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                                  <item.icon className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                  <div className="font-medium text-slate-900 group-hover:text-therapy-600 transition-colors">
                                    {item.name}
                                  </div>
                                  <div className="text-sm text-slate-500">
                                    {item.description}
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Pricing Link */}
            <Link 
              to="/pricing" 
              className="px-4 py-2 text-slate-600 hover:text-therapy-600 transition-colors rounded-lg hover:bg-therapy-50"
            >
              Pricing
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => toggleDropdown('mobile')}
            className="lg:hidden p-2 text-slate-600 hover:text-therapy-600"
          >
            <ChevronDown className="h-5 w-5" />
          </button>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => toggleDropdown('user')}
                  className="flex items-center space-x-3 hover:bg-therapy-50 rounded-lg p-2 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === 'user' ? 'rotate-180' : ''}`} />
                </button>

                {activeDropdown === 'user' && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">
                            {user.email?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{user.email}</div>
                          <div className="text-sm text-slate-500">Premium User</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      {userDropdownItems.map((item, index) => (
                        <Link
                          key={index}
                          to={item.href}
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-therapy-50 transition-colors text-slate-700 hover:text-therapy-600"
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/auth">
                  <Button variant="ghost" className="text-therapy-600 hover:text-therapy-700 hidden sm:inline-flex">
                    Sign In
                  </Button>
                </Link>
                <Link to="/onboarding">
                  <Button className="bg-gradient-to-r from-therapy-600 to-calm-600 hover:from-therapy-700 hover:to-calm-700 text-white shadow-lg">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Dropdown */}
          {activeDropdown === 'mobile' && (
            <div className="absolute top-full left-0 right-0 mt-0 bg-white border-t border-gray-200 shadow-lg z-50 lg:hidden">
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <Link to="/features-showcase" className="block py-2 text-slate-600 hover:text-therapy-600" onClick={() => setActiveDropdown(null)}>
                    Features
                  </Link>
                  <Link to="/pricing" className="block py-2 text-slate-600 hover:text-therapy-600" onClick={() => setActiveDropdown(null)}>
                    Pricing
                  </Link>
                  <Link to="/help" className="block py-2 text-slate-600 hover:text-therapy-600" onClick={() => setActiveDropdown(null)}>
                    Help
                  </Link>
                  <Link to="/community" className="block py-2 text-slate-600 hover:text-therapy-600" onClick={() => setActiveDropdown(null)}>
                    Community
                  </Link>
                </div>
                {!user && (
                  <div className="pt-4 border-t border-gray-200">
                    <Link to="/auth" className="block w-full text-center py-2 text-therapy-600 hover:text-therapy-700" onClick={() => setActiveDropdown(null)}>
                      Sign In
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
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