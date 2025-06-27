
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
import { 
  Menu, 
  X, 
  Brain, 
  Cpu, 
  Target, 
  HelpCircle, 
  CreditCard, 
  Download, 
  Shield, 
  Users, 
  Mail, 
  FileText, 
  Scale
} from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const { user, loading } = useSimpleApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <header className="bg-gradient-to-r from-therapy-500 via-therapy-600 to-calm-600 backdrop-blur-md border-b border-white/20 sticky top-0 z-50 shadow-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo />
            <div className="animate-pulse h-8 w-20 bg-white/20 rounded"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-gradient-to-r from-therapy-500 via-therapy-600 to-calm-600 backdrop-blur-md border-b border-white/20 sticky top-0 z-50 shadow-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Logo />
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                {/* Platform Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-white/90 hover:text-white bg-transparent hover:bg-white/10 transition-all duration-300 font-medium">
                    Platform
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[500px] grid-cols-2 bg-gradient-to-br from-white via-therapy-50/80 to-calm-50/80 backdrop-blur-sm border border-white/20 shadow-2xl rounded-xl">
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold bg-gradient-to-r from-therapy-700 to-calm-700 bg-clip-text text-transparent">Core Features</h4>
                        <NavigationMenuLink asChild>
                          <button 
                            onClick={() => navigate('/features')}
                            className="flex items-center space-x-3 w-full text-left select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-gradient-to-r hover:from-therapy-100/80 hover:to-calm-100/80 hover:shadow-lg group"
                          >
                            <div className="w-10 h-10 bg-gradient-to-r from-therapy-500 to-calm-500 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                              <Target className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium leading-none bg-gradient-to-r from-therapy-800 to-calm-800 bg-clip-text text-transparent">All Features</div>
                              <p className="line-clamp-2 text-sm leading-snug text-gray-600 mt-1">
                                Comprehensive platform overview
                              </p>
                            </div>
                          </button>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <button 
                            onClick={() => navigate('/therapy-chat')}
                            className="flex items-center space-x-3 w-full text-left select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-gradient-to-r hover:from-therapy-100/80 hover:to-calm-100/80 hover:shadow-lg group"
                          >
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                              <Brain className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium leading-none bg-gradient-to-r from-therapy-800 to-calm-800 bg-clip-text text-transparent">TherapySync AI</div>
                              <p className="line-clamp-2 text-sm leading-snug text-gray-600 mt-1">
                                AI-powered therapy sessions
                              </p>
                            </div>
                          </button>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <button 
                            onClick={() => navigate('/voice-technology')}
                            className="flex items-center space-x-3 w-full text-left select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-gradient-to-r hover:from-therapy-100/80 hover:to-calm-100/80 hover:shadow-lg group"
                          >
                            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                              <Cpu className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium leading-none bg-gradient-to-r from-therapy-800 to-calm-800 bg-clip-text text-transparent">Voice Technology</div>
                              <p className="line-clamp-2 text-sm leading-snug text-gray-600 mt-1">
                                Advanced voice interactions
                              </p>
                            </div>
                          </button>
                        </NavigationMenuLink>
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold bg-gradient-to-r from-therapy-700 to-calm-700 bg-clip-text text-transparent">Get Started</h4>
                        <NavigationMenuLink asChild>
                          <button 
                            onClick={() => navigate('/how-it-works')}
                            className="flex items-center space-x-3 w-full text-left select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-gradient-to-r hover:from-therapy-100/80 hover:to-calm-100/80 hover:shadow-lg group"
                          >
                            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                              <HelpCircle className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium leading-none bg-gradient-to-r from-therapy-800 to-calm-800 bg-clip-text text-transparent">How It Works</div>
                              <p className="line-clamp-2 text-sm leading-snug text-gray-600 mt-1">
                                Step-by-step guide
                              </p>
                            </div>
                          </button>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <button 
                            onClick={() => navigate('/plans')}
                            className="flex items-center space-x-3 w-full text-left select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-gradient-to-r hover:from-therapy-100/80 hover:to-calm-100/80 hover:shadow-lg group"
                          >
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                              <CreditCard className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium leading-none bg-gradient-to-r from-therapy-800 to-calm-800 bg-clip-text text-transparent">Pricing</div>
                              <p className="line-clamp-2 text-sm leading-snug text-gray-600 mt-1">
                                Plans and pricing options
                              </p>
                            </div>
                          </button>
                        </NavigationMenuLink>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Resources Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-white/90 hover:text-white bg-transparent hover:bg-white/10 transition-all duration-300 font-medium">
                    Resources
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[400px] grid-cols-1 bg-gradient-to-br from-white via-therapy-50/80 to-calm-50/80 backdrop-blur-sm border border-white/20 shadow-2xl rounded-xl">
                      <NavigationMenuLink asChild>
                        <button 
                          onClick={() => navigate('/help')}
                          className="flex items-center space-x-3 w-full text-left select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-gradient-to-r hover:from-therapy-100/80 hover:to-calm-100/80 hover:shadow-lg group"
                        >
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                            <HelpCircle className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium leading-none bg-gradient-to-r from-therapy-800 to-calm-800 bg-clip-text text-transparent">Help Center</div>
                            <p className="line-clamp-2 text-sm leading-snug text-gray-600 mt-1">
                              Get support and answers
                            </p>
                          </div>
                        </button>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <button 
                          onClick={() => navigate('/downloads')}
                          className="flex items-center space-x-3 w-full text-left select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-gradient-to-r hover:from-therapy-100/80 hover:to-calm-100/80 hover:shadow-lg group"
                        >
                          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                            <Download className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium leading-none bg-gradient-to-r from-therapy-800 to-calm-800 bg-clip-text text-transparent">Downloads</div>
                            <p className="line-clamp-2 text-sm leading-snug text-gray-600 mt-1">
                              Desktop and mobile apps
                            </p>
                          </div>
                        </button>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <button 
                          onClick={() => navigate('/crisis-resources')}
                          className="flex items-center space-x-3 w-full text-left select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-gradient-to-r hover:from-therapy-100/80 hover:to-calm-100/80 hover:shadow-lg group"
                        >
                          <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                            <Shield className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium leading-none bg-gradient-to-r from-therapy-800 to-calm-800 bg-clip-text text-transparent">Crisis Resources</div>
                            <p className="line-clamp-2 text-sm leading-snug text-gray-600 mt-1">
                              Emergency support and hotlines
                            </p>
                          </div>
                        </button>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <button 
                          onClick={() => navigate('/community')}
                          className="flex items-center space-x-3 w-full text-left select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-gradient-to-r hover:from-therapy-100/80 hover:to-calm-100/80 hover:shadow-lg group"
                        >
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                            <Users className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium leading-none bg-gradient-to-r from-therapy-800 to-calm-800 bg-clip-text text-transparent">Community</div>
                            <p className="line-clamp-2 text-sm leading-snug text-gray-600 mt-1">
                              Connect with others
                            </p>
                          </div>
                        </button>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Company Menu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-white/90 hover:text-white bg-transparent hover:bg-white/10 transition-all duration-300 font-medium">
                    Company
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[300px] grid-cols-1 bg-gradient-to-br from-white via-therapy-50/80 to-calm-50/80 backdrop-blur-sm border border-white/20 shadow-2xl rounded-xl">
                      <NavigationMenuLink asChild>
                        <button 
                          onClick={() => navigate('/contact')}
                          className="flex items-center space-x-3 w-full text-left select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-gradient-to-r hover:from-therapy-100/80 hover:to-calm-100/80 hover:shadow-lg group"
                        >
                          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                            <Mail className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium leading-none bg-gradient-to-r from-therapy-800 to-calm-800 bg-clip-text text-transparent">Contact</div>
                            <p className="line-clamp-2 text-sm leading-snug text-gray-600 mt-1">
                              Get in touch with us
                            </p>
                          </div>
                        </button>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <button 
                          onClick={() => navigate('/privacy')}
                          className="flex items-center space-x-3 w-full text-left select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-gradient-to-r hover:from-therapy-100/80 hover:to-calm-100/80 hover:shadow-lg group"
                        >
                          <div className="w-10 h-10 bg-gradient-to-r from-gray-500 to-slate-500 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                            <FileText className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium leading-none bg-gradient-to-r from-therapy-800 to-calm-800 bg-clip-text text-transparent">Privacy Policy</div>
                          </div>
                        </button>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <button 
                          onClick={() => navigate('/terms')}
                          className="flex items-center space-x-3 w-full text-left select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-gradient-to-r hover:from-therapy-100/80 hover:to-calm-100/80 hover:shadow-lg group"
                        >
                          <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                            <Scale className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium leading-none bg-gradient-to-r from-therapy-800 to-calm-800 bg-clip-text text-transparent">Terms of Service</div>
                          </div>
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
              className="text-white hover:bg-white/10 transition-all duration-300"
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
                  className="text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300 font-medium"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => navigate('/auth')}
                  className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/30 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-white/20 backdrop-blur-md bg-white/10 rounded-lg mx-4">
            <div className="flex flex-col space-y-2 pt-4">
              <Button variant="ghost" onClick={() => navigate('/features')} className="justify-start text-white/90 hover:text-white hover:bg-white/10">
                <Target className="h-4 w-4 mr-2" />
                Features
              </Button>
              <Button variant="ghost" onClick={() => navigate('/therapy-chat')} className="justify-start text-white/90 hover:text-white hover:bg-white/10">
                <Brain className="h-4 w-4 mr-2" />
                TherapySync AI
              </Button>
              <Button variant="ghost" onClick={() => navigate('/how-it-works')} className="justify-start text-white/90 hover:text-white hover:bg-white/10">
                <HelpCircle className="h-4 w-4 mr-2" />
                How It Works
              </Button>
              <Button variant="ghost" onClick={() => navigate('/plans')} className="justify-start text-white/90 hover:text-white hover:bg-white/10">
                <CreditCard className="h-4 w-4 mr-2" />
                Pricing
              </Button>
              <Button variant="ghost" onClick={() => navigate('/downloads')} className="justify-start text-white/90 hover:text-white hover:bg-white/10">
                <Download className="h-4 w-4 mr-2" />
                Downloads
              </Button>
              <Button variant="ghost" onClick={() => navigate('/help')} className="justify-start text-white/90 hover:text-white hover:bg-white/10">
                <HelpCircle className="h-4 w-4 mr-2" />
                Help
              </Button>
              <Button variant="ghost" onClick={() => navigate('/contact')} className="justify-start text-white/90 hover:text-white hover:bg-white/10">
                <Mail className="h-4 w-4 mr-2" />
                Contact
              </Button>
              
              {!user && (
                <div className="flex flex-col space-y-2 pt-4 border-t border-white/20">
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate('/auth')}
                    className="justify-start text-white/90 hover:text-white hover:bg-white/10"
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => navigate('/auth')}
                    className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/30 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
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
