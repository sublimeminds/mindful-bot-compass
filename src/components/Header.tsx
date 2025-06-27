
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/navigation/Logo';
import UserMenu from '@/components/navigation/UserMenu';
import { useSimpleApp } from '@/hooks/useSimpleApp';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Header = () => {
  const navigate = useNavigate();
  const { user, loading } = useSimpleApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSmoothScroll = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  if (loading) {
    return (
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo />
            <div className="animate-pulse h-8 w-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Logo />
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                {/* Platform Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-600 hover:text-therapy-600">
                    Platform
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[500px] grid-cols-2">
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-therapy-900">Core Features</h4>
                        <NavigationMenuLink asChild>
                          <button 
                            onClick={() => navigate('/features')}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-left w-full"
                          >
                            <div className="text-sm font-medium leading-none">All Features</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Comprehensive platform overview
                            </p>
                          </button>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <button 
                            onClick={() => navigate('/therapy-chat')}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-left w-full"
                          >
                            <div className="text-sm font-medium leading-none">TherapySync AI</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              AI-powered therapy sessions
                            </p>
                          </button>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <button 
                            onClick={() => navigate('/voice-technology')}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-left w-full"
                          >
                            <div className="text-sm font-medium leading-none">Voice Technology</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Advanced voice interactions
                            </p>
                          </button>
                        </NavigationMenuLink>
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-therapy-900">Get Started</h4>
                        <NavigationMenuLink asChild>
                          <button 
                            onClick={() => navigate('/how-it-works')}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-left w-full"
                          >
                            <div className="text-sm font-medium leading-none">How It Works</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Step-by-step guide
                            </p>
                          </button>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <button 
                            onClick={() => navigate('/plans')}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-left w-full"
                          >
                            <div className="text-sm font-medium leading-none">Pricing</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Plans and pricing options
                            </p>
                          </button>
                        </NavigationMenuLink>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Resources Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-600 hover:text-therapy-600">
                    Resources
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[400px] grid-cols-1">
                      <NavigationMenuLink asChild>
                        <button 
                          onClick={() => navigate('/help')}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-left w-full"
                        >
                          <div className="text-sm font-medium leading-none">Help Center</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Get support and answers
                          </p>
                        </button>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <button 
                          onClick={() => navigate('/downloads')}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-left w-full"
                        >
                          <div className="text-sm font-medium leading-none">Downloads</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Desktop and mobile apps
                          </p>
                        </button>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <button 
                          onClick={() => navigate('/crisis-resources')}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-left w-full"
                        >
                          <div className="text-sm font-medium leading-none">Crisis Resources</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Emergency support and hotlines
                          </p>
                        </button>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <button 
                          onClick={() => navigate('/community')}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-left w-full"
                        >
                          <div className="text-sm font-medium leading-none">Community</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Connect with others
                          </p>
                        </button>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Company Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-600 hover:text-therapy-600">
                    Company
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[300px] grid-cols-1">
                      <NavigationMenuLink asChild>
                        <button 
                          onClick={() => navigate('/contact')}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-left w-full"
                        >
                          <div className="text-sm font-medium leading-none">Contact</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Get in touch with us
                          </p>
                        </button>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <button 
                          onClick={() => navigate('/privacy')}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-left w-full"
                        >
                          <div className="text-sm font-medium leading-none">Privacy Policy</div>
                        </button>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <button 
                          onClick={() => navigate('/terms')}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-left w-full"
                        >
                          <div className="text-sm font-medium leading-none">Terms of Service</div>
                        </button>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
          
          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <UserMenu />
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/auth')}
                  className="text-therapy-700 hover:text-therapy-800"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => navigate('/auth')}
                  className="bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700 text-white"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4 pt-4">
              <Button variant="ghost" onClick={() => navigate('/features')} className="justify-start">
                Features
              </Button>
              <Button variant="ghost" onClick={() => navigate('/therapy-chat')} className="justify-start">
                TherapySync AI
              </Button>
              <Button variant="ghost" onClick={() => navigate('/how-it-works')} className="justify-start">
                How It Works
              </Button>
              <Button variant="ghost" onClick={() => navigate('/plans')} className="justify-start">
                Pricing
              </Button>
              <Button variant="ghost" onClick={() => navigate('/downloads')} className="justify-start">
                Downloads
              </Button>
              <Button variant="ghost" onClick={() => navigate('/help')} className="justify-start">
                Help
              </Button>
              <Button variant="ghost" onClick={() => navigate('/contact')} className="justify-start">
                Contact
              </Button>
              
              {!user && (
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate('/auth')}
                    className="justify-start"
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => navigate('/auth')}
                    className="bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700 text-white"
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
