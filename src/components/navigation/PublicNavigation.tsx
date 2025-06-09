
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Heart, Target, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PublicNavigationProps {
  activeSection: string;
  scrollToSection: (sectionId: string) => void;
}

const PublicNavigation = ({ activeSection, scrollToSection }: PublicNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const publicNavItems = [
    { path: "#features", label: "Features", icon: Heart },
    { path: "#pricing", label: "Pricing", icon: Target },
    { path: "/auth", label: "Sign In", icon: User },
  ];

  const handleNavigation = (item: typeof publicNavItems[0]) => {
    if (item.path.startsWith('#')) {
      scrollToSection(item.path);
    } else {
      navigate(item.path);
    }
  };

  return (
    <div className="flex items-center space-x-2 bg-muted/40 backdrop-blur-sm rounded-full p-1.5 border border-border/40 shadow-sm">
      {publicNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.path.startsWith('#') ? activeSection === item.path : location.pathname === item.path;
        return (
          <Button
            key={item.path}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            onClick={() => handleNavigation(item)}
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
    </div>
  );
};

export default PublicNavigation;
