
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, BarChart3, MessageSquare, Heart, Target, Brain, BookOpen, User, Bell, Settings, HelpCircle, Shield, Calendar, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface MobileMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  isAuthenticated: boolean;
  activeSection: string;
  scrollToSection: (sectionId: string) => void;
}

const MobileMenu = ({ isMenuOpen, setIsMenuOpen, isAuthenticated, activeSection, scrollToSection }: MobileMenuProps) => {
  const navigate = useNavigate();
  const location = useLocation();

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
    { path: "/smart-triggers", label: "Smart Triggers", icon: Zap },
  ];

  const resourcesMenuItems = [
    { path: "/notifications", label: "Notification Analytics", icon: Bell },
    { path: "/notification-settings", label: "Notification Settings", icon: Settings },
    { path: "#", label: "Help Center", icon: HelpCircle },
    { path: "#", label: "Crisis Resources", icon: Shield },
    { path: "#", label: "Learning Hub", icon: BookOpen },
    { path: "#", label: "Community", icon: MessageSquare },
  ];

  return (
    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <SheetTrigger asChild className="lg:hidden">
        <Button variant="ghost" size="sm" className="rounded-full hover:bg-muted/50 transition-all duration-300">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72 bg-background/95 backdrop-blur-xl border-l border-border/30">
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
                const isActive = item.path.startsWith('#') ? activeSection === item.path : location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "default" : "ghost"}
                    className={`justify-start w-full rounded-xl ${
                      isActive ? "bg-gradient-to-r from-therapy-500 to-therapy-600 text-white" : ""
                    }`}
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
  );
};

export default MobileMenu;
