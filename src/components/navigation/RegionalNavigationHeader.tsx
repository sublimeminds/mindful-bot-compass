
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { 
  Globe, 
  Users, 
  Brain, 
  Shield, 
  Briefcase, 
  GraduationCap,
  Menu,
  X
} from 'lucide-react';
import HeaderDropdownTrigger from './HeaderDropdownTrigger';
import HeaderDropdownCard from './HeaderDropdownCard';
import HeaderDropdownItem from './HeaderDropdownItem';
import Logo from './Logo';

const RegionalNavigationHeader = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const solutionsItems = [
    {
      icon: Users,
      title: "For Individuals",
      description: "Personal therapy and mental wellness support",
      href: "/for-individuals",
      gradient: "from-therapy-500 to-therapy-600",
      badge: "Popular"
    },
    {
      icon: Briefcase,
      title: "For Organizations",
      description: "Employee mental health and wellness programs",
      href: "/for-organizations",
      gradient: "from-harmony-500 to-harmony-600"
    },
    {
      icon: GraduationCap,
      title: "For Schools",
      description: "Student mental health support and resources",
      href: "/for-schools",
      gradient: "from-flow-500 to-flow-600"
    },
    {
      icon: Shield,
      title: "Crisis Management",
      description: "24/7 emergency mental health support",
      href: "/crisis-management",
      gradient: "from-red-500 to-red-600",
      badge: "24/7"
    }
  ];

  const resourcesItems = [
    {
      icon: Brain,
      title: "Mental Health Guide",
      description: "Comprehensive guide to mental wellness",
      href: "/resources/mental-health-guide",
      gradient: "from-therapy-500 to-calm-500"
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with others on similar journeys",
      href: "/community",
      gradient: "from-harmony-500 to-balance-500"
    }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="w-full max-w-7xl mx-auto flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
          {/* Solutions Dropdown */}
          <div className="relative group">
            <HeaderDropdownTrigger 
              icon={Users} 
              label="Solutions" 
              className="px-2 xl:px-3"
            />
            <HeaderDropdownCard width="lg" className="dropdown-left">
              <div className="grid grid-cols-2 gap-3">
                {solutionsItems.map((item) => (
                  <HeaderDropdownItem
                    key={item.title}
                    icon={item.icon}
                    title={item.title}
                    description={item.description}
                    href={item.href}
                    gradient={item.gradient}
                    badge={item.badge}
                  />
                ))}
              </div>
            </HeaderDropdownCard>
          </div>

          {/* Resources Dropdown */}
          <div className="relative group">
            <HeaderDropdownTrigger 
              icon={Brain} 
              label="Resources" 
              className="px-2 xl:px-3"
            />
            <HeaderDropdownCard width="md">
              <div className="space-y-2">
                {resourcesItems.map((item) => (
                  <HeaderDropdownItem
                    key={item.title}
                    icon={item.icon}
                    title={item.title}
                    description={item.description}
                    href={item.href}
                    gradient={item.gradient}
                  />
                ))}
              </div>
            </HeaderDropdownCard>
          </div>

          {/* About Link */}
          <Link 
            to="/about" 
            className="px-2 xl:px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
          >
            About
          </Link>

          {/* Pricing Link */}
          <Link 
            to="/pricing" 
            className="px-2 xl:px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
          >
            Pricing
          </Link>

          {/* Contact Link */}
          <Link 
            to="/contact" 
            className="px-2 xl:px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
          >
            Contact
          </Link>

          {/* Support Link */}
          <Link 
            to="/support" 
            className="px-2 xl:px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
          >
            Support
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="hidden sm:flex items-center space-x-2 lg:space-x-3">
          {user ? (
            <Button 
              onClick={() => navigate('/dashboard')} 
              size="sm"
              className="bg-gradient-to-r from-therapy-500 to-harmony-500 hover:from-therapy-600 hover:to-harmony-600 text-white px-3 lg:px-4"
            >
              Dashboard
            </Button>
          ) : (
            <>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/auth')} 
                size="sm"
                className="text-sm px-3 lg:px-4"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => navigate('/get-started')} 
                size="sm"
                className="bg-gradient-to-r from-therapy-500 to-harmony-500 hover:from-therapy-600 hover:to-harmony-600 text-white text-sm px-3 lg:px-4"
              >
                Get Started
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border/40 bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4 py-4 space-y-3">
            {/* Mobile Solutions */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground/80">Solutions</h3>
              {solutionsItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.href}
                  className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-therapy-50/80 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4 text-therapy-500" />
                  <span className="text-sm font-medium">{item.title}</span>
                </Link>
              ))}
            </div>

            {/* Mobile Resources */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground/80">Resources</h3>
              {resourcesItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.href}
                  className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-therapy-50/80 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4 text-therapy-500" />
                  <span className="text-sm font-medium">{item.title}</span>
                </Link>
              ))}
            </div>

            {/* Mobile Links */}
            <div className="space-y-1 pt-2 border-t border-border/40">
              <Link
                to="/about"
                className="block py-2 px-3 text-sm font-medium hover:bg-therapy-50/80 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/pricing"
                className="block py-2 px-3 text-sm font-medium hover:bg-therapy-50/80 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
            </div>

            {/* Mobile Auth Buttons */}
            <div className="flex flex-col space-y-2 pt-3 border-t border-border/40">
              {user ? (
                <Button 
                  onClick={() => {
                    navigate('/dashboard');
                    setIsMobileMenuOpen(false);
                  }} 
                  className="w-full bg-gradient-to-r from-therapy-500 to-harmony-500 hover:from-therapy-600 hover:to-harmony-600 text-white"
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      navigate('/auth');
                      setIsMobileMenuOpen(false);
                    }} 
                    className="w-full"
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => {
                      navigate('/get-started');
                      setIsMobileMenuOpen(false);
                    }} 
                    className="w-full bg-gradient-to-r from-therapy-500 to-harmony-500 hover:from-therapy-600 hover:to-harmony-600 text-white"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default RegionalNavigationHeader;
