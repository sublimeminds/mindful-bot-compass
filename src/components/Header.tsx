
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Heart, Menu, X, User, Settings, LogOut, BarChart3, Target, Calendar, MessageSquare, Bell } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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

  const navItems = [
    { path: "/", label: "Dashboard", icon: BarChart3 },
    { path: "/chat", label: "Therapy Chat", icon: MessageSquare },
    { path: "/mood", label: "Mood Tracking", icon: Heart },
    { path: "/goals", label: "Goals", icon: Target },
    { path: "/analytics", label: "Analytics", icon: BarChart3 },
    { path: "/techniques", label: "Techniques", icon: Heart },
    { path: "/session-history", label: "Sessions", icon: Calendar },
    { path: "/notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <button 
              onClick={() => navigate("/")}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <Heart className="h-8 w-8 text-therapy-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-therapy-600 to-therapy-800 bg-clip-text text-transparent">
                Mindful Bot Compass
              </span>
            </button>
          </div>

          {/* Desktop Navigation - Centered */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center justify-center flex-1 mx-8">
              <div className="flex items-center space-x-1">
                {navItems.map((item) => {
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
                      <span className="hidden lg:inline">{item.label}</span>
                    </Button>
                  );
                })}
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
                  <DropdownMenuContent align="end" className="w-56">
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
                  <SheetTrigger asChild className="md:hidden">
                    <Button variant="ghost" size="sm">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-72">
                    <div className="flex flex-col space-y-4 mt-6">
                      {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                          <Button
                            key={item.path}
                            variant={isActive ? "default" : "ghost"}
                            className="justify-start"
                            onClick={() => handleNavigation(item.path)}
                          >
                            <Icon className="h-4 w-4 mr-2" />
                            {item.label}
                          </Button>
                        );
                      })}
                    </div>
                  </SheetContent>
                </Sheet>
              </>
            ) : (
              <Button onClick={() => navigate("/auth")} size="sm">
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
