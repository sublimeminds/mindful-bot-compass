import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Heart, Menu, X, User, Settings, LogOut, BarChart3, Target, Calendar, MessageSquare, Bell, ChevronDown, BookOpen, Brain, Shield, HelpCircle } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import NotificationCenter from "./NotificationCenter";
import ScrollProgressIndicator from "./ScrollProgressIndicator";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const publicNavItems = [
    { path: "#features", label: "Features", icon: Heart },
    { path: "#pricing", label: "Pricing", icon: Target },
    { path: "/auth", label: "Sign In", icon: User },
  ];

  const mainNavItems = [
    { path: "/", label: "Dashboard", icon: BarChart3 },
    { path: "/chat", label: "Therapy Chat", icon: MessageSquare },
    { path: "/mood", label: "Mood Tracking", icon: Heart },
    { path: "/goals", label: "Goals", icon: Target },
  ];

  const toolsMenuItems = [
    { path: "/analytics", label: "Analytics", icon: BarChart3 },
    { path: "/techniques", label: "Techniques", icon: Brain },
    { path: "/session-history", label: "Session History", icon: Calendar },
  ];

  const resourcesMenuItems = [
    { path: "/notifications", label: "Notification Analytics", icon: Bell },
    { path: "/notification-settings", label: "Notification Settings", icon: Settings },
    { path: "#", label: "Help Center", icon: HelpCircle },
    { path: "#", label: "Crisis Resources", icon: Shield },
    { path: "#", label: "Learning Hub", icon: BookOpen },
    { path: "#", label: "Community", icon: MessageSquare },
  ];

  const scrollToSection = (sectionId: string) => {
    if (sectionId.startsWith('#')) {
      const element = document.querySelector(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(sectionId);
    }
  };

  const publicSections = ['#features', '#pricing'];

  return (
    <>
      <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <button 
                onClick={() => navigate("/")}
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity group"
              >
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-therapy-500 to-calm-500 rounded-xl shadow-lg group-hover:shadow-therapy-500/20 transition-all duration-300">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-therapy-600 to-calm-500 bg-clip-text text-transparent">
                  MindfulAI
                </span>
              </button>
            </div>

            {/* Desktop Navigation - Show different nav based on auth state */}
            <nav className="hidden lg:flex items-center justify-center flex-1 mx-8">
              <div className="flex items-center space-x-1 bg-muted/50 rounded-full p-1">
                {isAuthenticated ? (
                  <>
                    {/* Authenticated Navigation */}
                    {mainNavItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;
                      return (
                        <Button
                          key={item.path}
                          variant={isActive ? "default" : "ghost"}
                          size="sm"
                          onClick={() => handleNavigation(item.path)}
                          className={`flex items-center space-x-2 rounded-full transition-all duration-200 ${
                            isActive 
                              ? "bg-gradient-to-r from-therapy-500 to-therapy-600 text-white shadow-md" 
                              : "hover:bg-background hover:shadow-sm"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="font-medium">{item.label}</span>
                        </Button>
                      );
                    })}

                    {/* Tools Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="flex items-center space-x-2 rounded-full hover:bg-background hover:shadow-sm transition-all duration-200"
                        >
                          <Brain className="h-4 w-4" />
                          <span className="font-medium">Tools</span>
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="center" className="w-52 bg-background border shadow-xl rounded-xl">
                        <DropdownMenuLabel className="font-semibold text-therapy-700">Therapy Tools</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {toolsMenuItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <DropdownMenuItem
                              key={item.path}
                              onClick={() => handleNavigation(item.path)}
                              className="cursor-pointer hover:bg-therapy-50 focus:bg-therapy-50 rounded-lg mx-1"
                            >
                              <Icon className="h-4 w-4 mr-3 text-therapy-500" />
                              <span className="font-medium">{item.label}</span>
                            </DropdownMenuItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Resources Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="flex items-center space-x-2 rounded-full hover:bg-background hover:shadow-sm transition-all duration-200"
                        >
                          <BookOpen className="h-4 w-4" />
                          <span className="font-medium">Resources</span>
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="center" className="w-56 bg-background border shadow-xl rounded-xl">
                        <DropdownMenuLabel className="font-semibold text-therapy-700">Support & Learning</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {resourcesMenuItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <DropdownMenuItem
                              key={item.label}
                              onClick={() => item.path !== "#" && handleNavigation(item.path)}
                              className="cursor-pointer hover:bg-therapy-50 focus:bg-therapy-50 rounded-lg mx-1"
                            >
                              <Icon className="h-4 w-4 mr-3 text-therapy-500" />
                              <span className="font-medium">{item.label}</span>
                            </DropdownMenuItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                ) : (
                  <>
                    {/* Public Navigation */}
                    {publicNavItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Button
                          key={item.path}
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (item.path.startsWith('#')) {
                              scrollToSection(item.path);
                            } else {
                              handleNavigation(item.path);
                            }
                          }}
                          className="flex items-center space-x-2 rounded-full hover:bg-background hover:shadow-sm transition-all duration-200"
                        >
                          <Icon className="h-4 w-4" />
                          <span className="font-medium">{item.label}</span>
                        </Button>
                      );
                    })}
                  </>
                )}
              </div>
            </nav>

            {/* Right side - User menu or Sign In */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              {isAuthenticated ? (
                <>
                  <NotificationCenter />
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="flex items-center space-x-2 hover:bg-muted rounded-full">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="text-xs bg-gradient-to-br from-therapy-500 to-calm-500 text-white">
                            {user?.email?.[0]?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="hidden sm:inline max-w-32 truncate font-medium">{user?.email}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-background border shadow-xl rounded-xl">
                      <DropdownMenuItem onClick={() => navigate("/profile")} className="hover:bg-therapy-50 focus:bg-therapy-50 rounded-lg mx-1">
                        <User className="h-4 w-4 mr-3 text-therapy-500" />
                        <span className="font-medium">Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/notification-settings")} className="hover:bg-therapy-50 focus:bg-therapy-50 rounded-lg mx-1">
                        <Settings className="h-4 w-4 mr-3 text-therapy-500" />
                        <span className="font-medium">Notification Settings</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout} className="text-red-600 hover:bg-red-50 focus:bg-red-50 rounded-lg mx-1">
                        <LogOut className="h-4 w-4 mr-3" />
                        <span className="font-medium">Sign Out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button 
                  onClick={() => navigate("/auth")} 
                  size="sm"
                  className="bg-gradient-to-r from-therapy-500 to-therapy-600 hover:from-therapy-600 hover:to-therapy-700 text-white font-medium rounded-full px-6 shadow-lg hover:shadow-therapy-500/25 transition-all duration-300"
                >
                  Sign In
                </Button>
              )}

              {/* Mobile menu trigger */}
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="sm" className="rounded-full">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72 bg-background">
                  <div className="flex flex-col space-y-6 mt-6">
                    {isAuthenticated ? (
                      <>
                        <div className="space-y-3">
                          <h3 className="font-semibold text-sm text-therapy-600 uppercase tracking-wide">Main Navigation</h3>
                          {mainNavItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                              <Button
                                key={item.path}
                                variant={isActive ? "default" : "ghost"}
                                className={`justify-start w-full rounded-xl ${
                                  isActive ? "bg-gradient-to-r from-therapy-500 to-therapy-600 text-white" : ""
                                }`}
                                onClick={() => handleNavigation(item.path)}
                              >
                                <Icon className="h-4 w-4 mr-3" />
                                <span className="font-medium">{item.label}</span>
                              </Button>
                            );
                          })}
                        </div>

                        <div className="space-y-3">
                          <h3 className="font-semibold text-sm text-therapy-600 uppercase tracking-wide">Therapy Tools</h3>
                          {toolsMenuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                              <Button
                                key={item.path}
                                variant={isActive ? "default" : "ghost"}
                                className={`justify-start w-full rounded-xl ${
                                  isActive ? "bg-gradient-to-r from-therapy-500 to-therapy-600 text-white" : ""
                                }`}
                                onClick={() => handleNavigation(item.path)}
                              >
                                <Icon className="h-4 w-4 mr-3" />
                                <span className="font-medium">{item.label}</span>
                              </Button>
                            );
                          })}
                        </div>

                        <div className="space-y-3">
                          <h3 className="font-semibold text-sm text-therapy-600 uppercase tracking-wide">Support & Resources</h3>
                          {resourcesMenuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Button
                                key={item.label}
                                variant="ghost"
                                className="justify-start w-full rounded-xl"
                                onClick={() => item.path !== "#" && handleNavigation(item.path)}
                              >
                                <Icon className="h-4 w-4 mr-3" />
                                <span className="font-medium">{item.label}</span>
                              </Button>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <div className="space-y-3">
                        <h3 className="font-semibold text-sm text-therapy-600 uppercase tracking-wide">Navigation</h3>
                        {publicNavItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Button
                              key={item.path}
                              variant="ghost"
                              className="justify-start w-full rounded-xl"
                              onClick={() => {
                                if (item.path.startsWith('#')) {
                                  setIsMenuOpen(false);
                                  scrollToSection(item.path);
                                } else {
                                  handleNavigation(item.path);
                                }
                              }}
                            >
                              <Icon className="h-4 w-4 mr-3" />
                              <span className="font-medium">{item.label}</span>
                            </Button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
      
      {/* Add scroll progress indicator */}
      <ScrollProgressIndicator 
        sections={publicSections} 
        isAuthenticated={isAuthenticated} 
      />
    </>
  );
};

export default Header;
