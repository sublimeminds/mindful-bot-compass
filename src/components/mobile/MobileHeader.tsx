
import React, { useState } from 'react';
import { Menu, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Logo from '@/components/navigation/Logo';
import UserMenu from '@/components/navigation/UserMenu';
import { useApp } from '@/components/MinimalAppProvider';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const MobileHeader = () => {
  const { user, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { label: 'Dashboard', href: '/dashboard', icon: '🏠' },
    { label: 'Crisis Management', href: '/crisis-management', icon: '🛡️' },
    { label: 'Community', href: '/community', icon: '👥' },
    { label: 'Digital Notebook', href: '/notebook', icon: '📝' },
    { label: 'Smart Scheduling', href: '/smart-scheduling', icon: '📅' },
  ];

  const publicNavigationItems = [
    { label: 'Features', href: '#features', icon: '✨' },
    { label: 'Pricing', href: '#pricing', icon: '💳' },
    { label: 'Help', href: '/help', icon: '❓' },
  ];

  const items = user ? navigationItems : publicNavigationItems;

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    if (path.startsWith('#')) return false;
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(href);
    }
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4 max-w-full">
        <Logo />
        
        {/* Right side - User menu or login for desktop, menu button for mobile */}
        <div className="flex items-center space-x-2">
          {/* Show user menu or login button on larger screens */}
          <div className="hidden sm:flex items-center space-x-2">
            {user ? (
              <UserMenu />
            ) : (
              <Button 
                onClick={() => navigate('/auth')}
                size="sm"
                className="bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700 text-white"
              >
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2 sm:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 sm:w-80">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <Logo />
                  <Button
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsOpen(false)}
                    className="p-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 py-4">
                  <div className="space-y-1 px-4">
                    {items.map((item) => (
                      <button
                        key={item.href}
                        onClick={() => handleNavigation(item.href)}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors w-full text-left ${
                          isActive(item.href)
                            ? 'bg-therapy-100 text-therapy-700'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        <span className="text-base">{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </nav>

                {/* User Section */}
                <div className="border-t p-4">
                  {user ? (
                    <UserMenu />
                  ) : (
                    <Button 
                      onClick={() => {
                        navigate('/auth');
                        setIsOpen(false);
                      }}
                      className="w-full bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700 text-white"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Sign In
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
