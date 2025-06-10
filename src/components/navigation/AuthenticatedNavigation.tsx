
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, MessageSquare, Heart, Target, Brain, BookOpen, ChevronDown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel } from '@/components/ui/dropdown-menu';

const AuthenticatedNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const mainNavItems = [
    { path: "/", label: "Dashboard", icon: BarChart3 },
    { path: "/chat", label: "Therapy Chat", icon: MessageSquare },
    { path: "/mood", label: "Mood Tracking", icon: Heart },
    { path: "/goals", label: "Goals", icon: Target },
  ];

  const toolsMenuItems = [
    { path: "/analytics", label: "Analytics", icon: BarChart3 },
    { path: "/techniques", label: "Techniques", icon: Brain },
    { path: "/session-history", label: "Session History", icon: Brain },
    { path: "/smart-triggers", label: "Smart Triggers", icon: Zap },
  ];

  const resourcesMenuItems = [
    { path: "/notifications", label: "Notification Analytics", icon: Brain },
    { path: "/notification-settings", label: "Notification Settings", icon: Brain },
    { path: "#", label: "Help Center", icon: Brain },
    { path: "#", label: "Crisis Resources", icon: Brain },
    { path: "#", label: "Learning Hub", icon: BookOpen },
    { path: "#", label: "Community", icon: MessageSquare },
  ];

  const handleNavigation = (path: string) => {
    if (path !== "#") {
      navigate(path);
    }
  };

  return (
    <div className="flex items-center space-x-2 bg-muted/40 backdrop-blur-sm rounded-full p-1.5 border border-border/40 shadow-sm">
      {mainNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <Button
            key={item.path}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            onClick={() => handleNavigation(item.path)}
            className={`flex items-center space-x-2 rounded-full transition-all duration-300 font-medium ${
              isActive 
                ? "bg-gradient-to-r from-therapy-500 to-therapy-600 text-white shadow-lg shadow-therapy-500/25 scale-105" 
                : "hover:bg-background/80 hover:shadow-sm hover:scale-105 text-foreground/80 hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Button>
        );
      })}

      {/* Tools Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center space-x-2 rounded-full hover:bg-background/80 hover:shadow-sm hover:scale-105 transition-all duration-300 font-medium text-foreground/80 hover:text-foreground"
          >
            <Brain className="h-4 w-4" />
            <span>Tools</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-52 bg-background/95 backdrop-blur-xl border border-border/30 shadow-xl rounded-xl">
          <DropdownMenuLabel className="font-semibold text-therapy-700">Therapy Tools</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {toolsMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <DropdownMenuItem
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className="cursor-pointer hover:bg-therapy-50 focus:bg-therapy-50 rounded-lg mx-1 transition-colors"
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
            className="flex items-center space-x-2 rounded-full hover:bg-background/80 hover:shadow-sm hover:scale-105 transition-all duration-300 font-medium text-foreground/80 hover:text-foreground"
          >
            <BookOpen className="h-4 w-4" />
            <span>Resources</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-56 bg-background/95 backdrop-blur-xl border border-border/30 shadow-xl rounded-xl">
          <DropdownMenuLabel className="font-semibold text-therapy-700">Support & Learning</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {resourcesMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <DropdownMenuItem
                key={item.label}
                onClick={() => handleNavigation(item.path)}
                className="cursor-pointer hover:bg-therapy-50 focus:bg-therapy-50 rounded-lg mx-1 transition-colors"
              >
                <Icon className="h-4 w-4 mr-3 text-therapy-500" />
                <span className="font-medium">{item.label}</span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AuthenticatedNavigation;
