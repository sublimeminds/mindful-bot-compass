
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, MessageSquare, Heart, Target, Brain, BookOpen, ChevronDown, Zap, Settings, Calendar, TrendingUp, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel } from '@/components/ui/dropdown-menu';

const AuthenticatedNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const mainNavItems = [
    { path: "/", label: "Dashboard", icon: BarChart3 },
    { path: "/chat", label: "Therapy", icon: MessageSquare },
  ];

  const therapyMenuItems = [
    { path: "/chat", label: "Start New Session", icon: MessageSquare },
    { path: "/session-history", label: "Session History", icon: Calendar },
    { path: "/therapist-matching", label: "Change Therapist", icon: Brain },
    { path: "/techniques", label: "Technique Library", icon: Brain },
  ];

  const progressMenuItems = [
    { path: "/analytics", label: "Analytics Dashboard", icon: BarChart3 },
    { path: "/mood-tracker", label: "Mood Tracking", icon: Heart },
    { path: "/goals", label: "Goal Management", icon: Target },
    { path: "/notifications", label: "Progress Reports", icon: TrendingUp },
  ];

  const toolsMenuItems = [
    { path: "/smart-triggers", label: "Smart Triggers", icon: Zap },
    { path: "/notifications", label: "Notification Center", icon: Bell },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  const resourcesMenuItems = [
    { path: "/techniques", label: "Coping Techniques", icon: Brain },
    { path: "/notification-analytics", label: "Learning Hub", icon: BookOpen },
    { path: "#", label: "Crisis Resources", icon: Heart },
    { path: "#", label: "Help Center", icon: BookOpen },
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

      {/* Therapy Hub Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center space-x-2 rounded-full hover:bg-background/80 hover:shadow-sm hover:scale-105 transition-all duration-300 font-medium text-foreground/80 hover:text-foreground"
          >
            <Brain className="h-4 w-4" />
            <span>Therapy Hub</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-56 bg-background/95 backdrop-blur-xl border border-border/30 shadow-xl rounded-xl">
          <DropdownMenuLabel className="font-semibold text-therapy-700">Therapy Sessions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {therapyMenuItems.map((item) => {
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

      {/* Progress Center Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center space-x-2 rounded-full hover:bg-background/80 hover:shadow-sm hover:scale-105 transition-all duration-300 font-medium text-foreground/80 hover:text-foreground"
          >
            <TrendingUp className="h-4 w-4" />
            <span>Progress</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-56 bg-background/95 backdrop-blur-xl border border-border/30 shadow-xl rounded-xl">
          <DropdownMenuLabel className="font-semibold text-therapy-700">Track Your Progress</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {progressMenuItems.map((item) => {
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

      {/* Tools Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center space-x-2 rounded-full hover:bg-background/80 hover:shadow-sm hover:scale-105 transition-all duration-300 font-medium text-foreground/80 hover:text-foreground"
          >
            <Zap className="h-4 w-4" />
            <span>Tools</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-52 bg-background/95 backdrop-blur-xl border border-border/30 shadow-xl rounded-xl">
          <DropdownMenuLabel className="font-semibold text-therapy-700">Smart Tools</DropdownMenuLabel>
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
