
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Heart, Menu, X, User, Settings, LogOut, BarChart3, Target, Calendar, MessageSquare, Bell, ChevronDown, BookOpen, Brain, Shield, HelpCircle } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import NotificationCenter from "./NotificationCenter";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

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
    { path: "#", label: "Help Center", icon: HelpCircle },
    { path: "#", label: "Crisis Resources", icon: Shield },
    { path: "#", label: "Learning Hub", icon: BookOpen },
    { path: "#", label: "Community", icon: MessageSquare },
  ];

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - matching footer */}
          <div className="flex items-center flex-shrink-0">
            <button 
              onClick={() => navigate("/")}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-therapy-500 to-calm-500 rounded-xl">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-therapy-400 to-calm-400 bg-clip-text text-transparent">
                MindfulAI
              </span>
            </button>
          </div>

          {/* Desktop Navigation - Centered */}
          {isAuthenticated && (
            <nav className="hidden lg:flex items-center justify-center flex-1 mx-8">
              <div className="flex items-center space-x-1">
                {/* Main Navigation Items */}
                {mainNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Button
                      key={item.path}
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      onClick={() => handleNavigation(item.path)}
                      className={`flex items-center space-x-1 ${isActive ? "bg-therapy-100 text-therapy-800" : ""}`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Button>
                  );
                })}

                {/* Tools Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                      <BarChart3 className="h-4 w-4" />
                      <span>Tools</span>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-48 bg-background border shadow-lg">
                    <DropdownMenuLabel>Therapy Tools</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {toolsMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <DropdownMenuItem
                          key={item.path}
                          onClick={() => handleNavigation(item.path)}
                          className="cursor-pointer"
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {item.label}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Resources Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                      <BookOpen className="h-4 w-4" />
                      <span>Resources</span>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-48 bg-background border shadow-lg">
                    <DropdownMenuLabel>Support & Learning</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {resourcesMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <DropdownMenuItem
                          key={item.label}
                          onClick={() => item.path !== "#" && handleNavigation(item.path)}
                          className="cursor-pointer"
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {item.label}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </nav>
          )}

          {/* Right side - User menu */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            {isAuthenticated ? (
              <>
                <NotificationCenter />
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {user?.email?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:inline max-w-32 truncate">{user?.email}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-background border shadow-lg">
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/notification-settings")}>
                      <Settings className="h-4 w-4 mr-2" />
                      Notification Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-600">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile menu trigger */}
                <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                  <SheetTrigger asChild className="lg:hidden">
                    <Button variant="ghost" size="sm">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-72 bg-background">
                    <div className="flex flex-col space-y-4 mt-6">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Main</h3>
                        {mainNavItems.map((item) => {
                          const Icon = item.icon;
                          const isActive = location.pathname === item.path;
                          return (
                            <Button
                              key={item.path}
                              variant={isActive ? "default" : "ghost"}
                              className="justify-start w-full"
                              onClick={() => handleNavigation(item.path)}
                            >
                              <Icon className="h-4 w-4 mr-2" />
                              {item.label}
                            </Button>
                          );
                        })}
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Tools</h3>
                        {toolsMenuItems.map((item) => {
                          const Icon = item.icon;
                          const isActive = location.pathname === item.path;
                          return (
                            <Button
                              key={item.path}
                              variant={isActive ? "default" : "ghost"}
                              className="justify-start w-full"
                              onClick={() => handleNavigation(item.path)}
                            >
                              <Icon className="h-4 w-4 mr-2" />
                              {item.label}
                            </Button>
                          );
                        })}
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Resources</h3>
                        {resourcesMenuItems.map((item) => {
                          const Icon = item.icon;
                          return (
                            <Button
                              key={item.label}
                              variant="ghost"
                              className="justify-start w-full"
                              onClick={() => item.path !== "#" && handleNavigation(item.path)}
                            >
                              <Icon className="h-4 w-4 mr-2" />
                              {item.label}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </>
            ) : (
              <Button 
                onClick={() => navigate("/auth")} 
                size="sm"
                className="bg-gradient-to-r from-therapy-600 to-therapy-800 hover:from-therapy-700 hover:to-therapy-900 text-white"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
